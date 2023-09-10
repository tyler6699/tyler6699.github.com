function tileObj(size, x, y, type, solid, column, row) {
  this.entity = new entityObj(size, size, x, y, "tile");
  this.isSolid = solid;
  this.column = column;
  this.row = row;
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
    this.sy=60;
    this.isSolid = false;
    break;
  case LADDERTOP:
    this.draw = false;
    this.isSolid = false;
    break;
  case LEDGE:
    this.sx=120;
    this.oneWay = true;
    break;
  case WALL:
    this.sy=30;
    break;
  case ICE:
    this.oneWay = true;
    this.time = 1;
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

    this.setTileAlphas();

    this.animBelt();

    if(this.image == null){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.mhWidth, this.mhHeight, this.entity.width, this.entity.height);
    } else {
      if(this.active && this.draw) {
        if(this.type == ICE){
          ctx.drawImage(this.image, this.sx, this.entity.yOffset, this.sw, this.sh, this.entity.mhWidth, this.entity.mhHeight + this.entity.yOffset, this.entity.width, this.entity.height);
        } else {
          ctx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh-1, this.entity.mhWidth, this.entity.mhHeight, this.entity.width, this.entity.height);
        }
      }
    }
    ctx.restore();
  }

  this.tick = function(hero){
    if(this.type == ICE ){
      if(this.entity.yOffset > -30 && heroOnIce(hero, this) && hero.entity.y < this.entity.y){
        this.time -= .012;
        this.entity.yOffset -= meltRate;
      } else if (this.entity.yOffset < -30){
        this.active = false;
      }
    }
  }

  this.animBelt = function(){
    if((this.type == LEFTA || this.type == RIGHTA) && this.active){
      this.time += 0.01;
      this.sx=0;
      this.sy=0;
      if(this.time < .2){
        this.sx=120;
        this.sy=30;
      } else if(this.time < .4) {
        this.sx=90;
        this.sy=30;
      }
      if(this.time > .6) this.time=0;
    }
  }

  this.setTileAlphas = function(){
    if(this.type == PORTAL && this.active){
      this.time += .001;
      ctx.globalAlpha = getAlhpa(this.time);
    } else if(this.type == ICE){
      ctx.globalAlpha = this.time;
    }
  }
}
