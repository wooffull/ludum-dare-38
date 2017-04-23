"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

var NPCB = function () {
  PhysicsObject.call(this);

  this.myGraphic1 = Assets.get(Assets.NPC_B0).texture;
  this.myGraphic2 = Assets.get(Assets.NPC_B1).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 30);
  this.frameIdle2 = GameObject.createFrame(this.myGraphic2, 30);
  this.stateIdle.addFrame(this.frameIdle1);
  this.stateIdle.addFrame(this.frameIdle2);
  this.addState(NPCB.STATE.IDLE, this.stateIdle);
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
  this.addState(NPCB.STATE.IDLE, this.stateIdle);
  */
  
  this.solid = false;
  this.fixed = true;
};

Object.defineProperties(NPCB, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});
NPCB.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      PhysicsObject.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case NPCB.STATE.UP_WALK:
          this.setState(NPCB.STATE.UP_IDLE);
        break;
        case NPCB.STATE.DOWN_WALK:
          this.setState(NPCB.STATE.DOWN_IDLE);
        break;
        case NPCB.STATE.LEFT_WALK:
          this.setState(NPCB.STATE.LEFT_IDLE);
        break;
        case NPCB.STATE.RIGHT_WALK:
          this.setState(NPCB.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  }
}));

Object.freeze(NPCB);

module.exports = NPCB;