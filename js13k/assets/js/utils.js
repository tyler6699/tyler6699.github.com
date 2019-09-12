function heroOnIce (hero, ice){
  if(ice.entity != null){
    return rectColiding(hero.entity.x, hero.entity.y + 20, hero.entity.width, hero.entity.height, ice.entity.x, ice.entity.y, ice.entity.width, ice.entity.height);
  } else {
    return false;
  }
}

function getAlhpa(time){
  var pi = 3.14;
  var frequency = 25;
  return 0.5*(1+Math.sin(2 * pi * frequency * time));
}

function heroColliding(e){
  return hero.hbX < e.entity.x + e.entity.width &&
  hero.hbX > e.entity.x &&
  hero.hbY < e.entity.y + e.entity.height &&
  hero.hbY > e.entity.y
}

function entityColiding(e1, offset1, e2, offset2){
  return rectColiding(e1.x + offset1/2, e1.y + offset1/2, e1.width - offset1, e1.height - offset1,
                      e2.x + offset2/2, e2.y + offset2/2, e2.width - offset2, e2.height - offset2)
}

function rectColiding(rx, ry, rw, rh, r2x, r2y, r2w, r2h){
  return (rx < r2x + r2w &&
     rx + rw > r2x &&
     ry < r2y + r2h &&
     ry + rh > r2y)
}

function getSeconds(ms){
  return (ms/1000).toFixed(1);
}

function getSecondsFixed(ms, x){
  return (ms/1000).toFixed(x);
}

const fillMixedText = (ctx, args, x, y) => {
  let defaultFillStyle = ctx.fillStyle;
  let defaultFont = ctx.font;
  ctx.save();
  args.forEach(({ text, fillStyle, font }) => {
    ctx.fillStyle = fillStyle || defaultFillStyle;
    ctx.font = font || defaultFont;
    ctx.fillText(text, x, y);
    x += ctx.measureText(text).width;
  });
  ctx.restore();
};
