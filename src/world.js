(function(root,factory){
  const world=factory();
  if(typeof module==='object'&&module.exports)module.exports=world;
  else root.ScrollWorld=world;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  // Coordinates traced in the 2172 × 724 source painting. The deck and
  // foreground railing are separate paths; their profiles are not concentric.
  const bridgeGeometry={
    deck:[[1250,477],[1258,477],[1280,474],[1310,467],[1340,457],[1370,445],[1400,432],[1430,422],[1460,413],[1490,407],[1520,404],[1550,405],[1580,409],[1610,418],[1640,430],[1670,445],[1700,461],[1724,474],[1740,477]],
    rail:[[1353,426],[1370,418],[1400,407],[1430,397],[1460,389],[1490,384],[1520,383],[1550,385],[1580,391],[1610,400],[1640,413],[1670,427],[1700,444],[1711,450]],
    posts:[[1355,416,459,5.3],[1427,389,435,6.5],[1472,380,413,3.8],[1508,375,410,4.3],[1576,384,420,3.6],[1618,392,437,6.2],[1688,431,463,5]]
  };
  // The pavilion sits on a raised stone plinth. The public lane follows its
  // outer foot, not the y=477 line through the middle of the masonry.
  const pavilionGeometry={
    lane:[[1770,477],[1806,482],[1840,485],[1988,485],[1997,483],[2020,477]],
    plinth:{left:1808,right:1994,top:454,bottom:482},
    posts:[[[1842,486],[1844,480],[1847,477],[1850,477],[1853,481],[1855,493],[1855,512],[1842,512]],
      [[1982,485],[1983,479],[1986,476],[1989,476],[1992,480],[1994,493],[1994,512],[1982,512]]]
  };
  function pathY(points,x){
    if(x<=points[0][0])return points[0][1];
    if(x>=points.at(-1)[0])return points.at(-1)[1];
    let i=0;while(points[i+1][0]<x)i++;
    const slope=j=>(points[j+1][1]-points[j][1])/(points[j+1][0]-points[j][0]);
    const tangent=j=>{
      if(j===0)return slope(0);if(j===points.length-1)return slope(j-1);
      const a=slope(j-1),b=slope(j);return a*b<=0?0:2*a*b/(a+b);
    };
    const [x0,y0]=points[i],[x1,y1]=points[i+1],h=x1-x0,t=(x-x0)/h;
    return (2*t**3-3*t*t+1)*y0+(t**3-2*t*t+t)*h*tangent(i)+(-2*t**3+3*t*t)*y1+(t**3-t*t)*h*tangent(i+1);
  }
  function streetY(x,lane=0){
    const points=pavilionGeometry.lane;
    if(x>=points[0][0]&&x<=points.at(-1)[0])return pathY(points,x);
    const laneRoom=clamp((points[0][0]-x)/24,0,1)+clamp((x-points.at(-1)[0])/24,0,1);
    return pathY(bridgeGeometry.deck,x)+lane*2*laneRoom;
  }
  const frontRailY=x=>pathY(bridgeGeometry.rail,x);
  const ferryGeometry={scale:1.24,deckY:-10,passengerX:-36};
  const ferryTravelDuration=48;
  // Ferry waterlines reach y=608. Leave room below that for the full
  // foreground crew silhouette (61 * 1.04), hull bobbing and a water gap.
  // Equal speeds and even spacing prevent ambient boats catching each other.
  function ambientBoats(time,min,max){
    const loop=max-min+220;
    return Array.from({length:3},(_,i)=>({
      id:'ambient-'+i,
      x:min-110+((440+i*loop/3+time*7)%loop+loop)%loop,
      y:694,scale:1.04,phase:time+i,direction:1
    }));
  }
  const berths={east:{x:2085,y:556,shoreX:2000},west:{x:630,y:556,shoreX:568}};
  const passengerModes=new Set(['boarding','sailing','disembarking']);
  const isPassenger=ferry=>passengerModes.has(ferry.mode);
  function createFerry(){return {x:1880,y:576,mode:'waiting',direction:1,dockTime:0,visits:0,hold:false,berth:'east',targetBerth:'east',tripTime:0,trips:0};}
  function summonFerry(ferry,berth='east'){
    if(isPassenger(ferry))return false;
    if(['docked','moored'].includes(ferry.mode)&&ferry.berth===berth){ferry.mode='docked';ferry.dockTime=0;return true;}
    ferry.mode='approaching';ferry.direction=1;ferry.targetBerth=berth;return true;
  }
  function approach(ferry,x,y,dt,maxSpeed=30){
    const dx=x-ferry.x,dy=y-ferry.y,distance=Math.hypot(dx,dy);
    const step=Math.min(distance,Math.min(maxSpeed,distance*1.3+3)*dt);
    if(distance){ferry.x+=dx/distance*step;ferry.y+=dy/distance*step;}
    return distance-step<.12;
  }
  function stepFerry(ferry,dt){
    if(dt<=0)return;
    if(ferry.mode==='boarding'){
      ferry.tripTime=Math.min(3.4,ferry.tripTime+dt);
      if(ferry.tripTime>=3.4){ferry.mode='sailing';ferry.tripTime=0;}
    }else if(ferry.mode==='sailing'){
      ferry.tripTime=Math.min(ferryTravelDuration,ferry.tripTime+dt);
      const t=ferry.tripTime/ferryTravelDuration,e=.5-.5*Math.cos(Math.PI*t),a=berths[ferry.origin],b=berths[ferry.destination];
      ferry.x=a.x+(b.x-a.x)*e;ferry.y=556+52*Math.sin(Math.PI*t)**2;
      if(t>=1){ferry.mode='disembarking';ferry.tripTime=0;ferry.berth=ferry.destination;}
    }else if(ferry.mode==='disembarking'){
      ferry.tripTime=Math.min(3.4,ferry.tripTime+dt);
      if(ferry.tripTime>=3.4){ferry.mode='moored';ferry.hold=false;ferry.trips++;}
    }else if(ferry.mode==='approaching'){
      const b=berths[ferry.targetBerth];
      if(approach(ferry,b.x,b.y,dt,Math.abs(ferry.x-b.x)>300?58:28)){ferry.x=b.x;ferry.y=b.y;ferry.berth=ferry.targetBerth;ferry.mode='docked';ferry.dockTime=0;ferry.visits++;}
    }else if(ferry.mode==='docked'){
      ferry.dockTime+=dt;
      if(ferry.dockTime>=7&&!ferry.hold){ferry.mode='departing';ferry.direction=1;}
    }else if(ferry.mode==='departing'){
      if(approach(ferry,2292,582,dt)){ferry.mode='returning';ferry.direction=-1;}
    }else if(ferry.mode==='returning'){
      if(approach(ferry,1880,576,dt)){ferry.mode='waiting';}
    }
  }
  function boardFerry(ferry){
    if(!['docked','moored'].includes(ferry.mode))return false;
    ferry.mode='boarding';ferry.origin=ferry.berth;ferry.destination=ferry.berth==='east'?'west':'east';
    ferry.tripTime=0;ferry.direction=ferry.destination==='west'?1:-1;ferry.hold=true;return true;
  }
  function boardingPath(berth){
    const b=berths[berth];
    const deck=[b.x+ferryGeometry.passengerX,b.y+ferryGeometry.deckY*ferryGeometry.scale];
    return berth==='east'?[[b.shoreX,streetY(b.shoreX)],[2015,489],[2025,512],[2025,535],deck]:
      [[b.shoreX,streetY(b.shoreX)],[575,490],[585,514],[592,535],deck];
  }
  function alongPath(points,t){
    const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
    let distance=clamp(t,0,1)*lengths.reduce((a,b)=>a+b,0);
    for(let i=0;i<lengths.length;i++){
      if(distance<=lengths[i]||i===lengths.length-1){const u=clamp(distance/lengths[i],0,1);return {x:points[i][0]+(points[i+1][0]-points[i][0])*u,y:points[i][1]+(points[i+1][1]-points[i][1])*u};}
      distance-=lengths[i];
    }
  }
  function passengerPose(ferry){
    if(ferry.mode==='boarding'){
      const t=ferry.tripTime/3.4;return {...alongPath(boardingPath(ferry.origin),t),scale:1.5-.22*t,facing:1,moving:true};
    }
    if(ferry.mode==='disembarking'){
      const t=ferry.tripTime/3.4;return {...alongPath(boardingPath(ferry.destination).slice().reverse(),t),scale:1.28+.22*t,facing:-1,moving:true};
    }
    return {x:ferry.x+ferryGeometry.passengerX,y:ferry.y+ferryGeometry.deckY*ferryGeometry.scale,scale:1.28,facing:ferry.destination==='west'?-1:1,moving:false};
  }
  function pedestrianAt(p,time){
    const duration=(p.to-p.from)/p.speed,pause=p.pause||4,cycle=2*(duration+pause);
    const phase=((time+(p.offset||0))%cycle+cycle)%cycle;
    if(phase<duration)return {x:p.from+p.speed*phase,direction:1,moving:true,phase:phase*p.speed*.15};
    if(phase<duration+pause)return {x:p.to,direction:1,moving:false,phase:0};
    if(phase<2*duration+pause){const back=phase-duration-pause;return {x:p.to-p.speed*back,direction:-1,moving:true,phase:back*p.speed*.15};}
    return {x:p.from,direction:-1,moving:false,phase:0};
  }
  return {ambientBoats,createFerry,summonFerry,stepFerry,pedestrianAt,clamp,streetY,frontRailY,bridgeGeometry,pavilionGeometry,ferryGeometry,ferryTravelDuration,berths,isPassenger,boardFerry,passengerPose};
});
