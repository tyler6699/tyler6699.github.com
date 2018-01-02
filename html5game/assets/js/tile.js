function tileObj(size, color, x, y, type) {
  this.entity = new entityObj(size, size, color, x, y, "tile");

  //if (type == "grass") {
    this.image = new Image();
    this.image.src = "assets/8x8/grass/grass_04_32.png";
  //}

  this.update = function() {
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(this.entity.x, this.entity.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, this.entity.x, this.entity.y, this.entity.width * 2, this.entity.height * 2);
    ctx.restore();
  }
}
