"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var Player = require('./Player');

var HoleCover = function () {
  PhysicsObject.call(this);

  this.myGraphic1 = Assets.get(Assets.HOLE_COVER).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1);
  this.stateIdle.addFrame(this.frameIdle1);
  this.addState(HoleCover.STATE.IDLE, this.stateIdle);

  this.solid = true;

  // Set constants
  this.maxSpeed        = HoleCover.MAX_SPEED;
  this.maxAcceleration = HoleCover.MAX_ACCELERATION;
  
  this.mass = 0.01;
  this.restitution = 0.2;
  this.friction = 1;
  
  this.ignorePlayer = false;
};

Object.defineProperties(HoleCover, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  },
  
  MAX_SPEED : {
    value : 15
  },
  
  MAX_ACCELERATION : {
    value : 10
  }
});

HoleCover.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      PhysicsObject.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case HoleCover.STATE.UP_WALK:
          this.setState(HoleCover.STATE.UP_IDLE);
        break;
        case HoleCover.STATE.DOWN_WALK:
          this.setState(HoleCover.STATE.DOWN_IDLE);
        break;
        case HoleCover.STATE.LEFT_WALK:
          this.setState(HoleCover.STATE.LEFT_IDLE);
        break;
        case HoleCover.STATE.RIGHT_WALK:
          this.setState(HoleCover.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  }
  
  /*canCollide: {
    value: function (obj) {
      if (this.ignorePlayer && (obj instanceof Player)) {
        return false;
      }
      
      return true;
    }
  }*/
}));

Object.freeze(HoleCover);

module.exports = HoleCover;