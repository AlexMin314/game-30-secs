var Player = function (settings, world) {
  // Settings
  var playerDot = null;
  var playerNum = 1;
  var bullets = [];

  (function init() {
    playerDot = createDots('playerDot', playerNum);
    // Starting Point : Center
    playerDot.style.top = Math.floor(window.innerHeight / 2) + 'px';
    playerDot.style.left = Math.floor(window.innerWidth / 2) + 'px';
  }());

  // Draw Player move
  this.drawPlayerMove = function (mouse) {
    var curX = Number(playerDot.style.left.slice(0, -2));
    var curY = Number(playerDot.style.top.slice(0, -2));
    // Reducing approach speed when the cursor and playerDot are closer
    var nextX = curX + (mouse.x - 25 - curX) / settings.playerDotSpeed;
    var nextY = curY + (mouse.y - 25 - curY) / settings.playerDotSpeed;
    playerDot.style.left = nextX + "px";
    playerDot.style.top = nextY + "px";
    // Set wall boundary to player controller
    wall.apply(playerDot);
    // Collision checker for game over

  };

  // Draw Bullets
  this.shootBullets = function () {

  };

};
