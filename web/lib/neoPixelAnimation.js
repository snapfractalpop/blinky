(function () {
  var NeoPixelStrip = require('./neoPixelStrip');

  var NeoPixelAnimation = function () {
    this.$animation = $('<div>', {class: 'clearfix pixel-animation'});
    this.strips = [];
    this.delay = 40;
  };

  NeoPixelAnimation.prototype.setFps = function (fps) {
    this.delay = Math.round(1000 / fps);
  };

  NeoPixelAnimation.prototype.add = function (neoPixelStrip) {
    this.strips.push(neoPixelStrip);
    this.$animation.append(neoPixelStrip.$strip);
  };

  NeoPixelAnimation.prototype.getRgb = function () {
    return this.strips.map(function (neoPixelStrip) {
      return neoPixelStrip.getRgb();
    }).reduce(function (a, b) {
      return a.concat(b);
    });
  };

  NeoPixelAnimation.prototype.getUrl = function (host) {
    var base64 = this.strips.map(function (neoPixelStrip) {
      return neoPixelStrip.getBase64();
    }).join('');
    return 'http://' + host + '/animate/' + this.delay + '/' + base64;
  };

  /*
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
  */

  module.exports = NeoPixelAnimation;
})();
