(function () {

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
  world.addChk = 0;
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
  world.lineEventTimer = 30300; // sharing with rubberBand
  // Miscellaneous.
  world.thirtySec = 30000;
  world.score = 0;
  world.pause = false;
  world.pauseLimit = 3;
  world.sound = true;
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
  divs.player = null;


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
      utility().countBeep.play();
      world.addChk++;
      // Addtional emeny dot spawn every 60 secs.
      if (window.innerWidth > 600 && world.addChk % 2 === 1) settings.roundStartMax++;
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


  /* Board init start!!!!! */

  // Display Start Button.
  startButton();

  // Background sound play
  backgroundSound(world, gameOverChk());

  // Append some sound effect
  audioTagHelper('star1', './src/star.mp3', false, false);
  audioTagHelper('star2', './src/star.mp3', false, false);
  audioTagHelper('counter', './src/count.mp3', false, false);
  audioTagHelper('clicked', './src/clicked.mp3', false, false);
  world.clickSound = document.getElementById('clicked');

  // Game Starting Flow after start button click.
  function startClick(e) {
    // Removing click events.
    document.getElementById('gameStart').removeEventListener('click', startClick, false);

    // click sound
    if (world.sound) world.clickSound.play();

    // Removing wrapper div of start page
    divs.theWrapper = utility().wrapper;
    divs.startButtonText = document.getElementById('gameStart');

    // Removing sound, debug button.
    divs.theWrapper.removeChild(utility().sound);
    divs.theWrapper.removeChild(utility().godMode);

    // Difficulty re-setting base on width when game start.
    difficulty(settings, false);

    // Showing start messages.
    tutorial(divs.startButtonText, world);

    // setTimeout for waiting tutorial ends.
    setTimeout(function () {
      // Player Spawn.
      playerSpawner(settings, world);
      divs.player = document.getElementById('playerDot1');

      //Removing start button and start game.
      gameStarter();
    }, 3100);
  }


  /* Render Loops */

  (function renderLoop() {
    requestAnimFrame(renderLoop);
    // Checking start:true, pause:false, gameoverChecker: false.
    if (world.start && !world.pause && !gameOverChk()) {
      drawMovements();
      updatingBoard(divs.scoreBoard, divs.dotNumBoard, world);
      // anti-cheat.
      difficulty(settings, true);
    }
  }());


  /* Event Listener related */

  // Retrieve methods.
  var eFunc = eventFunc(settings, world, mouse, divs);

  (function () {
    document.addEventListener('mousemove', eFunc.getMousePos, false);
    document.addEventListener('keydown', eFunc.gamePause, false);
    document.getElementById('gameStart').addEventListener('click', startClick, false);
    document.getElementById('sound').addEventListener('click', eFunc.soundButton, false);
    document.getElementById('godmode').addEventListener('click', eFunc.godButton, false);
  }());

}());
