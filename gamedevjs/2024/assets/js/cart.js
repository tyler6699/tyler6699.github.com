function Cart() {
  this.cam=new Camera();
  this.time=0;
  this.hero = new Hero(16, 16, 0, 0, 0, types.HERO);
  this.heroShadow = new Entity(11, 4, 0, 0, 0, types.SHADOW,1);
  this.shadow = new Entity(7, 3, 0, 0, 0, types.SHADOW,1);
  this.attacks=new Attack(this.hero);
  this.spawner = new Spawner(this.hero.e);
  this.decor = new Decor();
  this.intro = new Intro();
  let waveStart=3;
  this.waveEnd=10;
  this.wave = 1;
  let scale = 20; // Initial scale of the squares
  let prevNumber = 0;
  let runOnce=true;
  let imageData;
  this.shake=0;
  this.shakeTime=0;
  this.shop=false;
  this.chests=[]
  this.chests.push(new Entity(16, 13, -70, 30, 0, types.CHEST,1));
  this.chests.push(new Entity(16, 13, 65, 30, 0, types.CHEST,2));
  this.chests.push(new Entity(16, 13, 200, 30, 0, types.CHEST,3));
  let one = new Entity(6, 5, -30, 10, 0, types.ONE);
  let two = new Entity(7, 5, 100, 10, 0, types.TWO);
  let three = new Entity(7, 5, 230, 10, 0, types.THREE);
  this.upz = ['hat','figure8','chaser', 'shield', 'shieldSpeed','speed','MHP'];
  let qq = new Entity(8, 10, 0, 0, 0, types.QUEST,1);
  let hp = new Entity(8, 8, 0, 0, 0, types.HP,1);
  this.mobz=30;

  // Render & Logic
  this.update = function(delta, gameStarted=false) {
    if(runOnce){
      var gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradient.addColorStop(0, '#3CB371'); // Dark green at the top
      gradient.addColorStop(1, '#A6F1C8'); // Lighter green at the bottom
    }

    if(gameStarted){
      // Screen shake
      this.shake = shaky ? rndNo(-2,2) : 0;
      if(this.shakeTime>0) this.shakeTime-=delta;

      // Camera follow hero
      // Example usage: draw the number "190"
      this.cam.x = lerp(-this.hero.e.x+350,this.cam.x,.1);
      this.cam.y = lerp(-this.hero.e.y+200,this.cam.y,.1);

      TIME += delta;
      mg.clear();

      // GRASS
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      this.time+=delta;

      if(this.shop){
        TIME=0;
        this.chests.forEach(c => {
          c.update(delta);

          // this.upz = ['chaser', 'shield', 'shieldSpeed', 'figure8', 'hat'];
          switch(c.content) {
            case 'chaser':
              var k=cart.attacks.chaseWeapons.filter(weapon => weapon.attack === true).length;
              if(k<4){
                var chaser = cart.attacks.chaseWeapons[cart.attacks.chaseWeapons.filter(weapon => weapon.attack === true).length];
                chaser.x=c.x;
                chaser.y=c.y-32;
                chaser.update(delta);
              }
              break;
            case 'shield':
              var s = cart.attacks.spinWeapons[0];
              s.x=c.x;
              s.y=c.y-32;
              s.update(delta);
              break;
            case 'figure8':
              var s = cart.attacks.figureEightEntity;
              s.x=c.x;
              s.y=c.y-32;
              s.update(delta);
              break;
            case 'hat':
              var h = this.hero.hat;
              h.x=c.x-50;
              h.y=c.y-60;
              h.update(delta);
              break;
            case 'HP':
              hp.x=c.x-5;
              hp.y=c.y-32;
              hp.update(delta);
              break;
            default:
              qq.x=c.x-5;
              qq.y=c.y-40;
              qq.update(delta);
              break;
          }

           if (c.isCollidingWith(this.hero.e) && !c.open) {
             c.open=true;

             if(c.id==1&&this.hero.power >=10){
               this.hero.power-=10;
               c.sx=50;
               this.hero.hp=this.hero.maxHP;
               for(let i=0; i<30;i++){
                 cart.hero.particles.push(new particle(rndNo(3,15), rndNo(3,15), c.x+50, c.y+60, 0, "circle", true, RIGHT));
               }
             } else if(c.id==2&&this.hero.power >=20){
               this.hero.power-=20;
               c.sx=50;
               this.applyUpgrade(c.content);
               for(let i=0; i<30;i++){
                 cart.hero.particles.push(new particle(rndNo(3,15), rndNo(3,15), c.x+50, c.y+60, 0, "circle", true, RIGHT));
               }
             } else if(c.id==3&&this.hero.power >=30){
               this.hero.power-=30;
               c.sx=50;
               this.applyUpgrade(c.content);
               for(let i=0; i<30;i++){
                 cart.hero.particles.push(new particle(rndNo(3,15), rndNo(3,15), c.x+50, c.y+60, 0, "circle", true, RIGHT));
               }
             }
           }
        });
        one.update(delta);
        two.update(delta);
        three.update(delta);
        if(space()){
          this.wave++;
          waveStart=3;
          TIME=0;
          this.shop=false;
          // Set mob and wave settings
          this.waveEnd=8+(this.wave*.5)
          if(this.waveEnd>30) this.waveEnd=30
          this.mobz+=10;
          this.spawner.addEnemy(this.mobz,300);
          this.chests.forEach(c => {
            c.open=false;
            c.sx=67;
          });
        }

        let viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        let fontSize=getResponsiveFontSize(.05)
        let font=`${fontSize}px Arial`;
        writeCentre(ctx, "Space for next wave", font, canvasW / 2, viewportHeight - 60)
      }

      if(!this.shop) this.decor.update(delta);
      this.hero.update(delta);
      if(this.hero.e.flip){
        this.heroShadow.x=this.hero.e.x+4;
      } else {
        this.heroShadow.x=this.hero.e.x+18;
      }
      this.heroShadow.y=this.hero.e.y+74;
      this.heroShadow.update(delta);

      // Wave Start Count Down
      if(waveStart<=0 && TIME <= this.waveEnd && !this.shop){
        this.spawner.update(delta, this.time);
        this.attacks.update(delta, this.time);
        drawCountdown(ctx, TIME, this.waveEnd);
      } else if(TIME >= this.waveEnd){
          this.shop=true;
          this.randomChests();
          TIME=0;
          this.spawner.enemies = [];
          this.hero.e.x=65;
          this.hero.e.y=140;
      } else if(waveStart>0) {
        waveStart-=delta;
        if(Math.ceil(waveStart)!=prevNumber) scale=20;
        drawNumber(330, 80, Math.ceil(waveStart), scale);
        scale += .3;
        prevNumber = Math.ceil(waveStart)
        TIME=0;
      }

      // Hero HP and Power
      drawBar(ctx, this.hero.hp, this.hero.maxHP, '#f68687', '#a15156','#faf1f0',0); // HP RED
      drawBar(ctx, this.hero.power, 100, '#84e3b3','#589572','#f0faf7',30); // Power Green
      displayEnemyCount(this.spawner.enemies.length)
      displayFPS(fps);
    } else {
      // Intro Screen
      this.intro.update(delta);
    }
  }

  this.applyUpgrade = function(content) {
    switch(content) {
      case 'chaser':
      let n=cart.attacks.chaseWeapons.filter(weapon => weapon.attack === true).length
      if(n<4){
        this.attacks.chaseWeapons[n].attack=true;
      }
      if(n==3)this.removeItem('chaser');
        break;
      case 'shield':
        let num=cart.attacks.spinWeapons.filter(weapon => weapon.attack === true).length
        if(num<5){
          this.attacks.spinWeapons[num].attack=true;
        }
        if(num==4)this.removeItem('shield');
        break;
      case 'figure8':
          this.attacks.figureEightEntity.attack=true;
          this.removeItem('figure8');
        break;
      case 'hat':
        this.hero.showhat=true;
        this.hero.maxHP=200;
        this.removeItem('hat');
        break;
      case 'speed':
        this.hero.e.speed+=.5;
        if(this.hero.e.speed>=7)this.removeItem('speed');
        break;
      case 'shieldSpeed':
        this.attacks.rotateSpeed-=.1;
        if(this.attacks.rotateSpeed<=0.7)this.removeItem('shieldSpeed');
        break;
      case 'MHP':
        this.hero.maxHP+=5;
        if(this.attacks.rotateSpeed<=0.7)this.removeItem('shieldSpeed');
        break;
    }
  };

  this.randomChests = function() {
    for (let i = this.upz.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.upz[i], this.upz[j]] = [this.upz[j], this.upz[i]];
    }
    this.chests[0].content="HP";
    this.chests[1].content = this.upz[0];
    this.chests[2].content = this.upz[1];
  };

  this.removeItem = function(item) {
    const index = this.upz.indexOf(item);
    if (index > -1) {
        this.upz.splice(index, 1);
    }
  };

  this.reset = function(){
    this.time=0;
    this.waveEnd=10;
    this.wave = 1;
    this.shop=false;
    this.upz = ['hat','figure8','chaser', 'shield', 'shieldSpeed','speed','MHP'];
    this.mobz=30;
    this.hero = new Hero(16, 16, 0, 0, 0, types.HERO);
    gameStarted=false;
    this.attacks=new Attack(this.hero);
    this.spawner=new Spawner(this.hero.e);
    this.cam=new Camera();
  }
}
