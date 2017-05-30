var Dots = function (dotNum, settings, world) {

  // Settings
  var dots = null;
  var x = 0;
  var y = 0;
  var radius = 0;

  // Speed/Direction Seed randomizing.
  var speedX = Math.floor(Math.random() * 4 + 2);
  var speedY = Math.floor(Math.random() * 4 + 2);
  var mult = settings.speedScale;

  // Starting Vector randomizing.
  var dx = Math.random() > 0.5 ? speedX * mult : -speedX * mult;
  var dy = Math.random() > 0.5 ? speedY * mult : -speedY * mult;

  (function init() {
    // Create an enemy dot.
    dots = createDots('dots', null, dotNum);

    // distance from the center
    var d = world.spwanDist;
    var h = window.innerHeight;
    var w = window.innerWidth;

    // Starting Point : random.
    var downside = Math.random() * (h / d) + (h * (d - 1) / d) - 25;
    var upside = Math.random() * (h / d) + 25;
    var randomSeed = Math.random() * 2 < 1 ? upside : downside;
    dots.style.top = Math.floor(randomSeed) + 'px';
    dots.style.left = Math.floor(Math.random() * (w - 100) + 50) + 'px';
    // coloring
    dots.style.backgroundColor = world.colorSeed[speedX];
  }());

  // Drawing dot movement
  this.drawDotMove = function () {
    var dRect = dots.getBoundingClientRect();
    x = dRect.left;
    y = dRect.top;
    radius = dRect.width / 2;

    // Wall bouncing
    if (x + dx > window.innerWidth - dRect.width) {
      dx = -dx;
      x = window.innerWidth - dRect.width - 2;
    }
    if (y + dy > window.innerHeight - dRect.width) {
      dy = -dy;
      y = window.innerHeight - dRect.width - 2;
    }
    if (x + dx < 0) dx = -dx;
    if (y + dy < 0) dy = -dy;
    x += dx;
    y += dy;
    dots.style.left = x + 'px';
    dots.style.top = y + 'px';
  };

  // Return Coordinate for public usage
  this.showCoordinate = function () {
    return { x: x + radius, y: y + radius, radius: radius };
  };

};

var dotSpawner = function (settings, world) {
  if (!showVar().checker) {
    world.dotList.push(new Dots(world.dotNumIdx, settings, world));
    world.dotNumIdx++;
    world.dotLength = world.dotList.length;
  }
};
