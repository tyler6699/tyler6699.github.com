function tileObj(size, x, y, type, solid, column, row, color) {
  this.entity = new entityObj(size, size, "null", x, y, "tile");
  this.isSolid = solid;
  this.column = column;
  this.row = row;
  this.color = color;
  this.image = new Image();
  this.collected = false;
  this.type = type;

  if (this.type == "brick") {
    this.image.src = brick;
  } else {
    this.image.src = wall;
  }

  this.update = function(camera) {
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
    ctx.rotate(this.angle);

    if(this.type == "brick"){
      ctx.drawImage(this.image, this.entity.width / -2, this.entity.height / -2, this.entity.width, this.entity.height);
    } else if(this.type == "coin") {
      if(this.collected == false){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.entity.width / -2, this.entity.height / -2, this.entity.width, this.entity.height);
      }
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.entity.width / -2, this.entity.height / -2, this.entity.width, this.entity.height);
    }

    // If Hero is over tile make it orange
    if(debug){
      if ( heroColliding(this) ) {
        ctx.fillStyle = "orange";
        ctx.fillRect(this.entity.width / -2, this.entity.height / -2, this.entity.width, this.entity.height);
      }
    }

    ctx.restore();
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
