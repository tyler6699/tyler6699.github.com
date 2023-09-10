function heroObj(width, height, color, x, y, type) {
  this.entity = new entityObj(width, height, x, y, "hero");
  this.winner = false;
  this.loser = false;
  this.maxLives = 99;
  this.lives = 99;
  this.died = false;
  this.fell = false;
  this.speed = 1;
  this.color = color;
  this.startX = x;
  this.startY = y;
  this.currentLevel=0;
  this.prevLevel=null;
  this.active = false;
  this.reset = false;
  this.jumping = false;
  this.onLadder = false;
  this.exitLadder = false;
  this.onLeftA = false;
  this.onRightA = false
  this.image = new Image();
  this.image.src = atlas;
  this.fx = [];
  var hPower = 0;
  this.maxSpeed = 3;
  var jPower = 0;
  this.maxJPower = 17;
  var touchingY = false;
  var gravity = defaultG;
  var maxDrop = 700; // FIX
  var ladderUp = false;
  var ladderDown = false;
  var ladderTopDiff = 0;
  var fallTime = 0;

  // Render
  this.update = function(camera) {
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
    // COLOURS
    // #ebedf0 #c6e48b #7bc96f #239a3b #196127
    ctx.fillStyle = "#196127";
    ctx.fillRect(this.entity.mhWidth, this.entity.mhHeight, this.entity.width, this.entity.height);
    ctx.restore();

    // FX
    for (i = 0; i < this.fx.length; i++) {
      var f = this.fx[i];
      f.tick();
      f.update(camera);
      if (f.entity.active == false) this.fx.splice(i,1);
    }
  }

  this.newPos = function(tiles, intro) {
    ladderTopDiff = 0;
    var oldY = this.entity.y;
    var wasFalling = this.falling;
    gravity = this.onLadder && !this.exitLadder ? 0 : defaultG;

    // Ladders kill jump speed
    if(this.onLadder && !this.exitLadder) jPower = 0;

    // Update hitbox X and Y
    this.hbX1 = this.entity.x;
    this.hbY1 = this.entity.y;

    updateHitbox();

    // Calculate new position
    var newX = this.entity.x + (hPower * this.speed);
    var newY = this.entity.y + gravity - jPower;
    var falling = false;

    // Add dust to running on conveyors
    if(this.onLeftA){
      newX -= 3;
      if(hPower > 3 && this.fx.length < 10){
        this.fx.push(new fx(this, DUST, LEFT, true));
      }
    } else if(this.onRightA){
      newX += 3;
      if(hPower < -3 && this.fx.length < 10){
        this.fx.push(new fx(this, DUST, RIGHT, true));
      }
    }

    if(fallTime > 3.5){
      this.fx.push(new fx(this, DUST, RIGHT, true));
      this.fx.push(new fx(this, DUST, LEFT, true));
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

      // X Move
      if(t.isSolid && t.active){
        if(rectColiding(newX, this.hbY1, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
          if(!t.oneWay){
            canMoveX = false;
          }
        }
      }

      // Y MOVE
      if(rectColiding(this.hbX1, newY, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
        if(t.isSolid && t.active){
          if(t.oneWay){ // JUMP THROUGH
            if(this.entity.y + this.entity.height <= t.entity.y){
              canMoveY = false;
              if(!this.jumping){
                this.entity.y = t.entity.y - this.entity.height;
              }
            }
          } else {
            canMoveY = false;
            if(!this.jumping){ // SNAP TO Y
              if(this.entity.y + this.entity.height < t.entity.y){
                this.entity.y = t.entity.y - this.entity.height;
              }
            }
          }
        } else if(t.type == LADDER || t.type == LADDERTOP){
          this.onLadder = true;
        }
      }

      if(t.type == LADDERTOP){
        if(rectColiding(this.hbX1, newY+28, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
          this.exitLadder = true;
          ladderTopDiff = t.entity.y - newY;
        }
      } else if(t.type == LEFTA){ // CONVEYORS
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
      intro.gitUI.setScores = true;
      playSound(FALLFX,1);
      this.lives --;
      this.fell = true;
      this.entity.y = this.startY;
      this.entity.x = this.startX;
      intro.reset();
      this.reset=true;
    }

    // Are we falling?
    this.falling = this.entity.y != oldY;
    if(this.falling != wasFalling && touchingY && jPower == 0){
      this.fx.push(new fx(this, DUST, LEFT, false));
      this.fx.push(new fx(this, DUST, RIGHT, false));
    }

    // Add fall wind
    if(!this.onLadder && !this.exitLadder && !touchingY) {
      fallTime += 0.1;
    } else {
      fallTime = 0;
    }
  }

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
    if(hPower > -this.maxSpeed){ hPower --; }
    }

    if (mainGame.keys && (mainGame.keys[RIGHT] || mainGame.keys[D])) {
      if(hPower < this.maxSpeed){ hPower ++; }
    }

    // CONTROLLERS
    if(controllers.length > 0){
      // LEFT
      if(controllers[0].axes[0] < -.8 || controllers[0].axes[2] < -.8 || controllers[0].buttons[14].pressed){
        if(hPower > -this.maxSpeed){ hPower --; }
      }
      // RIGHT
      if(controllers[0].axes[0] > .8 || controllers[0].axes[2] > .8 || controllers[0].buttons[15].pressed){
        if(hPower < this.maxSpeed){ hPower ++; }
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
    this.fx = [];
    fallTime=0;
  }

  this.updateHitbox = function(){
    updateHitbox();
  }

  function updateHitbox(){
    // Centre Position
    hero.hbX = hero.entity.x + hero.entity.hWidth;
    hero.hbY = hero.entity.y + hero.entity.hHeight / 2;
  }

  this.moveUp = function(){
    if(jPower == 0 && (touchingY == true || (this.exitLadder == true && ladderTopDiff <= 15))){
      this.jumping = true;
      jPower = this.maxJPower;
      playSound(JUMPFX,1);
    }
    if(this.onLadder){ ladderUp = true; }
  }

  this.gethPower = function(){
    return hPower;
  }

  this.resetHero = function(){
    this.currentLevel = 0;
    this.lives = this.maxLives;
  }
}
