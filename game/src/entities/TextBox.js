"use strict";

var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

var TextBox = function (PIXI, text = "", displaySpeed = 1) {
  PhysicsObject.call(this);
  
  this.fullString = text;
  this.timeElapsed = 0;
  this.displaySpeed = displaySpeed;
  
  this.bgGraphic = new PIXI.Sprite.fromImage(Assets.TEXT_BOX);
  this.textChild = new PIXI.extras.BitmapText("", { font: "18px ld38" });
  
  // Idk why multiply padding by 3
  this.textChild.maxWidth = this.bgGraphic.width - TextBox.PADDING * 3;

  let offsetX = this.bgGraphic.width * 0.5;
  let offsetY = this.bgGraphic.height * 0.5;
  
  this.bgGraphic.x -= offsetX;
  this.bgGraphic.y -= offsetY;
  this.textChild.x -= offsetX - TextBox.PADDING;
  this.textChild.y -= offsetY - TextBox.PADDING;
  
  this.solid = false;
  this.fixed = true;
  
  this.addChild(this.bgGraphic);
  this.addChild(this.textChild);
  
  this.alpha = 0.9;
};

Object.defineProperties(TextBox, {
  STATE : {
    value : {
      IDLE : "IDLE",
    }
  },
  
  // Characters / Second
  CHARS_PER_SECOND: {
    value: 1 / 60
  },
  
  PADDING: {
    value: 5
  }
});

TextBox.prototype = Object.freeze(Object.create(PhysicsObject.prototype, {
  update : {
    value : function (dt) {
      this.timeElapsed += dt;
      let charsToShow = Math.floor(Math.min(
        this.timeElapsed * this.displaySpeed * TextBox.CHARS_PER_SECOND,
        this.fullString.length
      ));
      
      this.textChild.text = this.fullString.substr(0, charsToShow);
    }
  }
}));

Object.freeze(TextBox);

module.exports = TextBox;