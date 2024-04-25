function Intro(){
  this.arrow=new Entity(11, 12, 100, 60, 0, types.ARROW);
  let delay=0;
  let selectDelay=0;
  let offset=0;

  this.update = function(delta) {
    let fontSize=getResponsiveFontSize(.05);
    mg.clear();
    ctx.save();
    drawBox(ctx,0.8,"black",0,0,canvasW,canvasH)

    // BACKGROUND STRIPES
    var colors=['#a8f2cb', '#88e4b0'];
    const stripeWidth = 50; // width of each stripe
    if(colour==1){
      colors = ['#a8f2cb', '#88e4b0']; // two-tone greens,
    } else {
      colors = ['#ffb3a6', '#ff9e9a']; // two-tone pinks
    }

    let colorIndex = 0;

    // Calculate the number of stripes needed to fill the screen diagonally
    const numStripes = Math.ceil(Math.sqrt(ctx.canvas.width**2 + ctx.canvas.height**2) / stripeWidth);

   for (let i = -numStripes; i < numStripes + 10; i++) {
     ctx.fillStyle = colors[i % 2];
     ctx.beginPath();
     ctx.moveTo((i * stripeWidth) + offset, 0);
     ctx.lineTo((i + 1) * stripeWidth + offset, 0);
     ctx.lineTo((i + 1) * stripeWidth + offset - ctx.canvas.height, ctx.canvas.height);
     ctx.lineTo((i * stripeWidth) + offset - ctx.canvas.height, ctx.canvas.height);
     ctx.closePath();
     ctx.fill();
  }

    offset -= .5; // Change the speed of the stripe movement by adjusting this value
     if (offset <= -stripeWidth*2) {
         offset = 0;
     }

    let font=`${fontSize}px Arial`;
    writeStroke(ctx, 1, font,"Black","Pixel Power - CarelessLabs", 30, canvasH*.1,12);
    writeTxt(ctx, 1, font,"WHITE","Pixel Power - CarelessLabs", 30, canvasH*.1);
    font=`${fontSize-15}px Arial`;

    if (delay <= 0) {
      if (up()) {
        delay = 0.3;
        charSet--;
      } else if (down()) {
        delay = 0.3;
        charSet++;
      }

      if(t()){ // colour swapper
        colour = (colour + 1) % 2;
        delay = 0.3;
      }
    }

    charSet = (charSet + 3) % 3;

    drawHeroBox(0, 0, 300, 300, 15, colour);

    if (charSet == 0) {
      this.arrow.y = 100;
      writeStroke(ctx, 1, font, "BLACK", "Select Hair (Left / Right)", 30, canvasH*.2,6);
      writeTxt(ctx, 1, font, "WHITE", "Select Hair (Left / Right)", 30, canvasH*.2);
      if ((left() || right()) && delay <= 0) {
          delay = 0.3;
          const h = [types.HAIR1, types.HAIR2, types.HAIR3, types.HAIR4];
          cart.hero.hair.type = h[(h.indexOf(cart.hero.hair.type) + 1) % h.length];
          cart.hero.change = true;
      }
    } else if (charSet == 1) {
      this.arrow.y = 140;
      writeStroke(ctx, 1, font, "BLACK", "Select Head (Left / Right)", 30, canvasH*.2,6);
      writeTxt(ctx, 1, font, "WHITE", "Select Head (Left / Right)", 30, canvasH*.2);
      if ((left() || right()) && delay <= 0) {
          delay = 0.3;
          const t = [types.HEAD1, types.HEAD2, types.HEAD3];
          cart.hero.head.type = t[(t.indexOf(cart.hero.head.type) + 1) % t.length];
          cart.hero.change = true;
          if(cart.hero.head.type == types.HEAD3 || cart.hero.head.type == types.HEAD2){
            cart.hero.rHand.sx=16;
            cart.hero.rHand.sy=28;
            cart.hero.lHand.sx=16;
            cart.hero.lHand.sy=28;
          } else {
            cart.hero.rHand.sx=30;
            cart.hero.rHand.sy=9;
            cart.hero.lHand.sx=30;
            cart.hero.lHand.sy=9;
          }
      }
    } else if (charSet == 2) {
      this.arrow.y = 170;
      writeStroke(ctx, 1, font, "BLACK", "Select Clothes (Left / Right)", 30, canvasH*.2,6);
      writeTxt(ctx, 1, font, "WHITE", "Select Clothes (Left / Right)", 30, canvasH*.2);
      if ((left() || right()) && delay <= 0) {
          delay = 0.3;
          const t = [types.SUIT1, types.SUIT2, types.SUIT3];
          cart.hero.suit.type = t[(t.indexOf(cart.hero.suit.type) + 1) % t.length];
          cart.hero.change = true;
      }
    }

    delay-=delta;
    cart.hero.e.x=65;
    cart.hero.e.y=30;

    ctx.save();
    ctx.scale(3,3);
    cart.hero.update(delta);
    ctx.restore();

    ctx.save();
    ctx.scale(1.5,1.5);
    this.arrow.update(delta);
    ctx.restore();

    // Start Text
    let bottomOffset = 30;
    let viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    let textY = viewportHeight - bottomOffset; // Position text 30px above the bottom edge of the viewport
    writeCentre(ctx, "Space to Start", font, canvasW / 2, viewportHeight - bottomOffset)

    //writeStroke(ctx, 1, font,"Black","Space to Start", canvasH*.5, canvasH*.88,12);
    //writeTxt(ctx, 1, font,"WHITE","Space to Start",canvasH*.5, canvasH*.88);

    if(space()){
      gameStarted=true;
    }
  }
}
