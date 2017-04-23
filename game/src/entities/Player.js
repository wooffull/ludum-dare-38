"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

var Player = function () {
  PhysicsObject.call(this);
  
  var verts = [
    new geom.Vec2(-32, -32),
    new geom.Vec2(32, -32),
    new geom.Vec2(32, 32),
    new geom.Vec2(-32, 32)
  ]

  this.myGraphic1 = Assets.get(Assets.PLAYER_L0).texture;
  this.myGraphic2 = Assets.get(Assets.PLAYER_L1).texture;
  this.myGraphic3 = Assets.get(Assets.PLAYER_R0).texture;
  this.myGraphic4 = Assets.get(Assets.PLAYER_R1).texture;
  
  this.stateLeft = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 30, verts);
  this.frameIdle2 = GameObject.createFrame(this.myGraphic2, 30, verts);
  this.frameIdle1.y -= 28;
  this.frameIdle2.y -= 28;
  this.stateLeft.addFrame(this.frameIdle1);
  this.stateLeft.addFrame(this.frameIdle2);
  this.addState(Player.STATE.LEFT, this.stateLeft);
  
  this.stateRight = GameObject.createState();
  this.frameIdle3 = GameObject.createFrame(this.myGraphic3, 30, verts);
  this.frameIdle4 = GameObject.createFrame(this.myGraphic4, 30, verts);
  this.frameIdle3.y -= 28;
  this.frameIdle4.y -= 28;
  this.stateRight.addFrame(this.frameIdle3);
  this.stateRight.addFrame(this.frameIdle4);
  this.addState(Player.STATE.RIGHT, this.stateRight);

  // The top of the stack determines which direction the player faces
  this._walkDirectionStack = [];

  // Set constants
  this.maxSpeed        = Player.MAX_SPEED;
  this.maxAcceleration = Player.MAX_ACCELERATION;
  
  this.movementLock = 0;
  
  this.mass = 10;
  this.restitution = 0.8;
  this.friction = 1;
};

Object.defineProperties(Player, {
  MAX_SPEED : {
    value : 3
  },
  
  MAX_ACCELERATION : {
    value : .55
  },
  
  SPRINT_MAX_SPEED : {
    value : 6.5
  },
  
  SPRINT_BOOST_ACCELERATION : {
    value : .1
  },

  BOOST_ACCELERATION : {
    value : .05
  },
  STATE : {
    value : {
      LEFT : "LEFT",
      RIGHT : "RIGHT"
    }
  }
});

Player.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      PhysicsObject.prototype.update.call(this, dt);
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case Player.STATE.UP_WALK:
          this.setState(Player.STATE.UP_IDLE);
        break;
        case Player.STATE.DOWN_WALK:
          this.setState(Player.STATE.DOWN_IDLE);
        break;
        case Player.STATE.LEFT_WALK:
          this.setState(Player.STATE.LEFT_IDLE);
        break;
        case Player.STATE.RIGHT_WALK:
          this.setState(Player.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  },
  
  handleInput: {
    value: function (keyboard) {
      if (this.movementLock > 0) return;
      
      var sprinting     = keyboard.isPressed(keyboard.SHIFT);
      var lastPressed   = keyboard.getKeyJustPressed();
      var leftPriority  = -1;
      var rightPriority = -1;
      var upPriority    = -1;
      var downPriority  = -1;

      // Remove values that shouldn't be in the stack
      for (var i = this._walkDirectionStack.length; i >= 0; i--) {
        if (!keyboard.isPressed(this._walkDirectionStack[i])) {
          this._walkDirectionStack.splice(i, 1);
        }
      }

      // Add the current direction of movement to the stack (if any)
      if (lastPressed > -1) {
        switch (lastPressed) {
          case keyboard.LEFT:
          case keyboard.RIGHT:
          case keyboard.UP:
          case keyboard.DOWN:
            this._walkDirectionStack.push(lastPressed);
            break;
        }
      }

      // Determine the priorities of the directions
      var priorityCounter = 0;
      for (var i = 0; i < this._walkDirectionStack.length; i++) {
        switch (this._walkDirectionStack[i]) {
          case keyboard.LEFT:
            leftPriority = priorityCounter;
            priorityCounter++;
            break;
          case keyboard.RIGHT:
            rightPriority = priorityCounter;
            priorityCounter++;
            break;
          case keyboard.UP:
            upPriority = priorityCounter;
            priorityCounter++;
            break;
          case keyboard.DOWN:
            downPriority = priorityCounter;
            priorityCounter++;
            break;
        }
      }

      // Determine how fast the player should be moving
      var boost;
      if (sprinting) {
        boost = Player.SPRINT_BOOST_ACCELERATION;
        this.maxSpeed = Player.SPRINT_MAX_SPEED;
      } else {
        boost = Player.BOOST_ACCELERATION;
        this.maxSpeed = Player.MAX_SPEED;
      }

      // Move the player in the appropriate direction
      if (leftPriority > rightPriority) {
        var movementForce = new geom.Vec2(-1, 0);
        movementForce.multiply(
          boost * this.mass
        );

        this.addForce(movementForce);
        this.setState(Player.STATE.LEFT);
      } 
      if (rightPriority > leftPriority) {
        var movementForce = new geom.Vec2(1, 0);
        movementForce.multiply(
          boost * this.mass
        );

        this.addForce(movementForce);
        this.setState(Player.STATE.RIGHT);
      }
      if (upPriority > downPriority) {
        var movementForce = new geom.Vec2(0, -1);
        movementForce.multiply(
          boost * this.mass
        );

        this.addForce(movementForce);
      }
      if (downPriority > upPriority) {
        var movementForce = new geom.Vec2(0, 1);
        movementForce.multiply(
          boost * this.mass
        );

        this.addForce(movementForce);
      }
    }
  }
}));

Object.freeze(Player);

module.exports = Player;