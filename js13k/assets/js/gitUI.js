function gitUI() {
  this.showLevel=false;
  this.time = 0;
  this.done= false;
  this.setScores=false;
  this.calculatedTime = false;
  this.newRecord = false;
  this.text1="";
  this.text2="";
  this.text3="";
  this.pressWait=0;
  this.maxWait=.3;

  this.update = function(canvasW, canvasH, hero, delta, clock, level){
    if(!this.calculatedTime){
      if(clock.levelTimes[hero.currentLevel] != null){
        clock.currentTime = clock.currentTime + clock.levelTimes[hero.currentLevel];
      }
      this.calculatedTime = true;
    }

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
    var no = 1;

    if(!this.showLevel){
      if(this.text1 != ""){
        ctx.fillText(this.text1,60, 120 + (no * 25));
        no++;
        ctx.fillText(this.text2,60, 120 + (no * 25));
      }

      if(this.text3 != ""){
        no++;
        ctx.fillText(this.text3,60, 120 + (no * 25));
      }

      no+= 2;
      var cLevel = level.complete ? hero.currentLevel+1 : hero.currentLevel;
      if(level.complete && hero.currentLevel == level.levels.length-1){
        cLevel = 0;
      }
      ctx.fillText("Please select an option",60, 120  + (no * 25));
      no++;
      ctx.fillText("1. Play level " + cLevel,60, 120 + (no * 25));
      no++;
      ctx.fillText("2. Retry",60, 120 + (no * 25));
      no++;
      ctx.fillText("3. Level Select",60, 120 + (no * 25));
    } else {
      this.text1 = "1. Back";
      ctx.fillText(this.text1,60, 120 + (no * 25));
      no++;
      for(i = 0; i < level.levels.length; i++){
        no++;
        var t = clock.levelTimes[i] == null ? "Not Completed" : clock.levelTimes[i];
        ctx.fillText("Level: " + i + ". " + t,60, 120 + (no * 25));
      }
      this.text1="";
    }

    ctx.restore();
  }

  this.tick = function(delta, level, clock, hero){
    if(this.setScores){
      this.setScores = false;
      if(hero!= null && !hero.died && !hero.fell){
        // Update Scores
        this.newRecord = false;
        this.text1 = "";
        this.text2 = "             TIME: " + getSecondsFixed(clock.levelTime, 3);
        this.text3 = "";

        //console.log("Level: " + hero.currentLevel + " Complete Time: " + clock.levelTime);
        if (!clock.timeOver && clock.levelTimes[hero.currentLevel] == null || clock.levelTimes[hero.currentLevel] > clock.levelTime){
          this.text1 = " NEW RECORD LEVEL: " + hero.currentLevel;
          this.newRecord = true;
          if(clock.levelTimes[hero.currentLevel] != null){
            this.text3 = "  PREVIOUS RECORD: " + getSecondsFixed(clock.levelTimes[hero.currentLevel],3);
          }
          clock.levelTimes[hero.currentLevel] = clock.levelTime;
        } else {
          this.newRecord = false;
          this.text1 = "SLOWER TIME LEVEL: " + hero.currentLevel;
          if(clock.levelTimes[hero.currentLevel] != null){
            this.text3 = "   CURRENT RECORD: " + getSecondsFixed(clock.levelTimes[hero.currentLevel], 3);
          }
        }
      } else {
        this.text2 = "";
        this.text3 = "";

        // Fall or Died
        if(hero.fell) {
          this.text1 = "You fell to your death.";
        } else if(hero.died) {
          this.text1 = "Try not to die!";
        }
      }

      hero.died = false;
      hero.fell = false;
      clock.calcTime();
    }

    if(!this.done){
      this.time += delta;
      this.pressWait -= delta/1000;
      //console.log(this.pressWait);
      if(mainGame.keys && !this.showLevel && this.pressWait <= 0){
        // ONE
        if(mainGame.keys[ONE]){
          console.log("pressed one");
          if(level.complete){
            if(hero.currentLevel < level.levels.length-1){
              hero.currentLevel ++;
            } else {
              hero.currentLevel = 0;
            }
          }
          this.done = true;
          level.complete = false;
          level.reset(hero);
        // TWO
        } else if(mainGame.keys[TWO]){
          level.complete = false;
          this.done = true;
          level.reset(hero);
        // THREE
        } else if(mainGame.keys[THREE]){
          this.showLevel = true;
        }

        if(mainGame.keys[ONE] || mainGame.keys[TWO] || mainGame.keys[THREE]){
          this.pressWait = this.maxWait;
        }
      } else if(mainGame.keys && this.showLevel) {
        if(mainGame.keys[ONE]){
          this.showLevel = false;
          this.pressWait = this.maxWait;
          console.log("back");
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
