function level(canvasW, canvasH, id) {
  this.tiles = [];
  this.backTiles = [];
  this.collectTiles = [];
  this.coins = [];
  this.levelSize = 6;
  this.tileSize = 32;
  this.startX=0;
  this.startY=0;
  this.coinCount=0;
  var levelArray;
  this.canvasHalfW = canvasW / 2;
  this.canvasHalfH = canvasH / 2;

  this.draw = function(hero, camera){
    for (i = 0; i < this.backTiles.length; i++) {
      tile = this.backTiles[i];

      // Only draw tiles on screen
      xCheck = (tile.entity.x > (hero.entity.x - this.canvasHalfW)) && (tile.entity.x < (hero.entity.x + this.canvasHalfW + this.tileSize));
      yCheck = false;
      if(xCheck){
        yCheck = (tile.entity.y > (hero.entity.y - this.canvasHalfH) - offset) && (tile.entity.y < (hero.entity.y + this.canvasHalfH + this.tileSize - offset));
      }
      if( xCheck && yCheck ){
        tile.update(camera);
      }
    }

    // Collision Tiles
    for (i = 0; i < this.tiles.length; i++) {
      tile = this.tiles[i];
      tile.update(camera);
    }

    // Coins
    for (i = 0; i < this.coins.length; i++) {
      tile = this.coins[i];
      tile.update(camera);

      if( heroColliding(tile)){
        tile.collected = true;
        this.coinCount ++;
        this.coins.splice(i, 1);;
        console.log("coins:" + this.coinCount)
      }
    }
  }

  this.reset = function(id){
    console.log("Reset Level: " + id);
    this.tiles = [];
    this.backTiles = [];
    this.coins = [];

    if(id == 1){
      levelArray = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,1,1,1,1,1,0,0,0,0,0,2,0,0,0,0,0],
                       [1,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1],
                       [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2,0,0,0,1],
                       [1,0,0,1,1,1,0,0,1,0,3,0,1,1,1,0,0,0,0,1],
                       [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
                       [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
    }

    var rows = levelArray.length;
    var cols = levelArray[0].length;

    for (row = 0; row < rows; row++) {
      for (col = 0; col < cols; col++) {
        xx = col * this.tileSize;
        yy = row * this.tileSize;

        var tile;
        var type = levelArray[row][col];
        if(type == 1){
          tile = new tileObj(this.tileSize, xx, yy, "brick", true, col, row, "red");
          this.tiles.push(tile);
        } else if (type == 2) {
          tile = new tileObj(this.tileSize, xx, yy, "coin", false, col, row, "gold");
          this.coins.push(tile);
        } else if (type == 3){
          this.startX = xx;
          this.startY= yy;
        }

        // Always push a tile to the back
        tile = new tileObj(this.tileSize, xx, yy, "back", false, col, row, "#e6e6e6");
        this.backTiles.push(tile);
      }
    }
  }
}
