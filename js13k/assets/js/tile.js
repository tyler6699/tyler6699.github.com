function tileObj(size, x, y, type, solid, column, row, color) {
  this.entity = new entityObj(size, size, "null", x, y, "tile");
  this.isSolid = solid;
  this.column = column;
  this.row = row;
  this.color = color;
  this.image = new Image();
  this.collected = false;
  this.type = type;
  this.active = true;
  this.time = 0;
  this.oneWay = false;
  this.leftPush = false;
  this.rightPush = false;
  this.image.src = atlas;
  this.draw=true;
  this.sx=0;
  this.sy=0;
  this.sw=30;
  this.sh=30;
  var meltRate = .8;

  // SET IMAGE
  switch(this.type) {
  case BRICK:
    this.sx = 60;
    break;
  case COIN:
    this.sx=90;
    break;
  case LADDER:
    this.sx=30;
    this.isSolid = false;
    break;
  case LADDERTOP:
    this.draw=false;
    this.isSolid = false;
    this.entity.height = 16;
    this.entity.y += 16;
    break;
  case LEDGE:
    this.sx=120;
    this.oneWay = true;
    break;
  case WALL:
    this.sy=30;
    break;
  case ICE:
    this.sx=30;
    this.sy=30;
    break;
  case PORTAL:
    this.sx=60;
    this.sy=30;
    this.active = false;
    break;
  case LEFTA:
    this.sx=0;
    this.sy=0;
    this.leftPush = true;
    break;
  case RIGHTA:
    this.sx=60;
    this.sy=30;
    this.rightPush = true;
    this.entity.angle = 2 * Math.PI - 180 * Math.PI / 180;
    break;
  }

  this.update = function(camera) {
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
    ctx.rotate(this.entity.angle);

    if(this.type == PORTAL && this.active){
      this.time += .001;
      ctx.globalAlpha = getAlhpa(this.time);
    }

    if((this.type == LEFTA || this.type == RIGHTA) && this.active){
      this.time += 0.01;
      if(this.time > .5){
        this.sx=0;
        this.sy=0;
      } else {
        this.sx=90;
        this.sy=30;
      }
      if(this.time > 1) this.time=0;
    }

    if(this.image == null){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.mhWidth, this.mhHeight, this.entity.width, this.entity.height);
    } else {
      if(this.active && this.draw) {
        ctx.scale(1,1.01);
        ctx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh + this.entity.yOffset, this.entity.mhWidth, this.entity.mhHeight, this.entity.width, this.entity.height + this.entity.yOffset);
        //ctx.drawImage(this.image, this.sx, this.sy, 30, 30, -15, -15, this.entity.width, this.entity.height);
      }
    }
    ctx.restore();
  }

  this.tick = function(hero){
    if(this.type == ICE ){
      if(this.entity.yOffset > -30 && heroOnIce(hero, this)){
        this.time += meltRate;
        this.entity.yOffset -= meltRate;
        //this.entity.y += meltRate; This makes it hard for walking.
      } else if (this.entity.yOffset < -30){
        this.active = false;
      }
    }
  }

  function heroOnIce (hero, ice){
    if(ice.entity != null){
      return rectColiding(hero.entity.x, hero.entity.y + 20, hero.entity.width, hero.entity.height, ice.entity.x, ice.entity.y, ice.entity.width, ice.entity.height);
    } else {
      return false;
    }
  }
}

function getAlhpa(time){
  var pi = 3.14;
  var frequency = 25;
  return 0.5*(1+Math.sin(2 * pi * frequency * time));
}

function heroColliding(e){
  return hero.hbX < e.entity.x + e.entity.width &&
  hero.hbX > e.entity.x &&
  hero.hbY < e.entity.y + e.entity.height &&
  hero.hbY > e.entity.y
}

function rectColiding(rx, ry, rw, rh, r2x, r2y, r2w, r2h){
  return (rx < r2x + r2w &&
     rx + rw > r2x &&
     ry < r2y + r2h &&
     ry + rh > r2y)
}
