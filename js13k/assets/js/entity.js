function entityObj(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.mhWidth = width/-2;
    this.mhHeight = height/-2;
    this.hWidth = width/2;
    this.hHeight = height/2;
    this.yOffset = 0;
    this.angle = 0;
    this.x = x;
    this.y = y;
    this.color = color;
    this.active = true;

    // Render
    this.update = function() {
      if(this.active){
        ctx = mainGame.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.mhWidth, this.mhHeight, this.width, this.height);
        ctx.restore();
      }
    }
}
