function gitUI() {
  this.time = 0;
  this.done = false;
  this.calculatedTime = false;
  this.newRecord = false;
  this.newRecordText="";

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
    var no = 1;

    if(this.newRecord){
      ctx.fillText(this.newRecordText,60, 145 + (no * 25));
      no++;
    }

    ctx.fillText("1. Play level " + hero.currentLevel,60, 145 + (no * 25));
    no++;
    ctx.fillText("2. Retry",60, 145 + (no * 25));

    ctx.restore();
  }

  this.tick = function(delta, level, clock, hero){
    if(!this.done){
      if(!this.calculatedTime){
        clock.calcTime();
        this.calculatedTime = true;
      }

      this.time += delta;

      if(mainGame.keys){
        if(mainGame.keys[ONE]){
          level.complete = false;
          this.done = true;
        } else if(mainGame.keys[TWO]){
  
        }

        if(level.complete){
          // Update Scores
          this.newRecord = false;

          console.log("Level: " + hero.currentLevel + " Complete Time: " + clock.levelTime);
          if (clock.levelTimes[hero.currentLevel] == null || clock.levelTimes[hero.currentLevel] > clock.levelTime){
            clock.levelTimes[hero.currentLevel] = clock.levelTime;
            this.newRecord = true;
            this.newRecordText = "NEW RECORD LEVEL " + hero.currentLevel + " Time: " + getSeconds(clock.levelTime);
          }
          clock.calcTime();

          // Reset the level
          if(hero.currentLevel < level.levels.length-1){
            hero.currentLevel ++;
          } else {
            hero.currentLevel = 0;
          }
          level.complete = false;
          level.reset(hero);
        }
      }
    }
  }

  this.reset = function(){
    this.calculatedTime = false;
    this.done = false;
    this.time = 0;
  }

}