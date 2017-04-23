"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var HexTile = require('./HexTile');
var Player = require('./Player');

var TileGrass = function () {
  HexTile.call(this);

  this.myGraphic1 = Assets.get(Assets.TILE_GRASS).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 15, this.hexVertices);
  this.stateIdle.addFrame(this.frameIdle1);
  this.addState(TileGrass.STATE.IDLE, this.stateIdle);
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
  this.addState(TileGrass.STATE.IDLE, this.stateIdle);
  */
};

Object.defineProperties(TileGrass, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

TileGrass.prototype = Object.freeze(Object.create(HexTile.prototype, {
  update : {
    value : function (dt) {
      HexTile.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case TileGrass.STATE.UP_WALK:
          this.setState(TileGrass.STATE.UP_IDLE);
        break;
        case TileGrass.STATE.DOWN_WALK:
          this.setState(TileGrass.STATE.DOWN_IDLE);
        break;
        case TileGrass.STATE.LEFT_WALK:
          this.setState(TileGrass.STATE.LEFT_IDLE);
        break;
        case TileGrass.STATE.RIGHT_WALK:
          this.setState(TileGrass.STATE.RIGHT_IDLE);
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

Object.freeze(TileGrass);

module.exports = TileGrass;