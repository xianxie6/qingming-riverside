// Spring breeze over the west fields: gusts bend the wheat, the canal runs,
// smoke rises from the farmhouse and swallows skim the furrows.
// All coordinates are local to the `west-far` panel (1729 × 724).
const W=1729;
// The wheat and leek beds left of the canal, as a perspective quad.
const FIELD=[[95,284],[440,284],[432,452],[0,452],[0,330]];
// The open water shows only below y 345; the bridge crosses at 402–420.
const CANAL=[[470,345],[486,345],[497,452],[442,452]];
const BRIDGE={y0:401,y1:421};
const SMOKE=[{x:596,y:236,phase:0},{x:742,y:232,phase:2.3}];
const GUST_SPEED=120,GUST_GAP=520,GUST_WIDTH=170;
const BIRDS=[
 {y:190,speed:62,phase:0,amp:22,size:7},{y:205,speed:62,phase:.12,amp:20,size:6.2},
 {y:178,speed:62,phase:.2,amp:25,size:5.8},{y:260,speed:-48,phase:.55,amp:16,size:6.5}
];
function path(ctx,points){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}
// Gust strength at x: soft bumps that travel left to right.
function gust(x,time){
 const p=((x-time*GUST_SPEED)%GUST_GAP+GUST_GAP)%GUST_GAP-GUST_GAP/2;
 return Math.exp(-(p*p)/(2*(GUST_WIDTH/2.6)**2));
}
export function createFieldAmbience({panel}){
 function drawWheat(ctx,tile,time){
  // Shift thin horizontal slices of the painting downwind inside each gust,
  // more at the heads of each row, so the crop leans rather than slides.
  const head=time*GUST_SPEED%GUST_GAP;
  for(let c=-1;c<5;c++){
   const cx=head+c*GUST_GAP-GUST_GAP/2;if(cx<-GUST_WIDTH||cx>460+GUST_WIDTH)continue;
   ctx.save();path(ctx,FIELD);ctx.clip();ctx.beginPath();ctx.rect(cx-GUST_WIDTH,284,GUST_WIDTH*2,168);ctx.clip();
   for(let y=284;y<452;y+=4){
    const row=(y-284)%22/22,lean=(1-row)*.8+.2;
    const dx=2.8*lean*(.7+.3*Math.sin(time*3.1+y*.21));
    ctx.drawImage(tile,cx-GUST_WIDTH,y,GUST_WIDTH*2,4,cx-GUST_WIDTH+dx,y,GUST_WIDTH*2,4);
   }
   // The light catching the bent stalks.
   const g=ctx.createLinearGradient(cx-GUST_WIDTH,0,cx+GUST_WIDTH,0);
   g.addColorStop(0,'rgba(255,246,214,0)');g.addColorStop(.55,'rgba(255,246,214,.34)');g.addColorStop(.75,'rgba(110,92,48,.08)');g.addColorStop(1,'rgba(255,246,214,0)');
   ctx.globalCompositeOperation='soft-light';ctx.fillStyle=g;ctx.fillRect(cx-GUST_WIDTH,284,GUST_WIDTH*2,168);
   ctx.restore();
  }
 }
 function drawCanal(ctx,time){
  ctx.save();path(ctx,CANAL);ctx.clip();ctx.lineCap='round';
  for(let i=0;i<16;i++){
   const lane=(i*.6180339)%1,y=345+((i*41+time*26)%107);
   if(y>BRIDGE.y0-3&&y<BRIDGE.y1+3)continue;
   const t=(y-345)/107,left=470+(442-470)*t,right=486+(497-486)*t,x=left+(right-left)*(.15+.7*lane);
   const len=3+7*t,fade=Math.min(1,(y-345)/14,(452-y)/12),wob=Math.sin(time*2+i)*1.2;
   // A flat ripple across the current, bowed downstream.
   ctx.strokeStyle=`rgba(244,250,246,${.5*fade})`;ctx.lineWidth=.5+.6*t;
   ctx.beginPath();ctx.moveTo(x-len/2,y);ctx.quadraticCurveTo(x+wob,y+1.5+t*1.5,x+len/2,y);ctx.stroke();
  }
  ctx.restore();
 }
 function drawSmoke(ctx,time){
  for(const s of SMOKE)for(let i=0;i<7;i++){
   const age=((time*.16+i/7+s.phase)%1),rise=age*70;
   const x=s.x+rise*.55+Math.sin(age*6+i)*3,y=s.y-rise,r=3+age*11,a=.38*Math.sin(Math.PI*age);
   const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(214,208,196,${a})`);g.addColorStop(1,'rgba(232,226,212,0)');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  }
 }
 function drawBirds(ctx,time){
  ctx.save();ctx.strokeStyle='rgba(48,40,32,.82)';ctx.lineCap='round';ctx.lineJoin='round';
  for(const b of BIRDS){
   const span=W+200,travel=time*b.speed+b.phase*span,x=b.speed>0?travel%span-100:span-100-(-travel%span+span)%span;
   const y=b.y+Math.sin(time*1.3+b.phase*9)*b.amp+Math.sin(x*.012)*12,dir=Math.sign(b.speed);
   const flap=Math.sin(time*13+b.phase*20),s=b.size,wing=s*(.25+.6*flap);
   ctx.lineWidth=s*.28;ctx.beginPath();
   ctx.moveTo(x-s,y-wing);ctx.quadraticCurveTo(x-s*.4,y-wing*.3,x,y);ctx.quadraticCurveTo(x+s*.4,y-wing*.3,x+s,y-wing);ctx.stroke();
   // Forked swallow tail trailing behind.
   ctx.lineWidth=s*.16;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-dir*s*.9,y+s*.35);ctx.moveTo(x,y);ctx.lineTo(x-dir*s*.9,y-s*.05);ctx.stroke();
  }
  ctx.restore();
 }
 return {
  // Call inside the world transform, under the residents.
  draw(ctx,left,right,time){
   const p=panel();if(!p?.tile||right<p.x||left>p.x+W)return;
   ctx.save();ctx.translate(p.x,0);
   drawWheat(ctx,p.tile,time);drawCanal(ctx,time);drawSmoke(ctx,time);drawBirds(ctx,time);
   ctx.restore();
  }
 };
}
