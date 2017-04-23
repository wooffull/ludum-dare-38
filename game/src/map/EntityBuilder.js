"use strict";

const entities = require('../entities');

const EntityBuilder = {
  build: (gameObjectData, scene) => {
    let g = null;
    let entity = gameObjectData.entity;
    let entityName = entity.name;
    let className = null;
    
    if (entityName === "SpawnPoint") {
      className = entities["Player"];
    } else {
      // Remove numbers from entityNames
      entityName = entityName.replace(/[0-9]/g, '');
      
      className = entities[entityName];
    }
    
    if (className) {
      g = new className();
      g.position.x = gameObjectData.x;
      g.position.y = gameObjectData.y;
      g.rotation = gameObjectData.rotation;
      g.customData.props = gameObjectData.props;
      
      // Get int from string ("layer0" -> 0)
      g.layer = gameObjectData.layer.match(/\d+/)[0];
    }
    
    if (g) {
      if (entityName === "SpawnPoint") {
        scene.player = g;
        scene.camera.follow(g);
      }
      
      return g;
    }
    
    throw entity.name + " doesn't exist";
  }
}

module.exports = EntityBuilder;