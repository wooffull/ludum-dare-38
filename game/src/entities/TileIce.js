"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var EventBounds = require('./EventBounds');
var HexTile = require('./HexTile');
var Player = require('./Player');

var Conditions = require('../Conditions.js');

var TileIce = function () {
  HexTile.call(this);

  this.myGraphic1 = Assets.get(Assets.TILE_ICE).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 15, this.hexVertices);
  this.stateIdle.addFrame(this.frameIdle1);
  this.addState(TileIce.STATE.IDLE, this.stateIdle);
  
  this.eventBounds = [];
  
  this.allowOverlapEvents = true;
  
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
  this.addState(TileIce.STATE.IDLE, this.stateIdle);
  */
};

Object.defineProperties(TileIce, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  },
  
  MAX_PLAYER_SPEED: {
    value: 12
  }
});

TileIce.prototype = Object.freeze(Object.create(HexTile.prototype, {
  update : {
    value : function (dt) {
      HexTile.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case TileIce.STATE.UP_WALK:
          this.setState(TileIce.STATE.UP_IDLE);
        break;
        case TileIce.STATE.DOWN_WALK:
          this.setState(TileIce.STATE.DOWN_IDLE);
        break;
        case TileIce.STATE.LEFT_WALK:
          this.setState(TileIce.STATE.LEFT_IDLE);
        break;
        case TileIce.STATE.RIGHT_WALK:
          this.setState(TileIce.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  },
  
  findReferences: {
    value: function (gameObjects) {
      var eventBounds = [];
      
      for (const g of gameObjects) {
        if (g instanceof EventBounds) {
          eventBounds.push(g);
        }
      }
      
      eventBounds.sort((a, b) => {
        var d0 = geom.Vec2.subtract(
          a.position,
          this.position
        ).getMagnitudeSquared();
        var d1 = geom.Vec2.subtract(
          this.position, 
          b.position
        ).getMagnitudeSquared();
        
        return d0 - d1;
      });
      
      if (eventBounds.length > 0) {
        if (this.checkBroadPhaseCollision(eventBounds[0])) {
          this.eventBounds = eventBounds[0];
        }
      }
    }
  },
  
  onOverlap: {
    value: function (obj) {
      if (!this.eventBounds) return;
      
      if (obj instanceof Player && !obj.movementLock) {
        var props = this.eventBounds.customData.props;

        for (const p of props) {
          if (p.key !== "icePath") continue;
          
          var destination  = Conditions.global[p.value];
          var displacement = geom.Vec2.subtract(destination, obj.position);
          var velocity     = obj.velocity;
          
          if (geom.Vec2.dot(displacement, velocity) > 0) {
            obj.movementLock = true;
            obj.destination = destination;
            obj.speedToDestination = TileIce.MAX_PLAYER_SPEED;
          }
        }
      }
    }
  }
}));

Object.freeze(TileIce);

module.exports = TileIce;