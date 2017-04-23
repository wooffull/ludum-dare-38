"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

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
};

Object.defineProperties(HexTile, {
  WIDTH: {
    value: 168
  },
  HEIGHT: {
    value: 144
  }
});

HexTile.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  
}));

Object.freeze(HexTile);

module.exports = HexTile;