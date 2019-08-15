function level(canvasW, canvasH, id) {
  this.tiles = [];
  this.backTiles = [];
  this.coins = [];
  this.startX=0;
  this.startY=0;
  this.canvasHalfW = canvasW / 2;
  this.canvasHalfH = canvasH / 2;
  var tileSize = 32;
  var coinCount=0;
  var maxCoinCount=0;
  var levelArray;

  this.draw = function(hero, camera){
    for (i = 0; i < this.backTiles.length; i++) {
      tile = this.backTiles[i];

      // Only draw tiles on screen
      xCheck = (tile.entity.x > (hero.entity.x - this.canvasHalfW)) && (tile.entity.x < (hero.entity.x + this.canvasHalfW + tileSize));
      yCheck = false;
      if(xCheck){
        yCheck = (tile.entity.y > (hero.entity.y - this.canvasHalfH) - offset) && (tile.entity.y < (hero.entity.y + this.canvasHalfH + tileSize - offset));
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
      var coin = this.coins[i];
      coin.update(camera);

      if(heroColliding(coin) && this.active && coin.active){
        playSound(COINFX);
        coin.active = false;
        coinCount ++;
      }
    }

    // Change the level
    if(coinCount == maxCoinCount){
      hero.currentLevel ++;
      hero.active = false;
      this.active = false;
      this.reset(hero.currentLevel, hero);
      console.log("coin(s):" + coinCount + " / " + maxCoinCount);
    }
  }

  this.reset = function(id, hero){
    if(hero != null){ hero.active = false; }
    console.log("Reset Level: " + id);
    maxCoinCount = 0;
    coinCount = 0;
    this.tiles = [];
    this.backTiles = [];
    this.coins = [];

    if(id == 1){
      levelArray = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0],
                       [4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                       [0,0,0,0,1,1,1,1,1,0,0,0,0,0,2,0,0,0,0,0],
                       [1,0,0,0,0,0,0,0,1,4,4,0,0,1,1,1,0,0,0,1],
                       [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2,0,0,0,1],
                       [1,0,0,1,1,1,0,0,1,0,3,0,1,1,1,0,0,0,0,1],
                       [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
                       [1,4,4,4,4,4,4,4,1,4,4,4,4,4,4,4,4,4,4,1]];
    } else if(id == 2){
      levelArray = [[0,0,0,0,0,0],
                    [0,0,0,0,0,0],
                    [0,0,0,0,0,0],
                    [0,3,0,0,2,2],
                    [1,1,1,1,1,1]];
    } else if(id == 3){
      levelArray = [[1,2,2,2,2,1],
                    [1,2,2,2,2,1],
                    [1,2,4,4,2,1],
                    [1,2,0,3,2,1],
                    [1,1,1,1,1,1]];
    } else if(id == 4){
      levelArray = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,1,4,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,0,0,0],
                    [1,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,0,1],
                    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2,0,0,0,1],
                    [1,0,0,4,4,4,4,4,1,0,3,0,1,1,1,0,0,0,0,1],
                    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
                    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];;

      // reset the level
      hero.currentLevel = 0;
    }

    var rows = levelArray.length;
    var cols = levelArray[0].length;

    for (row = 0; row < rows; row++) {
      for (col = 0; col < cols; col++) {
        xx = col * tileSize;
        yy = row * tileSize;

        var tile;
        var type = levelArray[row][col];
        // Set tile type
        if(type == BRICK || type == LEDGE){
          tile = new tileObj(tileSize, xx, yy, type, true, col, row, "none");
          this.tiles.push(tile);
        } else if (type == COIN) {
          tile = new tileObj(tileSize, xx, yy, type, false, col, row, "none");
          this.coins.push(tile);
          maxCoinCount ++;
        } else if (type == HERO){
          this.startX = xx;
          this.startY= yy;
        }

        // Always push a tile to the back
        if(Math.random() > .8){
          tile = new tileObj(tileSize, xx, yy, WALL, false, col, row, "none");
          this.backTiles.push(tile);
        }
      }
    }

    // Update the HERO
    if(hero != null){
      hero.resetPos(this.startX, this.startY);
    }

    this.active = true;
  }
}
