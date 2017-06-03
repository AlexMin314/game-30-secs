/* Game Starter functions */

var gameStarter = function (settings, world) {
  // Remove start screen.
  document.getElementById('board').removeChild(utility().wrapper);
  world.start = true;

  // Display Score + Dot number.
  boardInfo(world);

  // Initial dot spawn.
  for (var k = 0; k < settings.roundStart; k++) {
    dotSpawner(settings, world, false);
  }

  // Dot spwan.
  setInterval(function () {
    if (!world.pause) dotSpawnStart(settings, world);
  }, settings.spawnSpeed);

  // Bonuse spwan.
  setInterval(function () {
    if (!world.pause) bonusSpawnStart(settings, world);
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
};

// Dot enemy spawn.
var dotSpawnStart = function (settings, world) {
  if (world.dotLength < settings.roundStartMax) {
    for (var i = 0; i < settings.roundUpSpawn; i++) {
      dotSpawner(settings, world, false);
    }
  }
}

// Bonus spawn.
var bonusSpawnStart = function (settings, world) {
  if (world.bonusLength < settings.bonusMax) {
    for (var j = 0; j < settings.bonusSpawn; j++) {
      dotSpawner(settings, world, true);
    }
  }
}

// Draw movement of player and dots.
var drawMovements = function (settings, world, mouse) {
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
