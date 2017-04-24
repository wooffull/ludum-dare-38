"use strict";

var util   = require('./util');
var scenes = require('./scenes');
var Assets = require('./util/Assets.js');
var map    = require('./map');

// Create game
var canvas = document.querySelector("#game-canvas");
var game   = wfl.create(canvas);
game.renderer.backgroundColor = 0x000000;

//game.debug = {vectors: true};

var onLoadWindow = function () {
  var l = game.loader;

  // Prepare to load assets
  for (var asset in Assets) {
    try {
      l = l.add(Assets[asset]);
    } catch (e) {
    }
  }

  l.load(onLoadAssets);
  resize();
};

var onLoadAssets = function () {
  Assets.get = function (path) { return PIXI.loader.resources[path]; };
  
  loadMaps();
};

var loadMaps = function () {
  var maps = Assets.maps;
  
  for (const map of maps) {
    wfl.jquery.getJSON(map.path, (data) => onLoadMap(map.key, data));
  }
}

var loadCounter = 0;
var onLoadMap = function (key, data) {
  loadCounter++;
  
  map.MapPool.store(key, data);
  
  if (loadCounter === Assets.maps.length) {
    // Load scene here
    var gameScene = new scenes.TitleScene(canvas, game.pixi);
    game.setScene(gameScene);
  }
}

var onResize = function (e) {
  resize();
};

var resize = function () {
  // Use the commented code if you want to limit the canvas size
  // var MAX_WIDTH  = 1366;
  // var MAX_HEIGHT = 768;
  var w = window.innerWidth;  // Math.min(window.innerWidth,  MAX_WIDTH);
  var h = window.innerHeight; // Math.min(window.innerHeight, MAX_HEIGHT);
  
  canvas.width  = w;
  canvas.height = h;
  game.renderer.view.style.width  = w + 'px';
  game.renderer.view.style.height = h + 'px';
  game.renderer.resize(w, h);
}

window.onload = onLoadWindow;
window.onresize = onResize;