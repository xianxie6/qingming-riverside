((root,factory)=>{
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.QingmingNight=api;
})(typeof window!=='undefined'?window:globalThis,()=>{
  'use strict';
  const clamp=n=>Math.max(0,Math.min(1,n));
  const smooth=n=>{const t=clamp(n);return t*t*(3-2*t);};
  class Nightfall{
    constructor(){this.progress=0;this.target=0;}
    toggle(){this.target=1-this.target;return Boolean(this.target);}
    step(dt,reduced=false){
      const direction=Math.sign(this.target-this.progress);
      this.progress=clamp(this.progress+direction*Math.min(Math.abs(this.target-this.progress),Math.max(0,dt)/(reduced?.35:12)));
      return smooth(this.progress);
    }
  }
  // Door and window openings traced on each painting (coordinates on a
  // 2048-wide preview), then mapped through the same district transforms.
  const openings={
    center:[[84,351,28,41],[168,330,45,35],[241,357,48,46],[301,358,42,29],[370,362,38,37],
      [504,242,23,35],[541,239,61,38],[610,239,62,38],[715,242,52,35],[784,232,35,43],
      [513,354,40,25],[570,350,63,59],[715,354,42,58],[774,352,32,62],[858,364,52,31],
      [1107,348,40,36],[1158,349,24,31],[1192,347,34,35],[1143,253,17,12],
      [1396,345,17,14],[1520,348,16,20],[1750,356,82,41],[1782,272,23,17],
      [1920,363,34,39],[1960,360,32,44],[2000,365,35,37],[1960,290,61,20]],
    west:[[344,316,17,51],[445,318,43,26],[616,325,16,39],[667,360,28,44],
      [773,314,22,29],[883,337,62,19],[1001,344,60,19],[1110,337,25,42],[1140,337,24,42],
      [1171,337,26,42],[1256,340,33,38],[1419,352,43,34],[1472,352,36,29],
      [1576,354,52,31],[1638,355,39,30],[1660,269,23,30],[1774,356,24,28],
      [1806,358,33,52],[1908,364,17,32],[1937,361,20,39]],
    east:[[33,285,58,23],[126,285,60,23],[26,363,65,32],[127,360,63,36],
      [381,361,44,23],[436,362,22,22],[562,269,65,27],[670,269,58,27],[783,235,22,37],[812,235,37,37],
      [637,363,33,27],[680,363,41,28],[788,366,27,28],[859,367,30,27],
      [1067,163,40,24],[1124,163,17,25],[1147,164,28,30],[1183,163,16,26],[1209,163,43,24],
      [1409,372,37,23],[1455,370,43,25],[1564,322,62,15],[1644,322,67,15],
      [1644,351,62,28],[1781,337,24,27],[1851,344,24,31],[1933,345,24,27]]
  };
  const lamps={center:[[228,352],[423,355],[500,342],[681,342],[826,348],[1081,349],[1235,338],[1730,354],[1848,354],[1912,353],[2040,354]],west:[[427,323],[637,334],[750,321],[969,325],[1091,330],[1328,329],[1410,362],[1698,362],[1763,350],[1851,351],[1970,350]],east:[[18,348],[203,349],[369,350],[490,350],[545,345],[737,345],[778,349],[910,363],[1080,275],[1235,275],[1390,366],[1503,358],[1549,328],[1748,330],[1777,330],[1907,337],[2022,338]]};
  const transforms={center:[0,2172/2048],west:[-2172,2272/2048],east:[2072,2272/2048]};
  const windows=[],lanterns=[];
  for(const district of Object.keys(openings)){
    const [origin,sx]=transforms[district],sy=724/683;
    openings[district].forEach(([x,y,w,h])=>windows.push({x:origin+x*sx,y:y*sy,w:w*sx,h:h*sy}));
    lamps[district].forEach(([x,y])=>lanterns.push({x:origin+x*sx,y:y*sy}));
  }
  function glow(ctx,x,y,rx,ry,alpha){
    ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);
    const g=ctx.createRadialGradient(0,0,0,0,0,1);
    g.addColorStop(0,`rgba(255,185,81,${alpha})`);g.addColorStop(.35,`rgba(244,153,56,${alpha*.5})`);g.addColorStop(1,'rgba(240,135,45,0)');
    ctx.fillStyle=g;ctx.fillRect(-1,-1,2,2);ctx.restore();
  }
  const lightAt=(level,index)=>smooth((level-.16-(index*0.61803398875%1)*.32)/.48);
  function identity(value){
    const text=String(value??'');let hash=2166136261;
    for(let i=0;i<text.length;i++){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619);}
    hash^=hash>>>16;hash=Math.imul(hash,0x85ebca6b);
    hash^=hash>>>13;hash=Math.imul(hash,0xc2b2ae35);hash^=hash>>>16;
    return (hash>>>0)/4294967295;
  }
  function crowdPresence(level,person,kind='resident'){
    const night=clamp(level);if(night<=.12)return 1;
    const id=person?.id??`${person?.x}:${person?.from}:${person?.to}`;
    const value=identity(id),layer=person?.layer,role=person?.role;
    let keep=.48;
    if(kind==='walker')keep=.28;
    else if(layer==='balcony')keep=.52;
    else if(layer==='bridge')keep=.34;
    else if(role==='serve')keep=.68;
    else if(role==='work'||role==='trade')keep=.58;
    if(value<keep)return 1;
    // People leave one household at a time throughout dusk. The short fade
    // avoids a visible pop while keeping the street from looking ghostly.
    const order=(value-keep)/(1-keep),start=.2+order*.58;
    return 1-smooth((night-start)/.13);
  }
  const skySeed=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
  function drawSky(ctx,level,range,time=0,reduced=false,cloud=0){
    const visibility=smooth((level-.3)/.7)*(1-clamp(cloud)*.88);
    if(visibility<=0)return;
    const span=range[1]-range[0],parallax=range[0]*.88;
    const moonX=range[0]+span*.77-range[0]*.012,moonY=65,radius=21;
    ctx.save();ctx.globalCompositeOperation='screen';
    // A distant star field moves more slowly than the street. Keep stars in
    // the open upper sky, above the tallest painted roofs and treetops.
    const first=Math.floor((range[0]-parallax)/34)-1;
    for(let i=first;i<=Math.ceil((range[1]-parallax)/34)+1;i++){
      const x=i*34+skySeed(i)*25+parallax,y=17+skySeed(i+71)*53;
      if(Math.hypot(x-moonX,y-moonY)<radius+20)continue;
      const twinkle=reduced?.72:.53+.47*(.5+.5*Math.sin(time*(.65+skySeed(i+18)*.65)+skySeed(i+32)*Math.PI*2))**2;
      const size=.45+skySeed(i+13)*.75,alpha=visibility*twinkle*(.42+skySeed(i+8)*.43);
      ctx.globalAlpha=alpha;ctx.fillStyle=i%3?'#e6e8eb':'#fff0ce';
      ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();
      if(skySeed(i+55)>.84){
        ctx.globalAlpha=alpha*.4;ctx.strokeStyle='#e7edf4';ctx.lineWidth=.5;
        ctx.beginPath();ctx.moveTo(x-2.8,y);ctx.lineTo(x+2.8,y);ctx.moveTo(x,y-2.8);ctx.lineTo(x,y+2.8);ctx.stroke();
      }
    }
    ctx.globalAlpha=visibility;
    const halo=ctx.createRadialGradient(moonX,moonY,radius*.7,moonX,moonY,radius*2.7);
    halo.addColorStop(0,'rgba(234,228,195,.22)');halo.addColorStop(.45,'rgba(210,220,228,.07)');halo.addColorStop(1,'rgba(210,220,228,0)');
    ctx.fillStyle=halo;ctx.beginPath();ctx.arc(moonX,moonY,radius*2.7,0,Math.PI*2);ctx.fill();
    ctx.globalCompositeOperation='source-over';
    const disc=ctx.createRadialGradient(moonX-7,moonY-8,2,moonX,moonY,radius);
    disc.addColorStop(0,'#f4efd7');disc.addColorStop(.72,'#e7e4cf');disc.addColorStop(1,'#bfc9c7');
    ctx.fillStyle=disc;ctx.beginPath();ctx.arc(moonX,moonY,radius,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.clip();
    // Soft mineral washes suggest lunar detail in the ink painting palette.
    for(let i=0;i<11;i++){
      const x=moonX+(skySeed(i+170)-.5)*radius*1.6,y=moonY+(skySeed(i+190)-.5)*radius*1.6,r=2+skySeed(i+210)*5;
      const crater=ctx.createRadialGradient(x,y,0,x,y,r);
      crater.addColorStop(0,'rgba(115,137,146,.13)');crater.addColorStop(1,'rgba(115,137,146,0)');
      ctx.fillStyle=crater;ctx.fillRect(x-r,y-r,r*2,r*2);
    }
    ctx.restore();ctx.restore();
  }
  function drawAtmosphere(ctx,level,range,operation='source-over'){
    if(level<=0)return;
    ctx.save();ctx.globalAlpha=1;ctx.globalCompositeOperation=operation;
    const wash=ctx.createLinearGradient(0,0,0,724);
    wash.addColorStop(0,`rgba(12,24,51,${level*.83})`);
    wash.addColorStop(.6,`rgba(16,30,48,${level*.72})`);
    wash.addColorStop(1,`rgba(9,24,43,${level*.8})`);
    ctx.fillStyle=wash;ctx.fillRect(range[0]-2,0,range[1]-range[0]+4,724);
    ctx.restore();
  }
  // Shared by both streets so candle color, paper glow and lantern shapes agree.
  function drawWindow(ctx,w,a,{mullions=true}={}){
    if(a<=0)return;
    ctx.save();ctx.globalCompositeOperation='screen';
    glow(ctx,w.x+w.w/2,w.y+w.h/2,w.w*.95,w.h*1.1,a*.22);
    // Translucent light preserves the original timber and lattice texture.
    const fill=ctx.createLinearGradient(0,w.y,0,w.y+w.h);
    fill.addColorStop(0,`rgba(255,175,65,${a*.36})`);fill.addColorStop(.65,`rgba(255,207,117,${a*.62})`);fill.addColorStop(1,`rgba(227,142,52,${a*.36})`);
    ctx.fillStyle=fill;ctx.fillRect(w.x,w.y,w.w,w.h);
    ctx.fillStyle=`rgba(77,39,19,${a*.34})`;
    ctx.globalCompositeOperation='source-over';
    if(mullions){
      for(let x=w.x+7;x<w.x+w.w-2;x+=9)ctx.fillRect(x,w.y,1,w.h);
      ctx.fillRect(w.x,w.y+w.h*.52,w.w,1);
    }
    ctx.restore();
  }
  function drawLantern(ctx,lamp,a,time=0,reduced=false,index=0){
    if(a<=0)return;
    const {x,y,size=1,groundY=472}=lamp;
    const shimmer=reduced?1:.97+.03*Math.sin(time*1.7+index*2.3);
    ctx.save();ctx.globalCompositeOperation='screen';
    glow(ctx,x,y+10*size,32*size,41*size,a*.5*shimmer);
    glow(ctx,x,groundY,55,14,a*.18);
    ctx.translate(x,y);ctx.scale(size,size);
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a;
    ctx.strokeStyle='#9b7144';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(0,2);ctx.stroke();
    ctx.fillStyle='#eeaa55';ctx.beginPath();ctx.ellipse(0,10,5.5,8,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffe0a1';ctx.fillRect(-2,4,4,12);
    ctx.fillStyle='#895138';ctx.fillRect(-4,1,8,2);ctx.fillRect(-4,17,8,2);
    ctx.strokeStyle='#c2884c';ctx.beginPath();ctx.moveTo(0,19);ctx.lineTo(0,24);ctx.stroke();
    ctx.restore();
  }
  function draw(ctx,level,range,time=0,reduced=false){
    if(level<=0)return;
    drawAtmosphere(ctx,level,range);
    ctx.save();ctx.globalAlpha=1;ctx.globalCompositeOperation='screen';
    windows.forEach((w,i)=>{
      if(w.x+w.w+65<range[0]||w.x-65>range[1])return;
      const a=lightAt(level,i);if(a<=0)return;
      drawWindow(ctx,w,a);
    });
    lanterns.forEach((lamp,i)=>{
      const {x,y}=lamp;if(x+95<range[0]||x-95>range[1])return;
      const a=lightAt(level,i+7);if(a<=0)return;
      drawLantern(ctx,lamp,a,time,reduced,i);
      // Broken strokes follow the water instead of a solid mirrored beam.
      for(let j=0;j<19;j++){
        const yy=551+j*6.5,sway=reduced?0:Math.sin(time*.65+j*.9+i)*3;
        const width=(4+Math.sin(j*2.4+i)**2*14)*(1+j*.065);
        ctx.fillStyle=`rgba(243,176,78,${a*.17*(1-j/20)})`;
        ctx.fillRect(x+sway-width/2,yy,width,.7+(j%3)*.35);
      }
    });
    ctx.restore();
  }
  return {Nightfall,draw,drawSky,drawAtmosphere,drawWindow,drawLantern,lightAt,crowdPresence,windows,lanterns};
});
