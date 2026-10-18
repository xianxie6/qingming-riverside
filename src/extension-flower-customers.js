const clamp=v=>Math.max(0,Math.min(1,v));
const ease=v=>{v=clamp(v);return v*v*(3-2*v);};
export const CUSTOMER_DEPARTURE_TIME=15.8;
const mix=(a,b,t)=>a+(b-a)*ease(t);

// The pair share one clock and two lanes. They clear the threshold together
// before continuing along the street, keeping their purchased flowers.
export function flowerCustomerPose(p,time=0,started=false){
 const t=started?Math.max(0,time-3):0;
 const lane=482,doorX=p.customer===0?6634:6663;
 const insideX=p.customer===0?6633:6657,insideY=p.customer===0?432:430,insideScale=.84;
 const pose={x:p.x,y:p.y,flip:false,scale:1,stride:0,bend:0,nod:0,lift:0,reach:0,
  hand:[.58,.44],kind:'chat',activity:'结伴看花',visitPhase:'waiting',walkFrame:0,flower:0};
 let distance=0;
 if(t>0&&t<4.5){
  pose.x=mix(p.x,doorX,t/4.5);pose.y=mix(p.y,lane,t/4.5);
  pose.visitPhase='approaching';pose.activity='走向花肆';distance=pose.x-p.x;
 }else if(t>=4.5&&t<6.8){
  const u=(t-4.5)/2.3;pose.x=mix(doorX,insideX,u);pose.y=mix(lane,insideY,u);pose.scale=mix(1,insideScale,u);
  pose.visitPhase='entering';pose.activity='结伴跨过门槛';distance=doorX-p.x+lane-pose.y;
 }else if(t>=6.8&&t<10.5){
  pose.x=insideX;pose.y=insideY;pose.scale=insideScale;pose.flower=ease((t-8.4)/.8);
  pose.visitPhase=t<8.4?'choosing':'buying';pose.activity=t<8.4?'一起挑选花枝':'接过女郎包好的花';
 }else if(t>=10.5&&t<12.8){
  const u=(t-10.5)/2.3;pose.x=mix(insideX,doorX,u);pose.y=mix(insideY,lane,u);pose.scale=mix(insideScale,1,u);
  pose.flower=1;pose.visitPhase='leaving';pose.activity='结伴捧花走出店门';distance=pose.y-insideY;
 }else if(t>=12.8){
  const u=t-12.8,travel=26*(u<.8?u*u/1.6:u-.4);
  pose.x=doorX+travel;pose.y=lane;
  pose.flower=1;pose.visitPhase='departing';pose.activity='结伴捧花继续逛街';distance=lane-insideY+travel;
 }
 if(['approaching','entering','leaving','departing'].includes(pose.visitPhase)){
  pose.kind='walk';pose.walkFrame=1+Math.floor(Math.abs(distance)/5)%3;
 }
 if(pose.y<451)pose.clip={x:6614,y:360,w:74,h:91};
 return pose;
}

// Welcome outside, return to serve, then see the customers off beside the door.
// This clock can pause behind a closed curtain while customers keep walking.
export function flowerFloristPose(idle,time=0,started=false){
 const t=started?Math.max(0,time):0;
 const pose={...idle,x:6674,y:449,flip:false,stride:0,bend:0,nod:0,lift:0,reach:0,
  scale:1,kind:'chat',scripted:true,clip:undefined,waveTime:undefined,
  label:'插花女郎 · 拾枝理花',activity:'拾枝理花',hostPhase:'serving'};
 const move=(x0,y0,x1,y1,u,phase)=>{
  pose.x=mix(x0,x1,u);pose.y=mix(y0,y1,u);pose.kind='walk';pose.hostPhase=phase;
  pose.activity=phase==='returning'?'回店为客人包花':'缓步走出花肆';
 };
 if(started&&t<1.1)move(6674,449,6651,449,t/1.1,'stepping-out');
 else if(t>=1.1&&t<2.6)move(6651,449,6651,474,(t-1.1)/1.5,'stepping-out');
 else if(t>=2.6&&t<4.8){pose.x=6651;pose.y=474;pose.waveTime=t-2.6;pose.hostPhase='welcoming';pose.activity='走到帘外招手迎客';}
 else if(t>=4.8&&t<6.0)move(6651,474,6651,449,(t-4.8)/1.2,'returning');
 else if(t>=6.0&&t<7.0)move(6651,449,6674,449,t-6.0,'returning');
 else if(t>=CUSTOMER_DEPARTURE_TIME&&t<16.6)move(6674,449,6651,449,(t-CUSTOMER_DEPARTURE_TIME)/.8,'stepping-out');
 else if(t>=16.6&&t<18.2)move(6651,449,6651,478,(t-16.6)/1.6,'stepping-out');
 else if(t>=18.2&&t<19.8)move(6651,478,6699,478,(t-18.2)/1.6,'stepping-out');
 else if(t>=19.8){
  pose.x=6699;pose.y=478;pose.waveTime=t-19.8;
  pose.hostPhase=t<22.15?'farewell':'outside';pose.activity=t<22.15?'挥手送别买花的客人':'在花肆门前迎客';
 }
 if(pose.y<451)pose.clip={x:6614,y:360,w:74,h:91};
 return pose;
}
