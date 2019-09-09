function hud() {

  this.update = function(canvasW, hero, timeElapsed, level){
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
    fillMixedText(ctx, [{ text: "Lives: "},{ text: hero.lives, fillStyle: '#5ab9a8'}], 10, 28);

    if(hero.active && level.active){
      fillMixedText(ctx, [{ text: "Time: "},{ text: getSecondsFixed(timeElapsed, 2), fillStyle: '#5ab9a8'}], 470, 25);
    } else {
      fillMixedText(ctx, [{ text: "Time: "},{ text: "_._", fillStyle: '#5ab9a8'}], 470, 25);
    }

    args = [{ text: "Level: " },{ text: hero.currentLevel, fillStyle: '#5ab9a8' }];
    fillMixedText(ctx, args, 250, 25);

    ctx.restore();
  }
}
