"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var HexTile = require('./HexTile');

var TileFree = function () {
  HexTile.call(this);

  this.myGraphic1 = Assets.get(Assets.TILE_FREE0).texture;
  this.myGraphic2 = Assets.get(Assets.TILE_FREE1).texture;
  this.myGraphic3 = Assets.get(Assets.TILE_FREE2).texture;
  this.myGraphic4 = Assets.get(Assets.TILE_FREE3).texture;
  this.myGraphic5 = Assets.get(Assets.TILE_FREE4).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 70, this.hexVertices);
  this.frameIdle2 = GameObject.createFrame(this.myGraphic2, 4, this.hexVertices);
  this.frameIdle3 = GameObject.createFrame(this.myGraphic3, 3, this.hexVertices);
  this.frameIdle4 = GameObject.createFrame(this.myGraphic4, 3, this.hexVertices);
  this.frameIdle5 = GameObject.createFrame(this.myGraphic5, 4, this.hexVertices);
  this.stateIdle.addFrame(this.frameIdle1);
  this.stateIdle.addFrame(this.frameIdle2);
  this.stateIdle.addFrame(this.frameIdle3);
  this.stateIdle.addFrame(this.frameIdle4);
  this.stateIdle.addFrame(this.frameIdle5);
  this.addState(TileFree.STATE.IDLE, this.stateIdle);
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
  this.addState(TileFree.STATE.IDLE, this.stateIdle);
  */
};

Object.defineProperties(TileFree, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

TileFree.prototype = Object.freeze(Object.create(HexTile.prototype, {
  update : {
    value : function (dt) {
      HexTile.prototype.update.call(this, dt);
      
      var stateName = this.currentState.name;
      
      if (stateName === TileFree.STATE.IDLE) {
        this._handlePlayer();
      }
    }
  },
  
  _handlePlayer: {
    value: function () {
      if (this.player.checkNarrowPhaseCollision(this, {})) {
        this.currentState.name = HexTile.STATE.CLAIMING;
      }
    }
  }
}));

Object.freeze(TileFree);

module.exports = TileFree;