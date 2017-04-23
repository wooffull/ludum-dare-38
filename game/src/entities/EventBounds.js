"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var Player = require('./Player');

var EventBounds = function () {
  PhysicsObject.call(this);
  
  this.myGraphic1 = Assets.get(Assets.EVENT_BOUNDS).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1);
  this.stateIdle.addFrame(this.frameIdle1);
  this.addState(EventBounds.STATE.IDLE, this.stateIdle);
  
  this.visible = false;
  
  this.solid = false;
  this.fixed = true;
};

Object.defineProperties(EventBounds, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

EventBounds.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      PhysicsObject.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case EventBounds.STATE.UP_WALK:
          this.setState(EventBounds.STATE.UP_IDLE);
        break;
        case EventBounds.STATE.DOWN_WALK:
          this.setState(EventBounds.STATE.DOWN_IDLE);
        break;
        case EventBounds.STATE.LEFT_WALK:
          this.setState(EventBounds.STATE.LEFT_IDLE);
        break;
        case EventBounds.STATE.RIGHT_WALK:
          this.setState(EventBounds.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  }
}));

Object.freeze(EventBounds);

module.exports = EventBounds;