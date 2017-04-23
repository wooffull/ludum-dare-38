"use strict";

var $             = wfl.jquery;
var geom          = wfl.geom;
var util          = require('../util');
var Assets        = util.Assets;
var GameObject    = wfl.core.entities.GameObject;
var PhysicsObject = wfl.core.entities.PhysicsObject;

var TextBox = function (PIXI, keyboard, player, text = "", displaySpeed = 15) {
  PhysicsObject.call(this);
  
  this.fullString = text;
  this.timeElapsed = 0;
  this.displaySpeed = displaySpeed;
  
  this.keyboard = keyboard;
  
  this.bgGraphic = new PIXI.Sprite.fromImage(Assets.TEXT_BOX);
  this.bgGraphicNext = new PIXI.Sprite.fromImage(Assets.TEXT_BOX_NEXT);
  this.textChild = new PIXI.extras.BitmapText("", { font: "18px ld38" });
  
  // Idk why multiply padding by 3
  this.textChild.maxWidth = this.bgGraphic.width - TextBox.PADDING * 3;

  let offsetX = this.bgGraphic.width * 0.5;
  let offsetY = this.bgGraphic.height * 0.5;
  
  this.bgGraphic.x -= offsetX;
  this.bgGraphic.y -= offsetY;
  this.bgGraphicNext.x -= offsetX;
  this.bgGraphicNext.y -= offsetY;
  this.textChild.x -= offsetX - TextBox.PADDING;
  this.textChild.y -= offsetY - TextBox.PADDING;
  
  this.solid = false;
  this.fixed = true;
  
  this.addChild(this.bgGraphic);
  this.addChild(this.textChild);
  
  this.alpha = 0.9;
  
  this.player = player;
  
  this.hasNext = false;
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
      
      if (charsToShow === this.fullString.length && this.hasNext) {
        if (this.children.indexOf(this.bgGraphic) >= 0) {
          this.removeChild(this.bgGraphic);
          this.addChildAt(this.bgGraphicNext);
        }
        
        this.handleInput();
      }
    }
  },
  
  onCollide: {
    value: function (obj) {
      console.log(obj);
    }
  },
  
  handleInput: {
    value: function () {
      var keys = this.keyboard;
      
      if (keys.isPressed(keys.SPACEBAR)) {
        this.hasNext = false;
        $(this).trigger("next-text");
      }
    }
  }
}));

Object.freeze(TextBox);

module.exports = TextBox;