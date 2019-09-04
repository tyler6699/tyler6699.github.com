function hud() {

  this.update = function(canvasW, hero, timeElapsed){
    ctx = mainGame.context;
    ctx.save();
    ctx.translate(0,0);
    ctx.fillStyle = "#2d1b00";
    ctx.fillRect(0, 0, canvasW, 40);
    ctx.restore();
    // FONT
    ctx.save();
    ctx.font = "20px Verdana";
    ctx.fillStyle = "#c4f0c2";
    ctx.fillText("Lives: " + hero.lives,10,28);
    ctx.fillText("Time: " + getSeconds(timeElapsed),470,25);
    ctx.fillText("Level: " + hero.currentLevel,250,25);
    ctx.restore();
  }
}
