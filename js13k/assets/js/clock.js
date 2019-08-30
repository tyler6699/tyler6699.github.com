function clock() {
  this.maxTime = 30000.00;
  this.currentTime = this.maxTime;
  this.timeOver = false;

  this.tick = function(delta){
    if(!this.timeOver){
      this.currentTime -= delta;
      this.timeOver = this.currentTime <= 0;
    }
  }

  this.reset = function(){
      this.currentTime = this.maxTime;
      this.timeOver = false;
  }
}
