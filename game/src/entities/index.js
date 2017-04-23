"use strict";

var Player = require('./Player.js');
var BlockFull = require('./BlockFull.js');
var HexTile = require('./HexTile.js');
var TileWater = require('./TileWater.js');
var TileJeremy = require('./TileJeremy.js');
var TileOldJeremy = require('./TileOldJeremy.js');
var TileGrass = require('./TileGrass.js');
var TileVoid = require('./TileVoid.js');

var Hole = require('./Hole.js');
var HoleCover = require('./HoleCover.js');

var EventBounds = require('./EventBounds.js');

var TextBox = require('./TextBox.js');

var Jeremy = require('./Jeremy.js');

module.exports = {
  Player: Player,
  BlockFull: BlockFull,
  HexTile: HexTile,
  TileWater: TileWater,
  TileJeremy: TileJeremy,
  TileOldJeremy: TileOldJeremy,
  TileGrass: TileGrass,
  TileVoid: TileVoid,
  
  Hole: Hole,
  HoleCover: HoleCover,
  
  EventBounds: EventBounds,
  
  TextBox: TextBox,
  
  // Characters
  Jeremy: Jeremy,
};