// ╔═══════════════════════════════╗
// ║ HTML 5 Game by @CarelessLabs  ║
// ╚═══════════════════════════════╝
var debug = false;
var offset = 70;
var mainGame;
var level;
var hero;
var controllers = [];
var buttonsPressed = [];
var canvasW = 800;
var canvasH = 600;
var camera;

// Called by body onload on index page
function startGame() {
  camera = new Camera(0, 0);
  level = new level(canvasW, canvasH, 1);
  level.reset(1);
  hero = new heroObj(25, 25, "green", level.startX, level.startY);
  camera.newPos(hero, level);
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
        // Keyboard
        window.addEventListener('keydown', function(e) {
            e.preventDefault();
            mainGame.keys = (mainGame.keys || []);
            mainGame.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function(e) {
            mainGame.keys[e.keyCode] = (e.type == "keydown");
        })
        // Mouse Buttons
        window.addEventListener('mousedown', function(e) {
            e.preventDefault();
            mainGame.keys = (mainGame.keys || []);
            mainGame.keys[e.button] = true;
        })
        window.addEventListener('mouseup', function(e) {
            e.preventDefault();
            mainGame.keys = (mainGame.keys || []);
            mainGame.keys[e.button] = false;
        })
        // Disable right click context menu
        this.canvas.oncontextmenu = function (e) {
          e.preventDefault();
        };
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
  // if(hero.reset){
  //   hero.reset = false;
  //   level.reset(hero.currentLevel);
  // }

  // Update Gamepads
  navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  mainGame.clear();
  level.draw(hero, camera);
  hero.tick(camera);
  hero.newPos(level.tiles);
  hero.update(camera);
  camera.newPos(hero, level);
}
