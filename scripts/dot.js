(function (window) {
  window.Dots = function (dotNum, scale) {

    // Settings
    var dots = null;

    var speed = Math.floor(Math.random() * 4 + 2);
    var multi = scale;
    var dx = Math.random() > 0.5 ? speed * multi : -speed * multi;
    var dy = Math.random() > 0.5 ? speed * multi : -speed * multi;

    var colorSeed = [, , 'rgb(0, 255, 18)', 'rgb(0, 247, 255)', 'rgb(250, 255, 0)', 'rgb(214, 18, 231)'];
    var colorSelect = colorSeed[speed];

    init();

    function init() {
      dots = createDots('dots', null, dotNum);
      // Starting Point : random
      var h = window.innerHeight;
      var w = window.innerWidth;
      var downside = Math.random() * (h / 10) + (h * 9 / 10) - 25;
      var upside = Math.random() * (h / 10) + 25;
      var randomSeed = Math.random() * 2 < 1 ? upside : downside;
      dots.style.top = Math.floor(randomSeed) + 'px';
      dots.style.left = Math.floor(Math.random() * (w - 100) + 50) + 'px';
      dots.style.backgroundColor = colorSelect;
    }

    this.drawDotMove = function () {
      var dRect = dots.getBoundingClientRect();
      var x = dRect.left;
      var y = dRect.top;
      var dModifier = (Math.random() * 2).toFixed(1);

      // Wall bouncing
      if (x + dx > window.innerWidth - dRect.width || x + dx < 0) {
        dx = -dx;
      }
      if (y + dy > window.innerHeight - dRect.width || y + dy < 0) {
        dy = -dy;
      }


      // Dot bouncing
      // var dotRadius =
      // var distance = Math.sqrt(dx * dx + dy * dy);


      x += dx;
      y += dy;
      dots.style.left = x + 'px';
      dots.style.top = y + 'px';
    };

  };

  // following enemy Constructor
  window.FollowingDots = function () {

  };


}(window));
