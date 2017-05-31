(function (window) {

  var gameBoard = document.getElementById('board');
  var wrapper;
  var soundE;
  var godModeE;
  var debugE;
  var starE1;
  var starE2;
  var counterE;
  var lineLength;
  var gameoverChecker = false;
  var calc;

  // Show information to public.
  window.showVar = function () {
    return {
      checker: gameoverChecker,
      godMode: godModeE,
      sound: soundE,
      gameBoard: gameBoard,
      wrapper: wrapper
    };
  }

  /* Start and GameOver Divs */

  // wrapper as a helper.
  window.makeWrapper = function () {
    var wrapperDiv = document.createElement('div');
    wrapperDiv.id = 'wrapper';
    gameBoard.appendChild(wrapperDiv);
    wrapper = document.getElementById('wrapper');
  };

  // Appending Start Button div.
  window.startButton = function () {
    // Appending Wrapper to game board.
    makeWrapper();

    // Appending Start Button to wrapper
    var sButton = document.createElement('div');
    sButton.id = 'gameStart';
    sButton.innerHTML = 'START<br>BUTTON';
    wrapper.appendChild(sButton);

    // Appending Start Button to wrapper
    var soundButton = document.createElement('div');
    soundButton.id = 'sound';
    soundButton.innerHTML = '<i class="fa fa-volume-up"></i> on';
    wrapper.appendChild(soundButton);
    soundE = document.getElementById('sound');

    // Appending Start Button to wrapper
    var godmodeButton = document.createElement('div');
    godmodeButton.id = 'godmode';
    godmodeButton.innerHTML = '<i class="fa fa-toggle-off fa-lg" title="DebugMode"></i>';
    wrapper.appendChild(godmodeButton);
    godModeE = document.getElementById('godmode');

  };

  // Game over and Showing game result.
  window.gameOverAndResult = function (world) {
    // Removing dot elements.
    gameBoard.innerHTML = '';

    // Game over sound
    if (world.sound) backgroundSound(world, true);

    // Appending Wrapper to game board.
    makeWrapper();

    // Appending scoreResultDiv to the wrapper
    var scoreResultDiv = document.createElement('div');
    scoreResultDiv.id = 'scoreResult';
    scoreResultDiv.innerHTML = 'SCORE: ' + world.score;
    wrapper.appendChild(scoreResultDiv);

    // Appending gameOverDiv to the wrapper
    var gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'gameOver';
    gameOverDiv.innerHTML = 'GAME OVER';
    wrapper.appendChild(gameOverDiv);

    // Appending retryDiv to the wrapper
    var retryDiv = document.createElement('div');
    retryDiv.id = 'retry';
    retryDiv.innerHTML = '<i class="fa fa-repeat"></i>  RETRY';
    wrapper.appendChild(retryDiv);

    // Event Listening on RETRY.
    document.getElementById('retry').addEventListener('click', function (e) {
      // need to research on this.
      window.location.reload(false);
    }, false);
  }

  /* Sound and Godmode setting */

  // Change sound button when it is clicked.
  window.soundOnOff = function (world) {
    if (world.sound) {
      soundE.style.color = 'white';
      soundE.innerHTML = '<i class="fa fa-volume-up"></i> on';
    } else {
      soundE.style.color = 'grey';
      soundE.innerHTML = '<i class="fa fa-volume-off"></i> mute';
    }
  };

  // Appending background sound, game over.
  window.backgroundSound = function (world, gameOver) {
    if (!gameOver && world.sound) audioTagHelper('bgSound', './src/bg.mp3', true, true, 0.4);
    if (gameOver && world.sound) audioTagHelper('bgSound', './src/over.mp3', false, true, 0.4);
    if (!world.sound) gameBoard.removeChild(document.getElementById('bgSound'));
  };

  window.audioTagHelper = function (id, src, loop, auto, volume) {
    var audioTag = document.createElement('audio');
    audioTag.id = id;
    audioTag.src = src;
    audioTag.loop = loop;
    audioTag.autoplay = auto;
    audioTag.volume = volume || 1;
    gameBoard.appendChild(audioTag);
  };

  // Change godMode(debug) button when it is clicked.
  window.godOnOff = function (settings) {
    if (!settings.godmode) {
      godModeE.style.color = 'white';
      godModeE.innerHTML = '<i class="fa fa-toggle-off fa-lg" title="DebugMode"></i>';
      if (debugE !== undefined) wrapper.removeChild(debugE);
    }
    if (settings.godmode) {
      godModeE.style.color = 'red';
      godModeE.innerHTML = '<i class="fa fa-toggle-on fa-lg" title="DebugMode"></i>';
      // inserd Debug Mode ON message.
      var debug = document.createElement('div');
      debug.id = 'debug';
      debug.innerHTML = 'Debug Mode ON';
      wrapper.appendChild(debug);
      debugE = document.getElementById('debug');
    }
  };

  /* Game Logics */

  // Create Doms for new dots
  window.createDots = function (type, pNum, dNum) {
    var newDiv = document.createElement('div');
    newDiv.className = type;
    newDiv.id = type + (type === 'playerDot' ? pNum : dNum);
    gameBoard.appendChild(newDiv);
    return document.getElementById(newDiv.id);
  };

  // collision detection for Player Pattern.
  window.collision = function (arr, world, settings, gameOver, bonus) {
    // Circle collision detection
    var xThis = Math.floor(this.showInfo().x);
    var yThis = Math.floor(this.showInfo().y);
    var pRadius = Math.floor(this.showInfo().radius);

    // Checking debug mode and game over or not.
    if (!gameoverChecker) {
      arr.map(function (e, i) {
        var xTarget = Math.floor(e.showInfo().x);
        var yTarget = Math.floor(e.showInfo().y);
        var dRadius = Math.floor(e.showInfo().radius);
        var distance = Math.sqrt(Math.pow(xThis - xTarget, 2) + Math.pow(yThis - yTarget, 2));
        // enemy collision
        if (distance < pRadius + dRadius &&
          gameOver === true &&
          bonus === false &&
          !settings.godmode) {
          // game over.
          gameoverChecker = true;
          gameOverAndResult(world);
        }
        // bonus collision
        if (distance < pRadius + dRadius && bonus === true) {
          world.score += world.bonusScore;
          world.bonusCounter++;
          removeBonus(e, i, world);
          if (world.sound && world.bonusCounter % 2 === 1) starE1.play();
          if (world.sound && world.bonusCounter % 2 === 0) starE2.play();
        }
      });
      // Line collision
      if (world.lineEvent && gameOver === true) {
        var distA = Math.sqrt(Math.pow(world.dot1.showInfo().x-xThis,2) + Math.pow(world.dot1.showInfo().y-yThis,2));
        var distB =Math.sqrt(Math.pow(world.dot2.showInfo().x-xThis,2) + Math.pow(world.dot2.showInfo().y-yThis,2));
        console.log(Math.floor(lineLength));
        console.log(Math.floor(distA + distB));
        if (distA + distB < lineLength + 7 && distA + distB > lineLength - 7) {
          // gameover
          gameoverChecker = true;
          gameOverAndResult(world);
        }
      }
    }
  };

  window.removeBonus = function (e, i, world) {
    gameBoard.removeChild(e.showInfo().dots);
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
    // calculate angle
    calc = Math.atan2(y2 - y1, x2 - x1);
    calc = calc * 180 / Math.PI;
    // line length
    lineLength = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) - 5;
    // CSS
    var temp = document.getElementById(id);
    temp.style.height = '2px';
    temp.style.width = lineLength + 'px';
    temp.style.backgroundColor = 'red';
    temp.style.position = 'absolute';
    temp.style.top = y1 + 'px';
    temp.style.left = x1 + 'px';
    temp.style.transform = 'rotate(' + calc + 'deg)';
    temp.style.transformOrigin = '0%';
    temp.style['-webkit-transform'] = 'rotate(' + calc + 'deg)';
    temp.style['-webkit-transform-origin'] = '0% 0%';
    temp.style['-ms-transform'] = 'rotate(' + calc + 'deg)';
  };

  // Line event trigger
  window.lineEventTrigger = function (world) {
    // Append line div
    var lineDiv = document.createElement('div');
    lineDiv.id = 'line';
    gameBoard.appendChild(lineDiv);
    // pick 2 dots.
    var dotIdx1 = Math.floor(Math.random() * world.dotLength);
    var dotIdx2 = Math.floor(Math.random() * world.dotLength);
    while (dotIdx1 === dotIdx2) dotIdx2 = Math.floor(Math.random() * world.dotLength);
    world.dot1 = world.dotList[dotIdx1];
    world.dot2 = world.dotList[dotIdx2];
    //
    world.lineEvent = true;
    //drawLine(dot1.showInfo().x, dot1.showInfo().y, dot2.showInfo().x, dot2.showInfo().y)
  };

  /* Game info related */

  // Append Score and Dot number
  window.boardInfo = function (world) {
    // Adding Score at right side of game board.
    var scoreDiv = document.createElement('div');
    scoreDiv.id = 'score';
    scoreDiv.innerHTML = 'SCORE<br>' + world.score;
    gameBoard.appendChild(scoreDiv);

    // Adding Dot number at right side of game board.
    var dotNum = document.createElement('div');
    dotNum.id = 'dotNum';
    dotNum.innerHTML = 'DOTS<br>' + world.dotLength;
    gameBoard.appendChild(dotNum);
  };

  // Updating Dot Numbers and Scores on gameBoard.
  window.updatingBoard = function (scoreBoard, dotNumBoard, world) {
    scoreBoard.innerHTML = 'SCORE<br>' + world.score;
    dotNumBoard.innerHTML = 'DOTS<br>' + world.dotLength;
  };

  window.tutorial = function (startButtonText, world) {
    setTimeout(function () {
      startButtonText.innerHTML = 'DODGE<br>DOTS'
    }, 0);
    setTimeout(function () {
      startButtonText.innerHTML = 'GOOD<br>LUCK'
    }, 700);
    setTimeout(function () {
      // Store element to reducing dom access
      starE1 = document.getElementById('star1');
      starE2 = document.getElementById('star2');
      counterE = document.getElementById('counter');
      // Counter sound play
      if (world.sound) counterE.play();
      startButtonText.style.fontSize = '200px';
      startButtonText.style.paddingTop = '0px';
      startButtonText.style.border = '0px';
      startButtonText.innerHTML = '3'
    }, 1400);
    setTimeout(function () {
      if (world.sound) counterE.play();
      startButtonText.innerHTML = '2'
    }, 1900);
    setTimeout(function () {
      if (world.sound) counterE.play();
      startButtonText.innerHTML = '1'
    }, 2400);
  }

  /* Cross browsing and polypills */

  // Cross browsing
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / settings.FPS);
      };
  })();

  // Polypill here


}(window));
