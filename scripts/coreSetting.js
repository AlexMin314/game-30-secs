(function (window) {

  /* Game settings */

  var settings = {}; // Containes all game settings
  settings.godmode = false; // Debug mode

  settings.FPS = 60;
  settings.roundStart = 20;
  settings.roundUpTimer = settings.FPS * 20;
  settings.roundUpSpawn = 1;
  settings.speedScale = 1.2;
  settings.roundModifier = 0.05;
  settings.playerDotSpeed = 20; // lower = faster respond
  settings.spawnFrame = 10;


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
  world.dotIndexSave = 0;
  world.spwanDist = 50;
  // Miscellaneous
  world.frame = 0; // Frames since the start of the game
  world.space = false; // for game pause
  world.score = 0;
  world.dotNum = 0;
  world.start = false;
  world.gameOver = false;

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
  startButton();

  // World Creation
  gameStarter(world);
  var scoreBoard = document.getElementById('score');
  var dotNumBoard = document.getElementById('dotNum');

  // PlayerSpawn
  // need to change for multiplayer
  var player = new Player(settings, world);
  world.playerList.push(player);
  world.playerLength = world.playerList.length;

  // Dot enemy spawn
  function dotSpawn() {
    var limiter = settings.spawnFrame * settings.roundStart;
    // Starter Dots spawns
    if (world.frame < limiter && world.frame % settings.spawnFrame === 0) {
      var i = Math.floor(world.frame / settings.spawnFrame);
      world.dotList[i] = new Dots(i, settings, world);
      world.dotLength = world.dotList.length;
      world.dotIndexSave = world.dotLength;
    }
    // Round scale up spawns
    if (world.frame >= limiter && world.frame % settings.roundUpTimer === 0) {
      var j = Math.floor((world.frame - limiter) / settings.roundUpTimer);
      j += world.dotIndexSave;
      world.dotList.push(new Dots(j, settings, world));
      world.dotLength = world.dotList.length;
    }
  }

  // Draw movement
  function drawMovements() {
    world.playerList.map(function (e, i, arr) {
      collision.call(e, world.dotList, world, settings, true);
      return e.drawPlayerMove(mouse);
    });
    world.dotList.map(function (e) {
      return e.drawDotMove();
    });
  }

  // Render Loops
  (function animloop() {
    requestAnimFrame(animloop);
    // Check start button is pressed or not.
    if (world.start) {
      drawMovements();
      dotSpawn();
      updatingBoard(scoreBoard, dotNumBoard, world);
      if (!window.showChecker().checker) {
        world.frame++;
        world.score = Math.floor(world.frame / settings.FPS);
        world.dotNum = world.dotLength;
      }
      // ending Spawn?
    }
  }());


  // Event Listening
  function getMousePos(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function startClick(e) {
    // Remove click events
    document.getElementById('gameStart').removeEventListener('click', startClick, false);
    document.getElementById('playerDot1').removeEventListener('click', startClick, false);

    var startButtonText = document.getElementById('gameStart');
    // Loading start messages.
    tutorial(startButtonText);
    // removing start button div
    setTimeout(function () {
      document.getElementById('board').removeChild(startButtonText);
      return world.start = true;
    }, 2900);
  }

  (function () {
    document.addEventListener('mousemove', getMousePos, false);
    document.getElementById('gameStart').addEventListener('click', startClick, false);
    document.getElementById('playerDot1').addEventListener('click', startClick, false);
  }());

}(window));
