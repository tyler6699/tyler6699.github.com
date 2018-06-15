function tileObj(size, x, y, type, solid) {
  this.entity = new entityObj(size, size, "null", x, y, "tile");
  this.isSolid = solid;

  this.image = new Image();
  if (this.isSolid) {
    this.image.src = water;
    this.color = "blue";
  } else {
    this.color = "green";
    this.image.src = grass;
  }

  this.update = function(camera) {
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x - camera.entity.x, this.entity.y - camera.entity.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, this.entity.width / -2, this.entity.height / -2, this.entity.width, this.entity.height);

    // If Hero is over tile make it orange
    // TODO Remove this test
    if ( heroColliding(this) ) {
      ctx.fillStyle = "orange";
      ctx.fillRect(this.entity.width / -2, this.entity.height / -2, this.entity.width, this.entity.height);
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
