import {createStreetPeople,population} from './extension-people.js?v=limited-6';
import {createStreetSound} from './extension-motion.js?v=limited-13';
import {createWorkshopState,CRANE,INN} from './extension-workshop-state.js?v=calm-1';
import {createStreetWorkshop} from './extension-workshop.js?v=calm-1';
import {createFlowerShop} from './extension-flower-shop.js?v=flowers-6';
import {ThreeWaterRenderer} from './water-three.js?v=6-river-fade';
import {MillWheel} from './mill-wheel.js?v=4';
import {createRiverBoats} from './river-boats.js?v=8';
import {createBoatSong} from './boat-song.js?v=2';
const MIN=-5430,MAX=7602,SPAN=MAX-MIN,H=724,OVERLAP=100;
const panels=[
  {id:'west-far',x:MIN,w:1729,displayHeight:760,src:'assets/extension-preview/west-far.webp',name:'西郊田畴',kind:'新增 · 西郊'},
  {id:'west-near',x:-3801,w:1729,displayHeight:760,src:'assets/extension-preview/west-near.webp',name:'菜园村居',kind:'新增 · 西郊'},
  {id:'west',x:-2172,w:2272,src:'assets/district-west-fast.webp',name:'水磨作坊',kind:'原有街景'},
  {id:'center',x:0,w:2172,src:'assets/street-empty-fast.webp',name:'茶市与虹桥',kind:'原有街景'},
  {id:'east',x:2072,w:2272,src:'assets/district-east-fast.webp',name:'城门货市',kind:'原有街景'},
  {id:'east-near',x:4244,w:1729,displayHeight:775,src:'assets/extension-preview/east-near.webp',name:'漕运仓场',kind:'新增 · 东岸'},
  {id:'east-far',x:5873,w:1729,displayHeight:775,src:'assets/extension-preview/east-far.webp',name:'柳岸花肆',kind:'新增 · 东岸'}
];
// An opaque local repaint replaces the mismatched eave/awning crossfade.
// Its mask stays outside the repaired canopy and posts; the quay is untouched.
const repairs=[{id:'center-east-shop',name:'交界店铺修补',x:1940,w:420,src:'assets/extension-preview/center-east-seam-repaired-v1.webp',clip:{x:45,y:320,w:334,h:174,feather:8}}];
const $=s=>document.querySelector(s),stage=$('#stage'),canvas=$('#scroll'),ctx=canvas.getContext('2d'),map=$('#map'),mini=$('#minimap'),mc=mini.getContext('2d');
const requestedCenter=Number(new URLSearchParams(location.search).get('at')??NaN);
const sceneParam=new URLSearchParams(location.search).get('scene');
let activeScene=sceneParam==='inn'?'inn':'warehouse';
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)'),sound=createStreetSound();
const state={center:Number.isFinite(requestedCenter)?requestedCenter:sceneParam==='warehouse'?CRANE.x:sceneParam==='inn'?INN.guestX:-2900,zoom:sceneParam?1.3:1,overview:false,seams:false,people:true,auto:false,tourStarted:false,tourComplete:false,ready:false,width:0,height:0,scale:1,left:MIN,top:0,focusY:H/2,flight:null};
state.motion=!reducedMotion.matches;
// Each scene opens close enough to read the hook, the sack and the curtain.
const SCENE_VIEW={warehouse:{center:CRANE.x+15,focusY:340,zoom:2.2},inn:{center:INN.guestX,focusY:400,zoom:2.2}};
if(sceneParam in SCENE_VIEW&&!Number.isFinite(requestedCenter))Object.assign(state,SCENE_VIEW[sceneParam]);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let frame=0,last=0,dirty=true,mapDirty=true,previousArea='',savedCenter=state.center;
// Paint as smoothly as this device allows: 60 fps while a frame is cheap,
// stepping down to 45 or 30 when the crowd makes painting expensive.
let drawCost=8,frameInterval=1000/60;
let motionTime=0,waterTime=0,lastPaint=0,backgroundKey='',backgroundRevision=0,bubbleUntil=0;
const backdrop=document.createElement('canvas'),backdropContext=backdrop.getContext('2d');
// The east wharves sit a little lower than the original scroll's banks.
// Boats are nearer the viewer than the street, so their crews stand clearly
// taller than the 55-unit residents on the bank: 74 and 82 units.
const water=new ThreeWaterRenderer({bankY:542,bankStep:{x:4244,y:549},fadeY:H}),millWheel=new MillWheel();
const boats=createRiverBoats({min:MIN,max:MAX,lanes:[{y:640,speed:9,direction:1,scale:1.75,count:5,singer:1},{y:700,speed:6.5,direction:-1,scale:1.95,count:4}]});
boats.ready.then(()=>invalidate(),()=>{});
const song=createBoatSong();
function drawRiver(target,left,right){
 const viewY=-state.top/state.scale;
 if(water.active){
  const layer=water.render({time:waterTime,camera:left,viewY,width:state.width,height:state.height,scale:state.scale,source:backdrop,sourceRect:{x:left,y:viewY,width:state.width/state.scale,height:state.height/state.scale},backdropKey:backgroundKey});
  target.save();target.globalAlpha=.92;water.composite(target,layer);target.restore();
 }
 const west=panels.find(p=>p.id==='west');
 if(west.image&&millWheel.use(west.image)&&right>-1660&&left<-1450){
  target.save();target.translate(west.x,0);target.scale(west.w/2172,1);millWheel.draw(target,waterTime);target.restore();
 }
 if(water.active&&left<-1450&&right>-1560){
  const fall=water.render({time:waterTime,camera:left,viewY,width:state.width,height:state.height,scale:state.scale,pass:1});
  water.composite(target,fall);
 }
}
function invalidate(){dirty=true;if(!frame)frame=requestAnimationFrame(render);}
const workshopState=createWorkshopState();
const workshop=createStreetWorkshop(workshopState,()=>{backgroundRevision++;mapDirty=true;invalidate();});
// `?limitedArt=<folder>` previews key-pose sheets before they are installed.
const limitedArt=new URLSearchParams(location.search).get('limitedArt');
const residents=createStreetPeople(()=>{mapDirty=true;invalidate();},workshop,{limitedDir:limitedArt&&/^[\w./-]+$/.test(limitedArt)?limitedArt:undefined});
const flowerShop=createFlowerShop({getArt:workshop.artURL,getArtMetrics:workshop.artMetrics,onOpen:()=>{cancelFlight(true);cancelProp();stop();bubbleUntil=0;$('#personBubble').hidden=true;},onClose:()=>{last=performance.now();invalidate();}});
function drawResidents(target,left,right,animated=false){
 const doorway=()=>workshop.drawDoorway(target,left,right,{overview:!animated||state.overview,people:state.people});
 if(!state.people){doorway();return;}
 residents.draw(target,left,right,{time:motionTime,motion:animated&&motionTime>0&&!state.overview,feedback:animated&&!state.overview,live:animated&&!state.overview,layers:[{y:INN.y+INN.h,draw:doorway},...workshop.layers(target,left,right)]});
 const center=panels.find(p=>p.id==='center');
 if(center.tile)globalThis.BridgeRailing.draw(target,center.tile,left,right);
}
function layout(){
  const r=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);state.width=r.width;state.height=r.height;
  canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);water.resize(r.width,r.height,dpr);
  const mr=map.getBoundingClientRect();mini.width=Math.round(mr.width*dpr);mini.height=Math.round(mr.height*dpr);mc.setTransform(dpr,0,0,dpr,0,0);
  mapDirty=true;invalidate();
}
function geometry(){
  state.scale=state.overview?state.width/SPAN:Math.max(state.height/H,state.width/SPAN)*state.zoom;
  const half=state.width/state.scale/2;
  state.center=clamp(state.center,MIN+half,MAX-half);
  state.left=state.center-half;
  // A zoomed view keeps the focus height in frame without showing past the scroll's edges.
  const spare=H*state.scale-state.height;state.top=spare>0?-clamp(state.focusY*state.scale-state.height/2,0,spare):-spare/2;
}
function drawPanels(target,left,right){for(const p of [...panels,...repairs])if(p.tile&&p.x+p.w>left&&p.x<right)target.drawImage(p.tile,p.x,0,p.w,H);workshop.backdrop(target,left,right);}
// Zoomed out, paper shows below the painting. Mirror the last stretch of
// river into it and let it fade, so the water has no hard lower edge.
function extendRiver(target,left,right){
 const depth=90;
 target.save();target.beginPath();target.rect(left,H,right-left,depth);target.clip();
 target.translate(0,2*H);target.scale(1,-1);drawPanels(target,left,right);target.restore();
 const fade=target.createLinearGradient(0,H-6,0,H+depth);
 fade.addColorStop(0,'rgba(226,212,182,0)');fade.addColorStop(.25,'rgba(226,212,182,.35)');fade.addColorStop(1,'#e2d4b6');
 target.fillStyle=fade;target.fillRect(left,H-6,right-left,depth+6);
}
function drawMap(){
  const r=map.getBoundingClientRect();mc.clearRect(0,0,r.width,r.height);mc.save();mc.scale(r.width/SPAN,r.height/H);mc.translate(-MIN,0);drawPanels(mc,MIN,MAX);drawResidents(mc,MIN,MAX);workshop.draw(mc,MIN,MAX,{overview:true,people:state.people});mc.restore();mapDirty=false;
}
function draw(){
  // A hidden or collapsing stage has no pixels to paint yet.
  if(!canvas.width||!canvas.height)return;
  geometry();
  const key=[state.left,state.top,state.scale,state.width,state.height,canvas.width,backgroundRevision].join(':');
  if(key!==backgroundKey){
   backdrop.width=canvas.width;backdrop.height=canvas.height;const dpr=canvas.width/state.width;
   backdropContext.setTransform(dpr,0,0,dpr,0,0);backdropContext.fillStyle='#e2d4b6';backdropContext.fillRect(0,0,state.width,state.height);
   backdropContext.translate(-state.left*state.scale,state.top);backdropContext.scale(state.scale,state.scale);drawPanels(backdropContext,state.left,state.left+state.width/state.scale);
   if(state.top+H*state.scale<state.height)extendRiver(backdropContext,state.left,state.left+state.width/state.scale);
   backgroundKey=key;
  }
  ctx.drawImage(backdrop,0,0,state.width,state.height);ctx.save();ctx.translate(-state.left*state.scale,state.top);ctx.scale(state.scale,state.scale);
  const right=state.left+state.width/state.scale;
  if(!state.overview)drawRiver(ctx,state.left,right);
  drawResidents(ctx,state.left,right,true);
  workshop.draw(ctx,state.left,right,{overview:state.overview,people:state.people});
  if(!state.overview)boats.draw(ctx,waterTime,state.left,right);
  if(state.seams){
    const seams=panels.slice(1).map(p=>p.x+OVERLAP/2);
    ctx.strokeStyle='#955a43';ctx.lineWidth=1/state.scale;ctx.setLineDash([5/state.scale,5/state.scale]);
    for(const x of seams){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  }
  ctx.restore();if(mapDirty)drawMap();
  const box=$('#viewbox');box.style.left=((state.left-MIN)/SPAN*100)+'%';box.style.width=(state.width/state.scale/SPAN*100)+'%';
  const area=panels.findLast(p=>state.center>=p.x)||panels[0];
  const areaKey=state.overview?'all':area.id;
  if(areaKey!==previousArea){$('#areaName').textContent=state.overview?'田园 · 市井 · 河岸':area.name;$('#areaKind').textContent=state.overview?'全卷总览':area.kind;previousArea=areaKey;}
  for(const b of document.querySelectorAll('nav button')){const active=!state.overview&&Math.abs(Number(b.dataset.x)-state.center)===Math.min(...[...document.querySelectorAll('nav button')].map(n=>Math.abs(Number(n.dataset.x)-state.center)));active?b.setAttribute('aria-current','location'):b.removeAttribute('aria-current');}
  canvas.dataset.left=state.left.toFixed(2);canvas.dataset.right=(state.left+state.width/state.scale).toFixed(2);canvas.dataset.loaded=String(panels.filter(p=>p.tile).length);canvas.dataset.repairs=String(repairs.filter(p=>p.tile).length);canvas.dataset.people=String(residents.count);canvas.dataset.limited=String(residents.limitedLoaded);canvas.dataset.peopleVisible=String(state.people);
  canvas.dataset.motion=String(state.motion);canvas.dataset.motionTime=motionTime.toFixed(2);canvas.dataset.activePerson=residents.selected?.id||'';
  canvas.dataset.warehouse=workshopState.warehouse.phase;canvas.dataset.curtain=workshopState.inn.progress.toFixed(3);canvas.dataset.reacting=String(residents.reacting);
  canvas.dataset.floristFrame=String(workshop.floristFrame);
  const host=residents.position(population.people.find(p=>p.id==='bridge-33'));
  canvas.dataset.floristTime=workshopState.florist.time.toFixed(3);canvas.dataset.floristPhase=host.hostPhase||'serving';
  canvas.dataset.floristX=host.x.toFixed(2);canvas.dataset.floristY=host.y.toFixed(2);
  canvas.dataset.customerTime=workshopState.customers.time.toFixed(3);canvas.dataset.customersStarted=String(workshopState.customers.started);
  if(!state.overview&&!state.flight){if(state.center>6200)activeScene='inn';else if(state.center>4200&&state.center<4900)activeScene='warehouse';}updateWorkshopUI();
  const p=residents.selected&&residents.position(residents.selected),bubble=$('#personBubble'),visible=p&&!p.hidden&&state.people&&!state.overview&&performance.now()<bubbleUntil&&p.x>state.left&&p.x<state.left+state.width/state.scale;
  bubble.hidden=!visible;if(visible){$('#personName').textContent=p.label.split(' · ')[0]+(p.activity?' · '+p.activity:'');bubble.style.left=clamp((p.x-state.left)*state.scale,110,state.width-110)+'px';bubble.style.top=clamp(state.top+(p.y-p.h)*state.scale-12,75,state.height-45)+'px';}
}
function render(t){frame=0;if(document.hidden||flowerShop.isOpen){last=t;return;}const dt=Math.min((t-last)/1000,.06);last=t;
  const living=state.ready&&state.people&&!state.overview&&state.motion;
  const interactive=state.ready&&(workshopState.busy||residents.reacting);
  if(interactive){workshopState.step(reducedMotion.matches?60:dt);residents.step(dt,living);dirty=true;}
  for(const event of workshopState.drain()){
   mapDirty=true;
   if(event==='receiving')sound.play({sound:390,kind:'craft'});
   if(event==='opened')$('#interactionStatus').textContent='花肆开门了，店主走到帘外招手迎客。';
  }
  if(living){motionTime+=dt;workshopState.stepCustomers(dt);}
  // Water, the wheel and boats keep moving even with people hidden.
  const flowing=state.ready&&state.motion&&!state.overview;
  if(flowing)waterTime+=dt;
  song.update({boat:boats.singerAt(waterTime),left:state.left,right:state.left+state.width/state.scale,playing:flowing});
  if(state.flight)stepFlight(dt);
  if(state.auto&&state.ready){state.center+=dt*155/state.scale;dirty=true;}
  const bubbleActive=bubbleUntil>0;
  if(dirty||((living||flowing||bubbleActive)&&t-lastPaint>=frameInterval-4)){const begun=performance.now();draw();drawCost=drawCost*.9+(performance.now()-begun)*.1;frameInterval=1000/(drawCost<9?60:drawCost<16?45:30);canvas.dataset.fps=String(Math.round(1000/frameInterval));dirty=false;lastPaint=t;if(t>=bubbleUntil)bubbleUntil=0;}
  if(state.auto&&state.left+state.width/state.scale>=MAX-.1){stop(true);$('#interactionStatus').textContent='已从左至右游览全卷，可点击重新游览。';}
  if(state.flight||state.auto||living||flowing||workshopState.busy||residents.reacting||bubbleUntil>0)frame=requestAnimationFrame(render);
}
function updateTourButton(){
  const label=state.auto?'暂停游览':state.tourComplete?'重新游览':state.tourStarted?'继续游览':'播放游览';
  $('#autoplay').setAttribute('aria-pressed',String(state.auto));
  $('#autoplay').setAttribute('aria-label',state.auto?'暂停自动游览':`${label}，从左至右浏览画卷`);
  $('#autoplayLabel').textContent=label;
}
function stop(completed=state.tourComplete){state.auto=false;state.tourComplete=completed;updateTourButton();}
function leaveOverview(){if(state.overview){state.overview=false;state.center=savedCenter;$('#overview').setAttribute('aria-pressed','false');$('#overview').textContent='看全卷';}}
function focus(x){cancelProp();stop();leaveOverview();state.center=x;invalidate();}
function respond(response){if(!response)return;if(response.person.id==='bridge-33')response={...response,person:{...response.person,label:'插花女郎 · 拾枝理花'},text:'花枝都在这里，进来慢慢挑。'};stop();sound.play(response);$('#personName').textContent=response.person.label.split(' · ')[0];$('#personWords').textContent=response.text;$('#interactionStatus').textContent=response.person.label+'。'+response.text;bubbleUntil=performance.now()+4200;invalidate();}
function greetNearby(){if(!state.people||state.overview)return;respond(residents.nearby(state.left,state.left+state.width/state.scale,motionTime));}
function worldPoint(e){const r=stage.getBoundingClientRect();return {x:state.left+(e.clientX-r.left)/state.scale,y:(e.clientY-r.top-state.top)/state.scale};}
function setMotion(on){state.motion=on;$('#motion').setAttribute('aria-pressed',String(on));$('#motion .label').textContent=on?'暂停人物':'开启动画';last=performance.now();invalidate();}
$('#motion').addEventListener('click',()=>setMotion(!state.motion));setMotion(state.motion);
reducedMotion.addEventListener('change',e=>setMotion(!e.matches));
function setSound(want){const on=sound.set(want);song.set(on);const b=$('#sound');b.setAttribute('aria-pressed',String(on));b.querySelector('.label').textContent=on?'音效已开':'开启音效';return on;}
// Fly to the pipa boat, a little ahead of it, and turn the sound on.
function findSinger(){const b=boats.singerAt(waterTime);if(!b||!state.ready)return;setSound(true);cancelProp();stop();leaveOverview();geometry();state.flight={from:{center:state.center,focusY:state.focusY,zoom:state.zoom},to:{center:b.x+b.direction*14,focusY:600,zoom:1.8},t:0};last=performance.now();$('#interactionStatus').textContent='镜头来到河上的弹唱船，琵琶声渐近。';invalidate();}
$('#findSinger').addEventListener('click',findSinger);
$('#sound').addEventListener('click',e=>setSound(e.currentTarget.getAttribute('aria-pressed')!=='true'));
$('#greet').addEventListener('click',greetNearby);
for(const b of document.querySelectorAll('nav button'))b.addEventListener('click',()=>{focus(Number(b.dataset.x));state.focusY=H/2;});
$('#seams').addEventListener('click',e=>{state.seams=!state.seams;e.currentTarget.setAttribute('aria-pressed',String(state.seams));invalidate();});
$('#people').addEventListener('click',e=>{state.people=!state.people;e.currentTarget.setAttribute('aria-pressed',String(state.people));$('#populationStatus').textContent=state.people?`市井人物 · ${residents.count} 人`:'春日底图';mapDirty=true;invalidate();});
$('#overview').addEventListener('click',e=>{cancelProp();stop();if(state.overview)leaveOverview();else{savedCenter=state.center;state.overview=true;e.currentTarget.setAttribute('aria-pressed','true');e.currentTarget.textContent='返回近景';}invalidate();});
function zoom(f){cancelProp();stop();leaveOverview();state.zoom=clamp(state.zoom*f,.65,2.4);invalidate();}
$('#zoomIn').addEventListener('click',()=>zoom(1.2));$('#zoomOut').addEventListener('click',()=>zoom(1/1.2));
$('#autoplay').addEventListener('click',()=>{
  if(state.auto){stop();return;}
  if(!state.ready)return;
  cancelProp();
  leaveOverview();geometry();
  if(!state.tourStarted||state.tourComplete||state.left+state.width/state.scale>=MAX-.1)state.center=MIN;
  state.tourStarted=true;state.tourComplete=false;state.auto=true;last=performance.now();
  updateTourButton();$('#interactionStatus').textContent='正在从左至右自动游览画卷。';invalidate();
});
const pointers=new Map();let pinch=null,tap=null,propGesture=null;
function cancelProp(){cancelFlight();if(propGesture?.kind==='rope')workshopState.release(true);propGesture=null;tap=null;stage.classList.remove('using-prop');}
function toggleCurtain(){stop();workshopState.toggleInn();sound.play({sound:330,kind:'cloth'});invalidate();}
function updateWorkshopUI(){
 const phase=workshopState.warehouse.phase,inn=activeScene==='inn';
 const messages={idle:'下拉画中的吊绳，拉到底后松手。',pulling:'继续向下拉，再松手让搬夫接货。',returning:'这一把没拉满，吊绳正在回位。',hoisting:'粮包升起了，搬夫正在照看。',lowering:'慢慢落绳，把粮包递到搬夫手边。',receiving:'搬夫伸手接稳了。',placing:'俯身放好这一包粮。',complete:'一包粮已入仓。可以再吊一包。'};
 const message=inn?(workshopState.inn.target?'花肆开门了，进店挑花，也可带回家插瓶。':'掀开花帘，看看女郎新理好的花枝。'):messages[phase];
 if($('#workshopStatus').textContent!==message)$('#workshopStatus').textContent=message;
 $('#visitWarehouse').setAttribute('aria-pressed',String(!inn));$('#visitInn').setAttribute('aria-pressed',String(inn));
 const label=inn?(workshopState.inn.target?'进店赏花':'掀开花帘'):phase==='complete'?'再吊一包':'拉绳装货';
 if($('#sceneAction').textContent!==label)$('#sceneAction').textContent=label;
 $('#sceneAction').disabled=!state.ready||(!inn&&!['idle','complete','returning'].includes(phase));$('#sceneReset').disabled=!state.ready;
}
// Glide to a scene; `stay` keeps the camera still when the scene is already well in view.
function inScene(scene){const v=SCENE_VIEW[scene],half=state.width/state.scale/2;return !state.overview&&state.zoom>=v.zoom*.8&&Math.abs(v.center-state.center)<half*.6;}
function visitScene(scene,{stay=false}={}){
 activeScene=scene;updateWorkshopUI();if(stay&&inScene(scene))return;
 const to=SCENE_VIEW[scene];cancelProp();stop();leaveOverview();
 if(reducedMotion.matches||!state.ready){Object.assign(state,to);invalidate();return;}
 geometry();state.flight={from:{center:state.center,focusY:state.focusY,zoom:state.zoom},to,t:0};last=performance.now();invalidate();
}
const FLIGHT_TIME=.75;
function stepFlight(dt){
 const f=state.flight;f.t=Math.min(1,f.t+dt/FLIGHT_TIME);const u=f.t<.5?4*f.t**3:1-(-2*f.t+2)**3/2;
 for(const k of ['center','focusY','zoom'])state[k]=f.from[k]+(f.to[k]-f.from[k])*u;
 dirty=true;if(f.t>=1)state.flight=null;
}
function cancelFlight(finish=false){if(finish&&state.flight)Object.assign(state,state.flight.to);state.flight=null;}
$('#visitWarehouse').addEventListener('click',()=>visitScene('warehouse'));$('#visitInn').addEventListener('click',()=>visitScene('inn'));
$('#sceneAction').addEventListener('click',()=>{if(!state.ready)return;visitScene(activeScene,{stay:true});if(activeScene==='inn'){if(workshopState.inn.progress>.95)flowerShop.open();else toggleCurtain();}else{workshopState.lift();invalidate();}});
$('#sceneReset').addEventListener('click',()=>{cancelProp();workshopState.reset(activeScene);residents.resetReactions();bubbleUntil=0;$('#personBubble').hidden=true;visitScene(activeScene,{stay:true});mapDirty=true;invalidate();});
stage.addEventListener('pointerdown',e=>{
 if(!state.ready||e.button>0)return;stop();cancelFlight();stage.focus({preventScroll:true});stage.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size===2){cancelProp();const[a,b]=[...pointers.values()];pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom:state.zoom};leaveOverview();return;}
 tap={id:e.pointerId,x:e.clientX,y:e.clientY,time:performance.now()};const p=worldPoint(e);
 let kind=!state.overview&&workshop.hit(p.x,p.y,(e.pointerType==='touch'?13:3)/state.scale);
 if(state.people&&(kind==='curtain'||kind==='flower-shop')){
  const person=residents.hit(p.x,p.y);
  if(person&&residents.position(person).y>=INN.y+INN.h)kind=null;
 }
 if(kind==='rope'){activeScene='warehouse';if(workshopState.beginPull()){propGesture={kind,id:e.pointerId,y:e.clientY,progress:workshopState.warehouse.progress};stage.classList.add('using-prop');}else propGesture={kind:'busy',id:e.pointerId};}
 else if(kind==='curtain'||kind==='flower-shop'){activeScene='inn';propGesture={kind,id:e.pointerId};}
 else stage.classList.add('dragging');invalidate();
});
stage.addEventListener('pointermove',e=>{
 if(tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>6)tap=null;
 const prior=pointers.get(e.pointerId);
 if(!prior){if(!pointers.size&&!state.overview){const p=worldPoint(e),kind=workshop.hit(p.x,p.y,3/state.scale);stage.classList.toggle('over-rope',kind==='rope');stage.classList.toggle('over-person',kind==='curtain'||kind==='flower-shop'||(state.people&&!!residents.hit(p.x,p.y)));}return;}
 pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size===2&&pinch){const[a,b]=[...pointers.values()];state.zoom=clamp(pinch.zoom*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,pinch.distance),.65,2.4);}
 else if(propGesture?.id===e.pointerId){if(propGesture.kind==='rope')workshopState.pull(propGesture.progress+(e.clientY-propGesture.y)/(CRANE.pullDistance*state.scale));}
 else if(!state.overview)state.center-=(e.clientX-prior.x)/state.scale;invalidate();
});
function release(e){
 if(!pointers.has(e.pointerId))return;
 if(propGesture?.id===e.pointerId){if(propGesture.kind==='rope')workshopState.release(e.type!=='pointerup');else if(e.type==='pointerup'&&tap?.id===e.pointerId){if(propGesture.kind==='curtain')toggleCurtain();if(propGesture.kind==='flower-shop')flowerShop.open();}propGesture=null;stage.classList.remove('using-prop');}
 else if(e.type==='pointerup'&&tap?.id===e.pointerId&&performance.now()-tap.time<600&&state.people&&!state.overview){const p=worldPoint(e);respond(residents.interact(residents.hit(p.x,p.y,e.pointerType==='touch'?9/state.scale:3/state.scale),motionTime));}
 tap=null;pointers.delete(e.pointerId);pinch=null;if(!pointers.size)stage.classList.remove('dragging');invalidate();
}
stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);stage.addEventListener('lostpointercapture',release);
stage.addEventListener('dblclick',e=>{if(state.overview){const x=MIN+e.offsetX/state.scale;focus(x);}else zoom(state.zoom>1.1?1/state.zoom:1.5);});
stage.addEventListener('wheel',e=>{e.preventDefault();cancelFlight();if(e.ctrlKey||e.metaKey){zoom(Math.exp(-e.deltaY*.003));return;}stop();leaveOverview();state.center+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)/state.scale;invalidate();},{passive:false});
stage.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();greetNearby();}if(e.key==='Escape'){bubbleUntil=0;$('#personBubble').hidden=true;invalidate();}});
stage.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End','+','-'].includes(e.key))return;e.preventDefault();if(e.key==='+')return zoom(1.2);if(e.key==='-')return zoom(1/1.2);focus(e.key==='Home'?MIN:e.key==='End'?MAX:state.center+(e.key==='ArrowLeft'?-1:1)*state.width/state.scale*.3);});
function mapFocus(e){const r=map.getBoundingClientRect();focus(MIN+clamp((e.clientX-r.left)/r.width,0,1)*SPAN);}
map.addEventListener('pointerdown',e=>{map.setPointerCapture(e.pointerId);mapFocus(e);});map.addEventListener('pointermove',e=>{if(map.hasPointerCapture(e.pointerId))mapFocus(e);});
async function load(p,i){
  const image=new Image();image.decoding='async';image.src=p.src;await image.decode();p.image=image;
  const tile=document.createElement('canvas');tile.width=p.w;tile.height=H;const t=tile.getContext('2d');
  if(p.clip){const r=p.clip;t.beginPath();t.rect(r.x,r.y,r.w,r.h);t.clip();}
  t.drawImage(image,0,0,p.w,p.displayHeight||H);
  t.globalCompositeOperation='destination-out';
  if(p.clip){
    const {x,y,w,h,feather:f}=p.clip;
    const edges=[[x,y,x+f,y,x,y,f,h],[x+w,y,x+w-f,y,x+w-f,y,f,h],[x,y,x,y+f,x,y,w,f],[x,y+h,x,y+h-f,x,y+h-f,w,f]];
    for(const [x0,y0,x1,y1,rx,ry,rw,rh] of edges){const g=t.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,'#000');g.addColorStop(1,'#0000');t.fillStyle=g;t.fillRect(rx,ry,rw,rh);}
  }else if(i){const g=t.createLinearGradient(0,0,OVERLAP,0);g.addColorStop(0,'#000');g.addColorStop(1,'#0000');t.fillStyle=g;t.fillRect(0,0,OVERLAP,H);}
  p.tile=tile;backgroundRevision++;mapDirty=true;invalidate();
}
new ResizeObserver(layout).observe(stage);layout();
const assets=[...panels,...repairs,{name:'市井小戏素材'}],loaded=await Promise.allSettled([...panels,...repairs].map(load).concat(workshop.ready));
const failed=loaded.map((r,i)=>r.status==='rejected'?assets[i].name:null).filter(Boolean);
if(failed.length){$('#loading').textContent=`${failed.join('、')}未载入，请刷新重试`;console.error('Street preview assets failed',failed);}else{$('#loading').hidden=true;state.ready=true;$('#autoplay').disabled=false;$('#findSinger').disabled=false;document.body.dataset.ready='true';invalidate();}
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelProp();pointers.clear();pinch=null;stage.classList.remove('dragging');stop();sound.suspend();song.suspend();if(frame)cancelAnimationFrame(frame);frame=0;}else{last=performance.now();invalidate();}});
residents.ready.then(results=>{const failed=results.filter(r=>r.status==='rejected').length;document.body.dataset.peopleReady=String(!failed);$('#populationStatus').textContent=failed?`人物载入 ${residents.count}/${population.count} 人，请刷新重试`:`市井人物 · ${residents.count} 人`;if(failed)console.error('Character atlases failed',failed);invalidate();});
