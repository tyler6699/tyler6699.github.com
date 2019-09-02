function gitUI() {
  this.time = 0;
  this.done = false;
  this.branches = [];

  this.update = function(canvasW, canvasH, hero, delta, clock, level){
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
    ctx.font = "16px Monaco";
    ctx.fillStyle = "#c4f0c2";
    ctx.fillText("remote https://github.com/tyler6699",60, 95);
    ctx.fillText("Please select an option",60, 120);
    if(clock.levelTimes[hero.currentLevel] != null){
      ctx.fillText("1. git commit -a -m 'Level: " + hero.currentLevel +" done'",60, 145);
    } else {
      if(this.branches[hero.currentLevel] == null){
        ctx.fillText("1. git checkout -b level_" + hero.currentLevel,60, 145);
      } else {
        ctx.fillText("1. git checkout level_" + hero.currentLevel,60, 145);

      }
    }
    ctx.fillText("2. git reset --hard",60, 170);
    ctx.fillText("3. git branch",60, 195);
    if(hero.currentLevel == 0 && this.branches[0] == null){
      ctx.fillText("careless (master) $",60, 245);
    } else {
      ctx.fillText("careless (level_" + hero.currentLevel + ") $",60, 245);
    }
    ctx.restore();
  }

  this.tick = function(delta, level){
    if(!this.done){
      this.time += delta;
      if(mainGame.keys){
        if(mainGame.keys[ONE]){
          this.done = true;
          if(this.branches[hero.currentLevel] == null){
            this.branches[hero.currentLevel] = true;
            console.log(this.branches);
          }
          if(level.complete){
            // Reset the level
            if(hero.currentLevel < level.levels.length-1){
              hero.currentLevel ++;
            } else {
              hero.currentLevel = 0;
            }

            level.reset(hero);
          }
        } else if(mainGame.keys[TWO]){
          this.done = true;
        }
      }
    }
  }

  this.reset = function(){
    this.done = false;
    this.time = 0;
  }

}
