function level(canvasW, canvasH, id) {
  this.tiles = [];
  this.backTiles = [];
  this.coins = [];
  this.levelSize = 6;
  this.tileSize = 32;
  this.startX=0;
  this.startY=0;
  var coinCount=0;
  var maxCoinCount=0;
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

      if(heroColliding(tile)){
        tile.collected = true;
        coinCount ++;
        this.coins.splice(i, 1);;

        // Change the level
        if(coinCount == maxCoinCount){
          hero.currentLevel ++;
          console.log("Change Level: " + hero.currentLevel);
          this.reset(hero.currentLevel, hero);
          coinCount = 0;
        } else {
          console.log("coin(s):" + coinCount + " / " + maxCoinCount);
        }
      }
    }
  }

  this.reset = function(id, hero){
    console.log("Reset Level: " + id);
    maxCoinCount = 0;
    coinCount = 0;
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
    } else if(id == 2){
      levelArray = [[0,0,3,0,0,0],
                    [0,0,0,2,0,0],
                    [0,0,0,0,0,0],
                    [0,0,0,0,0,0],
                    [1,1,1,1,1,1]];
    } else if(id == 3){
      levelArray = [[1,0,3,0,0,1],
                    [1,0,0,2,0,1],
                    [1,0,1,1,0,1],
                    [1,2,0,0,2,1],
                    [1,1,1,1,1,1]];
    } else if(id == 4){
      levelArray = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
                    [1,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1],
                    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,1],
                    [1,0,0,1,1,1,1,1,1,0,3,0,1,1,1,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];;

      // reset the level
      hero.currentLevel = 0;
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
          maxCoinCount ++;
        } else if (type == 3){
          this.startX = xx;
          this.startY= yy;
          console.log(xx + " : " + yy);
        }

        // Always push a tile to the back
        tile = new tileObj(this.tileSize, xx, yy, "back", false, col, row, "#e6e6e6");
        this.backTiles.push(tile);
      }
    }

    // Update the HERO
    if(hero != null){
      hero.startX = this.startX;
      hero.startY = this.startY;
      hero.entity.x = hero.startX;
      hero.entity.y = hero.startY;
      // hero.reset = true;
      hero.hPower = 0;
      hero.jumping = false;
    }
  }
}
