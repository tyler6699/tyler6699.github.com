function Camera(x, y) {
  this.entity = new entityObj(30, 30, "null", x, y, "view");

  this.newPos = function(hero, level) {
    this.entity.x = parseInt( (hero.entity.x + hero.entity.width/2) - level.canvasHalfW );
    this.entity.y = ((hero.entity.y + hero.entity.height/2) - level.canvasHalfH) - offset;
  }
}
