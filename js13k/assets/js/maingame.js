// ╔═══════════════════════════════╗
// ║ JS13K Entry by @CarelessLabs  ║
// ╚═══════════════════════════════╝
var debug = false;
var offset = 100;
var mainGame;
var level;
var hero;
var hud;
var clock;
var controllers = [];
var buttonsPressed = [];
var canvasW = 600;
var canvasH = 400;
var camera;
var gameStart = false;
var lastDT = Date.now();
var currentDT = Date.now();
var timeElapsed = 0;
var delta=0;
var defaultG = 6;
var music=true;
var mTime=0;

// Called by body onload on index page
function startGame() {
  camera = new Camera(0, 0);
  level = new level(canvasW, canvasH, 1);
  level.reset(null);
  hero = new heroObj(25, 25, "green", level.startX, level.startY);
  camera.newPos(hero, level);
  intro = new intro();
  hud = new hud();
  clock = new clock();
  genAudio();
  mainGame.start();
}

var mainGame = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = canvasW;
        this.canvas.height = canvasH;
        this.context = this.canvas.getContext("2d");
        // PixelArt Sharp
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        this.canvas.classList.add("screen");
        document.body.insertBefore(this.canvas, document.body.childNodes[6]);
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
            //console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", gp.index, gp.id, gp.buttons.length, gp.axes.length);
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
  // Delta
  lastDT = currentDT;
  currentDT = Date.now();
  delta = currentDT - lastDT;
  timeElapsed += delta;
  // Update Gamepads
  navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);

  if(gameStart){
    if(music && songLoaded){
      audio.play();
      music=false;
    } else {
      mTime += delta;
      if(mTime > 90000){
        audio.currentTime = 0;
        audio.play();
        mTime=0;
      }
    }
    mainGame.clear();
    level.draw(hero, camera);

    // Logic
    if(intro.done && intro.gitUI.done){
      if(level.active == false){
        level.active = true;
        clock.setStartTime();
        //console.log("Level: " + hero.currentLevel + " Lives: " + hero.lives + " Current: " + clock.currentTime + " Prev: " + clock.prevTime);
      }
      hero.tick(camera);
      hero.newPos(level.tiles, intro);
      level.tick(hero, intro, clock);
      clock.tick(delta, clock);
      // Draw
      hero.update(camera);
    } else {
      intro.gitUI.update(canvasW, canvasH, hero, delta, clock, level);
      intro.trans(canvasW, canvasH);
    }

    camera.newPos(hero, level);
    hud.update(canvasW, hero, clock, level);

    // Out of lives
    if(hero.lives < 0){
      gameStart = false;
      clock.reset();
      hero.resetHero();
      level.reset(hero);
    }

    // Out of time
    if (clock.timeOver){
      if(!hero.reset){
        clock.setStartTime();
        intro.gitUI.setScores = true;
        // hero.lives--;
        hero.reset = true;
      }
    }

    // Git Interface
    intro.gitUI.tick(delta, level, clock, hero);
  } else {
    mainGame.clear();
    intro.tick(delta);
  }
}
