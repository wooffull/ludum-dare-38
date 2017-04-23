"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;
var EventBounds = require('./EventBounds');
var Player = require('./Player');

var HexTile = function () {
  PhysicsObject.call(this);
  
  this.hexVertices = [];
  
  for (var i = 0; i < 6; i++) {
    var x = HexTile.WIDTH * 0.5 * Math.cos((i / 6) * Math.PI * 2);
    var y = HexTile.WIDTH * 0.5 * Math.sin((i / 6) * Math.PI * 2);
    this.hexVertices.push(new geom.Vec2(x, y));
  }
  
  this.solid = false;
  this.fixed = true;
  this.prevSprite = null;
  
  this.claimingGraphic = null;
  this.claimedGraphic = null;
  
  this.claimTransition = 0;
  this.eventBounds = null;
  this.player = null;
  
  this.PIXI = null;
};

Object.defineProperties(HexTile, {
  WIDTH: {
    value: 168
  },
  HEIGHT: {
    value: 144
  },
  STATE: {
    value: {
      CLAIMING: "CLAIMING",
      CLAIMING_PROGRESS: "CLAIMING_PROGRESS",
      CLAIMED: "CLAIMED"
    }
  },
  CLAIM_RATE: {
    value: 0.03
  }
});

HexTile.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update: {
    value: function (dt) {
      var stateName = this.currentState.name;
      
      switch (stateName) {
        case HexTile.STATE.CLAIMING:
          if (this.children.indexOf(this.claimingGraphic) < 0) {
            this.addChild(this.claimedGraphic);
            this.addChild(this.claimingGraphic);
            this.claimedGraphic.alpha = 0;
          }
          
          this.claimTransition += HexTile.CLAIM_RATE;
          this.claimingGraphic.alpha = this.claimTransition;
          
          if (this.claimTransition >= 1) {
            this.claimTransition = 1;
            this.claimingGraphic.alpha = 1;
            this.claimedGraphic.alpha = 1;
            this.currentState.name = HexTile.STATE.CLAIMING_PROGRESS;
          }
          break;
          
        case HexTile.STATE.CLAIMING_PROGRESS:
          this.claimTransition -= HexTile.CLAIM_RATE;
          this.claimingGraphic.alpha = this.claimTransition;
          
          if (this.claimTransition <= 0) {
            this.claimTransition = 0;
            this.currentState.name = HexTile.STATE.CLAIMED;
          }
          break;
          
        case HexTile.STATE.CLAIMED:
          this.children = [this.claimedGraphic];
          break;
        
        default:
          PhysicsObject.prototype.update.call(this, dt);
      }
    }
  },
  
  findReferences: {
    value: function (gameObjects, PIXI) {
      this.PIXI = PIXI;
      
      this.claimingGraphic = new PIXI.Sprite.fromImage(Assets.TILE_CLAIMING);
      this.claimedGraphic = new PIXI.Sprite.fromImage(Assets.TILE_CLAIMED);
      
      var offsetX = this.width * 0.5;
      var offsetY = this.height * 0.5;
      
      this.claimingGraphic.x -= offsetX;
      this.claimingGraphic.y -= offsetY;
      this.claimedGraphic.x -= offsetX;
      this.claimedGraphic.y -= offsetY;
      
      this.claimingGraphic.alpha = 0;
      
      
      
      var eventBounds = [];
      
      for (const g of gameObjects) {
        if (g instanceof EventBounds) {
          eventBounds.push(g);
        } else if (g instanceof Player) {
          this.player = g;
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
}));

Object.freeze(HexTile);

module.exports = HexTile;