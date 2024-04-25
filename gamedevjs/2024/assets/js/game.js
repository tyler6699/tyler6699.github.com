// ╔══════════════════════════════════╗
// ║ JS13K template by @CarelessLabs  ║
// ╚══════════════════════════════════╝

// Reference for new atlas
let canvasW = window.innerWidth;
let canvasH = window.innerHeight;
let gameStarted = false;
let charSet=0;
let delta = 0.0;
let prevDelta = Date.now();
let currentDelta = Date.now();
let TIME = 0;
let mousePos = new vec2(0,0);
let clickedAt = new vec2(0,0);
let clickedRec = new rectanlge(0,0,0,0);
let processClick = false;
let GAMEOVER=false;
let RELOAD=false;
let WIN = false;
let STAGE=0;
let atlas = new Image();
atlas.src = "atlas.png";
// Shadows
let shadowImage=new Image();
let cart = new Cart();
let start=false;
let music=false;
let pause=false;
let leftMB=false;
let rightMB=false;
let startDelay=0.1;
let zoom=4;
let fps = 60; // A reasonable default value
let frameCount = 0;
let elapsedTime = 0;

var nativeWidth = 800;  // The resolution the game is designed to look best in
var nativeHeight = 600;
var deviceWidth = window.innerWidth;  // Check for browser compatibility
var deviceHeight = window.innerHeight;
var scaleFillNative = Math.max(deviceWidth / nativeWidth, deviceHeight / nativeHeight);
var colour = 1;

var mobUp=false;
var mobDown=false;
var mobRight=false;
var mobLeft=false;
let shaky = true;

// Load the music player
genAudio();

// Called by body onload on index page
function startGame() {
  mg.start();
  resizeCanvas(this.ctx);
  setupControls();

  document.getElementById('gameControls').addEventListener('touchstart', (event) => {
      event.preventDefault();  // Prevent scrolling/zooming on the control buttons
  }, { passive: false });

}

let mg = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = nativeWidth * scaleFillNative;
    this.canvas.height = nativeHeight * scaleFillNative;
    this.context = this.canvas.getContext("2d");
    this.context.scale(1, 1);
    this.context.setTransform(scaleFillNative, 0, 0, scaleFillNative, 0, 0);

    // PixelArt Sharp
    ctx=this.context;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    this.canvas.classList.add("screen");
    document.body.insertBefore(this.canvas, document.body.childNodes[6]);
    // Run the game loop
    this.frameId = requestAnimationFrame(updateGameLoop);

    // Keyboard
    window.addEventListener('keydown', function(e) {
      if(!music){
        music=true
        audio.loop=true;
        audio.play();
      }
      if(startDelay<=0&&charSet==3)start=true;
      e.preventDefault();
      mg.keys = (mg.keys || []);
      mg.keys[e.keyCode] = (e.type == "keydown");
    })
    window.addEventListener('keyup', function(e) {
      mg.keys[e.keyCode] = (e.type == "keydown");
      if(e.keyCode==R) RELOAD=true;
      if(e.keyCode==M) pause=!pause;
      if(e.keyCode==T) cart.tips=!cart.tips;
    })
    window.addEventListener('mouseup', function(e) {
      e.preventDefault();
      setclicks();

      if (e.button === 0) {
        leftMB=false;
      } else if (e.button === 2) {
        rightMB=false;
      }
    })
    window.addEventListener('mousedown', function(e) {
      e.preventDefault();
      if (e.button === 0) {
        leftMB=true;
      } else if (e.button === 2) {
        rightMB=true;
      }
    })
    // Add an event listener for window resize.
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', function(e) {
      e.preventDefault();
      var r = mg.canvas.getBoundingClientRect();
      mousePos.set((e.clientX - r.left) / (r.right - r.left) * canvasW,
                   (e.clientY - r.top) / (r.bottom - r.top) * canvasH);
    })
    // Disable right click context menu
    this.canvas.oncontextmenu = function(e) {
      e.preventDefault();
    };
  },
  stop: function() {
    if (mg.frameId) {
      cancelAnimationFrame(mg.frameId);
      // Reset the frameId
      mg.frameId = null;
    }
  },
  clear: function() {
    this.context.clearRect(0, 0, 4*this.canvas.width, 4*this.canvas.height);
  }
}

