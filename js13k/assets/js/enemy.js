function enemyObj(x, y, enemy) {
  var type = enemy[2];
  var w = 25;
  var h = 25;
  var dir = RIGHT;
  var speed = 1;
  var jPower = 0;
  var maxJPower = 10;
  var hitboxOffset = 10;
  this.image = new Image();
  this.image.src = atlas;
  this.entity = new entityObj(w, h, x, y, type);
  this.entity.y += 29 -h;
  this.maxLeft = x - enemy[0] - 1;
  this.maxRight = x + enemy[1] + w + (29 - w);
  this.jumping = false;
  var startY = this.entity.y;

  this.update = function(camera){
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
    ctx.drawImage(this.image, 60, 60, 25, 25, this.entity.mhWidth, this.entity.mhHeight, this.entity.width, this.entity.height);
    ctx.restore();
  }

  this.tick = function(hero, intro){
    this.checkDie(hero, intro);

    if(type == WALKER){
      this.moveSide2Side();
    } else if(type == SHOOTER){

    } else if(type == FOLLOW){
      this.follow();
    } else if(type == JUMPER){
      this.follow();
      this.jump();
    } else if(type == WALKJUMPER){
      this.moveSide2Side();
      this.jump();
    }
  }

  this.follow = function(){
    if(this.entity.x > hero.entity.x && this.entity.x >= this.maxLeft){
      this.entity.x -= speed;
    } else if(this.entity.x < hero.entity.x && this.entity.x <= this.maxRight - this.entity.width) {
      this.entity.x += speed;
    }
  }

  this.moveSide2Side = function(){
    if(dir == RIGHT){
      this.entity.x += speed;
      if(this.entity.x >= this.maxRight) dir = LEFT;
    } else {
      this.entity.x -= speed;
      if(this.entity.x <= this.maxLeft) dir = RIGHT;
    }
  }

  this.jump = function(){
    if(hero.jumping && !this.jumping && this.entity.y == startY){
      this.jumping = true;
      jPower = maxJPower;
    } else if(jPower > 0){
      this.entity.y -= jPower;
      jPower --;
    } else if(this.jumping && jPower <= 0){
      this.entity.y += defaultG;
      if(this.entity.y > startY){
        this.jumping = false;
        this.entity.y = startY;
      }
    }
  }

  this.checkDie = function(hero, intro){
    if(entityColiding(hero.entity, 0, this.entity, hitboxOffset)){
      if(!hero.reset){
        hero.lives--;
        hero.died = true;
        intro.gitUI.setScores = true;
        playSound(DIEFX,1);
      }
      hero.reset = true;
    }
  }
}
