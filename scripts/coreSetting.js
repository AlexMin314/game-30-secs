(function (window) {

  /* Game settings */

  var settings = {};
  settings.FPS = 60;
  // Dots(emeny).
  settings.roundStart = 3; // num
  settings.roundStartMax = 18; // num
  settings.roundUpTimer = 1500; // ms
  settings.roundUpSpawn = 1; // num
  settings.speedScale = 1.2; // multiplyer
  settings.spawnSpeed = 3500; // ms
  settings.bounceBuffer = 5; // px
  // Bonus(star).
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
  // Player Dot.
  world.playerList = [];
  world.playerLength = 0;
  // Enemy Dots.
  world.dotList = [];
  world.dotNumIdx = 0;
  world.dotLength = 0;
  world.spwanDist = 70;
  world.colorSeed = [, , '#14ff00', '#00fff7', '#faff00', '#ff00de'];
  // Bonus(Star).
  world.bonus = [];
  world.bonusIdx = 0;
  world.bonusLength = 0;
  world.bonusScore = 100;
  world.bonusCounter = 0;
  // Line Event(Enemy).
  world.lineEvent = false;
  world.dot1 = null;
  world.dot2 = null;
  world.lineEventTimer = 30300;
  // Miscellaneous.
  world.thirtySec = 30000;
  world.score = 0;
  world.pause = false;
  world.pauseLimit = 3;
  world.sound = true;
  world.gameOver = false;
  world.spaceBar = false;
  world.clickSound = null;

  // Controller.
  var mouse = {};
  mouse.x = 0;
  mouse.y = 0;

  // Skill settings - not implemented yet.
  var skill = {};
  skill.q = false;
  skill.w = false;

  // Caching div info.
  var divs = {};
  divs.scoreBoard = null;
  divs.dotNumBoard = null;
  divs.startButtonText = null;
  divs.theWrapper = null;


  /* Game Starter functions */

  function gameStarter() {
    // Remove start screen.
    document.getElementById('board').removeChild(divs.theWrapper);
    world.start = true;

    // Display Score + Dot number.
    boardInfo(world);
    divs.scoreBoard = document.getElementById('score');
    divs.dotNumBoard = document.getElementById('dotNum');

    // Initial dot spawn.
    for (var k = 0; k < settings.roundStart; k++) {
      dotSpawner(settings, world, false);
    }

    // Dot spwan.
    setInterval(function () {
      if (!world.pause) dotSpawnStart();
    }, settings.spawnSpeed);

    // Bonuse spwan.
    setInterval(function () {
      if (!world.pause) bonusSpawnStart();
    }, settings.bonusSpawnSpeed);

    // Line event triggering.
    setTimeout(function () {
      lineEventTrigger(world);
    }, world.lineEventTimer);

    // 30 Sec checker.
    world.thirtySecBeep = setInterval(function () {
      showVar().countBeep.play();
      if (window.innerWidth > 600) settings.roundStartMax++;
    }, world.thirtySec);

    // Score Tracking.
    setInterval(function () {
      world.score++;
    }, 1000)
  }

  // Dot enemy spawn.
  function dotSpawnStart() {
    if (world.dotLength < settings.roundStartMax) {
      for (var i = 0; i < settings.roundUpSpawn; i++) {
        dotSpawner(settings, world, false);
      }
    }
  }

  // Bonus spawn.
  function bonusSpawnStart() {
    if (world.bonusLength < settings.bonusMax) {
      for (var j = 0; j < settings.bonusSpawn; j++) {
        dotSpawner(settings, world, true);
      }
    }
  }


  // Draw movement of player and dots.
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
      updatingBoard(divs.scoreBoard, divs.dotNumBoard, world);
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

    // click sound
    if (world.sound) world.clickSound.play();

    // Removing wrapper div of start page
    divs.theWrapper = showVar().wrapper;
    divs.startButtonText = document.getElementById('gameStart');

    // Removing sound, debug button.
    divs.theWrapper.removeChild(showVar().sound);
    divs.theWrapper.removeChild(showVar().godMode);

    // Difficulty re-setting base on width when game start.
      if (window.innerWidth > 1700) {
        settings.roundStartMax = 20;
        settings.roundStart = 5;
      }
      if (window.innerWidth < 1350) settings.roundStartMax = 15;
      if (window.innerWidth < 1100) settings.roundStartMax = 12;
      if (window.innerWidth < 750) {
        settings.roundStartMax = 9;
        settings.spawnSpeed = 5000;
      }
      if (window.innerWidth < 600) settings.roundStartMax = 5;
      if (window.innerWidth < 420) settings.roundStartMax = 3;


    // Showing start messages.
    tutorial(divs.startButtonText, world);

    setTimeout(function () {
      // Player Spawn.
      playerSpawner(settings, world);
      // Player controller event adding(rubberBand).
      setTimeout(function () {
        document.getElementById('playerDot1').className = 'playerDot animated infinite rubberBand';
      }, world.lineEventTimer * 3);
      //Removing start button and start game.
      gameStarter();
    }, 3100);
  }

  function soundButton(e) {
    if (world.sound) world.clickSound.play();
    world.sound = !(world.sound);
    soundOnOff(world);
    backgroundSound(world);
  }

  function godButton(e) {
    if (world.sound) world.clickSound.play();
    settings.godmode = !(settings.godmode);
    godOnOff(settings);
  }

  // press spaceBar = pause
  function gamePause(e) {
    if (e.keyCode === 32 && world.pauseLimit > 0 && world.start) {
      if (world.sound) world.clickSound.play();
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
  }());

}(window));
