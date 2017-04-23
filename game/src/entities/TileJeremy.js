"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var HexTile = require('./HexTile');
var Player = require('./Player');

var TileJeremy = function () {
  HexTile.call(this);

  this.myGraphic1 = Assets.get(Assets.TILE_JEREMY).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 15, this.hexVertices);
  this.stateIdle.addFrame(this.frameIdle1);
  this.addState(TileJeremy.STATE.IDLE, this.stateIdle);
  // Reference graphics
  /*
  this.myGraphic1 = Assets.get(Assets.MY_GRAPHIC).texture;
  this.myGraphic2 = Assets.get(Assets.MY_GRAPHIC).texture;
  */

  // Create state
  /*
  this.stateIdle = GameObject.createState();

  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 15);
  this.frameIdle2 = GameObject.createFrame(this.myGraphic2, 15);
  this.stateIdle.addFrame(this.frameIdle1);
  this.stateIdle.addFrame(this.frameIdle2);
  */

  // Add states
  /*
  this.addState(TileJeremy.STATE.IDLE, this.stateIdle);
  */
};

Object.defineProperties(TileJeremy, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

TileJeremy.prototype = Object.freeze(Object.create(HexTile.prototype, {
  update : {
    value : function (dt) {
      HexTile.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case TileJeremy.STATE.UP_WALK:
          this.setState(TileJeremy.STATE.UP_IDLE);
        break;
        case TileJeremy.STATE.DOWN_WALK:
          this.setState(TileJeremy.STATE.DOWN_IDLE);
        break;
        case TileJeremy.STATE.LEFT_WALK:
          this.setState(TileJeremy.STATE.LEFT_IDLE);
        break;
        case TileJeremy.STATE.RIGHT_WALK:
          this.setState(TileJeremy.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  },
  
  canCollide: {
    value: function (obj) {
      return (obj instanceof Player);
    }
  }
}));

Object.freeze(TileJeremy);

module.exports = TileJeremy;