function Entity(w, h, x, y, angle, type, id=0) {
  this.type = type;
  this.width = w;
  this.height = h;
  this.mhWidth = w / -2;
  this.mhHeight = h / -2;
  this.mhWScld = (w / -2);
  this.mhHScld = (h / -2);
  this.hWidth = w / 2;
  this.hHeight = h / 2;
  this.cenX=x-this.mhWScld;
  this.cenY=y-this.mhHScld;
  this.angle = angle;
  this.x = x;
  this.y = y;
  this.image = atlas;
  this.alpha = 1;
  this.isSolid = false;
  this.flip=false;
  this.dir=0;//0=R 1=L
  this.id=id;
  this.open=false;
  this.chasePhase = 'search'; // 'search', 'attack', 'return'
  this.content="";
  this.attack=false;
  // ATLAS Positions
  this.sx=0;
  this.sy=0;
  this.speed=5;

  this.move = function(){
    let spd = this.speed;
    if(left()){
      this.x-=spd;
      this.dir=1;
    }

    if(right()){
      this.x+=spd;
      this.dir=0;
    }

    if(up()){
      this.y-=spd;
    }

    if(down()){
      this.y+=spd;
    }

    let area = 1000;
    if(this.x < -area) this.x=-area;
    if(this.x > area) this.x=area;
    if(this.y < -area) this.y=-area;
    if(this.y > area) this.y=area;
  }

  // Render
  this.update = function(delta) {
    this.x = Math.floor(this.x);
    this.Y = Math.floor(this.Y);
    ctx.save();
    ctx.translate(this.x, this.y);
    if(cart.shakeTime>0){ctx.translate(cart.shake,cart.shake);}
    ctx.globalAlpha = this.alpha;

    img = this.image;
    s   = this.scale;
    mhw = this.mhWidth;
    mhh = this.mhHeight;
    hw  = this.hWidth;
    hh  = this.hHeight;
    w   = this.width;
    h   = this.height;

    // Camera Tracking
    ctx.translate(cart.cam.x,cart.cam.y);
    if (this.flip){
      if(this.type==types.HAIR2){
        ctx.translate(8.3*w,0);
      } else {
        ctx.translate(-w*-7,0);
      }
      ctx.scale(-zoom,zoom);
    } else {
      ctx.scale(zoom,zoom);
    }

    ctx.drawImage(img, this.sx, this.sy, w, h, hw, hh, w, h);
    ctx.restore();

    this.cenX=this.x-this.mhWScld;
    this.cenY=this.y-this.mhHScld;
  }

  this.isCollidingWith = function(other) {
  return !(this.x + this.width < other.x - other.width ||
           this.x - this.width > other.x + other.width ||
           this.y + this.height < other.y - other.height ||
           this.y - this.height > other.y + other.height);
};

  this.setType = function(){
    this.alpha = 1;
    this.sy=0;
    this.sx=0;

    switch(this.type){
      case types.HERO:
        break;
      case types.ENEMY:
        this.sx=16;
        break;
      case types.GRASS:
        this.sx=16;
        break;
      case types.SHIELD:
        this.sx=29;
        break;
      case types.HAIR1:
        this.sx=63;
        this.width=13
        this.height=13
        break;
      case types.HAIR2:
        this.sx=77;
        this.width=15;
        this.height=12
        break;
      case types.HAIR3:
        this.sx=94;
        this.width=13;
        this.height=11;
        break;
      case types.HAIR4:
        this.sx=50;
        this.sy=12;
        this.width=11;
        this.height=8;
        break;
      case types.HEAD1:
        this.sx=2;
        this.sy=1;
        break;
      case types.HEAD2:
        this.sx=48;
        this.sy=1;
        break;
      case types.HEAD3:
        this.sx=11;
        this.sy=17;
        break;
      case types.HAT:
        this.sx=91;
        this.sy=13;
        break;
      case types.HAND:
        this.sx=30;
        this.sy=9;
        break;
      case types.ARROW:
        this.sx=36;
        this.sy=3;
        break;
      case types.SMALLROCK:
        this.sx=24;
        this.sy=17;
        break;
      case types.BIGROCK:
        this.sx=35;
        this.sy=16;
        break;
      case types.STUMP:
        this.sx=23;
        this.sy=25;
        break;
      case types.SMALLMUSH:
        this.sy=32;
        break;
      case types.BIGMUSH:
        this.sy=20;
        break;
      case types.LILY:
        this.sy=40;
        this.sx=53;
        break;
      case types.LILG:
        this.sy=40;
        this.sx=63;
        break;
      case types.LILP:
        this.sy=40;
        this.sx=73;
        break;
      case types.CHEST:
        this.sy=23;
        this.sx=67;
        break;
      case types.ONE:
        this.sx=63;
        this.sy=15;
        break;
      case types.TWO:
        this.sx=75;
        this.sy=15;
        break;
      case types.THREE:
        this.sx=85;
        this.sy=29;
        break;
      case types.C1:
        this.sy=40;
        break;
      case types.C2:
        this.sy=40;
        this.sx=8;
        break;
      case types.C3:
        this.sy=40;
        this.sx=16;
        break;
      case types.C4:
        this.sy=40;
        this.sx=24;
        break;
      case types.C5:
        this.sy=40;
        this.sx=32;
        break;
      case types.SHADOW:
        this.sy=43;
        this.sx=94;
        break;
      case types.HAT:
        this.sy=13;
        this.sx=91;
        break;
      case types.QUEST:
        this.sy=38;
        this.sx=45;
        break;
      case types.HP:
        this.sy=31;
        this.sx=8;
        break;
      case types.SUIT1:
        this.sx=4;
        this.sy=10;
        break;
      case types.SUIT2:
        this.sx=92;
        this.sy=35;
        break;
      case types.SUIT3:
        this.sx=100;
        this.sy=29;
        break;
    }

    this.hWidth = this.width / 2;
    this.hHeight = this.height / 2;
  }

  this.setType();
}
