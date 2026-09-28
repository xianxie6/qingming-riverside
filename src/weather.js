((root,factory)=>{
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.QingmingWeather=api;
})(typeof window!=='undefined'?window:globalThis,()=>{
  'use strict';
  const clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
  const smooth=(a,b,t)=>{const u=clamp((t-a)/(b-a));return u*u*(3-2*u);};
  const stages=[[0,'gather','风起'],[3,'shower','疏雨'],[16,'downpour','骤雨'],[47,'easing','雨歇'],[65,'afterglow','天青'],[88,'complete','雨过天青']];
  function weatherAt(time,active=true){
    const t=Math.max(0,time);let stage='clear',label='晴和';
    if(active)for(const [at,id,name] of stages)if(t>=at){stage=id;label=name;}
    const gathering=smooth(0,12,t),ending=smooth(62,88,t);let rain=0;
    if(active){
      if(t<3)rain=0;
      else if(t<16)rain=.5*smooth(3,16,t);
      else if(t<47)rain=.5+.5*smooth(16,28,t);
      else if(t<65)rain=1-.82*smooth(47,65,t);
      else rain=.18*(1-smooth(65,75,t));
    }
    const wet=active?clamp(smooth(10,30,t)*(1-smooth(72,88,t))):0;
    const gloom=active?clamp(.56*gathering*(1-smooth(52,84,t))):0;
    const wind=active?clamp(.18+.5*smooth(0,10,t)+.28*rain-.6*ending):0;
    return {time:t,active:active&&stage!=='complete',stage,label,rain,wet,gloom,wind};
  }
  class RainEvent{
    constructor(){this.active=false;this.time=0;this.stage='clear';this.events=[];this.runs=0;}
    start(){if(this.active)return false;this.active=true;this.time=0;this.stage='gather';this.events=['gather'];this.runs++;return true;}
    step(dt){
      this.events=[];if(!this.active||dt<=0)return this.sample();
      this.time+=dt;const next=weatherAt(this.time,true);
      if(next.stage!==this.stage){this.stage=next.stage;this.events.push(next.stage);}
      if(next.stage==='complete')this.active=false;return this.sample();
    }
    sample(){return weatherAt(this.time,this.active||this.stage==='complete');}
    reset(){this.active=false;this.time=0;this.stage='clear';this.events=[];}
  }
  function seed(n){const x=Math.sin(n*91.731+17.13)*43758.5453;return x-Math.floor(x);}
  function identity(p){
    const value=String(p?.id??'');let hash=0;
    for(let i=0;i<value.length;i++)hash=(hash*31+value.charCodeAt(i))%10007;
    return hash;
  }
  function carriesUmbrella(p){
    return Boolean(p?.id)&&!p.indoor&&!['balcony','pavilion','interior'].includes(p.layer);
  }
  function umbrellaProgress(s,p){
    if(!carriesUmbrella(p)||s.rain<.015)return 0;
    const start=3+seed(identity(p)+37)*9.5;
    return smooth(start,start+2.6,s.time);
  }
  function line(ctx,x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
  function drawUmbrella(ctx,s,item,result){
    if(!result?.hand)return false;
    const {p,x,y,direction}=item,scale=p.h/66,hand=result.hand;
    const openness=umbrellaProgress(s,p);if(openness<.015)return false;
    const eased=openness*openness*(3-2*openness),radius=(2.8+16.2*eased)*scale;
    const key=identity(p),breeze=(seed(key+19)-.5)*1.6*s.wind;
    const centerX=x+direction*(2.5+breeze)*scale,baseY=y-p.h-7*scale,apexY=baseY-(2.5+8*eased)*scale;
    const palette=['#8f7658','#788071','#8d6758','#8a846a'];
    ctx.save();ctx.globalAlpha=.25+.73*openness;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.strokeStyle='#5d533f';ctx.lineWidth=.72*scale;
    line(ctx,centerX,apexY,hand.x,hand.y+1.5*scale);
    ctx.beginPath();ctx.moveTo(hand.x,hand.y+1.2*scale);ctx.lineTo(hand.x-direction*1.2*scale,hand.y+7*scale);
    ctx.quadraticCurveTo(hand.x-direction*1.8*scale,hand.y+10*scale,hand.x-direction*5*scale,hand.y+8.5*scale);ctx.stroke();
    ctx.fillStyle=palette[key%palette.length];ctx.strokeStyle='#554d3e';ctx.lineWidth=.65*scale;
    ctx.beginPath();ctx.moveTo(centerX-radius,baseY);
    ctx.quadraticCurveTo(centerX-radius*.58,apexY-2*scale,centerX,apexY);
    ctx.quadraticCurveTo(centerX+radius*.58,apexY-2*scale,centerX+radius,baseY);
    ctx.quadraticCurveTo(centerX+radius*.72,baseY-2.5*scale,centerX+radius*.48,baseY);
    ctx.quadraticCurveTo(centerX+radius*.24,baseY-2.4*scale,centerX,baseY);
    ctx.quadraticCurveTo(centerX-radius*.24,baseY-2.4*scale,centerX-radius*.48,baseY);
    ctx.quadraticCurveTo(centerX-radius*.72,baseY-2.5*scale,centerX-radius,baseY);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.globalAlpha*=.35;ctx.strokeStyle='#efe2be';ctx.lineWidth=.38*scale;
    for(const offset of [-.48,0,.48])line(ctx,centerX,apexY,centerX+radius*offset,baseY);
    ctx.restore();return true;
  }
  function drawWetGround(ctx,s,range,streetY){
    if(s.wet<.02)return;
    ctx.save();ctx.globalCompositeOperation='multiply';
    const wash=ctx.createLinearGradient(0,425,0,520);wash.addColorStop(0,'rgba(74,91,88,0)');wash.addColorStop(1,`rgba(64,78,75,${.11*s.wet})`);
    ctx.fillStyle=wash;ctx.beginPath();ctx.moveTo(range[0]-40,streetY(range[0]-40)-4);
    for(let x=range[0]-40;x<=range[1]+40;x+=18)ctx.lineTo(x,streetY(x)+7);
    ctx.lineTo(range[1]+40,520);ctx.lineTo(range[0]-40,520);ctx.closePath();ctx.fill();ctx.restore();
    ctx.save();ctx.strokeStyle=`rgba(72,88,82,${.08+.15*s.wet})`;ctx.lineWidth=.55;
    const first=Math.floor(range[0]/170)-1;
    for(let i=first;i<first+Math.ceil((range[1]-range[0])/170)+3;i++){
      const x=i*170+seed(i)*90,y=streetY(x)+3;
      ctx.beginPath();ctx.ellipse(x,y,20+seed(i+3)*22,1.2+seed(i+5)*1.3,0,0,Math.PI*2);ctx.stroke();
    }
    ctx.restore();
  }
  function drawMarketCovers(ctx,s,range){
    if(s.rain<.3)return;
    const spots=[[-350,454,66],[2475,451,74],[3835,467,82]];
    for(const [x,y,w] of spots){
      if(x+w<range[0]||x-w>range[1])continue;
      ctx.save();ctx.globalAlpha=clamp((s.rain-.18)/.35)*.72;ctx.fillStyle='#73817a';ctx.strokeStyle='#565d50';ctx.lineWidth=.7;
      ctx.beginPath();ctx.moveTo(x-w/2,y-54);ctx.lineTo(x+w/2,y-52);ctx.lineTo(x+w/2-7,y-38);ctx.lineTo(x-w/2+5,y-40);ctx.closePath();ctx.fill();ctx.stroke();
      for(let a=-w/2+8;a<w/2;a+=12)line(ctx,x+a,y-53,x+a-3,y-41);ctx.restore();
    }
  }
  function drawRain(ctx,s,range,height=724,reduced=false){
    if(s.gloom>.005){ctx.save();ctx.fillStyle=`rgba(42,61,63,${.34*s.gloom})`;ctx.globalCompositeOperation='multiply';ctx.fillRect(range[0]-5,0,range[1]-range[0]+10,height);ctx.restore();}
    if(s.rain<.015)return;
    const count=Math.round((reduced?28:120)*s.rain),span=range[1]-range[0],fall=reduced?0:s.time*(310+70*s.rain);
    ctx.save();ctx.strokeStyle=`rgba(215,224,216,${.16+.34*s.rain})`;ctx.lineWidth=.48+.35*s.rain;ctx.lineCap='round';
    for(let i=0;i<count;i++){
      const x=range[0]+((seed(i+11)*span+fall*.16+seed(i+81)*170)%span),y=(seed(i+27)*height+fall)%height,length=8+18*s.rain+seed(i+5)*12;
      line(ctx,x,y,x-2.5-5*s.wind,y+length);
    }
    ctx.strokeStyle=`rgba(191,210,204,${.12+.2*s.rain})`;ctx.lineWidth=.55;
    for(let i=0;i<Math.round(24*s.rain);i++){
      const x=range[0]+seed(i+Math.floor(s.time*2)*31)*span,y=548+seed(i+4)*148;
      ctx.beginPath();ctx.ellipse(x,y,2+5*s.rain,.45+1.1*s.rain,0,0,Math.PI*2);ctx.stroke();
    }
    ctx.restore();
  }
  return {RainEvent,weatherAt,carriesUmbrella,umbrellaProgress,drawUmbrella,drawWetGround,drawMarketCovers,drawRain,stages};
});
