"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

var Jeremy = function () {
  PhysicsObject.call(this);

  this.myGraphic1 = Assets.get(Assets.JEREMY0).texture;
  this.myGraphic2 = Assets.get(Assets.JEREMY1).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 30);
  this.frameIdle2 = GameObject.createFrame(this.myGraphic2, 30);
  this.stateIdle.addFrame(this.frameIdle1);
  this.stateIdle.addFrame(this.frameIdle2);
  this.addState(Jeremy.STATE.IDLE, this.stateIdle);
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
  this.addState(Jeremy.STATE.IDLE, this.stateIdle);
  */
  
  this.solid = false;
  this.fixed = true;
};

Object.defineProperties(Jeremy, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

Jeremy.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      PhysicsObject.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case Jeremy.STATE.UP_WALK:
          this.setState(Jeremy.STATE.UP_IDLE);
        break;
        case Jeremy.STATE.DOWN_WALK:
          this.setState(Jeremy.STATE.DOWN_IDLE);
        break;
        case Jeremy.STATE.LEFT_WALK:
          this.setState(Jeremy.STATE.LEFT_IDLE);
        break;
        case Jeremy.STATE.RIGHT_WALK:
          this.setState(Jeremy.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  }
}));

Object.freeze(Jeremy);

module.exports = Jeremy;