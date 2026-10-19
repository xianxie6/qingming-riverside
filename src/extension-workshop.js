import {CRANE,INN,CARGO,PORTER,PILE,pileSlot,ease,warehouseActorPose,floristWaveFrame,flowerDoorOpening,clipBehindFlowerCurtain} from './extension-workshop-state.js?v=calm-1';
import {flowerCustomerPose,flowerFloristPose} from './extension-flower-customers.js?v=customers-3';
import {flowerStreetPose,createFlowerStreetArt} from './extension-flower-street.js?v=street-3';

// Horizontal wall sections, with the gate and foreground tree left clear.
const WALL_ROSES=[
 {row:0,sx:1000,sw:536,x:6526,y:335},
 {row:1,sx:0,sw:835,x:6701,y:338},
 {row:1,sx:1060,sw:476,x:6863,y:341}
];

export function createStreetWorkshop(model,invalidate,{after=Promise.resolve()}={}){
 const images={},artURLs={},artMetrics={},floristFrames=[],customerFrames=[],customerPoses=new Map();let lastFloristFrame=0,streetArt,roseFrames;
 const assets={warehouse:'assets/extension-preview/workshop/warehouse-clean.webp',inn:'assets/extension-preview/workshop/inn-open.webp',curtain:'assets/extension-preview/workshop/curtain.webp',cargo:'assets/extension-preview/workshop/cargo.webp',shop:'assets/extension-preview/workshop/flower-shop.webp',florist:'assets/extension-preview/workshop/florist.webp',peony:'assets/extension-preview/workshop/peony.webp',plum:'assets/extension-preview/workshop/plum.webp',orchid:'assets/extension-preview/workshop/orchid.webp',home:'assets/extension-preview/workshop/flower-home.webp'};
 assets.wave='assets/extension-preview/workshop/florist-wave.webp';
 assets.customers='assets/extension-preview/workshop/flower-customers-v2.webp';
 Object.assign(assets,{men:'assets/extension-preview/workshop/street-men-v1.webp',women:'assets/extension-preview/workshop/street-women-v1.webp',conversation:'assets/extension-preview/workshop/street-conversation-v1.webp',roses:'assets/extension-preview/workshop/wall-roses-v2.webp'});
 // Props wait for `after` (the scroll panels) so they do not compete for bandwidth.
 const ready=after.then(()=>Promise.all(Object.entries(assets).map(async([key,src])=>{
  const image=new Image();image.decoding='async';image.src=src;await image.decode();
  // Transparent sprites are automatically trimmed to their actual painted bounds.
  if(['curtain','cargo','florist','peony','plum','orchid'].includes(key)){
   const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
   const t=c.getContext('2d',{willReadFrequently:true});t.drawImage(image,0,0);const pixels=t.getImageData(0,0,c.width,c.height).data;
   let x0=c.width,y0=c.height,x1=0,y1=0;
   for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(pixels[(y*c.width+x)*4+3]>12){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
   if(x1<=x0||y1<=y0)throw new Error('Empty workshop sprite: '+key);
   const tile=document.createElement('canvas');tile.width=x1-x0+1;tile.height=y1-y0+1;tile.getContext('2d').drawImage(c,x0,y0,tile.width,tile.height,0,0,tile.width,tile.height);images[key]=tile;
   if(['peony','plum','orchid'].includes(key)){
    // The cut stem, rather than the centre of the image, belongs in the vase.
    let weight=0,stemX=0;
    for(let y=Math.max(y0,y1-Math.ceil(tile.height*.012));y<=y1;y++)for(let x=x0;x<=x1;x++){
     const a=pixels[(y*c.width+x)*4+3];if(a>32){weight+=a;stemX+=(x-x0+.5)*a;}
    }
    artMetrics[key]={stemX:weight?stemX/weight/tile.width:.5};
   }
  }else images[key]=image;
 }))).then(()=>{prepareCustomerFrames();streetArt=createFlowerStreetArt(images);prepareWallRoses();});
 function prepareWallRoses(){
  const img=images.roses,sx=img.width/1536,sy=img.height/1024;
  roseFrames=WALL_ROSES.map(p=>{
   const tile=document.createElement('canvas');tile.width=p.sw;tile.height=512;
   const t=tile.getContext('2d');t.drawImage(img,p.sx*sx,p.row*512*sy,p.sw*sx,512*sy,0,0,p.sw,512);
   // Soften only the cut ends; keep the generated transparent tendrils intact.
   const mask=t.createLinearGradient(0,0,p.sw,0),edge=28/p.sw;
   mask.addColorStop(0,p.sx?'#0000':'#000');mask.addColorStop(edge,'#000');
   mask.addColorStop(1-edge,'#000');mask.addColorStop(1,p.sx+p.sw<1536?'#0000':'#000');
   t.globalCompositeOperation='destination-in';t.fillStyle=mask;t.fillRect(0,0,p.sw,512);
   return tile;
  });
 }
 function prepareCustomerFrames(){
  const sheet=images.customers,cw=sheet.width/4,ch=sheet.height/2;
  const source=document.createElement('canvas');source.width=sheet.width;source.height=sheet.height;
  const t=source.getContext('2d',{willReadFrequently:true});t.drawImage(sheet,0,0);
  const pixels=t.getImageData(0,0,source.width,source.height).data;
  for(let row=0;row<2;row++){
   const bounds=Array.from({length:4},(_,column)=>{
    let x0=cw,y0=ch,x1=0,y1=0,weight=0,anchor=0;
    for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){
     const a=pixels[((row*ch+y)*source.width+column*cw+x)*4+3];
     if(a>12){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
     if(a>100&&y<ch*.22){anchor+=x*a;weight+=a;}
    }
    return{x0,y0,x1,y1,anchor:weight?anchor/weight:cw/2};
   });
   const offsets=bounds.map(b=>Math.round(bounds[0].anchor-b.anchor));
   const left=Math.floor(Math.min(...bounds.map((b,i)=>b.x0+offsets[i]))),right=Math.ceil(Math.max(...bounds.map((b,i)=>b.x1+offsets[i])));
   const top=Math.min(...bounds.map(b=>b.y0)),bottom=Math.max(...bounds.map(b=>b.y1));
   customerFrames[row]=bounds.map((_,i)=>{
    const c=document.createElement('canvas');c.width=right-left+1;c.height=bottom-top+1;
    c.getContext('2d').drawImage(sheet,i*cw,row*ch,cw,ch,offsets[i]-left,-top,cw,ch);return c;
   });
  }
 }
 function patch(ctx,image,origin,originalW,originalH,rect){
  if(!image)return;const [x,y,w,h]=rect,sx=1729/originalW,sy=775/originalH;
  ctx.drawImage(image,x/originalW*image.width,y/originalH*image.height,w/originalW*image.width,h/originalH*image.height,origin+x*sx,y*sy,w*sx,h*sy);
 }
 function backdrop(ctx,left,right){
  if(right>4430&&left<4500)patch(ctx,images.warehouse,4244,1939,811,[210,217,75,205]);
  if(right>6610&&left<6695)patch(ctx,images.inn,5873,1942,809,[824,369,100,114]);
  if(images.shop&&right>INN.x&&left<INN.x+INN.w){
   const img=images.shop,sw=img.height*INN.w/INN.h;
   ctx.drawImage(img,(img.width-sw)*.52,0,sw,img.height,INN.x,INN.y,INN.w,INN.h);
  }
  if(roseFrames&&right>6526&&left<6935){
   // Crop horizontal runs at a consistent botanical scale. Gaps follow the
   // gate pillars and foreground tree, so the vines stay on the wall coping.
   const scale=.15;
   WALL_ROSES.forEach((p,i)=>ctx.drawImage(roseFrames[i],p.x,p.y,p.sw*scale,512*scale));
  }
 }
 function line(ctx,points,color='#62543b',width=1.2){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
 function label(ctx,x,y,text){
  ctx.font='11px "Songti SC",serif';const w=ctx.measureText(text).width+16;
  ctx.fillStyle='#f0e5cfed';ctx.fillRect(x-w/2,y-13,w,22);ctx.strokeStyle='#9a765b80';ctx.lineWidth=.6;ctx.strokeRect(x-w/2,y-13,w,22);ctx.fillStyle='#82543c';ctx.textAlign='center';ctx.fillText(text,x,y+2);
 }
 function sack(ctx,x,y){ctx.drawImage(images.cargo,x-CARGO.w/2,y-CARGO.h/2,CARGO.w,CARGO.h);}
 // Sacks share the street's depth order: the stack sits behind the porter,
 // and a hanging sack passes just behind his head as it settles on his back.
 function layers(ctx,left,right){
  if(!images.cargo||right<PILE.x-60||left>CRANE.handleX+40)return[];
  const p=model.warehouse,c=model.cargo(),placing=p.phase==='placing';
  return[
   {y:PILE.groundY+.4,draw(){
    const count=placing?Math.min(p.runs,PILE.max-1):model.pileCount();
    for(let i=0;i<count;i++){const s=pileSlot(i);sack(ctx,s.x,s.y);}
    if(placing)sack(ctx,c.x,c.y);
   }},
   {y:PORTER.y-.05,draw(){if(c.on==='hook')sack(ctx,c.x,c.y);}}
  ];
 }
 function drawHook(ctx,x,y){
  // A small forged hook under the pulley block.
  ctx.save();ctx.strokeStyle='#4f4433';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x,y-3);ctx.lineTo(x,y+1.5);ctx.arc(x-1.6,y+1.5,1.6,0,Math.PI*.85);ctx.stroke();ctx.restore();
 }
 function draw(ctx,left,right,{overview=false,people=true}={}){
  if(images.cargo&&right>4410&&left<4540){
   const p=model.warehouse,cargo=model.cargo(),hook=model.hook(),handleY=CRANE.handleY+CRANE.pullDistance*p.progress;
   ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
   line(ctx,[[CRANE.x,CRANE.y],[CRANE.handleX,CRANE.y+14],[CRANE.handleX,handleY]],'#66563e',1.7);
   line(ctx,[[CRANE.x+1.7,CRANE.y],[CRANE.handleX+1.7,CRANE.y+14],[CRANE.handleX+1.7,handleY]],'#b09a6e',.65);
   // The load line follows the swinging hook rather than hanging plumb.
   line(ctx,[[CRANE.x,CRANE.y+7],[hook.x,hook.y-3]],'#66563e',1.2);
   if(cargo.tied){
    const top=cargo.y-CARGO.h/2+1.5;
    line(ctx,[[cargo.x-9,top],[hook.x,hook.y+2],[cargo.x+9,top]],'#66563e',1);
   }
   drawHook(ctx,hook.x,hook.y);
   ctx.strokeStyle='#655039';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(CRANE.handleX,handleY+6,5,8,0,0,Math.PI*2);ctx.stroke();
   if(!overview&&['idle','pulling','returning'].includes(p.phase))label(ctx,CRANE.handleX+47,handleY+6,p.phase==='pulling'?'拉到底，再松手':'下拉吊绳 ↓');
   if(!overview&&p.phase==='complete')label(ctx,CRANE.handleX+47,handleY+6,'码好了 · 再吊一包 ↓');
   ctx.restore();
  }
 }
 function drawDoorway(ctx,left,right,{overview=false,people=true}={}){
  const opening=flowerDoorOpening(model.inn.progress);
  if(people&&opening.w>.01&&right>INN.x&&left<INN.x+INN.w){
   // A single visible branch crosses from the counter to the customer's hands.
   // Once received, that same branch is drawn with the customer's walking pose.
   for(const {person,pose} of customerPoses.values())if(pose.flower>0&&pose.flower<1){
    const id=person.customer===0?'peony':'plum',img=images[id],s=pose.scale||1;
    const u=pose.flower,fromX=INN.guestX+25,x=fromX+(pose.x+person.w*.1*s-fromX)*u;
    const y=413+(pose.y-person.h*.55*s-413)*u,height=23*s,width=height*img.width/img.height;
    ctx.save();ctx.beginPath();ctx.rect(opening.x,opening.y,opening.w,opening.h);ctx.clip();ctx.globalAlpha=Math.min(1,u/.15);
    ctx.translate(x,y);ctx.rotate(-.45+.25*u);ctx.drawImage(img,-width*(artMetrics[id]?.stemX||.5),-height,width,height);ctx.restore();
   }
  }
  if(images.curtain&&right>INN.x&&left<INN.x+INN.w){
   const open=ease(model.inn.progress),image=images.curtain,half=image.width/2;
   const leaf=INN.w/2*(1-open*.82);
   ctx.save();
   // Gather each cloth leaf towards its own jamb; the centre becomes a real gap.
   ctx.drawImage(image,0,0,half,image.height,INN.x,INN.y,leaf,INN.h);
   ctx.drawImage(image,half,0,half,image.height,INN.x+INN.w-leaf,INN.y,leaf,INN.h);
   if(!overview)label(ctx,INN.x+INN.w/2,INN.y-12,open>.8?'进店赏花 · 点帘边合上':'轻点开花帘');
   ctx.restore();
  }
 }
 function hit(x,y,padding=0){
  const handleY=CRANE.handleY+CRANE.pullDistance*model.warehouse.progress;
  if(Math.abs(x-CRANE.handleX)<10+padding&&y>handleY-18-padding&&y<handleY+20+padding)return'rope';
  if(x>=INN.x-padding&&x<=INN.x+INN.w+padding&&y>=INN.y-25-padding&&y<=INN.y+INN.h+padding){
   const leaf=INN.w/2*(1-ease(model.inn.progress)*.82);
   if(model.inn.progress<.7||x<INN.x+leaf+padding||x>INN.x+INN.w-leaf-padding)return'curtain';
   return'flower-shop';
  }
  return null;
 }
 function occludes(p){return p.hidden||((p.id==='bridge-33'||p.customer!==undefined)&&p.y<INN.y+INN.h&&model.inn.progress<.68);}
 function poseFor(p,idle,context={}){
  if(p.porter){
   const pose=model.porter();
   return{...idle,...pose,kind:pose.frame?'walk':'chat',scripted:true,hidden:!streetArt,stride:0,bend:0,reach:0,lift:0,nod:0};
  }
  if(p.flowerStreet)return flowerStreetPose(p,context.time??idle.streetTime??0);
  if(p.customer!==undefined){const pose=clipBehindFlowerCurtain(flowerCustomerPose(p,model.customers.time,model.customers.started),model.inn.progress);customerPoses.set(p.id,{person:p,pose});return pose;}
  if(p.id==='bridge-33')return clipBehindFlowerCurtain(flowerFloristPose(idle,matchMedia('(prefers-reduced-motion: reduce)').matches&&model.florist.started?23:model.florist.time,model.florist.started),model.inn.progress);
  return warehouseActorPose(p,idle,model.warehouse);
 }
 ready.then(invalidate,()=>{});
 function artFor(p){if(p.porter)return streetArt?.frames('men-2')?.[model.porter().frame];if(p.flowerStreet)return streetArt?.frame(p);if(p.customer!==undefined)return customerFrames[p.customer]?.[p.walkFrame||0];return p.id==='bridge-33'?(floristFrames[lastFloristFrame]||images.florist):null;}
 function drawPerson(ctx,p,elapsed,pose={}){
  if(p.porter){
   const img=streetArt?.frames('men-2')?.[pose.frame||0];if(!img)return false;
   if(['receiving','carrying'].includes(model.warehouse.phase)){
    // Local, unflipped coordinates: the sack hangs behind the head and shoulders.
    const c=model.cargo();sack(ctx,(c.x-pose.x)*(pose.flip?-1:1),c.y-pose.y);
   }
   const h=p.h*(1-(pose.squash||0));ctx.drawImage(img,-p.w/2,-h,p.w,h);return true;
  }
  if(p.flowerStreet)return streetArt?.draw(ctx,p,pose)||false;
  if(p.customer!==undefined&&customerFrames[p.customer]){
   const frames=customerFrames[p.customer];ctx.drawImage(frames[pose.walkFrame||0],-p.w/2,-p.h,p.w,p.h);
   if(pose.flower>=1){
    const id=p.customer===0?'peony':'plum',img=images[id],height=23,width=height*img.width/img.height;
    ctx.save();ctx.globalAlpha*=pose.flower;ctx.translate(p.w*.1,-p.h*.55);ctx.rotate(-.2);
    ctx.drawImage(img,-width*(artMetrics[id]?.stemX||.5),-height,width,height);ctx.restore();
   }
   return true;
  }
  if(p.id!=='bridge-33'||!images.wave)return false;
  if(!floristFrames.length){
   const sheet=images.wave,w=sheet.width/2,h=sheet.height/2;
   // The generated right-hand cells are offset by about 65 px. Register their
   // heads first; equal grid cells do not imply equal character anchors.
   const source=document.createElement('canvas');source.width=sheet.width;source.height=sheet.height;
   const sourceContext=source.getContext('2d',{willReadFrequently:true});sourceContext.drawImage(sheet,0,0);
   const pixels=sourceContext.getImageData(0,0,source.width,source.height).data;
   const anchors=Array.from({length:4},(_,i)=>{
    let weight=0,xsum=0;
    for(let y=0;y<h*.15;y++)for(let x=0;x<w;x++){
     const a=pixels[((Math.floor(i/2)*h+y)*source.width+(i%2)*w+x)*4+3];
     if(a>100){weight+=a;xsum+=x*a;}
    }
    return weight?xsum/weight:w/2;
   });
   for(let i=0;i<4;i++){
    const c=document.createElement('canvas');c.width=w;c.height=h;const t=c.getContext('2d');
    t.drawImage(sheet,0,0,w,h,0,0,w,h);
    // Only the anatomically drawn arm poses change. Head, torso, skirt and feet
    // retain the resting frame, with no rubber mesh or whole-figure sway.
    if(i){
     const x=Math.floor(w*.69),y=Math.floor(h*.18),rw=w-x,rh=Math.ceil(h*.46),offset=Math.round(anchors[0]-anchors[i]);
     t.save();t.beginPath();t.rect(x,y,rw,rh);t.clip();t.clearRect(x,y,rw,rh);
     t.drawImage(sheet,(i%2)*w,Math.floor(i/2)*h,w,h,offset,0,w,h);t.restore();
    }
    floristFrames.push(c);
   }
  }
  const waveTime=Number.isFinite(elapsed)?elapsed:pose.waveTime;
  lastFloristFrame=matchMedia('(prefers-reduced-motion: reduce)').matches||pose.kind==='walk'?0:floristWaveFrame(waveTime);
  ctx.drawImage(floristFrames[lastFloristFrame],-p.w/2,-p.h,p.w,p.h);return true;
 }
 function artURL(id){const image=images[id];if(!image)return assets[id];return artURLs[id]||=(image.toDataURL?image.toDataURL('image/webp',.94):assets[id]);}
 return{ready,backdrop,draw,layers,drawDoorway,hit,occludes,poseFor,artFor,artURL,artMetrics:id=>artMetrics[id]||{stemX:.5},drawPerson,get floristFrame(){return lastFloristFrame;}};
}
