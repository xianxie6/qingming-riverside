import {CUSTOMER_DEPARTURE_TIME} from './extension-flower-customers.js?v=customers-3';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const ease=v=>{v=clamp(v);return v*v*(3-2*v);};
export const CRANE={x:4462,y:200,handleX:4490,handleY:352,pullDistance:80};
export const CARGO={w:28,h:18,restY:394,raisedY:310,sling:27};
// The porter waits under the hook, shoulders the sack and stacks it beside the log pile.
export const PORTER={x:4460,y:482,w:31,h:59,standX:4436};
export const PILE={x:4414,groundY:478,rise:12.5,max:5};
export const INN={x:6614,y:360,w:74,h:91,guestX:6651,guestY:449};
export function flowerDoorOpening(progress){
 const w=INN.w*.82*ease(progress);return{x:INN.x+(INN.w-w)/2,y:INN.y,w,h:INN.h};
}
export function clipBehindFlowerCurtain(pose,progress){
 if(pose.y>=INN.y+INN.h)return pose;
 const clip=flowerDoorOpening(progress);return{...pose,clip,hidden:clip.w<.01};
}
const durations={hoisting:.95,returning:.55,lowering:1.5,receiving:.8,carrying:1.35,placing:.9,homing:1.35};
const next={hoisting:'lowering',returning:'idle',lowering:'receiving',receiving:'carrying',carrying:'placing',placing:'homing',homing:'complete'};
const slots=[0,2,-1.5,1,-.5];
// Sacks rest flat on one another, alternately offset like a hand-built stack.
export function pileSlot(i){const k=Math.min(i,PILE.max-1);return{x:PILE.x+slots[k],y:PILE.groundY-CARGO.h/2-k*PILE.rise};}
// A carried sack sits across the back of the shoulders, behind the head.
// `back` is -1 while the porter faces right and +1 once he has turned left.
export function shoulderSack(x,back=-1,squash=0){return{x:x+back*6,y:PORTER.y-PORTER.h*(.8-squash*.5)};}
const lerp=(a,b,u)=>a+(b-a)*u;

// One state per scene. Pointer input and keyboard buttons use the same transitions.
export function createWorkshopState(){
 const warehouse={phase:'idle',progress:0,elapsed:0,returnFrom:0,runs:0};
 const inn={progress:0,target:0};
 const customers={time:0,started:false};
 const florist={time:0,started:false};
 const events=[];
 function phase(value){warehouse.phase=value;warehouse.elapsed=0;events.push(value);}
 function reset(scene){
  if(scene==='warehouse'){Object.assign(warehouse,{progress:0,returnFrom:0,runs:0});phase('idle');}
  if(scene==='inn'){inn.progress=0;inn.target=0;customers.time=0;customers.started=false;florist.time=0;florist.started=false;events.push('closed');}
 }
 const ready=()=>['idle','returning','complete'].includes(warehouse.phase);
 function beginPull(){
  if(!ready())return false;
  warehouse.progress=warehouse.phase==='returning'?warehouse.progress:0;
  phase('pulling');return true;
 }
 function pull(value){if(warehouse.phase==='pulling'&&Number.isFinite(value))warehouse.progress=clamp(value);}
 function release(cancelled=false){
  if(warehouse.phase!=='pulling')return;
  if(!cancelled&&warehouse.progress>=.88){warehouse.progress=1;phase('lowering');}
  else{warehouse.returnFrom=warehouse.progress;phase('returning');}
 }
 function lift(){
  if(!ready())return false;
  warehouse.progress=0;phase('hoisting');return true;
 }
 function toggleInn(){inn.target=inn.target?0:1;events.push(inn.target?'opening':'closing');}
 function step(dt){
  if(!Number.isFinite(dt)||dt<=0)return;
  let remaining=dt;
  while(durations[warehouse.phase]&&remaining>0){
   const duration=durations[warehouse.phase],used=Math.min(remaining,duration-warehouse.elapsed);
   warehouse.elapsed+=used;remaining-=used;
   const u=warehouse.elapsed/duration;
   if(warehouse.phase==='hoisting')warehouse.progress=ease(u);
   if(warehouse.phase==='returning')warehouse.progress=warehouse.returnFrom*(1-ease(u));
   if(warehouse.elapsed>=duration){
    if(warehouse.phase==='placing')warehouse.runs++;
    if(warehouse.phase==='lowering'||warehouse.phase==='homing')warehouse.progress=0;
    phase(next[warehouse.phase]);
   }
  }
  const before=inn.progress,sign=Math.sign(inn.target-before);
  inn.progress=clamp(before+sign*Math.min(Math.abs(inn.target-before),dt/.65));
  if(inn.progress!==before&&inn.progress===inn.target){
   events.push(inn.target?'opened':'closed');if(inn.target){customers.started=true;florist.started=true;}
  }
 }
 function stepCustomers(dt){
  if(!Number.isFinite(dt)||dt<=0)return;
  if(customers.started&&(inn.progress>.95||customers.time>=CUSTOMER_DEPARTURE_TIME))customers.time+=dt;
  if(florist.started&&inn.progress>.95)florist.time+=dt;
 }
 const progressOf=p=>clamp(p.elapsed/(durations[p.phase]||1));
 // Where the moving sack is. `on` names who holds it: the hook, the porter or the stack.
 function cargo(){
  const p=warehouse,u=progressOf(p),porter=porterPose(p);
  if(p.phase==='lowering'){
   // A damped pendulum settles as the hook pays out onto the waiting shoulder.
   const target=shoulderSack(porter.x),drop=ease((u-.12)/.88);
   const sway=Math.sin(u*Math.PI*3.2)*3.2*(1-u)**1.5;
   return{x:lerp(CRANE.x,target.x,ease(u/.6))+sway,y:lerp(CARGO.raisedY,target.y,drop),tied:true,on:'hook'};
  }
  if(['receiving','carrying'].includes(p.phase))return{...shoulderSack(porter.x,porter.back,porter.squash),tied:false,on:'porter'};
  if(p.phase==='placing'){
   const from=shoulderSack(porter.x,1,porter.squash),to=pileSlot(p.runs),k=ease(u/.85);
   // Swing the sack forward off the shoulder, then set it down on the stack.
   return{x:lerp(from.x,to.x,k),y:lerp(from.y,to.y,k)-Math.sin(Math.PI*k)*5,tied:false,on:k<1?'porter':'pile'};
  }
  if(['homing','complete'].includes(p.phase))return{...pileSlot(p.runs-1),tied:false,on:'pile'};
  const sway=p.phase==='hoisting'?Math.sin(u*Math.PI*2)*1.4*(1-u):0;
  return{x:CRANE.x+sway,y:CARGO.restY-(CARGO.restY-CARGO.raisedY)*p.progress,tied:true,on:'hook'};
 }
 // The empty hook rises back to its resting height once the sack is untied.
 function hook(){
  const p=warehouse,c=cargo();
  if(c.tied)return{x:c.x,y:c.y-CARGO.sling,empty:false};
  const rest=CARGO.restY-CARGO.sling,start=shoulderSack(PORTER.x).y-CARGO.sling;
  if(p.phase==='receiving')return{x:CRANE.x,y:lerp(start,start-6,ease(progressOf(p))),empty:true};
  if(p.phase==='carrying')return{x:CRANE.x,y:lerp(start-6,rest,ease(progressOf(p))),empty:true};
  return{x:CRANE.x,y:rest,empty:true};
 }
 const pileCount=()=>Math.min(warehouse.runs,PILE.max);
 return{warehouse,inn,customers,florist,reset,beginPull,pull,release,lift,toggleInn,step,stepCustomers,cargo,hook,pileCount,
  porter:()=>porterPose(warehouse),
  drain:()=>events.splice(0),get busy(){return !['idle','complete'].includes(warehouse.phase)||inn.progress!==inn.target;}};
}

