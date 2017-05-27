var Player = function (mouse) {

  // Settings
  var playerDot = null;
  var bullets = [];
  init();




  this.drawPlayerMove = function (mouse) {
    var ballRect = playerDot.getBoundingClientRect();

    var curX = Number(playerDot.style.left.slice(0,-2));
    var curY = Number(playerDot.style.top.slice(0,-2));
    var nextX = curX + (mouse.x - curX)/30;
    var nextY = curY + (mouse.y - curY)/30;

    playerDot.style.left = nextX + "px";
    playerDot.style.top = nextY + "px";

    // wall limit
    var w = parseInt(window.innerWidth);
    var h = parseInt(window.innerHeight);

    if (ballRect.bottom > h) {
      playerDot.style.top = (h - ballRect.height) + 'px';
    }

    if (ballRect.top < 0) {
      playerDot.style.top = '0px';
    }

    if (ballRect.left < 0) {
      playerDot.style.left = '0px';
    }

    if (ballRect.right > w) {
      playerDot.style.left = (w - ballRect.width) + 'px';
    }
  };

  function init() {
    // create();
    playerDot = document.getElementById('ball');
    playerDot.style.top = '400px';
    playerDot.style.left = '400px';
    //playerDot.style.height = '100px';

  }

};

var Dots = function () {

};

var Bombs = function () {

};

var Snowflake = function () {

};
