(() => {
  'use strict';
  if(document.body.dataset.midautumnEnabled!=='true')return;
  const $=s=>document.querySelector(s),dialog=$('#midautumnWelcome'),viewport=$('#festivalViewport'),artwork=$('#festivalArtwork'),canvas=$('#festivalActors'),displayContext=canvas.getContext('2d'),loading=$('#festivalLoad'),slider=$('#festivalPosition'),bubble=$('#festivalBubble');
  const foreground=document.createElement('canvas'),foregroundContext=foreground.getContext('2d');
  const riverBackdrop=document.createElement('canvas'),riverContext=riverBackdrop.getContext('2d');
  let riverRenderer,riverBackdropKey='';
  let ctx=displayContext;
  const W=2172,H=724,Y=550,reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const hero={x:90,target:90,phase:0,direction:1,action:null,until:0,balloon:false};
  const places=[{x:300,label:'入席饮桂花茶',role:'drink',message:'店家斟来桂花茶：今夜月圆，请君共饮。'},{x:860,label:'买一块月饼',role:'trade',message:'接过一块新出炉的月饼。愿你岁岁团圆。'},{x:1360,label:'买一只彩球',role:'trade',message:'摊主递来彩球：提稳了，带着月色继续逛吧。'},{x:1810,label:'坐下赏舞',role:'look',message:'你在台前落座，水袖轻扬，正是一曲好月色。'}];
  let frame=0,last=0,time=0,keys=new Set(),drag=null,follow=true,queued=null,active=false,renderer,characters;
  let nightfall,nightLevel=0;
  let view={width:0,height:0,worldWidth:0,scale:1,left:0,right:W},lastUI=-1,lastPlace=null;
  const stopButtons=[...document.querySelectorAll('[data-festival-stop]')];
  // Measure once per resize, before drawing; sprite rendering never reads layout.
  function measure(){
    view.width=viewport.clientWidth;view.height=artwork.clientHeight;
    view.worldWidth=artwork.clientWidth;view.scale=view.worldWidth/W;
  }
  new ResizeObserver(measure).observe(viewport);
  new ResizeObserver(measure).observe(artwork);
  const visible=(x,padding=90)=>x>=view.left-padding&&x<=view.right+padding;
  const nightButton=$('#festivalNightToggle'),lighting=window.FestivalLighting;
  function setNight(isNight){
    nightfall??=new window.QingmingNight.Nightfall();
    nightfall.target=Number(isNight);
    nightfall.progress=Number(isNight);
    nightLevel=Number(isNight);
    dialog.style.setProperty('--festival-night',`${nightLevel*100}%`);
    nightButton.textContent=isNight?'白天':'夜晚';
    nightButton.setAttribute('aria-label',isNight?'切换白天':'切换夜晚');
    nightButton.setAttribute('aria-pressed',String(isNight));
    dialog.dataset.time=isNight?'night':'day';
  }
  const handLantern=new Image();
  let seatedPainter=null;
  const seatedImage=new Image();
  seatedImage.onload=()=>{
    const cell=Math.floor(seatedImage.naturalWidth/3),h=seatedImage.naturalHeight,surface=document.createElement('canvas');surface.width=cell;surface.height=h;
    const c=surface.getContext('2d',{willReadFrequently:true});c.drawImage(seatedImage,-cell*2,0);const pixels=c.getImageData(0,0,cell,h).data;
    let l=cell,r=0,t=h,b=0;for(let y=0;y<h;y++)for(let x=0;x<cell;x++)if(pixels[(y*cell+x)*4+3]>96){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
    seatedPainter={image:surface,x:l,y:t,w:r-l+1,h:b-t+1};
  };
  const dancerFrames=[];const dancers=new Image();dancers.onload=()=>{dancerFrames.length=0;const cell=dancers.naturalWidth/3;for(let i=0;i<3;i++){const c=document.createElement('canvas');c.width=cell;c.height=dancers.naturalHeight;c.getContext('2d').drawImage(dancers,-i*cell,0);dancerFrames.push(c);}};
  const crowd=[];
  const rabbit=new Image();let rabbitCrop=null;
  rabbit.onload=()=>{
    const surface=document.createElement('canvas');surface.width=rabbit.naturalWidth;surface.height=rabbit.naturalHeight;
    const c=surface.getContext('2d');c.drawImage(rabbit,0,0);const pixels=c.getImageData(0,0,surface.width,surface.height).data;
    let l=surface.width,r=0,t=surface.height,b=0;
    for(let y=0;y<surface.height;y++)for(let x=0;x<surface.width;x++)if(pixels[(y*surface.width+x)*4+3]>80){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
    rabbitCrop={x:l,y:t,w:r-l+1,h:b-t+1};
  };
  let assetsReady;
  function loadAssets(){
    if(!assetsReady){
      const assets=[[handLantern,'assets/midautumn/lantern-design-v1.png'],[seatedImage,'assets/painter-hd-v1.webp'],[dancers,'assets/midautumn/festival-dancers-v1.png'],[rabbit,'assets/midautumn/rabbit-lantern-v1.png']];
      assetsReady=Promise.all(assets.map(([image,src])=>{image.src=src;return image.decode();})).catch(error=>{assetsReady=null;throw error;});
    }
    return assetsReady;
  }
  const rabbitBitmaps=new Map();
  function rabbitBitmap(h){
    const key=nightLevel.toFixed(2),cached=rabbitBitmaps.get(h);
    if(cached?.key===key)return cached;
    const a=rabbitCrop,w=h*a.w/a.h,pad=18,density=4,image=document.createElement('canvas');
    image.width=Math.ceil((w+pad*2)*density);image.height=Math.ceil((h+pad*2)*density);
    const c=image.getContext('2d');c.scale(density,density);c.imageSmoothingQuality='high';
    c.shadowColor=`rgba(255,203,103,${Number(key)*.18})`;c.shadowBlur=Number(key)*6;
    c.filter=`brightness(${1-Number(key)*.12}) saturate(${1-Number(key)*.08})`;
    c.drawImage(rabbit,a.x,a.y,a.w,a.h,pad,pad,w,h);
    const bitmap={key,image,w:w+pad*2,h:h+pad*2,pad};rabbitBitmaps.set(h,bitmap);return bitmap;
  }
  function drawRabbitLanterns(){
    if(!rabbitCrop)return;const a=rabbitCrop;
    for(const [i,[x,y,h]] of [[565,536,103],[1110,536,92],[1505,537,108],[2100,536,96]].entries()){
      if(!visible(x,h*1.5))continue;
      ctx.save();ctx.translate(x,y);if(i%2)ctx.scale(-1,1);
      const glow=ctx.createRadialGradient(0,-h*.4,0,0,-h*.4,h*.46);
      glow.addColorStop(0,`rgba(255,206,112,${.14+nightLevel*.04})`);glow.addColorStop(1,'#ffd78600');ctx.fillStyle=glow;ctx.fillRect(-h,-h*1.1,h*2,h*1.2);
      const bitmap=rabbitBitmap(h);
      ctx.drawImage(bitmap.image,-h*a.w/a.h/2-bitmap.pad,-h-bitmap.pad,bitmap.w,bitmap.h);
      ctx.globalCompositeOperation='screen';lighting.glow(ctx,0,-h*.4,h*.34,h*.38,'#f1c985',nightLevel*.07);lighting.glow(ctx,0,2,h*.48,8,'#e4b875',nightLevel*.10);ctx.restore();
    }
  }
  function resident(x,y,sprite,role='talk',direction=1,layer='street'){const i=crowd.length;crowd.push({id:`resident-festival-${i}`,x,y,sprite,role,direction,layer,h:[6,7,8].includes(sprite)?(layer==='balcony'?40:45):sprite===10?43:63,outfit:i%8,phase:i*.83,period:5+i%4,story:true});}
  // Separate seated diners, shopkeepers, customers and stage spectators.
  [120,180,270,320,408,455].forEach((x,i)=>resident(x,528,[6,7,8][i%3],i%2?'drink':'talk',i%2?1:-1));
  // Each pair sits behind a separate bay of the painted balcony railing.
  for(const [x,sprite,role,direction] of [[145,6,'talk',1],[215,7,'drink',-1],[350,8,'drink',1],[420,6,'talk',-1]]){
    resident(x,366,sprite,role,direction,'balcony');
    crowd[crowd.length-1].h=44;
  }
  const balconyTables=[180,385];
  function drawBalconyTable(x,details=false){
    if(!visible(x,65))return;
    ctx.save();
    ctx.translate(0,7);
    ctx.lineJoin='round';ctx.lineCap='round';
    if(!details){
      // A shallow top catches the light; its feet disappear naturally behind
      // the original carved railing when that foreground strip is restored.
      ctx.fillStyle='#705438';ctx.strokeStyle='#3e382d';ctx.lineWidth=.75;
      ctx.fillRect(x-25,336,50,3.5);ctx.strokeRect(x-25,336,50,3.5);
      ctx.fillStyle='#ad8960';ctx.fillRect(x-23.5,336.3,47,1);
      ctx.fillStyle='#594936';ctx.fillRect(x-20,339,2,17);ctx.fillRect(x+18,339,2,17);
    }else{
      // Two cups, a shared mooncake plate and a small tea flask make the
      // conversation read as an actual meal even at the panorama's scale.
      ctx.strokeStyle='#665844';ctx.lineWidth=.65;
      ctx.fillStyle='#e5d7b8';
      for(const cupX of [x-17,x+17]){
        ctx.beginPath();ctx.ellipse(cupX,333.6,3.4,1.1,0,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.beginPath();ctx.moveTo(cupX-2.7,333.7);ctx.lineTo(cupX-2,337);ctx.quadraticCurveTo(cupX,338,cupX+2,337);ctx.lineTo(cupX+2.7,333.7);ctx.stroke();
      }
      ctx.fillStyle='#d1b27e';ctx.beginPath();ctx.ellipse(x,335,8,2,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#a7683c';
      for(const dx of [-3,2]){ctx.beginPath();ctx.arc(x+dx,332.5,2.5,Math.PI,0);ctx.lineTo(x+dx+2.5,335);ctx.lineTo(x+dx-2.5,335);ctx.closePath();ctx.fill();ctx.stroke();}
      ctx.fillStyle='#aa9471';ctx.beginPath();ctx.moveTo(x-1,329);ctx.lineTo(x+1.5,329);ctx.lineTo(x+2.6,335);ctx.lineTo(x-2,335);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(x-1,328.7);ctx.lineTo(x-1,327.6);ctx.lineTo(x+1,327.6);ctx.stroke();
    }
    ctx.restore();
  }
  [655,730,865,980,1260,1370].forEach((x,i)=>resident(x,535,[4,5,9][i%3],'trade',i%2?-1:1));
  // Fill the long bench below the stage with seated spectators. Their gaze
  // turns toward the middle of the performance, leaving the street in front.
  [1570,1608,1646,1684,1722,1760,1798,1836,1874,1912,1950,1988,2026].forEach((x,i)=>
    resident(x,548+i%3,[6,7,8][i%3],'look',x<1800?1:-1));
  resident(1390,552,10,'look',-1);resident(1325,550,10,'talk');
  // Friends linger beside shops; children stop to admire the lantern displays.
  [85,205,490,605,785,1025,1150,1440,1510,2055].forEach((x,i)=>{
    resident(x,540,[4,5,9][i%3],'talk',1);
    resident(x+24,543,i%3===0?10:[1,2][i%2],i%3===0?'look':'talk',-1);
  });
  const walkers=Array.from({length:28},(_,i)=>({id:`festival-walker-${i}`,x:45+i*76,y:554+(i%3)*4,sprite:[0,1,2,9,11][i%5],outfit:i%8,h:58+i%7,phase:i*5,direction:i%2?-1:1,speed:9+i%6*2,story:true}));
  const children=Array.from({length:6},(_,i)=>({id:`festival-running-child-${i}`,x:210+Math.floor(i/2)*740+i%2*65,y:561+i%2*5,sprite:10,outfit:[1,3,5,2,6,4][i],h:40+i%2*3,phase:i*2,direction:1,speed:44+i%2*4,from:90+Math.floor(i/2)*730,to:640+Math.floor(i/2)*730,story:true}));
  function drawChildren(dt){
    for(const p of children){
      if(!reduced.matches){p.x+=p.direction*p.speed*dt;p.phase+=dt*8;if(p.x>p.to||p.x<p.from){p.x=Math.max(p.from,Math.min(p.to,p.x));p.direction*=-1;}}
      if(!visible(p.x))continue;
      const bounce=reduced.matches?0:Math.abs(Math.sin(p.phase))*2;
      ctx.save();ctx.translate(0,-bounce);person(p,!reduced.matches);ctx.restore();
    }
  }
  let handLanternBitmap;
  function drawHandLanterns(){
    const key=nightLevel.toFixed(2);
    if(handLantern.complete&&handLantern.naturalWidth&&handLanternBitmap?.key!==key){
      const image=document.createElement('canvas');image.width=40;image.height=102;
      const c=image.getContext('2d');c.imageSmoothingQuality='high';
      c.filter=`brightness(${1+Number(key)*.08})`;c.drawImage(handLantern,274,48,380,968,0,0,40,102);
      handLanternBitmap={key,image};
    }
    for(const p of children){
      if(!visible(p.x))continue;
      const bounce=reduced.matches?0:Math.abs(Math.sin(p.phase))*2;
      ctx.save();ctx.translate(0,-bounce);
      const handX=p.x+p.direction*8,handY=p.y-25,tipX=p.x+p.direction*33,tipY=p.y-61;
      ctx.lineWidth=1.2;ctx.strokeStyle='#8c7146';ctx.beginPath();ctx.moveTo(handX-p.direction*6,handY+6);ctx.lineTo(tipX,tipY);ctx.stroke();
      ctx.save();ctx.translate(tipX,tipY);ctx.rotate(reduced.matches?0:Math.sin(p.phase*.65)*.2);
      ctx.strokeStyle='#b9914b';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,7);ctx.stroke();
      lighting.glow(ctx,0,16,13,18,'#edc17d',nightLevel*.16);
      if(handLanternBitmap)ctx.drawImage(handLanternBitmap.image,-5,7,10,25.5);
      ctx.restore();ctx.restore();
    }
  }
  const extent=()=>Math.max(0,view.worldWidth-view.width);
  const scale=()=>view.scale;
  const nearest=()=>places.reduce((a,b)=>Math.abs(a.x-hero.x)<Math.abs(b.x-hero.x)?a:b);
  function sync(){slider.value=extent()?Math.round(viewport.scrollLeft/extent()*1000):0;slider.style.setProperty('--progress',`${Number(slider.value)/10}%`);}
  function walkTo(x,place=null){hero.action=null;bubble.hidden=true;hero.target=Math.max(40,Math.min(W-40,x));queued=place;follow=true;}
  function doAction(place){hero.action=place.role;hero.until=time+7;hero.target=hero.x;queued=null;bubble.textContent=place.message;bubble.hidden=false;if(place===places[2])hero.balloon=true;if(place===places[1])hero.mooncake=true;canvas.dataset.action=place.role;}
  function activate(){const p=nearest();if(Math.abs(p.x-hero.x)<85)doAction(p);else walkTo(p.x,p);}
  function drawBalloon(x,y,t,count=1){
    if(!visible(x,70))return;
    const colors=['#b85e51','#759888','#d8bc79','#7d9daa','#cda584'];
    for(let i=0;i<count;i++){
      const bx=x+Math.sin(t*.8+i)*4+(i%3-1)*18,by=y-102-Math.floor(i/3)*22;
      ctx.strokeStyle='#867251';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x,y-38);ctx.quadraticCurveTo(bx+5,y-75,bx,by+13);ctx.stroke();
      ctx.save();ctx.translate(bx,by);ctx.rotate(Math.sin(t+i)*.06);ctx.fillStyle=colors[i%colors.length];ctx.beginPath();ctx.ellipse(0,0,12,15,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#f8e7be55';ctx.beginPath();ctx.ellipse(-4,-5,3,5,.3,0,Math.PI*2);ctx.fill();ctx.restore();
    }
  }
  const dancerSurfaces=[];
  function drawDancers(){
    if(!dancers.complete||!dancers.naturalWidth)return;
    for(let i=0;i<dancerFrames.length;i++){
      const art=dancerFrames[i],beat=reduced.matches?0:time;
      const flight=beat*.32+i*Math.PI*2/3;
      const x=reduced.matches?1645+i*125:1768+Math.sin(flight)*155;
      const y=reduced.matches?492:425-(.5+.5*Math.cos(flight))*155;
      if(!visible(x,100))continue;
      ctx.save();ctx.translate(x,y);ctx.rotate(reduced.matches?0:Math.cos(flight)*.13);
      const density=Math.min((devicePixelRatio||1)*view.scale,4),size=Math.ceil(112*density);
      const surface=dancerSurfaces[i]??(dancerSurfaces[i]=document.createElement('canvas'));
      if(surface.width!==size)surface.width=size;if(surface.height!==size)surface.height=size;
      const dc=surface.getContext('2d',{willReadFrequently:true});
      dc.setTransform(1,0,0,1,0,0);dc.clearRect(0,0,size,size);
      dc.setTransform(density,0,0,density,56*density,96*density);
      const point=(u,v)=>({source:[u*art.width,v*art.height],target:[(u-.5)*80+Math.sin(beat*1.5+i+u*3)*Math.abs(u-.5)*9*(1-v),(v-1)*80+Math.cos(beat*1.3+i+u*4)*Math.abs(u-.5)*7*(1-v)]});
      const points=Array.from({length:13},(_,row)=>Array.from({length:9},(_,col)=>point(col/8,row/12)));
      for(let row=0;row<12;row++)for(let col=0;col<8;col++){
        const a=points[row][col],b=points[row][col+1],c=points[row+1][col],d=points[row+1][col+1];
        renderer.cell(dc,art,a,b,c,d);
      }
      ctx.drawImage(surface,0,0,size,size,-56,-96,size/density,size/density);
      ctx.restore();
    }
  }
  function person(p,walking=false){
    if(!visible(p.x))return;
    const pose=window.ScrollMovement.activityAt(p.role||'walk',time,p.phase,5.5);
    renderer.sprite(ctx,{p,x:p.x,y:p.y,pose:{...pose,phase:p.phase,...(walking?{gaitWeight:1}:{})},walking,direction:p.direction,ground:()=>p.y},time);
  }
  function drawRiver(scrollLeft,width,height,pixelsPerCSS){
    if(!riverRenderer?.active)return;
    const key=`${scrollLeft.toFixed(1)}:${width}:${height}`;
    if(key!==riverBackdropKey){
      if(riverBackdrop.width!==width)riverBackdrop.width=width;if(riverBackdrop.height!==height)riverBackdrop.height=height;
      riverContext.setTransform(1,0,0,1,0,0);
      const sourceScale=artwork.naturalWidth/view.worldWidth;
      riverContext.drawImage(artwork,scrollLeft*sourceScale,0,view.width*sourceScale,artwork.naturalHeight,0,0,width,height);
      riverBackdropKey=key;
    }
    riverRenderer.resize(view.width,view.height,pixelsPerCSS);
    const water=riverRenderer.render({time,camera:view.left,viewY:0,width:view.width,height:view.height,scale:view.scale,source:riverBackdrop,backdropKey:key});
    riverRenderer.composite(ctx,water);
  }
  function render(dt){
    nightLevel=nightfall.step(dt,reduced.matches);
    const nightStyle=`${(nightLevel*100).toFixed(3)}%`;
    if(dialog.style.getPropertyValue('--festival-night')!==nightStyle)dialog.style.setProperty('--festival-night',nightStyle);
    const dir=(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0);
    if(dir){hero.action=null;bubble.hidden=true;queued=null;hero.target=Math.max(40,Math.min(W-40,hero.x+dir*100));follow=true;}
    const dx=hero.target-hero.x,step=Math.sign(dx)*Math.min(Math.abs(dx),dt*72),moving=Math.abs(step)>.01;
    hero.x+=step;if(moving){hero.direction=Math.sign(step);hero.phase+=Math.abs(step)*.15;}
    if(Math.abs(hero.target-hero.x)<1&&queued)doAction(queued);
    if(hero.action&&time>hero.until){hero.action=null;bubble.hidden=true;}
    if(follow){const target=Math.max(0,Math.min(extent(),hero.x*scale()-view.width*.45));viewport.scrollLeft+=(target-viewport.scrollLeft)*Math.min(1,dt*5);}
    const scrollLeft=viewport.scrollLeft;
    view.left=scrollLeft/scale();view.right=view.left+view.width/scale();
    const p=nearest();if(p!==lastPlace){stopButtons.forEach((b,i)=>b.setAttribute('aria-current',String(places[i]===p)));lastPlace=p;}
    if(time-lastUI>=.1){
      canvas.dataset.heroX=hero.x.toFixed(2);canvas.dataset.balloon=String(hero.balloon);canvas.dataset.mooncake=String(!!hero.mooncake);canvas.dataset.action=hero.action||'walk';
      canvas.dataset.night=nightLevel.toFixed(3);canvas.dataset.childrenX=children.map(p=>p.x.toFixed(1)).join(',');lastUI=time;
    }
    const dpr=Math.min(devicePixelRatio||1,2),width=Math.round(view.width*dpr),height=Math.round(view.height*dpr);
    if(!width||!height)return;
    if(canvas.width!==width)canvas.width=width;
    if(canvas.height!==height)canvas.height=height;
    canvas.style.width=`${view.width}px`;canvas.style.height=`${view.height}px`;canvas.style.transform=`translateX(${scrollLeft}px)`;
    // A viewport-sized window onto the same world, at the same device density.
    // Offscreen people still advance their simulation so re-entry is seamless.
    const pixelsPerCSS=width/view.width;
    renderer.motionDensity=Math.min(4,Math.max(1,scale()*pixelsPerCSS));
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);
    ctx.setTransform(scale()*pixelsPerCSS,0,0,height/H,-scrollLeft*pixelsPerCSS,0);ctx.imageSmoothingQuality='high';
    drawRiver(scrollLeft,width,height,pixelsPerCSS);
    lighting.draw(ctx,nightLevel,time,reduced.matches);
    // Lantern displays emit light and dancers stay under the stage lamps;
    // the street crowd still passes in front of both.
    drawRabbitLanterns();drawDancers();
    // Keep figures on a transparent pass, as in the main street. Tint only
    // their pixels so they occlude the warm lights without darkening them twice.
    if(nightLevel>0){
      if(foreground.width!==width)foreground.width=width;
      if(foreground.height!==height)foreground.height=height;
      foregroundContext.setTransform(1,0,0,1,0,0);
      foregroundContext.clearRect(0,0,width,height);
      foregroundContext.setTransform(ctx.getTransform());
      foregroundContext.imageSmoothingQuality='high';ctx=foregroundContext;
    }
    for(const x of balconyTables)drawBalconyTable(x);
    for(const p of crowd)if(p.layer==='balcony')person(p);
    for(const x of balconyTables)drawBalconyTable(x,true);
    // Original painted railing belongs in front of the seated guests.
    // Restore its narrow strip after their sprites, before the street crowd.
    ctx.drawImage(artwork,93,345,443,26,93,345,443,26);
    for(const p of crowd)if(p.layer!=='balcony')person(p);
    drawBalloon(1365,535,time,8);
    for(const p of walkers){if(!reduced.matches){p.x+=p.speed*p.direction*dt;p.phase+=p.speed*dt*.15;if(p.x<35||p.x>W-35)p.direction*=-1;}person(p,!reduced.matches);}
    drawChildren(dt);
    const sitting=hero.action==='look';
    const actor={id:'festival-hero',art:characters.sprites.painter,h:63,story:true};
    const pose=window.ScrollMovement.activityAt(hero.action||'look',time,0,5.5);
    if(sitting&&seatedPainter){const a=seatedPainter;ctx.drawImage(a.image,a.x,a.y,a.w,a.h,hero.x-48*a.w/a.h/2,Y-48,48*a.w/a.h,48);}else renderer.sprite(ctx,{p:actor,x:hero.x,y:Y,pose:{...pose,phase:hero.phase,gaitWeight:moving?1:0},walking:moving,direction:hero.direction,ground:()=>Y},time);
    if(hero.mooncake&&hero.action==='trade'){ctx.fillStyle='#b9803e';ctx.strokeStyle='#77502d';ctx.beginPath();ctx.arc(hero.x+18*hero.direction,Y-33,4,0,Math.PI*2);ctx.fill();ctx.stroke();}
    if(hero.balloon)drawBalloon(hero.x+14,Y,time);
    if(nightLevel>0){
      window.QingmingNight.drawAtmosphere(ctx,nightLevel,[view.left,view.right],'source-atop');
      ctx=displayContext;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(foreground,0,0);ctx.restore();
    }
    drawHandLanterns();
    ctx.fillStyle='#9f453b';ctx.beginPath();ctx.moveTo(hero.x,Y-76);ctx.lineTo(hero.x-3,Y-81);ctx.lineTo(hero.x+3,Y-81);ctx.fill();
    bubble.style.left=`${hero.x*scale()}px`;bubble.style.top=`${(Y+100)*scale()}px`;
  }
  function tick(now){if(!active)return;const dt=Math.min((now-last)/1000,.05);last=now;if(!document.hidden){time+=dt;render(dt);}frame=requestAnimationFrame(tick);}
  async function open(){
    if(!dialog.open||active)return;
    setNight(dialog.dataset.entryNight==='true');
    loading.hidden=false;viewport.setAttribute('aria-busy','true');
    try{
      if(!artwork.getAttribute('src'))artwork.src=artwork.dataset.src;
      await artwork.decode();const actors=window.QingmingFestivalActors;if(!actors)throw Error('人物系统尚未就绪');
      renderer=actors.inhabitants;characters=actors.characters;
      const riverModule=await import('./water-three.js?v=1.9-scissor');
      riverRenderer??=new riverModule.ThreeWaterRenderer({bankY:626});
      await Promise.all([renderer.assetsReady,characters.assetsReady,loadAssets(),lighting.prepare(artwork)]);
      if(!dialog.open)return;
      measure();follow=true;
      // Paint the inherited time of day before exposing the daytime base image.
      render(0);
      loading.hidden=true;viewport.setAttribute('aria-busy','false');active=true;last=performance.now();frame=requestAnimationFrame(tick);
    }catch(error){loading.hidden=false;loading.textContent='街市加载失败，请返回城门重试。';viewport.setAttribute('aria-busy','false');console.error(error);}
  }
  new MutationObserver(()=>{if(dialog.open)open();else{active=false;cancelAnimationFrame(frame);keys.clear();drag=null;hero.target=hero.x;queued=null;}}).observe(dialog,{attributes:true,attributeFilter:['open']});
  nightButton.addEventListener('click',()=>{
    if(!nightfall)return;const night=nightfall.toggle();nightButton.textContent=night?'白天':'夜晚';nightButton.setAttribute('aria-label',night?'切换白天':'切换夜晚');nightButton.setAttribute('aria-pressed',String(night));dialog.dataset.time=night?'night':'day';
  });
  dialog.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','a','d'].includes(e.key)&&!e.target.matches('input')){e.preventDefault();keys.add(e.key);}if(e.key.toLowerCase()==='e'&&!e.repeat){e.preventDefault();activate();}});
  dialog.addEventListener('keyup',e=>{keys.delete(e.key);if(['ArrowLeft','ArrowRight','a','d'].includes(e.key))hero.target=hero.x;});
  window.addEventListener('blur',()=>{keys.clear();hero.target=hero.x;});
  document.querySelectorAll('[data-festival-stop]').forEach((b,i)=>b.addEventListener('click',()=>walkTo(places[i].x,places[i])));
  slider.addEventListener('input',()=>{follow=false;viewport.scrollLeft=+slider.value/1000*extent();});viewport.addEventListener('scroll',sync,{passive:true});
  viewport.addEventListener('wheel',e=>{if(e.ctrlKey)return;e.preventDefault();follow=false;viewport.scrollLeft+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?16:1);},{passive:false});
  viewport.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,moved:false,touch:e.pointerType==='touch'};if(!drag.touch)viewport.setPointerCapture(e.pointerId);});
  viewport.addEventListener('pointermove',e=>{if(!drag)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7){drag.moved=true;follow=false;}if(drag.moved&&!drag.touch)viewport.scrollLeft=drag.left+drag.x-e.clientX;});
  viewport.addEventListener('pointerup',e=>{if(drag&&!drag.moved){const rect=viewport.getBoundingClientRect();walkTo((e.clientX-rect.left+viewport.scrollLeft)/scale());viewport.focus({preventScroll:true});}drag=null;});
  viewport.addEventListener('pointercancel',()=>{drag=null;});
})();
