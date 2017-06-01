(function (window) {

  // Caching div info.
  var divInfo = {};
  divInfo.gameBoard = document.getElementById('board');
  divInfo.pause = document.getElementById('pause');
  divInfo.wrapper = null;
  divInfo.soundE = null;
  divInfo.godModeE = null;
  divInfo.debugE = null;
  divInfo.starE1 = null;
  divInfo.starE2 = null;
  divInfo.counterE = null;
  divInfo.instruction = null;

  // Line(enemy) length
  var lineLength = 0;
  var gameoverChecker = false;

  // Show information to public.
  window.showVar = function () {
    return {
      checker: gameoverChecker,
      godMode: divInfo.godModeE,
      sound: divInfo.soundE,
      gameBoard: divInfo.gameBoard,
      wrapper: divInfo.wrapper,
      countBeep: divInfo.counterE
    };
  }

  /* Game Logics */

  // Create new dots (player, enemy, bonus).
  window.createDots = function (type, pNum, dNum) {
    var newDiv = document.createElement('div');
    newDiv.className = type;
    newDiv.id = type + (type === 'playerDot' ? pNum : dNum);
    divInfo.gameBoard.appendChild(newDiv);
    return document.getElementById(newDiv.id);
  };

  // collision detection of Player Pattern.
  window.collision = function (arr, world, settings, gameOver, bonus) {
    // player coordinate
    var xThis = Math.floor(this.showInfo().x);
    var yThis = Math.floor(this.showInfo().y);
    var pRadius = Math.floor(this.showInfo().radius);

    // Checking debug mode and game over or not.
    if (!gameoverChecker) {
      arr.map(function (e, i) {
        // target(enemy,bonus) coordinate.
        var xTarget = Math.floor(e.showInfo().x);
        var yTarget = Math.floor(e.showInfo().y);
        var dRadius = Math.floor(e.showInfo().radius);
        var distance = Math.sqrt(Math.pow(xThis - xTarget, 2) + Math.pow(yThis - yTarget, 2));
        // enemy collision (Circle)
        if (distance < pRadius + dRadius &&
          gameOver === true &&
          bonus === false &&
          !settings.godmode) {
          // game over.
          gameoverChecker = true;
          gameOverAndResult(world);
        }
        // bonus collision (Circle).
        if (distance < pRadius + dRadius && bonus === true) {
          world.score += world.bonusScore;
          world.bonusCounter++;
          // remove bonus and play sound
          removeBonus(e, i, world);
          if (world.sound && world.bonusCounter % 2 === 1) divInfo.starE1.play();
          if (world.sound && world.bonusCounter % 2 === 0) divInfo.starE2.play();
        }
      });
      // Line(enemy) collision.
      if (world.lineEvent && gameOver === true && !settings.godmode) {
        // distance from player to dot1, dot2.
        var distA = Math.sqrt(Math.pow(world.dot1.showInfo().x - xThis, 2) + Math.pow(world.dot1.showInfo().y - yThis, 2));
        var distB = Math.sqrt(Math.pow(world.dot2.showInfo().x - xThis, 2) + Math.pow(world.dot2.showInfo().y - yThis, 2));
        if (distA + distB < 2 * Math.sqrt(Math.pow(lineLength/2, 2) + Math.pow(pRadius, 2))) {
          // gameover
          gameoverChecker = true;
          gameOverAndResult(world);
        }
      }
    }
  };

  // Removing bonus from the board.
  window.removeBonus = function (e, i, world) {
    divInfo.gameBoard.removeChild(e.showInfo().dots);
    world.bonus.splice(i, 1);
    world.bonusLength = world.bonus.length;
  }

  // Gives wall limit to target(player).
  window.wall = function () {
    var rect = this.getBoundingClientRect();
    var w = Math.floor(window.innerWidth);
    var h = Math.floor(window.innerHeight);
    if (rect.bottom > h) this.style.top = (h - rect.height) + 'px';
    if (rect.top < 0) this.style.top = '0px';
    if (rect.left < 0) this.style.left = '0px';
    if (rect.right > w) this.style.left = (w - rect.width) + 'px';
  }

  // Line event - drawing line
  window.drawLine = function (x1, y1, x2, y2, id) {
    // calculate angle to rotate line div.
    var calc = Math.atan2(y2 - y1, x2 - x1);
    calc = calc * 180 / Math.PI;
    // line length.
    lineLength = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    // CSS.
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

  // Line event trigger
  window.lineEventTrigger = function (world) {
    // Append line div
    var lineDiv = document.createElement('div');
    lineDiv.id = 'line';
    divInfo.gameBoard.appendChild(lineDiv);
    // pick 2 dots.
    var dotIdx1 = Math.floor(Math.random() * world.dotLength);
    var dotIdx2 = Math.floor(Math.random() * world.dotLength);
    while (dotIdx1 === dotIdx2) dotIdx2 = Math.floor(Math.random() * world.dotLength);
    world.dot1 = world.dotList[dotIdx1];
    world.dot2 = world.dotList[dotIdx2];
    // triggering.
    world.lineEvent = true;
  };


  /* Start and GameOver, Pause Divs */

  // wrapper as a helper.
  window.makeWrapper = function () {
    var wrapperDiv = document.createElement('div');
    wrapperDiv.id = 'wrapper';
    divInfo.gameBoard.appendChild(wrapperDiv);
    divInfo.wrapper = document.getElementById('wrapper');
  };

  // Appending Start Button div.
  window.startButton = function () {
    // Appending Wrapper to game board.
    makeWrapper();

    // Appending Start Button to wrapper
    var sButton = document.createElement('div');
    sButton.id = 'gameStart';
    sButton.innerHTML = 'START<br>BUTTON';
    divInfo.wrapper.appendChild(sButton);

    // Appending Start Button to wrapper
    var soundButton = document.createElement('div');
    soundButton.id = 'sound';
    soundButton.innerHTML = '<i class="fa fa-volume-up"></i> on';
    divInfo.wrapper.appendChild(soundButton);
    divInfo.soundE = document.getElementById('sound');

    // Appending Start Button to wrapper
    var godmodeButton = document.createElement('div');
    godmodeButton.id = 'godmode';
    godmodeButton.innerHTML = '<i class="fa fa-toggle-off fa-lg" title="DebugMode"></i>';
    divInfo.wrapper.appendChild(godmodeButton);
    divInfo.godModeE = document.getElementById('godmode');

    // Appending Instruction texts.
    var instructionDiv = document.createElement('div');
    instructionDiv.id = 'instruction';
    instructionDiv.innerHTML = 'DODGE DOTS | GRAB STARS<br>' +'<p>MOUSE CONTROL | PAUSE: SPACEBAR</p>';
    divInfo.wrapper.appendChild(instructionDiv);
    divInfo.instruction = document.getElementById('instruction');

  };

  // Game over and Showing game result.
  window.gameOverAndResult = function (world) {
    // Removing dot elements.
    divInfo.gameBoard.innerHTML = '';
    clearInterval(world.thirtySecBeep);

    // Game over sound
    if (world.sound) backgroundSound(world, true);

    // Appending Wrapper to game board.
    makeWrapper();

    // Appending scoreResultDiv to the wrapper
    var scoreResultDiv = document.createElement('div');
    scoreResultDiv.id = 'scoreResult';
    scoreResultDiv.innerHTML = 'SCORE: ' + world.score;
    divInfo.wrapper.appendChild(scoreResultDiv);

    // Appending gameOverDiv to the wrapper
    var gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'gameOver';
    gameOverDiv.innerHTML = 'GAME OVER';
    divInfo.wrapper.appendChild(gameOverDiv);

    // Appending retryDiv to the wrapper
    var retryDiv = document.createElement('div');
    retryDiv.id = 'retry';
    retryDiv.innerHTML = '<i class="fa fa-repeat"></i>  RETRY';
    divInfo.wrapper.appendChild(retryDiv);

    // Event Listening on RETRY.
    document.getElementById('retry').addEventListener('click', function (e) {
      // need to research on this.
      world.clickSound.play();
      setInterval(function() {
        window.location.reload(false);
      }, 700);
    }, false);
  }

  window.gamePauseScreen = function(world) {
    divInfo.pause.style.visibility = 'hidden';
    if (world.pauseLimit % 1 !== 0) {
      divInfo.pause.style.visibility = 'visible';
      divInfo.pause.innerHTML = 'GAME PAUSED<br>';
      divInfo.pause.innerHTML += '<span>' + (world.pauseLimit - 0.5) + ' TIMES LEFT</span>';
    }
  };


  /* Sound and Godmode setting */

  // Change sound button when it is clicked.
  window.soundOnOff = function (world) {
    if (world.sound) {
      divInfo.soundE.style.color = 'white';
      divInfo.soundE.innerHTML = '<i class="fa fa-volume-up"></i> on';
    } else {
      divInfo.soundE.style.color = 'grey';
      divInfo.soundE.innerHTML = '<i class="fa fa-volume-off"></i> mute';
    }
  };

  // Appending background sound, game over.
  window.backgroundSound = function (world, gameOver) {
    if (!gameOver && world.sound) audioTagHelper('bgSound', './src/bg.mp3', true, true, 0.4);
    if (gameOver && world.sound) audioTagHelper('bgSound', './src/over.mp3', false, true, 0.4);
    if (!world.sound) divInfo.gameBoard.removeChild(document.getElementById('bgSound'));
  };

  // Creating audio tag.
  window.audioTagHelper = function (id, src, loop, auto, volume) {
    var audioTag = document.createElement('audio');
    audioTag.id = id;
    audioTag.src = src;
    audioTag.loop = loop;
    audioTag.autoplay = auto;
    audioTag.volume = volume || 1;
    divInfo.gameBoard.appendChild(audioTag);
  };

  // Change godMode(debug) button when it is clicked.
  window.godOnOff = function (settings) {
    if (!settings.godmode) {
      divInfo.godModeE.style.color = 'white';
      divInfo.godModeE.innerHTML = '<i class="fa fa-toggle-off fa-lg" title="DebugMode"></i>';
      if (divInfo.debugE !== null) divInfo.wrapper.removeChild(divInfo.debugE);
    }
    if (settings.godmode) {
      divInfo.godModeE.style.color = 'red';
      divInfo.godModeE.innerHTML = '<i class="fa fa-toggle-on fa-lg" title="DebugMode"></i>';
      // inserd Debug Mode ON message.
      var debug = document.createElement('div');
      debug.id = 'debug';
      debug.innerHTML = 'Debug Mode ON';
      divInfo.wrapper.appendChild(debug);
      divInfo.debugE = document.getElementById('debug');
    }
  };


  /* Game info related */

  // Append Score and Dot number
  window.boardInfo = function (world) {
    // Adding Score at right side of game board.
    var scoreDiv = document.createElement('div');
    scoreDiv.id = 'score';
    scoreDiv.innerHTML = 'SCORE.<br>' + world.score;
    divInfo.gameBoard.appendChild(scoreDiv);

    // Adding Dot number at right side of game board.
    var dotNum = document.createElement('div');
    dotNum.id = 'dotNum';
    dotNum.innerHTML = 'DOTS<br>' + world.dotLength;
    divInfo.gameBoard.appendChild(dotNum);
  };

  // Updating Dot Numbers and Scores on gameBoard.
  window.updatingBoard = function (scoreBoard, dotNumBoard, world) {
    scoreBoard.innerHTML = 'SCORE<br>' + world.score;
    dotNumBoard.innerHTML = 'DOTS<br>' + world.dotLength;
  };

  // Showing starting messages.
  window.tutorial = function (startButtonText, world) {
    var interval = 650;
    setTimeout(function () {
      startButtonText.innerHTML = 'EVERY<br>30 SECS'
    }, interval * 0);
    setTimeout(function () {
      startButtonText.innerHTML = 'GOOD<br>LUCK'
    }, interval * 1);
    setTimeout(function () {
      // Store element to reducing dom access
      divInfo.starE1 = document.getElementById('star1');
      divInfo.starE2 = document.getElementById('star2');
      divInfo.counterE = document.getElementById('counter');
      // Count 1 sound play
      if (world.sound) divInfo.counterE.play();
      startButtonText.style.fontSize = '200px';
      startButtonText.style.paddingTop = '0px';
      startButtonText.style.border = '0px';
      startButtonText.innerHTML = '3'
    }, interval * 2);
    setTimeout(function () {
      if (world.sound) divInfo.counterE.play();
      startButtonText.innerHTML = '2'
    }, interval * 3);
    setTimeout(function () {
      if (world.sound) divInfo.counterE.play();
      startButtonText.innerHTML = '1'
    }, interval * 4);
  }


  /* Cross browsing */

  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / settings.FPS);
      };
  })();

  // map() polipill from MDN.
  if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
      var T, A, k;
      if (this == null) throw new TypeError(' this is null or not defined');
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
      if (arguments.length > 1) T = thisArg;
      A = new Array(len);
      k = 0;
      while (k < len) {
        var kValue, mappedValue;
        if (k in O) {
          kValue = O[k];
          mappedValue = callback.call(T, kValue, k, O);
          A[k] = mappedValue;
        }
        k++;
      }
      return A;
    };
  }

}(window));
