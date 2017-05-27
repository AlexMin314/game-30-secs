// Event Listner setup
var drawGame = function(mouse, playerList, playerListLength) {

  function getMousePos(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  (function () {
    document.addEventListener('mousemove', getMousePos, false);
  }());

  function draw() {
    for (var i = 0; i < playerListLength; i++) {
      playerList[i].drawPlayerMove(mouse);
    }
  }

  (function animloop() {
      requestAnimFrame(animloop);
      draw();
  }());

};
