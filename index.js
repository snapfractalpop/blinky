$(function () {

  var HOST = '192.168.0.9';

  $('.host').on('change', function () {
    HOST = $(this).val();
    console.log(HOST);
  });

  var urls = []; // for queueing requests
  var intervalId;
  var delay = 100 // milliseconds

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

  $('.color-picker').farbtastic('.my-color');

  $('.color').on('change', function () {
    raw(fill(this.color.rgb.map(function (value) {
      return Math.floor(value * 255);
    }))); // not perfect.. oh well
  });

  $('.red').on('click', function () {raw(fill([255, 0, 0]));});
  $('.green').on('click', function () {raw(fill([0, 255, 0]));});
  $('.blue').on('click', function () {raw(fill([0, 0, 255]));});
  $('.rainbow').on('click', function () {raw(rainbow());});
  $('.off').on('click', function () {raw(fill([0, 0, 0]));});

  function fill(rgb) {
    var rgbs = [];

    var r = correct[Math.round(rgb[0] * 199 / 255)];
    var g = correct[Math.round(rgb[1] * 199 / 255)];
    var b = correct[Math.round(rgb[2] * 199 / 255)];

    for (var i = 0; i < 30; i++) {
      rgbs.push(r);
      rgbs.push(g);
      rgbs.push(b);
    }

    return rgbs;
  }

  function rainbow() {
    var color;
    var rgbs = [];

    for (var i = 0; i < 30; i++) {
      color = tinycolor({h: i * 12, s: 100, l: 50}).toRgb();
      rgbs.push(correct[Math.round(color.r * 199 / 255)]);
      rgbs.push(correct[Math.round(color.g * 199 / 255)]);
      rgbs.push(correct[Math.round(color.b * 199 / 255)]);
    }

    return rgbs;
  }

  function raw(rgbs) {
    var ledString = String.fromCharCode.apply(undefined, rgbs);
    var url = "http://" + HOST + "/raw/" + btoa(ledString);
    queueRequest(url);
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
