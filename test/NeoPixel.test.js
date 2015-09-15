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

  describe('#getElement', function () {
    var $led;

    beforeEach(function () {
      $led = neoPixel.getElement();
    });

    it('returns a jQuery element', function () {
      expect($led).to.be.an.instanceOf($);
    });

    it('has the led class', function () {
      expect($led).to.have.$class('led');
    });

    it('has the right background-color', function () {
      expect($led).to.have.$css('background-color', 'rgb(0, 0, 0)');

      neoPixel = new NeoPixel(42, 5, 17);
      $led = neoPixel.getElement();
      expect($led).to.have.$css('background-color', 'rgb(42, 5, 17)');
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
  });

  describe('#rgbInterpolate', function () {
    it('returns a new led', function () {

    });
  });
});
