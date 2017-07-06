"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var HexTile = require('./HexTile');
var Player = require('./Player');

var TileRock = function () {
  HexTile.call(this);

  this.myGraphic1 = Assets.get(Assets.TILE_ROCK).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 15, this.hexVertices);
  this.stateIdle.addFrame(this.frameIdle1);
  this.addState(TileRock.STATE.IDLE, this.stateIdle);
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
  this.addState(TileRock.STATE.IDLE, this.stateIdle);
  */

  this.solid = true;
};

Object.defineProperties(TileRock, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

TileRock.prototype = Object.freeze(Object.create(HexTile.prototype, {
  update : {
    value : function (dt) {
      HexTile.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case TileRock.STATE.UP_WALK:
          this.setState(TileRock.STATE.UP_IDLE);
        break;
        case TileRock.STATE.DOWN_WALK:
          this.setState(TileRock.STATE.DOWN_IDLE);
        break;
        case TileRock.STATE.LEFT_WALK:
          this.setState(TileRock.STATE.LEFT_IDLE);
        break;
        case TileRock.STATE.RIGHT_WALK:
          this.setState(TileRock.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  }
}));

Object.freeze(TileRock);

module.exports = TileRock;