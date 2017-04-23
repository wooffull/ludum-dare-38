"use strict";

var $             = wfl.jquery;
var Scene = wfl.display.Scene;
var map = require('../map');
var Assets = require('../util/Assets.js');
var entities = require('../entities');

var Conditions = require('../Conditions.js');

var GameScene = function (canvas, PIXI) {
  Scene.call(this, canvas, PIXI);
  
  this.map = null;
  this.touchEventBounds = [];
  
  this.PIXI = PIXI;
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
  
  PropertyTag: {
    value: {
      COLLISION: "collision"
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
          // Sort objects on the same layer by their Y-coordinate
          if (a.layer === b.layer) {
            return a.transform.position._y - b.transform.position._y;
          
          // Otherwise, sort them by layer
          } else {
            return a.layer - b.layer;
          }
        }
      );
      
      // This seems to perform faster than using filter()
      for (let obj of this._lastDrawnGameObjects) {
        if (this.canSee(obj)) {
          this._stage.addChild(obj);
        }
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
      var mapData = map.MapPool.get(Assets.maps[0].key);
      var levelData = mapData.level;
      var {gameObjects} = levelData;
      
      for (const g of gameObjects) {
        let obj = map.EntityBuilder.build(g, this);
        this.addGameObject(obj, obj.layer);
        
        if (obj.customData.props) {
          this.parseProperties(obj);
        }
      }
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
  
  parseProperties: {
    value: function (obj) {
      var props = obj.customData.props;
      
      for (const prop of props) {
        let key = prop.key;
        let value = prop.value;
        
        if (key === GameScene.PropertyTag.COLLISION) {
          this.linkTouchEvent(obj, value);
        }
      }
    }
  },
  
  checkTouchEvents: {
    value: function () {
      
     // console.log(Conditions);
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
      textBox.y = event.obj.y - 50;
      
      // Layer 5 for higher objects like text boxes
      this.addGameObject(textBox, 5);
      event.textBox = textBox;
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
      
      textBox.x = event.obj.x;
      textBox.y = event.obj.y - 50;
      
      // Layer 5 for higher objects like text boxes
      this.addGameObject(textBox, 5);
      event.textBox = textBox;
      
      $(textBox).on('next-text', (e) => {
        $(textBox).off();
        
        for (let set of eventSets) {
          let {condition, newValue} = set;
          Conditions[condition] = newValue;
        }
        
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
      
      Scene.prototype._handleCollisions.call(this, gameObjects);
    }
  }
}));

module.exports = GameScene;