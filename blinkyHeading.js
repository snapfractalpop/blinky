$(function () {

  $blinkies = $('.blinky');
  var hueOffset = 0;

  setInterval(function () {
    var index = Math.floor(Math.random() * $blinkies.length);
    var $blinky = $($blinkies[index]);

    var hue = hueOffset + index * 20;
    hueOffset = (hueOffset + 10) % 360;

    if (Math.random() > 0.1) {
      turnOn($blinky, hue);
    } else {
      turnOff($blinky);
    }

  }, 1000);

  function turnOn($blinky, hue) {
    var isBright = Math.random() > 0.5;
    var lightness = isBright ? '70%' : '50%';

    var color = 'hsl(' + hue + ', 100%, ' + lightness + ')';
    var textShadow = isBright ? 'hsl(' + hue + ', 100%, 50%) 0 0 10px' : '';

    $blinky.css({
      color: color,
      'text-shadow': textShadow
    });
  }

  function turnOff($blinky) {
    $blinky.css({
      color: '',
      'text-shadow': ''
    });
  }

});
