// Refined actors only around the flower shop; all other districts retain their art.
const cast={
 'tea-15':{art:'women-2',role:'walk',w:34,h:63,y:485,route:[6185,6300],speed:17,label:'提篮女客 · 沿街慢行'},
 'tea-16':{art:'conversation-solo',role:'chat',w:27,h:45,label:'老茶客 · 捧盏歇脚'},
 'tea-17':{art:'conversation-2',role:'chat',x:6430,w:66,h:47,members:2,label:'茶客 · 坐饮闲谈'},
 'tea-19':{art:'men-2',role:'walk',w:33,h:63,y:485,route:[6480,6595],speed:16,label:'年轻街坊 · 看花慢行'},
 'bridge-34':{art:'men-1',role:'walk',w:33,h:65,y:471,route:[6850,7020],speed:15,label:'长者 · 沿街缓行'},
 'bridge-35':{art:'men-2',role:'walk',w:33,h:63,y:487,route:[6995,7160],speed:19,label:'商贩 · 沿河闲逛'},
 'visitors-46':{art:'conversation-0',role:'chat',w:59,h:64,label:'街坊 · 停步交谈'},
 'visitors-48':{art:'conversation-1',role:'chat',w:61,h:63,label:'搬夫 · 歇脚聊家常'},
};
export function refineFlowerStreetPeople(people){
 return people.flatMap(p=>{
  if(p.id==='tea-18')return[]; // Joins tea-17 at the same tea-table group.
  if(p.id==='visitors-49'||p.id==='visitors-50'){
   const family=p.id==='visitors-49';
   // The family keeps to the middle of the street, clear of the river edge.
   return [0,1].map(i=>({...p,id:p.id+(i?'-companion':'-lead'),x:p.x+(i?17:-17),y:family?(i?484:482):481,
    w:family?(i?24:32):33,h:family?(i?45:61):63,members:1,posture:'standing',
    label:family?(i?'孩童 · 随母亲看花':'母亲 · 带孩子逛街'):(i?'行商 · 结伴慢行':'搬夫 · 结伴慢行'),
    flowerStreet:{art:family?(i?'women-1':'women-0'):(i?'men-2':'men-0'),role:'walk',
     route:family?[6900,7110]:[7070,7370],speed:family?17:18,groupX:p.x,offset:i?17:-17}}));
  }
  const spec=cast[p.id];if(!spec)return[p];
  const {art,role,route,speed,...layout}=spec;
  return[{...p,...layout,flowerStreet:{art,role,route,speed}}];
 });
}

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function leg(distance,speed,time){
 const ramp=.65,duration=distance/speed+ramp,s=clamp(time,0,duration);
 const travel=s<ramp?speed*s*s/(2*ramp):s>duration-ramp?distance-speed*(duration-s)**2/(2*ramp):speed*(s-ramp/2);
 return {travel,duration};
}
function atDistance(distance,speed,travel){
 const ramp=.65,duration=distance/speed+ramp,edge=speed*ramp/2;
 return travel<edge?Math.sqrt(2*ramp*travel/speed):travel>distance-edge?duration-Math.sqrt(2*ramp*(distance-travel)/speed):travel/speed+ramp/2;
}
export function flowerStreetPose(p,time=0){
 const spec=p.flowerStreet,pose={x:p.x,y:p.y,flip:false,scale:1,kind:'chat',scripted:true,
  stride:0,bend:0,nod:0,lift:0,reach:0,streetTime:time,streetFrame:0,activity:'停步闲谈'};
 if(spec.role==='chat'){
  // Long rests between small drawn gestures; the bodies never sway or warp.
  const cycle=(time+(p.x%7))%9;
  pose.streetFrame=cycle<2.5?0:cycle<3.7?1:cycle<6.5?2:3;
  if(spec.art.includes('2')||spec.art.includes('solo'))pose.activity='坐饮闲谈';
  return pose;
 }
 const [left,right]=spec.route,distance=right-left,speed=spec.speed,hold=1.8;
 const duration=leg(distance,speed,0).duration;
 const offset=atDistance(distance,speed,clamp((spec.groupX??p.x)-left,0,distance));
 const cycle=(Math.max(0,time)+offset)%(2*(duration+hold));
 let travel,moving=false,walked=0;
 if(cycle<duration){travel=leg(distance,speed,cycle).travel;walked=travel;moving=true;}
 else if(cycle<duration+hold){travel=distance;pose.flip=cycle>duration+hold/2;}
 else if(cycle<2*duration+hold){const back=leg(distance,speed,cycle-duration-hold).travel;travel=distance-back;walked=distance+back;moving=true;pose.flip=true;}
 else{travel=0;pose.flip=cycle<2*duration+hold*1.5;}
 pose.x=left+travel+(spec.offset||0);
 pose.kind=moving?'walk':'chat';pose.streetFrame=moving?1+Math.floor(walked/(5.5*p.h/63))%4:0;
 pose.activity=moving?'沿街慢行':'停步看看花';
 return pose;
}

// Keep one shared crop and grounded baseline per row, never resize each pose.
export function prepareStreetAtlas(sheet,cols,rows){
 const cw=Math.ceil(sheet.width/cols),ch=Math.ceil(sheet.height/rows),source=document.createElement('canvas');
 source.width=cw*cols;source.height=ch*rows;const t=source.getContext('2d',{willReadFrequently:true});t.drawImage(sheet,0,0,source.width,source.height);
 const pixels=t.getImageData(0,0,source.width,source.height).data,result=[];
 for(let row=0;row<rows;row++){
  const bounds=Array.from({length:cols},(_,col)=>{
   let x0=cw,y0=ch,x1=0,y1=0,weight=0,anchor=0;
   for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){
    const a=pixels[((row*ch+y)*source.width+col*cw+x)*4+3];
    if(a>24){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
    if(a>160&&y<ch*.24){weight+=a;anchor+=x*a;}
   }
   return{x0,y0,x1,y1,anchor:weight?anchor/weight:cw/2};
  });
  const offsets=bounds.map(b=>({x:Math.round(bounds[0].anchor-b.anchor),y:bounds[0].y1-b.y1}));
  const left=Math.min(...bounds.map((b,i)=>b.x0+offsets[i].x)),right=Math.max(...bounds.map((b,i)=>b.x1+offsets[i].x));
  const top=Math.min(...bounds.map((b,i)=>b.y0+offsets[i].y)),bottom=bounds[0].y1;
  result[row]=bounds.map((_,col)=>{
   const c=document.createElement('canvas');c.width=right-left+1;c.height=bottom-top+1;
   c.getContext('2d').drawImage(sheet,col*cw,row*ch,cw,ch,offsets[col].x-left,offsets[col].y-top,cw,ch);return c;
  });
 }
 return result;
}

export function createFlowerStreetArt(images){
 const frames={};
 for(const [name,cols] of [['men',5],['women',5],['conversation',4]]){
  prepareStreetAtlas(images[name],cols,3).forEach((row,i)=>frames[name+'-'+i]=row);
 }
 frames['conversation-solo']=frames['conversation-2'].map(source=>{
  const c=document.createElement('canvas');c.width=Math.floor(source.width*.49);c.height=source.height;
  c.getContext('2d').drawImage(source,0,0);return c;
 });
 return {
  frame(p,pose=p){return frames[p.flowerStreet.art]?.[pose.streetFrame||0];},
  frames:name=>frames[name],
  draw(ctx,p,pose){const img=this.frame(p,pose);if(!img)return false;ctx.drawImage(img,-p.w/2,-p.h,p.w,p.h);return true;},
 };
}
