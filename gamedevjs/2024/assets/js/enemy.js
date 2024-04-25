function Enemy(x, y, w, h, type, index, totalEnemies) {
  this.active=true;
  this.e = new Entity(w, h, 0, 0, 0, type);
  this.speed = .8; // Speed of the enemy
  this.angleOffset = (Math.PI * 2) * (index / totalEnemies); // Unique angle for each enemy
  this.safe=0;
  // this.shadow=
  this.update = function(delta, mobs) {
    if(this.safe>0) this.safe-=delta;
    let steerPow = this.steerFromNearbyMobs(mobs, 60);
    let targetX = cart.hero.e.x + 10 * Math.cos(this.angleOffset); // 50 is the desired radius
    let targetY = cart.hero.e.y + 10 * Math.sin(this.angleOffset);
    this.e.x += (targetX - this.e.x > 0 ? this.speed : -this.speed) + steerPow.x;
    this.e.y += (targetY - this.e.y > 0 ? this.speed : -this.speed) + steerPow.y;

    // Check collision with hero
   if (this.e.isCollidingWith(cart.hero.e) && this.safe <=0) {
     if(cart.hero.hp>0)cart.hero.hp--;
     cart.shakeTime=.2
     knockback(cart.hero, this, 5);
     this.safe=2;
   }

   cart.attacks.weapons.forEach(weapon => {
     if(weapon.attack){
       if (this.e.isCollidingWith(weapon)) {
         this.active = false;
         if(cart.hero.power<100)cart.hero.power++;
         cart.shakeTime=.2
         for(let i=0; i<30;i++){
           cart.hero.particles.push(new particle(rndNo(3,15), rndNo(3,15), this.e.x+5, this.e.y+5, 0, "circle", true, RIGHT));
         }
       }
    }
   });

  };

  this.steerFromNearbyMobs = function(allMobs, maxDist) {
    let steerX = 0;
    let steerY = 0;
    let count = 0;

    for(let i = 0; i < allMobs.length; i++) {
      let mob = allMobs[i];
      let d = Math.sqrt(Math.pow(this.e.x - mob.e.x, 2) + Math.pow(this.e.y - mob.e.y, 2));

      if (mob !== this && d < maxDist) {
        steerX += (this.e.x - mob.e.x);
        steerY += (this.e.y - mob.e.y);
        count++;
      }
    }

    if (count > 0) {
      steerX /= count;
      steerY /= count;
    }

    // Normalize steering force, and adjust its mag
    let mag = Math.sqrt(steerX * steerX + steerY * steerY);
    if (mag > 0) {
      steerX /= mag;
      steerY /= mag;
    }
    return { x: steerX, y: steerY };
    };
}
