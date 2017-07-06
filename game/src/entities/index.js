"use strict";

var Player = require('./Player.js');
var BlockFull = require('./BlockFull.js');
var TileGreenBorder = require('./TileGreenBorder.js');
var HexTile = require('./HexTile.js');
var TileWater = require('./TileWater.js');
var TileRock = require('./TileRock.js');
var TileWood = require('./TileWood.js');
var TileJeremy = require('./TileJeremy.js');
var TileOldJeremy = require('./TileOldJeremy.js');
var TileGrass = require('./TileGrass.js');
var TileSnow = require('./TileSnow.js');
var TileIce = require('./TileIce.js');
var TileSand = require('./TileSand.js');
var TileFree = require('./TileFree.js');
var TileVoid = require('./TileVoid.js');

var Title = require('./Title.js');

var Hole = require('./Hole.js');
var HoleCover = require('./HoleCover.js');
var VoidStone = require('./VoidStone.js');

var Bush = require('./Bush.js');

var EventBounds = require('./EventBounds.js');

var TextBox = require('./TextBox.js');

var Jeremy = require('./Jeremy.js');

var NPCA = require('./NPCA.js');
var NPCB = require('./NPCB.js');
var NPCC = require('./NPCC.js');
var NPCD = require('./NPCD.js');

module.exports = {
  Player: Player,
  BlockFull: BlockFull,
  TileGreenBorder: TileGreenBorder,
  HexTile: HexTile,
  TileWater: TileWater,
  TileRock: TileRock,
  TileWood: TileWood,
  TileJeremy: TileJeremy,
  TileOldJeremy: TileOldJeremy,
  TileGrass: TileGrass,
  TileSnow: TileSnow,
  TileIce: TileIce,
  TileSand: TileSand,
  TileFree: TileFree,
  TileVoid: TileVoid,
  
  Title: Title,
  
  Hole: Hole,
  HoleCover: HoleCover,
  VoidStone: VoidStone,
  
  Bush: Bush,
  
  EventBounds: EventBounds,
  
  TextBox: TextBox,
  
  // Characters
  Jeremy: Jeremy,
  NPCA: NPCA,
  NPCB: NPCB,
  NPCC: NPCC,
  NPCD: NPCD,
};