function clock() {
  this.maxTime = 400000.00;
  this.currentTime = this.maxTime;
  this.timeOver = false;
  this.prevTime = this.maxTime;
  this.levelTimes = [];
  this.levelTime=0;

  this.tick = function(delta){
    if(!this.timeOver){
      this.levelTime += delta;
      this.currentTime -= delta;
      this.timeOver = this.currentTime <= 0;
    }
  }

  this.reset = function(){
    this.levelTime = 0;
    this.currentTime = this.maxTime;
    this.prevTime = this.currentTime;
    this.timeOver = false;
    this.levelTimes = [];
  }

  this.setStartTime = function(){
    console.log("Clock calcTime");
    this.calcTime();
    this.levelTime = 0;
    // Time Over set in GUI
  }

  this.calcTime = function(){
    if(this.levelTimes.length > 0){
      this.currentTime = this.maxTime - this.levelTimes.reduce((a, b) => a + b);
    } else {
      this.currentTime = this.maxTime;
    }
    console.log("Time Left: " + this.currentTime);
  }
}
