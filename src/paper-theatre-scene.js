// A paper theatre made from the existing scroll: distant ink, cut scenery, figures.
const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const image=src=>new Promise((resolve,reject)=>{
  const img=new Image();const timer=setTimeout(()=>reject(Error('画片载入超时')),20000);
  img.onload=()=>{clearTimeout(timer);resolve(img);};
  img.onerror=()=>{clearTimeout(timer);reject(Error('画片未能载入'));};img.src=src;
});
let artwork;
export function loadPaperArt(){
  return artwork??=Promise.all([
    image('assets/district-west-fast.webp'),image('assets/paper-theatre/characters-styled-v1.png'),
    image('assets/street-empty.webp'),image('assets/district-east-fast.webp'),
    image('assets/boat.webp'),image('assets/paper-theatre/boatman-styled-v1.png'),
    import('./bridge-railing.js'),import('./world.js')
  ]).then(([west,people,street,east,boat,featured])=>{
    // Each garment design has its own bounds; generous source margins are trimmed
    // by alpha, preserving every hand, basket and hairpin in the new artwork.
    const frames=[[10,50,248,486],[262,49,240,489],[510,66,229,472],[738,80,344,459],[1083,65,239,474],[1323,60,201,480],
      [14,623,269,365],[285,635,260,348],[543,627,264,363],[781,538,251,452],[1090,654,194,337],[1319,589,204,402]];
    const figures=frames.map(frame=>paperEdge(cropAlpha(people,frame)));
    const crew=cropAlpha(featured,[0,0,featured.naturalWidth,featured.naturalHeight]);
    const hull=document.createElement('canvas');hull.width=1050;hull.height=213;hull.getContext('2d').drawImage(boat,40,150,2100,425,0,0,1050,213);
    // These are actual objects in each source painting, returned to the same coordinates.
    const table=[[616,439],[646,438],[658,443],[657,449],[651,449],[652,472],[648,472],[645,450],[627,450],[624,473],[620,473],[622,448],[616,447]];
    const table2=table.map(([x,y])=>[x+151,y]);
    const teaAwning=[[489,349],[521,356],[655,355],[837,347],[836,360],[790,369],[558,367],[496,362]];
    const sacks=[[1634,402],[1652,399],[1670,400],[1676,408],[1693,406],[1700,414],[1696,427],[1705,433],[1703,459],[1640,461],[1635,443],[1629,429]];
    const millProps=[[[741,431],[766,429],[776,436],[775,454],[769,463],[746,462],[738,451]],[[895,440],[934,440],[944,448],[940,452],[936,452],[937,470],[932,470],[930,452],[906,452],[904,470],[899,470],[901,451],[895,450]]];
    const layers=[separate(west,millProps),separate(street,[table,table2,teaAwning]),separate(street,window.BridgeRailing.silhouettes),separate(east,[sacks])];
    return {west,street,east,figures,crew:paperEdge(crew),hull,layers};
  }).catch(error=>{artwork=null;throw error;});
}
function separate(source,rings){
  const back=document.createElement('canvas'),front=document.createElement('canvas');
  back.width=front.width=2172;back.height=front.height=724;
  const path=new Path2D();for(const ring of rings){ring.forEach(([x,y],i)=>i?path.lineTo(x,y):path.moveTo(x,y));path.closePath();}
  const b=back.getContext('2d');b.drawImage(source,0,0,2172,724);b.globalCompositeOperation='destination-out';b.fill(path);
  const f=front.getContext('2d');f.clip(path);f.drawImage(source,0,0,2172,724);
  return {back,front};
}
function cropAlpha(source,[x,y,w,h]){
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(source,x,y,w,h,0,0,w,h);
  const {data}=c.getImageData(0,0,w,h);let left=w,right=0,top=h,bottom=0;
  for(let py=0;py<h;py++)for(let px=0;px<w;px++)if(data[(py*w+px)*4+3]>50){left=Math.min(left,px);right=Math.max(right,px);top=Math.min(top,py);bottom=Math.max(bottom,py);}
  if(right<left)return canvas;
  const trimmed=document.createElement('canvas');trimmed.width=right-left+9;trimmed.height=bottom-top+9;
  trimmed.getContext('2d').drawImage(canvas,left,top,right-left+1,bottom-top+1,4,4,right-left+1,bottom-top+1);return trimmed;
}
function paperEdge(source){
  const edge=document.createElement('canvas');edge.width=source.width;edge.height=source.height;
  const c=edge.getContext('2d');
  for(let i=0;i<8;i++){const a=i*Math.PI/4;c.drawImage(source,Math.cos(a)*.8,Math.sin(a)*.8);}
  c.globalCompositeOperation='source-in';c.fillStyle='#e8d8b6';c.fillRect(0,0,edge.width,edge.height);
  c.globalCompositeOperation='source-over';c.drawImage(source,0,0);return edge;
}

