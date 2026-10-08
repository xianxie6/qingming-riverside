import {initCollection} from './collection.js';
import {regions,createPopulation} from './explore-population.js?v=20261008-ground2';
import {visitors} from './visitors-data.js?v=20261008-ground2';
import {buildAtmosphere} from './explore-atmosphere.js';
const $=id=>document.getElementById(id),world=$('world'),vp=$('viewport'),base=$('painting'),layer=$('residents');
const KEY='ancient-city-people-v2',reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:700px)');
let W=2004,H=785,vw=innerWidth,vh=innerHeight,s=1,min=1,max=5,x=0,y=0,frame=0,ready=false,stored={},people=[],entries=[],lodTimer,storage=true;
let collection,paintedScale,paintedOutline;
world.style.left="0px";world.style.top="0px";
// Artwork resolution stays independent from the authored 2004 × 785 world.
const landscapeHD='assets/explore/people-v3/background-hd.webp?v=20261008-seams3';
let landscapeReady=false,landscapeLoading=false;
async function loadLandscape(){
 if(landscapeReady||landscapeLoading)return;
 landscapeLoading=true;
 try{
  const image=await loadImage(landscapeHD);
  await image.decode();
  base.src=image.src;
  world.style.setProperty('--landscape-image',`url("${image.src}")`);
  landscapeReady=true;
  max=Math.max(min,4);
  world.dataset.landscape='hd';
  $('in').title='放大景观细节';
 }catch{
  // Keep the overview usable; another zoom gesture can retry.
  $('in').title='高清景观暂未加载，点击重试';
 }finally{landscapeLoading=false;}
}
const highImages=new Map();
let districtOutline=null;
const debug=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('debug')==='1';
try{stored=JSON.parse(localStorage.getItem(KEY)||'{}');const legacy=JSON.parse(localStorage.getItem('ancient-city-explore-v1')||'null');if(legacy){stored={...stored,sound:legacy.sound,view:legacy.view};localStorage.removeItem('ancient-city-explore-v1')}}catch{storage=false}
function save(){if(!ready||!storage)return;try{localStorage.setItem(KEY,JSON.stringify({view:{x:(vw/2-x)/(W*s),y:(vh/2-y)/(H*s),scale:s},sound:stored.sound===true}))}catch{storage=false}}
function clamp(){x=W*s<=vw?(vw-W*s)/2:Math.max(vw-W*s-35,Math.min(35,x));y=H*s<=vh?(vh-H*s)/2:Math.max(vh-H*s-35,Math.min(35,y))}
// Keep native CSS zoom for sharp HD detail; pan without relaying out every resident.
function paint(){clamp();if(districtOutline&&(paintedScale!==s||paintedOutline!==districtOutline)){districtOutline.style.setProperty('--ant-width',1.2/s);districtOutline.style.setProperty('--ant-gap',6/s);districtOutline.style.setProperty('--ant-step',12/s);}paintedOutline=districtOutline;if(paintedScale!==s){world.style.zoom=s;paintedScale=s;}world.style.transform=`translate(${x/s}px,${y/s}px)`;const label=(s/min).toFixed(1)+'×';if($('zoom').textContent!==label)$('zoom').textContent=label;clearTimeout(lodTimer);lodTimer=setTimeout(updateLOD,90)}
function move(px,py,scale,animate=true){cancelAnimationFrame(frame);const to=[vw/2-px*W*scale,vh/2-py*H*scale,Math.max(min,Math.min(max,scale))],from=[x,y,s];to[0]=vw/2-px*W*to[2];to[1]=vh/2-py*H*to[2];if(!animate||reduced.matches){[x,y,s]=to;paint();save();return}const start=performance.now();function tick(now){const p=Math.min(1,(now-start)/550),t=1-(1-p)**3;[x,y,s]=from.map((v,i)=>v+(to[i]-v)*t);paint();if(p<1)frame=requestAnimationFrame(tick);else{updateLOD();save()}}frame=requestAnimationFrame(tick)}
function zoom(factor,cx=vw/2,cy=vh/2){if(factor>1)loadLandscape();cancelAnimationFrame(frame);const next=Math.max(min,Math.min(max,s*factor));x=cx-(cx-x)*next/s;y=cy-(cy-y)*next/s;s=next;paint();save()}
function resize(){if(ready)$('hint').textContent=mobile.matches?'单指移动画卷 · 双指放大 · 轻点寻找':'拖动画卷 · 滚轮放大 · 点击寻找（键盘 Enter 寻找中心人物）';const center=[(vw/2-x)/(W*s),(vh/2-y)/(H*s)];vw=innerWidth;vh=innerHeight;min=Math.min(vw/W,vh/H);max=Math.max(min,4);if(ready)move(...center,Math.max(min,s),false);else{s=min;x=(vw-W*s)/2;y=(vh-H*s)/2;paint()}}
const loadImage=url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=url});
function inView(p,buffer=100){const px=x+p.position[0]*W*s,py=y+p.position[1]*H*s;return px>-buffer&&px<vw+buffer&&py>-buffer&&py<vh+buffer}
async function updateLOD(){if(!ready)return;for(const el of entries){const p=el.person,wants=s>.9&&inView(p),url=p.assetVariants.high;if(wants&&!highImages.has(url)){highImages.set(url,{loading:true});loadImage(url).then(im=>{highImages.set(url,{image:im});updateLOD()}).catch(()=>highImages.delete(url));}const source=wants&&highImages.get(url)?.image?url:p.assetVariants.low;if(el.dataset.source!==source){el.style.backgroundImage=`url("${source}")`;el.dataset.source=source;}}}
function buildPeople(){people=createPopulation(W,H);layer.replaceChildren();entries=[];const walkers=visitors.map(p=>({...p,ambient:true,atlasColumns:8,atlasRows:8,assetVariants:{low:'assets/explore/visitors/duos-low.webp',high:'assets/explore/visitors/duos.webp'}}));buildAtmosphere(world,W,H);for(const p of [...people,...walkers].sort((a,b)=>a.position[1]-b.position[1])){const el=document.createElement('span');el.className=p.ambient?'resident visitor-duo':'resident';el.person=p;el.dataset.id=p.id;el.style.cssText=`left:${p.position[0]*100}%;top:${p.position[1]*100}%;width:${p.scale*(p.ambient?1:.75)}px;height:${p.scale}px;background-size:${(p.atlasColumns||4)*100}% ${(p.atlasRows||2)*100}%;background-position:${p.sprite%(p.atlasColumns||4)*100/((p.atlasColumns||4)-1)}% ${Math.floor(p.sprite/(p.atlasColumns||4))*100/((p.atlasRows||2)-1)}%;background-image:url("${p.assetVariants.low}")`;if(debug){el.style.outline='1px solid red';el.title=p.id+' '+p.role}layer.append(el);entries.push(el)}if(debug){const output=document.createElement('pre');output.id='debug';output.textContent=regions.map(r=>`${r.name}: ${people.filter(p=>p.regionId===r.id).reduce((n,p)=>n+p.members,0)}`).join('\n');document.body.append(output)}}
const patchBounds={tea:[.23,.53,.44,.80],mill:[.14,.48,.285,.78],bridge:[.427,.552,.595,.67],gate:[.74,.5,.96,.8],quay:[.735,.755,.972,.888],boats:[.37,.72,.60,.99],temple:[.66,.13,.81,.31],fields:[.015,.015,.285,.44]};
// One continuous background; scene navigation adds an outline without filtering the map.
function selectDistrict(id){
 districtOutline?.remove();districtOutline=null;if(!id)return;
 const b=patchBounds[id],ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.classList.add('district-outline');svg.dataset.region=id;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('aria-hidden','true');
 const rect=document.createElementNS(ns,'rect');
 for(const [key,value]of Object.entries({x:b[0]*W,y:b[1]*H,width:(b[2]-b[0])*W,height:(b[3]-b[1])*H,rx:8}))rect.setAttribute(key,value);
 svg.append(rect);world.append(svg);districtOutline=svg;paint();
}
function setupOcclusion(){
 const masks=[['bridge-front-rail',[[.444,.632],[.577,.632],[.578,.646],[.444,.646]]],['tea-main-canopy',[[.308,.657],[.34,.657],[.34,.683],[.308,.685]]],['tea-small-canopy',[[.349,.638],[.369,.636],[.369,.665],[.349,.668]]]];
 for(const[id,poly]of masks){const el=document.createElement('div');el.className='foreground-mask';el.dataset.mask=id;el.style.clipPath=`polygon(${poly.map(p=>`${p[0]*100}% ${p[1]*100}%`).join(',')})`;world.append(el);}
}
function showPerson(p){$('story').hidden=false;$('place').textContent=regions.find(r=>r.id===p.regionId).name;$('role').textContent=p.role;$('description').textContent=p.interaction}
function hit(cx,cy){if(collection?.hit(cx,cy))return;const px=(cx-x)/s,py=(cy-y)/s;const p=people.filter(p=>Math.abs(px-p.position[0]*W)<p.scale*.45&&py>p.position[1]*H-p.scale&&py<p.position[1]*H+3).at(-1);if(p)showPerson(p);else $('story').hidden=true}
$('closeStory').onclick=()=>{$('story').hidden=true;vp.focus()};
for(const r of regions){const b=document.createElement('button');b.textContent=r.name;b.title=r.description;b.setAttribute('aria-label',r.name+'。'+r.description);b.onclick=()=>{selectDistrict(r.id);move(...r.point,Math.min(max,Math.max(min*2.8,2.4)));$('districts').querySelectorAll('button').forEach(el=>el.classList.toggle('active',el===b));$('story').hidden=true};$('districts').append(b)}
$('in').onclick=()=>zoom(1.35);$('out').onclick=()=>zoom(1/1.35);$('fit').onclick=()=>{selectDistrict(null);$('districts').querySelectorAll('button').forEach(el=>el.classList.remove('active'));move(.5,.5,min);};$('detail').onclick=()=>collection?.preview();
const pointers=new Map();let gesture=null,pinch=null;
vp.addEventListener('pointerdown',e=>{if(!ready||e.button>0||collection?.busy())return;collection?.interrupt();cancelAnimationFrame(frame);vp.setPointerCapture(e.pointerId);vp.focus({preventScroll:true});pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===1)gesture={start:[e.clientX,e.clientY],last:[e.clientX,e.clientY],moved:false,multi:false};else{gesture.multi=true;const[a,b]=[...pointers.values()];pinch={distance:Math.hypot(a[0]-b[0],a[1]-b[1]),center:[(a[0]+b[0])/2,(a[1]+b[1])/2]}}});
vp.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size>1){const[a,b]=[...pointers.values()],center=[(a[0]+b[0])/2,(a[1]+b[1])/2],distance=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch){x+=center[0]-pinch.center[0];y+=center[1]-pinch.center[1];zoom(distance/Math.max(1,pinch.distance),...center)}pinch={distance,center};return}x+=e.clientX-gesture.last[0];y+=e.clientY-gesture.last[1];gesture.last=[e.clientX,e.clientY];gesture.moved||=Math.hypot(e.clientX-gesture.start[0],e.clientY-gesture.start[1])>7;paint()});
function end(e){if(!pointers.has(e.pointerId))return;pointers.delete(e.pointerId);if(pointers.size){gesture.last=[...pointers.values()][0];pinch=null;return}if(e.type==='pointerup'&&!gesture.moved&&!gesture.multi)hit(e.clientX,e.clientY);gesture=null;pinch=null;save();updateLOD()}
vp.addEventListener('pointerup',end);vp.addEventListener('pointercancel',end);vp.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(-e.deltaY*.0014),e.clientX,e.clientY)},{passive:false});
vp.addEventListener('keydown',e=>{if(collection?.busy())return;cancelAnimationFrame(frame);const dirs={ArrowLeft:[60,0],ArrowRight:[-60,0],ArrowUp:[0,60],ArrowDown:[0,-60]};if(dirs[e.key]){e.preventDefault();x+=dirs[e.key][0];y+=dirs[e.key][1];paint();save()}else if(['+','=','-','Home','Escape'].includes(e.key)){e.preventDefault();if(e.key==='Home')move(.5,.5,min);else if(e.key==='Escape')$('story').hidden=true;else zoom(e.key==='-'?1/1.3:1.3)}});
let audio;function sound(){stored.sound=!stored.sound;$('sound').textContent=stored.sound?'声音 开':'声音 关';$('sound').setAttribute('aria-pressed',stored.sound);if(stored.sound){audio??=new Audio('assets/audio/day-ambience.mp3');audio.loop=true;audio.volume=.16;audio.play().catch(()=>{stored.sound=false;$('sound').textContent='声音 关'})}else audio?.pause();save()}
$('sound').onclick=sound;$('directory').onclick=()=>{const hidden=$('districts').hidden=!$('districts').hidden;$('directory').setAttribute('aria-expanded',!hidden)};
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio?.pause();else if(stored.sound&&audio)audio.play().catch(()=>{})});window.addEventListener('pagehide',save);window.addEventListener('resize',resize);
async function load(){try{$('retry').hidden=true;const background=await loadImage('assets/explore/people-v3/background.webp');base.src=background.src;W=2004;H=785;world.style.width=W+'px';world.style.height=H+'px';buildPeople();await Promise.all([...new Set(entries.map(el=>el.person.assetVariants.low))].map(loadImage));setupOcclusion();resize();ready=true;loadLandscape();$('loading').hidden=true;const view=stored.view;if(view&&[view.x,view.y].every(Number.isFinite))move(view.x,view.y,view.scale||min*(view.zoom||1),false);else move(.52,.52,min*(mobile.matches?3:1.45),false);updateLOD();collection??=initCollection({people,W,H,
 view:()=>({x,y,scale:s,width:vw,height:vh}),max:()=>max,move,
 stop:()=>cancelAnimationFrame(frame),focus:()=>vp.focus(),
 restore:v=>{s=Math.max(min,Math.min(max,v.scale));x=vw/2-(v.width/2-v.x)/v.scale*s;y=vh/2-(v.height/2-v.y)/v.scale*s;paint();save();},
 project:b=>({x:x+b.x*s,y:y+b.y*s,w:b.w*s,h:b.h*s}),
 hideMembers:(ids,hidden)=>entries.filter(el=>ids.includes(el.person.id)).forEach(el=>el.style.visibility=hidden?'hidden':'')
 });$('hint').textContent=mobile.matches?'单指移动画卷 · 双指放大 · 轻点寻找':'拖动画卷 · 滚轮放大 · 点击寻找（键盘 Enter 寻找中心人物）'}catch{$('loading').firstChild.textContent='人物画卷加载失败，请重试。';$('retry').hidden=false}}
$('districts').hidden=true;$('directory').setAttribute('aria-expanded','false');
$('retry').onclick=load;load();
