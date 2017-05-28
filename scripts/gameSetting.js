(function () {

  // Game settings
  var settings = {}; // Containes all game settings
  settings.round = 1;
  settings.roundScaleSpeed = 1.2;
  settings.godmode = false; // Debug mode

  // World settings
  var frame = 0; // Frames since the start of the game
  var playerList = [];
  //var playerNumber = 1;
  if (true) {
    var player = new Player();
    playerList.push(player);
  }
  var pLength = playerList.length;

  var dotsList = [];
  if (true) {
    for(var i = 0; i < settings.round * 1; i++) {
      dotsList[i] = new Dots();
    }
  }

  // Vector settings
  var mouse = {};
  mouse.x = 0;
  mouse.y = 0;
  mouse.click = false;

  var speed = {};
  speed.x = 0;
  speed.y = 0;
  speed.totalx = 0;
  speed.totaly = 0;

  var accel = {};
  accel.x = 0;
  accel.y = 0;
  accel.amount = 0.005;
  accel.max = 1;

  // skill settings
  var skill = {};
  skill.q = false;
  skill.w = false;
  skill.e = false;
  skill.space = false;


  // Cross browsing
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  // Polypill here

  // Custom method here

  // Start game
  drawGame(mouse, playerList, pLength);

}());
