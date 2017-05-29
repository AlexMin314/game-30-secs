var Player = function (settings, world) {
  // Settings
  var playerDot = null;
  var playerNum = 1;
  var bullets = [];
  var pX = 0;
  var pY = 0;
  var pRadius = 0;

  (function init() {
    playerDot = createDots('playerDot', playerNum);
    // Starting Point : Center
    playerDot.style.top = Math.floor(window.innerHeight / 2) + 'px';
    playerDot.style.left = Math.floor(window.innerWidth / 2) + 'px';
  }());

  // Draw Player move
  this.drawPlayerMove = function (mouse) {
    var pRect = playerDot.getBoundingClientRect();
    pRadius = pRect.width / 2;
    pX = pRect.left;
    pY = pRect.top;
    // Reducing approach speed when the cursor and playerDot are closer
    var nextX = pX + (mouse.x - 25 - pX) / settings.playerDotSpeed;
    var nextY = pY + (mouse.y - 25 - pY) / settings.playerDotSpeed;
    playerDot.style.left = nextX + "px";
    playerDot.style.top = nextY + "px";

    // Set wall boundary to player controller
    wall.apply(playerDot);
    // Collision checker for game over
  };


  // Draw Bullets
  this.shootBullets = function () {

  };

  this.showCoordinate = function() {
    return {x: pX + pRadius, y: pY + pRadius, radius: pRadius};
  };

};
