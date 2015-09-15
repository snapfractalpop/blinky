(function () {
  var NeoPixel = function () {
    switch (arguments.length) {
      case 1:
      case 3:
        this.setRgb.apply(this, arguments);
        break;
      default:
        this.color = tinycolor('black');
    }
  };

  NeoPixel.prototype.getElement = function () {
    return $('<span>', {
      class: 'led',
      css: {'background-color': this.color.toRgbString()}
    });
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
  };

  module.exports = NeoPixel;
})();
