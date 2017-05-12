"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

var Bush = function () {
  PhysicsObject.call(this);

  this.myGraphic1 = Assets.get(Assets.BUSH).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1);
  this.stateIdle.addFrame(this.frameIdle1);
  this.addState(Bush.STATE.IDLE, this.stateIdle);
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
  this.addState(Bush.STATE.IDLE, this.stateIdle);
  */

  this.solid = true;
  this.fixed = true;
};

Object.defineProperties(Bush, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

Bush.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
}));

Object.freeze(Bush);

module.exports = Bush;