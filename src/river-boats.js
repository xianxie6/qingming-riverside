// Poled cargo boats for the extended scroll. The boat and boatman are the
// same paintings as the main scroll; the boatman is a light two-part rig
// (legs planted, torso hinged at the sash) so the page needs no crowd engine.
// The boatman is drawn smaller against the hull than on the main scroll, so
// the boat reads about four people long (a 6–7 m canal sampan).
const BOAT={width:172,height:52,left:-86,top:-43,deckY:-10,crewX:-62,crewHeight:42,surface:6};
// Fists on the featured sheet, normalised to the whole sheet.
const GRIPS=[[.906,.324],[.890,.451]];
const STROKE=4.4;

function loadImage(src){
  return new Promise((resolve,reject)=>{const image=new Image();image.decoding='async';image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(`Failed to load ${src}`));image.src=src;});
}
function boatSprite(image){
  const sprite=document.createElement('canvas');sprite.width=BOAT.width*3;sprite.height=BOAT.height*3;
  const c=sprite.getContext('2d');c.imageSmoothingQuality='high';c.drawImage(image,40,150,2100,425,0,0,sprite.width,sprite.height);
  return sprite;
}
// Paper is removed by a flood fill from the sheet edge, so the cream cuffs
// and highlights inside the figure stay opaque. `whiteness` sets how pale
// and grey a pixel must be to count as paper.
function matte(image,x0,cw,{lightest=206,grey=26,band=4}={}){
  const h=image.naturalHeight,size=cw*h;
  const canvas=document.createElement('canvas');canvas.width=cw;canvas.height=h;
  const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(image,x0,0,cw,h,0,0,cw,h);
  const pixels=c.getImageData(0,0,cw,h),d=pixels.data,seen=new Uint8Array(size),stack=[];
  const low=i=>Math.min(d[i*4],d[i*4+1],d[i*4+2]),chroma=i=>Math.max(d[i*4],d[i*4+1],d[i*4+2])-low(i);
  const paper=i=>low(i)>lightest&&chroma(i)<grey;
  for(let x=0;x<cw;x++)stack.push(x,(h-1)*cw+x);
  for(let y=0;y<h;y++)stack.push(y*cw,y*cw+cw-1);
  while(stack.length){
    const i=stack.pop();if(seen[i]||!paper(i))continue;seen[i]=1;
    const x=i%cw;if(x>0)stack.push(i-1);if(x<cw-1)stack.push(i+1);if(i>=cw)stack.push(i-cw);if(i<cw*(h-1))stack.push(i+cw);
  }
  // Pure paper enclosed by the figure (between a sash and the body) is
  // background too, although the edge fill cannot reach it.
  for(let i=0;i<size;i++)if(!seen[i]&&low(i)>247&&chroma(i)<6)seen[i]=1;
  // Distance from the paper, out to `band` pixels into the figure.
  const distance=new Uint8Array(size).fill(255);let queue=[];
  for(let i=0;i<size;i++)if(seen[i]){distance[i]=0;queue.push(i);}
  for(let step=1;step<=band&&queue.length;step++){
    const next=[];
    for(const i of queue){
      const x=i%cw;
      for(const j of [x>0?i-1:-1,x<cw-1?i+1:-1,i-cw,i+cw])if(j>=0&&j<size&&distance[j]===255){distance[j]=step;next.push(j);}
    }
    queue=next;
  }
  const ramp=(v,a,b)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
  let left=cw,top=h,right=0,bottom=0;
  for(let i=0;i<size;i++){
    if(seen[i]){d[i*4+3]=0;continue;}
    const x=i%cw,y=(i-x)/cw;
    if(distance[i]<=band){
      // Near the paper, a pale grey pixel is paint thinned by white paper:
      // c = a·F + (1-a)·255. Recover a from its whiteness, then F, so gauze
      // shows the water through it and edges carry no white halo.
      // Cream gauze (grey spread up to ~30) counts; rosy skin (40+) does not.
      const whiteness=ramp(low(i),200,250)*(1-ramp(chroma(i),22,42))*(1-ramp(distance[i],band*.6,band));
      const a=Math.max(.02,1-.94*whiteness);
      for(let k=0;k<3;k++)d[i*4+k]=Math.max(0,Math.min(255,(d[i*4+k]-255*(1-a))/a));
      d[i*4+3]=Math.round(255*a);
      if(a<.06)continue;
    }
    left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
  }
  c.putImageData(pixels,0,0);
  const texture=document.createElement('canvas');texture.width=right-left+1;texture.height=bottom-top+1;
  const t=texture.getContext('2d',{willReadFrequently:true});t.drawImage(canvas,left,top,texture.width,texture.height,0,0,texture.width,texture.height);
  // Same paper tone as the crowd, so the figure sits in the painting.
  t.globalCompositeOperation='multiply';t.fillStyle='#eee3cd';t.fillRect(0,0,texture.width,texture.height);
  t.globalCompositeOperation='destination-in';t.drawImage(canvas,left,top,texture.width,texture.height,0,0,texture.width,texture.height);
  return {texture,left,top};
}
function boatman(image){
  const w=image.naturalWidth,h=image.naturalHeight,x0=Math.floor(w/2);
  const {texture,left,top}=matte(image,x0,w-x0);
  const grips=GRIPS.map(([gx,gy])=>[(gx*w-x0-left)/texture.width,(gy*h-top)/texture.height]);
  return {texture,grips};
}
// Four key poses of the pipa singer. Each is aligned on her straw cushion:
// the alpha centre of the lowest rows, and the bottom edge.
function singerFrames(image){
  const cell=image.naturalWidth/4;
  return Array.from({length:4},(_,i)=>{
    const {texture}=matte(image,Math.round(i*cell),Math.round(cell),{lightest:244,grey:10,band:24});
    const w=texture.width,h=texture.height,band=Math.round(h*.1);
    const data=texture.getContext('2d').getImageData(0,h-band,w,band).data;
    let sum=0,weight=0;
    for(let k=0;k<w*band;k++){const a=data[k*4+3];if(a>128){sum+=(k%w)*a;weight+=a;}}
    return {texture,anchor:weight?sum/weight:w/2};
  });
}
// Pluck and begin, sing out, pluck, hold the high note, roll a tremolo with
// eyes closed, then smile and shift the hand: about seven seconds a phrase.
const SONG=[[0,.8],[1,1.2],[0,.7],[1,1.3],[2,1.7],[3,1.1]];
const SONG_LENGTH=SONG.reduce((sum,[,d])=>sum+d,0),BLEND=.32;
// Seated, with the pipa head above her bun: about two thirds of the
// boatman's standing height, so she reads clearly at the bow.
const SINGER={x:46,y:-9.2,height:35};
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
// One pole stroke: plant, lean into the pole, walk it back, then lift.
function strokeAt(time){
  const c=((time%STROKE)+STROKE)%STROKE/STROKE;
  const push=smooth(c/.12)*(1-smooth((c-.52)/.14));
  const lean=-.05+.22*smooth((c-.04)/.46)*(1-smooth((c-.6)/.34));
  const lift=smooth((c-.56)/.1)*(1-smooth((c-.9)/.1));
  return {c,push,lean,lift};
}

