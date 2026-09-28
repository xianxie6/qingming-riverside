(function(root,factory){
  const movement=factory();
  if(typeof module==='object'&&module.exports)module.exports=movement;
  else root.ScrollMovement=movement;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=v=>{const t=clamp(v);return t*t*(3-2*t);};
  const speeds={walk:102,auto:62};
  // Input events choose a direction; animation frames advance the journey.
  // A short tap has a destination measured from press-down, not release.
  function createWalkInput(){
    const held=new Map();
    return {
      get direction(){return [...held.values()].at(-1)?.direction||0;},
      press(source,direction,x,time,tapDistance=18){
        if(held.has(source))return false;
        held.set(source,{direction,x,time,tapDistance});return true;
      },
      release(source,x,time,cancel=false){
        const press=held.get(source);held.delete(source);
        if(!press||cancel||held.size||time-press.time>220)return null;
        const goal=press.x+press.direction*press.tapDistance;
        return (goal-x)*press.direction>.5?goal:null;
      },
      clear(){held.clear();}
    };
  }
  function stepWalk(x,velocity,dt,{direction=0,goal=null,speed=speeds.walk,min=-Infinity,max=Infinity}={}){
    if(dt<=0)return {x,velocity,arrived:false};
    const destination=goal===null?null:clamp(goal,min,max);
    const diff=destination===null?0:destination-x;
    const target=direction?Math.sign(direction)*speed:destination===null?0:clamp(diff*8,-speed,speed);
    const response=target?24:28,decay=Math.exp(-response*dt);
    let nextVelocity=target+(velocity-target)*decay;
    // Integrate the eased velocity exactly so a held key travels the same
    // distance on 30, 60 and 120 Hz displays.
    let nextX=x+target*dt+(velocity-target)*(1-decay)/response;
    const arrived=!direction&&destination!==null&&
      ((destination-nextX)*diff<=0||(Math.abs(destination-nextX)<.12&&Math.abs(nextVelocity)<1.5));
    if(arrived){nextX=destination;nextVelocity=0;}
    if(nextX<=min||nextX>=max){nextX=clamp(nextX,min,max);nextVelocity=0;}
    if(!target&&Math.abs(nextVelocity)<.1)nextVelocity=0;
    return {x:nextX,velocity:nextVelocity,arrived};
  }
  const hands=[[211,310],[458,310],[676,297],[992,258],[1210,278],[1425,312],
    [162,748],[332,785],[703,761],[925,706],[1228,811],[1427,753]];
  function gaitAt(distance,height,weight=1,stride=.32){
    const step=height*stride,cycle=((distance/(step*2))%1+1)%1;
    return [0,.5].map(offset=>{
      const t=(cycle+offset)%1,stance=t<.6;
      const u=stance?t/.6:(t-.6)/.4;
      // Match horizontal velocity at lift-off and heel strike. A brief
      // double-support interval lets weight transfer before the next step.
      const travel=stance?.5-t/.6:-.5-2/3*u+5*u*u-10/3*u*u*u;
      return {x:step*1.2*travel,
        lift:stance?0:Math.sin(Math.PI*u)**2*height*.035*weight,
        swing:stance?0:Math.sin(Math.PI*u),stance:stance||weight===0};
    });
  }
  // Two-bone leg in the character's local coordinates. The ankle and shoe
  // share a transform; neither can translate independently of the shin.
  function legJoints(hip,ankle,thigh,shin,forward){
    const dx=ankle[0]-hip[0],dy=ankle[1]-hip[1],distance=Math.hypot(dx,dy)||1;
    // Extend both segments together when a slope puts the target beyond
    // reach. Clamping only the knee left one shin longer than the other.
    const stretch=Math.max(1,(distance+.0001)/(thigh+shin));
    thigh*=stretch;shin*=stretch;
    const reach=distance;
    const along=(thigh*thigh-shin*shin+reach*reach)/(2*reach);
    const bend=Math.sqrt(Math.max(0,thigh*thigh-along*along));
    return [hip,[hip[0]+dx/distance*along+dy/distance*bend*forward,
      hip[1]+dy/distance*along-dx/distance*bend*forward],ankle];
  }
  function legSkeleton(rig){
    const {w,h,f,contacts,feet,leg,natural=1,pose}=rig;
    const bottom=Math.max(...contacts.map(p=>p.y));
    const contact=contacts[leg],foot=feet[leg];
    const cx=(contact.x/f.w-.5)*w,cy=(contact.y-bottom)/f.h*h;
    const hipY=(.60-bottom/f.h)*h,ankleY=cy-h*.035;
    const center=((contacts[0].x+contacts[1].x)/(2*f.w)-.5)*w;
    const sourceHip=[center+(cx-center)*.25,hipY],sourceAnkle=[cx,ankleY];
    const length=Math.hypot(cx-sourceHip[0],ankleY-hipY)/2;
    const cycle=(pose.phase||0)/.15/(h*(rig.stride??.32)*2)*Math.PI*2;
    const bob=(Math.cos(cycle*2)-1)*h*.004*(pose.gaitWeight??1);
    const hipShift=(pose.sway||0)+(pose.lean||0)*.10*h;
    const target=legJoints([sourceHip[0]+hipShift,hipY+bob],
      [foot.x,foot.y-h*.035],length*1.005,length*1.005,natural);
    const kneeX=rig.legKnees?.[leg];
    const source=[sourceHip,[kneeX===undefined?(sourceHip[0]+cx)/2:(kneeX-.5)*w,(hipY+ankleY)/2],sourceAnkle];
    return {source,target,hipY,ankleY,bottom};
  }
  function deformLeg(u,v,rig){
    const {w,h,f}=rig;
    const {source,target,hipY,ankleY,bottom}=rig.skeleton??legSkeleton(rig);
    const sy=(v-bottom/f.h)*h,sx=(u-.5)*w;
    // Continuous skinning across the knee, rigid below the ankle.
    const t=clamp((sy-hipY)/(ankleY-hipY)),section=t<.5?0:1;
    const q=clamp((t-section*.5)*2);
    const center=[0,1].map(i=>source[section][i]*(1-q)+source[section+1][i]*q);
    const dest=[0,1].map(i=>target[section][i]*(1-q)+target[section+1][i]*q);
    // Preserve the shoe's painted shape, translating it with its ankle.
    // A horizontal cross-section follows the bone centerline continuously;
    // unlike rotating wide mesh cells, this cannot fold a shoe inside out.
    return [dest[0]+sx-center[0],dest[1]+sy-center[1]];
  }

  function activityAt(activity,time,phase=0,period=5.6,attention=0){
    const t=time+phase,c=((t%period)+period)%period/period;
    const gesture=Math.max(smooth(c/.18)*(1-smooth((c-.64)/.26)),attention);
    const beat=Math.sin(c*Math.PI*2),small=Math.sin(t*.9)*.012;
    const pose={handX:0,handY:0,lean:small*.3,nod:small,gesture,phase:t,sway:Math.sin(t*.71)*.12};
    switch(activity){
      case 'drink':Object.assign(pose,{handX:-2.5*gesture,handY:-5.2*gesture,nod:.055*gesture});break;
      case 'eat':Object.assign(pose,{handX:-1.8*gesture,handY:-3.8*gesture,nod:.045*gesture});break;
      case 'pour':Object.assign(pose,{handX:-2.7*gesture,handY:1.5*gesture,lean:-.022*gesture,nod:.04*gesture});break;
      case 'trade':case 'serve':Object.assign(pose,{handX:4.4*gesture,handY:-1.1*gesture,lean:.012*gesture,nod:-.025*gesture});break;
      case 'pottery':Object.assign(pose,{handX:Math.sin(c*Math.PI*4)*1.5,handY:1.4+beat*.8,lean:.025,nod:.045});break;
      case 'weave':Object.assign(pose,{handX:beat*4.5,handY:Math.cos(c*Math.PI*4)*.6,lean:beat*.012,nod:.025});break;
      case 'mill':Object.assign(pose,{handX:5*gesture,handY:-2.4*gesture,lean:.035*gesture,nod:.02});break;
      case 'pack':case 'tend':case 'work':Object.assign(pose,{handX:2.2*gesture,handY:5*gesture,lean:.065*gesture,nod:.07*gesture});break;
      case 'row':{
        const reach=Math.sin(c*Math.PI*2),dip=Math.cos(c*Math.PI*2);
        Object.assign(pose,{handX:reach*5.4,handY:dip*1.8,lean:-reach*.075,nod:dip*.028,sway:0});break;
      }
      case 'look':Object.assign(pose,{nod:Math.sin(t*.65)*.035,handX:gesture*.8});break;
      default:Object.assign(pose,{handX:2*gesture,handY:-2.3*gesture,nod:Math.sin(t*1.2)*.03});
    }
    return pose;
  }
  function visibleFeet(feet){
    // The artwork is a side view, with a rear and a front silhouette, not
    // anatomical left/right legs. Exchange silhouette ownership when the
    // feet pass instead of dragging the painted left leg through the right.
    return [...feet].sort((a,b)=>a.x-b.x);
  }
  function footContacts(data,width,height){
    return [0,1].map(side=>{
      const left=side?Math.floor(width/2):0,right=side?width:Math.floor(width/2);
      let bottom=-1;
      for(let y=height-1;y>height*.75&&bottom<0;y--)for(let x=left;x<right;x++)if(data[(y*width+x)*4+3]>96){bottom=y;break;}
      if(bottom<0)return {x:(left+right)/2,y:height};
      let sum=0,count=0;
      for(let y=Math.max(0,bottom-3);y<=bottom;y++)for(let x=left;x<right;x++)if(data[(y*width+x)*4+3]>96){sum+=x+.5;count++;}
      return {x:sum/count,y:bottom+1};
    });
  }
  function deform(u,v,rig){
    if(rig.skeletal&&rig.leg!==undefined)return deformLeg(u,v,rig);
    const {w,h,f,contacts,feet,pose,hand,walking}=rig;
    const bottom=Math.max(...contacts.map(p=>p.y));
    let x=(u-.5)*w,y=(v-bottom/f.h)*h;
    const upper=1-smooth((v-.62)/.15);
    x+=(pose.sway||0)*upper+(pose.lean||0)*(.7-v)*h*upper;
    // Match the body's rise to the distance-driven feet, at every height.
    if(walking||rig.skeletal){
      const cycle=(pose.phase||0)/.15/(h*(rig.stride??.32)*2)*Math.PI*2;
      y-=(1-Math.cos(cycle*2))*h*.004*upper*(pose.gaitWeight??1);
    }
    const head=1-smooth((v-.18)/.13),nod=pose.nod||0;
    x-=nod*(v-.29)*h*head;y+=nod*(u-.55)*w*head;
    const du=(u-hand[0])/.4,dv=(v-hand[1])/.26;
    const arm=Math.exp(-(du*du+dv*dv)*2)*upper*smooth((v-.19)/.12);
    x+=(pose.handX||0)*arm;y+=(pose.handY||0)*arm;
    const weight=rig.leg===undefined?smooth((v-.71)/.22):clamp((v-.64)/.30),mix=rig.continuous?clamp((u-contacts[0].x/f.w)/((contacts[1].x-contacts[0].x)/f.w)):smooth((u-.43)/.14);
    if(rig.cloth){
      // A long robe hangs over the legs; it must not become two crossed
      // trouser legs. Let the hem breathe with the stride without folding it.
      const spread=Math.abs(feet[1].x-feet[0].x);
      const rest=Math.abs(contacts[1].x-contacts[0].x)/f.w*w;
      x+=(u-.5)*Math.max(0,spread-rest)*.5*weight;
      y-=Math.max(...feet.map(foot=>foot.lift||0))*.15*weight;
      return [x,y];
    }
    for(let leg=0;leg<2;leg++){
      // Each leg is a separate mesh below the hip. Blending opposite foot
      // translations across one connected mesh inverts it as the feet pass.
      const influence=(rig.leg===undefined?(leg?mix:1-mix):Number(rig.leg===leg))*weight;
      x+=(feet[leg].x-(contacts[leg].x/f.w-.5)*w)*influence;
      y+=(feet[leg].y-(contacts[leg].y-bottom)/f.h*h)*influence;
    }
    return [x,y];
  }
  return {speeds,hands,createWalkInput,stepWalk,gaitAt,visibleFeet,activityAt,footContacts,deform,legJoints,legSkeleton};
});
