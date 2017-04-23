"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var HoleCover = require('./HoleCover');
var TileOldJeremy = require('./TileOldJeremy');
var EventBounds = require('./EventBounds');
var HexTile = require('./HexTile');
var Conditions = require('../Conditions');

var Hole = function () {
  PhysicsObject.call(this);

  this.myGraphic1 = Assets.get(Assets.HOLE).texture;
  this.stateIdle = GameObject.createState();
  this.frameIdle1 = GameObject.createFrame(this.myGraphic1);
  this.stateIdle.addFrame(this.frameIdle1);
  this.addState(Hole.STATE.IDLE, this.stateIdle);

  this.solid = true;
  this.fixed = true;
  
  this.holeCover = null;
  this.filled = false;
  this.tile = null;
  this.eventBounds = null;
};

Object.defineProperties(Hole, {
  STATE : {
    value : {
      IDLE : "IDLE",
      FILLED: "FILLED",
      COMPLETE: "COMPLETE"
    }
  }
});

Hole.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      PhysicsObject.prototype.update.call(this, dt);
      
      var stateName = this.currentState.name;
      
      switch (stateName) {
        case Hole.STATE.IDLE:
            if (this.holeCover) {
              var displacement = geom.Vec2.subtract(
                this.position,
                this.holeCover.position
              );

              if (displacement.getMagnitudeSquared() > 2) {
                var impulse = displacement.clone().multiply(0.035);
                this.holeCover.position.add(impulse);
              } else {
                this.filled = true;
                this.currentState.name = Hole.STATE.FILLED;
              }
            }
          break;
        
        case Hole.STATE.FILLED:
          if (this.alpha > 0) {
            this.alpha -= 0.1;
            this.holeCover.alpha -= 0.1;
          } else {
            this.alpha = 0;
            this.holeCover.alpha = 0;
            this.currentState.name = Hole.STATE.COMPLETE;
            this.tile.currentState.name = HexTile.STATE.CLAIMING;
          }
          break;
        
        case Hole.STATE.COMPLETE:
          if (this.eventBounds) {
            var props = this.eventBounds.customData.props;
            
            for (const p of props) {
              if (p.key !== "tileClaim") continue;
              
              var args = p.value.split('|');

              var conditions = args.length;
              var eventSets = [];

              for (var i = 0; i < conditions; i += 2) {
                let cond = args[i];
                let newVal  = args[i + 1];

                eventSets.push({
                  condition: cond,
                  newValue: newVal
                });
              }

              for (let set of eventSets) {
                let {condition, newValue} = set;
                Conditions[condition] = newValue;
              }
            }
          }
          
          this.customData.retired = true;
          this.holeCover.customData.retired = true;
          break;
      }
      
      // Handle state
      /*
      var stateName = this.currentState.name;

      switch (stateName) {
        case Hole.STATE.UP_WALK:
          this.setState(Hole.STATE.UP_IDLE);
        break;
        case Hole.STATE.DOWN_WALK:
          this.setState(Hole.STATE.DOWN_IDLE);
        break;
        case Hole.STATE.LEFT_WALK:
          this.setState(Hole.STATE.LEFT_IDLE);
        break;
        case Hole.STATE.RIGHT_WALK:
          this.setState(Hole.STATE.RIGHT_IDLE);
        break;
      }
      */
    }
  },
  
  findReferences: {
    value: function (gameObjects) {
      var oldJeremyTiles = [];
      var eventBounds = [];
      
      for (const g of gameObjects) {
        if (g instanceof TileOldJeremy) {
          oldJeremyTiles.push(g);
        } else if (g instanceof EventBounds) {
          eventBounds.push(g);
        }
      }
      
      oldJeremyTiles.sort((a, b) => {
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
      
      if (oldJeremyTiles.length > 0) {
        if (this.checkBroadPhaseCollision(oldJeremyTiles[0])) {
          this.tile = oldJeremyTiles[0];
        }
      }
      
      if (eventBounds.length > 0) {
        if (this.checkBroadPhaseCollision(eventBounds[0])) {
          this.eventBounds = eventBounds[0];
        }
      }
    }
  },
  
  canCollide: {
    value: function (obj) {
      return !(obj instanceof HoleCover);
    }
  },
  
  onCollide: {
    value: function (obj) {
      if (obj instanceof HoleCover) {
        var distSquared = geom.Vec2.subtract(obj.position, this.position)
                          .getMagnitudeSquared();
        
        if (distSquared < this.width * this.width * 0.75 * 0.75) {
          this.holeCover = obj;
          this.holeCover.ignorePlayer = true;
          this.holeCover.mass = Infinity;
        }
      }
    }
  }
}));

Object.freeze(Hole);

module.exports = Hole;