// Camera stops use painting coordinates; each figure is attached to a real floor,
// seat, bridge deck or boat. Moving the camera never separates those attachments.
const views=[
  {chapter:0,x:685,y:426,span:335},{chapter:0,x:875,y:421,span:310},{chapter:0,x:1460,y:417,span:330},
  {chapter:1,x:661,y:423,span:260},{chapter:1,x:710,y:423,span:250},{chapter:1,x:800,y:423,span:260},
  {chapter:2,x:1465,y:442,span:420},{chapter:2,x:1530,y:470,span:360},{chapter:2,x:1640,y:455,span:420},
  {chapter:3,x:1220,y:385,span:440},{chapter:3,x:1515,y:416,span:370},{chapter:3,x:1760,y:429,span:310}
];
export function createPaperScene(canvas,art,onFrame){
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('浏览器暂不支持画布');
  let width=1,height=1,frame=0,last=0,time=0,progress=0,target=0,playing=false,disposed=false;
  let pointer={x:0,y:0},look={x:0,y:0},spread=0,spreadTarget=0,actionChapter=-1,actionStart=-20;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let matrix=null,hits=[];
  function resize(){
    const box=canvas.getBoundingClientRect();width=Math.max(1,box.width);height=Math.max(1,box.height);
    const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  function hit(x,y,w,h,chapter){
    hits.push({x:matrix.x+x*matrix.s,y:matrix.y+y*matrix.s,w:w*matrix.s,h:h*matrix.s,chapter});
  }
  function figure(sprite,x,y,h,chapter,flip=false,lean=0){
    const texture=typeof sprite==='number'?art.figures[sprite]:sprite,w=h*texture.width/texture.height;
    ctx.save();ctx.translate(x,y);ctx.rotate(lean);ctx.scale(flip?-1:1,1);
    ctx.shadowColor='#493b2840';ctx.shadowBlur=3;ctx.shadowOffsetX=1.8;ctx.shadowOffsetY=1;
    ctx.drawImage(texture,-w/2,-h,w,h);ctx.restore();hit(x-w/2,y-h,w,h,chapter);
  }
  function line(points,color='#67573e',size=.7){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=size;ctx.stroke();}
  function steam(x,y){
    ctx.save();ctx.lineCap='round';
    for(let i=0;i<3;i++){const p=(time*.32+i/3)%1;ctx.globalAlpha=(1-p)*.5;ctx.beginPath();ctx.moveTo(x+i*2,y-p*13);ctx.quadraticCurveTo(x-3+i*2,y-5-p*13,x+2+i*2,y-10-p*13);ctx.strokeStyle='#fff6db';ctx.lineWidth=.8;ctx.stroke();}
    ctx.restore();
  }
  function mill(active){
    // The wheel remains on the mill axle, with its lower rim in the mill race.
    ctx.save();ctx.translate(570,445);ctx.scale(48,88);ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.clip();ctx.rotate(time*.19+active*.65);ctx.drawImage(art.west,522,357,96,176,-1,-1,2,2);ctx.restore();
    for(let i=0;i<9;i++){const p=(time*.4+i/9)%1;line([[640+Math.sin(i)*7,380+p*160],[641+Math.sin(i)*7,395+p*160]],'#e8e0c580',.9);}
    figure(11,688,476,66,0,false,Math.sin(time*1.3)*.025);
    const step=active>0?Math.sin(Math.min(active/6,1)*Math.PI)*35:Math.sin(time*.2)*8;
    figure(3,797+step,478,73,0,false,Math.sin(time*2)*.009);
    figure(11,924,477,68,0,true,Math.sin(time)*.024);figure(9,852,477,65,0);
    figure(4,1408,477,66,0,true);figure(2,1540,477,65,0);figure(3,1490+Math.sin(time*.23)*13,480,68,0);
    hit(522,357,96,176,0);hit(1390,414,160,65,0);
  }
  function tea(active){
    // Robes rest on the painted stools; the original tabletop is composited last.
    for(const x of [621,656,776,805]){
      ctx.fillStyle='#ad936a';ctx.fillRect(x-10,460,20,3);
      line([[x-8,463],[x-9,478]],'#66573f',1.3);line([[x+8,463],[x+9,478]],'#66573f',1.3);
    }
    figure(6,621,463,48,1);figure(7,656,463,48,1,true,Math.sin(time*.75)*.01);
    figure(8,776,464,48,1);figure(6,805,463,48,1,true);
    const lean=active>0?-.025-.025*Math.sin(active*2):-.008;
    figure(5,596,477,65,1,false,lean);figure(4,718,477,65,1,true);
    figure(2,859,478,65,1,false,Math.sin(time*.7)*.006);
    steam(631,440);steam(788,439);
    // Tea leaves the teapot spout and lands in the cup beside the same table.
    if(active>0){line([[586,448],[584,452],[589,454]],'#9b78519c',.7);steam(589,452);}
    hit(610,433,57,42,1);hit(764,433,57,42,1);
  }
  function boat(active){
    const drift=active>0?Math.sin(Math.min(active/7,1)*Math.PI)*55:Math.sin(time*.24)*12;
    const x=1515+drift,y=568+Math.sin(time*.8)*1.2,w=330,h=67;
    ctx.save();
    // This foreground boat is in front of the quay; its crew must remain above
    // the gunwale, rather than being clipped away by the distant shore.
    for(let i=0;i<5;i++)line([[x-w*.52-i*3,y+i*2],[x+w*.48+i*3,y+i*2]],'#7c806650',.7);
    ctx.drawImage(art.hull,x-w/2,y-h,w,h);
    const footX=x-w*.36,footY=y-19;
    figure(art.crew,footX,footY,86,2,false,Math.sin(time*.7)*.008);
    const crewW=86*art.crew.width/art.crew.height,upper={x:footX+crewW*.465,y:footY-86*.695},lower={x:footX+crewW*.426,y:footY-86*.543};
    const poleX=py=>upper.x+(py-upper.y)*(lower.x-upper.x)/(lower.y-upper.y);
    line([[poleX(upper.y-8),upper.y-8],[poleX(y+8),y+8]],'#60523d',1.4);
    // The gunwale is in front of the crew's feet, and shares the hull motion.
    ctx.drawImage(art.hull,0,art.hull.height*.77,art.hull.width,art.hull.height*.23,x-w/2,y-h*.23,w,h*.23);ctx.restore();
    hit(x-w/2,y-h-45,w,h+45,2);
  }
  function bridge(active){
    for(const [x,s,h] of [[1380,9,58],[1470,2,58],[1510,10,42],[1573,9,58],[1650,0,59]]){
      const dx=s===10?Math.sin(time*.5)*3:0;figure(s,x+dx,window.ScrollWorld.streetY(x+dx),h,2,x>1500,Math.sin(time*.65+x)*.008);
    }
    boat(active);hit(1420,360,215,80,2);
  }
  function gate(active){
    const arrive=active>0?Math.sin(Math.min(active/7,1)*Math.PI):0;
    // The visitor recedes into the gate instead of sliding across the wall.
    figure(2,1218+arrive*4,467-arrive*30,65-arrive*12,3,true);
    figure(9,1146,479,68,3);figure(3,1305+Math.sin(time*.2)*10,479,71,3,true);
    figure(11,1718,475,65,3,false,active>0?Math.sin(active*1.6)*.05:.02);
    figure(11,1789,477,65,3,true,Math.sin(time)*.025);
    figure(4,1710,479,66,3,true);figure(3,1915+Math.sin(time*.2)*15,480,69,3);
    hit(1629,399,85,75,3);hit(1155,320,135,160,3);
  }
  function renderSet(view,alpha){
    const chapter=view.chapter,portrait=width<height*1.1;
    const scale=Math.max(height/(portrait?view.span*1.14:view.span),width/2100);
    // A source-space camera, shared by walls, people, props and their occluders.
    const center=clamp(view.x,width/(2*scale),2172-width/(2*scale));
    const x=width*.5-center*scale+look.x*5,y=height*.52-view.y*scale+look.y*3;
    matrix={x,y,s:scale};ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.scale(scale,scale);
    ctx.fillStyle='#e2d4b6';ctx.fillRect(-200,0,2572,900);
    ctx.drawImage(art.layers[chapter].back,0,-spread*4);
    const elapsed=time-actionStart,active=chapter===actionChapter&&elapsed<8?Math.max(0,elapsed):0;
    if(chapter===0)mill(active);else if(chapter===1)tea(active);else if(chapter===2)bridge(active);else gate(active);
    ctx.save();ctx.shadowColor='#51412b35';ctx.shadowBlur=spread*5;ctx.shadowOffsetY=spread*3;
    ctx.drawImage(art.layers[chapter].front,look.x*.5*spread,spread*7);ctx.restore();ctx.restore();
  }
  function draw(){
    ctx.clearRect(0,0,width,height);ctx.fillStyle='#e2d4b6';ctx.fillRect(0,0,width,height);hits=[];
    const position=progress*11,a=Math.floor(position),b=Math.min(11,a+1),t=position-a,from=views[a],to=views[b];
    if(from.chapter===to.chapter){renderSet({chapter:from.chapter,x:from.x+(to.x-from.x)*t,y:from.y+(to.y-from.y)*t,span:from.span+(to.span-from.span)*t},1);}
    else {renderSet(from,1);const before=hits;hits=[];renderSet(to,t);if(t<.5)hits=before;}
    const shade=ctx.createLinearGradient(0,0,0,height);shade.addColorStop(0,'#5c4b301e');shade.addColorStop(.25,'#5c4b3000');shade.addColorStop(.85,'#5c4b3000');shade.addColorStop(1,'#5c4b301c');ctx.fillStyle=shade;ctx.fillRect(0,0,width,height);
    onFrame({progress,playing,hits});
  }
  function tick(now){
    if(disposed)return;const dt=Math.min((now-(last||now))/1000,.05);last=now;
    if(!document.hidden){
      if(!reduced.matches)time+=dt;
      if(playing){target=clamp(target+dt/90);if(target>=1)playing=false;}
      const ease=reduced.matches?1:1-Math.exp(-dt*6);progress+=(target-progress)*ease;
      look.x+=(pointer.x-look.x)*ease;look.y+=(pointer.y-look.y)*ease;spread+=(spreadTarget-spread)*ease;draw();
    }
    frame=requestAnimationFrame(tick);
  }
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();frame=requestAnimationFrame(tick);
  return {
    seek(p){target=clamp(p);if(reduced.matches){progress=target;draw();}},get progress(){return target;},
    play(value){playing=value;if(value&&target>=.999){target=0;progress=0;}},
    interact(chapter){actionChapter=chapter;actionStart=time-.01;},
    look(x,y){pointer=reduced.matches?{x:0,y:0}:{x:clamp(x,-1,1),y:clamp(y,-1,1)};},
    spread(value){spreadTarget=value?1:0;},
    dispose(){disposed=true;cancelAnimationFrame(frame);observer.disconnect();canvas.width=1;canvas.height=1;}
  };
}
