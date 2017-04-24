"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

var Title = function () {
  PhysicsObject.call(this);
  
  this.myGraphic1 = Assets.get(Assets.TITLE0).texture;
  this.myGraphic2 = Assets.get(Assets.TITLE1).texture;
  this.myGraphic3 = Assets.get(Assets.TITLE2).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 4, this.hexVertices);
  this.frameIdle2 = GameObject.createFrame(this.myGraphic2, 4, this.hexVertices);
  this.frameIdle3 = GameObject.createFrame(this.myGraphic3, 4, this.hexVertices);
  this.stateIdle.addFrame(this.frameIdle1);
  this.stateIdle.addFrame(this.frameIdle2);
  this.stateIdle.addFrame(this.frameIdle3);
  this.addState(Title.STATE.IDLE, this.stateIdle);
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
  this.addState(Title.STATE.IDLE, this.stateIdle);
  */
};

Object.defineProperties(Title, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  }
});

Title.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
}));

Object.freeze(Title);

module.exports = Title;