// The spring watermill's own painted wheel, turning in its perspective.
// All geometry is in source pixels of district-west-fast.webp (2172 × 724).
// The painted face is unwrapped once into a flat wheel texture; each frame
// thin wedges map it back onto the ellipse, rotated by the current angle.
const G={cx:559,cy:443,rx:51.5,ry:92.5,tilt:-4*Math.PI/180,hx:555,hy:439,depth:55};
const COS=Math.cos(G.tilt),SIN=Math.sin(G.tilt);
// The stone pier and axle beam hide 92°–215° of the face. That sector is
// borrowed from the clean face 151° earlier (best spoke match), with a 12°
// crossfade at both seams.
const HIDDEN=[92,215],FADE=12,BORROW=-151;
// About 4.2 rpm: an overshot wheel of this size under a small race.
const SPEED=.44,BUCKETS=24,WEDGES=120,TEX=120;
// Pier, axle bracket and beam stand in front of the rim.
const FOREGROUND=[[495,431.5],[546,431.5],[547,436],[549,446],[546,454],[557,453.5],[559,500],[560.5,538],[509,538],[509.5,454],[518,452],[517.5,439],[495,439]];
const CROP={x:488,y:330,w:200,h:232};

export function rimPoint(a,s=1){
  const ex=G.rx*Math.cos(a),ey=G.ry*Math.sin(a);
  const x=G.cx+ex*COS-ey*SIN,y=G.cy+ex*SIN+ey*COS;
  return [G.hx+(x-G.hx)*s,G.hy+(y-G.hy)*s];
}

function buildTexture(image){
  const crop=document.createElement('canvas');crop.width=CROP.w;crop.height=CROP.h;
  const cc=crop.getContext('2d',{willReadFrequently:true});
  cc.drawImage(image,CROP.x,CROP.y,CROP.w,CROP.h,0,0,CROP.w,CROP.h);
  const src=cc.getImageData(0,0,CROP.w,CROP.h).data;
  const sample=(x,y,out,w)=>{
    x-=CROP.x+.5;y-=CROP.y+.5;
    const x0=Math.max(0,Math.min(CROP.w-2,Math.floor(x))),y0=Math.max(0,Math.min(CROP.h-2,Math.floor(y)));
    const fx=Math.max(0,Math.min(1,x-x0)),fy=Math.max(0,Math.min(1,y-y0));
    const i=(y0*CROP.w+x0)*4,j=i+CROP.w*4;
    for(let c=0;c<3;c++){
      const top=src[i+c]*(1-fx)+src[i+4+c]*fx,bottom=src[j+c]*(1-fx)+src[j+4+c]*fx;
      out[c]+=(top*(1-fy)+bottom*fy)*w;
    }
  };
  const size=TEX*2+2,tex=document.createElement('canvas');tex.width=tex.height=size;
  const tc=tex.getContext('2d'),pixels=tc.createImageData(size,size),data=pixels.data,rgb=[0,0,0];
  for(let v=0;v<size;v++)for(let u=0;u<size;u++){
    const dx=u+.5-size/2,dy=v+.5-size/2,s=Math.hypot(dx,dy)/TEX;
    if(s>1.03)continue;
    const deg=Math.atan2(dy,dx)*180/Math.PI,d=(deg+360)%360;
    const borrow=d<HIDDEN[0]-FADE||d>HIDDEN[1]+FADE?0:d<HIDDEN[0]?(d-HIDDEN[0]+FADE)/FADE:d<=HIDDEN[1]?1:(HIDDEN[1]+FADE-d)/FADE;
    rgb[0]=rgb[1]=rgb[2]=0;
    if(borrow<1)sample(...rimPoint(deg*Math.PI/180,s),rgb,1-borrow);
    if(borrow>0)sample(...rimPoint((deg+BORROW)*Math.PI/180,s),rgb,borrow);
    const k=(v*size+u)*4;
    data[k]=rgb[0];data[k+1]=rgb[1];data[k+2]=rgb[2];
    data[k+3]=s<=1?255:255*(1.03-s)/.03;
  }
  tc.putImageData(pixels,0,0);
  return tex;
}

