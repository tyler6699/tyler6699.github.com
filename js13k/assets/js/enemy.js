function enemyObj(x, y, enemy) {
  var type = enemy[2];
  var w = 25;
  var h = 25;
  var yy = 29 - h;
  var dir = RIGHT;
  var speed = 1;
  this.entity = new entityObj(w, h, x, yy, type);
  this.maxLeft = x - enemy[0];
  this.maxRight = x + enemy[1] + w + (30 - w);

  this.update = function(camera){
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
    ctx.fillStyle = "RED";
    ctx.fillRect(this.entity.mhWidth, this.entity.mhHeight, this.entity.width, this.entity.height);
    ctx.restore();
  }

  this.tick = function(){
    if(dir == RIGHT){
      this.entity.x += speed;
      if(this.entity.x >= this.maxRight) dir = LEFT;
    } else {
      this.entity.x -= speed;
      if(this.entity.x <= this.maxLeft) dir = RIGHT;
    }
  }

}
