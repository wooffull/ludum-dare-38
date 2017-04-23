"use strict";

let maps = {};

const MapPool = {
  store: (key, data) => {
    maps[key] = data;
  },
  
  get: (key) => {
    return maps[key];
  }
}

module.exports = MapPool;