// Walk in both directions at the same pace, easing in and out of each stop.
const PORTER_STRIDE=5.5*PORTER.h/63;
export function porterPose(warehouse){
 const p=warehouse,u=clamp(p.elapsed/(durations[p.phase]||1)),distance=PORTER.x-PORTER.standX;
 const pose={x:PORTER.x,y:PORTER.y,flip:false,back:-1,frame:0,squash:0,carrying:false,activity:'候在钩下'};
 if(p.phase==='lowering'){pose.activity='仰头接包';pose.squash=.03*ease((u-.7)/.3);}
 if(p.phase==='receiving'){pose.carrying=true;pose.squash=.03+.05*Math.sin(Math.PI*Math.min(1,u*1.4));pose.activity='粮包上肩';}
 if(p.phase==='carrying'||p.phase==='homing'){
  const walked=distance*ease(u),out=p.phase==='carrying';
  pose.x=out?PORTER.x-walked:PORTER.standX+walked;pose.flip=out;pose.carrying=out;
  // Turning round swings the sack across behind his head instead of snapping over;
  // it crosses only as fast as he walks away, so it never sweeps into the pourer.
  if(out)pose.back=Math.min(1,-1+walked/6);
  pose.frame=u>0&&u<1?1+Math.floor(walked/PORTER_STRIDE)%4:0;pose.activity=out?'扛包去码堆':'空手回到钩下';
 }
 if(p.phase==='placing'){pose.x=PORTER.standX;pose.flip=true;pose.back=1;pose.carrying=u<.85;pose.squash=.09*Math.sin(Math.PI*u);pose.activity='卸包码齐';}
 return pose;
}

export function warehouseActorPose(p,idle,warehouse){
 // Leave the hook clear for the porter; the pourer works just beside it.
 if(p.id==='mill-16')return{...idle,x:idle.x+12};
 return idle;
}

export function floristWaveFrame(elapsed){
 if(!Number.isFinite(elapsed)||elapsed<.25||elapsed>=1.85)return 0;
 return elapsed<.48?2:elapsed<.68?1:elapsed<.92?3:elapsed<1.16?2:elapsed<1.4?3:elapsed<1.62?1:2;
}

// A short deliberate greeting overlays, then blends back into, the ambient pose.
export function reactionPose(person,base,idle,elapsed){
 const duration=2.35;if(elapsed>=duration)return idle;
 const weight=ease(elapsed/.22)*(1-ease((elapsed-1.5)/.85));
 const kind=idle.kind,drink=['drink','pour'].includes(kind);
 const activity=drink?'举盏致意':kind==='write'?'停笔点头':kind==='harvest'||kind==='weed'?'停手抬头':'抬手招呼';
 // A nod and a small lift of the hand: large arm warps look rubbery on painted figures.
 const target={...base,stride:0,gaitWeight:0,bend:0,nod:-.35,lift:drink?.3:.22,reach:drink?.05:.18,kind:'greet',activity};
 const pose={...idle,kind:weight>.05?'greet':idle.kind,activity:weight>.05?activity:idle.activity};
 // Walkers also settle their feet; other actors keep exactly their own fields.
 const keys=['x','y','stride','bend','nod','lift','reach'];if('gaitWeight' in idle)keys.push('gaitWeight');
 for(const k of keys)pose[k]=(idle[k]||0)*(1-weight)+(target[k]||0)*weight;
 return pose;
}
