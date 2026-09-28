// Festival decorations use the east district's original image coordinates.
export const festivalEnabled=document.body.dataset.midautumnEnabled==='true';
export const festivalGate = { x: 2072 + 1230 * 2272 / 2172, y: 350 };
const ink = '#795235', gold = '#d8b775';
function line(c, points, color=ink, width=.8) {
  c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.stroke();
}
const lanternArt=new Image();
if(festivalEnabled)lanternArt.src='assets/midautumn/lantern-design-v1.png';
// Preserve the generated alpha channel, flower painting and fine silk tassels.
const lanternSprites={red:{x:274,y:48,w:380,h:968},green:{x:803,y:86,w:518,h:932}};
const lanternLayout=[
  ...[1096,1140,1185,1230,1275,1320,1364].map((x,i)=>({x,y:160+19*Math.sin(i/6*Math.PI),height:44,type:i%2?'green':'red'})),
  ...[1070,1110,1155,1305,1350,1390].map((x,i)=>({x,y:i%3===1?244:232,height:34,type:i%2?'green':'red'})),
  {x:1147,y:291,height:76,type:'red',wall:true},
  {x:1314,y:291,height:76,type:'red',wall:true}
];
// Filter each small, high-density lantern once per lighting level, rather
// than allocating a filtered copy of the full source image on every draw.
const lanternCache=new WeakMap();
function lanternBitmap(placement,night,shadow=false){
  const {height,type}=placement,s=lanternSprites[type],width=height*s.w/s.h;
  let cache=lanternCache.get(placement);
  if(!cache){cache={};lanternCache.set(placement,cache);}
  const key=shadow?'shadow':night.toFixed(2),slot=shadow?'shadow':'color';
  if(cache[slot]?.key===key)return cache[slot];
  const pad=shadow?8:0,density=4,image=document.createElement('canvas');
  image.width=Math.ceil((width+pad*2)*density);image.height=Math.ceil((height+pad*2)*density);
  const c=image.getContext('2d');c.scale(density,density);c.imageSmoothingQuality='high';
  c.filter=shadow?'brightness(0) blur(2px)':`saturate(.90) brightness(${.97-Number(key)*.08})`;
  c.drawImage(lanternArt,s.x,s.y,s.w,s.h,pad,pad,width,height);
  return cache[slot]={key,image,width:width+pad*2,height:height+pad*2,pad};
}
function lantern(c,placement,time,night=0,lightPass=false){
  if(!lanternArt.complete||!lanternArt.naturalWidth)return;
  const {x,y,height,type}=placement,sprite=lanternSprites[type];
  const width=height*sprite.w/sprite.h;
  c.save();c.translate(x,y);
  if(placement.wall&&!lightPass){
    // A small forged bracket fixes the lamp to the masonry; its foot and
    // restrained cast shadow establish depth without obscuring brick detail.
    c.fillStyle='#65563e';c.fillRect(-4,-5,3,10);
    line(c,[[-3,-3],[0,-3],[0,5]],'#675339',1.15);
    line(c,[[-3,4],[0,-2]],'#786346',.7);
    c.fillStyle='#c1a273';c.fillRect(-3.3,-3.5,.7,.7);
    const shadow=lanternBitmap(placement,night,true);
    c.save();c.translate(4,2);c.globalAlpha=.14;
    c.drawImage(shadow.image,-width/2-shadow.pad,7-shadow.pad,shadow.width,shadow.height);c.restore();
  }
  c.rotate(Math.sin(time*.7+x)*(placement.wall?.009:.025));
  // Daylight reveals aged silk; candle bloom grows only as dusk deepens.
  const centerY=7+height*(type==='red'?.35:.40);
  c.save();c.translate(0,centerY);c.scale(width*1.55,height*.7);
  const halo=c.createRadialGradient(0,0,0,0,0,1);
  halo.addColorStop(0,`rgba(245,195,111,${.055+night*.23})`);halo.addColorStop(.38,`rgba(235,173,82,${.025+night*.11})`);halo.addColorStop(1,'rgba(255,177,62,0)');
  c.fillStyle=halo;c.fillRect(-1,-1,2,2);c.restore();
  line(c,[[0,0],[0,7]],'#8f754a',.65);
  c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  const bitmap=lanternBitmap(placement,night);
  c.drawImage(bitmap.image,-width/2,7,width,height);
  // Keep the light inside the silk body so the flowers stay legible.
  c.save();c.translate(0,7+height*(type==='red'?.35:.40));
  c.scale(width*.40,height*.24);c.globalCompositeOperation='screen';
  const warmth=.17+night*.25+Math.sin(time*.65+x)*.008;
  const light=c.createRadialGradient(0,0,0,0,0,1);
  light.addColorStop(0,`rgba(255,239,176,${warmth})`);
  light.addColorStop(.5,`rgba(255,202,106,${warmth*.7})`);
  light.addColorStop(1,'rgba(255,181,78,0)');
  c.fillStyle=light;c.beginPath();c.arc(0,0,1,0,Math.PI*2);c.fill();
  c.restore();c.restore();
}
function drawLanterns(c,time,night=0,lightPass=false){for(const placement of lanternLayout)lantern(c,placement,time,night,lightPass);}
export function drawFestivalGate(c,time,range,night=0) {
  if(!festivalEnabled||range[1]<3100||range[0]>3630)return;
  c.save();c.translate(2072,0);c.scale(2272/2172,1);
  c.strokeStyle=ink;c.lineWidth=1;
  c.beginPath();c.moveTo(1082,156);c.quadraticCurveTo(1230,201,1377,156);c.stroke();
  c.beginPath();c.moveTo(1055,224);c.quadraticCurveTo(1138,272,1214,234);c.moveTo(1246,234);c.quadraticCurveTo(1320,272,1400,224);c.stroke();
  c.fillStyle='#794332';c.fillRect(1192,261,76,15);
  c.strokeStyle='#4d3128';c.lineWidth=1;c.strokeRect(1192.5,261.5,75,14);
  c.strokeStyle=gold;c.lineWidth=.65;c.strokeRect(1194,263,72,11);
  c.textAlign='center';c.textBaseline='alphabetic';c.font='bold 10px "Songti SC",serif';
  c.lineJoin='round';c.lineWidth=.45;c.strokeStyle='#9d754a';c.strokeText('中 秋 灯 会',1230,272);
  c.fillStyle='#f0d8a4';c.fillText('中 秋 灯 会',1230,272);
  drawLanterns(c,time,night);
  c.restore();
}
// Reuse exactly the same artwork after the blue atmospheric tint.
export function drawFestivalLights(c,time,range,night){
  if(!festivalEnabled||night<=0||range[1]<3100||range[0]>3630)return;
  c.save();c.translate(2072,0);c.scale(2272/2172,1);c.globalAlpha=night*.72;
  drawLanterns(c,time,night,true);
  c.globalAlpha=night*.20;c.fillStyle='#b06d3e';c.fillRect(1195,264,70,9);
  c.globalAlpha=night*.72;c.fillStyle='#f1d49b';c.textAlign='center';
  c.font='bold 10px "Songti SC",serif';c.fillText('中 秋 灯 会',1230,272);
  c.restore();
}
