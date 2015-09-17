$(function () {
  var NeoPixelStrip = require('./lib/neoPixelStrip.js');

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

});
