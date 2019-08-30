function intro() {
  this.done = false;
  this.introTime = 0;

  this.tick = function(){
    mainGame.context.font = "30px Arial";
    mainGame.context.fillText("git reset --hard",10,50);
    mainGame.context.fillText("PRESS SPACE",10,300);

    if (mainGame.keys && mainGame.keys[SPACE]) {
      // Setup Audio Context on a user input
      if(audioCtx == null){
        audioCtx = new AudioContext();
      }
      gameStart = true;
    }
  }

  this.reset = function(){
    this.done = false;
    this.introTime = 0;
  }

  this.trans = function(canvasW, canvasH){
    if(this.introTime < 70){
      var colW = canvasW/32;
      var rowH = canvasH/32;

      if(this.introTime < 32){
        for(i = 0;i <= colW;i++){
          for(j = 0;j <= rowH;j++){
            ctx = mainGame.context;
            ctx.save();
            ctx.translate(i*32, j*32);
            ctx.fillStyle = "#1e606e";
            ctx.fillRect(this.introTime/2, this.introTime/2, 32-this.introTime, 32-this.introTime);
            ctx.restore();
          }
        }
      }
      this.introTime += 2;
    } else {
      this.done = true;
    }
  }

}
