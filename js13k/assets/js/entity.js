function entityObj(w, h, x, y, type) {
    this.type = type;
    this.width = w;
    this.height = h;
    this.mhWidth = w/-2;
    this.mhHeight = h/-2;
    this.hWidth = w/2;
    this.hHeight = h/2;
    this.yOffset = 0;
    this.angle = 0;
    this.x = x;
    this.y = y;
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
