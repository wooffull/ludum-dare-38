"use strict";

var $             = wfl.jquery;
var geom = wfl.geom;
var Scene = wfl.display.Scene;
var map = require('../map');
var Assets = require('../util/Assets.js');
var entities = require('../entities');

var Conditions = require('../Conditions.js');

var GameScene = function (canvas, PIXI) {
  Scene.call(this, canvas, PIXI);
  
  this.map = null;
  this.touchEventBounds = [];
  this.autoEventBounds = [];
  this.voidTiles = [];
  this.holeCovers = [];
  
  this.PIXI = PIXI;
  
  this.blackBox = new PIXI.Sprite.fromImage(Assets.BLACK_BOX);
};

Object.defineProperties(GameScene, {
  /*
  MY_CONST: {
    value: {
      foo: 0,
      bar: 1
    }
  }
  */
  FRICTION: {
    value: 0.9
  },
  
  FADE_RATE: {
    value: 0.002
  },
  
  PropertyTag: {
    value: {
      COLLISION: "collision",
      AUTO: "auto",
      TILE_CLAIM: "tileClaim"
    }
  }
});

GameScene.prototype = Object.freeze(Object.create(Scene.prototype, {
  update : {
    value : function (dt) {
      this._removeRetiredGameObjects();
      this._applyFriction();
      this._handleInput();
      
      Scene.prototype.update.call(this, dt);
      
      this.checkAutoEvents();
      this._handleConditions();
    }
  },
  
  /**
   * (Adapted from wfl.Scene.js) Draws the scene and all game objects in it
   */
  draw : {
    value : function (renderer) {
      // Clear all children then add only the ones that can be seen
      this._stage.children.length = 0;
      this._lastDrawnGameObjects  = this._findSurroundingGameObjects(this.camera, 2).sort(
        (a, b) => {
          // Sort objects on the same layer by their bottom Y-coordinate
          if (a.layer === b.layer) {
            return (a.transform.position._y + a.calculationCache.height * 0.5)
                 - (b.transform.position._y + b.calculationCache.height * 0.5)
          
          // Otherwise, sort them by layer
          } else {
            return a.layer - b.layer;
          }
        }
      );
      
      // This seems to perform faster than using filter()
      for (let obj of this._lastDrawnGameObjects) {
        if (this.canSee(obj)) {
          // Optimization for addChild
          obj.parent = this._stage;
          obj.transform._parentId = -1;
          this._stage._boundsID++;
          this._stage.children.push(obj);
        }
      }
      
      if (this.blackBox.alpha > 0) {
        this.blackBox.width = window.innerWidth;
        this.blackBox.height = window.innerHeight;
        this.blackBox.x = this.camera.position.x - window.innerWidth * 0.5;
        this.blackBox.y = this.camera.position.y - window.innerHeight * 0.5;
        this._stage.addChild(this.blackBox);
      }
    }
  },
  
  setMap: {
    value: function (key) {
      this.map = key;
    }
  },
  
  loadMap: {
    value: function () {
      var mapData = map.MapPool.get(this.map);
      var levelData = mapData.level;
      var {gameObjects} = levelData;
      
      for (const g of gameObjects) {
        let obj = map.EntityBuilder.build(g, this);
        this.addGameObject(obj, obj.layer);
        
        if (obj.customData.props) {
          this.parseProperties(obj);
        }
      }
      
      var all = this.getGameObjects();
      
      for (const added of all) {
        if (added.findReferences) {
          added.findReferences(all, this.PIXI);
        }
        
        if (added instanceof entities.TileVoid) {
          this.voidTiles.push(added);
        }
      }
      
      this._fadeInMap();
    }
  },
  
  linkTouchEvent: {
    value: function (obj, data) {
      this.touchEventBounds.push({
        obj: obj,
        data: data,
        active: false,
        textBox: null
      })
    }
  },
  
  setupAutoEvent: {
    value: function (obj, data) {
      this.autoEventBounds.push({
        obj: obj,
        data: data
      });
    }
  },
  
  parseProperties: {
    value: function (obj) {
      var props = obj.customData.props;
      
      for (const prop of props) {
        let key = prop.key;
        let value = prop.value;
        
        if (key === GameScene.PropertyTag.COLLISION) {
          this.linkTouchEvent(obj, value);
        } else if (key === GameScene.PropertyTag.AUTO) {
          this.setupAutoEvent(obj, value);
        }
      }
    }
  },
  
  checkAutoEvents: {
    value: function () {
      for (const ev of this.autoEventBounds) {
        var data = ev.data;
        var args = data.split('|');

        var condition1 = args[0];
        var expected = args[1];
        var conditions = args.length - 2;
        var eventSets = [];
        

        for (var i = 0; i < conditions; i += 2) {
          let cond = args[2 + i];
          let newVal  = args[2 + i + 1];

          eventSets.push({
            condition: cond,
            newValue: newVal
          });
        }

        if (Conditions[condition1] === expected) {
          for (let set of eventSets) {
            let {condition, newValue} = set;
            
            if (condition === "spawn" && newValue === "HoleCover")  {
              var obj = ev.obj;
              var e = new entities.HoleCover();
              e.position.x = obj.x;
              e.position.y = obj.y;
              this.addGameObject(e, 3);
              this.holeCovers.push(e);
              
            } else {
              Conditions[condition] = newValue;
            }
          }
          
          this.autoEventBounds.splice(this.autoEventBounds.indexOf(ev), 1);
        }
      }
    }
  },
  
  checkTouchEvents: {
    value: function () {
      for (const ev of this.touchEventBounds) {
        if (this.player.checkBroadPhaseCollision(ev.obj)) {
          if (!ev.active) {
            var data = ev.data;
            var args = data.split('|');
            
            // 0: Condition
            // 1: Expected value
            // 2: String
            if (args.length === 3) {
              var condition = args[0];
              var expected = args[1];
              
              if (Conditions[condition] === expected) {
                this.showEventText(ev, args[2]);
              }
              
            // 0: Condition1
            // 1: Expected value
            // 2: Condition2 to change after SPACE is pressed
            // 3: Value to set Condition2 to
            // Even numbers: ConditionX to change after SPACE is pressed
            // Odd numbers: Value to set ConditionX to
            // n: String
            } else if (args.length > 4) {
              var condition1 = args[0];
              var expected = args[1];
              var string = args[args.length - 1];

              // -3 for arg0, 1, and 2
              var conditions = args.length - 3;
              var eventSets = [];
              
              for (var i = 0; i < conditions; i += 2) {
                let cond = args[2 + i];
                let newVal  = args[2 + i + 1];
                
                eventSets.push({
                  condition: cond,
                  newValue: newVal
                })
              }
              
              if (Conditions[condition1] === expected) {
                this.showEventProgressText(ev, eventSets, string);
              }
              
            } else {
              this.showEventText(ev, ev.data);
            }
          }
        } else {
          if (ev.active) {
            this.hideEventText(ev);
          }
        }
      }
    }
  },
  
  showEventText: {
    value: function (event, string = "") {
      event.active = true;
      var textBox = new entities.TextBox(
        this.PIXI,
        this.keyboard,
        this.player,
        string
      );
      
      textBox.x = event.obj.x;
      textBox.y = event.obj.y - 75;
      
      // Layer 6 for higher objects like text boxes
      this.addGameObject(textBox, 6);
      event.textBox = textBox;
      this.camera.follow(this.player);
    }
  },
  
  showEventProgressText: {
    value: function (event, eventSets, string = "") {
      event.active = true;
      var textBox = new entities.TextBox(
        this.PIXI,
        this.keyboard,
        this.player,
        string
      );
      textBox.hasNext = true;
      this.camera.follow(event.obj);
      
      textBox.x = event.obj.x;
      textBox.y = event.obj.y - 75;
      
      if (textBox.x > this.player.x) {
        this.player.setState(entities.Player.STATE.RIGHT);
      } else {
        this.player.setState(entities.Player.STATE.LEFT);
      }
      
      this.player.movementLock++;
      this.player.acceleration.multiply(0);
      this.player.velocity.multiply(0);
      
      // Layer 6 for higher objects like text boxes
      this.addGameObject(textBox, 6);
      event.textBox = textBox;
      
      $(textBox).on('next-text', (e) => {
        $(textBox).off();
        
        for (let set of eventSets) {
          let {condition, newValue} = set;
          Conditions[condition] = newValue;
        }
        this.player.movementLock--;
        
        this.hideEventText(event);
      });
    }
  },
  
  hideEventText: {
    value: function (event) {
      //this.removeGameObject(event.textBox);
      event.textBox.customData.retired = true;
      event.active = false;
      event.textBox = null;
    }
  },
  
  _removeRetiredGameObjects: {
    value: function () {
      var gos = this.getGameObjects();
      
      for (let g of gos) {
        if (g.customData.retired === true) {
          this.removeGameObject(g);
        }
      }
    }
  },
  
  _applyFriction: {
    value: function () {
      var gos = this.getGameObjects();
      
      for (var i = 0; i < gos.length; i++) {
        gos[i].acceleration.multiply(GameScene.FRICTION);
        gos[i].velocity.multiply(GameScene.FRICTION);
      }
    }
  },
  
  _handleInput : {
    value : function () {
      var keys = this.keyboard;
      
      if (this.player) {
        this.player.handleInput(keys);
      }
    }
  },
  
  _handleCollisions: {
    value: function (gameObjects) {
      this.checkTouchEvents();
      
      for (let cover of this.holeCovers) {
        
        for (let t of this.voidTiles) {
          if (this.holeCovers.indexOf(cover) < 0) continue;
          if (this.voidTiles.indexOf(t) < 0) continue;
          
          if (cover.checkNarrowPhaseCollision(t, {})) {
            t.currentState.name = entities.HexTile.STATE.CLAIMING;
            this.voidTiles.splice(this.voidTiles.indexOf(t), 1);
            this.holeCovers.splice(this.holeCovers.indexOf(cover), 1);
            cover.customData.retired = true;
            t.solid = false;
          }
        }
      }
      
      Scene.prototype._handleCollisions.call(this, gameObjects);
    }
  },
  
  _handleConditions: {
    value: function () {
      if (this.blackBox.alpha === 0) {
        if (Conditions.map !== this.map) {
          this._fadeOutMap(() => {
            var newScene = new GameScene(this.canvas, this.PIXI);
            newScene.setMap(Conditions.map);
            newScene.loadMap();
            this.change(newScene);

            this.reset();
          });
        }
        
        if (Conditions.gameover === "true") {
          this._fadeOutMap(() => {
            var GameOverScene = require('./GameOverScene');
            var newScene = new GameOverScene(this.canvas, this.PIXI);
            this.change(newScene);
            this.reset();
          });
        }
      }
    }
  },
  
  _fadeInMap: {
    value: function (callback) {
      this.blackBox.alpha = 1;
      this.player.movementLock++;
      
      var id = window.setInterval(
        () => {
          this.blackBox.alpha -= GameScene.FADE_RATE;
          this.blackBox.alpha *= 0.9;
          
          if (this.blackBox.alpha <= 0) {
            window.clearInterval(id);
            this.blackBox.alpha = 0;
            this.player.movementLock--;
            this._stage.removeChild(this.blackBox);
            
            if (callback) {
              callback();
            }
          }
        },
        1
      );
    }
  },
  
  _fadeOutMap: {
    value: function (callback) {
      this.blackBox.alpha = 0;
      this.player.movementLock++;
      
      var id = window.setInterval(
        () => {
          this.blackBox.alpha += GameScene.FADE_RATE;
          this.blackBox.alpha *= 1.05;
          
          if (this.blackBox.alpha >= 1) {
            window.clearInterval(id);
            this.blackBox.alpha = 1;
            this.player.movementLock--;
            
            if (callback) {
              callback();
            }
          }
        },
        1
      );
    }
  }
}));

module.exports = GameScene;