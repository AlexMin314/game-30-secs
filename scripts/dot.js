var Dots = function (dotNum, settings, world, bonus) {

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
    dots = bonus ? createDots('bonus', null, dotNum) : createDots('dots', null, dotNum);

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
    if (!bonus) dots.style.backgroundColor = world.colorSeed[speedX];
    if (bonus) dots.innerHTML = '<i class="fa fa-star fa-spin"></i>';
  }());

  // Drawing dot movement
  this.drawDotMove = function () {
    var dRect = dots.getBoundingClientRect();
    x = dRect.left;
    y = dRect.top;
    radius = dRect.width / 2;

    // Wall bouncing
    if (x + dx > window.innerWidth - dRect.width - settings.bounceBuffer) {
      dx = -dx;
      x = window.innerWidth - dRect.width - 3 * settings.bounceBuffer;
    }
    if (y + dy > window.innerHeight - dRect.width - settings.bounceBuffer) {
      dy = -dy;
      y = window.innerHeight - dRect.width - 3 * settings.bounceBuffer;
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

var dotSpawner = function (settings, world, bonus) {
  // enemy dot
  if (!showVar().checker && bonus === false) {
    world.dotList.push(new Dots(world.dotNumIdx, settings, world, bonus));
    world.dotNumIdx++;
    world.dotLength = world.dotList.length;
  }
  // bonus dot
  if (!showVar().checker && bonus === true) {
    world.bonus.push(new Dots(world.bonusIdx, settings, world, bonus));
    world.bonusIdx++;
    world.bonusLength = world.bonus.length;
  }
};
