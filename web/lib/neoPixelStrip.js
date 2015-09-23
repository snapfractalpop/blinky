(function () {
  var NeoPixel = require('./neoPixel');

  var NeoPixelStrip = function (length) {
    if (typeof length == 'undefined') {
      length = 30;
    }

    this.$strip = $('<div>', {class: 'clearfix strip'});

    this.leds = [];

    var neoPixel;
    for (var i = 0; i < length; i++) {
      neoPixel = new NeoPixel();
      this.leds.push(neoPixel);
    };

    updateDom.call(this);
  };

  function updateDom() {
    this.leds.forEach((function (neoPixel) {
      this.$strip.append(neoPixel.$led);
    }).bind(this));
  }

  NeoPixelStrip.prototype.fill = function () {
    var args = arguments;
    this.leds.forEach(function (neoPixel) {
      neoPixel.setRgb.apply(neoPixel, args);
    });
  };

  NeoPixelStrip.prototype.getRgb = function () {
    return this.leds.map(function (neoPixel) {
      return neoPixel.getRgb();
    }).reduce(function (a, b) {
      return a.concat(b);
    });
  };

  NeoPixelStrip.prototype.getBase64 = function () {
    // for gamma correction
    var correct = [
         0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
         0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,
         1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,
         2,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  4,  5,  5,  5,
         5,  6,  6,  6,  6,  7,  7,  7,  7,  8,  8,  8,  9,  9,  9, 10,
        10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16,
        17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 24, 24, 25,
        25, 26, 27, 27, 28, 29, 29, 30, 31, 32, 32, 33, 34, 35, 35, 36,
        37, 38, 39, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50,
        51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68,
        69, 70, 72, 73, 74, 75, 77, 78, 79, 81, 82, 83, 85, 86, 87, 89,
        90, 92, 93, 95, 96, 98, 99,101,102,104,105,107,109,110,112,114,
       115,117,119,120,122,124,126,127,129,131,133,135,137,138,140,142,
       144,146,148,150,152,154,156,158,160,162,164,167,169,171,173,175,
       177,180,182,184,186,189,191,193,196,198,200,203,205,208,210,213,
       215,218,220,223,225,228,231,233,236,239,241,244,247,249,252,255
    ];

    var rgbString = String.fromCharCode.apply(undefined, this.getRgb().map(function (value) {
      return correct[Math.round(value * 199 / 255)];
    }));
    return btoa(rgbString);
  };

  NeoPixelStrip.prototype.getUrl = function (host) {
    return 'http://' + host + '/raw/' + this.getBase64();
  };

  NeoPixelStrip.prototype.setRgbGradient = function (start, end) {
    setGradient.call(this, 'rgb', start, end);
  };

  NeoPixelStrip.prototype.setHslGradient = function (start, end) {
    setGradient.call(this, 'hsl', start, end);
  };

  function setGradient(type, start, end) {
    var startPixel = this.leds[start];
    var endPixel = this.leds[end];
    var steps = end - start;

    var neoPixel, weight, color;
    for (var i = 1; i < steps; i++) {
      weight = i / steps;
      neoPixel = this.leds[start + i];
      color = startPixel[type + 'Interpolate'](endPixel, weight);
      neoPixel.setRgb(color);
    };
  }

  NeoPixelStrip.prototype.clone = function () {
    var clone = new NeoPixelStrip(0);

    this.leds.forEach(function (neoPixel) {
      var neoPixelClone = neoPixel.clone();
      clone.leds.push(neoPixelClone);
    });

    updateDom.call(clone);

    return clone;
  };

  NeoPixelStrip.prototype.flip = function () {
    this.leds = this.leds.reverse();
    updateDom.call(this);
  };

  NeoPixelStrip.prototype.rotate = function (n) {
    if (typeof n == 'undefined') {n = 1;}
    var length = this.leds.length;
    n = ((n % length) + length) % length;
    this.leds = this.leds.slice(n).concat(this.leds.slice(0, n));
    updateDom.call(this);
  };

  module.exports = NeoPixelStrip;
})();
