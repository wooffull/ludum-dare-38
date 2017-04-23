"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var HexTile = require('./HexTile');

var BlockFull = function () {
  HexTile.call(this);

  this.myGraphic1 = Assets.get(Assets.BLOCK).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 15, this.hexVertices);
  this.stateIdle.addFrame(this.frameIdle1);
  this.addState(BlockFull.STATE.IDLE, this.stateIdle);
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
  this.addState(BlockFull.STATE.IDLE, this.stateIdle);
  */

};

Object.defineProperties(BlockFull, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

BlockFull.prototype = Object.freeze(Object.create(HexTile.prototype, {
  update : {
    value : function (dt) {
      HexTile.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case BlockFull.STATE.UP_WALK:
          this.setState(BlockFull.STATE.UP_IDLE);
        break;
        case BlockFull.STATE.DOWN_WALK:
          this.setState(BlockFull.STATE.DOWN_IDLE);
        break;
        case BlockFull.STATE.LEFT_WALK:
          this.setState(BlockFull.STATE.LEFT_IDLE);
        break;
        case BlockFull.STATE.RIGHT_WALK:
          this.setState(BlockFull.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  }
}));

Object.freeze(BlockFull);

module.exports = BlockFull;