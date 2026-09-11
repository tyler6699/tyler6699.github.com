// One renderer keeps the creator preview and island character identical.
window.islandAvatar = (() => {
  const options = {
    body: ['Classic', 'Slim', 'Athletic', 'Broad', 'Round'],
    shoes: ['Classic', 'Trainers', 'Boots', 'Sandals', 'Barefoot'],
    shoeColor: ['Brown', 'Black', 'White', 'Red', 'Blue', 'Pink'],
    hatColor: ['Straw', 'Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Purple'],
    skin: ['Porcelain', 'Peach', 'Golden', 'Tan', 'Brown', 'Deep'],
    hair: ['Short', 'Bob', 'Long', 'Curly', 'Bald', 'Buzz cut', 'Spiky', 'Ponytail', 'Bun', 'Afro'],
    hairColor: ['Black', 'Dark brown', 'Brown', 'Light brown', 'Blonde', 'Auburn', 'Ginger', 'Grey', 'White'],
    eyes: ['Round', 'Almond', 'Sleepy', 'Wide', 'Happy', 'Lashes', 'Focused', 'Dot'],
    eyeColor: ['Brown', 'Blue', 'Green', 'Gray', 'Hazel', 'Amber', 'Dark brown'],
    nose: ['Button', 'Round', 'Pointed', 'Small', 'Wide', 'Upturned'],
    mouth: ['Smile', 'Grin', 'Neutral', 'Surprised', 'Smirk', 'Pout'],
    clothes: ['T-shirt', 'Overalls', 'Striped shirt', 'Jacket', 'Vest', 'Pocket tee', 'Sundress', 'Striped dress', 'Party dress'],
    shirtColor: ['Cream', 'Ocean', 'Coral', 'Lilac', 'Leaf'],
    trousers: ['Navy', 'Sand', 'Charcoal'],
    bottoms: ['Trousers', 'Shorts', 'Cargo shorts', 'Skirt', 'Pleated skirt', 'Long skirt'],
    hat: ['None', 'Straw hat', 'Cap', 'Beanie', 'Bucket hat', 'Beret', 'Top hat']
  };
  const colors = {
    shoeColor: ['#493e34','#252831','#f2eee1','#bd5451','#4b7caa','#cc88a1'],
    hatColor: ['#f4dfa8','#252831','#f2eee1','#bd5451','#4b7caa','#64895b','#cc88a1','#9982bc'],
    skin: ['#f7dac3','#edb991','#d6a16b','#b77b51','#875438','#57392e'],
    hairColor: ['#201d1c','#3b2923','#704832','#a77b52','#e4c477','#843e2b','#c77436','#969695','#e5e2da'],
    eyeColor: ['#503527','#387899','#3c7953','#69777e','#858044','#b77c2f','#2e211d'],
    shirtColor: ['#f8e6ba','#4c98af','#dc816b','#a897c8','#7da969'],
    trousers: ['#314950','#bea880','#414047']
  };
  for(const key of ['clothesAccent','bottomsAccent','shoesAccent','hatAccent']){
    options[key]=['Cream','Black','White','Red','Blue','Green','Pink','Gold'];
    colors[key]=['#fff0ce','#252831','#f2eee1','#bd5451','#4b7caa','#64895b','#cc88a1','#c5a35a'];
  }
  const look = Object.fromEntries(Object.keys(options).map(key=>[key,0]));
  look.skin=1;look.hairColor=1;look.clothes=1;
  const customColors={};
  function draw(c,x,y,scale=1,step=0,swing=0,facing=1,direction='down') {
    const back=direction==='up', side=direction==='left'||direction==='right';
    const build=[{width:1,shoulders:12,hips:10},{width:.82,shoulders:11,hips:9},{width:1.08,shoulders:14,hips:9},{width:1.22,shoulders:13,hips:11},{width:1.12,shoulders:12,hips:13}][look.body];
    const color=key=>customColors[key]||colors[key][look[key]];
    const bareLegs=look.bottoms!==0||look.clothes>=6;
    const oval=(x,y,rx,ry,fill)=>{c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();};
    const rect=(x,y,w,h,fill)=>{c.fillStyle=fill;c.fillRect(x,y,w,h);};
    const line=(points,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
    function shoe(x,y){
      if(look.shoes===4){oval(x,y,4.5,2.5,color('skin'));return;}
      if(look.shoes===2)rect(x-3,y-6,6,6,color('shoeColor'));
      oval(x,y,5,2.5,look.shoes===3?color('skin'):color('shoeColor'));
      if(look.shoes===1){line([[x-4,y+1.5],[x+4,y+1.5]],color('shoesAccent'),1.3);line([[x-1,y-1],[x+1,y-1]],color('shoesAccent'),1);}
      if(look.shoes===3){line([[x-3,y+1],[x+3,y+1]],color('shoesAccent'),1.5);line([[x-1,y-2],[x+1,y+1]],color('shoeColor'),2);}
    }
    c.save();c.translate(x,y);c.scale(scale,scale);
    // Side views share a profile, mirrored for leftward movement.
    if(direction==='left')c.scale(-1,1);
    if(side)c.scale(.8,1);
    oval(0,3,15,6,'#173c3b44');
    if(look.hair===2)oval(0,-29,14,21,color('hairColor'));
    c.save();c.scale(build.width,1);
    if(side){
      // Both legs share a hip in profile and swing along the walking direction.
      for(const [stride,far] of [[-step,true],[step,false]]){
        const footX=stride*1.6,footY=2-Math.max(0,stride)*.55;
        line([[0,-10],[footX*.5,-4],[footX,footY]],color(bareLegs?'skin':'trousers'),6);
        if(look.bottoms===1||look.bottoms===2)line([[0,-10],[footX*.5,-4]],color('trousers'),7);
        shoe(footX+2,footY);
        if(far){line([[0,-10],[footX*.5,-4],[footX,footY]],'#00000022',6);}
      }
    }else{
      rect(-9,-9+step,7,12,color(bareLegs?'skin':'trousers'));rect(3,-9-step,7,12,color(bareLegs?'skin':'trousers'));
      if(look.bottoms===1||look.bottoms===2){rect(-9,-9+step,7,6,color('trousers'));rect(3,-9-step,7,6,color('trousers'));}
      shoe(-6,3+step);shoe(7,3-step);
    }
    c.save();if(side)c.scale(.62,1);
    oval(0,-16,build.hips+2,12,color('shirtColor'));
    c.fillStyle=color('shirtColor');c.beginPath();c.moveTo(-build.shoulders,-24);c.quadraticCurveTo(0,-29,build.shoulders,-24);c.lineTo(build.hips,-8);c.quadraticCurveTo(0,-4,-build.hips,-8);c.closePath();c.fill();
    if(look.clothes===1){rect(-8,-25,4,17,color('clothesAccent'));rect(4,-25,4,17,color('clothesAccent'));rect(-8,-16,16,9,color('clothesAccent'));if(!back){oval(-6,-17,1,1,'#e6ce85');oval(6,-17,1,1,'#e6ce85');}}
    if(look.clothes===2)for(let y=-23;y<-8;y+=5)rect(-10,y,20,2,color('clothesAccent'));
    if(look.clothes===3&&!back){rect(-2,-25,4,18,color('clothesAccent'));line([[-7,-25],[-3,-20],[-2,-25]],color('clothesAccent'));line([[7,-25],[3,-20],[2,-25]],color('clothesAccent'));rect(-8,-13,4,2,'#00000033');rect(4,-13,4,2,'#00000033');}
    if(look.clothes===4){rect(-10,-24,6,17,color('clothesAccent'));rect(4,-24,6,17,color('clothesAccent'));if(back)rect(-5,-24,10,17,color('clothesAccent'));}
    if(look.clothes===5&&!back){rect(side?2:3,-21,5,6,color('clothesAccent'));line([[side?2:3,-21],[side?7:8,-21]],color('clothesAccent'));}
    if(look.clothes<6&&look.bottoms>0){
      const waist=build.hips,hem=waist+(look.bottoms>=3?4:0),bottom=look.bottoms===5?2:-2;
      if(look.bottoms>=3){
        c.save();c.beginPath();c.moveTo(-waist,-12);c.lineTo(waist,-12);c.lineTo(hem,bottom);c.quadraticCurveTo(0,bottom+2,-hem,bottom);c.closePath();c.fillStyle=color('trousers');c.fill();c.clip();
        if(look.bottoms===4)for(let x=-12;x<=12;x+=4)line([[x*.65,-12],[x,bottom+2]],color('bottomsAccent'),1);
        if(look.bottoms===5)line([[-hem,0],[hem,0]],color('bottomsAccent'),1);
        c.restore();
      }else{
        rect(-waist,-11,waist*2,5,color('trousers'));
        if(look.bottoms===2){rect(-waist,-8,5,4,color('bottomsAccent'));rect(waist-5,-8,5,4,color('bottomsAccent'));}
      }
      line([[-waist,-11],[waist,-11]],'#00000022',1);
    }
    if(look.clothes>=6){
      // The skirt overlays the upper legs; feet and their walking motion stay visible.
      const waist=build.hips-2,hem=build.hips+(look.clothes===8?7:4);
      c.save();c.beginPath();c.moveTo(-waist,-16);c.lineTo(waist,-16);c.quadraticCurveTo(hem-1,-8,hem,-2);c.quadraticCurveTo(0,1,-hem,-2);c.quadraticCurveTo(-hem+1,-8,-waist,-16);c.closePath();c.fillStyle=color('shirtColor');c.fill();c.clip();
      if(look.clothes===7)for(let y=-13;y<1;y+=4)rect(-hem,y,hem*2,1.5,color('clothesAccent'));
      if(look.clothes===8){for(const x of [-6,0,6])line([[x*.6,-14],[x*1.8,-1]],color('clothesAccent'),1);rect(-hem,-3,hem*2,2,color('clothesAccent'));}
      c.restore();
      rect(-waist,-17,waist*2,2,color('clothesAccent'));
      if(!back){
        if(look.clothes===6){line([[-7,-24],[-5,-19]],color('clothesAccent'),2);line([[7,-24],[5,-19]],color('clothesAccent'),2);}
        if(look.clothes===8){oval(-2,-16,2.5,1.7,color('clothesAccent'));oval(2,-16,2.5,1.7,color('clothesAccent'));}
      }
    }
    c.restore();
    if(!side){oval(-build.shoulders-1,-17+step,3.5,7,color('skin'));oval(build.shoulders+1,-17-step,3.5,7,color('skin'));}
    else oval(0,-17+step,3.5,7,color('skin'));
    c.restore();
    // A larger, rounder head keeps every hairstyle and hat aligned with the face.
    c.save();c.translate(0,-24);c.scale(1.14,1.04);c.translate(0,24);
    oval(-10,-34,2.5,3.2,color('skin'));oval(10,-34,2.5,3.2,color('skin'));oval(0,-35,11.5,12,color('skin'));
    if(look.hair!==4){
      oval(0,look.hair===5?-45:-44,look.hair===5?10:12,look.hair===5?3:6,color('hairColor'));
      if(look.hair===0){oval(-7,-41,5,5,color('hairColor'));oval(4,-45,8,4,color('hairColor'));}
      if(look.hair===1||look.hair===2){oval(-10,-37,3,look.hair===2?14:9,color('hairColor'));oval(10,-37,3,look.hair===2?14:9,color('hairColor'));}
      if(look.hair===3)for(let i=0;i<7;i++)oval(-11+i*3.6,-44-Math.sin(i/6*Math.PI)*3,4,4,color('hairColor'));
    }
    if(back&&look.hair!==4){
      oval(0,look.hair===2?-32:-37,look.hair===5?10:12,look.hair===2?20:look.hair===1?14:look.hair===5?8:10,color('hairColor'));
      if(look.hair===3)for(let i=0;i<5;i++)oval(-9+i*4.5,-32,4,4,color('hairColor'));
    }
    if(side){
      // Hair covers the rear of the head; one eye and a silhouette nose face forward.
      if(look.hair!==4)oval(-6,-37,look.hair===5?4:7,look.hair===2?17:look.hair===5?7:10,color('hairColor'));
      oval(-2,-34,2.5,4,color('skin'));
      oval(10,look.nose===5?-32:-31,[2,3,4,1,3.5,2.5][look.nose],[1.5,2.3,1.5,1,2.5,1.5][look.nose],color('skin'));
    }
    if(look.hair===6){
      for(let i=0;i<5;i++){const x=-13.5+i*5;c.fillStyle=color('hairColor');c.beginPath();c.moveTo(x,-43);c.lineTo(x+3.5,-55-(i%2)*3);c.lineTo(x+7,-43);c.fill();}
    }
    if(look.hair===7){const x=side?-14:back?0:-12;oval(x,-33,5,15,color('hairColor'));oval(x,-45,3,2,'#d6b975');}
    if(look.hair===8){oval(side?-8:0,-51,7,7,color('hairColor'));line([[side?-13:-5,-48],[side?-3:5,-48]],'#d6b975',2);}
    if(look.hair===9){
      if(back)oval(0,-38,15,15,color('hairColor'));
      for(let i=0;i<9;i++){const a=Math.PI+i/8*Math.PI;oval(Math.cos(a)*12,-40+Math.sin(a)*12,6,6,color('hairColor'));}
    }
    if(!back){
    // Translucent blush blends with every selected skin tone.
    for(const cheek of side?[7]:[-7,7])oval(cheek,-30,2.8,1.3,'#ef88915c');
    for(const x of side?[6]:[-4.5,4.5]){
      if(look.eyes===2)line([[x-2,-35],[x+2,-35]],color('eyeColor'),1.2);
      else if(look.eyes===4)line([[x-2,-34],[x,-36],[x+2,-34]],color('eyeColor'),1.2);
      else if(look.eyes===7)oval(x,-35,1.2,1.6,color('eyeColor'));
      else {
        const height=look.eyes===3?3.6:look.eyes===0?3.1:look.eyes===6?1.4:2.1;
        oval(x,-35,look.eyes===3?3.1:2.7,height,'#fff4df');oval(x,-35,1.8,Math.min(2.6,height),color('eyeColor'));
        oval(x,-34.9,.8,Math.min(1.6,height),'#171b24');oval(x-.55,-36,.7,.8,'#fff');oval(x+.65,-34.2,.35,.4,'#ffffffcc');
        if(look.eyes===5){line([[x-2,-36],[x-3,-38]],'#000000');line([[x,-37],[x,-39]],'#000000');line([[x+2,-36],[x+3,-38]],'#000000');}
        if(look.eyes===6)line([[x-2,-38],[x+2,-37]],color('hairColor'),1.3);
      }
    }
    c.save();if(side)c.translate(7,0);
    if(look.nose===0)oval(0,-31,1.4,1,'#603c354d');
    if(look.nose===1)oval(0,-31,2.2,1.8,'#603c355c');
    if(look.nose===2)line([[0,-34],[2,-30],[-.5,-30]],'#603c3577',1);
    if(look.nose===3)oval(0,-31,.7,.7,'#603c3577');
    if(look.nose===4){oval(0,-31,3,1.5,'#603c355c');oval(-1.5,-30.5,.5,.5,'#603c3577');oval(1.5,-30.5,.5,.5,'#603c3577');}
    if(look.nose===5)line([[-1.5,-31],[0,-32.5],[1.5,-31]],'#603c3577',1);
    if(look.mouth===0){c.strokeStyle='#743f3b';c.lineWidth=1;c.beginPath();c.arc(0,-29,3,0,Math.PI);c.stroke();}
    if(look.mouth===1){oval(0,-27.5,3.5,2,'#743f3b');rect(-2.5,-29,5,1.5,'#fff4df');}
    if(look.mouth===2)line([[-2,-27],[2,-27]],'#743f3b',1);
    if(look.mouth===3)oval(0,-27.5,1.7,2.2,'#743f3b');
    if(look.mouth===4)line([[-2.5,-27],[0,-27],[3,-29]],'#743f3b',1.2);
    if(look.mouth===5){oval(0,-27,2.5,1.2,'#ad6866');line([[-2,-27],[2,-27]],'#743f3b',.7);}
    c.restore();
    }
    if(look.hat===1){oval(0,-47,17,5,color('hatColor'));oval(0,-50,11,7,color('hatColor'));rect(-10,-49,20,2,color('hatAccent'));}
    if(look.hat===2){oval(0,-46,12,7,color('hatColor'));if(!back)oval(side?11:5,-43,side?10:13,2.5,color('hatColor'));else{rect(-4,-44,8,2,color('hatAccent'));}}
    if(look.hat===3){oval(0,-46,12,9,color('hatColor'));rect(-12,-46,24,5,color('hatColor'));line([[-10,-43],[10,-43]],color('hatAccent'));oval(0,-56,3,3,color('hatColor'));}
    if(look.hat===4){rect(-11,-53,22,10,color('hatColor'));oval(0,-43,16,4,color('hatColor'));line([[-10,-46],[10,-46]],color('hatAccent'),1.5);}
    if(look.hat===5){oval(side?-3:3,-49,15,6,color('hatColor'));rect(-10,-46,20,3,color('hatAccent'));line([[3,-53],[4,-57]],color('hatAccent'),2);}
    if(look.hat===6){oval(0,-45,16,3,color('hatColor'));rect(-10,-63,20,18,color('hatColor'));rect(-10,-49,20,3,color('hatAccent'));}
    c.restore();
    if(swing){c.rotate(-swing*5*(side?1:facing));line([[13,-16],[30,-39]],'#926642',4);rect(23,-41,15,8,'#c5d4cc');}
    c.restore();
  }
  const preview=document.querySelector('#avatar-preview'),p=preview.getContext('2d');
  function refresh(){p.clearRect(0,0,400,360);p.fillStyle='#85ad76';p.beginPath();p.ellipse(200,302,116,27,0,0,7);p.fill();draw(p,200,292,4);}
  const categories=[
    {name:'Body',style:'body'},
    {name:'Hair',style:'hair',color:'hairColor'},
    {name:'Skin',color:'skin'},
    {name:'Eyes',style:'eyes',color:'eyeColor'},
    {name:'Nose',style:'nose'},
    {name:'Mouth',style:'mouth'},
    {name:'Clothes',style:'clothes',color:'shirtColor',secondary:'clothesAccent'},
    {name:'Trousers',style:'bottoms',color:'trousers',secondary:'bottomsAccent'},
    {name:'Shoes',style:'shoes',color:'shoeColor',secondary:'shoesAccent'},
    {name:'Hat',style:'hat',color:'hatColor',secondary:'hatAccent'}
  ];
  const nav=document.querySelector('#appearance-nav'),panel=document.querySelector('#appearance-options');
  let active=0;
  function renderChoices(){
    const category=categories[active];
    document.querySelector('#category-title').textContent=category.name;
    panel.setAttribute('aria-labelledby','category-'+active);
    panel.replaceChildren();
    if(category.style){
      const grid=document.createElement('div');grid.className='wardrobe-choices';
      options[category.style].forEach((name,i)=>{
        const button=document.createElement('button');button.type='button';button.className='wardrobe-item';button.setAttribute('aria-pressed',String(look[category.style]===i));
        const thumbnail=document.createElement('canvas');thumbnail.width=180;thumbnail.height=190;thumbnail.setAttribute('aria-hidden','true');
        const original=look[category.style];
        try{look[category.style]=i;draw(thumbnail.getContext('2d'),90,172,2.5);}finally{look[category.style]=original;}
        const caption=document.createElement('span');caption.textContent=name;button.append(thumbnail,caption);
        button.onclick=()=>{look[category.style]=i;refresh();Array.from(grid.children).forEach((item,index)=>item.setAttribute('aria-pressed',String(index===i)));};grid.append(button);
      });
      panel.append(grid);
    }
    for(const key of [category.color,category.secondary].filter(Boolean)){
      const label=document.createElement('label');label.className='category-color';label.textContent=category.secondary?(key===category.secondary?'Secondary colour':'Primary colour'):category.name+' colour';
      const input=document.createElement('input');input.type='color';input.name=key;input.value=customColors[key]||colors[key][look[key]];input.className='appearance-color';
      const swatches=[];
      function updateColour(){customColors[key]=input.value;refresh();swatches.forEach((button,i)=>button.setAttribute('aria-pressed',String(input.value.toLowerCase()===colors[key][i])));if(category.style){const original=look[category.style];try{Array.from(panel.querySelectorAll('.wardrobe-item canvas')).forEach((canvas,i)=>{look[category.style]=i;const c=canvas.getContext('2d');c.clearRect(0,0,180,190);draw(c,90,172,2.5);});}finally{look[category.style]=original;}}}
      input.addEventListener('input',updateColour);
      label.append(input);panel.append(label);
      if(colors[key]){
        const palette=document.createElement('div');palette.className='hair-palette';palette.setAttribute('role','group');palette.setAttribute('aria-label','Common '+category.name.toLowerCase()+' colours');
        colors[key].forEach((hex,i)=>{const button=document.createElement('button');button.type='button';button.className='hair-swatch';button.setAttribute('aria-label',options[key][i]);button.title=options[key][i];button.setAttribute('aria-pressed',String(input.value.toLowerCase()===hex));const chip=document.createElement('span');chip.className='hair-chip';chip.style.backgroundColor=hex;const caption=document.createElement('span');caption.textContent=options[key][i];button.append(chip,caption);button.onclick=()=>{look[key]=i;input.value=hex;updateColour();};swatches.push(button);palette.append(button);});
        panel.append(palette);
      }

    }
  }
  function selectCategory(index){active=index;Array.from(nav.children).forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===active));tab.tabIndex=i===active?0:-1;});renderChoices();}
  categories.forEach((category,index)=>{
    const tab=document.createElement('button');tab.type='button';tab.id='category-'+index;tab.textContent=category.name;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','appearance-options');tab.onclick=()=>selectCategory(index);
    tab.onkeydown=e=>{let next=index;if(e.key==='ArrowRight')next=(index+1)%categories.length;else if(e.key==='ArrowLeft')next=(index+categories.length-1)%categories.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=categories.length-1;else return;e.preventDefault();selectCategory(next);nav.children[next].focus();};nav.append(tab);
  });
  document.querySelector('#randomize').onclick=()=>{for(const key in options){look[key]=Math.floor(Math.random()*options[key].length);delete customColors[key];}renderChoices();refresh();};
  selectCategory(0);
  refresh();
  return {draw};
})();





