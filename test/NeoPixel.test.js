var NeoPixel = require('../lib/NeoPixel.js');

describe('NeoPixel', function () {
  var neoPixel;

  beforeEach(function () {
    neoPixel = new NeoPixel();
  });

  it('has a color', function () {
    expect(neoPixel).to.have.property('color');
    expect(neoPixel.color).to.be.an.instanceOf(tinycolor);
  });

  it('defaults to black', function () {
    expect(neoPixel.color.toRgb()).to.deep.equal({r: 0, g: 0, b: 0, a: 1});
  });

  it('can be initialized with values', function () {
    neoPixel = new NeoPixel(42, 5, 17);
    expect(neoPixel.color.toRgb()).to.deep.equal({r: 42, g: 5, b: 17, a: 1});
  });

  it('can be initialized with an array', function () {
    neoPixel = new NeoPixel([42, 5, 17]);
    expect(neoPixel.color.toRgb()).to.deep.equal({r: 42, g: 5, b: 17, a: 1});
  });

  describe('$led', function () {
    it('is a jQuery element', function () {
      expect(neoPixel.$led).to.be.an.instanceOf($);
    });

    it('has the led class', function () {
      expect(neoPixel.$led).to.have.$class('led');
    });

    it('has the right background-color', function () {
      expect(neoPixel.$led).to.have.$css('background-color', 'rgb(0, 0, 0)');
      neoPixel = new NeoPixel(42, 5, 17);
      expect(neoPixel.$led).to.have.$css('background-color', 'rgb(42, 5, 17)');
    });
  });

  describe('#setRgb', function () {
    it('sets rgb with values', function () {
      neoPixel.setRgb(42, 5, 17);
      expect(neoPixel.color.toRgb()).to.deep.equal({r: 42, g: 5, b: 17, a: 1});
    });

    it('sets rgb with an array', function () {
      neoPixel.setRgb([42, 5, 17]);
      expect(neoPixel.color.toRgb()).to.deep.equal({r: 42, g: 5, b: 17, a: 1});
    });

    it('sets rgb with a tinycolor', function () {
      var color = tinycolor({r: 42, g: 5, b: 17});
      neoPixel.setRgb(color);
      expect(neoPixel.color).to.equal(color);
    });

    it('updates the background-color', function () {
      expect(neoPixel.$led).to.have.$css('background-color', 'rgb(0, 0, 0)');
      neoPixel.setRgb(42, 5, 17);
      expect(neoPixel.$led).to.have.$css('background-color', 'rgb(42, 5, 17)');
    });
  });

  describe('#getRgb', function () {
    it('gets rgb values as an array', function () {
      var rgb = neoPixel.getRgb();
      expect(rgb).to.be.an.instanceOf(Array);
      expect(rgb).to.have.length(3);
    });

    it('gets the correct values', function () {
      var rgb = neoPixel.getRgb();
      expect(rgb).to.deep.equal([0, 0, 0]);

      neoPixel = new NeoPixel(42, 5, 17);
      rgb = neoPixel.getRgb();
      expect(rgb).to.deep.equal([42, 5, 17]);
    });
  });

  describe('#rgbInterpolate', function () {
    it('returns a new color', function () {
      expect(neoPixel.rgbInterpolate()).to.be.an.instanceOf(tinycolor);
    });

    it('defaults to a clone of this color', function () {
      neoPixel.color = tinycolor('red');
      var color = neoPixel.rgbInterpolate();
      expect(color).not.to.equal(neoPixel.color);
      expect(color.toRgb()).to.deep.equal(neoPixel.color.toRgb());
    });

    it('defaults to midpoint interpolation', function () {
      neoPixel.color = tinycolor({r: 84, g: 7, b: 20});
      var other = new NeoPixel(0, 3, 14);
      var color = neoPixel.rgbInterpolate(other);
      expect(color.toRgb()).to.deep.equal({r: 42, g: 5, b: 17, a: 1});
    });

    it('uses a weight', function () {
      neoPixel.color = tinycolor({r: 41, g: 4, b: 18});
      var other = new NeoPixel(51, 14, 8);
      var color = neoPixel.rgbInterpolate(other, 0.1);
      expect(color.toRgb()).to.deep.equal({r: 42, g: 5, b: 17, a: 1});
    });
  });

  describe('#hslInterpolate', function () {
    it('returns a new color', function () {
      expect(neoPixel.hslInterpolate()).to.be.an.instanceOf(tinycolor);
    });

    it('defaults to a clone of this color', function () {
      neoPixel.color = tinycolor('red');
      var color = neoPixel.hslInterpolate();
      expect(color).not.to.equal(neoPixel.color);
      expect(color.toRgb()).to.deep.equal(neoPixel.color.toRgb());
    });

    it('defaults to midpoint interpolation', function () {
      neoPixel.color = tinycolor({h: 84, s: 0.07, l: 0.2});
      var other = new NeoPixel();
      other.color = tinycolor({h: 0, s: 0.03, l: 0.14});
      var color = neoPixel.hslInterpolate(other);
      var result = color.toHsl();
      expect(result.h).to.be.closeTo(42, 1e-13);
      expect(result.s).to.be.closeTo(0.05, 1e-13);
      expect(result.l).to.be.closeTo(0.17, 1e-13);
    });

    it('uses a weight', function () {
      neoPixel.color = tinycolor({h: 41, s: 0.04, l: 0.18});
      var other = new NeoPixel();
      other.color = tinycolor({h: 51, s: 0.14, l: 0.08});
      var color = neoPixel.hslInterpolate(other, 0.1);
      var result = color.toHsl();
      expect(result.h).to.be.closeTo(42, 1e-13);
      expect(result.s).to.be.closeTo(0.05, 1e-13);
      expect(result.l).to.be.closeTo(0.17, 1e-13);
    });

    it('correctly interpolates hue', function () {
      neoPixel.color = tinycolor({h: 0, s: 0.04, l: 0.18});
      var other = new NeoPixel();
      other.color = tinycolor({h: 240, s: 0.14, l: 0.08});
      var color = neoPixel.hslInterpolate(other);
      expect(color.toHsl().h).to.be.closeTo(300, 1e-13);
    });
  });
});
