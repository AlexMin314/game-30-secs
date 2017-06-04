(function () {
  /* Game Logics */

  // Line(enemy) length.
  var lineLength = 0;
  var gameoverChecker = false;

  this.gameOverChk = function () {
    return gameoverChecker;
  }

  // Create new dots (player, enemy, bonus).
  this.createDots = function (type, pNum, dNum) {
    // Make different ID(string) on Dots.
    var divId = type + (type === 'playerDot' ? pNum : dNum);
    // Create and Append the Div.
    var newDiv = appendTo('div', utility().gameBoard, divId)
    newDiv.className = type;
    return document.getElementById(newDiv.id);
  };

  // Collision detection of Player Pattern.
  this.collision = function (arr, world, settings, gameOver, bonus) {
    // Player coordinate.
    var xThis = Math.floor(this.showInfo().x);
    var yThis = Math.floor(this.showInfo().y);
    var pRadius = Math.floor(this.showInfo().radius);

    // Checking debug mode and game over or not.
    if (!gameoverChecker) {
      arr.map(function (e, i) {
        // Target(enemy,bonus) coordinate.
        var xTarget = Math.floor(e.showInfo().x);
        var yTarget = Math.floor(e.showInfo().y);
        var dRadius = Math.floor(e.showInfo().radius);
        var distance = Math.sqrt(Math.pow(xThis - xTarget, 2) + Math.pow(yThis - yTarget, 2));

        // Enemy collision (Circle).
        if (distance < pRadius + dRadius &&
          gameOver === true &&
          bonus === false &&
          !settings.godmode) {
          // Game over.
          gameoverChecker = true;
          gameOverAndResult(world);
        }

        // Bonus collision (Circle).
        if (distance < pRadius + dRadius && bonus === true) {
          world.score += world.bonusScore;
          world.bonusCounter++;
          // Remove bonus and play sound.
          removeBonus(e, i, world);
          if (world.sound && world.bonusCounter % 2 === 1) utility().starE1.play();
          if (world.sound && world.bonusCounter % 2 === 0) utility().starE2.play();
        }
      });

      // Line(enemy) collision.
      if (world.lineEvent && gameOver === true && !settings.godmode) {
        var dot1X = world.dot1.showInfo().x;
        var dot1Y = world.dot1.showInfo().y;
        var dot2X = world.dot2.showInfo().x;
        var dot2Y = world.dot2.showInfo().y;

        // Distance from player to dot1, dot2.
        var distA = Math.sqrt(Math.pow(dot1X - xThis, 2) + Math.pow(dot1Y - yThis, 2));
        var distB = Math.sqrt(Math.pow(dot2X - xThis, 2) + Math.pow(dot2Y - yThis, 2));

        // Using isosceles triangle case (not accurate but enough).
        var colRange = 2 * Math.sqrt(Math.pow(lineLength / 2, 2) + Math.pow(pRadius, 2));
        if (distA + distB < colRange) {
          // Gameover
          gameoverChecker = true;
          gameOverAndResult(world);
        }
      }
    }
  }; // colision function end.

  // Removing bonus from the board.
  this.removeBonus = function (e, i, world) {
    utility().gameBoard.removeChild(e.showInfo().dots);
    world.bonus.splice(i, 1);
    world.bonusLength = world.bonus.length;
  }

  // Gives wall limit to target(player).
  this.wall = function () {
    var rect = this.getBoundingClientRect();
    var w = Math.floor(window.innerWidth);
    var h = Math.floor(window.innerHeight);
    // Wall condition.
    if (rect.bottom > h) this.style.top = (h - rect.height) + 'px';
    if (rect.top < 0) this.style.top = '0px';
    if (rect.left < 0) this.style.left = '0px';
    if (rect.right > w) this.style.left = (w - rect.width) + 'px';
  }

  // Line event - drawing line
  this.drawLine = function (x1, y1, x2, y2, id) {
    // Calculate angle to rotate line div.
    var calc = Math.atan2(y2 - y1, x2 - x1);
    calc = calc * 180 / Math.PI;

    // Line length(distance between the dot1 dot2).
    lineLength = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));

    if (!gameoverChecker) {
      var lineDiv = document.getElementById(id);
      lineDiv.style.height = '2px';
      lineDiv.style.width = lineLength + 'px';
      lineDiv.style.backgroundColor = 'red';
      lineDiv.style.position = 'absolute';
      lineDiv.style.top = y1 + 'px';
      lineDiv.style.left = x1 + 'px';
      lineDiv.style.transform = 'rotate(' + calc + 'deg)';
      lineDiv.style.transformOrigin = '0%';
      lineDiv.style['-webkit-transform'] = 'rotate(' + calc + 'deg)';
      lineDiv.style['-webkit-transform-origin'] = '0% 0%';
      lineDiv.style['-ms-transform'] = 'rotate(' + calc + 'deg)';
    }
  };

  // Line event trigger.
  this.lineEventTrigger = function (world) {
    // Append line div
    var lineDiv = appendTo('div', utility().gameBoard, 'line');

    // pick 2 dots.
    var dotIdx1 = Math.floor(Math.random() * world.dotLength);
    var dotIdx2 = Math.floor(Math.random() * world.dotLength);
    while (dotIdx1 === dotIdx2) dotIdx2 = Math.floor(Math.random() * world.dotLength);
    world.dot1 = world.dotList[dotIdx1];
    world.dot2 = world.dotList[dotIdx2];

    // triggering.
    world.lineEvent = true;
  };

  // Game diffculty setting + anti-cheat.
  this.difficulty = function (settings, start) {
    if (window.innerWidth > 1700) {
      if (settings.roundStartMax < 20 && start === true) {
        settings.roundStartMax = 20;
        settings.spawnSpeed = 3500;
      }
      if (!start) settings.roundStartMax = 20;
      settings.roundStart = 5;
    }
    if (window.innerWidth < 1350) {
      if (settings.roundStartMax < 15 && start === true) {
        settings.roundStartMax = 15;
        settings.spawnSpeed = 3500;
      }
      if (!start) settings.roundStartMax = 15;
    }
    if (window.innerWidth < 1100) {
      if (settings.roundStartMax < 12 && start === true) {
        settings.roundStartMax = 12;
        settings.spawnSpeed = 3500;
      }
      if (!start) settings.roundStartMax = 12;
    }
    if (window.innerHeight < 600) {
      if (window.innerWidth < 750) {
        settings.roundStart = 2;
        settings.roundStartMax = 9;
        settings.spawnSpeed = 5000;
        settings.speedScale = 1.0
      }
      if (window.innerWidth < 600) settings.roundStartMax = 5;
      if (window.innerWidth < 420) settings.roundStartMax = 3;
    }
  };

}());
