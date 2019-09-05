function level(canvasW, canvasH, id) {
  this.tiles = [];
  this.backTiles = [];
  this.coins = [];
  this.enemies = [];
  this.startX=0;
  this.startY=0;
  this.canvasHalfW = canvasW / 2;
  this.canvasHalfH = canvasH / 2;
  this.showPortal=false;
  this.levels = [];
  this.active = false;
  this.complete = false;
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
    }

    // Coins
    for (i = 0; i < this.coins.length; i++) {
      var coin = this.coins[i];
      coin.update(camera);
    }

    // Enemies
    for (i = 0; i < this.enemies.length; i++) {
      var e = this.enemies[i];
      e.update(camera);
    }
  }

  this.tick = function(hero, intro, clock){
    // Collision Tiles
    for (i = 0; i < this.tiles.length; i++) {
      var tile = this.tiles[i];
      tile.tick(hero);
    }

    // Enemies
    for (i = 0; i < this.enemies.length; i++) {
      var e = this.enemies[i];
      e.tick(hero)
    }

    // Coins
    for (i = 0; i < this.coins.length; i++) {
      var coin = this.coins[i];

      if(coin.type == COIN && heroColliding(coin) && this.active && coin.active){
        playSound(COINFX,1);
        coin.active = false;
        coinCount ++;
      } else if (coin.type == PORTAL){
        if(this.showPortal){
          if(!coin.active){
            coin.active = true;
          } else if(coin.active && heroColliding(coin)){
            // Update Clock prev time
            clock.prevTime = clock.currentTime;
            intro.gitUI.setScores = true;
            playSound(PORTALFX,1);
            this.showPortal=false;
            this.complete = true;
            hero.active = false;
            this.active = false;
            // Last Level - Reset to 0
            if(hero.currentLevel == 4 ) hero.currentLevel = 0;
            // Reset the level
            intro.reset();
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
      intro.reset();
      this.reset(hero);
    }
  }

  this.reset = function(hero){
    this.showPortal = false;
    this.active = false;
    var id = hero != null ? hero.currentLevel : 0;
    maxCoinCount = 0;
    coinCount = 0;
    this.tiles = [];
    this.backTiles = [];
    this.coins = [];
    this.enemies = [];
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
          tile = new tileObj(tileSize, xx, yy, type, true, col, row);
          this.tiles.push(tile);
        } else if (type == COIN || type == PORTAL) {
          tile = new tileObj(tileSize, xx, yy, type, false, col, row);
          this.coins.push(tile);
          if(type == COIN) maxCoinCount ++;
        } else if (type == HERO){
          this.startX = xx;
          this.startY= yy;
        } else if (Array.isArray(type)){
          this.enemies.push( new enemyObj(xx, yy, type) );
        }

        // Decor Tiles
        if(Math.random() > .8){
          tile = new tileObj(tileSize, xx, yy, WALL, false, col, row);
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
  }

  // Setup Levels
  // 0
  E = [60,60,WALKER];
  F = [60,30,WALKER];
  J = [30,30,WALKJUMPER];
  this.levels.push([[0,0,0,0,0,0,0,0,0,0,0,E,0,0,0,0,0,0,0,0],
                    [0,0,1,7,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
                    [0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,6,0,0,0,0,0,0,F,0,0,0,0,0,0,0,0,0],
                    [1,1,1,6,1,1,0,0,4,4,4,4,1,0,0,0,0,0,0,0],
                    [0,0,1,6,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                    [1,0,1,6,1,L,L,L,1,0,J,0,7,0,0,0,0,0,0,0],
                    [1,0,0,6,0,0,0,0,1,4,4,4,6,1,R,R,R,1,0,1],
                    [1,0,0,6,0,0,0,0,1,0,0,0,6,1,0,0,0,0,0,1],
                    [1,0,0,1,1,1,0,0,1,1,3,0,6,1,1,1,1,4,4,1],
                    [1,0,0,0,0,0,0,0,1,2,0,8,0,0,0,0,0,0,0,1],
                    [1,4,4,4,4,4,4,4,1,4,4,4,4,5,5,5,5,5,4,1]]);
  // 1
  this.levels.push([[0,0,0,0,0,0],
                    [0,0,0,0,0,0],
                    [0,0,0,0,8,0],
                    [0,3,0,0,2,2],
                    [5,5,5,5,4,4]]);
  // 2
  this.levels.push([[0,7,0,2,0,0],
                    [0,6,1,1,0,0],
                    [0,6,0,0,8,0],
                    [0,3,0,0,0,0],
                    [5,5,5,5,4,4]]);
}
