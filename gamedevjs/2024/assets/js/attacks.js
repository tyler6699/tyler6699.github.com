function Attack(hero) {
  this.hero = hero;
  this.weapons = [];
  this.spinWeapons = [];
  this.chaseWeapons = [];
  this.rotateSpeed = 2;

  // Define an array of types for clarity and easier maintenance
  const entityTypes = [types.C1, types.C2, types.C3, types.C4];

  // Loop through each type and create a new Entity for each
  entityTypes.forEach(type => {
      let chasingEntity = new Entity(7, 8, 0, 0, 0, type);
      chasingEntity.attack=false;
      this.chaseWeapons.push(chasingEntity);
      this.weapons.push(chasingEntity);
  });

  this.chasingTargets = new Set();
  this.figureEightEntity = new Entity(7, 8, 0, 0, 0, types.C5);
  this.figureEightEntity.attack=false;
  this.weapons.push(this.figureEightEntity);
  this.numberOfRotatingItems = 5; // Default number of rotating items
  this.distanceFromHero = 80; // Default distance from the hero in pixels
  let closestDistance = 500;

  // Create multiple rotating entities based on numberOfRotatingItems
  for (let i = 0; i < this.numberOfRotatingItems; i++) {
    const angle = (2 * Math.PI / this.numberOfRotatingItems) * i;
    const x = this.hero.e.x + 32 + this.distanceFromHero * Math.cos(angle);
    const y = this.hero.e.y + 32 + this.distanceFromHero * Math.sin(angle);
    let rotatingEntity = new Entity(6, 8, x, y, 0, types.SHIELD);
    this.weapons.push(rotatingEntity);
    this.spinWeapons.push(rotatingEntity);
  }
  this.spinWeapons[0].attack=true;

  // Entity behavior flags
  this.rotate = true;
  this.spin = false;
  this.chase = true;
  this.loop = true;

  // Additional function within Attack
this.applySeparation = function(chase, delta) {
  let separationDistance = 30; // Minimum desired distance between chasers
  let steerX = 0;
  let steerY = 0;

  this.chaseWeapons.forEach(other => {
    if(other.attack){
      if (other !== chase) {
        let dx = chase.x - other.x;
        let dy = chase.y - other.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0 && distance < separationDistance) {
          // Calculate force vector away from the other chaser
          let force = (separationDistance - distance) / distance;
          steerX += dx * force;
          steerY += dy * force;
        }
      }
    }
  });

  // Apply this force to the chaser's velocity or position
  chase.x += steerX * delta;
  chase.y += steerY * delta;
};

  this.update = function(delta, t) {
    if (this.rotate) {
      // Update all rotating entities

      this.spinWeapons.forEach((entity, index) => {
        if(entity.attack){
          let angle = t * 2 * Math.PI / this.rotateSpeed + (2 * Math.PI / this.numberOfRotatingItems) * index;
          entity.x = this.hero.e.x + 32 + this.distanceFromHero * Math.cos(angle);
          entity.y = this.hero.e.y + 32 + this.distanceFromHero * Math.sin(angle);
          entity.update(delta);
        }
      });
    }

    // You can include similar conditional logic for spin, chase, and loop with respective modifications
    // Chasing logic
    // Update chase weapons

    // Call this function in the update method for each chaser
  this.chaseWeapons.forEach((chase) => {
    if(chase.attack){
      this.applySeparation(chase, delta);
    }
  });

   this.chaseWeapons.forEach((chase) => {
     if (chase.attack) {
       if (this.chase) {
         let closestDistance = 500;
         switch (chase.chasePhase) {
           case 'search':
           this.targetEnemy = null;
            let closestDistance = Infinity; // Start with a very large distance
            cart.spawner.enemies.forEach(enemy => {
            if (!this.chasingTargets.has(enemy) && enemy.active) { // Check if enemy is not already targeted and is active
              let dx = chase.x - enemy.e.x;
              let dy = chase.y - enemy.e.y;
              let distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < closestDistance && distance < 200) { // Also ensure within chasing range
                closestDistance = distance;
                this.targetEnemy = enemy;
              }
            }
            });

            if (this.targetEnemy) {
              this.chasingTargets.add(this.targetEnemy); // Mark this enemy as targeted
              chase.chasePhase = 'attack';
            } else {
                chase.chasePhase = 'return';
            }
            break;

           case 'attack':
             if (this.targetEnemy && this.targetEnemy.active) {
               let dx = this.targetEnemy.e.x - chase.x;
               let dy = this.targetEnemy.e.y - chase.y;
               let angle = Math.atan2(dy, dx);
               chase.x += Math.cos(angle) * 5;
               chase.y += Math.sin(angle) * 5;

               if (Math.sqrt(dx * dx + dy * dy) < 5) {
                 chase.chasePhase = 'return';
               }
             } else {
               chase.chasePhase = 'return'; // Target is no longer active or was killed
             }
             break;

             case 'return':
               // Before returning, remove the enemy from the targeting list
               if (this.targetEnemy) {
                 this.chasingTargets.delete(this.targetEnemy);
               }

               let targetRadius = 60; // Radius at which the entities should circle around the hero
               let totalChasers = this.chaseWeapons.length;
               let index = this.chaseWeapons.indexOf(chase);
               let spacingAngle = (2 * Math.PI / totalChasers) * index; // Calculate unique angle based on index

               let targetX = this.hero.e.x + 30 + targetRadius * Math.cos(spacingAngle); // Target position around hero
               let targetY = this.hero.e.y + 30 + targetRadius * Math.sin(spacingAngle);

               let dx = targetX - chase.x;
               let dy = targetY - chase.y;
               let distanceToTarget = Math.sqrt(dx * dx + dy * dy);

               if (distanceToTarget > 5) {
                 // Continue moving towards the designated point around the hero
                 let angle = Math.atan2(dy, dx);
                 chase.x += Math.cos(angle) * 5; // Move towards the target point
                 chase.y += Math.sin(angle) * 5;
               } else {
                 // Once the chaser is close enough to its target point, reset to search
                 chase.chasePhase = 'search';
               }
               break;
         }
         chase.update(delta);
         cart.shadow.x=chase.x;
         cart.shadow.y=chase.y+60;
         cart.shadow.update(delta);
       }
    }
   });

    if(this.loop && this.figureEightEntity.attack){
      // Update figure-eight entity position
      radius = 120; // Adjust as needed
      let orbitSpeed = 2; // Adjust orbit speed as needed
      let x = this.hero.e.x + 32 + radius * Math.sin(t * orbitSpeed);
      let y = this.hero.e.y + 50 + radius * Math.sin(t * 2 * orbitSpeed); // Double the frequency for the figure-eight pattern
      this.figureEightEntity.x = x;
      this.figureEightEntity.y = y;

      this.figureEightEntity.update(delta);
    }
  }
}
