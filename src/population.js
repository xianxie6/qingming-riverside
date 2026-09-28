(function(root,factory){
  const population=factory(typeof module==='object'&&module.exports?require('./movement.js'):root.ScrollMovement);
  if(typeof module==='object'&&module.exports)module.exports=population;
  else root.ScrollPopulation=population;
})(typeof globalThis!=='undefined'?globalThis:this,function(movement){
  'use strict';
  const bounds={min:-2172,max:4344,height:724,originalWidth:2172};
  const proportions={
    adult:{min:61,max:66},
    child:{min:42,max:46},
    seated:{min:44,max:48},
    bridge:{min:54,max:58},
    pavilion:{min:53,max:56}
  };
  const residents=[];
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function figureHeight(height,sprite,layer){
    if(sprite===10)return clamp(height,proportions.child.min,proportions.child.max);
    if([6,7,8].includes(sprite))return clamp(height,proportions.seated.min,proportions.seated.max);
    if(layer==='bridge')return clamp(height,proportions.bridge.min,proportions.bridge.max);
    if(layer==='pavilion')return clamp(height,proportions.pavilion.min,proportions.pavilion.max);
    return clamp(height,proportions.adult.min,proportions.adult.max);
  }
  // Original street inhabitants now live in separate animated layers.
  function add(x,y,h,sprite,role='talk',direction=1,layer='street'){
    const id=residents.length,normalizedHeight=figureHeight(h,sprite,layer);
    // Seated source crops end at the robe resting on the stool, not at the
    // street. Preserve their original head line when normalizing their scale.
    const baseline=[6,7,8].includes(sprite)?y-(h-normalizedHeight):y;
    residents.push({id:`resident-${id}`,x,y:baseline,h:normalizedHeight,sprite,role,direction,layer,outfit:(id*5+Math.floor(id/4))%8,phase:id*2.399963,period:4.8+(id%9)*.51});
  }
  [548,588,628,660,695,759,797].forEach((x,i)=>add(x,323,48,[6,7,8,6,7,8,6][i],i%2?'talk':'drink',1,'balcony'));
  // Food stalls, table groups, neighbours, children and the east pavilion.
  [[80,474,65,9],[109,477,64,5],[211,476,65,8],[271,477,70,5],
   [313,473,61,6],[347,475,62,7],[386,477,62,8],
   [480,478,67,2],[501,480,65,9],[523,478,66,4],
   [584,477,68,5],[620,476,65,6],[658,477,64,7],[691,476,66,8],
   [785,476,66,6],[823,477,74,9],[877,477,65,4],[930,477,65,9],[954,477,66,2],
   [1134,477,45,10],[1157,477,48,10],
   [1235,476,66,9],[1280,476,66,0],
   [1717,477,68,9],[1742,477,67,4],[1765,477,66,2],[1790,477,67,9],
   [1886,456,55,6],[1925,456,54,7],
   [2010,477,65,5],[2029,477,62,4],[2110,477,70,2],[2145,477,67,9]
  ].forEach(([x,y,h,s],i)=>add(x,y,h,s,s===5?'serve':s>=6&&s<=8?(i%2?'drink':'talk'):s===4?'trade':'talk',i%3===0?-1:1,x>1840&&x<1980?'pavilion':'street'));
  [1338,1368,1432,1466,1520,1546,1583,1629,1678].forEach((x,i)=>add(x,0,59+(i%3)*3,[9,0,2,9,4][i%5],'talk',i%2?-1:1,'bridge'));
  // West: gardens, watermill, pottery and weaving workshops, produce market.
  [[-2050,471,65,11],[-1970,476,60,2],[-1810,477,64,4],[-1740,477,66,9],
   [-1500,471,66,11],[-1380,475,65,4],[-1330,476,61,9],
   [-1240,474,60,8],[-1165,474,62,11],[-1090,473,65,8],
   [-970,476,66,4],[-920,476,63,9],[-845,474,63,11],
   [-790,474,60,8],[-715,475,65,11],[-580,476,63,2],
   [-480,474,65,4],[-416,475,61,9],[-348,476,66,5],[-270,476,63,4],[-150,477,63,2]
  ].forEach(([x,y,h,s],i)=>add(x,y,h,s,s===11||s===8?'work':s===4?'trade':'talk',i%2?1:-1));
  // East: cloth market, gate guards, warehouse and freight workers.
  [[2250,476,65,4],[2315,476,63,9],[2370,475,62,8],[2480,476,66,4],
   [2540,476,64,2],[2610,475,62,11],[2660,477,67,9],[2760,477,63,4],
   [2830,476,67,5],[2890,476,65,9],[2940,476,65,2],[3110,476,65,11],
   [3215,476,68,9],[3270,476,65,4],[3310,477,63,2],[3360,475,66,9],
   [3480,475,65,11],[3570,477,65,4],[3660,476,65,11],[3780,476,64,11],
   [3850,476,63,9],[3980,477,64,4],[4050,477,63,11],[4180,477,66,11],[4260,477,65,4]
  ].forEach(([x,y,h,s],i)=>add(x,y,h,s,s===11?'work':s===4?'trade':'talk',i%2?-1:1));
  // Remove the seated cloth-market resident overlapping the tree trunk.
  // Filter after assigning IDs so other residents keep their outfits and timing.
  const treeSeat=residents.findIndex(p=>p.x===2370&&p.sprite===8);
  if(treeSeat!==-1)residents.splice(treeSeat,1);
  const walkers=[];
  const routes=[[-2120,-1625],[-1440,-1020],[-1030,-420],[-550,210],[90,1200],[1110,2060],[1820,2600],[2300,3160],[3160,3760],[3610,4270]];
  routes.forEach(([from,to],r)=>{
    for(let i=0;i<4;i++){
      const id=r*4+i;
      walkers.push({id:`walker-${id}`,from,to,speed:23+(id%7)*1.8,pause:2.5+(id%5)*.7,offset:13+id*11.3,h:i===3?44:58+(id%4)*2,sprite:i===3?10:[0,1,2,3][id%4],outfit:(id*5+Math.floor(id/4))%8,phase:id*2.4});
    }
  });
  for(const p of residents){
    p.activity=p.sprite===6?'drink':p.sprite===7?'talk':p.sprite===8?'eat':p.sprite===5?'pour':p.role;
    if(p.layer==='bridge')p.activity=['look','talk','trade'][Number(p.id.slice(9))%3];
    if(p.role==='work')p.activity=p.x<-1800?'tend':p.x<-1350?'mill':p.x<-1000?'pottery':p.x<-650?'weave':'pack';
    if(p.activity==='weave'){
      p.sprite=11;
      // Weavers switch from a seated source crop to a standing working pose.
      p.h=figureHeight(63,p.sprite,p.layer);
    }
    p.period=4.4+(Number(p.id.slice(9))%9)*.43;
  }
  function residentPose(p,time,attention=0){
    return {x:p.x,y:p.y,...movement.activityAt(p.activity,time,p.phase,p.period,attention),role:p.role};
  }
  return {bounds,proportions,figureHeight,residents,walkers,residentPose};
});
