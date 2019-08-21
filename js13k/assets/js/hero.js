function heroObj(width, height, color, x, y, type) {
  this.entity = new entityObj(width, height, color, x, y, "hero");
  this.speed = 1;
  this.color = color;
  this.startX = x;
  this.startY = y;
  this.currentLevel=0;
  this.active = false;
  this.reset = false;
  this.jumping = false;
  this.onLadder = false;
  this.exitLadder = false;
  this.onLeftA = false;
  this.onRightA = false
  var hPower = 0;
  var maxSpeed = 3;
  var jPower = 0;
  var maxJPower = 19;
  var touchingY = false;
  var defaultG = 6;
  var gravity = defaultG;
  var maxDrop = 400;
  var ladderUp = false;
  var ladderDown = false;

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
    gravity = this.onLadder && !this.exitLadder ? 0 : defaultG;

    // Update hitbox X and Y
    this.hbX1 = this.entity.x;
    this.hbY1 = this.entity.y;

    updateHitbox();

    // Calculate new position
    var newX = this.entity.x + (hPower * this.speed);
    var newY = this.entity.y + gravity - jPower;
    var falling = false;

    if(newY > this.entity.y) falling = true;

    if(this.onLeftA){
      newX -= 3;
    } else if(this.onRightA){
      newX += 3;
    }

    if(this.onLadder){
      if(ladderUp && !this.exitLadder){
        newY -= 3;
        ladderUp = false;
        // Cancel out jump
        newY += jPower;
      } else if(ladderDown){
        newY += 3;
        ladderDown = false;
      }
    }
    this.exitLadder = false;

    if(jPower > 0){
      jPower --;
    } else {
      this.jumping = false;
    }

    // Move Booleans
    var canMoveY = true;
    var canMoveX = true;
    this.onLadder = false;
    this.onLeftA = false;
    this.onRightA = false

    for (i = 0; i < tiles.length; i++) {
      t = tiles[i];
      if(t.isSolid && t.active){
        if(rectColiding(newX, this.hbY1, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
          if(!t.oneWay){
            canMoveX = false;
          }
        }
      }

      if(rectColiding(this.hbX1, newY, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
        if(t.isSolid && t.active){
          if(t.oneWay){
            if (this.entity.y + this.entity.height <= t.entity.y){
              canMoveY = false;
              if(falling) this.entity.y = t.entity.y - this.entity.height;
            }
          } else {
            canMoveY = false;
            if(falling) this.entity.y = t.entity.y - this.entity.height;
          }
        } else if(t.type == LADDER || t.type == LADDERTOP){
          this.onLadder = true;
        }
      }

      if(t.type == LADDERTOP){
        if(rectColiding(this.hbX1, newY+28, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
          this.exitLadder = true;
        }
      } else if(t.type == LEFTA){
        if(rectColiding(this.hbX1, newY+10, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
          this.onLeftA = true;
        }
      } else if(t.type == RIGHTA){
        if(rectColiding(this.hbX1, newY+10, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
          this.onRightA = true;
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
      playSound(FALLFX,1);
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
      this.moveUp();
    }

    if (mainGame.keys && (mainGame.keys[DOWN] || mainGame.keys[S])) {
      if(this.onLadder){ ladderDown = true; }
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
      // UP
      if(controllers[0].axes[1] < -.8 || controllers[0].axes[3] < -.8 || controllers[0].buttons[12].pressed){
        this.moveUp();
      }
      // BACK
      if(controllers[0].axes[1] > .8 || controllers[0].axes[3] > .8 ||controllers[0].buttons[13].pressed){
        if(this.onLadder){ ladderDown = true; }
      }
    }
  }

  this.resetPos = function(x, y){
    this.startX = x;
    this.startY = y;
    this.entity.x = this.startX;
    this.entity.y = this.startY;
    updateHitbox();
    hPower = 0;
    jumping = false;
    jPower = 0;
    this.active = true;
  }

  this.updateHitbox = function(){
    updateHitbox();
  }

  function updateHitbox(){
    // Centre used for checking hero current block
    hero.hbX = hero.entity.x + hero.entity.hWidth;
    hero.hbY = hero.entity.y + hero.entity.hHeight / 2;
  }

  this.moveUp = function(){
    if(jPower == 0 && (touchingY == true || this.exitLadder == true)){
      this.jumping = true;
      jPower = maxJPower;
      playSound(JUMPFX,1);
    }
    if(this.onLadder){ ladderUp = true; }
  }
}
