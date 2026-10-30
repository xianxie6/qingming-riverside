// Role-specific action cycles. All movement stays inside reviewed ground cells.
import {planWalk,walkState,gaitMetrics,GAIT_PHASES,WALKING_PAIRS} from './extension-walkers.js?v=limited-16';
export {gaitMetrics,GAIT_PHASES};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const pulse=(t,a,b,c,d)=>smooth((t-a)/(b-a))*(1-smooth((t-c)/(d-c)));
export function phaseFor(id){
 let hash=2166136261;for(const c of id)hash=Math.imul(hash^c.charCodeAt(0),16777619);
 hash=Math.imul(hash^(hash>>>16),0x45d9f3b);hash=Math.imul(hash^(hash>>>16),0x45d9f3b);
 return ((hash^(hash>>>16))>>>0)/4294967296;
}
function profile(kind,period,actions,text,hand=[.68,.48]){return {kind,period,actions,text,hand,sound:kind==='craft'?390:kind==='drink'?680:330};}
export function motionProfile(p){
 const l=p.label;
 if(/接包/.test(l))return profile('trade',5.4,['候在钩下','接包上肩','扛包码堆','空手回位'],'钩子放稳些，粮包我来扛。');
 if(/收割/.test(l))return profile('harvest',5.6,['伸手拢穗','拉镰收割','收拢麦束','停手歇息'],'拢住麦穗，贴着根慢慢割。',[.61,.76]);
 if(/除草/.test(l))return profile('weed',5.2,['俯身寻草','伸手拔草','收拢杂草','抬头歇息'],'把草根拔净，菜苗才长得好。',[.44,.77]);
 if(/修整|整理农具|检修/.test(l))return profile('craft',4.8,['扶稳工具','抬手敲修','敲紧榫头','停手检查'],'先扶稳，再把榫头敲紧。',[.36,.51]);
 if(/扫地/.test(l))return profile('sweep',5.4,['落帚','向外扫拢','收回扫帚','停手看看'],'落叶扫到一旁，给行人让路。',[.6,.6]);
 if(/值守/.test(l))return profile('guard',7,['扶杖站定','侧身巡视','看看来客','回身站定'],'城门就在前头，请慢行。');
 if(/货簿|登记/.test(l))return profile('write',5.8,['低头看簿','提笔记账','核对数目','停笔抬头'],'数目核对清楚，再记这一笔。',[.65,.49]);
 if(/饮茶|饮葫芦/.test(l))return profile('drink',6.4,['端起杯盏','举杯饮一口','放低杯盏','坐定歇脚'],'喝口水，歇歇脚。',[.72,.28]);
 if(/添茶/.test(l))return profile('pour',5.8,['提壶靠近','倾壶添茶','扶正茶壶','收手站稳'],'慢些添，茶水正好。',[.82,.5]);
 if(/盘绳|叠布|菜筐|卸粮|粮筐|粮粉/.test(l))return profile('sort',5.2,['俯身整理','双手收拢','理齐归置','稍作停顿'],'把手边这一份理齐。',[.53,.64]);
 if(/讲述/.test(l))return profile('tell',6,['举扇开讲','挥扇比画','侧身讲述','收扇停顿'],'说到这里，且听下回。',[.21,.34]);
 if(/听书|坐听/.test(l))return profile('listen',6.8,['侧耳听着','轻轻点头','抬头看人','坐定听书'],'嗯，这一段说得有趣。');
 if(/兜售|布商|买布|买食|递出菜篮|秤量|看瓮|递包|接货|递碗|送水/.test(l))return profile('trade',5.4,['低头照看','伸手递物','停手示意','收回手臂'],'您看仔细，接稳了。',[.72,.48]);
 if(/孩童/.test(l))return profile('child',5,['低头看篮','拨弄篮中物','抬头张望','抱稳篮子'],'篮子里还有好东西呢。',[.5,.56]);
 if(/推车/.test(l))return profile('cart',6.4,['扶稳车把','停车歇脚','看看车上粮袋','重新握稳'],'车上满是粮袋，歇口气再推。');
 if(p.members>1&&/结伴/.test(l)&&!WALKING_PAIRS.has(p.id))return profile('chat',6.2,['停步交谈','抬手指点','点头回应','侧身张望'],'咱们就在这儿歇一歇，看看街景。');
 if(/行走|缓行|穿行|出行|过桥|登岸|搬运|禾束|负箱|去耕作|携物|提篮/.test(l))return profile('walk',16,['沿路慢行','停步看看','转身折返','停步歇脚'],'借过，沿着这条路慢慢走。');
 return profile('chat',6.2,['侧身招呼','抬手示意','点头回应','停下听人'],'沿河走走，前头还有好景致。');
}
const bridge=[[1250,477],[1280,474],[1310,467],[1340,457],[1370,445],[1400,432],[1430,422],[1460,413],[1490,407],[1520,404],[1550,405],[1580,409],[1610,418],[1640,430],[1670,445],[1700,461],[1740,477]];
export function bridgeHeight(x){for(let i=1;i<bridge.length;i++){const a=bridge[i-1],b=bridge[i];if(x<=b[0])return a[1]+(b[1]-a[1])*clamp((x-a[0])/(b[0]-a[0]));}return 477;}
export function createActionPlans(population){
 const plans=new Map();
 for(const p of population.people){
  const role=motionProfile(p),road=population.roads.find(r=>r.id===p.surface);
  const walk=planWalk(p,role.kind);
  let left=p.x,right=p.x;
  if(!walk&&role.kind==='walk'&&(road||p.surface==='bridge')){
   const range=road?.range||[1250,1740],max=30,margin=4;
   left=Math.max(p.x-max,range[0]+p.w/2+margin);right=Math.min(p.x+max,range[1]-p.w/2-margin);
   // Share every gap equally, reserving four world pixels for hands and hems.
   for(const q of population.people){
    if(q===p||Math.min(p.y,q.y)-Math.max(p.y-p.h,q.y-q.h)<-10)continue;
    if(q.x<p.x)left=Math.max(left,(q.x+q.w/2+p.x-p.w/2)/2+p.w/2+margin);
    if(q.x>p.x)right=Math.min(right,(p.x+p.w/2+q.x-q.w/2)/2-p.w/2-margin);
   }
   left=Math.min(p.x,left);right=Math.max(p.x,right);
  }
  plans.set(p.id,{role,left,right,walk,moving:!!walk||right-left>3,phase:phaseFor(p.id),hand:role.hand,gait:walk&&gaitMetrics(p,walk.style)});
 }
 return plans;
}
const still=(p,plan,r,stage)=>({x:p.x,y:p.y,flip:false,breath:0,bend:0,reach:0,lift:0,nod:0,gait:0,gaitWeight:0,dir:1,hand:plan.hand,kind:r.kind,activity:r.actions[stage]});
export function actionAt(p,plan,time){
 const r=plan.role,cycle=((time/r.period+plan.phase)%1+1)%1;
 const stage=Math.min(3,Math.floor(cycle*4));
 const pose=still(p,plan,r,stage);
 if(plan.walk){
  const w=plan.walk,s=walkState(w,time),g=plan.gait;
  // Snap to the cached gait frame: the hips advance in the same steps as the
  // planted foot, so the foot on the ground never slides.
  const phase=s.walked/g.cycle,frame=Math.floor(phase*GAIT_PHASES+1e-6),snapped=frame/GAIT_PHASES*g.cycle;
  pose.x=s.x-s.travelDir*(s.walked-snapped);
  pose.y=w.lane??p.y;
  if(w.bridge)pose.y=p.y+bridgeHeight(pose.x)-bridgeHeight(p.x);
  pose.kind='walk';pose.style=w.style;pose.walked=snapped;
  pose.gait=((frame%GAIT_PHASES)+GAIT_PHASES)%GAIT_PHASES/GAIT_PHASES;
  pose.gaitWeight=Math.round(s.velocity*4)/4;
  pose.flip=w.style==='side'&&s.dir<0;
  // Seen from behind, the figure is never mirrored; its feet travel with the walk.
  pose.dir=w.style==='back'?s.dir:1;
  pose.activity=s.moving?r.actions[0]:s.browsing?r.actions[1]:r.actions[3];
  return pose;
 }
 if(plan.moving){
  // Short shuffles for the few walkers who keep to a tight spot.
  const outward=cycle<.5,progress=outward?smooth(cycle/.36):1-smooth((cycle-.5)/.36);
  pose.x=plan.left+(plan.right-plan.left)*progress;
  if(p.surface==='bridge')pose.y=p.y+bridgeHeight(pose.x)-bridgeHeight(p.x);
  const walking=cycle<.36||(cycle>=.5&&cycle<.86);
  pose.activity=r.actions[outward?(walking?0:1):(walking?2:3)];
  pose.flip=r.kind==='walk'&&!outward;
  pose.kind='walk';pose.style='side';
  const distance=pose.x-plan.left,g=gaitMetrics(p,'side');
  pose.gait=((Math.floor(distance/g.cycle*GAIT_PHASES)%GAIT_PHASES)+GAIT_PHASES)%GAIT_PHASES/GAIT_PHASES;
  pose.gaitWeight=walking?1:0;
  return pose;
 }
 // A single painting cannot bend convincingly: big torso and arm warps read as
 // rubber. Workers keep their painted pose, breathe, and make only small, slow
 // nods and hand movements, with long still holds between them.
 const work=pulse(cycle,.08,.3,.55,.8),sway=Math.sin(cycle*Math.PI*2);
 pose.breath=Math.sin((time/3.6+plan.phase)*Math.PI*2);
 switch(r.kind){
  case 'harvest':case 'weed':case 'sort':pose.nod=work*.22;pose.reach=work*.12;break;
  case 'craft':pose.nod=work*.18;pose.lift=work*.1;break;
  case 'sweep':pose.reach=sway*work*.14;break;
  case 'pour':case 'trade':pose.reach=work*.14;pose.nod=work*.12;break;
  case 'drink':pose.lift=work*.16;pose.nod=-work*.1;break;
  case 'write':pose.nod=work*.25;break;
  case 'tell':pose.reach=work*.14;pose.nod=sway*work*.08;break;
  case 'child':pose.nod=work*.25;break;
  case 'listen':case 'guard':pose.nod=work*.15;break;
  case 'cart':pose.nod=work*.1;break;
  default:pose.nod=work*.15;pose.reach=work*.08;
 }
 return pose;
}
// Two feet half a cycle apart. Each stays planted for 60% of the cycle while the
// hips pass over it, then swings forward with zero speed at lift-off and strike.
export function footAt(c){
 const t=(c%1+1)%1,stance=t<.6,u=stance?t/.6:(t-.6)/.4;
 const travel=stance?.5-t/.6:-.5+u*u*(3-2*u);
 return{travel,lift:stance?0:Math.sin(Math.PI*u)**2};
}
const bell=(u,v,x,y,sx,sy)=>Math.exp(-(((u-x)/sx)**2)-((v-y)/sy)**2);
// A continuous 2-D skin, with separate weights for the torso, working hand and feet.
// No limb is cut out; shared mesh vertices keep the painted outline connected.
export function jointOffset(p,pose,u,v){
 const members=p.members>1?2:1,member=Math.min(members-1,Math.floor(u*members)),localU=(u*members)%1;
 const torso=Math.max(0,1-v/.86),head=bell(localU,v,.5,.17,.3,.24);
 const hand=bell(localU,v,pose.hand[0],pose.hand[1],.25,.25);
 let x=p.h*(pose.bend*.039*torso+pose.nod*.024*head+pose.reach*.10*hand);
 let y=p.h*(pose.bend*.094*torso+pose.nod*.052*head-pose.lift*.13*hand);
 // Breathing: the chest and head rise a fraction, fading out towards the feet.
 y-=p.h*.006*(pose.breath||0)*torso;
 const weight=pose.gaitWeight||0;
 if(weight>0){
  const feet=p.feet?.[member]||[{u:.38,v:.97},{u:.62,v:.97}],back=pose.style==='back';
  const g=gaitMetrics(p,pose.style),hip=.6,ground=Math.max(feet[0].v,feet[1].v);
  const legs=smooth((v-hip)/(ground-hip)),upper=1-legs;
  // Never let the two painted legs cross: that would fold one connected mesh.
  const gap=Math.abs(feet[1].u-feet[0].u)*p.w/members;
  const reach=Math.min(g.reach,gap*(back?.35:.85))*weight,lift=p.h*(back?.05:.034)*weight;
  // The rear foot of the painting leads the cycle; pairs walk slightly out of step.
  const c=pose.gait+member*.3,rear=footAt(c),front=footAt(c+.5);
  const order=feet[0].u<=feet[1].u?[rear,front]:[front,rear];
  const span=Math.max(.04,Math.abs(feet[1].u-feet[0].u)),lo=Math.min(feet[0].u,feet[1].u);
  const right=smooth((localU-lo)/span),mix=[1-right,right];
  for(let i=0;i<2;i++){
   x+=order[i].travel*reach*(pose.dir||1)*mix[i]*legs;
   y-=order[i].lift*lift*mix[i]*legs**1.5;
  }
  // The body rises twice per cycle over each passing foot and leans into the walk.
  const bob=(1-Math.cos(pose.gait*Math.PI*4))*.5*p.h*.012*weight;
  y-=bob*upper;
 }
 // Never lower a shoe through the pavement, and preserve props at the bottom.
 if(v>.94&&!weight){x*=1-smooth((v-.94)/.06);y*=1-smooth((v-.94)/.06);}
 return {x,y};
}

