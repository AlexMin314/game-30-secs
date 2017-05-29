(function (window) {

  /* Game settings */

  var settings = {}; // Containes all game settings
  settings.FPS = 60;
  settings.roundStart = 20;
  settings.roundUpTimer = FPS * 10;
  settings.roundUpSpawn = 1;
  settings.speedScale = 1.2;
  settings.roundModifier = 0.05;
  settings.playerDotSpeed = 20; // lower = faster respond
  settings.spawnFrame = 15;
  settings.godmode = false; // Debug mode


  /* World settings */
  /* DO NOT CHANGE BELOW */

  var world = {};
  // Player Dots
  world.playerList = [];
  world.playerLength = 0;
  // Enemy Dots
  world.dotList = [];
  world.dotNum = 1;
  world.dotLength = 0;
  world.spwanDist = 15;
  // Miscellaneous
  world.frame = 0; // Frames since the start of the game
  world.space = false; // for game pause

  // Controller settings
  var mouse = {};
  mouse.x = 0;
  mouse.y = 0;
  mouse.leftClick = false;

  // skill settings
  var skill = {};
  skill.q = false;
  skill.w = false;
  skill.e = false;


  /* Start game */

  // World Creation

  // PlayerSpawn
  // need to change for multiplayer
  var player = new Player(settings, world);
  world.playerList.push(player);
  world.playerLength = world.playerList.length;

  // Dot enemy spawn
  function dotSpawn() {
    if (world.frame < settings.spawnFrame * settings.roundStart) {
      if (world.frame % settings.spawnFrame === 0) {
        var i = world.frame / settings.spawnFrame;
        world.dotList[i] = new Dots(i, settings, world);
      }
      world.dotLength = world.dotList.length;
    }
    // round up??
  }

  // Draw movement
  function drawMovements() {
    for (var i = 0; i < world.playerLength; i++) {
      world.playerList[i].drawPlayerMove(mouse);
      collision.call(world.playerList[i], world.dotList, world.dotLength, true);
    }
    for (var i = 0; i < world.dotLength; i++) {
      world.dotList[i].drawDotMove();
    }
  }

  // Render Loops
  (function animloop() {
    requestAnimFrame(animloop);
    drawMovements();
    if (true) {
      dotSpawn();
    }
    world.frame++;
  }());

  // Event Listening
  function getMousePos(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  (function () {
    document.addEventListener('mousemove', getMousePos, false);
  }());

}(window));
