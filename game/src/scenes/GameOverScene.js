"use strict";

var $             = wfl.jquery;
var geom = wfl.geom;
var Scene = wfl.display.Scene;
var map = require('../map');
var Assets = require('../util/Assets.js');
var entities = require('../entities');
var TitleScene = require('./TitleScene');

var Conditions = require('../Conditions.js');

var GameOverScene = function (canvas, PIXI) {
  Scene.call(this, canvas, PIXI);
  
  this.PIXI = PIXI;
  
  this.blackBox = new PIXI.Sprite.fromImage(Assets.BLACK_BOX);
  this.blackBox.alpha = 1;
  
  this.player = new entities.Jeremy();
  this.camera.follow(this.player);
  this.addGameObject(this.player);
  
  this.text = null;
};

Object.defineProperties(GameOverScene, {
});

GameOverScene.prototype = Object.freeze(Object.create(Scene.prototype, {
  update : {
    value: function (dt) {
      Scene.prototype.update.call(this, dt);
      
      if (this.text === null) {
        this.text = new entities.TextBox(
          PIXI,
          this.keyboard,
          this.player,
          "Keep on claiming."
        );
        this.text.y = -100.5;
        this.text.hasNext = true;
        
        $(this.text).on('next-text', () => {
          var newScene = new TitleScene(this.canvas, this.PIXI);
          this.change(newScene);
          this.reset();
        });

        this.addGameObject(this.text, 5);
      }
    }
  },
  
  /**
   * (Adapted from wfl.Scene.js) Draws the scene and all game objects in it
   */
  draw : {
    value : function (renderer) {
      if (this.blackBox.alpha > 0) {
        this.blackBox.width = window.innerWidth;
        this.blackBox.height = window.innerHeight;
        this.blackBox.x = this.camera.position.x - window.innerWidth * 0.5;
        this.blackBox.y = this.camera.position.y - window.innerHeight * 0.5;
        this._stage.addChild(this.blackBox);
      }
      
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
          this._stage.addChild(obj);
        }
      }
    }
  },
  
  _handleInput : {
    value : function () {
      var keys = this.keyboard;
    }
  }
}));

module.exports = GameOverScene;