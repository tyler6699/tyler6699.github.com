var mainGame;
var tiles = [];
var sqr = 16;
var islandSize = 8;
var tileSize = 32;
var midPoint = (sqr/2) * tileSize;
var hero;
var controllers = [];
var buttonsPressed = [];
var canvasW = 800;
var canvasH = 600;
var canvasHalfW = canvasW / 2;
var canvasHalfH = canvasH / 2;

// Camera Test
var camera = new Camera(0, 0);

// Initial Map
xOffset = 2 * tileSize;
minX =  xOffset;
maxX = sqr * tileSize - (1.5 * xOffset);

for (x = 0; x < sqr; x++) {
    for (y = 0; y < sqr; y++) {
      xx = x * tileSize;
      yy = y * tileSize;

      var tile;
      if ( xx < minX || xx > maxX || yy < minX || yy > maxX ) {
        tile = new tileObj(tileSize, xx, yy, "tile", true);
      } else {
        tile = new tileObj(tileSize, xx, yy, "tile", false);
      }

      tiles.push(tile);
    }
}

// Code tiles
for (i = 0; i < tiles.length; i++) {
  tile = tiles[i];

}

function startGame() {
  hero = new heroObj(30, 30, "white", midPoint, midPoint);
  camera.newPos(hero);
  mainGame.start();
}

var mainGame = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = canvasW;
        this.canvas.height = canvasH;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function(e) {
            e.preventDefault();
            mainGame.keys = (mainGame.keys || []);
            mainGame.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function(e) {
            mainGame.keys[e.keyCode] = (e.type == "keydown");
        })

        window.addEventListener("gamepadconnected", function(e) {
            var gp = navigator.getGamepads()[e.gamepad.index];
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", gp.index, gp.id, gp.buttons.length, gp.axes.length);
            controllers[e.gamepad.index] = e.gamepad;
        });

    },
    stop: function() {
        clearInterval(this.interval);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function updateGameArea() {
    // Update Gamepads
    navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    mainGame.clear();

    for (i = 0; i < tiles.length; i++) {
      tile = tiles[i];

      // Only draw tiles on screen
      xCheck = (tile.entity.x > (hero.entity.x - canvasHalfW)) && (tile.entity.x < (hero.entity.x + canvasHalfW + tileSize));
      yCheck = false;
      if(xCheck){
        yCheck = (tile.entity.y > (hero.entity.y - canvasHalfH)) && (tile.entity.y < (hero.entity.y + canvasHalfH + tileSize));
      }
      if( xCheck && yCheck ){
        tile.update(camera);
      }
    }

    hero.tick(camera);
    hero.newPos(tiles);
    hero.update(camera);

    camera.newPos(hero);
}
