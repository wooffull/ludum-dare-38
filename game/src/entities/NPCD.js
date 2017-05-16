"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

var NPCD = function () {
  PhysicsObject.call(this);

  this.myGraphic1 = Assets.get(Assets.NPC_D0).texture;
  this.myGraphic2 = Assets.get(Assets.NPC_D1).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 45);
  this.frameIdle2 = GameObject.createFrame(this.myGraphic2, 45);
  this.stateIdle.addFrame(this.frameIdle1);
  this.stateIdle.addFrame(this.frameIdle2);
  this.addState(NPCD.STATE.IDLE, this.stateIdle);
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
  this.addState(NPCD.STATE.IDLE, this.stateIdle);
  */
  
  this.solid = false;
  this.fixed = true;
};

Object.defineProperties(NPCD, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

NPCD.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      PhysicsObject.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case NPCD.STATE.UP_WALK:
          this.setState(NPCD.STATE.UP_IDLE);
        break;
        case NPCD.STATE.DOWN_WALK:
          this.setState(NPCD.STATE.DOWN_IDLE);
        break;
        case NPCD.STATE.LEFT_WALK:
          this.setState(NPCD.STATE.LEFT_IDLE);
        break;
        case NPCD.STATE.RIGHT_WALK:
          this.setState(NPCD.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  }
}));

Object.freeze(NPCD);

module.exports = NPCD;