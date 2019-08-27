function fx(hero, type, direction, flipV) {
    // This was made real quick
    // Do not judge me
    this.time = 0;
    this.image = new Image();
    this.image.src = atlas;
    this.direction = direction;
    var hPower = hero.gethPower();
    var flipV = flipV;

    if(type == DUST){
      this.sx = 30;
      this.sy = 60;
      this.sw = 8;
      this.sh = 8;
      this.maxDuration = 1;
      this.float = true;
      this.floatAmount = 3;
      this.grow=true;
    }

    var x,y;
    if(direction == LEFT){
      x = hero.entity.x - hero.entity.hWidth;
    } else if(direction == RIGHT) {
      x = hero.entity.x +  hero.entity.hWidth;
    }

    y = hero.entity.y + (2*this.sh);
    this.entity = new entityObj(this.sw, this.sh, x, y, type);

    this.tick = function() {
      if(this.entity.active){
        this.time+=0.13;
        if(this.float){

          if(direction == LEFT){
            this.entity.y -= this.floatAmount;
            this.entity.x -= this.floatAmount/2;
          } else if (direction == RIGHT) {
            this.entity.y -= this.floatAmount;
            this.entity.x += this.floatAmount/2;
          }

          if(this.grow){
            this.entity.width++;
            this.entity.height++;
          }

          // add hero velocity
          if(flipV){
            this.entity.x -= hPower*1.2;
          } else {
            this.entity.x += hPower*1.2;
          }

        }

        if(this.time >= this.maxDuration){
          this.entity.active = false;
        }
      }
    }

    this.update = function(camera) {
      if(this.entity.active){
        ctx = mainGame.context;
        ctx.save();
        ctx.globalAlpha = .65;
        ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
        ctx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, this.entity.mhWidth, this.entity.mhHeight, this.entity.width, this.entity.height);
        ctx.restore();
      }
    }
}