// Affine map taking three texture points onto three canvas points.
function mapTriangle(ctx,s,d){
  const [[x0,y0],[x1,y1],[x2,y2]]=s,[[u0,v0],[u1,v1],[u2,v2]]=d;
  const det=(x1-x0)*(y2-y0)-(x2-x0)*(y1-y0);
  const a=((u1-u0)*(y2-y0)-(u2-u0)*(y1-y0))/det,c=((u2-u0)*(x1-x0)-(u1-u0)*(x2-x0))/det;
  const b=((v1-v0)*(y2-y0)-(v2-v0)*(y1-y0))/det,dd=((v2-v0)*(x1-x0)-(v1-v0)*(x2-x0))/det;
  ctx.transform(a,b,c,dd,u0-a*x0-c*y0,v0-b*x0-dd*y0);
}

export class MillWheel{
  constructor(){this.image=null;this.texture=null;}
  // Only the spring painting shares this geometry; seasonal mills differ.
  use(image){
    if(image===this.image)return Boolean(this.texture);
    this.image=image;this.texture=null;
    if(/district-west(-fast)?\.webp/.test(image?.src??'')&&image.naturalWidth===2172&&image.naturalHeight===724){
      try{this.texture=buildTexture(image);}catch(error){console.warn('Mill wheel texture unavailable',error);}
    }
    return Boolean(this.texture);
  }
  // `ctx` must already map source pixels of the west painting.
  visible(min,max){return max>G.cx-G.rx-4&&min<G.cx+G.rx+G.depth+4;}
  draw(ctx,time){
    if(!this.texture)return;
    const turn=time*SPEED;
    ctx.save();
    this.drawBuckets(ctx,turn);
    this.drawFace(ctx,turn);
    ctx.beginPath();FOREGROUND.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();
    ctx.drawImage(this.image,CROP.x,CROP.y,CROP.w,CROP.h,CROP.x,CROP.y,CROP.w,CROP.h);
    ctx.restore();
  }
  drawFace(ctx,turn){
    const tex=this.texture,half=tex.width/2,step=Math.PI*2/WEDGES,pad=.004,reach=1.03;
    const hub=[G.hx,G.hy],center=[half,half];
    for(let i=0;i<WEDGES;i++){
      const a1=i*step-pad,a2=(i+1)*step+pad;
      const d1=rimPoint(a1,reach),d2=rimPoint(a2,reach);
      const s1=[half+Math.cos(a1-turn)*TEX*reach,half+Math.sin(a1-turn)*TEX*reach];
      const s2=[half+Math.cos(a2-turn)*TEX*reach,half+Math.sin(a2-turn)*TEX*reach];
      ctx.save();
      ctx.beginPath();ctx.moveTo(...hub);ctx.lineTo(...d1);ctx.lineTo(...d2);ctx.closePath();ctx.clip();
      mapTriangle(ctx,[center,s1,s2],[hub,d1,d2]);
      ctx.drawImage(tex,0,0);
      ctx.restore();
    }
  }
  // The wheel's breadth: buckets running from the front rim to the rear rim,
  // seen past the right edge of the face and travelling down with the water.
  drawBuckets(ctx,turn){
    const D=G.depth,ring=(s,inset=1)=>{
      ctx.beginPath();
      for(let i=0;i<=72;i++){const [x,y]=rimPoint(i/72*Math.PI*2,s);const px=G.hx+(x-G.hx)*inset+D,py=G.hy+(y-G.hy)*inset;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}
      ctx.closePath();
    };
    ctx.save();
    // Leave the painted race lip above and the stone footing below untouched.
    ring(1,.965);ctx.clip();ctx.beginPath();ctx.moveTo(G.cx-G.rx,361);ctx.lineTo(G.cx+G.rx+D+8,361);ctx.lineTo(G.cx+G.rx+D+8,500);ctx.lineTo(G.cx+12,516);ctx.lineTo(G.cx-G.rx,516);ctx.closePath();ctx.clip();
    const shade=ctx.createLinearGradient(G.cx,G.cy-G.ry,G.cx+D+G.rx,G.cy+G.ry);
    shade.addColorStop(0,'#564d3c');shade.addColorStop(.5,'#433d30');shade.addColorStop(1,'#38342a');
    ctx.fillStyle=shade;ctx.fillRect(G.cx-G.rx,G.cy-G.ry-4,G.rx*2+D+4,G.ry*2+8);
    // The painted buckets, smeared along their path: wet timber in motion
    // rather than a flat cavity.
    const bx=G.cx,bw=G.rx+D+6;
    for(let i=-7;i<=7;i++){
      ctx.globalAlpha=.11;
      ctx.drawImage(this.image,bx,CROP.y,bw,CROP.h,bx,CROP.y+i*2.6+((turn*40)%2.6),bw,CROP.h);
    }
    ctx.globalAlpha=1;ctx.fillStyle='rgba(38,34,26,.38)';ctx.fillRect(bx,G.cy-G.ry-4,bw,G.ry*2+8);
    // Faint far spokes keep the cavity from reading as a flat hole.
    ctx.strokeStyle='#6f6449';ctx.lineWidth=1.1;ctx.globalAlpha=.3;
    for(let k=0;k<13;k++){
      const a=turn+k*Math.PI*2/13,[x,y]=rimPoint(a,.9);
      ctx.beginPath();ctx.moveTo(G.hx+D,G.hy);ctx.lineTo(x+D,y);ctx.stroke();
    }
    ctx.globalAlpha=1;ctx.lineJoin='round';
    const lip=.05,boards=[];
    for(let k=0;k<BUCKETS;k++){
      const a=((turn+k*Math.PI*2/BUCKETS)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
      if(Math.cos(a)<-.35)continue;
      boards.push(a);
    }
    boards.sort((p,q)=>Math.sin(p)-Math.sin(q));
    for(const a of boards){
      const f1=rimPoint(a,.83),f2=rimPoint(a,1),f3=rimPoint(a+lip,1),f4=rimPoint(a+lip,.93);
      const back=p=>[p[0]+D,p[1]];
      const light=.5+.5*Math.max(0,-Math.sin(a)); // upper boards catch the sky
      // Floor of the bucket along the rim.
      ctx.beginPath();[f2,f3,back(f3),back(f2)].forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();
      ctx.fillStyle=`rgb(${84+light*30|0},${72+light*26|0},${52+light*18|0})`;ctx.fill();
      ctx.strokeStyle='#35302499';ctx.lineWidth=.45;ctx.stroke();
      // Radial board, a light plank edge-on near the axle line.
      ctx.beginPath();[f1,f2,back(f2),back(f1)].forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();
      ctx.fillStyle=`rgb(${118+light*34|0},${102+light*29|0},${74+light*20|0})`;ctx.fill();ctx.stroke();
      // Ink along the front and rear ends, as drawn in the painting.
      ctx.strokeStyle='#2c2820';ctx.lineWidth=.55;
      ctx.beginPath();ctx.moveTo(...f1);ctx.lineTo(...f2);ctx.lineTo(...f3);ctx.moveTo(...back(f1));ctx.lineTo(...back(f2));ctx.stroke();
      ctx.strokeStyle='#35302499';ctx.lineWidth=.45;
      // Short side wall closes the bucket at its outer end.
      ctx.beginPath();[f3,f4,back(f4),back(f3)].forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();
      ctx.fillStyle='#6f6145';ctx.fill();ctx.stroke();
      // Water held in the descending buckets on the falling side.
      if(Math.cos(a)>.15&&Math.sin(a)>-.85&&Math.sin(a)<.55){
        ctx.beginPath();[rimPoint(a+lip*.15,.9),rimPoint(a+lip*.9,.96),back(rimPoint(a+lip*.9,.96)),back(rimPoint(a+lip*.15,.9))].forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();
        ctx.fillStyle='rgba(206,212,196,.42)';ctx.fill();
      }
    }
    // Rear rim line hides the edge of the repainted cavity.
    ring(1,.965);ctx.strokeStyle='rgba(58,50,38,.7)';ctx.lineWidth=1.6;ctx.stroke();
    ctx.restore();
  }
}
export const millGeometry=G;
