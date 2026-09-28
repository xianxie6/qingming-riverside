(() => {
  'use strict';
  // A registered, non-interactive layer. The panorama itself is never replaced.
  const frame=document.querySelector('#atlasFrame');
  const NS='http://www.w3.org/2000/svg';
  const sky=document.createElementNS(NS,'svg');sky.id='atlasFestivalSky';
  sky.setAttribute('viewBox','0 0 2048 683');sky.setAttribute('aria-hidden','true');
  const source='assets/midautumn/sky-moon-osmanthus-v1.png';
  function svgNode(tag,attrs,parent=sky){const node=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,v);parent.append(node);return node;}
  const defs=svgNode('defs',{});
  const mask=svgNode('mask',{id:'festival-sky-still',maskUnits:'userSpaceOnUse',x:0,y:0,width:2048,height:683},defs);
  svgNode('rect',{width:2048,height:683,fill:'white'},mask);
  // Separate each original lantern without regenerating the moon or clouds.
  const floating=[[55,155,82,99],[207,347,111,148],[837,184,82,98],[1236,443,88,104],[1827,380,104,123]];
  for(const [x,y,w,h] of floating)svgNode('rect',{x,y,width:w,height:h,fill:'black'},mask);
  svgNode('path',{d:'M1600 0H2048V335H1840L1800 271H1670L1660 180H1600Z',fill:'black'},mask);
  // Art-directed waxing phases for this festival, not an astronomical calendar.
  // Use Beijing dates even when a visitor is abroad or leaves the page open.
  const moonShade=svgNode('path',{fill:'black'},mask);
  const moonEdge=svgNode('filter',{id:'festival-moon-edge',x:'-10%',y:'-10%',width:'120%',height:'120%'},defs);
  svgNode('feGaussianBlur',{stdDeviation:1.2},moonEdge);
  moonShade.setAttribute('filter','url(#festival-moon-edge)');
  // These foreground cloud silhouettes must survive the lunar shadow mask.
  svgNode('path',{d:'M1200 281L1243 287L1275 300L1311 307L1354 305L1382 314L1345 323L1300 325L1274 339L1237 349L1200 351Z M1380 372L1420 359L1450 358L1484 341L1518 338L1548 344L1580 354L1580 407L1380 407Z',fill:'white'},mask);
  function updateMoonPhase(now=new Date()){
    const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
    const illumination=date<'2026-09-23'?.82:date<'2026-09-24'?.91:date<'2026-09-25'?.97:1;
    const cx=1425,cy=262,r=153,terminator=r*(2*illumination-1);
    moonShade.setAttribute('d',illumination===1?'':`M ${cx} ${cy-r} A ${r} ${r} 0 0 0 ${cx} ${cy+r} A ${terminator} ${r} 0 0 1 ${cx} ${cy-r} Z`);
    sky.dataset.moonDate=date;
    sky.dataset.moonIllumination=String(illumination);
  }
  updateMoonPhase();
  setInterval(updateMoonPhase,30000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateMoonPhase();});
  svgNode('image',{href:source,width:2048,height:683,mask:'url(#festival-sky-still)',transform:'translate(0,-42)'});
  const lanterns=[...floating.map(rect=>({rect})),{rect:floating[0],position:[445,244],scale:1.12},{rect:floating[2],position:[1025,93],scale:.92}];
  lanterns.forEach(({rect:[x,y,w,h],position=[x,y],scale=1},i)=>{
    const placement=svgNode('g',{transform:`translate(${position[0]} ${position[1]}) scale(${scale}) translate(${-x} ${-y})`});
    const moving=svgNode('g',{class:'festival-floating-lantern',style:`--float-time:${7+i*1.3}s;--float-delay:${-i*2.1}s`},placement);
    const crop=svgNode('svg',{x,y,width:w,height:h,viewBox:`${x} ${y} ${w} ${h}`,overflow:'hidden'},moving);
    svgNode('image',{href:source,width:2048,height:683},crop);
  });
  // The complete branch has transparent margins, so no leaves meet a crop edge.
  // Root the stems beyond the right edge, including the image's transparent margin
  // and the full sway range, so the branch enters from outside the viewport.
  [[-27,.62],[21,.79],[0,1]].forEach(([angle,size],i)=>{
    const placement=svgNode('g',{transform:`translate(2160 95) rotate(${angle}) scale(${size}) translate(-2030 -90)`});
    const branch=svgNode('g',{class:'festival-osmanthus',style:`animation-duration:${10+i*1.7}s;animation-delay:${-i*2.4}s`},placement);
    svgNode('image',{href:'assets/midautumn/osmanthus-complete-v1.png',x:1545,y:28,width:485,height:286},branch);
  });
  // Small flowers follow staggered wind paths, separate from the branch.
  const petals=svgNode('g',{'aria-hidden':'true'});
  for(let i=0;i<18;i++){
    const x=1620+(i*67)%390,y=95+(i*43)%170;
    const drift=svgNode('g',{class:'festival-petal',style:`--petal-duration:${12+i%6*1.7}s;--petal-delay:${-i*2.37}s;--petal-dx:${-190-i%5*62}px;--petal-dy:${280+i%4*55}px`},petals);
    const flower=svgNode('g',{transform:`translate(${x} ${y}) scale(${.65+i%4*.17})`,fill:i%2?'#dcb05c':'#eed095'},drift);
    for(let k=0;k<4;k++)svgNode('ellipse',{cx:0,cy:-3,rx:2.2,ry:3.3,transform:`rotate(${k*90})`},flower);
    svgNode('circle',{r:1.2,fill:'#b68b42'},flower);
  }
  sky.setAttribute('preserveAspectRatio','xMaxYMin meet');
  document.querySelector('#atlasStage').append(sky);
  const layer=document.createElement('canvas');layer.id='atlasFestival';
  layer.width=2172;layer.height=724;layer.setAttribute('aria-hidden','true');
  document.querySelector('#atlasImage').after(layer);
  const c=layer.getContext('2d');
  const art=new Image();art.src='assets/midautumn/lantern-design-v1.png';
  // Attachment points traced on the panorama itself in its 2048 × 683
  // reference space. Each y is the timber/rail connection, not the lamp top.
  // Keep these with the painting transform; never position them in sky space.
  const lamps=[
    // Watermill: fixed beams only (the wheel and the water have no hang points).
    [122,348,21],[183,318,21],
    // Western shops, rear eaves and the main shop's front lintel.
    [367,300,19],[405,291,19],[440,285,19],[480,285,19],
    [477,350,24],[524,350,24],[575,350,24],[626,350,24],[677,350,24],
    [545,287,19],[594,287,19],[642,287,19],
    // Market awning in front of the bridge approach.
    [754,381,21],[797,382,21],
    // Near-side bridge rail: follow its arch, with lanterns below the handrail.
    [845,374,18],[887,354,18],[941,333,18],[984,317,18],
    [1027,306,18],[1073,302,18],[1115,308,18],[1156,327,18],[1200,349,18],
    // Pavilion and rear shop eaves; no free-floating hooks above pedestrians.
    [919,301,16],[948,304,16],[772,283,17],[824,283,17],
    // Eastern awnings and upper eaves.
    [1279,361,23],[1326,364,23],[1381,367,23],[1434,385,23],
    [1287,248,16],[1334,245,16],[1390,249,16],
    [1470,389,23],[1511,389,23],[1557,389,23],
    [1636,321,22],[1677,321,22],[1720,321,22],[1752,386,23],[1818,400,23],
    // Gate gallery and the two sides of the arch.
    [1830,160,22],[1863,160,22],[1897,160,22],[1932,160,22],
    [1859,287,27],[1940,287,27],[2016,332,23],
    // Boat canopy edges, not the quay or the curved canopy roof.
    [401,504,19],[541,506,19],[998,448,17],[1073,454,17],
    [1208,488,19],[1255,489,19],[1406,485,19],[1477,482,19],
    // Distant roofs and the pagoda balconies.
    [1164,219,11],[1214,219,11],[1270,225,11],[1463,242,12],
    [1390,151,10],[1412,151,10],[1385,129,9]
  ];
  const suspension=4;
  const windows=[
    [485,377,29,25],[530,375,29,26],[581,375,28,26],[633,375,29,26],
    [380,302,16,23],[419,302,16,23],[457,288,16,24],
    [1316,312,23,29],[1360,314,23,29],
    [1650,335,20,26],[1685,335,20,26],[1724,335,20,26],
    [1841,139,17,16],[1873,139,17,16],[1907,139,17,16],[1939,139,17,16],
    [1476,416,18,20],[1515,416,18,20],[1548,416,18,20]
  ];
  function glow(x,y,r,strength){
    const g=c.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,`rgba(255,201,101,${strength})`);
    g.addColorStop(.28,`rgba(244,162,64,${strength*.5})`);
    g.addColorStop(1,'rgba(238,156,56,0)');
    c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);
  }
  function paint(){
    c.setTransform(2172/2048,0,0,724/683,0,0);c.clearRect(0,0,2048,683);
    // A gentle dusk wash keeps all ink detail visible, while separating warm lights.
    const dusk=c.createLinearGradient(0,0,0,683);
    dusk.addColorStop(0,'rgba(86,66,40,.10)');
    dusk.addColorStop(.40,'rgba(24,43,48,.30)');
    dusk.addColorStop(1,'rgba(30,48,55,.38)');
    c.fillStyle=dusk;c.fillRect(0,0,2048,683);
    c.globalCompositeOperation='screen';
    for(const [x,y,w,h] of windows){
      glow(x+w/2,y+h/2,w*1.65,.32);
      const g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#e9a74726');g.addColorStop(.6,'#ffd07c66');g.addColorStop(1,'#f8ba5522');c.fillStyle=g;c.fillRect(x,y,w,h);
    }
    for(const [x,y,h] of lamps)glow(x,y+suspension+h*.38,h*1.8,.62);
    // Short broken reflections follow the existing horizontal water strokes.
    for(const [index,[x,start,length,width]] of [[150,550,70,33],[440,559,95,48],[648,535,85,30],[959,536,105,36],[1068,468,80,22],[1250,548,95,33],[1440,553,95,40],[1850,566,79,31]].entries()){
      for(let j=0;j<32;j++){
        const seed=Math.sin((j+1)*78.233+index*39.19)*43758.5453,rand=seed-Math.floor(seed);
        const t=j/32,xx=x+Math.sin(j*2.4+index)*width*(.2+t*.35),yy=start+t*length;
        const w=(3+rand*width*.65)*(1-t*.45);
        c.strokeStyle=`rgba(255,195,92,${(.18+rand*.40)*(1-t*.8)})`;c.lineWidth=.5+rand*1.1;
        c.beginPath();c.moveTo(xx-w/2,yy);c.lineTo(xx+w/2,yy-.6);c.stroke();
      }
    }
    c.globalCompositeOperation='source-over';
    if(art.complete&&art.naturalWidth){
      for(const [i,[x,y,h]] of lamps.entries()){
        const green=i%5===2,s=green?[803,86,518,932]:[274,48,380,968];
        const w=h*s[2]/s[3];
        // The cord starts exactly on the traced structure and reaches the
        // hanging ring in the sprite; lamp and glow share that same offset.
        c.strokeStyle='#746043dd';c.lineWidth=.7;c.beginPath();c.moveTo(x,y);c.lineTo(x,y+suspension+1);c.stroke();
        c.drawImage(art,...s,x-w/2,y+suspension,w,h);
      }
    }
  }
  art.onload=paint;art.onerror=()=>{layer.remove();};if(art.complete&&art.naturalWidth)paint();
})();
