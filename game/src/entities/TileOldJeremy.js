"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var HexTile = require('./HexTile');
var Player = require('./Player');

var TileOldJeremy = function () {
  HexTile.call(this);

  this.myGraphic1 = Assets.get(Assets.TILE_OLD_JEREMY).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 15, this.hexVertices);
  this.stateIdle.addFrame(this.frameIdle1);
  this.addState(TileOldJeremy.STATE.IDLE, this.stateIdle);
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
  this.addState(TileOldJeremy.STATE.IDLE, this.stateIdle);
  */
};

Object.defineProperties(TileOldJeremy, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

TileOldJeremy.prototype = Object.freeze(Object.create(HexTile.prototype, {
  update : {
    value : function (dt) {
      HexTile.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case TileOldJeremy.STATE.UP_WALK:
          this.setState(TileOldJeremy.STATE.UP_IDLE);
        break;
        case TileOldJeremy.STATE.DOWN_WALK:
          this.setState(TileOldJeremy.STATE.DOWN_IDLE);
        break;
        case TileOldJeremy.STATE.LEFT_WALK:
          this.setState(TileOldJeremy.STATE.LEFT_IDLE);
        break;
        case TileOldJeremy.STATE.RIGHT_WALK:
          this.setState(TileOldJeremy.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  }
}));

Object.freeze(TileOldJeremy);

module.exports = TileOldJeremy;