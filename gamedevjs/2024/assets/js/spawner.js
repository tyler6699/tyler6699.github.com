function Spawner(hero){
  this.hero=hero;
  this.enemies = [];

  this.update = function(delta, t) {
    this.enemies.forEach(enemy => {
      enemy.update(delta, this.enemies);
      enemy.e.update(delta);
    });

    this.enemies = this.enemies.filter(function (i) {
     return i.active;
   });
  }

  this.addEnemy = function(numberOfEnemies, radius) {
    for (let i = 0; i < numberOfEnemies; i++) {
      let angle = (i / numberOfEnemies) * 2 * Math.PI; // Divide the circle into segments
      //let enemy = new Enemy(13, 16, types.ENEMY, i, numberOfEnemies);
      let enemy = new Enemy(0,0,9,8, [types.LILY, types.LILG, types.LILP][rndNo(0,2)], i, numberOfEnemies);

      enemy.e.x=this.hero.x + radius * Math.cos(angle); // Position enemies in a circle
      enemy.e.y=this.hero.y + radius * Math.sin(angle);
      this.enemies.push(enemy);
    }
  }

  this.addEnemy(30, 600);
}
