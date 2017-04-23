"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

var NPCC = function () {
  PhysicsObject.call(this);

  this.myGraphic1 = Assets.get(Assets.NPC_C0).texture;
  this.myGraphic2 = Assets.get(Assets.NPC_C1).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 45);
  this.frameIdle2 = GameObject.createFrame(this.myGraphic2, 45);
  this.stateIdle.addFrame(this.frameIdle1);
  this.stateIdle.addFrame(this.frameIdle2);
  this.addState(NPCC.STATE.IDLE, this.stateIdle);
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
  this.addState(NPCC.STATE.IDLE, this.stateIdle);
  */
  
  this.solid = false;
  this.fixed = true;
};

Object.defineProperties(NPCC, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

NPCC.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      PhysicsObject.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case NPCC.STATE.UP_WALK:
          this.setState(NPCC.STATE.UP_IDLE);
        break;
        case NPCC.STATE.DOWN_WALK:
          this.setState(NPCC.STATE.DOWN_IDLE);
        break;
        case NPCC.STATE.LEFT_WALK:
          this.setState(NPCC.STATE.LEFT_IDLE);
        break;
        case NPCC.STATE.RIGHT_WALK:
          this.setState(NPCC.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  }
}));

Object.freeze(NPCC);

module.exports = NPCC;