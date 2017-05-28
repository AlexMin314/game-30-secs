(function (window) {

  window.Player = function () {
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

    this.drawPlayerMove = function (mouse) {
      var curX = Number(playerDot.style.left.slice(0, -2));
      var curY = Number(playerDot.style.top.slice(0, -2));
      var nextX = curX + (mouse.x - 25 - curX) / 20;
      var nextY = curY + (mouse.y - 25 - curY) / 20;

      playerDot.style.left = nextX + "px";
      playerDot.style.top = nextY + "px";

      // Set wall boundary to player contoller
      wall.apply(playerDot);

      // collision checker?
    };

    this.shootBullets = function () {

    };

  }
}(window));
