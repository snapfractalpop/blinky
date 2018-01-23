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

  $('.clear').on('click', function (event) {
    event.preventDefault();
    neoPixelAnimation.clear();
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

  /*
  window.islanders = function () {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 15; j++) {
        if (Math.floor((j + i) / 3) % 2 == 0) {
          neoPixelStrip.leds[j].setRgb(0, 153, 255);
          neoPixelStrip.leds[29 - j].setRgb(0, 153, 255);
        } else {
          neoPixelStrip.leds[j].setRgb(255, 153, 0);
          neoPixelStrip.leds[29 - j].setRgb(255, 153, 0);
        }
      }
      neoPixelAnimation.add(neoPixelStrip.clone());
    }
  };
  */
  window.islanders = function () {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 15; j++) {
        if (((j + i) / 2) % 3 == 0) {
          neoPixelStrip.leds[j].setRgb(tinycolor('#00529B'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#00529B'));
        } else if (((j + i - 2) / 2) % 3 == 0) {
          neoPixelStrip.leds[j].setRgb(tinycolor('#F57D31'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#F57D31'));
        } else if (((j + i - 4) / 2) % 3 == 0) {
          neoPixelStrip.leds[j].setRgb(tinycolor('#FFFFFF'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#FFFFFF'));
        } else {
          neoPixelStrip.leds[j].setRgb(0, 0, 0);
          neoPixelStrip.leds[29 - j].setRgb(0, 0, 0);
        }
      }
      neoPixelAnimation.add(neoPixelStrip.clone());
    }
  };

  window.mets = function () {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 15; j++) {
        if (((j + i) / 2) % 3 == 0) {
          neoPixelStrip.leds[j].setRgb(tinycolor('#002D72'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#002D72'));
        } else if (((j + i - 2) / 2) % 3 == 0) {
          neoPixelStrip.leds[j].setRgb(tinycolor('#FF5910'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#FF5910'));
        } else if (((j + i - 4) / 2) % 3 == 0) {
          neoPixelStrip.leds[j].setRgb(tinycolor('#FFFFFF'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#FFFFFF'));
        } else {
          neoPixelStrip.leds[j].setRgb(0, 0, 0);
          neoPixelStrip.leds[29 - j].setRgb(0, 0, 0);
        }
      }
      neoPixelAnimation.add(neoPixelStrip.clone());
    }
  };

  window.bills = function () {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 15; j++) {
        if (Math.floor((j + i) / 2) % 3 == 0) {
          neoPixelStrip.leds[j].setRgb(tinycolor('#00338D'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#00338D'));
        } else if (Math.floor((j + i - 2) / 2) % 3 == 0) {
          neoPixelStrip.leds[j].setRgb(tinycolor('#C60C30'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#C60C30'));
        } else {
          neoPixelStrip.leds[j].setRgb(tinycolor('#FFFFFF'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#FFFFFF'));
        }
      }
      neoPixelAnimation.add(neoPixelStrip.clone());
    }
  };

  window.jets = function () {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 15; j++) {
        if (Math.floor((j + i) / 3) % 2 == 0) {
          neoPixelStrip.leds[j].setRgb(40, 184, 76);
          neoPixelStrip.leds[29 - j].setRgb(40, 184, 76);
        } else {
          neoPixelStrip.leds[j].setRgb(tinycolor('#FFFFFF'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#FFFFFF'));
        }
      }
      neoPixelAnimation.add(neoPixelStrip.clone());
    }
  };

  window.bills1 = function () {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 15; j++) {
        if (((j + i) / 2) % 3 == 0) {
          neoPixelStrip.leds[j].setRgb(tinycolor('#00338D'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#00338D'));
        } else if (((j + i - 2) / 2) % 3 == 0) {
          neoPixelStrip.leds[j].setRgb(tinycolor('#C60C30'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#C60C30'));
        } else if (((j + i - 4) / 2) % 3 == 0) {
          neoPixelStrip.leds[j].setRgb(tinycolor('#FFFFFF'));
          neoPixelStrip.leds[29 - j].setRgb(tinycolor('#FFFFFF'));
        } else {
          neoPixelStrip.leds[j].setRgb(0, 0, 0);
          neoPixelStrip.leds[29 - j].setRgb(0, 0, 0);
        }
      }
      neoPixelAnimation.add(neoPixelStrip.clone());
    }
  };

});
