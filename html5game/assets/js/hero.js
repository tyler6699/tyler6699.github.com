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

    this.newPos = function() {
        this.entity.angle += this.moveAngle * Math.PI / 180;
        this.entity.x += (this.power * this.speed) * Math.sin(this.entity.angle);
        this.entity.y -= (this.power * this.speed) * Math.cos(this.entity.angle);
    }

    // logic
    this.tick = function(){
      // HERO
      this.moveAngle = 0;
      if(this.power > 0){
          this.power -= 0.4;
          if (this.power < 0) this.power = 0;
      } else if(this.power < 0){
        this.power += 0.4;
        if (this.power > 0) this.power = 0;
      }

      this.rotateSpeed = this.maxRotate;

      if (mainGame.keys && (mainGame.keys[UP] || mainGame.keys[W])){
        this.power = this.maxSpeed;
      }

      if (mainGame.keys && (mainGame.keys[DOWN] || mainGame.keys[S])) {
        this.power = -this.reverseSpeed;
        this.rotateSpeed = this.slowRotate;
      }

      if (mainGame.keys && (mainGame.keys[LEFT] || mainGame.keys[A])){
        this.moveAngle = -this.rotateSpeed;
      }

      if (mainGame.keys && (mainGame.keys[RIGHT] || mainGame.keys[D])){
        this.moveAngle = this.rotateSpeed;
      }
    }
}
