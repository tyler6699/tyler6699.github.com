var mainGame;
var tiles = [];
var sqr = 20;
var tileSize = 16;
var hero;

for(x = 0; x < sqr; x++){
for(y = 0; y < sqr; y++){
  xx = x * tileSize;
  yy = y * tileSize;
  if((xx < 100 || xx > 500) || (yy < 90 || yy > 500)){
    color = "#000080";
  } else {
    color = "#228B22";
  }

  var tile = new tileObj(tileSize, color, xx, yy, "tile");
  tiles.push(tile);
}
}

function startGame() {
  hero = new heroObj(30, 30, "white", 115, 115);
  mainGame.start();
}

var mainGame = {
  canvas : document.createElement("canvas"),
  start : function() {
      this.canvas.width = 800;
      this.canvas.height = 600;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.frameNo = 0;
      this.interval = setInterval(updateGameArea, 20);
      window.addEventListener('keydown', function (e) {
          e.preventDefault();
          mainGame.keys = (mainGame.keys || []);
          mainGame.keys[e.keyCode] = (e.type == "keydown");
      })
      window.addEventListener('keyup', function (e) {
          mainGame.keys[e.keyCode] = (e.type == "keydown");
      })
  },
  stop : function() {
      clearInterval(this.interval);
  },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function updateGameArea() {
mainGame.clear();

for (i=0; i<tiles.length; i++) {
  tile = tiles[i];
  tile.update();
}

hero.tick();
hero.newPos();
hero.update();
}
