"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var Player = require('./Player');
var TileVoid = require('./TileVoid');
var EventBounds = require('./EventBounds');
var HexTile = require('./HexTile');
var Conditions = require('../Conditions');

var VoidStone = function () {
  PhysicsObject.call(this);

  this.myGraphic1 = Assets.get(Assets.VOID_STONE).texture;
  this.stateInactive = GameObject.createState();
  this.frameInactive1 = GameObject.createFrame(this.myGraphic1);
  this.stateInactive.addFrame(this.frameInactive1);
  this.addState(VoidStone.STATE.INACTIVE, this.stateInactive);
  
  this.myGraphic2 = Assets.get(Assets.VOID_STONE_ACTIVE).texture;
  this.stateActive = GameObject.createState();
  this.frameActive1 = GameObject.createFrame(this.myGraphic2);
  this.stateActive.addFrame(this.frameActive1);
  this.addState(VoidStone.STATE.ACTIVE, this.stateActive);

  this.solid = true;

  // Set constants
  this.maxSpeed        = VoidStone.MAX_SPEED;
  this.maxAcceleration = VoidStone.MAX_ACCELERATION;
  
  this.restitution = 0.9;
  this.friction = 1;
};

Object.defineProperties(VoidStone, {
  STATE : {
    value : {
      INACTIVE : "INACTIVE",
      ACTIVE : "ACTIVE",
    }
  },
  
  MAX_SPEED : {
    value : 15
  },
  
  MAX_ACCELERATION : {
    value : 10
  }
});

VoidStone.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      PhysicsObject.prototype.update.call(this, dt);
      
      // Handle state
      var stateName = this.currentState.name;

      switch (stateName) {
        case VoidStone.STATE.INACTIVE:
          this.fixed = true;
          
          if (this.eventBounds) {
            if (!this.eventBounds.customData) debugger;
            var props = this.eventBounds.customData.props;
            
            for (const p of props) {
              if (p.key === "activate_vs") {
                var args = p.value.split('|');

                var conditions = args.length;
                var allConditionsPass = true;
                var eventSets = [];

                for (var i = 0; i < conditions; i += 2) {
                  let cond = args[i];
                  let expected = args[i + 1];
                  
                  if (Conditions[cond] !== expected) {
                    allConditionsPass = false;
                    break;
                  }
                }
                
                if (allConditionsPass) {
                  this.setState(VoidStone.STATE.ACTIVE);
                }
              }
            }
          }
          
          break;
        case VoidStone.STATE.ACTIVE:
          this.fixed = false;
          break;
      }
    }
  },
  
  onCollide: {
    value: function (obj) {
      if (obj instanceof TileVoid) {
        if (obj.solid) {
          obj.currentState.name = HexTile.STATE.CLAIMING;
          this.customData.retired = true;
        }
      }
    }
  },
  
  findReferences: {
    value: function (gameObjects) {
      var eventBounds = [];
      
      for (const g of gameObjects) {
        if (g instanceof EventBounds) {
          eventBounds.push(g);
        }
      }
      
      eventBounds.sort((a, b) => {
        var d0 = geom.Vec2.subtract(
          a.position,
          this.position
        ).getMagnitudeSquared();
        var d1 = geom.Vec2.subtract(
          this.position, 
          b.position
        ).getMagnitudeSquared();
        
        return d0 - d1;
      });
      
      if (eventBounds.length > 0) {
        if (this.checkBroadPhaseCollision(eventBounds[0])) {
          this.eventBounds = eventBounds[0];
        }
      }
    }
  }
  
  /*canCollide: {
    value: function (obj) {
      if (this.ignorePlayer && (obj instanceof Player)) {
        return false;
      }
      
      return true;
    }
  }*/
}));

Object.freeze(VoidStone);

module.exports = VoidStone;