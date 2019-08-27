function enemyObj(x, y, enemy) {
  var type = enemy[2];
  var w = 25;
  var h = 25;
  var dir = RIGHT;
  var speed = 1;
  this.entity = new entityObj(w, h, x, y, type);
  this.entity.y += 29 -h;
  this.maxLeft = x - enemy[0] - 1;
  this.maxRight = x + enemy[1] + w + (29 - w);

  this.update = function(camera){
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
    ctx.fillStyle = "RED";
    ctx.fillRect(this.entity.mhWidth, this.entity.mhHeight, this.entity.width, this.entity.height);
    ctx.restore();
  }

  this.tick = function(hero){
    if(type == WALKER){
      if(heroColliding(this)){
        if(!hero.reset)playSound(DIEFX,1);
        hero.reset = true;
      }
      if(dir == RIGHT){
        this.entity.x += speed;
        if(this.entity.x >= this.maxRight) dir = LEFT;
      } else {
        this.entity.x -= speed;
        if(this.entity.x <= this.maxLeft) dir = RIGHT;
      }

    } else if(type == SHOOTER){

    } else if(type == FOLLOW){

    } else if(type == JUMPER){

    }
  }

}
