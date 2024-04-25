function drawCountdown(ctx, elapsedTime, totalTime) {
  const centerX = 400;
  const centerY = 35;
  const radius = 30;

  // Calculate the angle for the countdown
  angle = (Math.PI * 2) * (elapsedTime / totalTime);
  if (elapsedTime >= totalTime) angle=Math.PI * 2;

  // Draw the full circle background (time passed)
  ctx.beginPath();
  ctx.fillStyle = colour == 1 ? '#a6f1c8':'#ffb3a6'; // Color of the elapsed time
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  // Draw the countdown part (remaining time)
  ctx.beginPath();
  ctx.fillStyle = 'white'; // Color of the remaining time
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, angle - Math.PI / 2, false);
  ctx.closePath();
  ctx.fill();

  // Draw the hand
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(
      centerX + radius * Math.cos(angle - Math.PI / 2),
      centerY + radius * Math.sin(angle - Math.PI / 2)
  );
  ctx.strokeStyle = colour == 1 ? '#589572':'#f8847c';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawBar(ctx, hp, maxHp, colour, border, backcol, yOff) {
    ctx.save();
    ctx.translate(0,yOff);
    const hpBarWidth = 200;
    const hpBarHeight = 20;
    const margin = 10;

    // Draw the black background of the HP bar
    ctx.fillStyle = border;
    ctx.fillRect(margin, margin, hpBarWidth, hpBarHeight);

    // Calculate the width of the red inner HP bar based on current health
    const hpPercentage = hp / maxHp;
    const redBarWidth = hpBarWidth * hpPercentage;

    ctx.fillStyle = backcol;
    ctx.fillRect(margin+2, margin+2, hpBarWidth-4, hpBarHeight-4);

    ctx.fillStyle = colour;
    ctx.fillRect(margin+2, margin+2, redBarWidth-4, hpBarHeight-4);

    // Set text properties
   ctx.font = '14px Arial';
   ctx.fillStyle = 'black';
   ctx.textAlign = 'center';
   ctx.textBaseline = 'middle';

   // Calculate text position
   const textX = margin + hpBarWidth / 2;
   const textY = margin + hpBarHeight / 2;

   // Draw text (current HP and max HP)
   ctx.fillText(`${hp} / ${maxHp}`, textX, textY);

   ctx.restore();
}

// Useful Functions and classes
function rectanlge(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

function rndNo(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function vec2(x,y){
  this.x = x;
  this.y = y;

  this.set = function(x,y) {
    this.x = x;
    this.y = y;
  }
}

function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

function getResponsiveFontSize(percent) {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  // You might want to adjust the scaling factor (0.1) to get the best size for your design.
  return Math.round(vw * percent); // This sets the font size to 10% of the viewport width.
}

function drawBox(ctx,a,colour,x,y,w,h) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = a;
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function writeTxt(ctx,a,font,colour,txt,x,y) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = a;
  ctx.font = font;
  ctx.fillStyle = colour;

  ctx.fillText(txt, x, y);
  ctx.restore();
}

function writeCentre(ctx, text, font, x, y) {
  ctx.font = font;
  let textWidth = ctx.measureText(text).width;
  let centeredX = x - (textWidth / 2);
  writeStroke(ctx, 1, font, "BLACK", text, centeredX, y, 12);
  writeTxt(ctx, 1, font, "WHITE", text, centeredX, y);
}

function writeStroke(ctx,a,font,colour,txt,x,y, strokeW) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = a;
  ctx.font = font;
  ctx.fillStyle = colour;
  ctx.strokeStyle = colour; // Color of the stroke
  ctx.lineWidth = strokeW; // Width of the stroke
  ctx.strokeText(txt, x, y);
  ctx.restore();
}

function knockback(hero, src, amt) {
    // calculate direction based on position of damage source and hero's position
    let dx = hero.e.x > src.x ? 1 : -1;
    let dy = hero.e.y > src.y ? 1 : -1;

    // apply knockback
    hero.e.x += dx * amt;
    hero.e.y += dy * amt;
}

const fontMap = {
    '0': [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ],
    '1': [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0]
    ],
    '2': [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1]
    ],
    '3': [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ]
};


   function drawNumber(x, y, number, scale) {
       for (let i = 0; i < fontMap[number].length; i++) {
           for (let j = 0; j < fontMap[number][i].length; j++) {
               if (fontMap[number][i][j] === 1) {
                   ctx.fillStyle = 'white';
                   ctx.fillRect(x + j * scale, y + i * scale, scale, scale);
               }
           }
       }
   }

   function displayFPS(fps) {
     mg.context.fillStyle = "yellow";
     mg.context.font = "16px Arial";
     mg.context.fillText("FPS: " + fps.toFixed(2), nativeWidth-100, 20);
   }

   function displayEnemyCount(n) {
     mg.context.fillStyle = "white";
     mg.context.font = "16px Arial";
     mg.context.fillText("Mobs: " + n, nativeWidth-100, 90);
     mg.context.fillText("Speed: " + cart.hero.e.speed, nativeWidth-100, 110);
     mg.context.fillText("Spin: " + cart.attacks.rotateSpeed, nativeWidth-100, 130);
     mg.context.fillStyle = "black";
     mg.context.fillText("WAVE: " + cart.wave, nativeWidth-100, 50);
     mg.context.fillText("TIME: " + cart.waveEnd, nativeWidth-100, 70);
   }

   function drawHeroBox(x, y, width, height, borderRadius, colour) {
     ctx.save();
     ctx.scale(3,3)
     // Set shadow properties
     ctx.shadowColor = colour == 1 ? '#3CB371':'#f67c84';
     ctx.shadowBlur = 10;
     ctx.shadowOffsetX = 5;
     ctx.shadowOffsetY = 5;

    // Box fill color
    ctx.fillStyle = 'white';
    ctx.fill();

    // Box stroke color
    ctx.strokeStyle = colour == 1 ? '#3CB371':'#ffb3a6';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.roundRect(50, 45, 150, 90, 40);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}

function partDir(p) {
  var angle = rndNo(0, 360) * Math.PI / 180;
  var value = rndNo(50, 180);
  var radius = [-1, 1][rndNo(0, 1)] * value;
  return {
    x: p.x + radius * Math.cos(angle),
    y: p.y + radius * Math.sin(angle)
  }
}

function ranColor() {
  let l = '0123456789ABCDEF';
  let c = '#';
  for (var i = 0; i < 6; i++) {
    c += l[Math.floor(Math.random() * 16)];
  }
  return c;
}
