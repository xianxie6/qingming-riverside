export function timberBreath(index,arrival,time){
  const strength=.035+.965*(1-arrival),phase=index*2.39996;
  return {x:Math.sin(time*.43+phase)*.045*strength,
    y:Math.sin(time*.82+phase)*.17*strength,
    z:Math.cos(time*.57+phase)*.065*strength,
    roll:Math.sin(time*.61+phase)*.026*strength};
}

const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const rotate=(point,origin,target,angle)=>{
  const x=point[0]-origin[0],y=point[1]-origin[1],c=Math.cos(angle),s=Math.sin(angle);
  return [target[0]+x*c-y*s,target[1]+x*s+y*c];
};
const angle=(a,b)=>Math.atan2(b[1]-a[1],b[0]-a[0]);

// Solve the elbows before skinning the artwork. The fists rotate rigidly;
// neither forearm is stretched to make an arbitrary paddle angle fit.
export function createRowingRig(art,time,movement){
  const h=1.5,w=h*art.frame.w/art.frame.h,contacts=art.contacts,beat=time*Math.PI*2/3.6;
  const pose={handX:0,handY:0,lean:.035*Math.sin(beat),nod:.006*Math.cos(beat),sway:.055*Math.sin(beat)};
  const bottom=Math.max(...contacts.map(p=>p.y));
  const rig={w,h,f:art.frame,contacts,feet:contacts.map(p=>({
    x:(p.x/art.frame.w-.5)*w,y:(p.y-bottom)/art.frame.h*h
  })),pose,hand:art.grips[0],walking:false,movement};
  // Narrow the forward stance so both soles remain on the bow deck with
  // the upright pole outside the gunwale. The contacts never move with time.
  rig.feet[1].x-=.16;
  const grips=[...art.grips].sort((a,b)=>a[1]-b[1]);
  const points=grips.map(uv=>movement.deform(...uv,rig));
  const tilt=.10+.025*Math.sin(beat),spacing=.265;
  const lower=[points[1][0]+.018*Math.sin(beat),points[1][1]+.018*Math.cos(beat)];
  const targets=[[lower[0]-Math.sin(tilt)*spacing,lower[1]-Math.cos(tilt)*spacing],lower];
  rig.grips=grips;
  rig.arms=[[[.57,.235],[.68,.355]],[[.61,.355],[.70,.414]]].map((joints,i)=>{
    const source=[...joints.map(uv=>movement.deform(...uv,rig)),points[i]];
    const lengths=[0,1].map(j=>Math.hypot(source[j+1][0]-source[j][0],source[j+1][1]-source[j][1]));
    const target=movement.legJoints(source[0],targets[i],...lengths,-1);
    return {source,target,lengths,rotations:[0,1].map(j=>angle(target[j],target[j+1])-angle(source[j],source[j+1]))};
  });
  return rig;
}

export function rowingPoint(u,v,rig){
  const point=rig.movement.deform(u,v,rig);
  const skins=rig.arms.map(arm=>{
    const projections=[0,1].map(j=>{
      const a=arm.source[j],b=arm.source[j+1],dx=b[0]-a[0],dy=b[1]-a[1];
      const t=Math.max(0,Math.min(1,((point[0]-a[0])*dx+(point[1]-a[1])*dy)/(dx*dx+dy*dy)));
      return {t,distance:Math.hypot(point[0]-a[0]-t*dx,point[1]-a[1]-t*dy)};
    });
    const wristDistance=Math.hypot(point[0]-arm.source[2][0],point[1]-arm.source[2][1]);
    const fist=1-smooth(.075,.115,wristDistance);
    const boneWeights=projections.map(p=>1/(.0009+p.distance*p.distance)**2);
    // Both segments meet at the same half blend at the elbow. Blend nearby
    // bones continuously instead of switching ownership at a nearest-bone edge.
    const bends=[.5*smooth(.55,1,projections[0].t),.5+.5*smooth(0,.4,projections[1].t)];
    const elbowBlend=(bends[0]*boneWeights[0]+bends[1]*boneWeights[1])/(boneWeights[0]+boneWeights[1]);
    const distance=Math.min(...projections.map(p=>p.distance));
    const shoulder=smooth(0,.55,projections[0].t);
    const influence=(shoulder*boneWeights[0]+boneWeights[1])/(boneWeights[0]+boneWeights[1]);
    const weight=Math.max((1-smooth(.055,.13,distance))*influence,fist);
    const forearm=rotate(point,arm.source[1],arm.target[1],arm.rotations[1]);
    const upper=rotate(point,arm.source[0],arm.target[0],arm.rotations[0]);
    const skin=upper.map((value,j)=>value+(forearm[j]-value)*elbowBlend);
    const hand=rotate(point,arm.source[2],arm.target[2],arm.rotations[1]);
    return {fist,weight,deformed:skin.map((value,j)=>value+(hand[j]-value)*fist)};
  });
  for(let i=0;i<skins.length;i++)skins[i].weight*=1-skins[1-i].fist;
  const ownership=Math.max(...skins.map(s=>s.weight)),total=skins.reduce((sum,s)=>sum+s.weight**4,0);
  const result=total?point.map((value,j)=>value+ownership*skins.reduce((sum,s)=>sum+(s.deformed[j]-value)*s.weight**4,0)/total):point;
  return result;
}

export function paddleThroughHands(upper,lower,waterY=-.24){
  const distance=Math.hypot(lower.x-upper.x,lower.y-upper.y,lower.z-upper.z);
  const direction={x:(lower.x-upper.x)/distance,y:(lower.y-upper.y)/distance,z:(lower.z-upper.z)/distance};
  const toWater=(waterY-lower.y)/direction.y;
  return {start:{x:upper.x-direction.x*.065,y:upper.y-direction.y*.065,z:upper.z-direction.z*.065},
    tip:{x:lower.x+direction.x*toWater,y:waterY,z:lower.z+direction.z*toWater}};
}

export function rowingStroke(time){
  const cycle=((time%3.6)+3.6)%3.6/3.6;
  const recovery=smooth(.52,.72,cycle)*(1-smooth(.87,1,cycle));
  return {waterY:-.17+.29*recovery,power:cycle>.08&&cycle<.52?Math.sin((cycle-.08)/.44*Math.PI):0};
}
