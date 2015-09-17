var NeoPixelStrip = require('../lib/NeoPixelStrip.js');
var NeoPixel = require('../lib/NeoPixel.js');

describe('NeoPixelStrip', function () {
  var neoPixelStrip;

  beforeEach(function () {
    neoPixelStrip = new NeoPixelStrip();
  });

  it('has leds', function () {
    expect(neoPixelStrip).to.have.property('leds');
  });

  describe('leds', function () {
    it('has neoPixel leds', function () {
      expect(neoPixelStrip.leds[0]).to.be.an.instanceOf(NeoPixel);
    });

    it('can be initialized with length', function () {
      neoPixelStrip = new NeoPixelStrip(60);
      expect(neoPixelStrip.leds).to.have.length(60);
    });

    it('defaults to length 30', function () {
      expect(neoPixelStrip.leds).to.have.length(30);
    });

    it('defaults to black leds', function () {
      expect(neoPixelStrip.leds[0].color.toRgb()).to.deep.equal({r: 0, g: 0, b: 0, a: 1});
    });
  });


  describe('$strip', function () {
    it('is a jQuery element', function () {
      expect(neoPixelStrip.$strip).to.be.an.instanceOf($);
    });

    it('has the strip class', function () {
      expect(neoPixelStrip.$strip).to.have.$class('strip');
    });

    it('contains an element for each led', function () {
      expect(neoPixelStrip.$strip.children()).to.have.length(30);

      neoPixelStrip = new NeoPixelStrip(60);
      expect(neoPixelStrip.$strip.children()).to.have.length(60);
    });
  });

  describe('#getRgb', function () {
    var rgb;

    beforeEach(function () {
      rgb = neoPixelStrip.getRgb();
    });

    it('gets rgb values as an array', function () {
      expect(rgb).to.be.an.instanceOf(Array);
    });

    it('gets the correct size', function () {
      expect(rgb).to.have.length(90);

      neoPixelStrip = new NeoPixelStrip(60);
      rgb = neoPixelStrip.getRgb();
      expect(rgb).to.have.length(180);
    });

    it('gets the correct values', function () {
      var neoPixel = neoPixelStrip.leds[14];
      neoPixel.setRgb(42, 5, 17);

      rgb = neoPixelStrip.getRgb();
      expect(rgb.slice(42, 45)).to.deep.equal([42, 5, 17]);
    });
  });

  describe('#setRgbGradient', function () {
    beforeEach(function () {
      var neoPixel1 = neoPixelStrip.leds[5];
      var neoPixel2 = neoPixelStrip.leds[14];
      neoPixel1.setRgb(41, 4, 18);
      neoPixel2.setRgb(51, 14, 8);
      neoPixelStrip.setRgbGradient(5, 14);
    });

    it('leaves endpoints intact', function () {
      var neoPixel1 = neoPixelStrip.leds[5];
      var neoPixel2 = neoPixelStrip.leds[14];
      expect(neoPixel1.getRgb()).to.deep.equal([41, 4, 18]);
      expect(neoPixel2.getRgb()).to.deep.equal([51, 14, 8]);
    });

    it('interpolates rgb values between leds', function () {
      var neoPixel = neoPixelStrip.leds[6];
      expect(neoPixel.getRgb()).to.deep.equal([42, 5, 17]);

      neoPixel = neoPixelStrip.leds[9];
      expect(neoPixel.getRgb()).to.deep.equal([45, 8, 14]);
    });
  });

  describe('#setHslGradient', function () {
    beforeEach(function () {
      var neoPixel1 = neoPixelStrip.leds[5];
      var neoPixel2 = neoPixelStrip.leds[15];
      neoPixel1.setRgb(tinycolor({h: 41, s: 0.04, l: 0.18}));
      neoPixel2.setRgb(tinycolor({h: 51, s: 0.14, l: 0.08}));
      neoPixelStrip.setHslGradient(5, 15);
    });

    it('leaves endpoints intact', function () {
      var neoPixel = neoPixelStrip.leds[5];
      var hsl = neoPixel.color.toHsl();
      expect(hsl.h).to.be.closeTo(41, 1e-13);
      expect(hsl.s).to.be.closeTo(0.04, 1e-13);
      expect(hsl.l).to.be.closeTo(0.18, 1e-13);

      neoPixel = neoPixelStrip.leds[15];
      hsl = neoPixel.color.toHsl();
      expect(hsl.h).to.be.closeTo(51, 1e-13);
      expect(hsl.s).to.be.closeTo(0.14, 1e-13);
      expect(hsl.l).to.be.closeTo(0.08, 1e-13);
    });

    it('interpolates hsl values between leds', function () {
      var neoPixel = neoPixelStrip.leds[6];
      var hsl = neoPixel.color.toHsl();
      expect(hsl.h).to.be.closeTo(42, 1e-13);
      expect(hsl.s).to.be.closeTo(0.05, 1e-13);
      expect(hsl.l).to.be.closeTo(0.17, 1e-13);

      neoPixel = neoPixelStrip.leds[9];
      hsl = neoPixel.color.toHsl();
      expect(hsl.h).to.be.closeTo(45, 1e-13);
      expect(hsl.s).to.be.closeTo(0.08, 1e-13);
      expect(hsl.l).to.be.closeTo(0.14, 1e-13);
    });

    it('correctly interpolates hue', function () {
      var neoPixel1 = neoPixelStrip.leds[5];
      var neoPixel2 = neoPixelStrip.leds[15];
      neoPixel1.setRgb(tinycolor({h: 0, s: 0.04, l: 0.18}));
      neoPixel2.setRgb(tinycolor({h: 240, s: 0.14, l: 0.08}));
      neoPixelStrip.setHslGradient(5, 15);


      var neoPixel = neoPixelStrip.leds[10];
      expect(neoPixel.color.toHsl().h).to.be.closeTo(300, 1e-13);
    });
  });


});
