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
    if (!world.pause) spawnStart(settings, world, false);
  }, settings.spawnSpeed);

  // Bonuse spwan.
  setInterval(function () {
    if (!world.pause) spawnStart(settings, world, true);
  }, settings.bonusSpawnSpeed);

  // Line event triggering.
  setTimeout(function () {
    lineEventTrigger(world);
  }, world.lineEventTimer);

  // 30 Sec checker.
  world.thirtySecBeep = setInterval(function () {
    utility().countBeep.play();
    // Speed Scale effective on only new spawn dot.
    settings.speedScale += 0.05;
    // Addtional emeny dot spawn every 60 secs.
    world.addChk++;
    if (window.innerWidth > 600 && world.addChk % 2 === 1) settings.roundStartMax++;
  }, world.thirtySec);

  // Score Tracking.
  setInterval(function () {
    world.score++;
  }, 1000)
};

// Dot enemy spawn(bonus: false) | Bonus Spawn(bonus: ture)
var spawnStart = function (settings, world, bonus) {
  var leng = bonus ? world.bonusLength : world.dotLength;
  var max = bonus ? settings.bonusMax : settings.roundStartMax;
  var howManyInOneTic = bonus ? settings.bonusSpawn : settings.roundUpSpawn;
  if (leng < max) {
    // Current spawn tic : enemy(1), start(1).
    for (var i = 0; i < howManyInOneTic; i++) {
      dotSpawner(settings, world, bonus);
    }
  }
};

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
