function hud() {

  this.update = function(canvasW, hero, clock, level){
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
    c = "#5ab9a8";
    if(!hero.winner){
      fillMixedText(ctx, [{ text: "Lives: "},{ text: hero.lives, fillStyle: c}], 10, 28);
      args = [{ text: "Level: " },{ text: hero.currentLevel, fillStyle: c }];
      fillMixedText(ctx, args, 130, 28);
      if(hero.active && level.active){
        fillMixedText(ctx, [{ text: "Time Left: "},{ text: getSecondsFixed(clock.currentTime, 0), fillStyle: c}], 240, 28);
      } else {
        fillMixedText(ctx, [{ text: "Time Left: "},{ text: "_._", fillStyle: c}], 240, 28);
      }
      fillMixedText(ctx, [{ text: "Level Time: "},{ text: getSecondsFixed(clock.levelTime, 2), fillStyle: c}], 413, 28);
    } else {
      ctx.fillText("Thank you for playing! @CarelessLabs and @ModalModule",10, 28);
    }

    ctx.restore();
  }
}
