(() => {
  'use strict';
  // A true alpha cutout over a clean room plate. Only the figure moves.
  class Host {
    constructor(canvas,image,project){
      this.canvas=canvas;this.project=project;this.x=144;this.y=477;this.w=180;this.h=310;
      canvas.width=this.w*3;canvas.height=this.h*3;this.ctx=canvas.getContext('2d');
      this.renderer=Object.create(Inhabitants.prototype);this.amount=0;this.ticket=0;this.walkTicket=0;this.step=0;this.walking=false;
      const art=new Image();
      art.onload=()=>{
        const raw=document.createElement('canvas');raw.width=art.naturalWidth;raw.height=art.naturalHeight;
        const rc=raw.getContext('2d',{willReadFrequently:true});rc.drawImage(art,0,0);
        const {data}=rc.getImageData(0,0,raw.width,raw.height);let l=raw.width,t=raw.height,r=0,b=0;
        for(let y=0;y<raw.height;y++)for(let x=0;x<raw.width;x++)if(data[(y*raw.width+x)*4+3]>96){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}
        this.texture=document.createElement('canvas');this.texture.width=r-l+1;this.texture.height=b-t+1;
        this.texture.getContext('2d').drawImage(art,l,t,r-l+1,b-t+1,0,0,r-l+1,b-t+1);
        this.ready=true;this.draw();
      };
      art.src='assets/sunyang-host-v2.webp';
    }
    get head(){return [(this.x+66)/1536,(this.y+6)/1024];}
    cancelWalk(){this.walkTicket++;this.walking=false;this.walkDone?.(false);this.walkDone=null;}
    reset(){this.cancelWalk();this.x=144;this.y=477;this.step=0;this.stop();}
    async approach(seat){
      const target=seat==='hall'?[945,470]:[535,452];
      if(Math.hypot(this.x-target[0],this.y-target[1])<1)return true;
      this.cancelWalk();this.stop();const token=this.walkTicket;
      const path=[[this.x,this.y],[this.x,535],[target[0],535],target];
      const lengths=path.slice(1).map((p,i)=>Math.hypot(p[0]-path[i][0],p[1]-path[i][1]));
      const total=lengths.reduce((a,b)=>a+b,0),duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:total/170*1000;
      this.walking=duration>0;
      return new Promise(resolve=>{
        this.walkDone=resolve;let start=null;
        const tick=now=>{
          if(token!==this.walkTicket)return;if(start===null)start=now;
          const t=duration?Math.min(1,(now-start)/duration):1;
          let distance=total*(t*t*(3-2*t));this.step=distance/42;
          for(let i=0;i<lengths.length;i++){
            if(distance<=lengths[i]||i===lengths.length-1){const u=lengths[i]?Math.min(1,distance/lengths[i]):1;this.x=path[i][0]+(path[i+1][0]-path[i][0])*u;this.y=path[i][1]+(path[i+1][1]-path[i][1])*u;break;}distance-=lengths[i];
          }
          if(t===1){this.walking=false;this.walkDone=null;this.draw();resolve(true);}else{this.draw();requestAnimationFrame(tick);}
        };requestAnimationFrame(tick);
      });
    }
    position(){const [x,y]=this.project([this.x/1536,this.y/1024]),[r,b]=this.project([(this.x+this.w)/1536,(this.y+this.h)/1024]);Object.assign(this.canvas.style,{left:`${x}px`,top:`${y}px`,width:`${r-x}px`,height:`${b-y}px`});}
    draw(){
      this.position();if(!this.ready)return;
      const c=this.ctx;c.setTransform(3,0,0,3,0,0);c.clearRect(0,0,this.w,this.h);c.imageSmoothingQuality='high';
      const tw=this.texture.width,th=this.texture.height,scale=297/th;
      const point=(u,v)=>{
        let x=u*tw*scale+8,y=v*297+6;
        // Smooth shoulder-to-fingertip weighting; apron, legs and soles stay put.
        const arm=Math.exp(-(((v-.34)/.12)**4))*Math.max(0,Math.min(1,(u-.45)/.5));
        const head=Math.exp(-(((u-.39)/.24)**2+((v-.12)/.14)**2));
        x+=this.amount*(5*arm-1.2*head);y+=this.amount*(-12*arm+1.6*head);
        if(this.walking){
          const lower=Math.max(0,(v-.68)/.32),side=u<.35?-1:1;
          x+=Math.sin(this.step)*5*lower*side;
          y-=Math.max(0,Math.sin(this.step)*side)*3*lower;
          y-=Math.abs(Math.sin(this.step))*1.2*(1-lower);
        }
        return {source:[u*tw,v*th],target:[x,y]};
      };
      const cols=14,rows=32;
      const points=Array.from({length:rows+1},(_,y)=>Array.from({length:cols+1},(_,x)=>point(x/cols,y/rows)));
      for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
        const a=points[y][x],b=points[y][x+1],d=points[y+1][x],e=points[y+1][x+1];
        this.renderer.cell(c,this.texture,a,b,d,e);
      }
    }
    stop(){this.ticket++;this.amount=0;this.draw();}
    invite(){
      const token=++this.ticket;if(matchMedia('(prefers-reduced-motion: reduce)').matches){this.amount=0;this.draw();return;}
      const from=this.amount;let start=null;
      const tick=time=>{
        if(token!==this.ticket)return;if(start===null)start=time;
        const t=Math.min(1,(time-start)/2400);
        // Raise, hold briefly, and lower the palm with zero-velocity joins.
        const smooth=x=>x*x*(3-2*x);
        this.amount=t<.4?from+(1-from)*smooth(t/.4):t<.6?1:1-smooth((t-.6)/.4);
        this.draw();if(t<1)requestAnimationFrame(tick);
      };requestAnimationFrame(tick);
    }
  }
  window.SunyangHost=Host;
})();