// The street scene's daytime background music, shared by the spring scroll.
// Night music joins once the scroll has an evening.
export const DAY_MUSIC='assets/audio/day-ambience.mp3';
const MUSIC_LEVEL=.22,MUSIC_DUCK=.65,GESTURES=['pointerdown','keydown','touchend'];

export function createStreetSound(){
 let context,enabled=false,music=null,volume=0,target=0,duck=0,fading=0;
 function prepare(){try{context ||= new (globalThis.AudioContext||globalThis.webkitAudioContext)();context.resume().catch(()=>{});}catch{return false;}return true;}
 // A plain looping element, faded by small volume steps. The music is on by
 // default; when the browser blocks playback before any gesture, it starts on
 // the visitor's first click, drag or key instead.
 let unlocking=false;
 function unlockOnGesture(){
  if(unlocking)return;unlocking=true;
  const retry=()=>{for(const type of GESTURES)removeEventListener(type,retry,true);unlocking=false;if(target)playMusic(true);};
  for(const type of GESTURES)addEventListener(type,retry,true);
 }
 function track(){
  if(!music){music=new Audio(DAY_MUSIC);music.loop=true;music.preload='auto';music.playsInline=true;music.volume=0;}
  return music;
 }
 function fade(){
  clearInterval(fading);let before=performance.now();
  // Steps by elapsed time, so throttled background timers still land on time.
  fading=setInterval(()=>{
   const now=performance.now(),step=(now-before)/1000*.4;before=now;
   const goal=target*(1-MUSIC_DUCK*duck);volume+=Math.sign(goal-volume)*Math.min(Math.abs(goal-volume),step);
   music.volume=Math.max(0,Math.min(1,volume));
   if(volume===goal){if(!target)music.pause();clearInterval(fading);}
  },50);
 }
 function playMusic(on){
  if(!on&&!music)return;
  const m=track();target=on?MUSIC_LEVEL:0;
  // A stopped (or still blocked) track always fades in from silence.
  if(on&&m.paused){volume=0;m.volume=0;}
  if(on)m.play().catch(error=>{if(error?.name==='NotAllowedError')unlockOnGesture();});
  fade();
 }
 return {
  set(value){enabled=Boolean(value);playMusic(enabled);return enabled;},
  // Lower the music while the pipa boat is near enough to be heard (0-1).
  duck(level){
   const next=Math.round(Math.max(0,Math.min(1,level||0))*20)/20;
   if(next===duck)return;duck=next;if(music&&target)fade();
  },
  resume(){if(enabled)playMusic(true);},
  play(profile){
   if(!enabled||!prepare())return;
   const now=context.currentTime;
   // Quiet material-like taps/rustles; never start background audio automatically.
   for(let i=0;i<3;i++){
    const start=now+i*.13,gain=context.createGain(),filter=context.createBiquadFilter();
    const buffer=context.createBuffer(1,Math.floor(context.sampleRate*.09),context.sampleRate),data=buffer.getChannelData(0);
    for(let j=0;j<data.length;j++)data[j]=(Math.random()*2-1)*(1-j/data.length);
    const source=context.createBufferSource();source.buffer=buffer;
    filter.type='bandpass';filter.frequency.value=profile.sound*(1+i*.12);filter.Q.value=profile.kind==='craft'?6:1.2;
    gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.07,start+.006);gain.gain.exponentialRampToValueAtTime(.0001,start+.09);
    source.connect(filter).connect(gain).connect(context.destination);source.start(start);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
   }
  },
  suspend(){context?.suspend().catch(()=>{});clearInterval(fading);if(music){music.pause();volume=0;music.volume=0;}}
 };
}
