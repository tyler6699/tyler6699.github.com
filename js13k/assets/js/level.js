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
  this.maxLevels;
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
      e.tick(hero, intro)
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
            if(hero.currentLevel == this.maxLevels ) hero.currentLevel = -1;
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
  N = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  // TEST HERE
  //var WALKER=0;
  // var SHOOTER=1;
  // var FOLLOW=2;
  // var JUMPER=3;
  // var WALKJUMPER=4;

  // 0. RUN
  this.levels.push([
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,0,1,1,1,0,1,0,0],
  [0,1,0,0,0,1,0,1,0,1,0,0],
  [0,1,0,1,0,1,0,1,0,0,0,0],
  [0,1,1,1,0,1,1,1,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [3,0,2,0,0,2,0,0,2,0,0,8],
  [4,4,4,4,4,4,4,4,4,4,4,4]]);

  // 1. JUMP
  this.levels.push([
  N,N,
  [0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0],
  [0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0],
  [0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0],
  [0,1,1,0,1,1,1,0,1,0,1,0,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0],
  [0,3,0,0,0,1,0,0,0,1,0,0,0,8,0,0],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]]);

  // 2. CLIMB
  this.levels.push(
  [N,
  N,
  [0,1,1,0,1,0,0,1,0,1,0,1,0,1,0,0,0],
  [0,1,0,0,1,0,0,1,0,1,1,1,0,1,1,1,0],
  [0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0],
  [0,1,1,0,1,1,0,1,0,1,0,1,0,1,1,1,0],
  N,
  [0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,6,1,4,4,4,0,0,0,0,0,0,0],
  [0,0,0,0,0,6,1,0,0,0,0,0,0,0,0,0,0],
  [0,3,0,2,0,6,1,0,2,0,0,0,2,0,0,8,0],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]]);

  // 3. Enemy
  E = [6*30,3*30,WALKER];
  this.levels.push(
  [N,
  [0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0],
  [0,0,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0],
  [0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0],
  [0,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0,0,0,0],
  N,
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,3,0,0,2,0,0,0,0,0,E,0,0,0,2,0,8,0,0],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]]);

  // 4. First Real Level
  E = [5*30,5*30,WALKER];
  F = [7*30,3*30,WALKER];
  this.levels.push([
  [2,0,0,0,0,0,0,0,0,0,0,2],
  [0,0,0,0,0,E,7,0,8,0,0,0],
  [1,1,1,1,1,1,6,1,1,1,1,1],
  [0,0,0,0,0,0,6,0,0,0,0,0],
  [2,0,0,7,0,0,6,0,7,0,0,2],
  [4,0,0,6,4,4,4,4,6,0,0,4],
  [0,0,0,6,0,0,0,0,6,0,0,0],
  [2,0,0,0,0,0,0,F,0,7,0,2],
  [4,4,4,4,4,4,4,4,4,6,4,4],
  [0,0,0,0,0,0,0,0,0,6,0,0],
  [3,0,0,0,0,0,0,0,0,6,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1]]);

  // 5. Level 2
  E = [2*30,0,WALKER];
  F = [2*30,0,WALKER];
  G = [4*30,4*30,WALKER];
  this.levels.push([
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,E,0,0,0,0,7,0,8,F,2],
  [1,1,1,1,0,0,1,6,1,1,1,1],
  [0,0,0,0,0,0,0,6,0,0,0,0],
  [2,0,7,0,0,0,0,6,0,0,0,2],
  [4,4,6,0,4,4,4,4,4,0,4,4],
  [0,0,6,0,0,0,0,0,0,0,0,0],
  [2,0,6,0,G,0,0,0,0,7,0,2],
  [4,4,4,4,4,4,4,4,4,6,4,4],
  [0,0,0,0,0,0,0,0,0,6,0,0],
  [0,3,0,0,0,0,0,0,0,6,0,2],
  [1,1,1,1,1,1,1,1,1,1,1,1]]);

  // 6. ICE
  this.levels.push([N, N,
  [0,5,0,5,5,5,0,5,5,5,0,0],
  [0,5,0,5,0,0,0,5,0,0,0,0],
  [0,5,0,5,0,0,0,5,5,0,0,0],
  [0,5,0,5,0,0,0,5,0,0,0,0],
  [0,5,0,5,5,5,0,5,5,5,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,3,0,2,2,2,2,2,2,0,8,0],
  [5,5,5,5,5,5,5,5,5,5,5,5],
  [1,1,1,1,1,1,1,1,1,1,1,1]]);

  // 7. ICE 2
  E = [2*30,4*30,WALKER];
  F = [30,0,WALKER];
  this.levels.push([
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,2,0,0,2,0,0,0,0],
  [0,0,0,0,0,0,5,5,0,0,2,0],
  [0,8,0,0,0,0,0,0,0,5,5,0],
  [0,0,0,0,0,F,0,0,0,0,0,0],
  [0,0,5,5,4,4,4,5,5,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [5,5,2,0,E,0,0,0,0,2,0,7],
  [1,1,4,4,4,4,4,4,4,4,4,6],
  [0,0,0,0,0,0,0,0,0,0,0,6],
  [3,0,2,0,0,0,0,0,0,2,0,6],
  [1,1,5,5,5,5,5,5,5,5,1,1]]);

  // 8. ICE 3
  this.levels.push([
  [7,0,0,0,2,0,0,0,0,0,0,0],
  [6,4,4,4,4,0,0,0,0,0,0,0],
  [6,0,0,0,0,0,0,0,0,0,0,0],
  [6,0,0,0,0,2,0,2,0,0,0,8],
  [6,0,0,0,0,5,0,5,0,1,4,4],
  [6,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,7],
  [0,0,4,4,5,5,4,4,5,5,4,6],
  [0,0,0,0,0,0,0,0,0,0,0,6],
  [0,0,0,0,2,0,2,0,2,0,0,6],
  [3,0,0,0,0,0,0,0,0,0,0,6],
  [1,1,1,0,5,0,5,0,5,0,1,1]]);

  // 9. ICE 4
  this.levels.push([[2,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [5,0,7,0,0,0,0,0,0,0,8,0],
  [0,5,6,5,5,0,0,0,0,4,4,4],
  [0,0,6,0,0,0,0,0,0,0,0,2],
  [0,0,6,0,0,0,5,5,5,0,0,4],
  [2,3,0,0,0,0,0,0,0,0,0,2],
  [4,4,0,0,0,0,0,0,0,0,0,4],
  [0,0,5,0,0,0,0,0,0,0,0,2],
  [0,0,0,5,0,0,0,0,0,0,0,4],
  [0,2,0,0,5,5,0,0,0,0,0,2],
  [1,1,1,0,0,0,0,1,1,1,1,1]]);

  // 10 Converoy 1
  this.levels.push(
  [[0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,9,0,0,0,10,0,0,0,0],
  [0,0,9,0,0,0,0,0,10,0,0,0],
  [0,9,0,0,0,0,0,0,0,10,0,0],
  [0,0,9,0,0,0,0,0,10,0,0,0],
  [0,0,0,9,0,0,0,10,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [1,3,0,2,0,2,8,2,0,2,0,1],
  [10,10,10,10,10,10,10,10,10,10,10,10]]);

  // 11
  this.levels.push([[0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,5,1,1,1,1,1,5,0],
  [0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,7,0,2,0,7,0,0],
  [0,3,0,1,1,6,1,1,1,6,0,0],
  [0,0,0,0,0,6,1,0,0,6,0,2],
  [1,8,0,2,0,0,1,0,2,0,0,1],
  [10,10,10,10,10,10,1,10,10,10,10,10]]);

  // 12. Conveyor
  this.levels.push([[0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,8,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,4,4,0,0,0,2],
  [0,0,0,2,0,1,0,0,0,0,4,4],
  [0,3,0,7,0,1,2,0,0,0,0,0],
  [1,4,4,6,4,1,9,9,9,0,0,0],
  [1,0,0,6,0,1,0,0,0,0,0,2],
  [1,0,0,6,0,1,0,0,10,10,10,10],
  [1,0,0,6,0,1,2,0,0,0,0,0],
  [1,0,0,6,0,1,9,9,9,9,0,0],
  [1,2,0,6,0,0,0,0,0,0,0,2],
  [1,1,10,10,10,10,10,10,10,10,10,10]]);

  // 13
  E = [90,0,WALKER];
  F = [0,90,WALKER];
  this.levels.push([
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,5,4,5,1,0,1,1,1,1,1],
  [5,0,2,0,0,1,0,0,0,0,0,0],
  [2,0,5,0,2,1,0,0,0,0,E,2],
  [5,0,2,0,5,1,2,4,9,9,9,4],
  [2,0,5,0,2,1,0,0,0,0,0,0],
  [5,0,2,0,5,1,0,F,0,0,0,2],
  [2,0,5,0,2,1,2,4,9,9,9,4],
  [5,0,2,0,5,1,0,0,0,7,0,0],
  [2,0,5,0,0,1,2,1,1,6,1,1],
  [5,0,0,3,0,1,0,0,0,6,0,8],
  [1,1,1,1,1,1,1,1,1,1,1,1]]);

  // 14
  E = [90,30,JUMPER];
  this.levels.push([[0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,8,0,0,0,0,0,0],
  [0,0,7,0,0,0,0,0,0,7,0,0],
  [0,0,6,1,5,5,5,5,1,6,0,0],
  [0,0,6,0,2,0,0,2,0,6,0,0],
  [0,2,6,0,0,0,0,0,0,6,0,0],
  [3,1,6,0,0,0,E,0,0,6,2,0],
  [1,1,1,1,1,1,1,1,1,1,1,1]]);

  // 15
  E = [60,30,WALKJUMPER];
  this.levels.push([
  [0,0,0,0,0,1,1,1,1,1,0,0],
  [0,0,0,0,0,0,1,1,1,0,0,0],
  [7,0,2,0,0,0,2,E,0,0,0,8],
  [6,4,4,4,4,4,4,4,4,4,4,4],
  [6,0,0,0,0,0,0,0,0,0,0,0],
  [6,0,0,0,0,0,7,0,2,0,0,2],
  [1,5,5,5,5,0,6,4,9,9,9,9],
  [0,5,2,2,5,0,6,0,0,0,0,0],
  [0,5,2,2,5,0,6,0,0,0,0,0],
  [0,5,5,5,5,0,6,0,0,0,0,0],
  [1,1,1,1,1,1,1,0,2,0,0,2],
  [0,3,0,0,0,0,0,0,1,0,0,1],
  [1,1,10,10,10,10,10,10,1,0,0,1]]);

  // 16
  this.levels.push([[0,0,0,0,0,3,0,0,0,0,0,0],
  [0,0,0,0,5,5,5,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,2,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,2,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,2,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,2,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,2,0,0,0,0,8],
  [0,0,0,0,0,0,5,0,0,5,0,5]]);

  // 17
  this.levels.push([
  [2,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,0,0,2,0,0,0,0,0,0,2],
  [0,5,0,0,5,0,0,2,0,0,2,0],
  [0,0,0,0,0,0,0,5,0,0,5,5],
  [2,0,0,0,0,0,0,0,0,0,0,0],
  [2,0,0,0,0,0,0,0,0,0,0,9],
  [2,0,0,0,2,0,0,0,2,0,0,0],
  [2,0,0,0,10,0,0,0,1,0,0,0],
  [0,0,2,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,0,0,0,0,0,0,0,0],
  [8,2,0,0,0,3,0,0,0,0,2,0],
  [1,1,1,5,5,5,5,5,5,5,5,5]]);

  // 18
  E = [5*30,4*30,FOLLOW];
  F = [30,3*30,FOLLOW];
  G = [5*30,3*30,FOLLOW];
  H = [3*30,30,FOLLOW];
  this.levels.push([
  [0,0,8,0,2,7,2,0,0,0,0,0],
  [2,0,9,9,9,6,10,10,10,0,0,2],
  [0,F,0,0,0,6,0,0,0,H,0,0],
  [4,4,4,4,5,6,5,5,4,4,4,4],
  [0,0,0,0,0,6,0,0,0,0,0,0],
  [0,2,0,0,0,6,0,0,0,0,2,0],
  [0,0,0,7,0,6,0,G,7,0,0,0],
  [0,1,1,6,1,1,1,1,6,1,1,0],
  [0,0,0,6,0,0,0,0,6,0,0,0],
  [0,3,0,6,0,0,E,0,6,0,2,0],
  [0,4,4,4,4,4,4,4,4,4,4,0],
  [0,0,0,0,0,0,0,0,0,0,0,0]]);

  //19
  this.levels.push([[8,0,2,0,0,0,0,0,0,0,0,0],
  [0,0,5,0,0,5,0,5,0,5,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,5],
  [7,0,0,0,0,0,0,0,0,0,0,0],
  [6,10,10,10,10,10,0,0,0,5,0,5],
  [6,0,0,0,0,0,0,0,0,0,0,0],
  [6,0,0,0,0,0,0,0,0,0,0,0],
  [6,0,0,0,0,0,0,0,0,0,0,0],
  [5,0,0,9,9,9,9,9,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,5],
  [3,0,0,0,0,0,0,0,0,0,0,0],
  [10,10,10,10,10,10,10,10,10,0,0,0]]);

  // 20
  this.levels.push([[0,0,0,0,0,2,0,0,2,0,0,8],
  [0,7,0,0,0,7,0,0,7,0,0,7],
  [1,6,1,0,0,0,0,0,0,0,0,0],
  [0,6,0,0,0,0,0,0,0,0,0,0],
  [0,6,0,0,2,0,0,2,0,0,0,0],
  [0,6,0,0,7,0,0,7,0,0,2,7],
  [0,4,0,0,0,0,0,0,0,0,5,6],
  [0,0,0,0,0,0,0,0,0,0,0,6],
  [0,0,0,0,0,0,0,0,0,0,0,6],
  [0,3,0,0,2,0,0,2,0,0,0,2],
  [0,7,0,0,7,0,0,7,0,0,7,7],
  [0,0,0,0,0,0,0,0,0,0,0,0]]);

  // 21
  E = [30,0,WALKER];
  F = [60,-30,WALKER];
  G = [60,-30,WALKER];
  this.levels.push([[1,1,1,5,0,0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0,2,0,1,5,5],
  [0,0,2,1,0,0,0,0,0,1,2,2],
  [4,4,4,1,0,0,0,0,0,1,4,4],
  [2,0,G,1,0,0,2,0,0,1,2,2],
  [4,4,4,1,0,0,0,0,0,1,5,5],
  [0,E,2,1,0,0,0,0,0,1,2,2],
  [4,4,4,1,0,0,0,2,0,1,4,4],
  [3,0,F,1,0,0,0,0,0,1,2,2],
  [4,4,4,1,0,0,0,0,0,1,5,5],
  [0,0,0,0,0,0,8,0,0,0,0,0],
  [5,5,5,5,5,0,5,0,5,5,5,5]]);

  // 22
  this.levels.push([[2,5,2,5,2,5,2,8],
  [5,2,5,2,5,2,5,2],
  [2,5,2,5,2,5,2,5],
  [5,2,5,2,5,2,5,2],
  [2,5,2,5,2,5,2,5],
  [5,2,5,2,5,2,5,2],
  [3,5,2,5,2,5,2,5],
  [1,1,1,1,1,1,1,1]]);

  this.maxLevels = this.levels.count;
}
