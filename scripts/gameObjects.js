var Player = function () {

  // Settings
  var playerDot = null;
  var bullets = [];
  // Make player Dot.
  init();

  this.drawPlayerMove = function (mouse) {
    var pRect = playerDot.getBoundingClientRect();

    var curX = Number(playerDot.style.left.slice(0,-2));
    var curY = Number(playerDot.style.top.slice(0,-2));
    var nextX = curX + (mouse.x - 25 - curX)/30;
    var nextY = curY + (mouse.y - 25 - curY)/30;

    playerDot.style.left = nextX + "px";
    playerDot.style.top = nextY + "px";

    // wall limit
    playerDot.wall();

    // collision checker?
  };

  this.shootBullets = function() {

  };


  function init() {
    playerDot = create();
    playerDot.style.top = Math.floor(window.innerHeight/2)+ 'px';
    playerDot.style.left = Math.floor(window.innerWidth/2) + 'px';
  }

  function create() {
    var newDiv = document.createElement('div');
    newDiv.className = "ball";
    document.getElementById('board').appendChild(newDiv);
    return document.getElementsByClassName('ball')[0];
  }
};

// normal enemy
var Dots = function () {
  // Settings
  var dots = null;

  function init() {
    dots = create();
    dots.style.top = Math.floor(window.innerHeight/2)+ 'px';
    dots.style.left = Math.floor(window.innerWidth/2) + 'px';
  }


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
Object.prototype.wall = function() {
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
