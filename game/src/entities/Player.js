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
  
  this.stateRunLeft = GameObject.createState();
  this.frameRunLeft1 = GameObject.createFrame(this.myGraphic1, 18, verts);
  this.frameRunLeft2 = GameObject.createFrame(this.myGraphic2, 18, verts);
  this.frameRunLeft1.y -= 28;
  this.frameRunLeft2.y -= 28;
  this.stateRunLeft.addFrame(this.frameRunLeft1);
  this.stateRunLeft.addFrame(this.frameRunLeft2);
  this.addState(Player.STATE.RUN_LEFT, this.stateRunLeft);
  
  this.stateRunRight = GameObject.createState();
  this.frameRunRight1 = GameObject.createFrame(this.myGraphic3, 18, verts);
  this.frameRunRight2 = GameObject.createFrame(this.myGraphic4, 18, verts);
  this.frameRunRight1.y -= 28;
  this.frameRunRight2.y -= 28;
  this.stateRunRight.addFrame(this.frameRunRight1);
  this.stateRunRight.addFrame(this.frameRunRight2);
  this.addState(Player.STATE.RUN_RIGHT, this.stateRunRight);

  // The top of the stack determines which direction the player faces
  this._walkDirectionStack = [];

  // Set constants
  this.maxSpeed        = Player.MAX_SPEED;
  this.maxAcceleration = Player.MAX_ACCELERATION;
  
  this.movementLock = 0;
  
  this.mass = 400;
  this.restitution = 0.8;
  this.friction = 1;
};

Object.defineProperties(Player, {
  MAX_SPEED : {
    value : 4.75
  },
  
  MAX_ACCELERATION : {
    value : 5
  },
  
  SPRINT_MAX_SPEED : {
    value : 8.75
  },
  
  SPRINT_BOOST_ACCELERATION : {
    value : 2.225
  },

  BOOST_ACCELERATION : {
    value : 1.25
  },
  STATE : {
    value : {
      LEFT : "LEFT",
      RIGHT : "RIGHT",
      RUN_LEFT : "RUN_LEFT",
      RUN_RIGHT : "RUN_RIGHT"
    }
  }
});

Player.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      PhysicsObject.prototype.update.call(this, dt);
      this.velocity.multiply(0.8);
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

        if (leftPriority > rightPriority) {
          this.setState(Player.STATE.RUN_LEFT);
        } else if (leftPriority < rightPriority) {
          this.setState(Player.STATE.RUN_RIGHT);
        }
      } else {
        boost = Player.BOOST_ACCELERATION;
        this.maxSpeed = Player.MAX_SPEED;
        
        if (leftPriority > rightPriority) {
          this.setState(Player.STATE.LEFT);
        } else if (leftPriority < rightPriority) {
          this.setState(Player.STATE.RIGHT);
        } else {
          var stateName = this.currentState.name;

          switch (stateName) {
            case Player.STATE.RUN_LEFT:
              this.setState(Player.STATE.LEFT);
            break;
            case Player.STATE.RUN_RIGHT:
              this.setState(Player.STATE.RIGHT);
          }
        }
      }

      // Move the player in the appropriate direction
      if (leftPriority > rightPriority) {
        var movementForce = new geom.Vec2(-1, 0);
        movementForce.multiply(
          boost * this.mass
        );

        this.addImpulse(movementForce);
      } 
      if (rightPriority > leftPriority) {
        var movementForce = new geom.Vec2(1, 0);
        movementForce.multiply(
          boost * this.mass
        );

        this.addImpulse(movementForce);
      }
      if (upPriority > downPriority) {
        var movementForce = new geom.Vec2(0, -1);
        movementForce.multiply(
          boost * this.mass
        );

        this.addImpulse(movementForce);
      }
      if (downPriority > upPriority) {
        var movementForce = new geom.Vec2(0, 1);
        movementForce.multiply(
          boost * this.mass
        );

        this.addImpulse(movementForce);
      }
    }
  },
  
  cacheCalculations: {
    value: function () {
      PhysicsObject.prototype.cacheCalculations.call(this);
      
      var verts = this.vertices;
      var minX =  Infinity;
      var maxX = -Infinity;
      var minY =  Infinity;
      var maxY = -Infinity;
      
      for (let v of verts) {
        if (v.x < minX) minX = v.x;
        if (v.x > maxX) maxX = v.x;
        if (v.y < minY) minY = v.y;
        if (v.y > maxY) maxY = v.y;
      }
      
      var width  = maxX - minX;
      var height = maxY - minY;
      
      this.calculationCache.width  = width;
      this.calculationCache.height = height;
      this.calculationCache.aabbWidth = 64;
      this.calculationCache.aabbHeight = 64;
      this.calculationCache.aabbHalfWidth = 32;
      this.calculationCache.aabbHalfHeight = 32;
    }
  }
}));

Object.freeze(Player);

module.exports = Player;