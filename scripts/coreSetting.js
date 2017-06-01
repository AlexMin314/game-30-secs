(function (window) {

  /* Game settings */

  var settings = {};
  settings.FPS = 60;
  // Dots
  settings.roundStart = 3; // num
  settings.roundStartMax = 15; // num
  settings.roundUpTimer = 1500; // ms
  settings.roundUpSpawn = 1; // num
  settings.speedScale = 1.2; // multiplyer
  settings.spawnSpeed = 3500; // ms
  settings.bounceBuffer = 1; // num
  // bonus
  settings.bonusSpawn = 1; // num
  settings.bonusMax = 2; // num
  settings.bonusSpawnSpeed = 4500; // ms
  // Player related
  settings.playerDotSpeed = 20; // lower = faster respond
  // Debug mode - don't touch.
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
  world.bonusCounter = 0;
  // Line Event
  world.lineEvent = false;
  world.dot1 = null;
  world.dot2 = null;
  world.lineEventTimer = 31000;
  // Miscellaneous
  world.thirtySec = 30000;
  world.score = 0;
  world.pause = false;
  world.pauseLimit = 3;
  world.sound = true;
  world.gameOver = false;
  world.spaceBar = false;
  world.clickSound = null;

  // Controller settings
  var mouse = {};
  mouse.x = 0;
  mouse.y = 0;

  // Skill settings
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
    // Remove start screen.
    document.getElementById('board').removeChild(theWrapper);
    world.start = true;

    // Display Score + Dot number.
    boardInfo(world);
    scoreBoard = document.getElementById('score');
    dotNumBoard = document.getElementById('dotNum');

    // Initial dot spawn.
    for (var k = 0; k < settings.roundStart; k++) {
      dotSpawner(settings, world, false);
    }

    // Dot spwan
    setInterval(function () {
      dotSpawnStart();
    }, settings.spawnSpeed)

    // Bonuse spwan
    setInterval(function () {
      bonusSpawnStart();
    }, settings.bonusSpawnSpeed)

    // Line event triggering
    setTimeout(function () {
      lineEventTrigger(world);
    }, world.lineEventTimer)

    // 30 Sec checker
    world.thirtySecBeep = setInterval(function () {
      showVar().countBeep.play();
    }, world.thirtySec)

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

  // Bonus spawn
  function bonusSpawnStart() {
    if (world.bonusLength < settings.bonusMax) {
      for (var j = 0; j < settings.bonusSpawn; j++) {
        dotSpawner(settings, world, true);
      }
    }
  }


  // Draw movement of player and dots
  function drawMovements() {
    // player movement.
    world.playerList.map(function (e, i, arr) {
      collision.call(e, world.dotList, world, settings, true, false);
      collision.call(e, world.bonus, world, settings, true, true);
      return e.drawPlayerMove(mouse);
    });
    // dot(enemy) movement.
    world.dotList.map(function (e) {
      return e.drawDotMove();
    });
    // bonus(star) movement.
    world.bonus.map(function (e) {
      return e.drawDotMove();
    });
    // line(enemy) movement.
    if (world.lineEvent) drawLine(world.dot1.showInfo().x, world.dot1.showInfo().y, world.dot2.showInfo().x, world.dot2.showInfo().y, 'line');
  }


  /* Board init start! */

  // Display Start Button.
  startButton();
  // PlayerSpawn
  //playerSpawner(settings, world);
  // Background sound Start
  backgroundSound(world, world.gameOver);
  // Append some sound effect
  audioTagHelper('star1', './src/star.mp3', false, false);
  audioTagHelper('star2', './src/star.mp3', false, false);
  audioTagHelper('counter', './src/count.mp3', false, false);
  audioTagHelper('clicked', './src/clicked.mp3', false, false);
  world.clickSound = document.getElementById('clicked');

  /* Render Loops */

  (function renderLoop() {
    requestAnimFrame(renderLoop);
    // Checking start:true, pause:false, gameoverChecker: false.
    if (world.start && !world.pause && !showVar().checker) {
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
    // Removing click events.
    document.getElementById('gameStart').removeEventListener('click', startClick, false);
    //document.getElementById('playerDot1').removeEventListener('click', startClick, false);

    world.clickSound.play();

    theWrapper = showVar().wrapper;
    startButtonText = document.getElementById('gameStart');

    // Removing sound, debug button.
    theWrapper.removeChild(showVar().sound);
    theWrapper.removeChild(showVar().godMode);

    // Showing start messages.
    tutorial(startButtonText, world);

    setTimeout(function () {
      // Removing start button and start game.
      playerSpawner(settings, world);
      document.getElementById('playerDot1').addEventListener('click', startClick, false);
      gameStarter();
    }, 3000);
  }

  function soundButton(e) {
    world.clickSound.play();
    world.sound = !(world.sound);
    soundOnOff(world);
    backgroundSound(world);
  }

  function godButton(e) {
    world.clickSound.play();
    settings.godmode = !(settings.godmode);
    godOnOff(settings);
  }

  // press spaceBar = pause
  function gamePause(e) {
    if (e.keyCode === 32 && world.pauseLimit > 0 && world.start) {
      world.clickSound.play();
      world.pause = !world.pause;
      world.pauseLimit -= 0.5;
      gamePauseScreen(world);
    }
  }

  (function () {
    document.addEventListener('mousemove', getMousePos, false);
    document.addEventListener('keydown', gamePause, false);
    document.getElementById('gameStart').addEventListener('click', startClick, false);
    document.getElementById('sound').addEventListener('click', soundButton, false);
    document.getElementById('godmode').addEventListener('click', godButton, false);
    //document.getElementById('playerDot1').addEventListener('click', startClick, false);
  }());

}(window));
