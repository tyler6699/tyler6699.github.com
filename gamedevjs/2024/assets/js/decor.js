function Decor(){
  this.decors = [];

  var areaSize = 1000; // Define the range for random placement
  var num = 20; // Number to place

  for (let i = 0; i < num; i++) {
    let x = Math.random() * (2 * areaSize) - areaSize;
    let y = Math.random() * (2 * areaSize) - areaSize;
    this.decors.push(new Entity(9, 6, x, y, 0, types.SMALLROCK));
  }

  numRocks = 15;
  for (let i = 0; i < num; i++) {
    let x = Math.random() * (2 * areaSize) - areaSize;
    let y = Math.random() * (2 * areaSize) - areaSize;
    this.decors.push(new Entity(14, 10, x, y, 0, types.BIGROCK));
  }

  num = 15;
  for (let i = 0; i < num; i++) {
    let x = Math.random() * (2 * areaSize) - areaSize;
    let y = Math.random() * (2 * areaSize) - areaSize;
    this.decors.push(new Entity(14, 14, x, y, 0, types.STUMP));
  }

  num = 10;
  for (let i = 0; i < num; i++) {
    let x = Math.random() * (2 * areaSize) - areaSize;
    let y = Math.random() * (2 * areaSize) - areaSize;
    this.decors.push(new Entity(10, 9, x, y, 0, types.BIGMUSH));
  }

  num = 25;
  for (let i = 0; i < num; i++) {
    let x = Math.random() * (2 * areaSize) - areaSize;
    let y = Math.random() * (2 * areaSize) - areaSize;
    this.decors.push(new Entity(7, 7, x, y, 0, types.SMALLMUSH));
  }

  this.update = function(delta, t) {
    // Update each rock based on game delta time
    this.decors.forEach(rock => {
      rock.update(delta);
    });
  }
}
