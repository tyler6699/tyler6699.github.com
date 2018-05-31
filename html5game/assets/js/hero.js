function heroObj(width, height, color, x, y, type) {
    this.entity = new entityObj(width, height, color, x, y, "hero");

    // Movement VARS
    this.speed = 1;
    this.power = 0;
    this.rotateSpeed = 10;
    this.reverseSpeed = 3;
    this.maxSpeed = 4;
    this.slowRotate = 5;
    this.maxRotate = 10;

    // hitbot
    this.hbX1 = this.entity.x;
    this.hbX2 = this.entity.x + this.entity.width;
    this.hbY1 = this.entity.y;
    this.hbY2 = this.entity.y + this.entity.height;

    // Render
    this.update = function() {
        ctx = mainGame.context;
        ctx.save();
        ctx.translate(this.entity.x, this.entity.y);
        ctx.rotate(this.entity.angle);
        ctx.fillStyle = this.entity.color;
        ctx.fillRect(this.entity.width / -2, this.entity.height / -2, this.entity.width, this.entity.height);
        ctx.restore();
    }

    this.newPos = function(tiles) {
      // Update hitbox X and Y (Centre Point)
      this.hbX = this.entity.x + this.entity.width / 2;
      this.hbY= this.entity.y + this.entity.height / 2;

      // Update Angle
      this.entity.angle += this.moveAngle * Math.PI / 180;

      // Calculate new position
      var newX = this.entity.x + (this.power * this.speed) * Math.sin(this.entity.angle);
      var newY = this.entity.y - (this.power * this.speed) * Math.cos(this.entity.angle);
      var newX2 = newX + this.entity.width;
      var newY2 = newY + this.entity.height;

      // Move Booleans
      var canMoveY = true;
      var canMoveX = true;

      for (i = 0; i < tiles.length; i++) {
          t = tiles[i];
          if(t.isSolid){
            // COLLISION AT NEW LOCATION
            //if (newX < t.entity.x + t.entity.width && newX2 > t.entity.x && newY < t.entity.y + t.entity.height && newY2 > t.entity.y) {
            // HIT
            //}

            // COLLIDES ON NEW X
            if (newX < t.entity.x + t.entity.width && newX2 > t.entity.x && this.hbY < t.entity.y + t.entity.height && this.hbY > t.entity.y) {
              canMoveX = false;
            }

            // COLLIDES ON NEW Y
            if (this.hbX < t.entity.x + t.entity.width && this.hbX > t.entity.x && newY < t.entity.y + t.entity.height && newY2 > t.entity.y) {
              canMoveY = false;
            }
          }
      }

      // Check if X or Y can be updated
      if(canMoveX){this.entity.x = newX}
      if(canMoveY){this.entity.y = newY}
    }

    // logic
    this.tick = function() {
        this.moveAngle = 0;
        if (this.power > 0) {
            this.power -= 0.4;
            if (this.power < 0) this.power = 0;
        } else if (this.power < 0) {
            this.power += 0.4;
            if (this.power > 0) this.power = 0;
        }

        this.rotateSpeed = this.maxRotate;

        if (mainGame.keys && (mainGame.keys[UP] || mainGame.keys[W])) {
            this.power = this.maxSpeed;
        }

        if (mainGame.keys && (mainGame.keys[DOWN] || mainGame.keys[S])) {
            this.power = -this.reverseSpeed;
            this.rotateSpeed = this.slowRotate;
        }

        if (mainGame.keys && (mainGame.keys[LEFT] || mainGame.keys[A])) {
            this.moveAngle = -this.rotateSpeed;
        }

        if (mainGame.keys && (mainGame.keys[RIGHT] || mainGame.keys[D])) {
            this.moveAngle = this.rotateSpeed;
        }

        // CONTROLLERS
        if(controllers.length > 0){
            // LEFT
            if(controllers[0].axes[0] < -.8 || controllers[0].axes[2] < -.8 || controllers[0].buttons[14].pressed){
                this.moveAngle = -this.rotateSpeed;
            }
            // RIGHT
            if(controllers[0].axes[0] > .8 || controllers[0].axes[2] > .8 || controllers[0].buttons[15].pressed){
                this.moveAngle = this.rotateSpeed;
            }
            // FORWARD
            if(controllers[0].axes[1] < -.8 || controllers[0].axes[3] < -.8 || controllers[0].buttons[12].pressed){
                this.power = this.maxSpeed;
            }
            // BACK
            if(controllers[0].axes[1] > .8 || controllers[0].axes[3] > .8 ||controllers[0].buttons[13].pressed){
                this.power = -this.reverseSpeed;
                this.rotateSpeed = this.slowRotate;
            }
        }

    }
}
