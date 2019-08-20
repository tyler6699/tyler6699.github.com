function level(canvasW, canvasH, id) {
  this.tiles = [];
  this.backTiles = [];
  this.coins = [];
  this.startX=0;
  this.startY=0;
  this.canvasHalfW = canvasW / 2;
  this.canvasHalfH = canvasH / 2;
  this.showPortal=false;
  this.levels = [];
  var tileSize = 30;
  var coinCount=0;
  var maxCoinCount=0;
  var levelArray;
  var L = 9;
  var R = 10;

  this.draw = function(hero, camera){
    for (i = 0; i < this.backTiles.length; i++) {
      var tile = this.backTiles[i];
      tile.update(camera);
    }

    // Collision Tiles
    for (i = 0; i < this.tiles.length; i++) {
      var tile = this.tiles[i];
      tile.update(camera);
      tile.tick(hero);
    }

    // Coins
    for (i = 0; i < this.coins.length; i++) {
      var coin = this.coins[i];
      coin.update(camera);

      if(coin.type == COIN && heroColliding(coin) && this.active && coin.active){
        playSound(COINFX,1);
        coin.active = false;
        coinCount ++;
      } else if (coin.type == PORTAL){
        if(this.showPortal){
          if(!coin.active){
            coin.active = true;
          } else if(coin.active && heroColliding(coin)){
            playSound(PORTALFX,1);
            this.showPortal=false;
            hero.currentLevel ++;
            hero.active = false;
            this.active = false;
            // Last Level - Reset to 0
            if(hero.currentLevel == 4 ) hero.currentLevel = 0;
            // Reset the level
            this.reset(hero);
          }
        }
      }
    }

    // Change the level
    if(coinCount == maxCoinCount && !hero.reset){
      this.showPortal = true;
    } else if(hero.reset){
      this.showPortal = false;
      hero.reset = false;
      hero.active = false;
      this.active = false;
      this.reset(hero);
    }
  }

  this.reset = function(hero){
    var id = hero != null ? hero.currentLevel : 0;
    maxCoinCount = 0;
    coinCount = 0;
    this.tiles = [];
    this.backTiles = [];
    this.coins = [];
    levelArray = this.levels[id];

    var rows = levelArray.length;
    var cols = levelArray[0].length;

    for (row = 0; row < rows; row++) {
      for (col = 0; col < cols; col++) {
        xx = col * tileSize;
        yy = row * tileSize;
        var tile;
        var type = levelArray[row][col];
        // Set tile type
        if([BRICK, LEDGE, ICE, LADDER, LADDERTOP, LEFTA, RIGHTA].includes(type)){
          tile = new tileObj(tileSize, xx, yy, type, true, col, row, "none");
          this.tiles.push(tile);
        } else if (type == COIN || type == PORTAL) {
          tile = new tileObj(tileSize, xx, yy, type, false, col, row, "none");
          this.coins.push(tile);
          if(type == COIN) maxCoinCount ++;
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

    // Trigger Level Song
    if(audioCtx != null){ playMusic(); }
    this.active = true;
  }

  // Setup Levels
  // 0
  this.levels.push([[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,6,1,L,L,L,1,0,0,0,7,0,0,0,0,0,0,0],
          [1,0,0,6,0,0,0,0,1,4,4,4,6,1,R,R,R,1,0,1],
          [1,0,0,6,0,0,0,0,1,0,0,0,6,1,0,2,0,0,0,1],
          [1,0,0,1,1,1,0,0,1,0,3,0,6,1,1,1,1,4,4,1],
          [1,0,0,0,0,0,0,0,1,0,0,8,0,0,0,0,0,0,2,1],
          [1,4,4,4,4,4,4,4,1,4,4,4,4,5,5,5,5,5,4,1]]);
  // 1
  this.levels.push([[0,0,0,0,0,0],
                  [0,0,0,0,0,0],
                  [0,0,0,0,8,0],
                  [0,3,0,0,2,2],
                  [5,5,5,5,4,4]]);

  // 2
  this.levels.push([[1,2,2,2,2,1],
                [1,2,2,2,2,1],
                [1,2,4,4,2,1],
                [1,2,8,3,2,1],
                [1,5,5,5,5,1]]);

  // 3
  this.levels.push([[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,6,0],
                [0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,6,0],
                [0,0,0,0,0,0,0,0,1,4,0,0,0,0,0,0,0,0,6,0],
                [0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,0,6,0],
                [1,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,0,6,1],
                [1,0,0,8,0,0,0,0,1,0,0,0,0,0,0,6,0,0,6,1],
                [1,0,0,4,4,4,4,4,1,0,3,0,1,1,1,6,0,0,6,1],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]]);
}
