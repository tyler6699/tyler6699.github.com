function intro() {

  this.tick = function(){
    mainGame.context.font = "30px Arial";
    mainGame.context.fillText("Hello World",10,50);
    mainGame.context.fillText("Press Space",10,100);

    if (mainGame.keys && mainGame.keys[SPACE]) {
      // Setup Audio Context on a user input
      if(audioCtx == null){
        audioCtx = new AudioContext();
      }
      gameStart = true;
    }
  }
}
