(function (window) {

  /* Game settings */

  var settings = {};
  settings.FPS = 60;
  // Dots
  settings.roundStart = 3;
  settings.roundStartMax = 15;
  settings.roundUpTimer = 1500; // ms
  settings.roundUpSpawn = 1;
  settings.speedScale = 1.2;
  settings.spawnSpeed = 2000; // ms
  settings.bounceBuffer = 1;
  // bonus
  settings.bonusSpawn = 1;
  settings.bonusMax = 2;
  settings.bonusSpawnSpeed = 4000;
  // Player related
  settings.playerDotSpeed = 20; // lower = faster respond
  // Debug mode
  settings.godmode = false;

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
  world.spwanDist = 70;
  world.colorSeed = [, , '#14ff00', '#00fff7', '#faff00', '#ff00de'];
  // Bonus obj
  world.bonus = [];
  world.bonusIdx = 0;
  world.bonusLength = 0;
  world.bonusScore = 100;
  // Miscellaneous
  world.score = 0;
  world.start = false;
  world.sound = true;
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
  var theWrapper;


  /* Game Starter functions */

  function gameStarter() {
    document.getElementById('board').removeChild(theWrapper);
    world.start = true;
    // Display Score + Dot number.
    boardInfo(world);
    scoreBoard = document.getElementById('score');
    dotNumBoard = document.getElementById('dotNum');

    // initial dot spawn
    for (var k = 0; k < settings.roundStart; k++) {
      dotSpawner(settings, world, false);
    }

    // Dot spwan
    setInterval(function () {
      dotSpawnStart();
    }, settings.spawnSpeed)

    // bonuse spwan
    setInterval(function () {
      bonusSpawnStart();
    }, settings.bonusSpawnSpeed)

    // Score Tracking
    setInterval(function () {
      world.score++;
    }, 1000)
  }

  // Dot enemy spawn
  function dotSpawnStart() {
    if (world.dotLength < settings.roundStartMax) {
      for (var i = 0; i < settings.roundUpSpawn; i++) {
        dotSpawner(settings, world, false);
      }
    }
  }

  // bonus spawn
  function bonusSpawnStart() {
    if (world.bonusLength < settings.bonusMax) {
      for (var j = 0; j < settings.bonusSpawn; j++) {
        dotSpawner(settings, world, true);
      }
    }
  }


  // Draw movement of player and dots
  function drawMovements() {
    world.playerList.map(function (e, i, arr) {
      collision.call(e, world.dotList, world, settings, true, false);
      collision.call(e, world.bonus, world, settings, true, true);
      return e.drawPlayerMove(mouse);
    });
    world.dotList.map(function (e) {
      return e.drawDotMove();
    });
    world.bonus.map(function (e) {
      return e.drawDotMove();
    });
  }


  /* Board init start! */

  // Display Start Button.
  startButton();
  // PlayerSpawn
  playerSpawner(settings, world);
  // Background sound Start
  backgroundSound(world, false);

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

    theWrapper = showVar().wrapper;
    startButtonText = document.getElementById('gameStart');

    theWrapper.removeChild(showVar().sound);
    theWrapper.removeChild(showVar().godMode);

    // Loading start messages.
    tutorial(startButtonText);
    setTimeout(function () {
      // removing start button and start game.
      gameStarter();
    }, 2900);
  }

  function soundButton(e) {
    world.sound = !(world.sound);
    soundOnOff(world);
    backgroundSound(world);
  }

  function godButton(e) {
    settings.godmode = !(settings.godmode);
    godOnOff(settings);
  }

  (function () {
    document.addEventListener('mousemove', getMousePos, false);
    document.getElementById('gameStart').addEventListener('click', startClick, false);
    document.getElementById('sound').addEventListener('click', soundButton, false);
    document.getElementById('godmode').addEventListener('click', godButton, false);
    document.getElementById('playerDot1').addEventListener('click', startClick, false);
  }());

}(window));
