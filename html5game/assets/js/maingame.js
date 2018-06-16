var mainGame;
var island;
var hero;
var controllers = [];
var buttonsPressed = [];
var canvasW = 800;
var canvasH = 600;
var camera;

// Called by body onload on index page
function startGame() {
  camera = new Camera(0, 0);
  island = new island(canvasW, canvasH);
  hero = new heroObj(30, 30, "white", island.midPoint, island.midPoint);
  camera.newPos(hero, island);
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

    island.draw(hero, camera);
    hero.tick(camera);
    hero.newPos(island.tiles);
    hero.update(camera);
    camera.newPos(hero, island);
}
