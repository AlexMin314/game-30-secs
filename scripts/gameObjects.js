var Player = function () {

  // Settings
  var playerDot = null;
  var playerNum = 1;
  var bullets = [];
  // Make player Dot.
  init();

  this.drawPlayerMove = function (mouse) {
    var curX = Number(playerDot.style.left.slice(0, -2));
    var curY = Number(playerDot.style.top.slice(0, -2));
    var nextX = curX + (mouse.x - 25 - curX) / 30;
    var nextY = curY + (mouse.y - 25 - curY) / 30;

    playerDot.style.left = nextX + "px";
    playerDot.style.top = nextY + "px";

    // wall limit
    playerDot.wall();

    // collision checker?
  };

  this.shootBullets = function () {

  };

  function init() {
    playerDot = createDots('playerDot', playerNum);
    // Starting Point : Center
    playerDot.style.top = Math.floor(window.innerHeight / 2) + 'px';
    playerDot.style.left = Math.floor(window.innerWidth / 2) + 'px';
  }

};

// normal enemy
var Dots = function (dotNum) {
  // Settings
  var dots = null;

  var speed = Math.floor(Math.random() * 4 + 2);
  var multi = 1.0;
  var dx = Math.random() > 0.5 ? speed*multi : -speed*multi;
  var dy = Math.random() > 0.5 ? speed*multi : -speed*multi;

  var colorSeed = [,, 'green', 'blue', 'white', 'yellow'];
  var colorSelect = colorSeed[speed];

  init();

  function init() {
    dots = createDots('dots', null, dotNum);
    // Starting Point : random
    var h = window.innerHeight;
    var w = window.innerWidth;
    var downside = Math.random() * (h / 7) + (h * 6 / 7) - 25;
    var upside = Math.random() * (h / 7) + 25;
    var randomSeed = Math.random() * 2 < 1 ? upside : downside;
    dots.style.top = Math.floor(randomSeed) + 'px';
    dots.style.left = Math.floor(Math.random() * (w - 100) + 50) + 'px';
    dots.style.backgroundColor = colorSelect;
  }

  this.drawDotMove = function () {
    var dRect = dots.getBoundingClientRect();
    var x = dRect.left;
    var y = dRect.top;

    if (x + dx >= window.innerWidth - 20 || x + dx <= 0) {
      dx = -dx;
    }
    if (y + dy >= window.innerHeight - 20 || y + dy <= 0) {
      dy = -dy;
    }

    x += dx;
    y += dy;
    dots.style.left = x + 'px';
    dots.style.top = y + 'px';
  };

};

// following enemy
var FollowingDots = function () {

}


// juicy
var Boss = function () {

};

var Bombs = function () {

};

var Snowflake = function () {

};


// Gives wall limit
Object.prototype.wall = function () {
  var rect = this.getBoundingClientRect();
  var w = Math.floor(window.innerWidth);
  var h = Math.floor(window.innerHeight);

  if (rect.bottom > h) {
    this.style.top = (h - rect.height) + 'px';
  }
  if (rect.top < 0) {
    this.style.top = '0px';
  }
  if (rect.left < 0) {
    this.style.left = '0px';
  }
  if (rect.right > w) {
    this.style.left = (w - rect.width) + 'px';
  }
}

Object.prototype.createDots = function (type, pNum, dNum) {
  var newDiv = document.createElement('div');
  newDiv.className = type;
  newDiv.id = type + (type === 'playerDot' ? pNum : dNum);
  document.getElementById('board').appendChild(newDiv);
  return document.getElementById(newDiv.id);
}

Object.prototype.clearDots = function () {

}
