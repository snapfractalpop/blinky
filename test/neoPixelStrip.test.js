var NeoPixelStrip = require('../lib/neoPixelStrip.js');
var NeoPixel = require('../lib/neoPixel.js');

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

    it('has the clearfix class', function () {
      expect(neoPixelStrip.$strip).to.have.$class('clearfix');
    });

    it('contains an element for each led', function () {
      expect(neoPixelStrip.$strip.children()).to.have.length(30);

      neoPixelStrip = new NeoPixelStrip(60);
      expect(neoPixelStrip.$strip.children()).to.have.length(60);
    });
  });

  describe('#fill', function () {
    it('can be filled with values', function () {
      neoPixelStrip.fill(42, 5, 17);
      neoPixelStrip.leds.forEach(function (led) {
        expect(led.getRgb()).to.deep.equal([42, 5, 17]);
      });
    });

    it('clones colors', function () {
      var color = tinycolor({r: 42, g: 5, b: 17});
      neoPixelStrip.fill(color);
      var filled = neoPixelStrip.leds[5].color;
      expect(filled).to.not.equal(color);
      expect(filled.toRgb()).to.deep.equal(color.toRgb());
    });

    it('fills a range');
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

  describe('#getBase64', function () {
    it('gets gamma corrected base64', function () {
      neoPixelStrip.leds[4].setRgb(42, 5, 17);
      neoPixelStrip.leds[9].setRgb(255, 0, 0);
      neoPixelStrip.leds[14].setRgb(0, 255, 0);
      neoPixelStrip.leds[21].setRgb(0, 0, 255);

      var base64 = neoPixelStrip.getBase64();
      expect(base64).to.equal('AAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAfwAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAB/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    });
  });

  describe('#getUrl', function () {
    it('forms an api url from host', function () {
      neoPixelStrip.leds[4].setRgb(42, 5, 17);
      neoPixelStrip.leds[9].setRgb(255, 0, 0);
      neoPixelStrip.leds[14].setRgb(0, 255, 0);
      neoPixelStrip.leds[21].setRgb(0, 0, 255);

      var url = neoPixelStrip.getUrl('192.168.0.123');
      expect(url).to.equal('http://192.168.0.123/raw/AAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAfwAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAB/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
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

  describe('#clone', function () {
    var clone;

    beforeEach(function () {
      var neoPixel = neoPixelStrip.leds[14];
      neoPixel.setRgb(42, 5, 17);
      clone = neoPixelStrip.clone();
    });

    it('returns a neoPixelStrip', function () {
      expect(clone).to.be.an.instanceOf(NeoPixelStrip);
    });

    it('makes a deep copy', function () {
      expect(clone).to.not.equal(neoPixelStrip);
      expect(clone.leds).to.not.equal(neoPixelStrip.leds);
      expect(clone.leds[14]).to.not.equal(neoPixelStrip.leds[14]);
      expect(clone.$strip).to.not.equal(neoPixelStrip.$strip);

      expect(clone.getRgb()).to.deep.equal(neoPixelStrip.getRgb());
    });

    it('has the right number of children', function () {
      expect(clone.$strip.children()).to.have.length(30);
    });
  });

  describe('#flip', function () {
    var el5, el17;

    beforeEach(function () {
      el5 = neoPixelStrip.$strip.children()[5];
      el17 = neoPixelStrip.$strip.children()[17];
      neoPixelStrip.leds[5].setRgb(42, 5, 0);
      neoPixelStrip.leds[17].setRgb(42, 17, 0);
      neoPixelStrip.flip();
    });

    it('reverses the order of leds', function () {
      expect(neoPixelStrip.leds[5].getRgb()).to.deep.equal([0, 0, 0]);
      expect(neoPixelStrip.leds[17].getRgb()).to.deep.equal([0, 0, 0]);
      expect(neoPixelStrip.leds[24].getRgb()).to.deep.equal([42, 5, 0]);
      expect(neoPixelStrip.leds[12].getRgb()).to.deep.equal([42, 17, 0]);
    });

    it('reverses the dom elements', function () {
      expect(neoPixelStrip.$strip.children()[5]).to.not.equal(el5);
      expect(neoPixelStrip.$strip.children()[17]).to.not.equal(el17);
      expect(neoPixelStrip.$strip.children()[24]).to.equal(el5);
      expect(neoPixelStrip.$strip.children()[12]).to.equal(el17);
    });
  });

  describe('#rotate', function () {
    var el14;

    beforeEach(function () {
      el14 = neoPixelStrip.$strip.children()[14];
      neoPixelStrip.leds[14].setRgb(42, 5, 17);
    });

    it('rotates the leds left 1 by default', function () {
      neoPixelStrip.rotate();
      expect(neoPixelStrip.leds[13].getRgb()).to.deep.equal([42, 5, 17]);
      expect(neoPixelStrip.leds[14].getRgb()).to.deep.equal([0, 0, 0]);
    });

    it('rotates by the correct amount', function () {
      neoPixelStrip.rotate(5);
      expect(neoPixelStrip.leds[9].getRgb()).to.deep.equal([42, 5, 17]);
      expect(neoPixelStrip.leds[14].getRgb()).to.deep.equal([0, 0, 0]);

      neoPixelStrip.rotate(-17);
      expect(neoPixelStrip.leds[26].getRgb()).to.deep.equal([42, 5, 17]);
      expect(neoPixelStrip.leds[9].getRgb()).to.deep.equal([0, 0, 0]);
      expect(neoPixelStrip.leds[14].getRgb()).to.deep.equal([0, 0, 0]);
    });

    it('wraps around', function () {
      neoPixelStrip.rotate(42);
      expect(neoPixelStrip.leds[2].getRgb()).to.deep.equal([42, 5, 17]);
      expect(neoPixelStrip.leds[14].getRgb()).to.deep.equal([0, 0, 0]);
    });

    it('rotates the dom elements', function () {
      neoPixelStrip.rotate(42);
      expect(neoPixelStrip.$strip.children()[14]).to.not.equal(el14);
      expect(neoPixelStrip.$strip.children()[2]).to.equal(el14);
    });
  });

});
