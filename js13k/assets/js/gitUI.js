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
    var c = "#5ab9a8";
    fillMixedText(ctx, [{ text: "=========== " , fillStyle: c},{ text: "Code & Art: @CarelessLabs"},{ text: " ===========", fillStyle: c}], 60, 95);
    if(hero.loser) ctx.fillText(" Extra Speed ++",380, 120);
    fillMixedText(ctx, [{ text: "============== " , fillStyle: c},{ text: "Music: @ModalModule"},{ text: " ==============", fillStyle: c}], 60, 350);

    var no = 1;
    var offset = 0;

    if(!this.showLevel){
      if(this.text1 != ""){
        ctx.fillText(this.text1,60, 120 + (no * 25));
        no++;
        ctx.fillText(this.text2,60, 120 + (no * 25));
      } else {
        offset -=25;
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
      fillMixedText(ctx, [{ text: "::: MENU :::" , fillStyle: '#5ab9a8'}], 60, 120  + (no * 25) + offset);
      no++;
      ctx.fillText("1. Play level " + cLevel,60, 120 + (no * 25) + offset);
      no++;
      ctx.fillText("2. Retry level " + hero.currentLevel,60, 120 + (no * 25) + offset);
      no++;
      ctx.fillText("3. Level Times",60, 120 + (no * 25) + offset);
    } else {
      ctx.fillText("1. Back",60, 100 + (no * 25) + offset);
      no++;
      var j = 1;
      var col=0;
      var row=no + 20;
      no = 0;
      for(i = 0; i < level.levels.length; i++){
        no++;
        var t = clock.levelTimes[i] == null ? "--" : getSecondsFixed(clock.levelTimes[i],2);
        if(i < 10){
          ctx.fillText("0" + i + ". " + t,60 + (col* 110), 120 + (no * 25) + offset + row);
        } else {
          ctx.fillText(i + ". " + t,60 + (col* 110), 120 + (no * 25) + offset + row);
        }
        if(j==6){
          j=0;
          no=0;
          col ++;
        }
        j++;
      }
      ctx.fillText("Total: " + getSecondsFixed(clock.totalTime(),2) + " Win: 230" , 310, 320);
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

        if (!clock.timeOver && clock.levelTimes[hero.currentLevel] == null || clock.levelTimes[hero.currentLevel] > clock.levelTime){
          this.text1 = " NEW RECORD LEVEL: " + hero.currentLevel;
          this.newRecord = true;
          if(clock.levelTimes[hero.currentLevel] != null){
            this.text3 = "  PREVIOUS RECORD: " + getSecondsFixed(clock.levelTimes[hero.currentLevel],3);
          }
          clock.levelTimes[hero.currentLevel] = clock.levelTime;
        } else if(clock.timeOver) {
          this.text1 = "Out of time!";
          this.text2= "";
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

      // reset Clock timeOver
      clock.timeOver = false;
    }

    if(!this.done){
      this.time += delta;
      this.pressWait -= delta/1000;

      if(mainGame.keys && !this.showLevel && this.pressWait <= 0){
        // ONE
        if(mainGame.keys[ONE]){
          if(level.complete){
            if(hero.currentLevel < level.levels.length-1){
              hero.currentLevel ++;
            } else {
              // Looping back to level ZERO!
              if(clock.totalTime() <= clock.winTime){
                hero.winner = true;
              } else {
                hero.loser = true;
                hero.maxSpeed = 4;
              }
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
