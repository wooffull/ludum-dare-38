"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

var NPCA = function () {
  PhysicsObject.call(this);

  this.myGraphic1 = Assets.get(Assets.NPC_A0).texture;
  this.myGraphic2 = Assets.get(Assets.NPC_A1).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 18);
  this.frameIdle2 = GameObject.createFrame(this.myGraphic2, 17);
  this.stateIdle.addFrame(this.frameIdle1);
  this.stateIdle.addFrame(this.frameIdle2);
  this.addState(NPCA.STATE.IDLE, this.stateIdle);
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
  this.addState(NPCA.STATE.IDLE, this.stateIdle);
  */
  
  this.solid = false;
  this.fixed = true;
};

Object.defineProperties(NPCA, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

NPCA.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      PhysicsObject.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case NPCA.STATE.UP_WALK:
          this.setState(NPCA.STATE.UP_IDLE);
        break;
        case NPCA.STATE.DOWN_WALK:
          this.setState(NPCA.STATE.DOWN_IDLE);
        break;
        case NPCA.STATE.LEFT_WALK:
          this.setState(NPCA.STATE.LEFT_IDLE);
        break;
        case NPCA.STATE.RIGHT_WALK:
          this.setState(NPCA.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  }
}));

Object.freeze(NPCA);

module.exports = NPCA;