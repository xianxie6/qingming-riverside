(() => {
  'use strict';
  class Districts {
    constructor(){
      this.west=new Image();this.east=new Image();this.center=null;this.ready=false;
      this.pending=new Map();this.loaded=new Set();this.revision=0;
    }
    needed(min,max){return [min<100?'west':null,max>2072?'east':null].filter(Boolean);}
    hasRange(min,max){return this.needed(min,max).every(side=>this.loaded.has(side));}
    loadSide(side,priority='high'){
      if(this.loaded.has(side))return Promise.resolve(this[side]);
      if(this.pending.has(side)){
        if(priority==='high')this[side].fetchPriority='high';
        return this.pending.get(side);
      }
      const image=this[side],src=`assets/district-${side}-fast.webp`;
      image.fetchPriority=priority;image.decoding='async';
      const pending=new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>reject(new Error(`Timed out loading ${src}`)),20000);
        image.onload=async()=>{
          try{
            if(image.decode)await image.decode();
            clearTimeout(timer);this.loaded.add(side);this.revision++;resolve(image);
          }catch(error){clearTimeout(timer);reject(error);}
        };
        image.onerror=()=>{clearTimeout(timer);reject(new Error(`Failed to load ${src}`));};
        image.src=src;
      }).finally(()=>this.pending.delete(side));
      this.pending.set(side,pending);return pending;
    }
    loadRange(min,max){return Promise.all(this.needed(min,max).map(side=>this.loadSide(side)));}
    load(){return Promise.all(['west','east'].map(side=>this.loadSide(side,'low')));}
    prepare(center){
      this.center=document.createElement('canvas');this.center.width=2172;this.center.height=724;
      const c=this.center.getContext('2d');c.drawImage(center,0,0,2172,724);
      c.globalCompositeOperation='destination-out';
      let g=c.createLinearGradient(0,0,100,0);g.addColorStop(0,'#000');g.addColorStop(1,'#0000');c.fillStyle=g;c.fillRect(0,0,100,724);
      g=c.createLinearGradient(2072,0,2172,0);g.addColorStop(0,'#0000');g.addColorStop(1,'#000');c.fillStyle=g;c.fillRect(2072,0,100,724);
      this.ready=true;
    }
    draw(ctx,original,min,max){
      // Overlap only the edge strips so street level stays continuous.
      if(min<100&&this.west.complete&&this.west.naturalWidth)ctx.drawImage(this.west,-2172,0,2272,724);
      if(max>2072&&this.east.complete&&this.east.naturalWidth)ctx.drawImage(this.east,2072,0,2272,724);
      if(max>0&&min<2172)ctx.drawImage(this.center||original,0,0,2172,724);
    }
    furniture(ctx,original,min,max){
      // These masks belong between shop occupants and the street traffic.
      const strips=[[531,300,338,40],[1816,432,165,34],
        [119,439,115,8],[279,441,98,9],[585,440,107,9],[753,442,68,8]];
      ctx.save();ctx.globalAlpha=1;
      for(const [x,y,w,h] of strips)if(x+w>min&&x<max)ctx.drawImage(original,x,y,w,h,x,y,w,h);
      ctx.restore();
    }
    foreground(ctx,original,min,max){
      // Mooring posts are in front of the narrow lane outside the pavilion.
      // Clip their silhouettes, leaving the open street and bodies untouched.
      if(min<1995&&max>1841){
        ctx.save();ctx.globalAlpha=1;ctx.beginPath();
        for(const ring of window.ScrollWorld.pavilionGeometry.posts){
          ring.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
        }
        ctx.clip();ctx.drawImage(original,0,0);ctx.restore();
      }
      // The watermill is in front of the back lane, including its walkers.
      if(min<-1370&&max>-1785&&this.west.complete&&this.west.naturalWidth){
        ctx.save();ctx.translate(-2172,0);ctx.scale(2272/2172,1);ctx.beginPath();
        [[387,417],[498,417],[520,366],[549,348],[605,346],[663,377],[679,451],[746,457],[756,544],[373,547],[376,491]].forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
        ctx.closePath();ctx.clip();ctx.drawImage(this.west,0,0,2172,724);ctx.restore();
      }
    }
    animate(ctx,time,min,max,enhancedWater=false){
      // Separate wheel boards and spokes rotate inside a fixed perspective ellipse.
      const origin=-2172,stretch=2272/2172,cx=origin+569*stretch,cy=445,rx=48*stretch,ry=88;
      if(cx+rx>min&&cx-rx<max&&this.west.complete&&this.west.naturalWidth){
        ctx.save();ctx.translate(cx,cy);
        const point=(r,a)=>[Math.cos(a)*rx*r,Math.sin(a)*ry*r];
        ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);ctx.fillStyle='#645d49';ctx.fill();
        ctx.save();ctx.clip();
        ctx.globalAlpha=.35;ctx.drawImage(this.west,432,330,78,123,-rx,-ry,rx*2,ry*2);ctx.restore();
        for(let j=0;j<42;j++){
          const yy=-ry+j*ry/21,half=rx*Math.sqrt(Math.max(0,1-(yy/ry)**2));
          ctx.beginPath();ctx.moveTo(-half,yy);ctx.lineTo(half,yy+Math.sin(j)*1.5);ctx.strokeStyle=j%2?'#504d3b55':'#a2957040';ctx.lineWidth=.55;ctx.stroke();
        }
        ctx.strokeStyle='#605840';ctx.lineWidth=1;ctx.stroke();
        for(let i=0;i<16;i++){
          const a=time*.13+i*Math.PI/8;
          ctx.beginPath();[point(.79,a-.085),point(.98,a-.085),point(.98,a+.085),point(.79,a+.085)].forEach((p,j)=>j?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();
          ctx.fillStyle=i%2?'#b1a17b':'#a79771';ctx.fill();ctx.strokeStyle='#645c44';ctx.lineWidth=.65;ctx.stroke();
          ctx.beginPath();ctx.moveTo(...point(.82,a-.025));ctx.lineTo(...point(.95,a+.015));ctx.strokeStyle='#807452';ctx.lineWidth=.5;ctx.stroke();
        }
        for(let i=0;i<12;i++){
          const a=time*.13+i*Math.PI/6;
          ctx.beginPath();[point(.12,a-.19),point(.84,a-.048),point(.84,a+.048),point(.12,a+.19)].forEach((p,j)=>j?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();
          ctx.fillStyle='#b0a17a';ctx.fill();ctx.strokeStyle='#514b38';ctx.lineWidth=.85;ctx.stroke();
          for(let grain=0;grain<3;grain++){const shift=(grain-1)*.018;ctx.beginPath();ctx.moveTo(...point(.19,a+shift));ctx.lineTo(...point(.79,a+shift*.65));ctx.strokeStyle=grain%2?'#746949':'#cec096';ctx.lineWidth=.45;ctx.stroke();}
          ctx.beginPath();ctx.moveTo(...point(.15,a));ctx.lineTo(...point(.79,a));ctx.strokeStyle='#d0bd92';ctx.lineWidth=.6;ctx.stroke();
        }
        for(const r of [.80,.99]){ctx.beginPath();ctx.ellipse(0,0,rx*r,ry*r,0,0,Math.PI*2);ctx.strokeStyle='#c0ad83';ctx.lineWidth=1.3;ctx.stroke();}
        ctx.beginPath();ctx.ellipse(0,0,5,9,0,0,Math.PI*2);ctx.fillStyle='#a39572';ctx.fill();ctx.strokeStyle='#60563e';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();ctx.ellipse(0,0,2,3.5,0,0,Math.PI*2);ctx.fillStyle='#696148';ctx.fill();ctx.restore();
        if(!enhancedWater){
        // Water gathers in the timber race, accelerates into a continuous
        // sheet, then breaks into foam where it meets the river.
        const fallX=origin+638*stretch,top=347,bottom=548,wobble=Math.sin(time*.72)*2.2;
        ctx.save();
        const wash=ctx.createLinearGradient(0,top,0,bottom);
        wash.addColorStop(0,'rgba(190,194,176,.11)');wash.addColorStop(.42,'rgba(216,217,198,.22)');wash.addColorStop(1,'rgba(229,226,205,.08)');
        ctx.beginPath();ctx.moveTo(fallX-21,top);
        ctx.bezierCurveTo(fallX-19+wobble,397,fallX-25-wobble,474,fallX-18,536);
        ctx.quadraticCurveTo(fallX,550,fallX+22,536);
        ctx.bezierCurveTo(fallX+16-wobble,470,fallX+22+wobble,398,fallX+20,top);
        ctx.closePath();ctx.fillStyle=wash;ctx.fill();
        ctx.lineCap='round';
        for(const strand of window.ScrollWater.waterfallStrands(time)){
          const x=fallX+strand.x;
          ctx.globalAlpha=strand.alpha;ctx.strokeStyle=strand.phase>.58?'#ece7cc':'#cbd0bd';ctx.lineWidth=strand.width;
          ctx.beginPath();ctx.moveTo(x,top+strand.phase*7);
          ctx.bezierCurveTo(x+strand.sway,403,x-strand.sway*.7,475,x+strand.sway*.35,bottom-5);ctx.stroke();
          const dropY=top+18+strand.phase*176;
          ctx.globalAlpha=strand.alpha*.75;ctx.beginPath();ctx.moveTo(x+strand.sway*.35,dropY);ctx.lineTo(x+strand.sway*.6,dropY+7+strand.phase*7);ctx.stroke();
        }
        // Dense white turbulence directly under the fall, with darker rings
        // beneath it so the foam still belongs to the ink-painted river.
        for(let i=0;i<9;i++){
          const phase=(time*.31+i*.137)%1,spread=9+i*4.2+phase*7;
          ctx.globalAlpha=.18*(1-phase);ctx.strokeStyle=i%3?'#e6e0c3':'#68705b';ctx.lineWidth=i%3?.8:.55;
          ctx.beginPath();ctx.ellipse(fallX+Math.sin(i*2.7)*8,bottom+i*.7,spread,2.2+phase*2.6,0,Math.PI*1.06,Math.PI*1.94);ctx.stroke();
        }
        for(let i=0;i<10;i++){
          const phase=(time*.56+i*.193)%1,x=fallX-24+phase*51+Math.sin(i)*5,y=bottom-3-Math.sin(phase*Math.PI)*(4+i%3*2);
          ctx.globalAlpha=.12+.16*(1-phase);ctx.fillStyle='#e9e4ca';ctx.beginPath();ctx.ellipse(x,y,.55+(i%3)*.18,.38+(i%2)*.18,0,0,Math.PI*2);ctx.fill();
        }
        ctx.restore();
        }
      }
      // The weaving shuttle moves across the loom and the kiln vents heat.
      const loom=-920;
      if(loom>min-80&&loom<max+80){
        ctx.save();ctx.strokeStyle='#736951';ctx.lineWidth=.8;const shuttle=loom+Math.sin(time*1.6)*24;
        ctx.beginPath();ctx.moveTo(shuttle-5,448);ctx.lineTo(shuttle+5,448);ctx.stroke();ctx.restore();
      }
    }
  }
  window.Districts=Districts;
})();
