(function (window) {

  // Game Starter
  window.starter = function (world) {
    var gameBoard = document.getElementById('board')
    // Adding Score at right side of game board
    var score = document.createElement('div');
    score.id = 'score';
    score.innerHTML = 'Score<br>' + world.score;
    gameBoard.appendChild(score);
    // Adding Dot number at right side of game board
    var dotNum = document.createElement('div');
    dotNum.id = 'dotNum';
    dotNum.innerHTML = 'Dots<br>' + world.dotNum;
    gameBoard.appendChild(dotNum);
  };

  window.updatingBoard = function (scoreBoard, dotNumBoard, world) {
    scoreBoard.innerHTML = 'Score<br>' + world.score;
    dotNumBoard.innerHTML = 'Dots<br>' + world.dotNum;
  };

  // Gives wall limit
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

  window.collision = function (arr, world, gameOver) {
    // Circle collision detection
    var xThis = Math.floor(this.showCoordinate().x);
    var yThis = Math.floor(this.showCoordinate().y);
    var pRadius = Math.floor(this.showCoordinate().radius);
    // iterate on target array
    arr.map(function (e) {
      var xTarget = Math.floor(e.showCoordinate().x);
      var yTarget = Math.floor(e.showCoordinate().y);
      var dRadius = Math.floor(e.showCoordinate().radius);
      var distance = Math.sqrt(Math.pow(xThis - xTarget, 2) + Math.pow(yThis - yTarget, 2));
      if (distance < pRadius + dRadius && gameOver === true) {
        return clearDots(world);
      }
    });
  };

  // Create Doms for new dots
  window.createDots = function (type, pNum, dNum) {
    var newDiv = document.createElement('div');
    newDiv.className = type;
    newDiv.id = type + (type === 'playerDot' ? pNum : dNum);
    document.getElementById('board').appendChild(newDiv);
    return document.getElementById(newDiv.id);
  }

  // Clear the Doms
  window.clearDots = function (world) {
    var saveScore = world.score;
    var gameBoard = document.getElementById('board');
    gameBoard.innerHTML = '';
    var gameOverDiv = document.createElement('div');
    gameOverDiv.id = 'gameOver';
    gameOverDiv.innerHTML = 'GAME OVER';
    gameBoard.appendChild(gameOverDiv);
    var scoreResultDiv = document.createElement('div');
    scoreResultDiv.id = 'scoreResult';
    scoreResultDiv.innerHTML = 'Score : ' + saveScore;
    gameBoard.appendChild(scoreResultDiv);
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
