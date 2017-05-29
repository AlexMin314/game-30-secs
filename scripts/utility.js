(function (window) {

  var gameBoard = document.getElementById('board');
  window.gameoverChecker = false;

  // Append Start Button div.
  window.startButton = function () {
    var sButton = document.createElement('div');
    sButton.id = 'gameStart';
    sButton.innerHTML = 'START<br>BUTTON';
    //sButton.style.fontSize = '90px';
    //sButton.style.paddingTop = '5px';
    gameBoard.appendChild(sButton);
  };

  // Game Starter.
  window.gameStarter = function (world) {
    // Adding Score at right side of game board.
    var scoreDiv = document.createElement('div');
    scoreDiv.id = 'score';
    scoreDiv.innerHTML = 'SCORE<br>' + world.score;
    gameBoard.appendChild(scoreDiv);
    // Adding Dot number at right side of game board.
    var dotNum = document.createElement('div');
    dotNum.id = 'dotNum';
    dotNum.innerHTML = 'DOTS<br>' + world.dotNum;
    gameBoard.appendChild(dotNum);
  };

  // Updating Dot Numbers and Scores on gameBoard.
  window.updatingBoard = function (scoreBoard, dotNumBoard, world) {
    scoreBoard.innerHTML = 'SCORE<br>' + world.score;
    dotNumBoard.innerHTML = 'DOTS<br>' + world.dotNum;
  };

  // Gives wall limit to target(player).
  window.wall = function () {
    var rect = this.getBoundingClientRect();
    var w = Math.floor(window.innerWidth);
    var h = Math.floor(window.innerHeight);

    if (rect.bottom > h) {
      this.style.top = (h - rect.height) + 'px';
    }
    if (rect.top < 0) {
      this.style.top = '0px';
    }
    if (rect.left < 0) {
      this.style.left = '0px';
    }
    if (rect.right > w) {
      this.style.left = (w - rect.width) + 'px';
    }
  }

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

  // Create Doms for new dots
  window.createDots = function (type, pNum, dNum) {
      var newDiv = document.createElement('div');
      newDiv.className = type;
      newDiv.id = type + (type === 'playerDot' ? pNum : dNum);
      gameBoard.appendChild(newDiv);
      return document.getElementById(newDiv.id);
  };

  // Game over and Showing game result.
  window.gameOverAndResult = function (world) {
    var saveScore = world.score;

    // Removing dot elements.
    gameBoard.innerHTML = '';

    // Appending WrapperDiv to game board.
    var wrapperDiv = document.createElement('div');
    wrapperDiv.id = 'wrapper';
    gameBoard.appendChild(wrapperDiv);
    wrapperDiv = document.getElementById('wrapper');

    // Appending scoreResultDiv to the wrapper
    var scoreResultDiv = document.createElement('div');
    scoreResultDiv.id = 'scoreResult';
    scoreResultDiv.innerHTML = 'SCORE: ' + saveScore;
    wrapperDiv.appendChild(scoreResultDiv);

    // Appending gameOverDiv to the wrapper
    var gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'gameOver';
    gameOverDiv.innerHTML = 'GAME OVER';
    wrapperDiv.appendChild(gameOverDiv);

    // Appending retryDiv to the wrapper
    var retryDiv = document.createElement('div');
    retryDiv.id = 'retry';
    retryDiv.innerHTML = '<i class="fa fa-repeat" aria-hidden="true"></i>  RETRY';
    wrapperDiv.appendChild(retryDiv);
    // reloading document for retrying
    document.getElementById('retry').addEventListener('click', function(e) {
      window.location.reload(false);
    }, false);
  }

  window.tutorial = function (startButtonText) {
    var startButtonText = document.getElementById('gameStart');
    setTimeout(function () {
      startButtonText.innerHTML = 'DODGE<br>DOTS'
    }, 0);
    setTimeout(function () {
      startButtonText.innerHTML = 'GOOD<br>LUCK'
    }, 700);
    setTimeout(function () {
      startButtonText.style.fontSize = '200px';
      startButtonText.style.paddingTop = '0px';
      startButtonText.innerHTML = '3'
    }, 1400);
    setTimeout(function () {
      startButtonText.innerHTML = '2'
    }, 1900);
    setTimeout(function () {
      startButtonText.innerHTML = '1'
    }, 2400);
  }

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
