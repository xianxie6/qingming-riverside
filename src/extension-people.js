import {population as sourcePopulation} from './extension-people-data.js?v=people-4';
import {createDisplayPopulation} from './extension-people-layout.js?v=haul-3';
import {actionAt,createActionPlans,motionProfile} from './extension-motion.js?v=limited-18';
import {createPuppetFrames} from './extension-puppet.js?v=limited-10';
import {reactionPose} from './extension-workshop-state.js?v=haul-2';
import {createLimitedAnimation,LIMITED,decoded} from './extension-limited-animation.js?v=limited-16';
export const population=createDisplayPopulation(sourcePopulation);

// The lowest painted pixels on each side of every figure are its two soles.
export function footContacts(data,width,height,members=1){
 return Array.from({length:members},(_,m)=>[0,1].map(side=>{
  const x0=Math.floor(width*(m+side/2)/members),x1=Math.floor(width*(m+(side+1)/2)/members);
  let bottom=-1;
  for(let y=height-1;y>height*.7&&bottom<0;y--)for(let x=x0;x<x1;x++)if(data[(y*width+x)*4+3]>96){bottom=y;break;}
  if(bottom<0)return{u:(x0+x1)/2/width,v:1};
  let sum=0,count=0;
  for(let y=Math.max(0,bottom-3);y<=bottom;y++)for(let x=x0;x<x1;x++)if(data[(y*width+x)*4+3]>96){sum+=x+.5;count++;}
  return{u:sum/count/width,v:(bottom+1)/height};
 }));
}
export function createStreetPeople(invalidate,{poseFor=(_,pose)=>pose,occludes=()=>false,artFor=()=>null,drawPerson=()=>false}={},{limitedDir,initialX=0,after=Promise.resolve()}={}){
 const byId=new Map(population.people.map(p=>[p.id,p]));
 const limited=createLimitedAnimation(invalidate,{...(limitedDir?{dir:limitedDir}:{}),positionOf:id=>byId.get(id)?.x??0});
 const sprites=new Map(),masks=new Map(),customMasks=new WeakMap(),poses=new Map(),plans=createActionPlans(population),puppets=createPuppetFrames(),reactions=new Map(),holds=new Map();let selected=null,started=-1;
 async function load(src){
  const image=new Image();image.decoding='async';
  for(let attempt=0;;attempt++){try{image.src=src;await decoded(image);break;}catch(error){if(attempt===2)throw error;image.removeAttribute('src');await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));}}
  // Bake each alpha-cropped figure once. Drawing the street never reloads images.
  for(const p of population.people.filter(p=>p.src===src)){
   const cw=image.width/p.cols,ch=image.height/p.rows,b=p.bounds;
   const sx=(p.sprite%p.cols+b.left)*cw,sy=(Math.floor(p.sprite/p.cols)+b.top)*ch,sw=(b.right-b.left)*cw,sh=(b.bottom-b.top)*ch;
   const tile=document.createElement('canvas');tile.width=Math.ceil(sw);tile.height=Math.ceil(sh);
   const t=tile.getContext('2d');t.filter='saturate(.78)';t.drawImage(image,sx,sy,sw,sh,0,0,tile.width,tile.height);
   const pixels=t.getImageData(0,0,tile.width,tile.height).data;
   p.feet=footContacts(pixels,tile.width,tile.height,p.members>1?2:1);
   sprites.set(p.id,tile);masks.set(p.id,pixels);
  }
  invalidate();
 }
 // Atlases load four at a time, the one whose figures sit nearest the view first.
 const queue=[...population.assets],results=[];let focusX=initialX;
 const atlasX=new Map(queue.map(src=>{const xs=population.people.filter(p=>p.src===src).map(p=>p.x);return [src,xs.reduce((a,x)=>a+x,0)/(xs.length||1)];}));
 const nearest=()=>{let best=0;for(let i=1;i<queue.length;i++)if(Math.abs(atlasX.get(queue[i])-focusX)<Math.abs(atlasX.get(queue[best])-focusX))best=i;return queue.splice(best,1)[0];};
 const ready=after.then(()=>Promise.all(Array.from({length:4},async()=>{while(queue.length){const src=nearest();try{await load(src);results.push({status:'fulfilled'});}catch(reason){results.push({status:'rejected',reason});}}}))).then(()=>results);
 // Key-pose sheets are extra detail: they start once the still figures are in.
 ready.then(()=>limited.start());
 function focus(x){focusX=x;limited.focus(x);}
 function draw(ctx,left,right,{time=0,motion=false,feedback=false,live=false,layers=[]}={}){
  const visible=[];
  for(const p of population.people){
   const idle=poseFor(p,motion?actionAt(p,plans.get(p.id),time-(holds.get(p.id)||0)):{...actionAt(p,plans.get(p.id),0),x:p.x,y:p.y,flip:false,bend:0,reach:0,lift:0,nod:0,gait:0,gaitWeight:0},{time,motion});
   const response=live&&animatedReaction(p),pose=response&&!idle.scripted?reactionPose(p,response.base,idle,response.elapsed):idle;
   if(live)poses.set(p.id,pose);
   if(pose.hidden)continue;
   if(pose.x+p.w/2+40<left||pose.x-p.w/2-40>right)continue;
   visible.push({p,pose,response});
  }
  visible.sort((a,b)=>a.pose.y-b.pose.y);
  // Props such as door cloth and sacks are interleaved with people by depth.
  const props=[...layers].sort((a,b)=>a.y-b.y);let nextProp=0;
  for(const {p,pose,response} of visible){
   while(nextProp<props.length&&pose.y>=props[nextProp].y)props[nextProp++].draw();
   const image=artFor(p)||sprites.get(p.id);if(!image)continue;
   ctx.save();
   if(pose.clip){ctx.beginPath();ctx.rect(pose.clip.x,pose.clip.y,pose.clip.w,pose.clip.h);ctx.clip();}
   ctx.fillStyle='rgba(72,57,34,.10)';ctx.beginPath();ctx.ellipse(pose.x,pose.y-.6,Math.min(p.w*.3,14),1.6,0,0,Math.PI*2);ctx.fill();
   ctx.translate(pose.x,pose.y);ctx.scale(pose.scale||1,pose.scale||1);if(pose.flip)ctx.scale(-1,1);
   if(drawPerson(ctx,p,response?.elapsed,pose)){/* Dedicated poses bypass the joint mesh. */}
   // Drawn key poses replace the mesh entirely; a still scroll shows the rest pose.
   else if(limited.draw(ctx,p,pose,motion?time:null)){if(live&&motion)poses.set(p.id,{...pose,activity:limited.activity(p,pose,time)||pose.activity});}
   else if(!motion&&!response)ctx.drawImage(image,-p.w/2,-p.h,p.w,p.h);
   else{
    const f=puppets.frame(p,image,pose);
    ctx.drawImage(f.canvas,-p.w/2-f.margin,-p.h-f.margin,f.w,f.h);
   }
   ctx.restore();
   if(feedback&&selected?.id===p.id&&time-started<3.5){
    const age=time-started;ctx.save();ctx.strokeStyle=`rgba(149,90,67,${.55*(1-age/3.5)})`;ctx.lineWidth=.9;ctx.beginPath();ctx.ellipse(pose.x,pose.y+1,p.w*.45+age*1.7,3+age*.3,0,0,Math.PI*2);ctx.stroke();ctx.restore();
   }
  }
  while(nextProp<props.length)props[nextProp++].draw();
 }
 function position(p){return {...p,...poses.get(p.id)};}
 function hit(x,y,padding=0){
  const actors=population.people.map(position).sort((a,b)=>b.y-a.y);
  for(const p of actors){
   const custom=artFor(p),image=custom||sprites.get(p.id);if(!image||occludes(p))continue;
   if(p.clip&&(x<p.clip.x||x>p.clip.x+p.clip.w||y<p.clip.y||y>p.clip.y+p.clip.h))continue;
   let pixels=masks.get(p.id);
   if(custom){
    if(!customMasks.has(custom)){const c=document.createElement('canvas');c.width=custom.width;c.height=custom.height;const t=c.getContext('2d',{willReadFrequently:true});t.drawImage(custom,0,0);customMasks.set(custom,t.getImageData(0,0,c.width,c.height).data);}
    pixels=customMasks.get(custom);
   }
   const scale=p.scale||1;
   let u=((x-p.x)/scale+p.w/2)/p.w;const v=((y-p.y)/scale+p.h)/p.h;
   if(p.flip)u=1-u;
   if(u>=0&&u<1&&v>=0&&v<1&&pixels[(Math.floor(v*image.height)*image.width+Math.floor(u*image.width))*4+3]>30)return population.people.find(q=>q.id===p.id);
  }
  if(padding){const p=actors.filter(p=>sprites.has(p.id)&&!occludes(p)&&Math.abs(x-p.x)<p.w/2+padding&&y>p.y-p.h-padding&&y<p.y+padding).sort((a,b)=>Math.hypot(x-a.x,y-a.y+a.h/2)-Math.hypot(x-b.x,y-b.y+b.h/2))[0];return p&&population.people.find(q=>q.id===p.id);}
 }
 function animatedReaction(p){return reactions.get(p.id);}
 // A greeted walker stops on the spot; the route resumes from there afterwards.
 function step(dt,living=false){for(const[id,r]of reactions){r.elapsed+=dt;if(living&&plans.get(id)?.walk)holds.set(id,(holds.get(id)||0)+dt);if(r.elapsed>=2.35)reactions.delete(id);}}
 function resetReactions(){reactions.clear();selected=null;}
 function interact(p,time){if(!p||!sprites.has(p.id)||occludes(position(p)))return;selected=p;started=time;
  if(p.customer!==undefined)return{kind:'chat',sound:330,text:position(p).flower?'这枝花正好带回家，插在窗边。':'我们进店挑几枝花，你也一起来看看吧。',person:p};
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)reactions.set(p.id,{base:poseFor(p,poses.get(p.id)||actionAt(p,plans.get(p.id),time-(holds.get(p.id)||0))),elapsed:0});
  const spec=limited.has(p.id)&&LIMITED[p.id];
  return {...motionProfile(p),person:spec?.label?{...p,label:spec.label}:p};
 }
 function nearby(left,right,time){const visible=population.people.map(position).filter(p=>sprites.has(p.id)&&!occludes(p)&&p.x>left+20&&p.x<right-20);if(!visible.length)return;const next=selected?visible[(visible.findIndex(p=>p.id===selected.id)+1)%visible.length]:visible.reduce((a,b)=>Math.abs(a.x-(left+right)/2)<Math.abs(b.x-(left+right)/2)?a:b);return interact(population.people.find(p=>p.id===next.id),time);}
 return {focus,draw,hit,interact,nearby,step,resetReactions,ready,position,get reacting(){return reactions.size>0;},get selected(){return selected;},get started(){return started;},get loaded(){return sprites.size;},get limitedLoaded(){return limited.loaded;},get count(){return population.people.filter(p=>sprites.has(p.id)).reduce((s,p)=>s+p.members,0);}};
}
