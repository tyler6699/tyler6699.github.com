(() => {
  'use strict';
  const canvas = document.querySelector('#game'), ctx = canvas.getContext('2d');
  const mini = document.querySelector('#minimap').getContext('2d');
  const keys = new Set(), player = { x: 0, y: 100, step: 0, facing: 1, direction: 'down', name: 'Explorer' };
  const camera = { x: 0, y: 100 }, mouse = { x: -999, y: -999 };
  let w, h, time = 0, last = 0, paused = false, creating = true, swing = 0, hintTimer = 6;
  let seed = 137; const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const objects = [], tufts = [], particles = [], counts = { wood: 0, stone: 0, axe:0, pickaxe:0, planks:0, bricks:0 };
  const items={wood:['Wood','▰'],stone:['Stone','◆'],axe:['Stone axe','🪓'],pickaxe:['Stone pickaxe','⛏'],planks:['Wooden planks','▤'],bricks:['Stone bricks','▦']};
  function itemIcon(kind){
    const artwork={
      wood:'<path d="M9 33 36 17 49 32 23 49Z" fill="#87512e"/><path d="M9 33 12 23 37 9 48 16 49 32 23 47Z" fill="#ad7543"/><path d="m15 25 23-13 6 4-24 14" fill="#d39b5f"/><path d="m25 33 20-12m-18 20 18-10" stroke="#714629" stroke-width="2"/><ellipse cx="17" cy="37" rx="11" ry="13" transform="rotate(-32 17 37)" fill="#e2b477"/><ellipse cx="17" cy="37" rx="6" ry="8" transform="rotate(-32 17 37)" fill="none" stroke="#a87142" stroke-width="2"/><path d="m15 35 4 4" stroke="#9a6238" stroke-width="2"/>',
      stone:'<path d="m7 34 8-19 20-7 15 16-3 20-21 7-17-8Z" fill="#708688"/><path d="m15 15 20-7 8 18-18 5-18 3Z" fill="#c5d4cd"/><path d="m25 31 18-5 7-2-3 20-21 7Z" fill="#8fa5a4"/><path d="m15 20 11-5 5 1m-16 23 8 4" fill="none" stroke="#e4eadd" stroke-width="2"/><path d="m36 34-5 6 3 6" fill="none" stroke="#596f74" stroke-width="2"/>',
      axe:'<path d="m14 48 23-32" stroke="#503c2c" stroke-width="9" stroke-linecap="round"/><path d="m14 47 23-31" stroke="#b7824c" stroke-width="6" stroke-linecap="round"/><path d="m16 44 16-23" stroke="#e0b47a" stroke-width="2"/><path d="m25 14 9-6 16 8-2 15-15-5Z" fill="#8fa6a7"/><path d="m34 8 16 8-2 15-7-3 2-12Z" fill="#dce4dc"/><path d="m25 14 8 12 5-5-5-12Z" fill="#667e80"/><path d="m27 17 10 6m-12-3 9 6" stroke="#ddc18a" stroke-width="3"/>',
      pickaxe:'<path d="m15 49 24-34" stroke="#503c2c" stroke-width="8" stroke-linecap="round"/><path d="m15 48 23-32" stroke="#bb8950" stroke-width="5" stroke-linecap="round"/><path d="M9 18Q27-3 49 28L38 22Q26 12 9 18Z" fill="#a8bdb9"/><path d="M9 18Q26 8 38 22l11 6Q29 2 9 18" fill="#dbe4d9"/><path d="m27 11 9 10-4 4-9-10Z" fill="#647f82"/><path d="m26 18 7 5m-9-2 7 5" stroke="#dac18e" stroke-width="2"/>',
      planks:'<path d="m6 32 34-14 12 9-34 17Z" fill="#d5a56d"/><path d="m6 32 12 12v7L6 39Zm12 12 34-17v7L18 51Z" fill="#805331"/><path d="m5 20 33-13 13 8-33 16Z" fill="#e0b47a"/><path d="m5 20 13 11v7L5 27Zm13 11 33-16v7L18 38Z" fill="#a77343"/><path d="m14 20 20-8m-13 13 20-9m-18 22 20-9" stroke="#ae7949" stroke-width="1.5"/><ellipse cx="29" cy="19" rx="4" ry="1.5" transform="rotate(-24 29 19)" fill="none" stroke="#a16b3d"/>',
      bricks:'<path d="m5 33 17-8 15 7-18 9Z" fill="#c0c9c2"/><path d="m5 33 14 8v10L5 43Z" fill="#829595"/><path d="m19 41 18-9v10l-18 9Z" fill="#607c80"/><path d="m28 25 14-6 12 7-15 8Z" fill="#d0d7cd"/><path d="m28 25 11 9v11l-11-9Z" fill="#8d9e9c"/><path d="m39 34 15-8v10l-15 9Z" fill="#6c8589"/><path d="m13 15 18-8 15 8-18 9Z" fill="#dce0d4"/><path d="m13 15 15 9v10l-15-9Z" fill="#9baca6"/><path d="m28 24 18-9v10l-18 9Z" fill="#7b9394"/><path d="m17 17 8 4m6 6 10-5" stroke="#eef0e4" stroke-width="1.5"/>'
    };
    const icon=document.createElement('span');icon.className='item-art';icon.setAttribute('aria-hidden','true');
    if(artwork[kind])icon.innerHTML='<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="51" rx="22" ry="4" fill="#092d3544"/>'+artwork[kind]+'</svg>';
    return icon;
  }
  const recipes=[
    {id:'axe',wood:3,stone:3,description:'Chop trees in two hits. Select it on the action bar to use it.'},
    {id:'pickaxe',wood:3,stone:6,description:'Break rocks in two hits. Select it on the action bar to use it.'},
    {id:'planks',wood:3,stone:0,description:'A wooden building material. Stored for future building.'},
    {id:'bricks',wood:0,stone:3,description:'A stone building material. Stored for future building.'}
  ];
  function renderCrafting(){
    const list=document.querySelector('#recipes');list.replaceChildren();
    for(const recipe of recipes){
      const row=document.createElement('div');row.className='recipe';
      const info=document.createElement('div'),title=document.createElement('strong'),detail=document.createElement('p'),cost=document.createElement('small');
      title.textContent=items[recipe.id].join(' ');detail.textContent=recipe.description;
      cost.textContent=[recipe.wood?recipe.wood+' wood ('+counts.wood+' available)':null,recipe.stone?recipe.stone+' stone ('+counts.stone+' available)':null].filter(Boolean).join(' · ');
      info.append(title,detail,cost);const button=document.createElement('button');button.type='button';button.textContent='Craft';button.disabled=counts.wood<recipe.wood||counts.stone<recipe.stone;
      button.onclick=()=>{
        if(counts.wood<recipe.wood||counts.stone<recipe.stone)return;
        counts.wood-=recipe.wood;counts.stone-=recipe.stone;counts[recipe.id]++;
        document.querySelector('#wood').textContent=counts.wood;document.querySelector('#stone').textContent=counts.stone;
        pickedSlot=null;renderInventory();renderCrafting();document.querySelector('#craft-status').textContent='Crafted '+items[recipe.id][0]+'. Added to your inventory.';
      };row.append(info,button);list.append(row);
    }
  }
  function toggleCrafting(){
    if(creating||paused)return;
    if(!backpack.open){renderInventory();backpack.showModal();}
    keys.clear();const section=document.querySelector('#crafting');section.hidden=!section.hidden;document.querySelector('#show-crafting').setAttribute('aria-expanded',String(!section.hidden));renderCrafting();
  }
  const backpack=document.querySelector('#backpack');
  const inventoryOrder=Array(10).fill(null);
  let activeSlot=0;
  function syncInventory(){
    for(let i=0;i<inventoryOrder.length;i++)if(inventoryOrder[i]&&!counts[inventoryOrder[i]])inventoryOrder[i]=null;
    for(const kind of Object.keys(items))if(counts[kind]>0&&!inventoryOrder.includes(kind)){const empty=inventoryOrder.indexOf(null);if(empty>=0)inventoryOrder[empty]=kind;}
  }
  function selectedItem(){return inventoryOrder[activeSlot];}
  function renderActionBar(){
    syncInventory();const slots=document.querySelector('#action-slots');slots.replaceChildren();
    inventoryOrder.forEach((kind,index)=>{
      const button=document.createElement('button');button.type='button';button.className='action-slot';button.setAttribute('aria-pressed',String(index===activeSlot));
      button.setAttribute('aria-label','Slot '+((index+1)%10)+': '+(kind?items[kind][0]+', '+counts[kind]:'Empty'));
      const shortcut=document.createElement('small');shortcut.textContent=(index+1)%10;
      const icon=itemIcon(kind);
      const quantity=document.createElement('b');quantity.textContent=kind?counts[kind]:'';
      button.append(shortcut,icon,quantity);button.onclick=()=>{if(creating||paused||backpack.open)return;activeSlot=index;renderActionBar();canvas.focus();};slots.append(button);
    });
    const kind=selectedItem();document.querySelector('#action-selection').textContent=(kind?items[kind][0]:'Empty slot')+' · scroll or press 1–9 / 0';
  }
  canvas.addEventListener('wheel',e=>{if(creating||paused||backpack.open||!e.deltaY)return;e.preventDefault();activeSlot=(activeSlot+(e.deltaY>0?1:9))%10;renderActionBar();},{passive:false});
  let pickedSlot=null,drag=null,suppressClick=false;
  function moveInventoryItem(from,to){
    if(from===to||!inventoryOrder[from])return;
    [inventoryOrder[from],inventoryOrder[to]]=[inventoryOrder[to],inventoryOrder[from]];
    pickedSlot=null;renderInventory();
    document.querySelector('#inventory-slots').children[to].focus();
    document.querySelector('#inventory-detail').textContent='Item moved to slot '+(to+1)+'.';
  }
  function renderInventory(){
    syncInventory();renderActionBar();
    document.querySelector('#inventory-owner').textContent=player.name+"’s backpack";
    const slots=document.querySelector('#inventory-slots');slots.replaceChildren();
    inventoryOrder.forEach((kind,index)=>{
      const item=document.createElement('button');item.type='button';item.className='inventory-slot'+(kind?'':' empty-slot');item.dataset.slot=index;
      item.setAttribute('aria-label',kind?kind+', '+counts[kind]+', slot '+(index+1):'Empty slot '+(index+1));
      if(kind){
        const icon=itemIcon(kind);
        const label=document.createElement('span');label.textContent=items[kind][0];
        const quantity=document.createElement('b');quantity.textContent='×'+counts[kind];item.append(icon,label,quantity);
      }
      item.onclick=()=>{
        if(suppressClick){suppressClick=false;return;}
        if(pickedSlot!==null&&pickedSlot!==index){moveInventoryItem(pickedSlot,index);return;}
        pickedSlot=pickedSlot===index?null:kind?index:null;
        Array.from(slots.children).forEach((slot,i)=>slot.classList.toggle('picked',i===pickedSlot));
        document.querySelector('#inventory-detail').textContent=pickedSlot===null?'Drag an item to move it, or select an item and then a slot.':items[kind][0]+' — '+counts[kind]+' carried. Select another slot to move it.';
      };
      item.onpointerdown=e=>{if(!kind||e.button!==0)return;suppressClick=false;drag={from:index,x:e.clientX,y:e.clientY,moved:false};item.setPointerCapture(e.pointerId);};
      item.onpointermove=e=>{
        if(!drag||drag.from!==index)return;
        if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>6)drag.moved=true;
        if(!drag.moved)return;
        item.classList.add('dragging');
        const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-slot]');
        Array.from(slots.children).forEach(slot=>slot.classList.toggle('drop-target',slot===target));
      };
      item.onpointerup=e=>{
        if(!drag||drag.from!==index)return;
        const moved=drag.moved;drag=null;
        item.classList.remove('dragging');Array.from(slots.children).forEach(slot=>slot.classList.remove('drop-target'));
        if(!moved)return;
        suppressClick=true;
        const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-slot]');
        if(target&&slots.contains(target))moveInventoryItem(index,Number(target.dataset.slot));
        setTimeout(()=>{suppressClick=false;},0);
      };
      item.onpointercancel=()=>{drag=null;item.classList.remove('dragging');Array.from(slots.children).forEach(slot=>slot.classList.remove('drop-target'));};
      slots.append(item);
    });
    document.querySelector('#inventory-detail').textContent=inventoryOrder.some(Boolean)?'Drag items to move or swap them. You can also select an item, then a slot.':'Your backpack is empty. Click nearby trees and rocks to collect materials.';
    document.querySelector('#inventory-total').textContent=Object.values(counts).reduce((a,b)=>a+b,0)+' items carried';
    renderCrafting();
  }
  function toggleInventory(){if(creating||paused)return;keys.clear();if(backpack.open)backpack.close();else{renderInventory();backpack.showModal();}}
  document.querySelector('#open-inventory').onclick=toggleInventory;
  document.querySelector('#show-crafting').onclick=toggleCrafting;
  document.querySelector('#close-inventory').onclick=()=>backpack.close();
  backpack.addEventListener('close',()=>{document.querySelector('#crafting').hidden=true;document.querySelector('#show-crafting').setAttribute('aria-expanded','false');keys.clear();pickedSlot=null;drag=null;canvas.focus();});
  let islandShape='natural',pendingShape='natural';
  const landscape={trees:80,rocks:30,grass:1150,flowers:40,river:'none',width:30};
  const flowers=[];
  const riverX=y=>180+Math.sin(y/(landscape.river==='winding'?100:230))*(landscape.river==='winding'?85:28);
  const onBridge=(x,y)=>Math.abs(y-100)<23&&Math.abs(x-riverX(100))<landscape.width+22;
  const inRiver=(x,y,padding=0)=>landscape.river!=='none'&&Math.abs(x-riverX(y))<landscape.width+padding;
  document.querySelector('#island-form').onsubmit=e=>{
    e.preventDefault();islandShape=pendingShape;
    for(const [key,id] of [['grass','grass-density'],['flowers','flower-density'],['width','river-width']])landscape[key]=Number(document.getElementById(id).value);
    landscape.river=document.querySelector('#river-type').value;generateIsland();
    document.querySelector('#island-setup').hidden=true;document.querySelector('#creator').hidden=false;document.querySelector('#character-name').focus();
  };
  document.querySelector('#back-island').onclick=()=>{document.querySelector('#creator').hidden=true;document.querySelector('#island-setup').hidden=false;document.querySelector('#island-shapes button').focus();};
  document.querySelector('#creator').hidden=true;
  function radiusFor(shape,a){
    if(shape==='round')return 650+10*Math.sin(a*7);
    if(shape==='long')return 700/Math.sqrt(Math.cos(a)**2+2.8*Math.sin(a)**2);
    if(shape==='star')return 560+125*Math.cos(a*5-Math.PI/2);
    return 665+65*Math.sin(a*3+.8)+36*Math.cos(a*5)+22*Math.sin(a*9);
  }
  function shore(a){return radiusFor(islandShape,a);}
  const shapeList=document.querySelector('#island-shapes');
  for(const [shape,name] of [['natural','Natural'],['round','Round'],['long','Long'],['star','Star']]){
    const button=document.createElement('button');button.type='button';button.setAttribute('aria-pressed',String(shape===pendingShape));button.dataset.shape=shape;
    const preview=document.createElement('canvas');preview.width=120;preview.height=90;preview.setAttribute('aria-hidden','true');const p=preview.getContext('2d');
    for(const [offset,fill] of [[30,'#58ada8'],[0,'#e7d59a'],[-45,'#82b162']]){p.beginPath();for(let i=0;i<=120;i++){const a=i/120*Math.PI*2,r=radiusFor(shape,a)+offset;p.lineTo(60+Math.cos(a)*r*.073,45+Math.sin(a)*r*.073*.79);}p.closePath();p.fillStyle=fill;p.fill();}
    const label=document.createElement('span');label.textContent=name;button.append(preview,label);button.onclick=()=>{pendingShape=shape;Array.from(shapeList.children).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.shape===shape)));};shapeList.append(button);
  }
  function inland(x,y,margin=0) { return Math.hypot(x,y/.79) < shore(Math.atan2(y/.79,x))-margin; }
  function generateIsland(){
    seed=1+Math.floor(Math.random()*2147483646);landscape.trees=20+Math.floor(random()*26);landscape.rocks=20+Math.floor(random()*51);objects.length=0;tufts.length=0;particles.length=0;flowers.length=0;
    player.x=0;player.y=100;camera.x=0;camera.y=100;
    for(let i=0;i<landscape.grass;i++){const x=(random()-.5)*1500,y=(random()-.5)*1250;if(inland(x,y,50)&&!inRiver(x,y,12))tufts.push({x,y,s:random(),a:random()*6});}
    for(const [type,total] of [['tree',landscape.trees],['rock',landscape.rocks]]){
      let placed=0;for(let attempt=0;placed<total&&attempt<20000;attempt++){
        const x=(random()-.5)*1420,y=(random()-.5)*1150;
        if(!inland(x,y,85)||inRiver(x,y,48)||Math.hypot(x,y-100)<95||objects.some(o=>Math.hypot(o.x-x,o.y-y)<46))continue;
        objects.push({x,y,type,size:.8+random()*.45,hp:type==='tree'?3:4,hit:0,removed:false});placed++;
      }
    }
    for(let attempt=0;flowers.length<landscape.flowers&&attempt<10000;attempt++){
      const x=(random()-.5)*1420,y=(random()-.5)*1150;
      if(inland(x,y,65)&&!inRiver(x,y,15)&&!objects.some(o=>Math.hypot(o.x-x,o.y-y)<24))flowers.push({x,y,color:['#fff0cb','#efa4b8','#c4b0f0','#f5d36a'][Math.floor(random()*4)]});
    }
  }
  function drawRiver(){
    if(landscape.river==='none')return;
    ctx.save();
    // Clip the river to the shoreline before painting its banks and water.
    island(0,'#e7d59a');ctx.clip();island(-27,'#d9cb88');island(-45,'#87b667');island(-52,'#82b162');
    for(const [extra,color] of [[9,'#c7cf9c'],[4,'#58ada8'],[0,'#287e91']]){
      ctx.beginPath();for(let y=-800;y<=800;y+=8){const x=riverX(y);y===-800?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=color;ctx.lineWidth=(landscape.width+extra)*2;ctx.stroke();
    }
    const x=riverX(100),half=landscape.width+20;
    ctx.fillStyle='#735334';ctx.fillRect(x-half,77,half*2,46);
    for(let bx=x-half+2;bx<x+half;bx+=9){ctx.fillStyle='#c2935e';ctx.fillRect(bx,79,7,42);}
    ctx.strokeStyle='#e0b981';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-half,78);ctx.lineTo(x+half,78);ctx.moveTo(x-half,122);ctx.lineTo(x+half,122);ctx.stroke();ctx.restore();
  }
  generateIsland();
  function resize(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);}
  addEventListener('resize',resize);resize();
  function togglePause(){if(creating)return;paused=!paused;keys.clear();document.querySelector('#paused').hidden=!paused;document.querySelector('#pause').textContent=paused?'▶':'Ⅱ';document.querySelector('#pause').setAttribute('aria-label',paused?'Resume game':'Pause game');}
  document.querySelector('#pause').onclick=togglePause;document.querySelector('#resume').onclick=togglePause;
  addEventListener('keydown',e=>{if(creating)return;if(e.key.toLowerCase()==='c'){e.preventDefault();if(!e.repeat)toggleCrafting();return;}if(e.key.toLowerCase()==='e'){e.preventDefault();if(!e.repeat)toggleInventory();return;}if(backpack.open)return;if(!paused&&/^[0-9]$/.test(e.key)){e.preventDefault();activeSlot=(Number(e.key)+9)%10;renderActionBar();return;}if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(e.key==='Escape'&&!e.repeat)togglePause();keys.add(e.key.toLowerCase());});
  addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>keys.clear());
  document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key);});
  canvas.onpointermove=e=>{mouse.x=e.clientX;mouse.y=e.clientY;};
  function selected(){const x=mouse.x-w/2+camera.x,y=mouse.y-h/2+camera.y;return objects.filter(o=>!o.removed).sort((a,b)=>b.y-a.y).find(o=>Math.hypot((x-o.x)/(o.type==='tree'?40:29),(y-o.y+(o.type==='tree'?43:12))/(o.type==='tree'?58:27))<1.1);}
  function hint(message){document.querySelector('#hint').textContent=message;hintTimer=3;}
  canvas.onpointerdown=e=>{
    if(paused||creating||backpack.open)return;mouse.x=e.clientX;mouse.y=e.clientY;canvas.focus();const o=selected();swing=.23;
    if(!o)return;if(Math.hypot(o.x-player.x,o.y-player.y)>112){hint('A little closer — walk up to the tree or rock.');return;}
    o.hp-=((o.type==='tree'&&selectedItem()==='axe')||(o.type==='rock'&&selectedItem()==='pickaxe'))?2:1;o.hit=.22;const kind=o.type==='tree'?'wood':'stone';
    for(let i=0;i<8;i++)particles.push({x:o.x,y:o.y-20,vx:(random()-.5)*130,vy:-40-random()*100,life:.7,color:kind==='wood'?'#d4ab65':'#ced5cc'});
    if(o.hp<=0){o.removed=true;counts[kind]+=3;document.querySelector('#'+kind).textContent=counts[kind];renderActionBar();hint('+3 '+kind+' collected');}else {const hits=Math.ceil(o.hp/(((o.type==='tree'&&selectedItem()==='axe')||(o.type==='rock'&&selectedItem()==='pickaxe'))?2:1));hint((o.type==='tree'?'Chop':'Crack')+'! '+hits+' more '+(hits===1?'hit':'hits')+'.');}
  };
  function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
  function island(offset,color){ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<=180;i++){const a=i/180*Math.PI*2,r=shore(a)+offset;const x=Math.cos(a)*r,y=Math.sin(a)*r*.79;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fill();}
  function tree(o,highlight){ctx.save();ctx.translate(o.x+(o.hit?Math.sin(o.hit*90)*3:0),o.y);ctx.scale(o.size,o.size);ellipse(10,3,37,15,'#224d3533');ctx.fillStyle='#795838';ctx.fillRect(-7,-45,14,47);ctx.fillStyle='#aa8051';ctx.fillRect(-6,-44,5,42);const sway=Math.sin(time*1.2+o.x)*1.5;ctx.translate(sway,0);if(highlight){ctx.shadowColor='#fff2a6';ctx.shadowBlur=12;}ellipse(0,-54,33,35,'#246847');ellipse(-20,-51,24,25,'#28784a');ellipse(18,-61,25,28,'#328450');ellipse(-4,-77,29,27,'#42945a');ellipse(-13,-83,20,17,'#59a965');ctx.shadowBlur=0;ellipse(8,-64,12,9,'#4a9959');ctx.restore();}
  function rock(o,highlight){ctx.save();ctx.translate(o.x+(o.hit?Math.sin(o.hit*90)*2:0),o.y);ctx.scale(o.size,o.size);ellipse(5,3,27,11,'#244d3433');if(highlight){ctx.shadowColor='#fff2a6';ctx.shadowBlur=12;}ctx.fillStyle='#778e8c';ctx.beginPath();ctx.moveTo(-24,0);ctx.lineTo(-27,-16);ctx.lineTo(-12,-33);ctx.lineTo(9,-36);ctx.lineTo(25,-19);ctx.lineTo(26,-2);ctx.lineTo(7,8);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#a6b8ac';ctx.beginPath();ctx.moveTo(-27,-16);ctx.lineTo(-12,-33);ctx.lineTo(9,-36);ctx.lineTo(15,-20);ctx.lineTo(-5,-12);ctx.closePath();ctx.fill();ctx.strokeStyle='#c0cabb';ctx.beginPath();ctx.moveTo(-17,-23);ctx.lineTo(-9,-29);ctx.lineTo(4,-30);ctx.stroke();ctx.restore();}
  function character(){window.islandAvatar.draw(ctx,player.x,player.y,1,Math.sin(player.step)*3,swing,player.facing,player.direction);}
  function nameLabel(){ctx.save();ctx.font='600 12px Arial';ctx.textAlign='center';ctx.textBaseline='middle';const width=ctx.measureText(player.name).width+18;ctx.fillStyle='#123b40dd';ctx.fillRect(player.x-width/2,player.y-87,width,20);ctx.fillStyle='#fff3d6';ctx.fillText(player.name,player.x,player.y-77);ctx.restore();}
  function blocked(x,y){return !inland(x,y,20)||(inRiver(x,y,8)&&!onBridge(x,y))||objects.some(o=>!o.removed&&Math.hypot(x-o.x,y-o.y)<(o.type==='tree'?21:27)*o.size);}
  function draw(dt){
    time+=dt;hintTimer-=dt;swing=Math.max(0,swing-dt);document.querySelector('#hint').style.opacity=hintTimer>0?1:0;
    let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);
    const length=Math.hypot(dx,dy);if(length){player.direction=dy?(dy<0?'up':'down'):(dx<0?'left':'right');dx=dx/length*dt*185;dy=dy/length*dt*185;if(!blocked(player.x+dx,player.y))player.x+=dx;if(!blocked(player.x,player.y+dy))player.y+=dy;player.step+=dt*13;if(dx)player.facing=Math.sign(dx);}else player.step=0;
    camera.x+=(player.x-camera.x)*Math.min(1,dt*7);camera.y+=(player.y-camera.y)*Math.min(1,dt*7);
    ctx.fillStyle='#287e91';ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(w/2-camera.x,h/2-camera.y);
    for(let y=-1300;y<1400;y+=65)for(let x=-1600;x<1700;x+=95){const drift=Math.sin(time*.6+y)*9;ctx.strokeStyle='#a5dfcf16';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+drift,y);ctx.quadraticCurveTo(x+15+drift,y+4,x+30+drift,y);ctx.stroke();}
    island(65,'#348f99');island(36,'#58ada8');island(13+Math.sin(time*1.4)*3,'#b5d7bc');island(0,'#e7d59a');island(-27,'#d9cb88');island(-45,'#87b667');island(-52,'#82b162');drawRiver();
    for(const g of tufts){if(Math.abs(g.x-camera.x)>w/2+30||Math.abs(g.y-camera.y)>h/2+40)continue;ctx.strokeStyle=g.s>.7?'#adc87c':'#669b5680';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(g.x-3,g.y);ctx.lineTo(g.x-5+Math.sin(time+g.a),g.y-5-g.s*5);ctx.moveTo(g.x,g.y);ctx.lineTo(g.x+1,g.y-8-g.s*4);ctx.moveTo(g.x+3,g.y);ctx.lineTo(g.x+6,g.y-4);ctx.stroke();}
    for(const f of flowers){ctx.strokeStyle='#527e46';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x,f.y-7);ctx.stroke();for(let i=0;i<5;i++){const a=i/5*Math.PI*2;ellipse(f.x+Math.cos(a)*3,f.y-8+Math.sin(a)*3,2.3,2.3,f.color);}ellipse(f.x,f.y-8,1.6,1.6,'#e8b74d');}
    // A few smooth pebbles along the shoreline.
    for(let i=0;i<65;i++){const a=i*2.399,r=shore(a)-17;ellipse(Math.cos(a)*r,Math.sin(a)*r*.79,2+i%3,2,i%2?'#bfba8a':'#f5e5b7');}
    const hover=selected();canvas.style.cursor=hover?'pointer':'crosshair';
    if(hover&&Math.hypot(hover.x-player.x,hover.y-player.y)<112){ctx.strokeStyle='#f5e6ac88';ctx.setLineDash([4,5]);ctx.beginPath();ctx.ellipse(hover.x,hover.y,33,17,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
    const visible=objects.filter(o=>!o.removed&&Math.abs(o.x-camera.x)<w/2+100&&Math.abs(o.y-camera.y)<h/2+140);visible.push({y:player.y,type:'player'});visible.sort((a,b)=>a.y-b.y);
    for(const o of visible){if(o.type==='player')character();else {o.hit=Math.max(0,o.hit-dt);o.type==='tree'?tree(o,o===hover):rock(o,o===hover);}}
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=240*dt;ctx.globalAlpha=Math.max(0,p.life/.7);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,4,4);if(p.life<=0)particles.splice(i,1);}ctx.globalAlpha=1;nameLabel();ctx.restore();
    mini.clearRect(0,0,170,150);mini.save();mini.translate(85,75);mini.scale(.107,.107);mini.fillStyle='#d6cc91';mini.beginPath();for(let i=0;i<=100;i++){const a=i/100*Math.PI*2,r=shore(a);mini.lineTo(Math.cos(a)*r,Math.sin(a)*r*.79);}mini.fill();mini.fillStyle='#7ca464';mini.fill();for(const o of objects){if(o.removed)continue;mini.fillStyle=o.type==='tree'?'#426f50':'#b4c0a3';mini.fillRect(o.x-7,o.y-7,14,14);}mini.restore();mini.fillStyle='#173d42';mini.beginPath();mini.arc(85+player.x*.107,75+player.y*.107,5,0,7);mini.fill();mini.fillStyle='#fff0b2';mini.beginPath();mini.arc(85+player.x*.107,75+player.y*.107,3,0,7);mini.fill();
  }
  const creator = document.querySelector('#creator');
  document.querySelector('#appearance-form').onsubmit=e=>{e.preventDefault();const input=document.querySelector('#character-name');player.name=input.value.trim().slice(0,24)||'Explorer';input.value=player.name;if(pendingShape!==islandShape){islandShape=pendingShape;generateIsland();}creating=false;creator.hidden=true;keys.clear();hint('Welcome ashore, '+player.name+'.');canvas.focus();};
  const edit=document.createElement('button');edit.textContent='Change appearance';edit.onclick=()=>{togglePause();creating=true;keys.clear();creator.hidden=false;document.querySelector('#appearance-nav [aria-selected=\"true\"]').focus();};document.querySelector('#resume').after(edit);
  renderActionBar();
  function frame(now){document.querySelector('#action-bar').hidden=creating;const dt=Math.min((now-last)/1000,.04);last=now;if(!paused&&!backpack.open)draw(creating?0:dt);requestAnimationFrame(frame);}requestAnimationFrame(frame);
})();












