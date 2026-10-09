import {drawFestivalGate,drawFestivalLights,festivalGate,festivalEnabled} from './midautumn.js?v=10-season-toggle';
import './seasons.js?v=1';
import {ThreeWaterRenderer} from './water-three.js?v=1.9-scissor';

(() => {
  'use strict';
  const canvas = document.querySelector('#scene');
  const displayContext = canvas.getContext('2d', { alpha: false });
  let mainContext=displayContext;
  const nightForeground=document.createElement('canvas');
  const nightForegroundContext=nightForeground.getContext('2d');
  const backdrop=document.createElement('canvas');
  const backdropContext=backdrop.getContext('2d',{alpha:false});
  let backdropKey;
  let ctx=mainContext;
  const population=window.ScrollPopulation;
  const movement=window.ScrollMovement;
  const walkInput=movement.createWalkInput();
  const featured=window.ScrollFeatured,characters=new featured.Characters();
  const water=window.ScrollWater;
  const threeWater=new ThreeWaterRenderer();
  const pedestrianHeight=scale=>scale*46;
  const MIN=population.bounds.min,MAX=population.bounds.max,SPAN=MAX-MIN;
  const inhabitants=new window.Inhabitants(),districts=new window.Districts();
  window.QingmingFestivalActors={inhabitants,characters};
  const actors=document.createElement('canvas');actors.width=SPAN;actors.height=724;
  const actorContext=actors.getContext('2d');
  const painting = document.querySelector('#painting');
  const shopHost=document.querySelector('#sunyang'),shopPortrait=shopHost.querySelector('canvas');
  const shopArt=new Image();let shopReady=false;
  shopArt.onload=()=>{
    const c=shopPortrait.getContext('2d');shopPortrait.width=shopArt.naturalWidth;shopPortrait.height=shopArt.naturalHeight;c.drawImage(shopArt,0,0);
    const pixels=c.getImageData(0,0,shopPortrait.width,shopPortrait.height).data;let l=shopPortrait.width,r=0,t=shopPortrait.height,b=0;
    for(let y=0;y<shopPortrait.height;y++)for(let x=0;x<shopPortrait.width;x++)if(pixels[(y*shopPortrait.width+x)*4+3]>96){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
    shopPortrait.width=r-l+1;shopPortrait.height=b-t+1;c.drawImage(shopArt,l,t,r-l+1,b-t+1,0,0,r-l+1,b-t+1);shopReady=true;
  };shopArt.src='assets/sunyang-host-v2.webp';
  const festivalEntry=document.querySelector('#midautumnEntry');
  const festivalWelcome=document.querySelector('#midautumnWelcome');
  let festivalWasRunning=false;
  festivalEntry.addEventListener('click',()=>{
    if(!festivalEnabled||festivalWelcome.open)return;
    festivalWasRunning=state.running;state.running=false;walkInput.clear();updateMotion();
    festivalWelcome.dataset.entryNight=String(Boolean(nightfall.target));
    sound.setFestival(true);sound.setRunning(!document.hidden);
    festivalWelcome.showModal();
    window.AtlasTour.setRoute('#midautumn');
  });
  document.querySelector('#midautumnBack').addEventListener('click',()=>festivalWelcome.close());
  festivalWelcome.addEventListener('keydown',e=>e.stopPropagation());
  festivalWelcome.addEventListener('close',()=>{sound.setFestival(false);state.running=festivalWasRunning;updateMotion();if(location.hash==='#midautumn')window.AtlasTour.setRoute('#gate');if(!document.body.classList.contains('in-atlas'))festivalEntry.focus({preventScroll:true});});
  const slider = document.querySelector('#position');
  const play = document.querySelector('#play');
  const motion = document.querySelector('#motion');
  let artwork = new Image();
  const springArtwork=artwork,springDistricts={west:districts.west,east:districts.east};
  const boatArtwork=new Image(),boatSprite=document.createElement('canvas');boatSprite.width=0;
  const boatReady=new Promise((resolve,reject)=>{
  boatArtwork.onload=()=>{
    boatSprite.width=featured.boat.width*3;boatSprite.height=featured.boat.height*3;
    const context=boatSprite.getContext('2d');context.imageSmoothingQuality='high';
    context.drawImage(boatArtwork,40,150,2100,425,0,0,boatSprite.width,boatSprite.height);
    resolve();
  };
  boatArtwork.onerror=()=>reject(new Error('船只素材加载失败'));
  });
  boatReady.catch(()=>{});
  boatArtwork.src='assets/boat.webp';
  const world=window.ScrollWorld;
  const ferry=world.createFerry();
  let life;
  const crossing=new window.BridgeStory.Crossing();
  const nightfall=new window.QingmingNight.Nightfall();
  let nightLevel=0;
  const rainEvent=new window.QingmingWeather.RainEvent();
  let weatherSample=rainEvent.sample();
  const seasons=window.QingmingSeasons,seasonControls=document.querySelector('.season-controls');
  const seasonStatus=document.querySelector('#seasonStatus');
  let snowing=true,springSprites=null;
  const seasonalCharacters=new Map();
  const seasonController=new seasons.Controller(async id=>{
    // Finish any original district requests before replacing their image refs.
    await districts.load();springSprites??=characters.sprites;
    if(id==='spring')return {...springDistricts,center:springArtwork,sprites:springSprites};
    const art=await seasons.loadArt(id);
    if(!seasonalCharacters.has(id))seasonalCharacters.set(id,new featured.Characters(`assets/seasons/featured-${id}.png`));
    const cast=seasonalCharacters.get(id);
    try{await cast.assetsReady;}catch(error){seasonalCharacters.delete(id);throw error;}
    art.sprites=cast.sprites;
    return art;
  },(id,art)=>{
    artwork=art.center;districts.west=art.west;districts.east=art.east;districts.prepare(artwork);districts.revision++;
    characters.springSprites=springSprites;characters.sprites=art.sprites;inhabitants.residentFrames.clear();rainEvent.reset();snowing=true;
    weatherSample=seasons.weather(id,rainEvent.sample(),snowing,state.time);
    backdropKey=null;painting.dataset.season=id;painting.dataset.clothing=seasons.profiles[id].cloth;
    announce(seasons.profiles[id].description);
    try{localStorage.setItem('qingming-season',id);}catch{}
  },(selection,error)=>{
    seasonControls.setAttribute('aria-busy',String(Boolean(selection.pending)));
    for(const button of seasonControls.querySelectorAll('[data-season]')){
      button.setAttribute('aria-pressed',String(button.dataset.season===selection.id));
      button.dataset.loading=String(button.dataset.season===selection.pending);
    }
    seasonStatus.textContent=error?'画面未载入，点击季节重试':selection.pending?`正在展开${seasons.profiles[selection.pending].name}景…`:seasons.profiles[selection.id].label;
  });
  for(const button of seasonControls.querySelectorAll('[data-season]'))button.addEventListener('click',()=>void seasonController.select(button.dataset.season));
  seasonControls.addEventListener('keydown',e=>{
    e.stopPropagation();if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();const buttons=[...seasonControls.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);
    const next=e.key==='Home'?0:e.key==='End'?3:(i+(e.key==='ArrowLeft'?3:1))%4;
    buttons[next].focus();buttons[next].click();
  });
  seasonControls.addEventListener('keyup',e=>e.stopPropagation());
  const towRope=document.querySelector('#towRope'),towGrip=document.querySelector('#towGrip');
  let towPointer=null,towHand=null,storyShot=null,savedSketch=null,sketchWasRunning=false,towLatch=false;
  try{const saved=JSON.parse(localStorage.getItem('qingming-bridge-sketch-v1'));if(saved&&/^data:image\/jpeg;base64,/.test(saved.image))savedSketch=saved;}catch{}
  document.querySelector('#towMemo').hidden=!savedSketch;
  const sketchScenes=[
    {id:'country',mark:'野',label:'郊野春行',title:'郊野春行',subtitle:'薄雾初开，行旅沿着柳岸走向汴京',position:'4%',scale:1.08},
    {id:'river',mark:'漕',label:'汴河漕运',title:'汴河漕运',subtitle:'舟楫相接，船工与脚夫把南北货物送入京城',position:'29%',scale:1.12},
    {id:'bridge',mark:'桥',label:'虹桥险情',title:'虹桥过船',subtitle:'漕船顺流而下，桥上行人呼喊示警',position:'50%',scale:1},
    {id:'market',mark:'市',label:'桥头百业',title:'桥头百业',subtitle:'茶摊、食肆与行商聚在桥头，叫卖声不绝',position:'61%',scale:1.13},
    {id:'gate',mark:'门',label:'城门车马',title:'城门车马',subtitle:'驼队与车马穿过城门，把远方带进东京',position:'82%',scale:1.12},
    {id:'capital',mark:'京',label:'东京繁市',title:'东京繁市',subtitle:'酒楼商铺沿街铺展，百业与万民汇成繁华',position:'96%',scale:1.09}
  ];
  const sketchDialog=document.querySelector('#bridgeSketch'),sketchImage=document.querySelector('#sketchImage'),sketchStage=document.querySelector('.sketch-stage'),sketchScenesNav=document.querySelector('#sketchScenes');
  let activeSketchScene='bridge';
  for(const [index,scene] of sketchScenes.entries()){
    const button=document.createElement('button');button.type='button';button.className='sketch-scene';button.dataset.scene=scene.id;
    button.innerHTML=`<i aria-hidden="true">${scene.mark}</i><span>${scene.label}</span>`;
    button.setAttribute('aria-label',`查看${scene.label}`);button.addEventListener('click',()=>showSketchScene(scene.id));sketchScenesNav.append(button);
  }
  function showSketchScene(id){
    const scene=sketchScenes.find(item=>item.id===id)||sketchScenes[2];activeSketchScene=scene.id;
    document.querySelector('#sketchEyebrow').textContent=`画中故事 · ${['一','二','三','四','五','六'][sketchScenes.indexOf(scene)]}`;
    document.querySelector('#sketchTitle').textContent=scene.title;document.querySelector('#sketchSubtitle').textContent=scene.subtitle;
    sketchStage.dataset.scene=scene.id;sketchStage.style.setProperty('--scene-position',scene.position);sketchStage.style.setProperty('--scene-scale',scene.scale);
    sketchImage.alt=`《清明上河图》故事场景：${scene.label}`;
    const nextSource=scene.id==='bridge'?savedSketch.image:'assets/qingming-panorama-v1.webp';
    if(sketchImage.getAttribute('src')!==nextSource){sketchImage.style.opacity='0';sketchImage.onload=()=>{sketchImage.style.opacity='1';sketchImage.onload=null;};sketchImage.src=nextSource;}else sketchImage.style.opacity='1';
    for(const button of sketchScenesNav.children)button.setAttribute('aria-current',String(button.dataset.scene===scene.id));
    document.querySelector('#sketchSeal').textContent=scene.id==='bridge'?(savedSketch.helped?'助船':'观船'):'清明';
    document.querySelector('#saveSketch').hidden=scene.id!=='bridge';
  }
  const sound=new window.InkSound();
  const hailFerry=document.querySelector('#hailFerry');
  let hailPending=false;
  const touches=new Map(),ripples=[];
  const aboard=()=>world.isPassenger(ferry);
  const dockAction=()=>player.action==='dock'||player.action==='landing';
  const W = 2172, H = 724;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { width: 0, height: 0, scale: 1, baseScale: 1, zoom: 1, viewY: 0, uiTime: 0, camera: 0, target: 0, max: 0, time: 0, auto: false, autoDirection: 1, running: !reduced.matches, drag: null, loaded: false };
  const player = { x: 585, velocity: 0, goal: null, facing: 1, phase: 0, moving: false, follow: true, pending: null, action: null, actionTime: 0, idleTime:0, pose: null };
  const spots = {
    tea: { x: 676, y: 444, width: 105, height: 98, stop: 690, label: '茶铺' },
    bridge: { x: 1722, y: 457, width: 80, height: 64, stop: 1730, label: '桥头' },
    dock: {x:2013,y:505,width:92,height:106,stop:2000,label:'东岸码头',berth:'east'},
    landing:{x:580,y:506,width:76,height:94,stop:568,label:'西岸码头',berth:'west'}
  };
  const spotLabels={tea:['到茶铺饮茶','正在饮茶'],bridge:['到桥头喂鸟','正在喂鸟'],dock:['到东岸码头乘船','正在等船'],landing:['到西岸码头乘船','正在等船']};
  const pedestrians=[
    {from:120,to:1080,speed:24,pause:4,offset:20,s:1.32,c:'#788c9c'},
    {from:270,to:1210,speed:20,pause:6,offset:91,s:1.4,c:'#b08a5f',carry:true},
    {from:1100,to:2060,speed:28,pause:4,offset:29,s:1.29,c:'#9b7484'},
    {from:1700,to:2040,speed:23,pause:7,offset:56,s:1.25,c:'#a57463'},
    {from:330,to:1170,speed:20,pause:7,offset:47,cart:true}
  ];
  pedestrians.forEach((p,i)=>p.id=`legacy-${i}`);
  life=new window.ScrollLife.Director({...population,walkers:[...population.walkers,...pedestrians]});
  const birds = { active: false, time: 0, cycle: 0 };
  const status = document.querySelector('#status');
  const sceneDescription = canvas.getAttribute('aria-label');
  const ink = '#555342';
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  function resize() {
    const ratio = state.max>MIN ? (state.target-MIN)/(state.max-MIN) : .4;
    state.width = innerWidth; state.height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(state.width * dpr); canvas.height = Math.round(state.height * dpr);
    threeWater.resize(state.width,state.height,dpr);
    state.baseScale = Math.max(state.height / H, state.width / (W * .73));
    state.scale=state.baseScale*state.zoom;
    state.viewY=clamp((H-state.height/state.scale)/2,0,H-state.height/state.scale);
    state.max = Math.max(MIN, MAX - state.width / state.scale);
    state.target = state.camera = player.follow ? cameraForPlayer() : MIN+ratio*(state.max-MIN);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if(state.storyView)frameCrossing();
  }
  function zoomAt(value,sx=state.width/2,sy=state.height/2){
    state.storyView=false;
    const wx=state.camera+sx/state.scale,wy=state.viewY+sy/state.scale;
    browse();state.zoom=clamp(value,1,2);state.scale=state.baseScale*state.zoom;
    state.max=Math.max(MIN,MAX-state.width/state.scale);
    state.camera=state.target=clamp(wx-sx/state.scale,MIN,state.max);
    state.viewY=clamp(wy-sy/state.scale,0,H-state.height/state.scale);
    const button=document.querySelector('#zoom'),expanded=state.zoom>1.05;
    button.querySelector('path').setAttribute('d',expanded?'m15 15 5 5M7 10h6':'m15 15 5 5M7 10h6m-3-3v6');
    button.setAttribute('aria-pressed',String(expanded));button.setAttribute('aria-label',expanded?'还原画卷':'放大细节');button.title=button.getAttribute('aria-label');
  }
  function followHeight(){
    return clamp((player.pose?.y??streetY(player.x))-state.height*.65/state.scale,0,H-state.height/state.scale);
  }
  function stroke(points, color = ink, width = .7) {
    ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p));
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  }
  function shape(points, color, width = .7) {
    ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath();
    ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = width; ctx.stroke();
  }
  function ellipse(x,y,rx,ry,fill, outline=true) {
    ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();
    if(outline){ctx.strokeStyle=ink;ctx.lineWidth=.65;ctx.stroke();}
  }
  function person(x,y,scale,phase,direction=1,robe='#777e6d',walking=true,ground=null) {
    if(inhabitants.ready){
      const palette={'#788c9c':0,'#b08a5f':5,'#9b7484':2,'#a57463':1,'#96917b':7,'#a1997c':5,'#828774':6};
      const p={sprite:1,outfit:palette[robe]??6,h:pedestrianHeight(scale),phase:0};
      const pose={...movement.activityAt(walking?'look':'row',state.time,phase,5),phase};
      return inhabitants.sprite(ctx,{p,x,y,pose,walking,direction,ground},state.time);
    }
    ctx.save();ctx.translate(x,y);ctx.scale(scale*direction,scale);
    const step = walking ? Math.sin(phase)*2.4 : Math.sin(phase)*.25;
    ellipse(0,1,5.5,1,'#615f4530',false);
    stroke([[-2,-5],[-2-step*.6,0],[-5-step*.6,.2]],ink,1.2);
    stroke([[2,-5],[2+step,0],[4+step,.2]],ink,1.15);
    const wash=ctx.createLinearGradient(-5,-18,5,-12);wash.addColorStop(0,robe);wash.addColorStop(.55,robe+'c9');wash.addColorStop(1,robe);
    shape([[-3,-23],[2,-23],[5,-17],[3,-13],[5,-5],[-5,-5],[-4,-15]],wash);
    stroke([[-2,-16],[-3,-7],[0,-6]],'#5d615055',.5);stroke([[2,-13],[3,-6]],'#ddd1ac66',.6);
    stroke([[-2,-22],[0,-18],[2,-22]],'#c3ba98',.65);
    stroke([[-2,-20],[-4+step,-14],[-1+step,-12]],ink,.8);
    stroke([[2,-19],[4-step*.5,-14],[7-step*.5,-16]],ink,.75);
    ellipse(.1,-26,2.9,3.6,'#c5b795');
    shape([[-3,-27],[-2,-30],[1,-31],[3,-28],[2,-27]],'#535447',.5);
    ellipse(-1,-31.1,1.2,1.2,'#535447');
    stroke([[2.7,-26],[3.5,-25],[2.6,-24.6]],ink,.5);
    ctx.restore();
    return {hand:{x:x+direction*(7-step*.5)*scale,y:y-16*scale}};
  }
  function boatRim(){
    const vessel=featured.boat;
    if(!boatSprite.width)return;
    ctx.save();ctx.globalAlpha=.92;ctx.beginPath();ctx.rect(vessel.left,vessel.deckY+.6,vessel.width,20);ctx.clip();
    ctx.drawImage(boatSprite,vessel.left,vessel.top,vessel.width,vessel.height);ctx.restore();
  }
  function boatWake(t,rowing){
    const wake=water.wakeStrength(rowing);
    ctx.save();ctx.lineCap='round';
    for(let i=0;i<4;i++){
      const sway=Math.sin(t*.52+i*1.8)*1.2;
      ctx.beginPath();ctx.moveTo(-69,5+i*2.2);
      ctx.bezierCurveTo(-88,6+i*2.5+sway,-102-i*8*wake.length,8+i*3,-72-(62+i*9)*wake.length,7+i*3.4+sway);
      ctx.strokeStyle=i%2?'#ded8bd':'#5d6855';ctx.globalAlpha=(i%2?wake.light:wake.dark)*(1-i*.13);ctx.lineWidth=.7+i*.12;ctx.stroke();
    }
    // A narrow V at the bow opens into the river while the stern leaves two
    // uneven turbulent seams rather than a single graphic line.
    for(const side of [-1,1]){
      ctx.beginPath();ctx.moveTo(57,3+side*1.2);ctx.quadraticCurveTo(70,6+side*4,84,10+side*7);
      ctx.strokeStyle=side>0?'#e1dcc2':'#626c59';ctx.globalAlpha=side>0?wake.light:wake.dark;ctx.lineWidth=.78;ctx.stroke();
    }
    ctx.restore();
  }
  function oarWater(tip,t,period){
    const effect=water.strokeEffect(t,period);
    ctx.save();ctx.lineCap='round';
    ctx.strokeStyle='#66705b';ctx.lineWidth=.62;ctx.globalAlpha=effect.opacity*.7;
    ctx.beginPath();ctx.ellipse(tip.x,tip.y,effect.ring*1.25,1.2+effect.ring*.14,0,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#ded8bd';ctx.globalAlpha=effect.opacity;
    ctx.beginPath();ctx.arc(tip.x,tip.y-1.2,2.5+effect.power*4.5,Math.PI*1.08,Math.PI*1.88);ctx.stroke();
    if(effect.power>.18){
      for(let i=0;i<4;i++){
        const spread=(i-1.5)*(2.8+effect.power*2.1),rise=2.8+effect.power*(7.2-Math.abs(i-1.5));
        ctx.globalAlpha=effect.opacity*(.7-i*.08);ctx.beginPath();
        ctx.moveTo(tip.x+spread*.24,tip.y-1);ctx.quadraticCurveTo(tip.x+spread*.72,tip.y-rise,tip.x+spread,tip.y-rise*.48);ctx.stroke();
        ctx.beginPath();ctx.arc(tip.x+spread,tip.y-rise*.52,.38+.28*effect.power,0,Math.PI*2);ctx.stroke();
      }
    }
    ctx.restore();
  }
  const waterEvents=[],boatTracks=new Map();
  function disturbBoat(id,x,y,s,t,direction,rowing,tip){
    const now=state.time,previous=boatTracks.get(id);
    const cycle=Math.floor((t-0.65)/3.6);
    if(previous&&now>previous.time&&now-previous.time<.5){
      const speed=Math.abs(x-previous.x)/(now-previous.time);
      if(rowing&&cycle!==previous.cycle){
        waterEvents.push({x:x+tip.x*s*direction,y:y+tip.y*s,born:now,kind:'stroke',strength:1});
      }
      if(speed>.5&&speed<100&&now-previous.wake>.32){
        waterEvents.push({x:x-73*s*direction,y:y+9*s,born:now,kind:'wake',strength:Math.min(1,speed/12)});
        previous.wake=now;
      }
    }
    boatTracks.set(id,{x,time:now,cycle,wake:previous?.wake??now});
    if(waterEvents.length>160)waterEvents.splice(0,waterEvents.length-160);
  }
  function drawBoatDisturbances(){
    ctx.save();ctx.lineCap='round';
    for(let i=waterEvents.length-1;i>=0;i--){
      const e=waterEvents[i],age=state.time-e.born;
      if(age>3.8){waterEvents.splice(i,1);continue;}
      const fade=Math.pow(1-age/3.8,2)*e.strength;
      const x=e.x+age*3,y=e.y;
      for(let ring=0;ring<3;ring++){
        const radius=3+age*15-ring*4;if(radius<1)continue;
        ctx.beginPath();ctx.ellipse(x,y,radius,radius*.22,0,0,Math.PI*2);
        ctx.strokeStyle=ring%2?'#52635a':'#eee9d4';
        ctx.globalAlpha=fade*(ring%2?.30:.65);ctx.lineWidth=.65;ctx.stroke();
      }
      if(e.kind==='stroke'&&age<.72){
        for(let j=0;j<9;j++){
          const vx=(j-4)*5,vy=-19-(j%3)*5;
          const rise=vy*age+42*age*age;if(rise>0)continue;
          ctx.globalAlpha=(1-age/.72)*.85;ctx.fillStyle='#f2eedc';
          ctx.beginPath();ctx.ellipse(x+vx*age,y+rise,.65,1.05,0,0,Math.PI*2);ctx.fill();
        }
      }
    }
    ctx.restore();
  }
  function boat(x,y,s,t,direction=1,rowing=true,id='ferry') {
    if(x+s*100<state.camera||x-s*100>state.camera+state.width/state.scale)return;
    ctx.save();ctx.translate(x,y+Math.sin(t*.7)*.6);ctx.scale(s*direction,s);
    if(boatSprite.width){
      boatWake(t,rowing);
      // Reuse the alpha sprite as reflected, shifting scanlines on the water.
      for(let i=0;i<6;i++){
        ctx.globalAlpha=.065-i*.007;
        const strip=boatSprite.height*70/425;
        ctx.drawImage(boatSprite,0,i*strip,boatSprite.width,strip,-79+Math.sin(t*.8+i)*1.3,16-i*1.6,158,1.8);
      }
      ctx.globalAlpha=.92;
      const vessel=featured.boat;
      ctx.drawImage(boatSprite,vessel.left,vessel.top,vessel.width,vessel.height);
      if(characters.ready&&inhabitants.ready){
        const strokePeriod=3.6,pose=movement.activityAt('row',rowing?t:0,0,strokePeriod);
        if(!rowing)Object.assign(pose,{handX:0,handY:0,lean:0,nod:0,sway:0});
        const p={art:characters.sprites.boatman,h:vessel.crewHeight};
        const crew=inhabitants.sprite(ctx,{p,x:vessel.crewX,y:vessel.deckY,pose,walking:false,direction:1},t);
        const pole=featured.poleThrough(crew.hands);
        stroke([[pole.top.x,pole.top.y],[pole.tip.x,pole.tip.y]],'#65563d',.9);
        const length=Math.hypot(pole.tip.x-pole.top.x,pole.tip.y-pole.top.y),dx=(pole.tip.x-pole.top.x)/length,dy=(pole.tip.y-pole.top.y)/length;
        for(let knot=8;knot<length;knot+=10){const px=pole.top.x+dx*knot,py=pole.top.y+dy*knot;stroke([[px-dy*.7,py+dx*.7],[px+dy*.7,py-dx*.7]],'#8d7b55',.55);}
        // Small grips cover the pole at both hands; the rest of the shaft
        // follows the same two deformed anchors as the boatman's arms.
        for(const hand of crew.hands)ellipse(hand.x,hand.y,.8,1.25,'#bd9670',false);
        if(rowing){
          const stroke=Math.sin((t%strokePeriod)/strokePeriod*Math.PI*2);
          ctx.globalAlpha=.18+.12*Math.max(0,stroke);ellipse(pole.tip.x,pole.tip.y,3.2+Math.max(0,stroke)*2.2,.8+Math.max(0,stroke)*.35,'#a69b78',false);ctx.globalAlpha=.92;
        }
        disturbBoat(id,x,y,s,t,direction,rowing,pole.tip);
        // The near gunwale covers the soles without concealing the legs.
        boatRim();
      }else{
        person(vessel.crewX,vessel.deckY,1.4,rowing?t:0,1,'#828774',false);
      }
      ctx.globalAlpha=.16;
      for(let i=0;i<4;i++)stroke([[-78-i*5,8+i*3],[-25,9+i*3],[40+i*5,8+i*3]],'#77806b',.5);
      ctx.restore();return;
    }
    ctx.globalAlpha=.18;
    for(let i=0;i<5;i++)stroke([[-75-i*4,9+i*3],[-30,10+i*3],[17+i*3,9+i*3],[64+i*3,10+i*3]],'#777a60',.5);
    ctx.globalAlpha=1;
    shape([[-68,-3],[-56,9],[40,11],[65,-2],[45,2],[-42,1]],'#96866a');
    stroke([[-63,1],[-49,6],[39,8],[57,1]],ink,.6);
    shape([[-46,-6],[-20,-9],[48,-6],[63,-2],[42,3],[-42,1],[-68,-3]],'#b3a181');
    for(let i=-35;i<43;i+=9)stroke([[i,-5],[i+2,1]],'#736b54',.55);
    // Woven arched shelter, drawn in the same miniature ink scale as the street.
    ctx.beginPath();ctx.moveTo(-24,-5);ctx.bezierCurveTo(-25,-40,25,-41,27,-5);ctx.closePath();
    ctx.fillStyle='#b7ac88';ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=.8;ctx.stroke();
    for(let i=0;i<7;i++){
      const p=i*5;
      ctx.beginPath();ctx.moveTo(-23+p,-5);ctx.bezierCurveTo(-25+p,-28,-8+p,-39,8+p*.55,-25);ctx.strokeStyle='#6d6c55';ctx.lineWidth=.45;ctx.stroke();
    }
    for(let j=0;j<4;j++)stroke([[-20,-10-j*4],[22,-10-j*4]],'#77705970',.45);
    person(-43,-5,.85,t,1,'#777c6d',false);
    const angle=Math.sin(t*.7)*9;
    stroke([[-40,-20],[-23+angle,21]],'#635d47',1.15);
    stroke([[-25+angle,18],[-22+angle,24]],'#635d47',2.2);
    shape([[37,-6],[43,-14],[50,-13],[55,-5]],'#9b9073');
    stroke([[40,-8],[51,-7]],ink,.55);
    ctx.restore();
  }
  function basket(x,y,size=1){
    ctx.save();ctx.translate(x,y);ctx.scale(size,size);
    shape([[-7,-6],[8,-6],[6,2],[-5,2]],'#aaa083',.6);
    ellipse(.5,-6,7.5,2,'#bdb194');
    for(let i=-4;i<=5;i+=2)stroke([[i,-5],[i*.8,1]],'#77745d',.4);
    stroke([[-6,-2],[7,-2]],'#77745d',.4);
    ctx.restore();
  }
  function carrier(p,pose){
    const y=streetY(pose.x)+1;
    const result=person(pose.x,y,p.s,pose.phase,pose.direction,p.c,pose.moving,streetY);
    ctx.save();ctx.translate(pose.x,y);ctx.scale(pose.direction,1);
    const bob=pose.moving?Math.sin(pose.phase)*1.1:0;
    stroke([[-20,-29+ bob],[0,-31],[22,-29-bob]],'#7a735a',1.2);
    stroke([[-19,-29+bob],[-19,-8+bob]],'#776e55',.55);
    stroke([[21,-29-bob],[21,-8-bob]],'#776e55',.55);
    basket(-19,-6+bob,.86);basket(21,-6-bob,.92);
    ctx.restore();
    return result;
  }
  function cart(pose){
    const y=streetY(pose.x);
    ctx.save();ctx.translate(pose.x,y);ctx.scale(pose.direction,1);
    const cartGround=localX=>streetY(pose.x+localX*pose.direction)-y;
    person(-30,cartGround(-30),1.36,pose.phase,1,'#96917b',pose.moving,cartGround);
    stroke([[-23,-18],[-7,-15],[27,-15]],'#736c55',1.2);
    shape([[-7,-24],[24,-24],[26,-11],[-8,-11]],'#aea181',.7);
    for(let i=-3;i<24;i+=5)stroke([[i,-23],[i,-12]],'#776c53',.45);
    for(const wx of [-4,22]){
      ellipse(wx,-5,5.8,5.8,'#b7aa89');
      for(let j=0;j<6;j++){const a=j*Math.PI/3+pose.x*.13;stroke([[wx,-5],[wx+Math.cos(a)*5,-5+Math.sin(a)*5]],'#686651',.55);}
      ellipse(wx,-5,1,1,'#65624e');
    }
    basket(5,-25,.83);basket(17,-25,.71);
    ctx.restore();
    const personX=pose.x-pose.direction*30,personY=streetY(personX);
    return {hand:{x:personX+pose.direction*7*1.36,y:personY-16*1.36}};
  }
  function streetDog(){
    const pose=world.pedestrianAt({from:980,to:1150,speed:17,pause:4,offset:7},state.time);
    ctx.save();ctx.translate(pose.x,streetY(pose.x)+3);ctx.scale(pose.direction,1);
    const step=pose.moving?Math.sin(pose.phase)*2.4:0;
    for(const [x,phase] of [[-7,1],[-4,-1],[5,-1],[8,1]])stroke([[x,-8],[x+step*phase,0],[x+step*phase+2,0]],'#756e55',1.1);
    ellipse(0,-11,11,4.5,'#b0a58a');ellipse(10,-15,4.1,4.4,'#b4a98b');
    shape([[8,-18],[8,-22],[11,-19]],'#92876b',.5);shape([[13,-15],[17,-14],[15,-12],[12,-12]],'#b4a98b',.5);
    ellipse(12,-16,.55,.6,'#565344',false);
    ctx.beginPath();ctx.moveTo(-10,-12);ctx.quadraticCurveTo(-17,-15-Math.sin(state.time*4)*2,-14,-20);ctx.strokeStyle='#81765b';ctx.lineWidth=1.3;ctx.stroke();
    ctx.restore();
  }
  function drawActors(){
    const layerOrigin=Math.floor(state.camera)-80,layerWidth=Math.ceil(state.width/state.scale)+160,density=Math.min((devicePixelRatio||1)*state.scale,4);
    // Canvas dimensions are integers. Comparing to a fractional height reset
    // the backing store on every frame at fractional zoom/DPR values.
    const pixelWidth=Math.ceil(layerWidth*density),pixelHeight=Math.ceil(H*density);
    if(actors.width!==pixelWidth)actors.width=pixelWidth;
    if(actors.height!==pixelHeight)actors.height=pixelHeight;
    actorContext.setTransform(1,0,0,1,0,0);actorContext.clearRect(0,0,actors.width,actors.height);actorContext.setTransform(density,0,0,density,-layerOrigin*density,0);
    ctx=actorContext;ctx.globalAlpha=.91;
    const range=[state.camera,state.camera+state.width/state.scale];
    let umbrellaCount=0;
    inhabitants.draw(ctx,state.time,range,streetY,(p,t)=>life.walkerAt(p,t),person,
      ()=>districts.furniture(ctx,artwork,range[0],range[1]),life.frame,(item,result)=>{
        if(window.QingmingWeather.drawUmbrella(ctx,weatherSample,item,result))umbrellaCount++;
      },(p,kind)=>window.QingmingNight.crowdPresence(nightLevel,p,kind));
    for(const p of pedestrians){
      const pose=life.walkerAt(p,state.time);
      if(pose.x<range[0]-85||pose.x>range[1]+85)continue;
      const presence=window.QingmingNight.crowdPresence(nightLevel,p,'walker');
      if(presence<=.01)continue;
      ctx.save();ctx.globalAlpha*=presence;
      let result,x=pose.x,y=streetY(pose.x);
      if(p.cart){result=cart(pose);x=pose.x-pose.direction*30;y=streetY(x);}
      else if(p.carry)result=carrier(p,pose);
      else result=person(x,y,p.s,pose.phase,pose.direction,p.c,pose.moving,streetY);
      const item={p:{...p,h:pedestrianHeight(p.s)},x,y,direction:pose.direction};
      if(window.QingmingWeather.drawUmbrella(ctx,weatherSample,item,result))umbrellaCount++;
      ctx.restore();
    }
    window.StreetDetails.draw(ctx,life.frame,range,inhabitants.storyHands);
    streetDog();
    if(!aboard()&&player.x>range[0]-60&&player.x<range[1]+60&&protagonist())umbrellaCount++;
    painting.dataset.umbrellas=String(umbrellaCount);
    ctx=mainContext;ctx.drawImage(actors,0,0,actors.width,actors.height,layerOrigin,0,layerWidth,H);
    window.BridgeRailing.draw(ctx,artwork,range[0],range[1]);
    districts.foreground(ctx,artwork,range[0],range[1]);
    window.BridgeArt.drawRope(ctx,crossing,towHand,state.time);
    // Small objects closest to the viewer pass in front of the moving figures.
    basket(421,478,.95);basket(866,478,1.1);
  }
  const streetY=world.streetY;
  function cameraForPlayer(){return clamp(player.x-state.width*.44/state.scale,MIN,state.max);}
  function setFollow(follow){
    player.follow=follow;document.body.classList.toggle('browsing',!follow);
    const button=document.querySelector('#follow');button.setAttribute('aria-label',aboard()?'回到船只':'回到行人');button.title=button.getAttribute('aria-label');button.tabIndex=follow?-1:0;button.setAttribute('aria-hidden',String(follow));
  }
  function announce(message){if(status.textContent!==message){status.textContent=message;canvas.setAttribute('aria-label',`${sceneDescription}。${message}`);}}
  function resume(){if(!state.running){state.running=true;updateMotion();}}
  function frameCrossing(){
    const viewWidth=Math.max(330,Math.min(1100,state.width/state.baseScale));
    state.scale=state.width/viewWidth;state.zoom=state.scale/state.baseScale;
    state.max=MAX-viewWidth;state.target=(viewWidth<600?1515:1560)-viewWidth/2;
    state.viewY=clamp(485-state.height*.62/state.scale,0,Math.max(0,H-state.height/state.scale));state.storyView=true;setFollow(false);
    const zoom=document.querySelector('#zoom');zoom.setAttribute('aria-pressed',String(state.zoom>1.05));
    zoom.setAttribute('aria-label',state.zoom>1.05?'还原画卷':'放大细节');
  }
  function startCrossing(){
    if(aboard()){announce('下船后可到虹桥帮忙');return;}
    if(crossing.active){if(crossing.joined)frameCrossing();else joinCrossing();return;}
    if(crossing.start()){crossing.recognized=!!(savedSketch?.helpedEver||savedSketch?.helped);storyShot=null;walkInput.clear();travel(window.BridgeStory.station-18);}
    resume();frameCrossing();announce('货船正在靠近虹桥，船工会向桥边抛绳');
  }
  function joinCrossing(){
    if(!crossing.active||aboard())return;
    resume();walkInput.clear();
    if(Math.abs(player.x-window.BridgeStory.station)<3)beginAction('tow');
    else travel(window.BridgeStory.station,'tow');
    frameCrossing();
  }
  function updateCrossingUI(){
    const x=(window.BridgeStory.station-8-state.camera)*state.scale;
    const y=(streetY(window.BridgeStory.station)+49-state.viewY)*state.scale;
    const visible=x>35&&x<state.width-35&&y>30&&y<state.height-65;
    towRope.hidden=!visible||!crossing.busy||crossing.joined;
    towGrip.hidden=!visible||!crossing.joined||!crossing.working;
    for(const button of [towRope,towGrip]){button.style.left=`${x}px`;button.style.top=`${y}px`;}
    towGrip.setAttribute('aria-valuenow',String(Math.round(crossing.tension*100)));
    towGrip.setAttribute('aria-valuetext',crossing.tension>.85?'用力过猛，放缓':crossing.tension>.3?'缆绳绷紧':'缆绳松开');
    towGrip.dataset.strain=String(crossing.tension>.85);
    towGrip.querySelector('span').textContent=towLatch?'松绳':'向左拉';
    const start=document.querySelector('#bridgeStart');start.dataset.active=String(crossing.active);
    start.setAttribute('aria-label',crossing.active?(crossing.joined?'查看虹桥过船':'到桥边接绳'):'体验虹桥过船');
    start.disabled=!state.loaded||!boatSprite.width||!characters.ready;
    painting.dataset.crossing=crossing.stage;painting.dataset.crossingProgress=crossing.progress.toFixed(3);
    painting.dataset.crossingRig=crossing.rig.toFixed(3);painting.dataset.towTension=crossing.tension.toFixed(3);
    painting.dataset.towWork=crossing.work.toFixed(3);painting.dataset.towJoined=String(crossing.joined);
    painting.dataset.sketch=String(!!savedSketch);
  }
  function captureStory(){
    if(storyShot||!artwork.complete||!boatSprite.width)return;
    const paper=document.createElement('canvas');paper.width=900;paper.height=530;const c=paper.getContext('2d');
    const left=1240,top=330,w=610,h=360,dpr=canvas.width/state.width;
    const sx=(left-state.camera)*state.scale,sy=(top-state.viewY)*state.scale;
    if(sx>=0&&sy>=0&&sx+w*state.scale<=state.width&&sy+h*state.scale<=state.height){
      c.drawImage(canvas,sx*dpr,sy*dpr,w*state.scale*dpr,h*state.scale*dpr,0,0,900,530);
    }else{
      c.scale(900/w,530/h);c.translate(-left,-top);c.drawImage(artwork,0,0);
      const sample=Object.assign(new window.BridgeStory.Crossing(),{stage:'guide',rig:1,progress:.32,time:crossing.time});
      sample.joined=crossing.participated;sample.tension=crossing.participated?.56:0;
      window.BridgeArt.drawShip(c,sample,boatSprite,inhabitants,characters,state.time);
      if(inhabitants.ready){
        let hand=null;
        const reactions=sample.residents(world);
        for(const p of population.residents.filter(p=>p.layer==='bridge')){
          const pose={...population.residentPose(p,state.time),...reactions[p.x]?.pose};
          inhabitants.sprite(c,{p,x:p.x,y:streetY(p.x),pose,walking:false,direction:reactions[p.x]?.direction??p.direction,ground:streetY},state.time);
        }
        if(characters.ready&&crossing.participated)hand=inhabitants.sprite(c,{p:{art:characters.sprites.painter,h:featured.heroHeight},x:window.BridgeStory.station,y:streetY(window.BridgeStory.station),pose:{phase:0,handX:7,handY:2,lean:-.035,nod:.04},walking:false,direction:1,ground:streetY},state.time).hand;
        window.BridgeArt.drawRail(c,artwork);
        window.BridgeArt.drawRope(c,sample,hand,state.time);
      }
    }
    storyShot=paper.toDataURL('image/jpeg',.9);
  }
  function saveStory(){
    captureStory();if(!storyShot)return;
    savedSketch={...crossing.result,helpedEver:!!(savedSketch?.helpedEver||savedSketch?.helped||crossing.result?.helped),image:storyShot};
    try{localStorage.setItem('qingming-bridge-sketch-v1',JSON.stringify(savedSketch));}catch{}
    document.querySelector('#towMemo').hidden=false;
    announce(crossing.result?.helped?'你帮助货船通过虹桥，画稿已收好':'货船已通过虹桥，旁观画稿已收好');
  }
  function openSketch(){
    if(!savedSketch)return;crossing.pull(0);sketchWasRunning=state.running;state.running=false;updateMotion();
    showSketchScene('bridge');sketchDialog.showModal();
  }
  function travel(x,pending=null){
    if(aboard())return;
    if(pending!=='tow'){crossing.release();towLatch=false;towPointer=null;towGrip.classList.remove('pulling');state.storyView=false;}
    ferry.hold=false;stopAuto();resume();setFollow(true);player.goal=clamp(x,MIN+70,MAX-65);player.pending=pending;player.action=null;
    announce(pending?`行人正在前往${pending==='tow'?'虹桥':spots[pending].label}`:'行人正在前往所选位置');
  }
  function callNearestFerry(){
    if(aboard()){setFollow(true);state.target=cameraForPlayer();return;}
    if(hailPending||crossing.active){setFollow(true);state.target=cameraForPlayer();return;}
    hailPending=true;
    const berth=Math.abs(player.x-world.berths.west.shoreX)<=Math.abs(player.x-world.berths.east.shoreX)?'west':'east';
    const id=berth==='west'?'landing':'dock';
    travel(spots[id].stop,id);updateHailUI();announce('画师走向河岸，准备招手候船');
  }
  function updateHailUI(){
    hailFerry.dataset.active=String(hailPending||aboard());
    hailFerry.querySelector('span').textContent=hailPending?'候船':aboard()?'行舟':'招船';
    hailFerry.setAttribute('aria-label',hailPending?'画师正在招手等船':aboard()?'回到行舟画面':'招手乘船');
  }
  function board(){
    if(Math.abs(player.x-world.berths[ferry.berth].shoreX)>22||!world.boardFerry(ferry))return;
    stopAuto();resume();setFollow(true);walkInput.clear();player.velocity=0;
    player.goal=null;player.pending=null;player.action='voyage';player.actionTime=0;
    player.pose=world.passengerPose(ferry);updatePlay();
    hailPending=false;updateHailUI();announce('画师正在登船');
  }
  function beginAction(id){
    if(id==='tow'){
      player.goal=null;player.pending=null;player.velocity=0;player.moving=false;player.facing=1;
      if(crossing.join()){player.action='tow';frameCrossing();announce('已接住缆绳，按住向左拉，松手放绳');}else {player.action=null;if(crossing.stage==='approach')player.pending='tow';}
      return;
    }
    player.action=id;player.actionTime=0;player.goal=null;player.pending=null;player.moving=false;player.velocity=0;
    player.facing=id==='tea'?-1:1;
    if(id==='bridge'){birds.active=true;birds.time=0;birds.cycle++;}
    if(spots[id].berth){
      const ready=['docked','moored'].includes(ferry.mode)&&ferry.berth===spots[id].berth;
      if(ready){board();return;}
      ferry.hold=true;world.summonFerry(ferry,spots[id].berth);
    }
    if(id==='tea')sound.clink();
    announce({tea:'行人在茶铺饮茶',bridge:'行人在桥头喂鸟',dock:'行人在东岸等船',landing:'行人在西岸等船'}[id]);
  }
  function activateSpot(id){
    if(aboard())return;
    if(spots[id].berth&&Math.abs(player.x-spots[id].stop)<22&&['docked','moored'].includes(ferry.mode)&&ferry.berth===spots[id].berth){board();return;}
    travel(spots[id].stop,id);
  }
  function cancelJourney(keepMomentum=false){
    if(aboard())return;
    crossing.release();towLatch=false;towPointer=null;towGrip.classList.remove('pulling');state.storyView=false;
    stopAuto();player.goal=null;player.pending=null;player.action=null;ferry.hold=false;
    if(hailPending){hailPending=false;updateHailUI();}
    if(!keepMomentum){walkInput.clear();player.velocity=0;player.moving=false;}
  }
  function browse(){cancelJourney();setFollow(false);announce('正在浏览画卷');}
  function walkingInput(dir){
    if(aboard())return;
    cancelJourney(true);resume();setFollow(true);
    announce(dir>0?'行人向右走':'行人向左走');
  }
  function protagonist(){
    const x=player.x,y=player.pose?.y??streetY(x),phase=player.phase,s=player.pose?.scale??1.5;
    if(inhabitants.ready){
      // Shore and ferry use the same adult height; boarding does not resize him.
      const p=characters.ready?{id:'hero',art:characters.sprites.painter,h:featured.heroHeight}:{id:'hero',sprite:0,outfit:1,h:featured.heroHeight,phase:0};
      const detailScale=p.h/90;
      const activity=player.action==='tea'?'drink':player.action==='bridge'?'trade':'look';
      const pose={...movement.activityAt(activity,player.action?player.actionTime:state.time,0,5.5),phase};
      if(!aboard())pose.gaitWeight=clamp(Math.abs(player.velocity)/movement.speeds.walk,0,1);
      if(player.action==='tea'){pose.handY=-9*pose.gesture*detailScale;pose.handX=-3.5*pose.gesture*detailScale;}
      if(player.action==='tow'){pose.handX=5+crossing.tension*3;pose.handY=2;pose.lean=-.055*crossing.tension;pose.nod=.04;pose.sway=0;}
      if(dockAction()&&ferry.mode==='approaching'){
        const wave=.72+Math.sin(player.actionTime*3.2)*.22;pose.handX=7;pose.handY=-11*wave;pose.lean=-.025;pose.nod=.045;pose.sway=0;
      }
      const studyTime=crossing.stage==='record'?4.5:player.idleTime%13;
      const umbrellaOpening=window.QingmingWeather.umbrellaProgress(weatherSample,p)>0;
      const unfurl=characters.ready&&!umbrellaOpening&&!aboard()&&!player.moving&&!player.action?clamp((studyTime-3.5)/.9,0,1)*clamp((10-studyTime)/.9,0,1):0;
      if(unfurl){pose.handY=-8*unfurl*detailScale;pose.handX=-2*unfurl*detailScale;pose.nod=.065*unfurl;}
      const result=inhabitants.sprite(ctx,{p,x,y:y+(aboard()&&ferry.mode==='sailing'?Math.sin((state.time+3)*.7)*.6:0),
        pose,walking:player.moving,direction:player.facing,ground:aboard()?null:streetY},state.time);
      towHand=player.action==='tow'?result.hand:null;
      if(player.action==='tea'){
        const hand=result.hand;ctx.save();ctx.translate(hand.x,hand.y);ctx.scale(detailScale,detailScale);
        shape([[-2.1,-1.7],[2.1,-1.7],[1.5,.6],[-1.5,.6]],'#bdc0a5',.45);ctx.restore();
      }
      if(unfurl>.02){
        const hand=result.hand,sw=18*unfurl;
        ctx.save();ctx.translate(hand.x,hand.y);ctx.scale(player.facing*detailScale,detailScale);
        shape([[0,-1],[sw,-3],[sw,9],[0,11]],'#e1d0a7',.5);
        stroke([[0,-2],[0,12]],'#776347',1.1);stroke([[sw,-4],[sw,10]],'#776347',1.1);
        ctx.save();ctx.beginPath();ctx.rect(1,0,Math.max(0,sw-2),8);ctx.clip();
        stroke([[2,6],[5,3],[9,4],[12,1],[16,3]],'#77725b',.45);
        stroke([[3,8],[7,6],[12,7],[16,5]],'#888268',.35);ctx.restore();ctx.restore();
      }
      return window.QingmingWeather.drawUmbrella(ctx,weatherSample,{p,x,y,direction:player.facing},result);
    }
    ctx.save();ctx.translate(x,y+(ferry.mode==='sailing'?Math.sin((state.time+3)*.7)*.6:0));ctx.scale(player.facing*s,s);
    const stride=player.moving?Math.sin(phase):0,bob=player.moving?Math.cos(phase*2)*.3:0;
    ellipse(0,.5,7.4,1.25,'#615f4530',false);
    stroke([[-2,-6],[-2-stride*3,-1],[-4-stride*3,0]],'#504b3d',1.5);
    stroke([[2,-6],[2+stride*3,-1],[5+stride*3,0]],'#504b3d',1.5);
    ctx.translate(0,bob);
    // Long robe, folded collar, belt, cloth bag and tied hair.
    const cloth=ctx.createLinearGradient(-6,-19,6,-10);cloth.addColorStop(0,'#737e71');cloth.addColorStop(.48,'#98a08b');cloth.addColorStop(.7,'#828d7d');cloth.addColorStop(1,'#70796c');
    shape([[-3,-25],[2,-25],[5,-21],[4,-16],[6+stride*.5,-5],[1,-4],[-6,-5],[-4,-16],[-5,-21]],cloth,.55);
    shape([[-2,-25],[1,-21],[3,-25],[2,-22],[-1,-18]],'#d5c8a9',.4);
    stroke([[-3,-17],[4,-17]],'#514f40',1.05);
    stroke([[0,-17],[-1,-6],[1,-5]],'#525b50',.5);
    stroke([[-3,-15],[-4,-7]],'#a6ac91',.45);
    stroke([[3,-14],[4,-6]],'#555f53',.45);
    for(let i=0;i<4;i++)stroke([[-3+i*1.7,-13],[-3+i*1.7+Math.sin(i)*.5,-6]],'#696f5a55',.35);
    shape([[-3,-24],[-6,-17],[-8,-17],[-6,-25]],'#a79c7e',.45);
    shape([[-8,-18],[-3,-17],[-2,-10],[-7,-9],[-9,-12]],'#a89b7a',.55);
    stroke([[-7,-16],[-3,-14],[-7,-11]],'#746a53',.5);
    let lift=0;
    if(player.action==='tea') lift=Math.sin(clamp((player.actionTime-.7)/3.5,0,1)*Math.PI);
    if(player.action==='bridge') lift=Math.max(0,Math.sin(player.actionTime*2.4))*Math.exp(-player.actionTime*.28);
    if(dockAction()&&ferry.mode==='approaching')lift=.65+Math.sin(player.actionTime*3)*.3;
    const handY=-14-lift*10;
    shape([[2,-23],[5,-22],[6-stride,-17],[9-stride,handY],[7-stride,handY+3],[2,-16]],'#879184',.5);
    ellipse(9-stride,handY,.9,1.1,'#cab798');
    if(player.action==='tea'){
      shape([[7,handY-2],[12,handY-2],[11,handY+1],[8,handY+1]],'#bdc0a5',.45);
      stroke([[7,handY-2],[12,handY-2]],'#555b4b',.6);
    }
    ellipse(.4,-28.3,2.7,3.5,'#cbb896');
    shape([[-2.5,-29],[-3,-32],[.7,-33],[3,-30],[2,-29],[0,-30]],'#4c5146',.45);
    ellipse(-1.7,-32.5,1.6,1.2,'#4c5146');
    stroke([[2.8,-28],[3.5,-27.3],[2.7,-26.8]],'#665b47',.45);
    stroke([[1.7,-28.6],[2.3,-28.6]],'#4a4c3e',.55);
    ctx.restore();
    const p={id:'hero',h:featured.heroHeight};
    return window.QingmingWeather.drawUmbrella(ctx,weatherSample,{p,x,y,direction:player.facing},{hand:{x:x+player.facing*9*s,y:y+handY*s}});
  }
  function bird(x,y,t,flight=false,dir=1){
    ctx.save();ctx.translate(x,y);ctx.scale(dir,1);
    ellipse(0,0,3.5,1.9,'#7d7b65');ellipse(3.2,-1.4,1.6,1.55,'#777764');
    stroke([[4.5,-1.4],[6,-1]],'#75694b',.6);
    stroke([[-2,0],[-5,-1]],ink,.8);
    if(flight){const flap=Math.sin(t*13)*5;stroke([[-1,0],[-4,-3-flap],[-7,-2-flap]],ink,1);stroke([[0,0],[1,-3-flap],[4,-4-flap]],ink,.8);}
    else {stroke([[-1,2],[-1,4],[0,4]],ink,.5);stroke([[2,2],[2,4],[3,4]],ink,.5);}
    ctx.restore();
  }
  function drawBirds(){
    const b=birds.time;
    for(let i=0;i<6;i++){
      const baseX=1772+i*12,baseY=473+(i%3)*2;
      let x=baseX,y=baseY,flight=false;
      if(birds.active){
        const p=Math.max(0,b-i*.12);
        if(p<2.2){x=baseX-(baseX-1750-i*4)*(p/2.2);y=baseY-Math.sin(p/2.2*Math.PI)*18;flight=true;}
        else if(p<5){x=1750+i*4;y=baseY+Math.sin(p*7+i)*.6;}
        else if(p<9){const q=(p-5)/4;x=1750+i*4+q*(baseX-1750-i*4);y=baseY-Math.sin(q*Math.PI)*(50+i*7);flight=true;}
      }
      bird(x,y,state.time+i,flight,i%2?1:-1);
    }
    if(birds.active&&b<3.2){ctx.fillStyle='#af9870';for(let i=0;i<9;i++){const p=clamp((b-.25-i*.07)/.8,0,1);if(p>0)ctx.fillRect(1744+i*2+p*12,457+p*18-Math.sin(p*Math.PI)*13,.9,.9);}}
  }
  function teaService(){
    // A kettle and cup are separate from the background so their movement stays local.
    const active=player.action==='tea',t=player.actionTime;
    ctx.save();ctx.translate(665,441);
    const pour=active&&t<1.6?Math.sin(t/1.6*Math.PI):0;
    ctx.rotate(pour*.48);
    ellipse(0,0,4,3.3,'#8d9680');
    stroke([[-3,-1],[-7,-4],[-5,-5]],ink,.65);
    stroke([[3,-1],[6,-3],[7,-2]],ink,.8);
    ellipse(0,-3.1,2,.7,'#a6aa8e');
    ctx.restore();
    if(pour>.2){stroke([[671,441],[675,447]],'#dfd6b9',.7);}
    if(active)steam(674,442,state.time*1.7);
  }
  function pennant(){
    const sway=life.frame.wind*2.3;
    stroke([[816,356],[849,356]],'#6f674f',.9);
    shape([[831,357],[845,357],[845+sway,382],[838+sway,379],[831+sway,382]],'#b4a481',.55);
    stroke([[835,360],[836+sway*.5,374]],'#746d56',.5);
    stroke([[841,360],[841+sway*.5,375]],'#d0c09a',.5);
  }
  let shopHostNearby=false;
  function updateShopHostPosition(){
    const hostX=(380-state.camera)*state.scale,hostY=(483-state.viewY)*state.scale;
    shopHost.style.transform=`translate3d(${hostX}px,${hostY}px,0) translate(-50%,-100%)`;shopHost.style.width=`${38*state.scale}px`;shopHost.style.setProperty('--host-label-size',`${11*state.scale}px`);
    shopHost.hidden=!shopReady||Boolean(nightfall.target)||nightLevel>0||hostX<-60||hostX>state.width+60||hostY<0||hostY>state.height+100;
    const nearby=!shopHost.hidden&&!aboard()&&Math.abs(player.x-380)<(shopHostNearby?190:160);
    if(nearby!==shopHostNearby){
      shopHostNearby=nearby;
      shopHost.classList.toggle('is-nearby',nearby);
    }
  }
  function updateFestivalEntryPosition(){
    if(!festivalEnabled){festivalEntry.hidden=true;return;}
    const gateX=(festivalGate.x-state.camera)*state.scale;
    const gateY=(festivalGate.y-state.viewY)*state.scale;
    festivalEntry.style.transform=`translate3d(${gateX}px,${gateY}px,0) translate(-50%,-50%)`;
    festivalEntry.hidden=gateX<50||gateX>state.width-50||gateY<40||gateY>state.height-50;
  }
  function updateSpotPositions(){
    const oy=-state.viewY*state.scale;
    for(const [id,spot] of Object.entries(spots)){
      const el=document.getElementById(id),x=(spot.x-state.camera)*state.scale,y=spot.y*state.scale+oy;
      el.style.left=`${x}px`;el.style.top=`${y}px`;
      el.style.width=`${spot.width*state.scale}px`;el.style.height=`${spot.height*state.scale}px`;
      const visible=!aboard()&&x>-spot.width*state.scale/2&&x<state.width+spot.width*state.scale/2&&y>-spot.height*state.scale/2&&y<state.height+spot.height*state.scale/2;
      el.hidden=!visible;el.tabIndex=visible?0:-1;
      const ready=spot.berth&&['docked','moored'].includes(ferry.mode)&&ferry.berth===spot.berth;
      const label=ready?'到码头上船':spotLabels[id][player.action===id?1:0];
      if(el.getAttribute('aria-label')!==label)el.setAttribute('aria-label',label);
      el.classList.toggle('active',player.action===id||player.pending===id);
    }
    const ride=document.querySelector('#ferryRide');
    const rideX=(ferry.x-36-state.camera)*state.scale,rideY=(ferry.y-51-state.viewY)*state.scale;
    ride.hidden=aboard()||!['docked','moored'].includes(ferry.mode)||Math.abs(player.x-world.berths[ferry.berth].shoreX)>22||rideX<-20||rideX>state.width+20||rideY<-20||rideY>state.height+20;
    ride.style.left=`${rideX}px`;ride.style.top=`${rideY}px`;
    document.querySelector('#left').disabled=aboard();document.querySelector('#right').disabled=aboard();
    updateCrossingUI();
    painting.dataset.playerX=player.x.toFixed(1);painting.dataset.playerY=(player.pose?.y??streetY(player.x)).toFixed(1);
    painting.dataset.walkSpeed=player.velocity.toFixed(1);painting.dataset.walkInput=String(walkInput.direction);
    painting.dataset.action=player.action||'idle';
    painting.dataset.mode=aboard()?ferry.mode:player.moving?'walking':player.follow?'following':'browsing';
    painting.dataset.ferry=ferry.mode;painting.dataset.ferryX=ferry.x.toFixed(1);painting.dataset.berth=ferry.berth;
    painting.dataset.population=String(population.residents.length+population.walkers.length+pedestrians.length+1);
    painting.dataset.visiblePeople=String(inhabitants.visible);painting.dataset.crowdPhase=inhabitants.phaseSample.toFixed(3);
    painting.dataset.peopleReady=String(inhabitants.ready);painting.dataset.district=state.camera+state.width/state.scale/2<0?'west':state.camera+state.width/state.scale/2>2172?'east':'central';
    painting.dataset.heroReady=String(characters.ready);painting.dataset.heroHeight=String(featured.heroHeight);
    painting.dataset.heroAction=player.action||(!player.moving&&player.idleTime%13>3.5&&player.idleTime%13<10?'study':'idle');
    painting.dataset.zoom=state.zoom.toFixed(2);painting.dataset.trips=String(ferry.trips);painting.dataset.running=String(state.running);
    painting.dataset.hail=hailPending?'waiting':aboard()?'aboard':'idle';
    painting.dataset.storyStage=life.frame.stories.map(s=>`${s.id}:${s.stage}`).join(',');
    painting.dataset.storyPhase=life.frame.stories.map(s=>`${s.id}:${s.t.toFixed(2)}`).join(',');
    painting.dataset.storyMoving=String(Object.values(life.frame.actors).filter(a=>a.walking).length);
    painting.dataset.cargo=String(life.frame.cargoActive);
    const winter=seasonController.id==='winter',weatherName=seasons.profiles[seasonController.id].weather;
    const weatherButton=document.querySelector('#weatherStart'),weatherActive=winter?snowing:rainEvent.active;
    weatherButton.dataset.active=String(weatherActive);weatherButton.setAttribute('aria-pressed',String(weatherActive));
    weatherButton.setAttribute('aria-label',winter?(snowing?'停止落雪':'开始落雪'):weatherActive?`${weatherName}：${weatherSample.label}`:`体验${weatherName}`);weatherButton.title=weatherButton.getAttribute('aria-label');weatherButton.querySelector('span').textContent=winter?(snowing?'停雪':'落雪'):'时雨';
    painting.dataset.weather=weatherSample.stage;painting.dataset.rain=weatherSample.rain.toFixed(3);painting.dataset.wet=weatherSample.wet.toFixed(3);
    updateHailUI();
  }
  function westLanding(){
    // Timber steps connect the stone quay to the boarding plank.
    ctx.save();ctx.globalAlpha=.8;
    shape([[562,477],[576,477],[600,541],[584,541]],'#a39778',.65);
    shape([[576,477],[579,479],[603,544],[600,541]],'#847c61',.55);
    stroke([[563,478],[585,541]],'#c6b899',1.1);
    stroke([[575,478],[599,541]],'#635c48',.75);
    for(let i=0;i<10;i++){
      const t=i/9,x=562+22*t,y=478+63*t;
      stroke([[x,y],[x+15,y]],'#655e49',.9);
      stroke([[x+.6,y-1],[x+14,y-1]],'#c6b894',.7);
      for(let j=0;j<3;j++){const start=x+1+j*4;stroke([[start,y+2],[start+2.6,y+2.3],[start+3.3,y+2.1]],'#776e5355',.4);}
    }
    shape([[582,541],[607,541],[607,546],[583,546]],'#9a8b6c',.65);
    for(const [x,y] of [[560,477],[583,540],[605,542]])stroke([[x,y-18],[x,y+18]],'#69634d',2.2);
    stroke([[560,459],[583,522]],'#797054',1.6);
    stroke([[561,469],[584,531]],'#797054',.7);
    for(let i=0;i<4;i++){ctx.globalAlpha=.12-i*.022;stroke([[578-i*2,549+i*3],[610+i*2,550+i*3]],'#687057',.6);}
    ctx.restore();
  }
  function drawTouchRipples(){
    for(let i=ripples.length-1;i>=0;i--){
      const r=ripples[i],age=state.uiTime-r.time;if(age>2.8){ripples.splice(i,1);continue;}
      ctx.save();ctx.strokeStyle='#737a61';ctx.lineWidth=.65;
      for(let j=0;j<3;j++){
        const t=age-j*.26;if(t<0)continue;
        ctx.globalAlpha=(1-t/2.8)*.5;ctx.beginPath();ctx.ellipse(r.x,r.y,7+t*25,2+t*4.5,0,0,Math.PI*2);ctx.stroke();
      }
      ctx.restore();
    }
  }
  function drawRiverSurface(time,min,max){
    ctx.save();ctx.beginPath();ctx.rect(min-2,535,max-min+4,H-535);ctx.clip();ctx.lineCap='round';
    for(const line of water.surfaceLines(time,min,max)){
      ctx.globalAlpha=Math.max(.012,line.alpha);ctx.strokeStyle=line.light?'#dad4b9':'#5e6855';ctx.lineWidth=line.light?1.05:.75;
      ctx.beginPath();ctx.moveTo(line.x,line.y);
      ctx.bezierCurveTo(line.x+line.length*.28,line.y+line.bend,line.x+line.length*.72,line.y-line.bend,line.x+line.length,line.y);ctx.stroke();
    }
    ctx.restore();
  }
  function steam(x,y,t){
    ctx.save();ctx.strokeStyle='#f1ead8';ctx.lineWidth=1.4;
    for(let i=0;i<3;i++){
      const p=((t*.14+i/3)%1);ctx.globalAlpha=Math.sin(p*Math.PI)*.32;
      ctx.beginPath();ctx.moveTo(x+i*3,y-p*27);ctx.bezierCurveTo(x-3+i*3,y-8-p*27,x+7+i*3,y-13-p*27,x+i*3,y-20-p*27);ctx.stroke();
    }ctx.restore();
  }
  function render(){
    const {width,height,scale,camera,time:t}=state;
    if(!state.loaded)return;
    inhabitants.season=seasonController.id;inhabitants.raining=weatherSample.rain>.1;
    inhabitants.motionDensity=Math.min(4,Math.max(1,(devicePixelRatio||1)*scale));
    // Keep the last complete frame while a fast jump reaches an unloaded district.
    // Never draw actors over missing architecture.
    if(!districts.hasRange(camera,camera+width/scale)){
      if(!state.loadingRange){
        state.loadingRange=true;document.querySelector('#loading').style.display='grid';
        districts.loadRange(camera,camera+width/scale).catch(loadError).finally(()=>{
          state.loadingRange=false;document.querySelector('#loading').style.display='none';
        });
      }
      return;
    }
    const visibleRange=[camera,camera+width/scale];
    const nextBackdropKey=[camera,state.viewY,width,height,scale,canvas.width,canvas.height,districts.revision,weatherSample.wet].join(':');
    if(backdropKey!==nextBackdropKey){
      if(backdrop.width!==canvas.width)backdrop.width=canvas.width;
      if(backdrop.height!==canvas.height)backdrop.height=canvas.height;
      backdropContext.setTransform(ctx.getTransform());
      backdropContext.fillStyle='#e2d4b6';backdropContext.fillRect(0,0,width,height);
      backdropContext.save();backdropContext.translate(-camera*scale,-state.viewY*scale);backdropContext.scale(scale,scale);
      backdropContext.imageSmoothingQuality='high';
      districts.draw(backdropContext,artwork,...visibleRange);
      window.QingmingWeather.drawWetGround(backdropContext,weatherSample,visibleRange,streetY);
      backdropContext.restore();backdropKey=nextBackdropKey;
    }
    // Copy at physical pixel size: retain the original high-DPI detail without
    // resampling three large district paintings when the camera is stationary.
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(backdrop,0,0);ctx.restore();
    ctx.save();ctx.translate(-camera*scale,-state.viewY*scale);ctx.scale(scale,scale);
    // Dynamic layers already render above display resolution. Bilinear
    // compositing avoids filtering those changing canvases again every frame.
    ctx.imageSmoothingQuality='low';

    if(threeWater.active){
      const layer=threeWater.render({time:t,camera,viewY:state.viewY,width,height,scale,source:backdrop,backdropKey});
      ctx.save();ctx.globalAlpha=.92;threeWater.composite(ctx,layer);ctx.restore();
    }else drawRiverSurface(t,camera-50,camera+width/scale+50);
    // Light the architecture first. All people, furniture masks, boats and
    // weather then share a transparent foreground that occludes those lights.
    if(nightLevel>0){
      window.QingmingNight.draw(ctx,nightLevel,visibleRange,t,reduced.matches);
      window.QingmingNight.drawSky(ctx,nightLevel,visibleRange,t,reduced.matches,weatherSample.gloom+weatherSample.rain*.5);
      if(nightForeground.width!==canvas.width||nightForeground.height!==canvas.height){
        nightForeground.width=canvas.width;nightForeground.height=canvas.height;
      }
      nightForegroundContext.setTransform(1,0,0,1,0,0);
      nightForegroundContext.clearRect(0,0,nightForeground.width,nightForeground.height);
      nightForegroundContext.setTransform(ctx.getTransform());
      mainContext=nightForegroundContext;ctx=mainContext;
    }
    drawFestivalGate(ctx,reduced.matches?0:t,visibleRange,nightLevel);
    ctx.globalAlpha=.93;
    if(crossing.visible&&camera<1930&&camera+width/scale>1240)window.BridgeArt.drawShip(ctx,crossing,boatSprite,inhabitants,characters,t);
    teaService();pennant();drawBirds();westLanding();drawActors();districts.animate(ctx,t,camera,camera+width/scale,threeWater.active);drawTouchRipples();
    // The mill foreground used to cover the waterfall. Composite its own pass
    // after the mill, but before boats, passengers and weather.
    if(threeWater.active&&camera<-1450&&camera+width/scale>-1560){
      const fall=threeWater.render({time:t,camera,viewY:state.viewY,width,height,scale,pass:1});
      threeWater.composite(ctx,fall);
    }
    drawBoatDisturbances();
    boat(ferry.x,ferry.y,world.ferryGeometry.scale,t+3,ferry.direction,['approaching','departing','returning','sailing'].includes(ferry.mode));
    if(['docked','moored'].includes(ferry.mode)){
      const x=ferry.berth==='east'?2021:599;stroke([[x,535],[ferry.x-49,548]],'#7c7459',.65);
    }
    if(aboard()){
      protagonist();
      ctx.save();ctx.translate(ferry.x,ferry.y+Math.sin((t+3)*.7)*.6);ctx.scale(world.ferryGeometry.scale*ferry.direction,world.ferryGeometry.scale);boatRim();ctx.restore();
    }
    // The ferry and its passenger form one rear layer. Foreground traffic
    // follows in waterline order, including each boat's crew and wake.
    for(const vessel of world.ambientBoats(t,MIN,MAX)){
      boat(vessel.x,vessel.y,vessel.scale,vessel.phase,vessel.direction,true,vessel.id);
    }
    window.QingmingWeather.drawMarketCovers(ctx,weatherSample,visibleRange);
    window.StreetDetails.breeze(ctx,life.frame,[camera,camera+width/scale]);
    steam(298,439,t);steam(404,446,t+2);steam(876,444,t+1);
    window.QingmingWeather.drawRain(ctx,weatherSample,visibleRange,H,reduced.matches);
    seasons.drawAir(ctx,seasonController.id,t,visibleRange,reduced.matches,snowing);
    if(nightLevel>0){
      // Source-atop tints existing foreground pixels without filling its
      // transparent gaps, so the lit windows remain behind each silhouette.
      window.QingmingNight.drawAtmosphere(ctx,nightLevel,visibleRange,'source-atop');
      mainContext=displayContext;ctx=displayContext;ctx.globalAlpha=1;
      ctx.drawImage(nightForeground,camera,state.viewY,width/scale,height/scale);
    }
    drawFestivalLights(ctx,reduced.matches?0:t,visibleRange,nightLevel);
    ctx.restore();ctx.globalAlpha=1;
    // The visible host shares the exact camera of this completed canvas frame.
    // Keep this out of the throttled UI updates to prevent panning judder.
    updateShopHostPosition();updateFestivalEntryPosition();
    if(!storyShot&&crossing.stage==='guide'&&crossing.progress>.25)captureStory();
    // DOM controls and diagnostic attributes do not need to invalidate layout
    // at the same rate as the moving canvas.
    if(state.lastUIUpdate===undefined||state.uiTime-state.lastUIUpdate>=.1){
      slider.value=Math.round((camera-MIN)/(state.max-MIN)*1000);
      slider.style.setProperty('--progress',`${Number(slider.value)/10}%`);
      updateSpotPositions();state.lastUIUpdate=state.uiTime;
    }
  }
  function stopAuto(){if(state.auto){state.auto=false;updatePlay();}}
  function updatePlay(){
    const active=aboard()?state.running:state.auto;
    play.setAttribute('aria-pressed',String(active));
    play.setAttribute('aria-label',aboard()?(state.running?'暂停乘船':'继续乘船'):(state.auto?'停止自动行走':'自动行走'));play.title=play.getAttribute('aria-label');
    play.innerHTML=active?'<svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"/></svg>':'<svg viewBox="0 0 24 24"><path d="m9 6 9 6-9 6Z"/></svg>';
  }
  function updateMotion(){
    updatePlay();sound.setRunning(state.running&&!document.hidden);
    motion.setAttribute('aria-label',state.running?'暂停动画':'播放动画');motion.title=motion.getAttribute('aria-label');
    motion.setAttribute('aria-pressed',String(!state.running));
    motion.innerHTML=state.running?'<svg viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"/></svg>':'<svg viewBox="0 0 24 24"><path d="m9 6 9 6-9 6Z"/></svg>';
  }
  let last=0;
  const frameSample={elapsed:0,count:0,slow:0};
  function updatePlayer(dt,direction){
    if(!state.running)return;
    player.idleTime=player.moving||player.action||aboard()?0:player.idleTime+dt;
    player.moving=false;
    const wasPassenger=aboard(),previousFerryMode=ferry.mode;
    world.stepFerry(ferry,dt);
    if(aboard()){
      player.velocity=0;
      const pose=world.passengerPose(ferry);player.phase+=Math.hypot(pose.x-player.x,pose.y-(player.pose?.y??477))*.18;
      player.pose=pose;player.x=pose.x;player.facing=pose.facing;player.moving=pose.moving;
      if(previousFerryMode!==ferry.mode){
        announce(ferry.mode==='sailing'?'船正在驶向对岸':'船已靠岸，行人正在下船');updatePlay();
      }
      if(player.follow)state.target=cameraForPlayer();
      return;
    }
    if(wasPassenger){
      player.x=world.berths[ferry.berth].shoreX;player.pose=null;player.action=null;player.moving=false;
      setFollow(true);updatePlay();updateHailUI();announce(ferry.berth==='west'?'画师已到西岸':'画师已到东岸');
    }
    if(previousFerryMode!=='docked'&&ferry.mode==='docked'&&dockAction()){
      if(hailPending)board();else announce('船已靠岸，可以上船');
    }
    if(player.action==='tow'){
      if(crossing.joined){player.velocity=0;player.moving=false;return;}player.action=null;
    }
    if(player.action){
      player.actionTime+=dt;
      if(!dockAction()&&player.actionTime>(player.action==='tea'?5.5:6)){player.action=null;announce('行人停在街边');}
    }
    if(birds.active){birds.time+=dt;if(birds.time>10){birds.active=false;birds.time=0;}}
    let dir=direction,speed=movement.speeds.walk;
    if(dir){player.goal=null;player.pending=null;player.action=null;ferry.hold=false;}
    else if(state.auto){dir=state.autoDirection;speed=movement.speeds.auto;}
    const before=player.x,slope=(streetY(before+1)-streetY(before-1))/2;
    const step=movement.stepWalk(before,player.velocity,dt,{
      direction:dir,goal:player.goal,speed:speed/Math.hypot(1,slope),min:MIN+70,max:MAX-65
    });
    player.x=step.x;player.velocity=step.velocity;
    const distance=player.x-before;
    player.moving=Math.abs(distance)>.001||Math.abs(player.velocity)>.1;
    if(Math.abs(distance)>.001)player.facing=Math.sign(distance);
    // The gait uses actual displacement and continues through input events.
    player.phase+=Math.abs(distance)*.15;
    if(step.arrived){player.goal=null;if(player.pending)beginAction(player.pending);else announce('行人已到达');}
    if(state.auto&&(player.x<=MIN+70||player.x>=MAX-65))state.autoDirection*=-1;
    if(player.follow)state.target=cameraForPlayer();
  }
  function frame(now){
    const elapsed=last?(now-last)/1000:0,dt=Math.min(elapsed,.05);last=now;
    if(!document.hidden&&!document.body.classList.contains('in-atlas')&&!festivalWelcome.open&&!state.loadingRange){
      if(elapsed>0){
        frameSample.elapsed+=elapsed;frameSample.count++;if(elapsed>.025)frameSample.slow++;
        if(frameSample.elapsed>=1){
          painting.dataset.fps=(frameSample.count/frameSample.elapsed).toFixed(1);
          painting.dataset.slowFrames=String(frameSample.slow);
          frameSample.elapsed=0;frameSample.count=0;frameSample.slow=0;
        }
      }
      nightLevel=nightfall.step(dt,reduced.matches);
      painting.dataset.night=nightLevel.toFixed(3);
      state.uiTime+=dt;if(state.running)state.time+=dt;
      updatePlayer(dt,walkInput.direction);
      crossing.step(state.running?dt:0,{arriving:player.pending==='tow'});
      weatherSample=seasons.weather(seasonController.id,rainEvent.step(state.running?dt:0),snowing,state.time);
      const weatherMessages={gather:'河面起风，云气渐低',shower:'疏雨落入画卷',downpour:'雨势渐盛',easing:'雨声渐歇，檐水仍在滴落',afterglow:'云开雨过，湿地微光',complete:'雨过天青，街市如常'};
      for(const stage of rainEvent.events)announce(weatherMessages[stage]);
      if(crossing.active&&player.pending==='tow'&&player.x>1190&&!state.storyView)frameCrossing();
      if(player.pending==='tow'&&Math.abs(player.x-window.BridgeStory.station)<2&&crossing.stage==='call')beginAction('tow');
      for(const stage of crossing.events){
        announce(window.BridgeStory.stages[stage]);
        if(stage==='clear'){towLatch=false;towGrip.classList.remove('pulling');if(player.action==='tow'){player.action=null;player.idleTime=0;}}
        if(stage==='complete')saveStory();
      }
      life.advance(state.running?dt:0,state.time,{player,ferry,roadblock:crossing.busy?[1300,1735]:null});
      Object.assign(life.frame.actors,crossing.residents(world));
      if(state.running&&life.shouldCallFerry(state.time,ferry,player))world.summonFerry(ferry,'east');
      state.target=clamp(state.target,MIN,state.max);
      state.camera+=(state.target-state.camera)*(reduced.matches?1:1-Math.exp(-dt*10));
      // End easing below a small fraction of a physical pixel, so an idle
      // camera stops invalidating/uploading the entire backdrop indefinitely.
      if(Math.abs(state.target-state.camera)*state.scale<.01)state.camera=state.target;
      if(player.follow&&state.zoom>1.01)state.viewY+=(followHeight()-state.viewY)*(1-Math.exp(-dt*4));
      sound.update(state.time,state.running,ferry,state.camera,state.width/state.scale);
      sound.street(life.events,state.camera,state.width/state.scale);
      sound.crossing(crossing,state.camera,state.width/state.scale);
      sound.weather(weatherSample);
      const renderStart=performance.now();render();
      state.renderCost=(state.renderCost||0)*.9+(performance.now()-renderStart)*.1;
      if((state.frameCount=(state.frameCount||0)+1)%60===0)painting.dataset.renderMs=state.renderCost.toFixed(1);
      painting.dataset.waterRenderer=threeWater.active?'threejs':'canvas';
    }
    requestAnimationFrame(frame);
  }
  painting.addEventListener('pointerdown',e=>{
    if(e.target.closest('#ferryRide,#towRope,#towGrip,#midautumnEntry,#sunyang'))return;
    painting.focus({preventScroll:true});painting.setPointerCapture(e.pointerId);
    touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(touches.size===2){
      const [a,b]=[...touches.values()];browse();
      state.pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom:state.zoom,wx:state.camera+(a.x+b.x)/2/state.scale,wy:state.viewY+(a.y+b.y)/2/state.scale};
      state.drag=null;return;
    }
    state.drag={id:e.pointerId,x:e.clientX,y:e.clientY,target:state.target,viewY:state.viewY,moved:false};
  });
  painting.addEventListener('pointermove',e=>{
    if(touches.has(e.pointerId))touches.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(state.pinch&&touches.size===2){
      const [a,b]=[...touches.values()],p=state.pinch;
      zoomAt(p.zoom*Math.hypot(a.x-b.x,a.y-b.y)/p.distance,(a.x+b.x)/2,(a.y+b.y)/2);
      state.camera=state.target=clamp(p.wx-(a.x+b.x)/2/state.scale,MIN,state.max);
      state.viewY=clamp(p.wy-(a.y+b.y)/2/state.scale,0,H-state.height/state.scale);return;
    }
    if(state.drag?.id!==e.pointerId)return;
    if(Math.hypot(state.drag.x-e.clientX,state.drag.y-e.clientY)>7&&!state.drag.moved){state.drag.moved=true;browse();painting.classList.add('dragging');}
    if(state.drag.moved){
      state.target=clamp(state.drag.target+(state.drag.x-e.clientX)/state.scale,MIN,state.max);
      if(state.zoom>1)state.viewY=clamp(state.drag.viewY+(state.drag.y-e.clientY)/state.scale,0,H-state.height/state.scale);
    }
  });
  const release=()=>{crossing.pull(0);towLatch=false;towPointer=null;towGrip.classList.remove('pulling');state.drag=null;state.pinch=null;touches.clear();painting.classList.remove('dragging');};
  painting.addEventListener('pointerup',e=>{
    if(state.drag?.id===e.pointerId&&!state.drag.moved&&!state.pinch){
      const x=e.clientX/state.scale+state.camera,y=e.clientY/state.scale+state.viewY;
      const spot=Object.entries(spots).find(([,s])=>Math.abs(x-s.x)<s.width/2&&Math.abs(y-s.y)<s.height/2);
      if(spot)activateSpot(spot[0]);else if(inhabitants.react(x,y,state.time,streetY)){resume();announce('街坊回应招呼');}else if(y>540){
        ripples.push({x,y,time:state.uiTime});if(ripples.length>12)ripples.shift();sound.splash(x,state.camera,state.width/state.scale);
      }else if(y>streetY(x)-55&&y<streetY(x)+35)travel(x);
    }
    touches.delete(e.pointerId);state.drag=null;state.pinch=null;painting.classList.remove('dragging');
  });painting.addEventListener('pointercancel',release);
  painting.addEventListener('dblclick',e=>{if(e.target.closest('button'))return;e.preventDefault();zoomAt(state.zoom>1.05?1:1.65,e.clientX,e.clientY);});
  painting.addEventListener('wheel',e=>{
    e.preventDefault();
    if(e.ctrlKey){zoomAt(state.zoom*Math.exp(-e.deltaY*.008),e.clientX,e.clientY);return;}
    browse();state.target=clamp(state.target+(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)/state.scale,MIN,state.max);
  },{passive:false});
  for(const [id,dir] of [['left',-1],['right',1]]){
    const button=document.getElementById(id);
    button.addEventListener('pointerdown',e=>{
      if(aboard()||e.button!==0)return;
      if(crossing.joined){towLatch=false;crossing.pull(dir<0?.56:.22);button.setPointerCapture(e.pointerId);return;}
      if(walkInput.press(`pointer:${e.pointerId}`,dir,player.x,performance.now(),45))walkingInput(dir);
      button.setPointerCapture(e.pointerId);
    });
    button.addEventListener('pointerup',e=>{crossing.pull(0);releaseWalking(`pointer:${e.pointerId}`);});
    for(const event of ['pointercancel','lostpointercapture'])button.addEventListener(event,e=>{crossing.pull(0);releaseWalking(`pointer:${e.pointerId}`,true);});
    button.addEventListener('click',e=>{if(e.detail===0)travel(player.x+dir*90);});
  }
  function releaseWalking(source,cancel=false){
    const goal=walkInput.release(source,player.x,performance.now(),cancel);
    if(goal!==null)travel(goal);
  }
  play.addEventListener('click',()=>{if(aboard()){state.running=!state.running;updateMotion();return;}crossing.release();state.storyView=false;ferry.hold=false;state.auto=!state.auto;player.goal=null;player.action=null;player.pending=null;if(state.auto){resume();setFollow(true);state.autoDirection=player.facing;}announce(state.auto?'行人自动行走':'行人已停下');updatePlay();});
  motion.addEventListener('click',()=>{state.running=!state.running;updateMotion();});
  slider.addEventListener('input',()=>{browse();state.target=MIN+Number(slider.value)/1000*(state.max-MIN);});
  for(const button of document.querySelectorAll('.district-stop'))button.addEventListener('click',()=>{browse();state.target=clamp(Number(button.dataset.x)-state.width*.5/state.scale,MIN,state.max);});
  document.querySelector('#zoom').addEventListener('click',()=>zoomAt(state.zoom>1.05?1:1.65));
  document.querySelector('#ferryRide').addEventListener('click',board);
  hailFerry.addEventListener('click',callNearestFerry);
  document.querySelector('#nightToggle').addEventListener('click',()=>{
    const active=nightfall.toggle(),button=document.querySelector('#nightToggle');
    sound.setNight(active);
    button.setAttribute('aria-pressed',String(active));
    button.setAttribute('aria-label',active?'切换白天':'切换夜景');
    button.title=active?'白天 · 晨光熹微':'夜景 · 万家灯火';
    button.querySelector('span').textContent=active?'白天':'夜景';
    document.body.classList.toggle('night',active);
    announce(active?'暮色渐浓，沿街人家与商铺次第亮灯':'灯火渐隐，画卷缓缓回到白天');
  });
  document.querySelector('#weatherStart').addEventListener('click',()=>{
    if(seasonController.id==='winter'){snowing=!snowing;announce(snowing?'疏雪落入画卷':'雪停了，屋瓦仍覆着积雪');return;}
    if(rainEvent.active){announce(`${seasons.profiles[seasonController.id].weather}：${weatherSample.label}`);return;}
    rainEvent.start();weatherSample=rainEvent.sample();resume();announce('河面起风，云气渐低');
  });
  const soundButtons=[document.querySelector('#sound'),document.querySelector('#festivalSoundToggle')];
  for(const button of soundButtons)button.addEventListener('click',async()=>{
    soundButtons.forEach(b=>{b.disabled=true;});
    try{
      sound.setRunning((state.running||festivalWelcome.open)&&!document.hidden);
      const enabled=await sound.toggle();
      for(const b of soundButtons){
        b.setAttribute('aria-pressed',String(enabled));b.setAttribute('aria-label',enabled?'关闭背景音乐与环境声':'开启背景音乐与环境声');b.title=b.getAttribute('aria-label');
      }
      painting.dataset.sound=enabled?'on':'off';
    }finally{soundButtons.forEach(b=>{b.disabled=false;});}
  });
  document.querySelector('#follow').addEventListener('click',()=>{setFollow(true);state.target=cameraForPlayer();announce(aboard()?'镜头跟随船只':'镜头跟随行人');});
  for(const id of Object.keys(spots))document.getElementById(id).addEventListener('click',e=>{if(e.detail===0)activateSpot(id);});
  document.addEventListener('keydown',e=>{
    if(document.body.classList.contains('in-atlas'))return;
    if(document.querySelector('#bridgeSketch').open)return;
    if(e.target instanceof HTMLInputElement)return;
    if(crossing.joined&&['ArrowLeft','ArrowRight','KeyE'].includes(e.code)){e.preventDefault();towLatch=false;resume();crossing.pull(e.code==='ArrowRight'?.22:.56);return;}
    if(e.code==='KeyE'&&!e.repeat&&crossing.busy&&Math.abs(player.x-window.BridgeStory.station)<100){e.preventDefault();joinCrossing();return;}
    if(['ArrowLeft','ArrowRight'].includes(e.code)){
      e.preventDefault();if(aboard())return;
      const dir=e.code==='ArrowRight'?1:-1;
      if(!e.repeat&&walkInput.press(e.code,dir,player.x,performance.now()))walkingInput(dir);
    }
    if(e.code==='Space'&&!(e.target instanceof HTMLButtonElement)){e.preventDefault();if(!e.repeat){state.running=!state.running;updateMotion();}}
    if(e.code==='KeyE'&&!e.repeat){const spot=Object.entries(spots).find(([,s])=>Math.abs(player.x-s.stop)<100);if(spot){e.preventDefault();activateSpot(spot[0]);}}
    if(e.code==='Escape'){if(aboard()){state.running=false;updateMotion();}else cancelJourney();announce(aboard()?'乘船已暂停':'行人已停下');}
    if(e.code==='Home'){e.preventDefault();browse();state.target=MIN;}
    if(e.code==='End'){e.preventDefault();browse();state.target=state.max;}
  });
  document.addEventListener('keyup',e=>{if(['ArrowLeft','ArrowRight','KeyE'].includes(e.code))crossing.pull(0);releaseWalking(e.code);});
  const releaseControls=()=>{walkInput.clear();player.velocity=0;player.moving=false;release();};
  addEventListener('blur',releaseControls);
  document.addEventListener('visibilitychange',()=>{releaseControls();last=0;frameSample.elapsed=0;frameSample.count=0;frameSample.slow=0;sound.setRunning((state.running||festivalWelcome.open)&&!document.hidden);});
  document.querySelector('#fullscreen').addEventListener('click',async()=>{
    try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.querySelector('#fullscreen').hidden=true;}
  });
  if(!document.documentElement.requestFullscreen)document.querySelector('#fullscreen').hidden=true;
  document.addEventListener('fullscreenchange',()=>{
    const b=document.querySelector('#fullscreen');b.setAttribute('aria-label',document.fullscreenElement?'退出全屏':'全屏');b.title=b.getAttribute('aria-label');
  });
  document.querySelector('#bridgeStart').addEventListener('click',startCrossing);
  towRope.addEventListener('click',joinCrossing);
  towGrip.addEventListener('pointerdown',e=>{if(e.button!==0||!crossing.joined)return;e.preventDefault();towLatch=false;resume();towPointer={id:e.pointerId,x:e.clientX};towGrip.setPointerCapture(e.pointerId);crossing.pull(.28);towGrip.classList.add('pulling');});
  towGrip.addEventListener('pointermove',e=>{if(towPointer?.id!==e.pointerId)return;crossing.pull(window.BridgeStory.Crossing.dragForce(towPointer.x,e.clientX));});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])towGrip.addEventListener(type,()=>{towPointer=null;crossing.pull(0);towGrip.classList.remove('pulling');});
  towGrip.addEventListener('keydown',e=>{if(e.code==='Enter'&&!e.repeat){e.preventDefault();towLatch=!towLatch;resume();crossing.pull(towLatch?.56:0);towGrip.classList.toggle('pulling',towLatch);}if(e.code==='Space'){e.preventDefault();towLatch=false;resume();crossing.pull(.56);}});
  towGrip.addEventListener('keyup',e=>{if(e.code==='Space'){e.preventDefault();crossing.pull(0);}});
  document.querySelector('#towMemo').addEventListener('click',openSketch);
  document.querySelector('#closeSketch').addEventListener('click',()=>document.querySelector('#bridgeSketch').close());
  sketchDialog.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight'].includes(e.code))return;e.preventDefault();
    const index=sketchScenes.findIndex(scene=>scene.id===activeSketchScene),direction=e.code==='ArrowRight'?1:-1;
    showSketchScene(sketchScenes[(index+direction+sketchScenes.length)%sketchScenes.length].id);
    sketchScenesNav.querySelector('[aria-current="true"]')?.focus();
  });
  document.querySelector('#bridgeSketch').addEventListener('close',()=>{state.running=sketchWasRunning;updateMotion();});
  document.querySelector('#saveSketch').addEventListener('click',()=>{if(!savedSketch)return;const a=document.createElement('a');a.href=savedSketch.image;a.download='虹桥过船.jpg';a.click();});
  reduced.addEventListener('change',e=>{state.running=!e.matches;if(e.matches)stopAuto();updateMotion();});
  addEventListener('resize',resize);
  window.addEventListener('atlas-enter',e=>{
    if(!state.loaded||!Number.isFinite(e.detail?.x))return;
    // Selecting a district moves the visitor as well as the camera. End any
    // old voyage before cancelling the journey, which otherwise ignores input
    // while aboard and restores the passenger position on the next frame.
    if(aboard())Object.assign(ferry,world.createFerry());
    cancelJourney();
    Object.assign(player,{x:clamp(e.detail.x,MIN+70,MAX-65),pose:null,
      phase:0,facing:1,actionTime:0,idleTime:0});
    zoomAt(1);setFollow(true);
    state.camera=state.target=cameraForPlayer();
    painting.dataset.entryX=String(player.x);
    updateHailUI();announce('画师已来到所选街市，可左右行走');
  });
  window.prepareQingmingEntry=async x=>{
    // Match atlas-enter's 1x zoom and the camera's 44% follow position.
    const viewWidth=state.width/state.baseScale;
    const camera=clamp(clamp(x,MIN+70,MAX-65)-viewWidth*.44,MIN,Math.max(MIN,MAX-viewWidth));
    await districts.loadRange(camera,camera+viewWidth);
  };
  let backgroundStarted=false;
  window.warmQingmingDistricts=()=>{
    if(backgroundStarted)return; backgroundStarted=true;
    // Let the selected scene paint before requesting the remaining artwork.
    requestAnimationFrame(()=>setTimeout(()=>districts.load().catch(error=>{
      backgroundStarted=false;console.warn('Background district loading deferred:',error);
    }),500));
  };
  const loadError=()=>{document.querySelector('#loading').hidden=true;document.querySelector('#loading').style.display='none';document.querySelector('#error').hidden=false;window.dispatchEvent(new Event('atlas-error'));};
  artwork.onload=async()=>{
    try{await Promise.all([inhabitants.assetsReady,characters.assetsReady,boatReady]);districts.prepare(artwork);state.loaded=true;document.body.classList.add('ready');window.dispatchEvent(new Event('atlas-ready'));
      painting.dataset.season='spring';painting.dataset.clothing=seasons.profiles.spring.cloth;
      for(const button of seasonControls.querySelectorAll('button'))button.disabled=false;
      let initialSeason=new URLSearchParams(location.search).get('season');try{initialSeason??=localStorage.getItem('qingming-season');}catch{}
      if(initialSeason&&initialSeason!=='spring'&&seasons.profiles[initialSeason])void seasonController.select(initialSeason);}
    catch(error){console.error("街市素材初始化失败",error);loadError();}
  };
  artwork.onerror=loadError;
  artwork.src='assets/street-empty-fast.webp';
  resize();setFollow(true);updatePlay();updateMotion();requestAnimationFrame(frame);
})();
