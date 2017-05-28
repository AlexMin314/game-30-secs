(function (window) {

  /* Game settings */
  var settings = {}; // Containes all game settings
  settings.round = 1;
  settings.speedScale = 0.8;
  settings.godmode = false; // Debug mode


  /* World settings - DO NOT CHANGE BELOW */
  var world = {};
  // Player Dots
  world.playerList = [];
  var player = new Player(); // need to change for multiplayer
  world.playerList.push(player);
  world.playerLength = world.playerList.length;
  // Enemy Dots
  world.dotList = [];
  world.dotNum = 1;
  world.dotLength = 0;
  // Miscellaneous
  world.frame = 0; // Frames since the start of the game
  world.space = false;

  // Vector settings
  var mouse = {};
  mouse.x = 0;
  mouse.y = 0;
  mouse.click = false;

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


  /* Start game */

  // need to change round or second base
  function dotSpawn() {
    if (world.frame % 24 === 0 && world.frame < 480) {
      var i = world.frame / 24;
      world.dotList[i] = new Dots(i, settings.speedScale);
    }
    world.dotLength = world.dotList.length;
  }

  function draw() {
    for (var i = 0; i < world.playerLength; i++) {
      world.playerList[i].drawPlayerMove(mouse);
    }
    for (var i = 0; i < world.dotLength; i++) {
      world.dotList[i].drawDotMove();
    }
  }

  (function animloop() {
    requestAnimFrame(animloop);
    dotSpawn();
    draw();
    world.frame++;
  }());

  function getMousePos(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  (function () {
    document.addEventListener('mousemove', getMousePos, false);
  }());


}(window));
