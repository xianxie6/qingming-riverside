/* Four seasons share the same camera, paths, river and animation clock. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.QingmingSeasons=api;
})(typeof window!=='undefined'?window:globalThis,()=>{
  'use strict';
  const profiles={
    spring:{name:'春',label:'春和 · 轻衫',description:'柳色初新，春风轻拂，行人着轻衫',weather:'春雨',cloth:'轻衫'},
    summer:{name:'夏',label:'夏荫 · 薄衣',description:'浓荫覆岸，河水清碧，行人换上浅色薄衣',weather:'夏雨',cloth:'薄衣'},
    autumn:{name:'秋',label:'秋色 · 夹衣',description:'黄叶沿街飘落，行人添上夹衣与披肩',weather:'秋雨',cloth:'夹衣'},
    winter:{name:'冬',label:'冬雪 · 厚袍',description:'枯枝覆雪，屋瓦积白，行人穿厚袍、护领与暖靴',weather:'落雪',cloth:'厚袍'}
  };
  class Controller{
    constructor(load,apply,onState=()=>{}){this.load=load;this.apply=apply;this.onState=onState;this.id='spring';this.pending=null;this.revision=0;this.cache=new Map();}
    async select(id){
      if(!profiles[id])return false;
      const revision=++this.revision;this.pending=id;this.onState(this);
      try{
        if(!this.cache.has(id)){
          const promise=Promise.resolve().then(()=>this.load(id));this.cache.set(id,promise);
          promise.catch(()=>{if(this.cache.get(id)===promise)this.cache.delete(id);});
        }
        const assets=await this.cache.get(id);
        if(revision!==this.revision)return false;
        this.apply(id,assets);this.id=id;this.pending=null;this.onState(this);return true;
      }catch(error){
        if(revision===this.revision){this.pending=null;this.onState(this,error);}
        return false;
      }
    }
  }
  function loadImage(src){
    return new Promise((resolve,reject)=>{
      const img=new Image(),timer=setTimeout(()=>reject(Error('季节画面载入超时')),25000);
      img.decoding='async';img.onload=async()=>{
        try{await img.decode();if(Math.abs(img.naturalWidth/img.naturalHeight-3)>.03)throw Error('季节画面比例不正确');clearTimeout(timer);resolve(img);}
        catch(error){clearTimeout(timer);reject(error);}
      };
      img.onerror=()=>{clearTimeout(timer);reject(Error('季节画面载入失败'));};img.src=src;
    });
  }
  async function loadArt(id){
    const images=await Promise.all(['west','center','east'].map(part=>loadImage(`assets/seasons/${id}-${part}.png`)));
    return {west:images[0],center:images[1],east:images[2]};
  }
  function weather(id,sample,snow=true,time=0){
    if(id!=='winter')return sample;
    return {time,active:snow,stage:snow?'snow':'clear',label:snow?'疏雪':'雪霁',rain:0,wet:0,gloom:snow?.12:0,wind:snow?.18:.04,snow:snow?.55:0};
  }
  function outfit(id,p,raining=false){
    if(!profiles[id])id='spring';
    const sheltered=p.indoor||['balcony','pavilion','interior'].includes(p.layer);
    return id+(raining&&!sheltered&&!['summer','winter'].includes(id)?'-rain':'');
  }
  const paletteMix={summer:['#c9c5a0','#aaa98e',.20],autumn:['#8d654b','#766149',.17],winter:['#605968','#575963',.25]};
  function dress(ctx,frame,garment,head,mode){
    const id=mode.split('-')[0],wet=mode.endsWith('-rain'),mix=paletteMix[id];
    if(id==='spring'&&!wet)return;
    ctx.save();ctx.beginPath();garment.upper.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();
    if(mix){ctx.globalCompositeOperation=id==='summer'?'screen':'multiply';ctx.globalAlpha=mix[2];ctx.fillStyle=mix[0];ctx.fillRect(frame.x,frame.y,frame.w,frame.h);}
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    const [hx,hy,rx,ry]=head,neck=hy+ry*.82;
    if(id==='autumn'||id==='winter'||wet){
      // A painted shoulder wrap follows the original silhouette and is skinned
      // with the body, so it cannot float independently of a walking person.
      const long=id==='winter'||wet,depth=frame.h*(long?.38:.20);
      ctx.beginPath();ctx.moveTo(hx-rx*.8,neck-3);ctx.quadraticCurveTo(hx-rx*2.1,neck+12,hx-rx*2.3,neck+depth);
      ctx.quadraticCurveTo(hx-rx*.2,neck+depth+9,hx+rx*1.8,neck+depth*.73);ctx.lineTo(hx+rx*.6,neck+5);ctx.closePath();
      ctx.fillStyle=wet?'#777257':id==='winter'?'#645c58':'#93806b';ctx.globalAlpha=wet?.73:.79;ctx.fill();
      ctx.globalAlpha=.65;ctx.strokeStyle='#494b40';ctx.lineWidth=frame.h*.003;ctx.stroke();
      ctx.globalAlpha=.38;ctx.strokeStyle='#c0b296';
      for(let i=0;i<8;i++){
        const x=hx-rx*1.7+i*rx*.40;
        ctx.beginPath();ctx.moveTo(x,neck+18);ctx.quadraticCurveTo(x-7,neck+depth*.65,x-10,neck+depth);ctx.stroke();
      }
      if(id==='winter'){
        ctx.globalAlpha=1;ctx.strokeStyle='#c4bca5';ctx.lineWidth=frame.h*.028;ctx.lineCap='round';
        ctx.beginPath();ctx.moveTo(hx-rx*.8,neck);ctx.quadraticCurveTo(hx-rx*.1,neck+frame.h*.05,hx+rx*.62,neck+5);ctx.stroke();
        ctx.strokeStyle='#eee1c2';ctx.lineWidth=frame.h*.008;
        for(let i=0;i<15;i++){const t=i/14,x=hx-rx*.8+t*rx*1.42,y=neck+Math.sin(t*Math.PI)*frame.h*.024;ctx.beginPath();ctx.moveTo(x,y-3);ctx.lineTo(x+2,y+2);ctx.stroke();}
      }
    }
    ctx.restore();
  }
  const seed=n=>{const v=Math.sin(n*12.9898+78.233)*43758.5453;return v-Math.floor(v);};
  function particle(id,i,time){
    const x=-2250+seed(i+9)*6750,y=seed(i+3)*620;
    if(id==='winter')return {x:x+Math.sin(time*.28+i)*12+time*5%80,y:(y+time*(8+seed(i)*12))%660,r:.6+seed(i+1)*1.1};
    return {x:x+Math.sin(time*.5+i)*16,y:145+(y+time*(5+seed(i)*8))%365,r:1.4+seed(i+1)*1.4,angle:time*(.5+seed(i))+i};
  }
  function drawAir(ctx,id,time,range,reduced,snow=true){
    if(id!=='autumn'&&id!=='winter')return;
    if(id==='winter'&&!snow)return;
    const t=reduced?0:time;ctx.save();
    const count=id==='winter'?420:75;
    for(let i=0;i<count;i++){
      const p=particle(id,i,t);if(p.x<range[0]-20||p.x>range[1]+20)continue;
      if(id==='winter'){
        ctx.globalAlpha=.28+seed(i+4)*.45;ctx.fillStyle='#f4f2e9';ctx.beginPath();ctx.ellipse(p.x,p.y,p.r,p.r*.8,0,0,Math.PI*2);ctx.fill();
      }else{
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.globalAlpha=.65;ctx.fillStyle=i%3?'#9b703c':'#b4924a';ctx.beginPath();ctx.ellipse(0,0,p.r,p.r*.38,0,0,Math.PI*2);ctx.fill();ctx.restore();
      }
    }
    ctx.restore();
  }
  return {profiles,Controller,loadArt,weather,outfit,dress,particle,drawAir};
});
