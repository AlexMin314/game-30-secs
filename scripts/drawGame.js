// Event Listner setup
var drawGame = function(mouse, playerList, playerLength, dotList, dotLength) {

  function getMousePos(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  (function () {
    document.addEventListener('mousemove', getMousePos, false);
  }());

  function draw() {
    for (var i = 0; i < playerLength; i++) {
      playerList[i].drawPlayerMove(mouse);
      // enemy dot move
    }
    for (var i = 0; i < dotLength; i++) {
      dotList[i].drawDotMove();
    }
  }

  (function animloop() {
      requestAnimFrame(animloop);
      draw();
  }());

};
