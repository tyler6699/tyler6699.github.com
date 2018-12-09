function tileObj(size, x, y, type, solid, column, row) {
  this.entity = new entityObj(size, size, "null", x, y, "tile");
  this.isSolid = solid;
  this.column = column;
  this.row = row;
  this.dstCentre = 0;

  this.image = new Image();
  if (this.isSolid) {
    this.image.src = water;
    this.color = "blue";
  } else {
    this.color = "green";
    this.image.src = grass;
  }

  this.update = function(camera, hero) {
    x1 = this.entity.x + (this.entity.width / 2);
    y1 = this.entity.y + (this.entity.width / 2);
    x2 = hero.entity.x + (hero.entity.width / 2);
    y2 = hero.entity.y + (hero.entity.width / 2);

    xSqr = Math.pow((x2 - x1), 2);
    ySqr = Math.pow((y2 - y1), 2);
    this.dstCentre = Math.sqrt((xSqr + ySqr));
    zoom = this.dstCentre;

    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
    ctx.rotate(this.angle);

    if(this.dstCentre > 200){
      //new_value = ( (old_value - old_min) / (old_max - old_min) ) * (new_max - new_min) + new_min
      new_value = ( (this.dstCentre) / (400) ) * (1 - 0.01) + 0.01
      ctx.globalAlpha = 1 - new_value;
    } else {
      ctx.globalAlpha = 1
    }

    w = this.entity.width;
    h = this.entity.height;

    if (this.dstCentre < 300){
      ctx.drawImage(this.image, (w / -2), (h / -2), w, h);
    }

    // If Hero is over tile make it orange
    if(debug){
      if ( heroColliding(this) ) {
        ctx.fillStyle = "orange";
        ctx.fillRect((this.entity.width) / -2, (this.entity.height) / -2, this.entity.width, this.entity.height);
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