export function createRiverBoats({min,max,lanes}){
  const span=max-min+400;
  let sprite=null,ferry=null,crew=null,singer=null;
  const mix=document.createElement('canvas');
  const ready=Promise.all(['assets/boat.webp','assets/boat-passenger-clear.webp','assets/featured-characters-v7.webp','assets/boat-singer-v1.webp'].map(loadImage)).then(([boat,clear,sheet,song])=>{
    sprite=boatSprite(boat);ferry=boatSprite(clear);crew=boatman(sheet);singer=singerFrames(song);
  });
  ready.catch(error=>console.warn('River boats unavailable',error));
  const fleet=lanes.flatMap((lane,l)=>Array.from({length:lane.count},(_,i)=>({lane,phase:i/lane.count+l*.37,id:l*10+i,singer:lane.singer===i})));

  function position(boat,time){
    const {lane}=boat,glide=time*lane.speed;
    // The boat surges a little on each push and coasts between strokes.
    const surge=Math.sin((time+boat.id)*Math.PI*2/STROKE-1.1)*1.6;
    const along=(((boat.phase*span+glide+surge)%span)+span)%span;
    return {x:lane.direction>0?min-200+along:max+200-along,y:lane.y,scale:lane.scale,direction:lane.direction,time:time+boat.id*1.37,singer:boat.singer};
  }
  // She sits on the open foredeck, breathing with the phrase and the swell.
  function drawSinger(ctx,t){
    let at=((t%SONG_LENGTH)+SONG_LENGTH)%SONG_LENGTH,step=0;
    while(at>=SONG[step][1]){at-=SONG[step][1];step++;}
    const [frame,duration]=SONG[step],next=SONG[(step+1)%SONG.length][0];
    const blend=next===frame?0:smooth((at-(duration-BLEND))/BLEND);
    const s=SINGER.height/singer[0].texture.height,breath=Math.sin(t*1.7)*.01;
    ctx.save();ctx.translate(SINGER.x,SINGER.y);ctx.rotate(Math.sin(t*.61)*.012);ctx.scale(1,1+breath);
    const paint=(target,f,alpha,x,y)=>{const {texture,anchor}=singer[f];target.globalAlpha=alpha;target.drawImage(texture,x-anchor,y-texture.height);};
    if(blend<=.001){
      const {texture,anchor}=singer[frame];ctx.drawImage(texture,-anchor*s,-texture.height*s,texture.width*s,texture.height*s);
    }else{
      // A true crossfade: (1-b)·A + b·B added on a scratch layer, so parts of
      // the old pose fade out instead of vanishing when the step changes.
      const width=Math.max(...singer.map(f=>f.texture.width))*2,height=Math.max(...singer.map(f=>f.texture.height));
      if(mix.width!==width||mix.height!==height){mix.width=width;mix.height=height;}
      const m=mix.getContext('2d');m.globalCompositeOperation='source-over';m.clearRect(0,0,width,height);
      paint(m,frame,1-blend,width/2,height);m.globalCompositeOperation='lighter';paint(m,next,blend,width/2,height);
      ctx.drawImage(mix,-width/2*s,-height*s,width*s,height*s);
    }
    ctx.restore();ctx.globalAlpha=1;
  }
  function drawCrew(ctx,t){
    const {texture,grips}=crew,s=BOAT.crewHeight/texture.height,w=texture.width*s,h=BOAT.crewHeight;
    const pose=strokeAt(t),feetX=BOAT.crewX,feetY=BOAT.deckY;
    const left=feetX-w*.46,top=feetY-h,waist=top+h*.47,hip=[left+w*.36,waist];
    const bend=pose.push*.025;
    // Legs: planted, knees giving slightly under the push.
    ctx.save();ctx.beginPath();ctx.rect(left-6,waist-1,w+12,h);ctx.clip();
    ctx.translate(feetX,feetY);ctx.scale(1,1-bend);ctx.translate(-feetX,-feetY);
    ctx.drawImage(texture,left,top,w,h);ctx.restore();
    // Torso hinged at the sash, leaning into the pole.
    const turn=pose.lean,drop=bend*h*.53;
    ctx.save();ctx.beginPath();ctx.rect(left-30,top-30,w+60,waist-top+31+drop);ctx.clip();
    ctx.translate(hip[0],hip[1]+drop);ctx.rotate(turn);ctx.translate(-hip[0],-hip[1]);
    ctx.drawImage(texture,left,top,w,h);ctx.restore();
    const cos=Math.cos(turn),sin=Math.sin(turn);
    const hands=grips.map(([gx,gy])=>{const x=left+gx*w-hip[0],y=top+gy*h-hip[1];return {x:hip[0]+x*cos-y*sin,y:hip[1]+drop+x*sin+y*cos};});
    return {hands,pose};
  }
  function drawPole(ctx,hands,pose){
    const upper={x:(hands[0].x+hands[1].x)/2,y:Math.min(hands[0].y,hands[1].y)};
    // Planted behind him, the pole leans further back as the boat passes it;
    // lifted, it swings forward and rises through his hands.
    // The swing forward finishes exactly where the next plant starts, so the
    // pole never snaps at the end of a stroke.
    const forward=smooth((pose.c-.56)/.34);
    const angle=.34+.36*smooth(pose.c/.55)*(1-forward)-pose.lift*.18;
    const ux=-Math.sin(angle),uy=Math.cos(angle);
    const reach=(BOAT.surface+18-upper.y)/uy-pose.lift*24;
    const top={x:upper.x-ux*13,y:upper.y-uy*13},tip={x:upper.x+ux*reach,y:upper.y+uy*reach};
    const above=Math.min(1,Math.max(0,(BOAT.surface-top.y)/Math.max(1,tip.y-top.y)));
    const surface={x:top.x+(tip.x-top.x)*above,y:top.y+(tip.y-top.y)*above};
    ctx.lineCap='round';
    ctx.strokeStyle='#5f523a';ctx.lineWidth=1.05;ctx.beginPath();ctx.moveTo(top.x,top.y);ctx.lineTo(surface.x,surface.y);ctx.stroke();
    ctx.strokeStyle='#a28f66';ctx.lineWidth=.35;ctx.beginPath();ctx.moveTo(top.x-.3,top.y);ctx.lineTo(surface.x-.3,surface.y);ctx.stroke();
    if(tip.y>BOAT.surface){
      // The submerged length shows faintly, bent by refraction.
      ctx.globalAlpha=.22;ctx.strokeStyle='#4f5649';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(surface.x,surface.y);ctx.lineTo(surface.x+(tip.x-surface.x)*.7,surface.y+(tip.y-surface.y)*.55);ctx.stroke();ctx.globalAlpha=1;
    }
    // Grips sit on the shaft where each fist closes round it.
    for(const hand of hands){const k=(hand.x-top.x)*ux+(hand.y-top.y)*uy;ctx.beginPath();ctx.ellipse(top.x+ux*k,top.y+uy*k,.85,1.25,0,0,Math.PI*2);ctx.fillStyle='#b58f69';ctx.fill();}
    return {surface,planted:tip.y>BOAT.surface+1};
  }
  function poleWater(ctx,surface,pose,t){
    ctx.save();ctx.lineCap='round';
    // Rings spread from where the pole entered, while it is pushed through.
    const age=pose.c*STROKE;
    for(let r=0;r<3;r++){
      const a=age-r*.35;if(a<0||a>2.4)continue;const k=a/2.4;
      ctx.globalAlpha=(1-k)*.42;ctx.strokeStyle=r%2?'#59655a':'#ece6cf';ctx.lineWidth=.6;
      ctx.beginPath();ctx.ellipse(surface.x-a*3.5,BOAT.surface,3+a*10,.9+a*2,0,0,Math.PI*2);ctx.stroke();
    }
    if(pose.push>.2){
      ctx.globalAlpha=.35*pose.push;ctx.strokeStyle='#efe9d3';ctx.lineWidth=.7;
      ctx.beginPath();ctx.arc(surface.x,BOAT.surface-.6,2.2+pose.push*1.8,Math.PI*1.1,Math.PI*1.9);ctx.stroke();
    }
    // Drips fall from the lifted pole.
    if(pose.lift>.2){
      for(let i=0;i<3;i++){const p=(t*1.9+i/3)%1;ctx.globalAlpha=(1-p)*.6*pose.lift;ctx.fillStyle='#eae5d0';ctx.beginPath();ctx.ellipse(surface.x-1+i,surface.y-6+p*12,.4,.75,0,0,Math.PI*2);ctx.fill();}
    }
    ctx.restore();
  }
  function wake(ctx,t){
    ctx.save();ctx.lineCap='round';
    for(let i=0;i<5;i++){
      const sway=Math.sin(t*.55+i*1.8)*1.2,len=1+i*.22;
      ctx.beginPath();ctx.moveTo(-70,BOAT.surface+i*2.1);
      ctx.bezierCurveTo(-92,BOAT.surface+1+i*2.4+sway,-110*len,BOAT.surface+2+i*3,-150*len,BOAT.surface+2+i*3.6+sway);
      ctx.strokeStyle=i%2?'#e2dcc3':'#56624f';ctx.globalAlpha=(i%2?.22:.15)*(1-i*.14);ctx.lineWidth=.7+i*.1;ctx.stroke();
    }
    for(const side of [-1,1]){
      ctx.beginPath();ctx.moveTo(80,BOAT.surface-2+side);ctx.quadraticCurveTo(95,BOAT.surface+1+side*4,112,BOAT.surface+5+side*7.5);
      ctx.strokeStyle=side>0?'#e6e0c8':'#5c6655';ctx.globalAlpha=side>0?.26:.16;ctx.lineWidth=.8;ctx.stroke();
    }
    ctx.restore();
  }
  function reflection(ctx,t,sprite){
    // Scanline strips of the hull, shifted by the ripples beneath it.
    for(let i=0;i<9;i++){
      ctx.globalAlpha=.1-i*.009;
      const strip=sprite.height*.08,sy=sprite.height*.62-i*strip;
      ctx.drawImage(sprite,0,sy,sprite.width,strip,BOAT.left+Math.sin(t*.9+i*1.3)*1.4,BOAT.top+BOAT.height-1+i*2.1,BOAT.width,2.2);
    }
    ctx.globalAlpha=1;
  }
  function draw(ctx,time,left,right){
    if(!sprite||!crew)return;
    const boats=fleet.map(b=>position(b,time)).filter(b=>b.x>left-120&&b.x<right+120).sort((a,b)=>a.y-b.y);
    for(const b of boats){
      const t=b.time;
      ctx.save();ctx.translate(b.x,b.y+Math.sin(t*.7)*.5);ctx.scale(b.scale*b.direction,b.scale);
      ctx.rotate(Math.sin(t*.53)*.006);
      const hull=b.singer?ferry:sprite;
      wake(ctx,t);reflection(ctx,t,hull);
      ctx.globalAlpha=.94;ctx.drawImage(hull,BOAT.left,BOAT.top,BOAT.width,BOAT.height);ctx.globalAlpha=1;
      if(b.singer)drawSinger(ctx,t);
      const {hands,pose}=drawCrew(ctx,t);
      const pole=drawPole(ctx,hands,pose);
      // The near gunwale passes in front of his feet.
      ctx.save();ctx.globalAlpha=.94;ctx.beginPath();ctx.rect(BOAT.left,BOAT.deckY+.6,BOAT.width,20);ctx.clip();
      ctx.drawImage(hull,BOAT.left,BOAT.top,BOAT.width,BOAT.height);ctx.restore();
      poleWater(ctx,pole.surface,pose,t);
      ctx.restore();
    }
  }
  // Where the singing boat is, and her own clock, for the song's sound.
  function singerAt(time){
    const boat=fleet.find(b=>b.singer);
    return boat?position(boat,time):null;
  }
  return {ready,draw,singerAt};
}
export const SONG_STEPS=SONG;
