var NeoPixelAnimation = require('../lib/neoPixelAnimation.js');
var NeoPixelStrip = require('../lib/neoPixelStrip.js');
var NeoPixel = require('../lib/neoPixel.js');

describe('NeoPixelAnimation', function () {
  var neoPixelAnimation;

  beforeEach(function () {
    neoPixelAnimation = new NeoPixelAnimation();
  });

  it('has strips', function () {
    expect(neoPixelAnimation).to.have.property('strips');
    expect(neoPixelAnimation.strips).to.be.an.instanceOf(Array);
  });

  it('starts with zero strips', function () {
    expect(neoPixelAnimation.strips).to.have.length(0);
  });

  it('has delay', function () {
    expect(neoPixelAnimation).to.have.property('delay');
  });

  it('has default delay of 40', function () {
    expect(neoPixelAnimation.delay).to.equal(40);
  });

  describe('$animation', function () {
    it('is a jQuery element', function () {
      expect(neoPixelAnimation.$animation).to.be.an.instanceOf($);
    });

    it('has the pixel-animation class', function () {
      expect(neoPixelAnimation.$animation).to.have.$class('pixel-animation');
    });

    it('has the clearfix class', function () {
      expect(neoPixelAnimation.$animation).to.have.$class('clearfix');
    });

    it('contains an element for each strip', function () {
    });
  });

  describe('#setFps', function () {
    it('sets the appropriate delay', function () {
      neoPixelAnimation.setFps(30);
      expect(neoPixelAnimation.delay).to.be.closeTo(1000 / 30, 0.5);
    });
  });

  describe('#add', function () {
    it('adds a strip to the animation', function () {
      expect(neoPixelAnimation.strips).to.have.length(0);
      neoPixelAnimation.add(new NeoPixelStrip());
      expect(neoPixelAnimation.strips).to.have.length(1);
    });

    it('appends the strip to the dom element', function () {
      expect(neoPixelAnimation.$animation.children()).to.have.length(0);
      neoPixelAnimation.add(new NeoPixelStrip());
      expect(neoPixelAnimation.$animation.children()).to.have.length(1);
    });
  });

  describe('#getRgb', function () {
    var rgb;

    beforeEach(function () {
      for(var i = 0; i < 5; i++) {
        neoPixelAnimation.add(new NeoPixelStrip());
      }
      rgb = neoPixelAnimation.getRgb();
    });

    it('gets rgb values as an array', function () {
      expect(rgb).to.be.an.instanceOf(Array);
    });

    it('gets the correct size', function () {
      expect(rgb).to.have.length(450);

      neoPixelAnimation.add(new NeoPixelStrip());
      rgb = neoPixelAnimation.getRgb();
      expect(rgb).to.have.length(540);
    });

    it('gets the correct values', function () {
      var neoPixelStrip = new NeoPixelStrip();
      neoPixelAnimation.add(neoPixelStrip);

      var neoPixel = neoPixelStrip.leds[14];
      neoPixel.setRgb(42, 5, 17);

      for(var i = 0; i < 5; i++) {
        neoPixelAnimation.add(new NeoPixelStrip());
      }

      rgb = neoPixelAnimation.getRgb();
      expect(rgb.slice(492, 495)).to.deep.equal([42, 5, 17]);
    });
  });

	describe('#clear', function () {
    beforeEach(function () {
      for(var i = 0; i < 3; i++) {
        neoPixelAnimation.add(new NeoPixelStrip());
      }
    });

		it('clears the strips array', function () {
			expect(neoPixelAnimation.strips).to.have.length(3);
			neoPixelAnimation.clear();
			expect(neoPixelAnimation.strips).to.have.length(0);
		});

		it('clears the dom elements', function () {
			expect(neoPixelAnimation.$animation.children()).to.have.length(3);
			neoPixelAnimation.clear();
			expect(neoPixelAnimation.$animation.children()).to.have.length(0);
		});
	});

  xdescribe('#getUrl', function () {
    it('forms an api url from host', function () {
      neoPixelAnimation.add(new NeoPixelStrip());
      var neoPixelStrip = new NeoPixelStrip();
      neoPixelAnimation.add(neoPixelStrip);

      neoPixelAnimation.setFps(30);

      neoPixelStrip.leds[4].setRgb(42, 5, 17);
      neoPixelStrip.leds[9].setRgb(255, 0, 0);
      neoPixelStrip.leds[14].setRgb(0, 255, 0);
      neoPixelStrip.leds[21].setRgb(0, 0, 255);

      var url = neoPixelAnimation.getUrl('192.168.0.123');
      expect(url).to.equal('http://192.168.0.123/animate/33/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAfwAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAB/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    });
  });

});
