function gitUI() {
  this.time = 0;
  this.done = false;

  this.update = function(canvasW, canvasH, hero, delta){
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(0,0);
    ctx.fillStyle = "#1e606e";
    ctx.fillRect(40, 60, canvasW-90, canvasH-90);
    ctx.fillStyle = "#2d1b00";
    ctx.fillRect(50, 70, canvasW-110, canvasH-110);
    ctx.restore();
    // FONT
    ctx.save();
    ctx.font = "16px Verdana";
    ctx.fillStyle = "#c4f0c2";
    //
    // ╔═══════════════════════════════╗
    // ║ JS13K Entry by @CarelessLabs  ║
    // ╚═══════════════════════════════╝
    //
    ctx.fillText("╔═══════════════════════════════╗",60, 95);
    ctx.fillText("║ JS13K Entry by @CarelessLabs  ║",60, 120);
    ctx.fillText("╚═══════════════════════════════╝",60, 140);
    ctx.fillText("careless (master) $",60, 150);
    ctx.restore();
  }

  this.tick = function(delta){
    if(!this.done){
      this.time += delta;
      if(mainGame.keys && (mainGame.keys[ONE] || mainGame.keys[TWO])){
        this.done = true;
      }
      //console.log(this.time + " " + this.done);
      // if(getSeconds(this.time) > 3){
      //   this.done = true;
      // }
    }
  }

  this.reset = function(){
    this.done = false;
    this.time = 0;
  }

}