// Mobile Controls
function setupControls() {
    document.getElementById('up').addEventListener('touchstart', () => move('up'));
    document.getElementById('up').addEventListener('touchend', () => stopmove('up'));
    document.getElementById('down').addEventListener('touchstart', () => move('down'));
    document.getElementById('down').addEventListener('touchend', () => stopmove('down'));
    document.getElementById('left').addEventListener('touchstart', () => move('left'));
    document.getElementById('left').addEventListener('touchend', () => stopmove('left'));
    document.getElementById('right').addEventListener('touchstart', () => move('right'));
    document.getElementById('right').addEventListener('touchend', () => stopmove('right'));
    document.getElementById('aButton').addEventListener('touchstart', () => action('A'));
}

function move(d) {
    // Handle movement logic here
    if(d=='up'){
      mobUp=true;
    } else if(d=='down'){
      mobDown=true;
    } else if(d=='left'){
      mobLeft=true;
    } else if(d=='right'){
      mobRight=true;
    }
}

function stopmove(d) {
    if(d=='up'){
      mobUp=false;
    } else if(d=='down'){
      mobDown=false;
    } else if(d=='left'){
      mobLeft=false;
    } else if(d=='right'){
      mobRight=false;
    }
}

function action(button) {
    // Handle action button logic here
    if(!gameStarted){
      gameStarted=true;
    }
    processClick=true;
}

let lastTimestamp = null;
function updateGameLoop(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;

  // Calculate the delta time (in seconds)
  let deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  // Update the FPS every second
  elapsedTime += deltaTime;
  frameCount++;
  if (elapsedTime >= 1.0) { // Update the FPS once every second
    fps = frameCount / elapsedTime;
    frameCount = 0;
    elapsedTime = 0;
  }

  // Update the game state and render
  updateGameArea(deltaTime);

  // Display FPS
  displayFPS(fps);

  // Request the next frame
  mg.frameId = requestAnimationFrame(updateGameLoop);
}

function updateGameArea(delta) {
  if(GAMEOVER){
    TIME=0;
    GAMEOVER=false;
    WIN=false;
    STAGE=0;
    start=false;
    gameStarted=false;
    startDelay=3;
  }

  if(start) gameStarted=true;
  if(startDelay>0)startDelay-=delta;
  cart.update(delta, gameStarted);

  // Reset Click to false
  // If it is still true on the next loop could cause an unexpected action
  processClick=false;
}

function left() {
  return (mg.keys && (mg.keys[LEFT] || mg.keys[A])) || mobLeft;
}

function right() {
  return (mg.keys && (mg.keys[RIGHT] || mg.keys[D])) || mobRight;
}

function up() {
  return (mg.keys && (mg.keys[UP] || mg.keys[W])) || mobUp;
}

function down() {
  return (mg.keys && (mg.keys[DOWN] || mg.keys[S])) || mobDown;
}

function space() {
  return (mg.keys && mg.keys[SPACE]) || leftMB;
}

function shift() {
  return (mg.keys && mg.keys[SHIFT]) || rightMB;
}

function t() {
  return mg.keys && (mg.keys[T]);
}

function setclicks(){
  clickedAt.set(mousePos.x, mousePos.y);
  clickedRec.x=mousePos.x-5;
  clickedRec.y=mousePos.y+5;
  clickedRec.h=10;
  clickedRec.w=10;
}

function resizeCanvas() {
  deviceWidth = window.innerWidth;  // Check for browser compatibility
  deviceHeight = window.innerHeight;
  canvasW = window.innerWidth;
  canvasH = window.innerHeight;
  scaleFillNative = Math.max(deviceWidth / nativeWidth, deviceHeight / nativeHeight);
  scaleFitNative = Math.min(deviceWidth / nativeWidth, deviceHeight / nativeHeight);
  ctx.canvas.width = nativeWidth * scaleFillNative;
  ctx.canvas.height = nativeHeight * scaleFillNative;

  this.context = ctx.canvas.getContext("2d");
  this.context.setTransform(scaleFillNative, 0, 0, scaleFillNative, 0, 0);
  this.ctx.mozImageSmoothingEnabled = false;
  this.ctx.webkitImageSmoothingEnabled = false;
  this.ctx.imageSmoothingEnabled = false;
}
