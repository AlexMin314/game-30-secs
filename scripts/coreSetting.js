(function (window) {

  /* Game settings */

  var settings = {};
  settings.FPS = 60;
  settings.roundStart = 2;
  settings.roundStartMax = 20;
  settings.roundUpTimer = 1500; // ms
  settings.roundUpSpawn = 1;
  settings.speedScale = 1.2;
  settings.roundModifier = 0.05;
  settings.playerDotSpeed = 20; // lower = faster respond
  settings.spawnSpeed = 500; // ms
  // Debug mode
  settings.godmode = true;

  /* DO NOT CHANGE BELOW */

  /* World settings */

  var world = {};
  // Player Dots
  world.playerList = [];
  world.playerLength = 0;
  // Enemy Dots
  world.dotList = [];
  world.dotNumIdx = 0;
  world.dotLength = 0;
  world.spwanDist = 120;
  world.colorSeed = [, , '#14ff00', '#00fff7', '#faff00', '#ff00de'];
  // Miscellaneous
  world.score = 0;
  world.start = false;
  world.gameOver = false;
  world.spaceBar = false;

  // Controller settings
  var mouse = {};
  mouse.x = 0;
  mouse.y = 0;
  mouse.leftClick = false;

  // skill settings
  var skill = {};
  skill.q = false;
  skill.w = false;


  /* DOM element variable */

  var scoreBoard;
  var dotNumBoard;
  var startButtonText;


  /* Game Starter functions */

  function gameStarter() {
    document.getElementById('board').removeChild(startButtonText);
    world.start = true;
    dotSpawnStart();
    setInterval(function() {
      world.score++;
    }, 1000)
  }

  // Dot enemy spawn
  function dotSpawnStart() {
    // initial spawn
    for (var i = 0; i < settings.roundStart; i++) {
      dotSpawner(settings, world);
    }
    // addtional spawn
    var moreSpawns = setInterval(function () {
      for (var i = 0; i < settings.roundUpSpawn; i++) {
        dotSpawner(settings, world);
        if (world.dotLength === settings.roundStartMax) clearInterval(moreSpawns);
      }
    }, settings.roundUpTimer);
  }


  // Draw movement of player and dots
  function drawMovements() {
    world.playerList.map(function (e, i, arr) {
      collision.call(e, world.dotList, world, settings, true);
      return e.drawPlayerMove(mouse);
    });
    world.dotList.map(function (e) {
      return e.drawDotMove();
    });
  }


  /* Board init start! */

  // Display Start Button.
  startButton();
  // Display Score + Dot number.
  boardInfo(world);
  // PlayerSpawn
  playerSpawner(settings, world);

  scoreBoard = document.getElementById('score');
  dotNumBoard = document.getElementById('dotNum');


  /* Render Loops */

  (function renderLoop() {
    requestAnimFrame(renderLoop);
    // Check start button is pressed.
    if (world.start) {
      drawMovements();
      updatingBoard(scoreBoard, dotNumBoard, world);
    }
  }());


  /* Event Listener related */

  function getMousePos(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function startClick(e) {
    // Remove click events
    document.getElementById('gameStart').removeEventListener('click', startClick, false);
    document.getElementById('playerDot1').removeEventListener('click', startClick, false);

    startButtonText = document.getElementById('gameStart');
    // Loading start messages.
    tutorial(startButtonText);
    setTimeout(function () {
      // removing start button and start game.
      gameStarter();
    }, 2900);
  }

  (function () {
    document.addEventListener('mousemove', getMousePos, false);
    document.getElementById('gameStart').addEventListener('click', startClick, false);
    document.getElementById('playerDot1').addEventListener('click', startClick, false);
  }());

}(window));
