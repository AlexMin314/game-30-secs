(function () {

  /* Caching info and Div related utility */

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

  // Show information to public.
  window.utility = function () {
    return {
      godMode: divInfo.godModeE,
      sound: divInfo.soundE,
      gameBoard: divInfo.gameBoard,
      wrapper: divInfo.wrapper,
      countBeep: divInfo.counterE,
      starE1: divInfo.starE1,
      starE2: divInfo.starE2
    };
  }


  /* Helper functions */

  // Wrapper as a helper.
  function makeWrapper () {
    var wrapperDiv = document.createElement('div');
    wrapperDiv.id = 'wrapper';
    divInfo.gameBoard.appendChild(wrapperDiv);
    divInfo.wrapper = document.getElementById('wrapper');
  }

  // Append helper
  function appendTo (type, parent, id) {
    var temp = document.createElement(type);
    temp.id = id;
    parent.appendChild(temp);
    return temp;
  }

  // Audio tag helper
  window.audioTagHelper = function (id, src, loop, auto, volume) {
    var audioTag = appendTo ('audio', divInfo.gameBoard, id)
    audioTag.src = src;
    audioTag.loop = loop;
    audioTag.autoplay = auto;
    audioTag.volume = volume || 1;
  };


  /* Start and GameOver, Pause Divs */

  // Appending Start Button div.
  window.startButton = function () {
    // Appending Wrapper to game board.
    makeWrapper();

    // Appending Start Button to wrapper.
    var sButton = appendTo('div', divInfo.wrapper, 'gameStart');
    sButton.innerHTML = 'START<br>BUTTON';

    // Appending Sound Button to wrapper.
    var soundButton = appendTo('div', divInfo.wrapper, 'sound');
    soundButton.innerHTML = '<i class="fa fa-volume-up"></i> on';
    divInfo.soundE = document.getElementById('sound');

    // Appending Start Button to wrapper.
    var godmodeButton = appendTo('div', divInfo.wrapper, 'godmode');
    godmodeButton.innerHTML = '<i class="fa fa-toggle-off fa-lg" title="DebugMode"></i>';
    divInfo.godModeE = document.getElementById('godmode');

    // Appending Instruction texts.
    var instructionDiv = appendTo('div', divInfo.wrapper, 'instruction');
    instructionDiv.innerHTML = 'DODGE DOTS <i class="fa fa-star fa-spin"></i> GRAB STARS<br>' + '<p>MOUSE CONTROL | PAUSE: SPACEBAR</p>';
    divInfo.instruction = document.getElementById('instruction');
  };

  // Game over and Showing game result.
  window.gameOverAndResult = function (world) {
    // Removing dot elements.
    divInfo.gameBoard.innerHTML = '';

    // Clear beep sound.
    clearInterval(world.thirtySecBeep);

    // Play game over sound
    if (world.sound) backgroundSound(world, gameOverChk());

    // Appending Wrapper to game board for game over screen.
    makeWrapper();

    // Appending scoreResultDiv to the wrapper
    var scoreResultDiv = appendTo('div', divInfo.wrapper, 'scoreResult');
    scoreResultDiv.innerHTML = 'SCORE: ' + world.score;

    // Appending gameOverDiv to the wrapper
    var gameOverDiv = appendTo('div', divInfo.wrapper, 'gameOver');
    gameOverDiv.innerHTML = 'GAME OVER';

    // Appending retryDiv to the wrapper
    var retryDiv = appendTo('div', divInfo.wrapper, 'retry')
    retryDiv.innerHTML = '<i class="fa fa-repeat"></i>  RETRY';

    // Event Listening on RETRY.
    document.getElementById('retry').addEventListener('click', function (e) {
      // Beep sound when retry clicked.
      if (world.sound) world.clickSound.play();

      // Reload page.
      setInterval(function () {
        window.location.reload(false);
      }, 700);
    }, false);

  };

  // Game Pause Screen display.
  window.gamePauseScreen = function (world) {
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
    // Mute.
    if (!world.sound) divInfo.gameBoard.removeChild(document.getElementById('bgSound'));
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
    var scoreDiv = appendTo('div', divInfo.gameBoard, 'score');
    scoreDiv.innerHTML = 'SCORE.<br>' + world.score;

    // Adding Dot number at right side of game board.
    var dotNum = appendTo('div', divInfo.gameBoard, 'dotNum');
    dotNum.innerHTML = 'DOTS<br>' + world.dotLength;
  };

  // Updating Dot Numbers and Scores on gameBoard.
  window.updatingBoard = function (scoreBoard, dotNumBoard, world) {
    scoreBoard.innerHTML = 'SCORE<br>' + world.score;
    dotNumBoard.innerHTML = 'DOTS<br>' + world.dotLength;
  };

  // Showing starting messages.
  window.tutorial = function (startButtonText, world) {
    var interval = 700;
    setTimeout(function () {
      startButtonText.innerHTML = 'EVERY<br>30 SECS'
    }, interval * 0);
    setTimeout(function () {
      startButtonText.innerHTML = 'GOOD<br>LUCK'
    }, interval * 1);
    setTimeout(function () {
      // Store element to reducing dom access.
      divInfo.starE1 = document.getElementById('star1');
      divInfo.starE2 = document.getElementById('star2');
      divInfo.counterE = document.getElementById('counter');
      // Count 1 sound play.
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
    Array.prototype.map = function (callback, thisArg) {
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

}());
