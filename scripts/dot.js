var Dots = function (dotNum, settings, world) {

  // Settings
  var dots = null;
  // Speed Seed randomizing
  var speedX = Math.floor(Math.random() * 4 + 2);
  var speedY = Math.floor(Math.random() * 4 + 2);
  var mult = settings.speedScale;
  // Starting Vector randomizing
  var dx = Math.random() > 0.5 ? speedX * mult : -speedX * mult;
  var dy = Math.random() > 0.5 ? speedY * mult : -speedY * mult;
  // Coloring the dots
  var colorSeed = [, , 'rgb(0, 255, 18)', 'rgb(0, 247, 255)', 'rgb(250, 255, 0)', 'rgb(214, 18, 231)'];
  var colorSelect = colorSeed[speedX];

  (function init() {
    dots = createDots('dots', null, dotNum);
    // Starting Point : random + avoiding center
    var h = window.innerHeight;
    var w = window.innerWidth;
    var d = world.spwanDist;
    var downside = Math.random() * (h / d) + (h * (d - 1) / d) - 25;
    var upside = Math.random() * (h / d) + 25;
    var randomSeed = Math.random() * 2 < 1 ? upside : downside;
    dots.style.top = Math.floor(randomSeed) + 'px';
    dots.style.left = Math.floor(Math.random() * (w - 100) + 50) + 'px';
    dots.style.backgroundColor = colorSelect;
  }());

  // Drawing dot movement
  this.drawDotMove = function () {
    var dRect = dots.getBoundingClientRect();
    var x = dRect.left;
    var y = dRect.top;
    // Wall bouncing
    if (x + dx > window.innerWidth - dRect.width) {
      dx = -dx;
      // prevent ball disapearing when resizing browser
      // need to research on Pause mode
      x = window.innerWidth - dRect.width - 2;
    }
    if (x + dx < 0) {
      dx = -dx;
    }
    if (y + dy > window.innerHeight - dRect.width) {
      dy = -dy;
      y = window.innerHeight - dRect.width - 2;
    }
    if (y + dy < 0) {
      dy = -dy;
    }
    x += dx;
    y += dy;
    dots.style.left = x + 'px';
    dots.style.top = y + 'px';
  };

};

// following enemy Constructor
var FollowingDots = function () {

};
