"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

var Player = function () {
  PhysicsObject.call(this);

  this.myGraphic1 = Assets.get(Assets.PLAYER).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1, 15);
  this.stateIdle.addFrame(this.frameIdle1);
  this.addState(Player.STATE.IDLE, this.stateIdle);

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
  this.addState(Player.STATE.IDLE, this.stateIdle);
  */

  // The top of the stack determines which direction the player faces
  this._walkDirectionStack = [];

  // Set constants
  this.maxSpeed        = Player.MAX_SPEED;
  this.maxAcceleration = Player.MAX_ACCELERATION;
  
  this.movementLock = false;
  
  this.mass = 10;
  this.restitution = 0.8;
};

Object.defineProperties(Player, {
  MAX_SPEED : {
    value : 2
  },
  
  MAX_ACCELERATION : {
    value : .4
  },
  
  SPRINT_MAX_SPEED : {
    value : 4
  },
  
  SPRINT_BOOST_ACCELERATION : {
    value : .5
  },

  BOOST_ACCELERATION : {
    value : .05
  },
  STATE : {
    value : {
      IDLE : "IDLE",
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
    
  // Extend player stuff here 
  resolveCollision : {
    value : function (physObj, collisionData) {
      // Use custom collision resolution
      if (physObj.solid) {
        this.acceleration.multiply(0);

        if (collisionData.direction) {
          this.velocity.x = collisionData.direction.x * 0.1;
          this.velocity.y = collisionData.direction.y * 0.1;
          this.position.add(collisionData.direction);
        }
      }
    }
  },
  
  handleInput: {
    value: function (keyboard) {
      if (this.movementLock) return;
      
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
          case keyboard.A:
          case keyboard.D:
          case keyboard.W:
          case keyboard.S:
            this._walkDirectionStack.push(lastPressed);
            break;
        }
      }

      // Determine the priorities of the directions
      var priorityCounter = 0;
      for (var i = 0; i < this._walkDirectionStack.length; i++) {
        switch (this._walkDirectionStack[i]) {
          case keyboard.A:
            leftPriority = priorityCounter;
            priorityCounter++;
            break;
          case keyboard.D:
            rightPriority = priorityCounter;
            priorityCounter++;
            break;
          case keyboard.W:
            upPriority = priorityCounter;
            priorityCounter++;
            break;
          case keyboard.S:
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
      } 
      if (rightPriority > leftPriority) {
        var movementForce = new geom.Vec2(1, 0);
        movementForce.multiply(
          boost * this.mass
        );

        this.addForce(movementForce)
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