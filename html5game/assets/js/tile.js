function tileObj(size, x, y, type, solid) {
  this.entity = new entityObj(size, size, "null", x, y, "tile");
  this.isSolid = solid;

  this.image = new Image();
  if (this.isSolid) {
    this.image.src = "assets/8x8/water/water_01.png";
    this.color = "blue";
  } else {
    this.color = "green";
    this.image.src = "assets/8x8/grass/grass_04_32.png";
  }

  this.update = function() {
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x, this.entity.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, this.entity.width / -2, this.entity.height / -2, this.entity.width, this.entity.height);

    // If Hero is over tile make it orange
    // TODO Remove this test
    if (hero.hbX < this.entity.x + this.entity.width &&
        hero.hbX > this.entity.x &&
        hero.hbY < this.entity.y + this.entity.height &&
        hero.hbY > this.entity.y) {
          ctx.fillStyle = "orange";
          ctx.fillRect(this.entity.width / -2, this.entity.height / -2, this.entity.width, this.entity.height);
    }

    ctx.restore();
  }
}
