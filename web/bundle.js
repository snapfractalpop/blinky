(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(function () {
  var NeoPixelStrip = require('./lib/neoPixelStrip.js');
  var NeoPixelAnimation = require('./lib/neoPixelAnimation.js');

  var host = localStorage.getItem('host') || '192.168.0.9';

  $('.settings-modal').on('show.bs.modal', function () {
    $('.host').val(host);
  });

  $('.settings-modal').on('click', '.settings-save', function () {
    host = $('.host').val();
    localStorage.setItem('host', host);
  });

  var neoPixelStrip = new NeoPixelStrip(30);
  $('.strip-container').append(neoPixelStrip.$strip);

  var neoPixelAnimation = new NeoPixelAnimation();
  $('.animation-container').append(neoPixelAnimation.$animation);

  var urls = []; // for queueing requests
  var intervalId;
  var delay = 100 // milliseconds

  $('.color-picker').farbtastic(function (color) {
    $('.my-color').css('background-color', color);
    neoPixelStrip.fill(tinycolor(color));
  })

  $('.color').on('change', function () {
    console.log(arguments);
    /*
    neoPixelStrip.fill(this.color.rgb.map(function (value) {
      return Math.floor(value * 255);
    })); // not perfect.. oh well
    */
  });

  $('.red').on('click', function (event) {
    event.preventDefault();
    neoPixelStrip.fill(255, 0, 0);
  });

  $('.green').on('click', function (event) {
    event.preventDefault();
    neoPixelStrip.fill(0, 255, 0);
  });

  $('.blue').on('click', function (event) {
    event.preventDefault();
    neoPixelStrip.fill(0, 0, 255);
  });

  $('.rainbow').on('click', function (event) {
    event.preventDefault();
    rainbow();
  });

  $('.off').on('click', function (event) {
    event.preventDefault();
    neoPixelStrip.fill(0, 0, 0);
  });

  $('.send').on('click', function (event) {
    event.preventDefault();
    queueRequest(neoPixelStrip.getUrl(host));
  });

  $('.add').on('click', function (event) {
    event.preventDefault();
    neoPixelAnimation.add(neoPixelStrip.clone());
  });

  $('.animate').on('click', function (event) {
    event.preventDefault();
    queueRequest(neoPixelAnimation.getUrl(host));
  });

  $('.fps').on('change', function (event) {
    event.preventDefault();
    neoPixelAnimation.setFps($(this).val());
  });



  function rainbow() { // TODO: generalize for different strip sizes
    for (var i = 0; i < 30; i++) {
      neoPixelStrip.leds[i].setRgb(tinycolor({h: i * 12, s: 100, l: 50}));
    }
  }

  function setRGB(rgb) {
    rgb = rgb.map(function (value) {
      return Math.round(value * 199 / 255); // down from 255 until a better PSU
    }) // not perfect.. oh well


    var r = correct[rgb[0]];
    var g = correct[rgb[1]];
    var b = correct[rgb[2]];
    var url = "http://" + HOST + "/rgb/" + r + "/" + g + "/" + b + "/";

    //console.log("rgb in       : [%s, %s, %s]", rgb[0], rgb[1], rgb[2]);
    ////console.log("rgb corrected: [%s, %s, %s]", r, g, b);
    //console.log("url: %s", url);

    queueRequest(url);
  }

  var callcount = 0;
  function queueRequest(url) {
    urls.push(url);
    if (!intervalId) {
      //console.log(intervalId);
      intervalId = setInterval(processRequest, delay);
    }
  }

  function processRequest() {
    if (urls.length == 0) {
      clearInterval(intervalId);
      intervalId = false;
    } else {
      console.log("url: %s", urls[0]);
      $.get(urls.shift());
    }
  }

  window.q = queueRequest;

});

},{"./lib/neoPixelAnimation.js":3,"./lib/neoPixelStrip.js":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./neoPixelStrip":4}],4:[function(require,module,exports){
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

},{"./neoPixel":2}]},{},[1]);
