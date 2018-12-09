function Camera(x, y) {
  this.entity = new entityObj(30, 30, "null", x, y, "view");

  this.newPos = function(hero, island) {
    this.entity.x = (hero.entity.x + hero.entity.width/2) - island.canvasHalfW;
    this.entity.y = (hero.entity.y + hero.entity.height/2) - island.canvasHalfH;
  }
}
