import {LIMITED} from './extension-limited-animation.js?v=limited-16';
// Long walks along the riverside street. Every walker follows a fixed, time-driven
// schedule, so pausing, seeking and redrawing never desynchronise the crowd.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const WORLD={left:-5280,right:7480};
// The rainbow bridge is a separate deck; street walkers turn at its feet.
export const BRIDGE={left:1230,right:1780,deckLeft:1262,deckRight:1728};
// Continuous stretches of street. The water-mill wheel and its stone race, the
// bridge, and the pavilion plinth east of the bridge block the front of the road.
export const STREETS=[[WORLD.left,-1810],[-1390,BRIDGE.left],[BRIDGE.right,1830],[2025,WORLD.right]];
export function streetAt(x){
 return STREETS.find(([a,b])=>x>=a&&x<=b)||STREETS.reduce((best,s)=>Math.min(Math.abs(x-s[0]),Math.abs(x-s[1]))<Math.min(Math.abs(x-best[0]),Math.abs(x-best[1]))?s:best);
}
// Painted facing of the walking figures. Most look to the right; these do not.
export const BACK_VIEW=new Set(['bridge-15','fields-07','mill-11','mill-03']);
// Pairs drawn walking side by side, seen from behind. Other pairs stand and talk.
export const WALKING_PAIRS=new Set(['visitors-02','visitors-04','visitors-11','visitors-13','visitors-16','visitors-21','visitors-22','visitors-27','visitors-33','visitors-36','visitors-37','visitors-41','visitors-44','visitors-45']);
// Hand carts have no gait to animate; their pushers rest beside them.
export const PARKED=new Set(['mill-04','mill-12','mill-20']);

export const GAIT_PHASES=16;
// Distance per two-step cycle and how far a planted foot travels relative to the hips.
export function gaitMetrics(p,style){
 const cycle=p.h*(style==='back'?.24:.3);
 return{cycle,reach:cycle*.6,step:cycle/GAIT_PHASES};
}
export function hash(id,salt=0){
 let h=2166136261^salt;for(const c of id)h=Math.imul(h^c.charCodeAt(0),16777619);
 h=Math.imul(h^(h>>>15),0x2c1b3c6d);h=Math.imul(h^(h>>>12),0x297a2d39);
 return ((h^(h>>>15))>>>0)/4294967296;
}
function speedFor(p){
 const l=p.label;
 if(/拄杖/.test(l))return 8.5+hash(p.id,3)*1.5;
 if(/跑堂|穿行/.test(l))return 17+hash(p.id,3)*3;
 if(/抬运|扶杠|肩负|背儿|负锄|扛/.test(l))return 10.5+hash(p.id,3)*2;
 if(p.members>1)return 10+hash(p.id,3)*2;
 return 12.5+hash(p.id,3)*4;
}
// Eased start and stop: constant pace in between, zero speed at each end.
function leg(distance,speed,time){
 const ramp=Math.min(.7,distance/speed),duration=distance/speed+ramp,s=clamp(time,0,duration);
 const travel=s<ramp?speed*s*s/(2*ramp):s>duration-ramp?distance-speed*(duration-s)**2/(2*ramp):speed*(s-ramp/2);
 const velocity=s<ramp?s/ramp:s>duration-ramp?(duration-s)/ramp:1;
 return{travel:clamp(travel,0,distance),duration,velocity:clamp(velocity)};
}
// A route is two legs, each with one browsing stop, joined by turning pauses.
// Every leg is a whole number of gait frames long, so each stop and turn happens
// exactly on a frame and the snapped hips never jump.
function schedule(route){
 const {a,b,speed,stops,holds,step}=route,parts=[];let t=0,walked=0;
 const frames=Math.round((b-a)/step),mids=[a+Math.round(frames*stops[0])*step,a+(frames-Math.round(frames*stops[1]))*step];
 const add=(from,to,mid,stop,hold)=>{
  for(const [x0,x1,rest] of [[from,mid,stop],[mid,to,hold]]){
   const d=Math.abs(x1-x0),l=leg(d,speed,0);
   parts.push({t,duration:l.duration,x0,x1,dir:Math.sign(x1-x0),walked,distance:d});t+=l.duration;walked+=d;
   parts.push({t,duration:rest,x0:x1,x1,dir:Math.sign(x1-x0),walked,distance:0,rest:true});t+=rest;
  }
 };
 add(a,b,mids[0],holds[0],holds[1]);add(b,a,mids[1],holds[2],holds[3]);
 return{parts,period:t,perCycle:walked};
}
export function walkState(route,time){
 const {parts,period,perCycle}=route.timeline,t=((time+route.offset)%period+period)%period;
 const cycles=Math.floor((time+route.offset)/period);
 const part=parts.findLast(q=>q.t<=t)||parts[0];
 if(part.rest){
  // Turn round halfway through the pause at either end of the route.
  const turning=part===parts[3]||part===parts[7],dir=turning&&t-part.t>part.duration/2?-part.dir:part.dir;
  return{x:part.x1,dir,travelDir:part.dir,moving:false,velocity:0,walked:cycles*perCycle+part.walked,browsing:!turning};
 }
 const l=leg(part.distance,route.speed,t-part.t);
 return{x:part.x0+part.dir*l.travel,dir:part.dir,travelDir:part.dir,moving:l.velocity>0,velocity:l.velocity,walked:cycles*perCycle+part.walked+l.travel,browsing:false};
}
// Start every walker exactly where the still layout drew them, heading outward.
function offsetFor(route,x){
 const first=route.timeline.parts[0],target=clamp(x,route.a,route.b);
 let lo=0,hi=route.timeline.parts[2].t+route.timeline.parts[2].duration;
 for(let i=0;i<40;i++){const mid=(lo+hi)/2;if(walkState({...route,offset:0},mid).x<target)lo=mid;else hi=mid;}
 return target<=first.x0?0:lo;
}

