(() => {
  'use strict';
  const W=2172,H=724,moon={x:1416,y:112,r:51.5};
  const sky=new Image();
  let patch,stage,moonArt,preparedArt;
  const smooth=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
  function surface(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  function glow(ctx,x,y,rx,ry,color,alpha){
    if(alpha<=0)return;
    ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);ctx.globalAlpha*=alpha;
    const g=ctx.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,color);g.addColorStop(.35,color+'99');g.addColorStop(1,color+'00');
    ctx.fillStyle=g;ctx.fillRect(-1,-1,2,2);ctx.restore();
  }
  async function prepare(art){
    if(preparedArt===art)return;
    if(!sky.getAttribute('src'))sky.src='assets/midautumn/festival-day-sky-v1-lossless.webp';
    await sky.decode();
    // Use only the edited sky, preserving every building and original painted detail.
    patch=surface(164,164);const p=patch.getContext('2d');
    p.drawImage(sky,moon.x-82,moon.y-82,164,164,0,0,164,164);
    p.globalCompositeOperation='destination-in';
    const feather=p.createRadialGradient(82,82,59,82,82,81);feather.addColorStop(0,'#fff');feather.addColorStop(1,'#fff0');p.fillStyle=feather;p.fillRect(0,0,164,164);
    moonArt=surface(106,106);const m=moonArt.getContext('2d');m.beginPath();m.arc(53,53,moon.r,0,Math.PI*2);m.clip();m.drawImage(art,moon.x-53,moon.y-53,106,106,0,0,106,106);
    stage=surface(560,320);const s=stage.getContext('2d');s.drawImage(art,1515,245,560,320,0,0,560,320);
    s.globalCompositeOperation='destination-in';s.translate(280,160);s.scale(280,165);
    const mask=s.createRadialGradient(0,0,.62,0,0,1);mask.addColorStop(0,'#fff');mask.addColorStop(1,'#fff0');s.fillStyle=mask;s.fillRect(-1,-1,2,2);
    preparedArt=art;
  }
  // Trace the actual apertures on the 2172 × 724 festival painting.
  // Keep the blinds, timber posts, balcony rail and shop counters unlit.
  const windows=[
    [113,299,63,44],[195,315,48,28],[307,298,36,45],
    [352,297,21,46],[386,317,46,26],[464,296,39,47],
    [120,439,49,47],[183,438,29,49],[265,439,21,47],
    [299,439,57,47],[409,438,37,48],[466,438,29,48],
    [858,439,52,31],[2129,446,23,41],[2159,446,13,41]
  ].map(([x,y,w,h])=>({x,y,w,h}));
  // Centers and sizes follow the painted lanterns, using the main street's
  // warm gold silk, bright candle core, caps and soft surrounding bloom.
  const lamps=[
    [80,290,1.7],[80,326,1.7],[280,304,1.8],[546,290,1.7],[546,326,1.7],
    [63,436,2],[239,438,2],[376,438,1.9],[534,437,2],
    [808,461,1.8],[841,423,1.9],[938,423,1.9],[1108,419,1.9],
    [1145,365,1.9],[1242,338,1.9],[1234,440,1.8],[1261,443,1.8],
    [1447,452,1.8],[1480,439,1.9],
    [1564,314,2.6],[1564,362,2.6],[2056,315,2.6],[2056,363,2.6]
  ].map(([x,centerY,size])=>({x,y:centerY-10*size,size,groundY:550}));
  function draw(ctx,level,time,reduced){
    if(patch)ctx.drawImage(patch,moon.x-82,moon.y-82);
    if(level<=0)return;
    ctx.save();
    // The same dusk wash as the street outside the gate, including its sky,
    // architecture and river balance. Foreground figures use it separately.
    window.QingmingNight.drawAtmosphere(ctx,level,[0,W]);
    const moonlight=smooth((level-.27)/.73);
    ctx.globalCompositeOperation='screen';glow(ctx,moon.x,moon.y,160,160,'#d5e3ff',moonlight*.2);glow(ctx,moon.x,moon.y,85,85,'#fff2c6',moonlight*.38);
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=moonlight;if(moonArt)ctx.drawImage(moonArt,moon.x-53,moon.y-53);ctx.globalAlpha=1;
    ctx.globalCompositeOperation='screen';
    for(let i=0;i<50;i++){const x=(i*197.31)%W,y=22+(i*47.7)%112;if(Math.hypot(x-moon.x,y-moon.y)<85)continue;ctx.globalAlpha=moonlight*(.3+.25*(reduced?1:Math.sin(time*.5+i)**2));ctx.fillStyle='#e9edff';ctx.fillRect(x,y,i%3?1:1.6,1);}
    ctx.globalAlpha=1;
    windows.forEach((opening,i)=>{
      const a=window.QingmingNight.lightAt(level,i);
      // The original painting already has detailed latticework.
      window.QingmingNight.drawWindow(ctx,opening,a,{mullions:false});
    });
    lamps.forEach((lamp,i)=>{
      const a=window.QingmingNight.lightAt(level,i+7);
      window.QingmingNight.drawLantern(ctx,lamp,a,time,reduced,i);
    });
    const stageLight=smooth((level-.12)/.7);
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=stageLight*.32;if(stage)ctx.drawImage(stage,1515,245);ctx.globalAlpha=1;
    ctx.globalCompositeOperation='screen';
    glow(ctx,1795,421,235,120,'#eac18b',stageLight*.09);
    // Small pools of candlelight, without modern overhead spotlight beams.
    for(const x of [1645,1795,1945]){
      glow(ctx,x,502,58,12,'#e7bd7b',stageLight*.09);
      glow(ctx,x,296,8,6,'#f4d39b',stageLight*.25);
    }
    // Ripples catch the moon and the warm stage.
    for(let j=0;j<25;j++){
      const y=594+j*5,w=18+j*2.3,x=moon.x+(reduced?0:Math.sin(time*.5+j*1.3)*8);
      ctx.fillStyle=`rgba(237,231,180,${moonlight*.17*(1-j/28)})`;ctx.fillRect(x-w/2,y,w,1.2);
      ctx.fillStyle=`rgba(255,188,91,${stageLight*.045*(1-j/28)})`;ctx.fillRect(1795-w,y,w*2,1);
    }
    ctx.restore();
  }
  window.FestivalLighting={prepare,draw,glow};
})();
