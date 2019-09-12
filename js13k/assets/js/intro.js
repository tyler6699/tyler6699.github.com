function intro() {
  this.done = false;
  this.time = 0;
  this.gitUI = new gitUI();

  this.tick = function(delta){
    ctx = mainGame.context;
    ctx.font = "30px Arial";
    fillMixedText(ctx, [{ text: "=========== " , fillStyle: '#5ab9a8'},{ text: "CarelessLabs"},{ text: " =========== ", fillStyle: '#5ab9a8'}], 10, 50);
    fillMixedText(ctx, [{ text: "=================================" , fillStyle: '#5ab9a8'}], 10, 350);
    mainGame.context.fillText("AD or Arrows to move",140,120);
    mainGame.context.fillText("Space or W to Jump",140,160);
    mainGame.context.fillText("1,2,3 to select options",140,200);
    if(ready){
        mainGame.context.fillText("=== PRESS SPACE ===",120,300);
    } else {
        mainGame.context.fillText("Rewinding the cassette tape",100,300);
    }
    if (mainGame.keys && mainGame.keys[SPACE]) {
      // Setup Audio Context on a user input
      if(audioCtx == null) audioCtx = new AudioContext();
      gameStart = true;
    }
  }

  this.reset = function(){
    this.done = false;
    this.time = 0;
    this.gitUI.reset();
  }

  this.trans = function(canvasW, canvasH){
    if(this.time < 70){
      var colW = canvasW/32;
      var rowH = canvasH/32;

      if(this.time < 32){
        for(i = 0;i <= colW;i++){
          for(j = 0;j <= rowH;j++){
            ctx = mainGame.context;
            ctx.save();
            ctx.translate(i*32, j*32);
            ctx.fillStyle = "#1e606e";
            ctx.fillRect(this.time/2, this.time/2, 32-this.time, 32-this.time);
            ctx.restore();
          }
        }
      }
      this.time += 2;
    } else {
      this.done = true;
    }
  }

}
