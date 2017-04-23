"use strict";

var Scene = wfl.display.Scene;
var map = require('../map');
var Assets = require('../util/Assets.js');
var entities = require('../entities');

var GameScene = function (canvas, PIXI) {
  Scene.call(this, canvas, PIXI);
  
  this.map = null;
  
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
  }
});

GameScene.prototype = Object.freeze(Object.create(Scene.prototype, {
  update : {
    value : function (dt) {
      this._applyFriction();
      this._handleInput();
      
      Scene.prototype.update.call(this, dt);
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
      }
      
      let c = new entities.TextBox(this.PIXI, "Please get me c0ckwwwwwwwwwwwwwww", 10);
      c.x = this.player.x;
      c.y = this.player.y;
      this.addGameObject(c, 3);
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
  }
}));

module.exports = GameScene;