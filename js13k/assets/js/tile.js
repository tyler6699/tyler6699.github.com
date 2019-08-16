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
  var meltRate = .8;

  // SET IMAGE
  switch(this.type) {
  case BRICK:
    this.image.src = brick;
    break;
  case COIN:
    this.image.src = coin;
    break;
  case LEDGE:
    this.image.src = ledge;
    break;
  case WALL:
    this.image.src = wall;
    break;
  case ICE:
    this.image.src = ice;
    break;
  }

  this.update = function(camera) {
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
    ctx.rotate(this.angle);

    if(this.image == null){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.mhWidth, this.mhHeight, this.entity.width, this.entity.height);
    } else {
      if(this.active) {
        ctx.drawImage(this.image, this.entity.mhWidth, this.entity.mhHeight, this.entity.width, this.entity.height);
      }
    }
    ctx.restore();
  }

  this.tick = function(hero){
    if(this.type == ICE && this.entity.height >= 0 && heroOnIce(hero, this)){
      this.time += meltRate;
      this.entity.height -= meltRate;
      this.entity.y += meltRate;
    } else if (this.entity.height <= 0){
      this.active = false;
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
