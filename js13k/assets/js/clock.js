function clock() {
  this.maxTime = 30000.00;
  this.currentTime = this.maxTime;
  this.timeOver = false;
  this.prevTime = this.maxTime;

  this.tick = function(delta){
    if(!this.timeOver){
      this.currentTime -= delta;
      this.timeOver = this.currentTime <= 0;
    }
  }

  this.reset = function(){
    this.currentTime = this.maxTime;
    this.prevTime = this.currentTime;
    this.timeOver = false;
  }

  this.setStartTime = function(){
    this.currentTime = this.prevTime;
    console.log(this.currentTime);
  }
}
