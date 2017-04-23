"use strict";

module.exports = {
  maps: [
    {key: 'map0', path: './assets/maps/map0.json'},
  ],
  
  // MY_GRAPHIC: "./assets/img/MY_GRAPHIC.png",
  BLOCK: "./assets/img/BlockFull.png",
  TILE_WATER: "./assets/img/TileWater.png",
  TILE_GRASS: "./assets/img/TileGrass.png",
  TILE_VOID: "./assets/img/TileVoid.png",
  PLAYER: "./assets/img/Player.png",
  TEXT_BOX: "./assets/img/TextBox.png",
  
  // Fonts
  //FONT_TEXTURE: "./assets/font/ld38.png",
  FONT: "./assets/font/ld38.xml",

  // Preloader.js will replace getter with appropriate definition
  get        : function (path) { }
};