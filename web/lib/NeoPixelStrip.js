(function () {
  var NeoPixel = require('./NeoPixel');

  var NeoPixelStrip = function (length) {
    length = length || 30;

    this.$strip = $('<div>', {class: 'strip'});

    this.leds = [];

    var neoPixel;
    for (var i = 0; i < length; i++) {
      neoPixel = new NeoPixel();
      this.leds.push(neoPixel);
      this.$strip.append(neoPixel.$led);
    };
  };

  NeoPixelStrip.prototype.getRgb = function () {
    return this.leds.map(function (neoPixel) {
      return neoPixel.getRgb();
    }).reduce(function (a, b) {
      return a.concat(b);
    });
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

  module.exports = NeoPixelStrip;
})();
