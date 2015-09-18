(function () {
  var NeoPixel = function () {
    this.$led = $('<span>', {class: 'led'});

    switch (arguments.length) {
      case 1:
      case 3:
        this.setRgb.apply(this, arguments);
        break;
      default:
        this.setRgb(0, 0, 0);
    }

  };

  NeoPixel.prototype.setRgb = function () {
    switch (arguments.length) {
      case 1:
        if (Array.isArray(arguments[0])) {
          this.color = tinycolor({
            r: arguments[0][0],
            g: arguments[0][1],
            b: arguments[0][2],
          });
        } else if (arguments[0] instanceof tinycolor) {
          this.color = tinycolor(arguments[0].toString());
        }
        break;
      case 3:
        this.color = tinycolor({
          r: arguments[0],
          g: arguments[1],
          b: arguments[2],
        });
        break;
    }

    this.$led.css('background-color', this.color.toRgbString());
  };

  NeoPixel.prototype.getRgb = function () {
    var rgb = this.color.toRgb();
    return [rgb.r, rgb.g, rgb.b];
  };

  NeoPixel.prototype.rgbInterpolate = function (other, weight) {
    other = other || this;
    weight = weight || 0.5;

    thisRgb = this.color.toRgb();
    otherRgb = other.color.toRgb();

    interpolatedRgb = {
      r: Math.round(otherRgb.r * weight + thisRgb.r * (1 - weight)),
      g: Math.round(otherRgb.g * weight + thisRgb.g * (1 - weight)),
      b: Math.round(otherRgb.b * weight + thisRgb.b * (1 - weight))
    };

    return tinycolor(interpolatedRgb);
  };

  NeoPixel.prototype.hslInterpolate = function (other, weight) {
    other = other || this;
    weight = weight || 0.5;

    thisHsl = this.color.toHsl();
    otherHsl = other.color.toHsl();

    // for modular interpolation
    var h1 = thisHsl.h;
    var h2 = otherHsl.h;
    var shortest = ((((h2 - h1) % 360) + 540) % 360) - 180;
    var hue = (((h1 + weight * shortest) % 360) + 360) % 360;

    interpolatedHsl = {
      h: hue,
      s: otherHsl.s * weight + thisHsl.s * (1 - weight),
      l: otherHsl.l * weight + thisHsl.l * (1 - weight)
    };

    return tinycolor(interpolatedHsl);
  };

  NeoPixel.prototype.clone = function () {
    return new NeoPixel(this.color);
  };

  module.exports = NeoPixel;
})();