export function planWalk(p,profileKind){
 if(profileKind!=='walk'||p.porter||p.flowerStreet||p.customer!==undefined||p.id==='bridge-33')return null;
 if(PARKED.has(p.id))return null;
 // A figure group with a drawn walk cycle (a mother carrying her baby) walks too.
 if(p.members>1&&!WALKING_PAIRS.has(p.id)&&!LIMITED[p.id]?.walk)return null;
 let a,b,lane;
 if(p.surface==='bridge'){
  a=BRIDGE.deckLeft+p.w/2;b=BRIDGE.deckRight-p.w/2;lane=null;
 }else if(/^field/.test(p.surface)){
  // Ridge paths are short and cut by the irrigation channel: stand on the ridge.
  return null;
 }else{
  const reach=220+hash(p.id,1)*560,bias=hash(p.id,2)-.5;
  a=p.x-reach*(1+bias);b=p.x+reach*(1-bias);
  const [left,right]=streetAt(p.x);
  a=Math.max(a,left+p.w/2);b=Math.min(b,right-p.w/2);
  // Passers-by use the open front of the street, in front of stalls and workers,
  // but keep a margin from the river edge.
  lane=481+Math.floor(hash(p.id,4)*5);
 }
 // The drawn spot always lies on the route, so motion starts without a jump.
 a=Math.min(a,p.x);b=Math.max(b,p.x);
 // A walker left on the short strip at a bridge foot crosses the bridge instead.
 let bridge=p.surface==='bridge';
 if(b-a<30&&LIMITED[p.id]?.walk&&!bridge){
  const [left,right]=streetAt(p.x);
  if(left===BRIDGE.right){a=BRIDGE.deckLeft+p.w/2;b=p.x;lane=null;bridge=true;}
  else if(right===BRIDGE.left){a=p.x;b=BRIDGE.deckRight-p.w/2;lane=null;bridge=true;}
 }
 if(b-a<30)return null;
 // Figures with drawn walk cycles keep the pace their painted stride implies.
 // Their drawn cycles are side views, mirrored when walking left, even when
 // the original still art is seen from behind or is a pair.
 const speed=LIMITED[p.id]?.pace?LIMITED[p.id].pace*p.h:speedFor(p),style=!LIMITED[p.id]?.walk&&(BACK_VIEW.has(p.id)||p.members>1)?'back':'side',step=gaitMetrics(p,style).step;
 // Whole gait frames; a bridge-foot route grows onto the bridge, not off its strip.
 const span=Math.ceil((b-a)/step-1e-9)*step;
 if(bridge&&b===p.x&&p.surface!=='bridge')a=b-span;else b=a+span;
 const route={a,b,speed,lane,offset:0,step,style,bridge,
  stops:[.3+hash(p.id,5)*.4,.3+hash(p.id,6)*.4],
  holds:[1.2+hash(p.id,7)*2.4,1.4+hash(p.id,8)*2,1.2+hash(p.id,9)*2.4,1.4+hash(p.id,10)*2]};
 route.timeline=schedule(route);
 route.offset=offsetFor(route,p.x);
 return route;
}
