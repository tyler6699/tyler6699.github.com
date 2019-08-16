function heroObj(width, height, color, x, y, type) {
  this.entity = new entityObj(width, height, color, x, y, "hero");
  this.speed = 1;
  this.color = color;
  this.startX = x;
  this.startY = y;
  this.currentLevel=1;
  this.active = false;
  this.reset = false;
  var hPower = 0;
  var maxSpeed = 3;
  var jPower = 0;
  var maxJPower = 19;
  var touchingY = false;
  var gravity = 6;
  var maxDrop = 400;

  // Render
  this.update = function(camera) {
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
    ctx.fillStyle = color;
    ctx.fillRect(this.entity.mhWidth, this.entity.mhHeight, this.entity.width, this.entity.height);
    ctx.restore();
  }

  this.newPos = function(tiles) {
    // Update hitbox X and Y
    this.hbX1 = this.entity.x;
    this.hbY1 = this.entity.y;

    updateHitbox();

    // Calculate new position
    var newX = this.entity.x + (hPower * this.speed);
    var newY = this.entity.y + gravity - jPower;

    if(jPower > 0){jPower --;}

    // Move Booleans
    var canMoveY = true;
    var canMoveX = true;

    for (i = 0; i < tiles.length; i++) {
      t = tiles[i];
      if(t.isSolid && t.active){
        if(rectColiding(newX, this.hbY1, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
          canMoveX = false;
        }

        if(rectColiding(this.hbX1, newY, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
          canMoveY = false;
        }
      }
    }

    // Top or bottom touching?
    touchingY = !canMoveY;

    // Check if X or Y can be updated
    if(canMoveX){this.entity.x = newX}
    if(canMoveY){this.entity.y = newY}

    // Fallen off the screen
      if(this.entity.y > maxDrop){
        playSound(FALLFX);
        this.entity.y = this.startY;
        this.entity.x = this.startX;
        this.reset=true;
      }
    }

  // logic
  this.tick = function() {
    if (hPower > 0) {
      hPower -= 0.3;
      if (hPower < 0) hPower = 0;
    } else if (hPower < 0) {
      hPower += 0.3;
      if (hPower > 0) hPower = 0;
    }

    if (mainGame.keys && !this.jumping && (mainGame.keys[UP] || mainGame.keys[W] || mainGame.keys[SPACE])) {
      if(jPower == 0 && touchingY == true){
        jPower = maxJPower;
        playSound(JUMPFX);
      }
    }

    if (mainGame.keys && (mainGame.keys[DOWN] || mainGame.keys[S])) {

    }

    if (mainGame.keys && (mainGame.keys[LEFT] || mainGame.keys[A])) {
    if(hPower > -maxSpeed){ hPower --; }
    }

    if (mainGame.keys && (mainGame.keys[RIGHT] || mainGame.keys[D])) {
      if(hPower < maxSpeed){ hPower ++; }
    }

    // CONTROLLERS
    if(controllers.length > 0){
      // LEFT
      if(controllers[0].axes[0] < -.8 || controllers[0].axes[2] < -.8 || controllers[0].buttons[14].pressed){
        if(hPower > -maxSpeed){ hPower --; }
      }
      // RIGHT
      if(controllers[0].axes[0] > .8 || controllers[0].axes[2] > .8 || controllers[0].buttons[15].pressed){
        if(hPower < maxSpeed){ hPower ++; }
      }
      // FORWARD
      if(controllers[0].axes[1] < -.8 || controllers[0].axes[3] < -.8 || controllers[0].buttons[12].pressed){
        if(jPower == 0 && touchingY == true){
          jPower = maxJPower;
          jumpSFX.play();
        }
      }
      // BACK
      if(controllers[0].axes[1] > .8 || controllers[0].axes[3] > .8 ||controllers[0].buttons[13].pressed){
      }
    }
  }

  this.resetPos = function(x, y){
    hero.startX = x;
    hero.startY = y;
    hero.entity.x = hero.startX;
    hero.entity.y = hero.startY;
    updateHitbox();
    hero.hPower = 0;
    hero.jumping = false;
    hero.active = true;
  }

  function updateHitbox(){
    // Centre used for checking hero current block
    hero.hbX = hero.entity.x + hero.entity.hWidth;
    hero.hbY = hero.entity.y + hero.entity.hHeight / 2;
  }
}
