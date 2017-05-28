(function(window){

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

  window.createDots = function (type, pNum, dNum) {
    var newDiv = document.createElement('div');
    newDiv.className = type;
    newDiv.id = type + (type === 'playerDot' ? pNum : dNum);
    document.getElementById('board').appendChild(newDiv);
    return document.getElementById(newDiv.id);
  }

  window.clearDots = function () {

  }

  // Cross browsing
  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

// Polypill here

}(window));
