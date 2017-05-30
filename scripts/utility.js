(function (window) {

  var gameBoard = document.getElementById('board');
  var wrapper;
  var soundE;
  var godModeE;
  var debugE
  var gameoverChecker = false;

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

  // Append Start Button div.
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

  window.soundOnOff = function (world) {
    if (world.sound) {
      soundE.style.color = 'white';
      soundE.innerHTML = '<i class="fa fa-volume-up"></i> on';
    } else {
      soundE.style.color = 'grey';
      soundE.innerHTML = '<i class="fa fa-volume-off"></i> mute';
    }
  };

  window.godOnOff = function (settings) {
    if (!settings.godmode) {
      godModeE.style.color = 'white';
      godModeE.innerHTML = '<i class="fa fa-toggle-off fa-lg" title="DebugMode"></i>';
      console.log(debugE);
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
  window.collision = function (arr, world, settings, gameOver) {
    // Circle collision detection
    var xThis = Math.floor(this.showCoordinate().x);
    var yThis = Math.floor(this.showCoordinate().y);
    var pRadius = Math.floor(this.showCoordinate().radius);

    // Checking debug mode and game over or not.
    if (!settings.godmode && !gameoverChecker) {
      arr.map(function (e) {
        var xTarget = Math.floor(e.showCoordinate().x);
        var yTarget = Math.floor(e.showCoordinate().y);
        var dRadius = Math.floor(e.showCoordinate().radius);
        var distance = Math.sqrt(Math.pow(xThis - xTarget, 2) + Math.pow(yThis - yTarget, 2));
        if (distance < pRadius + dRadius && gameOver === true) {
          // game over.
          gameoverChecker = true;
          return gameOverAndResult(world);
        }
      });
    }
  };

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

  window.tutorial = function (startButtonText) {
    setTimeout(function () {
      startButtonText.innerHTML = 'DODGE<br>DOTS'
    }, 0);
    setTimeout(function () {
      startButtonText.innerHTML = 'GOOD<br>LUCK'
    }, 700);
    setTimeout(function () {
      startButtonText.style.fontSize = '200px';
      startButtonText.style.paddingTop = '0px';
      startButtonText.style.border = '0px';
      startButtonText.innerHTML = '3'
    }, 1400);
    setTimeout(function () {
      startButtonText.innerHTML = '2'
    }, 1900);
    setTimeout(function () {
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
