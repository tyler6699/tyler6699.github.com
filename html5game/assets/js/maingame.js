var mainGame;
var tiles = [];
var sqr = 20;
var tileSize = 32;
var hero;
var controllers = [];
var buttonsPressed = [];

// Camera Test
var camera = new Camera(0, 0);

for (x = 0; x < sqr; x++) {
    for (y = 0; y < sqr; y++) {
        xx = x * tileSize;
        yy = y * tileSize;
        var tile;
        if ( xx < 60 || xx > 350 || yy < 40 || yy > 400 ) {
          tile = new tileObj(tileSize, xx, yy, "tile", true);
        } else {
          tile = new tileObj(tileSize, xx, yy, "tile", false);
        }

        tiles.push(tile);
    }
}

function startGame() {
    hero = new heroObj(30, 30, "white", 115, 115);
    camera.newPos(hero);
    mainGame.start();
}

var mainGame = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
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
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", gp.index, gp.id,gp.buttons.length, gp.axes.length);
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
        tile.update(camera);
    }

    hero.tick(camera);
    hero.newPos(tiles);
    hero.update(camera);
    camera.newPos(hero);
}
