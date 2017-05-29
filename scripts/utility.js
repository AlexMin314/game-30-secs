(function (window) {

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

  window.collision = function (arr, arrLength) {
    var xThis = Math.floor(this.showCoordinate().x);
    var yThis = Math.floor(this.showCoordinate().y);
    var pRadius = Math.floor(this.showCoordinate().radius);

    for(var i = 0; i < arrLength; i++) {
      var xTarget = Math.floor(arr[i].showCoordinate().x);
      var yTarget = Math.floor(arr[i].showCoordinate().y);
      var dRadius = Math.floor(arr[i].showCoordinate().radius);
      var distance = Math.sqrt(Math.pow(xThis-xTarget,2)+Math.pow(yThis-yTarget,2));
      if(distance < pRadius + dRadius) {
        console.log('Collide' + arr[i]);
      }
    }


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
  window.clearDots = function () {

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
