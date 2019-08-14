function heroObj(width, height, color, x, y, type) {
    this.entity = new entityObj(width, height, color, x, y, "hero");
    this.speed = 1;
    this.hPower = 0;
    this.maxSpeed = 3;
    this.slowRotate = 5;
    this.maxRotate = 10;
    this.color = color;
    this.startX = x;
    this.startY = y;
    //this.reset = false;
    this.currentLevel=1;
    var jPower = 0;
    var maxJPower = 19;
    var touchingY = false;
    var gravity = 6;
    var maxDrop = 500;

    // Render
    this.update = function(camera) {
        ctx = mainGame.context;
        ctx.save();
        ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
        ctx.fillStyle = color;
        ctx.fillRect(this.entity.width / -2, this.entity.height / -2, this.entity.width, this.entity.height);
        ctx.restore();
    }

    this.newPos = function(tiles) {
      // Update hitbox X and Y
      this.hbX1 = this.entity.x;
      this.hbY1 = this.entity.y;

      // Centre used for checking hero current block
      this.hbX = this.entity.x + this.entity.width / 2;
      this.hbY = this.entity.y + this.entity.height / 2;

      // Calculate new position
      var newX = this.entity.x + (this.hPower * this.speed);
      var newY = this.entity.y + gravity - jPower;

      if(jPower > 0){jPower --;}

      // Move Booleans
      var canMoveY = true;
      var canMoveX = true;

      for (i = 0; i < tiles.length; i++) {
        t = tiles[i];
        if(t.isSolid){

          if(rectColiding(newX, this.hbY1, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
              canMoveX = false;
          }

          if(rectColiding(this.hbX1, newY, this.entity.width, this.entity.height, t.entity.x, t.entity.y, t.entity.width, t.entity.height)){
              canMoveY = false;
          }
        }
      }

      touchingY = !canMoveY;

      // Check if X or Y can be updated
      if(canMoveX){this.entity.x = newX}
      if(canMoveY){this.entity.y = newY}

      // Fallen off the screen
      if(this.entity.y > maxDrop){
        this.entity.y = this.startY;
        this.entity.x = this.startX;
        //this.reset = true;
      }
    }

    // logic
    this.tick = function() {
        if (this.hPower > 0) {
            this.hPower -= 0.3;
            if (this.hPower < 0) this.hPower = 0;
        } else if (this.hPower < 0) {
            this.hPower += 0.3;
            if (this.hPower > 0) this.hPower = 0;
        }

        if (mainGame.keys && !this.jumping && (mainGame.keys[UP] || mainGame.keys[W] || mainGame.keys[SPACE])) {
          if(jPower == 0 && touchingY == true){
            jPower = maxJPower;
          }
        }

        if (mainGame.keys && (mainGame.keys[DOWN] || mainGame.keys[S])) {

        }

        if (mainGame.keys && (mainGame.keys[LEFT] || mainGame.keys[A])) {
          if(this.hPower > -this.maxSpeed){
              this.hPower --;
          }
        }

        if (mainGame.keys && (mainGame.keys[RIGHT] || mainGame.keys[D])) {
          if(this.hPower < this.maxSpeed){
              this.hPower ++;
          }
        }

        // CONTROLLERS
        if(controllers.length > 0){
            // LEFT
            if(controllers[0].axes[0] < -.8 || controllers[0].axes[2] < -.8 || controllers[0].buttons[14].pressed){
              this.hPower --;
            }
            // RIGHT
            if(controllers[0].axes[0] > .8 || controllers[0].axes[2] > .8 || controllers[0].buttons[15].pressed){
              this.hPower ++;
            }
            // FORWARD
            if(controllers[0].axes[1] < -.8 || controllers[0].axes[3] < -.8 || controllers[0].buttons[12].pressed){
              if(jPower == 0 && touchingY == true){
                jPower = maxJPower;
              }
            }
            // BACK
            if(controllers[0].axes[1] > .8 || controllers[0].axes[3] > .8 ||controllers[0].buttons[13].pressed){

            }
        }
    }
}
