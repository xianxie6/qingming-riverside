import {jointOffset} from './extension-motion.js?v=limited-16';

// Reuse small painted mesh frames; only visible actors ask for a frame.
// This avoids deforming hundreds of full-resolution atlases on every redraw.
export function createPuppetFrames(){
 const frames=new Map();let bytes=0;
 const limit=96*1024*1024,margin=12;
 const keys=['bend','reach','lift','nod','breath','gait','gaitWeight','dir'];
 function frame(p,image,pose){
  const skin={...pose};// Gestures are now small, so they need finer steps to stay smooth.
  for(const k of ['bend','reach','lift','nod'])skin[k]=Math.round((skin[k]||0)*40)/40;
  skin.breath=Math.round((skin.breath||0)*4)/4;
  skin.gaitWeight=Math.round((skin.gaitWeight||0)*4)/4;skin.gait=skin.gaitWeight?skin.gait||0:0;skin.dir=skin.dir||1;
  const key=p.id+':'+skin.kind+':'+(skin.style||'')+':'+keys.map(k=>skin[k]).join(',');
  if(frames.has(key)){const found=frames.get(key);frames.delete(key);frames.set(key,found);return found;}
  // Walk cycles need finer leg cells, and many more cached frames, than gestures.
  const walking=skin.gaitWeight>0,resolution=walking?2.5:3;
  const canvas=document.createElement('canvas');canvas.width=Math.ceil((p.w+margin*2)*resolution);canvas.height=Math.ceil((p.h+margin*2)*resolution);
  const ctx=canvas.getContext('2d');ctx.scale(resolution,resolution);ctx.translate(margin,margin);
  const nx=(p.members>1?2:1)*(walking?10:6),ny=walking?14:10,points=[];
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
   const u=i/nx,v=j/ny,d=jointOffset(p,skin,u===1?.99999:u,v);
   points.push({sx:u*image.width,sy:v*image.height,x:u*p.w+d.x,y:v*p.h+d.y});
  }
  function triangle(a,b,c){
   const det=(b.sx-a.sx)*(c.sy-a.sy)-(c.sx-a.sx)*(b.sy-a.sy);
   const ax=((b.x-a.x)*(c.sy-a.sy)-(c.x-a.x)*(b.sy-a.sy))/det;
   const ay=((b.y-a.y)*(c.sy-a.sy)-(c.y-a.y)*(b.sy-a.sy))/det;
   const bx=((c.x-a.x)*(b.sx-a.sx)-(b.x-a.x)*(c.sx-a.sx))/det;
   const by=((c.y-a.y)*(b.sx-a.sx)-(b.y-a.y)*(c.sx-a.sx))/det;
   ctx.save();ctx.beginPath();
   const cx=(a.x+b.x+c.x)/3,cy=(a.y+b.y+c.y)/3;
   for(const [i,q] of [a,b,c].entries()){
    const dx=q.x-cx,dy=q.y-cy,len=Math.hypot(dx,dy),x=q.x+dx/len*.12,y=q.y+dy/len*.12;
    if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);
   }
   ctx.closePath();ctx.clip();ctx.transform(ax,ay,bx,by,a.x-ax*a.sx-bx*a.sy,a.y-ay*a.sx-by*a.sy);
   ctx.drawImage(image,0,0);ctx.restore();
  }
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
   const a=points[j*(nx+1)+i],b=points[j*(nx+1)+i+1],c=points[(j+1)*(nx+1)+i],d=points[(j+1)*(nx+1)+i+1];
   triangle(a,b,c);triangle(b,d,c);
  }
  const result={canvas,margin,w:canvas.width/resolution,h:canvas.height/resolution,bytes:canvas.width*canvas.height*4};
  frames.set(key,result);bytes+=result.bytes;
  while(bytes>limit&&frames.size>1){const id=frames.keys().next().value;bytes-=frames.get(id).bytes;frames.delete(id);}
  return result;
 }
 return {frame,get bytes(){return bytes;}};
}
