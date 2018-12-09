function island(canvasW, canvasH) {
  this.tiles = [];
  this.sqr = 100;
  this.islandSize = 20;
  this.tileSize = 32;
  this.midPoint = Math.ceil(this.sqr/2) * this.tileSize;
  this.canvasHalfW = canvasW / 2;
  this.canvasHalfH = canvasH / 2;

  // Initial Map
  minX = this.midPoint - ((this.islandSize/2) * this.tileSize);
  maxX = this.midPoint + ((this.islandSize/2) * this.tileSize);

  for (x = 0; x < this.sqr; x++) {
    for (y = 0; y < this.sqr; y++) {
      xx = x * this.tileSize;
      yy = y * this.tileSize;

      var tile;
      if ( xx < minX || xx > maxX || yy < minX || yy > maxX ) {
        tile = new tileObj(this.tileSize, xx, yy, "tile", true, x, y);
      } else {
        tile = new tileObj(this.tileSize, xx, yy, "tile", false, x, y);
      }

      this.tiles.push(tile);
    }
  }

  this.draw = function(hero, camera){
    this.tiles.sort();
    for (i = 0; i < this.tiles.length; i++) {
      tile = this.tiles[i];

      // Only draw tiles on screen
      xCheck = (tile.entity.x > (hero.entity.x - this.canvasHalfW)) && (tile.entity.x < (hero.entity.x + this.canvasHalfW + this.tileSize));
      yCheck = false;
      if(xCheck){
        yCheck = (tile.entity.y > (hero.entity.y - this.canvasHalfH)) && (tile.entity.y < (hero.entity.y + this.canvasHalfH + this.tileSize));
      }
      if( xCheck && yCheck ){
        tile.update(camera, hero);
      }
    }
  }

  function compare(a,b) {
    if (a.dstCentre > b.dstCentre)
      return -1;
    if (a.dstCentre < b.dstCentre)
      return 1;
    return 0;
  }

}
