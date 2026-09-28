(() => {
  'use strict';
  class Painter {
    constructor(canvas,project,onFrame){
      this.canvas=canvas;this.ctx=canvas.getContext('2d');this.project=project;this.onFrame=onFrame;
      this.x=.17;this.y=.79;this.phase=0;this.sitting=false;this.moving=false;this.generation=0;this.weight=0;this.facing=1;this.seatBlend=0;
      this.renderer=Object.create(window.Inhabitants.prototype);
      this.renderer.motionDensity=12;
      this.renderer.motionSurface=document.createElement('canvas');this.renderer.motionSurface.width=512;this.renderer.motionSurface.height=384;
      this.renderer.motionContext=this.renderer.motionSurface.getContext('2d');
      this.renderer.residentFrames=new Map();
      this.ready=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{this.extract(image);this.draw();resolve();};image.onerror=reject;image.src='assets/painter-hd-v1.webp';});
      this.ready.catch(()=>{canvas.hidden=true;});
    }
    extract(image){
      const cell=image.naturalWidth/3,h=image.naturalHeight;
      this.frames=[];
      for(let n=0;n<3;n++){
        const raw=document.createElement('canvas');raw.width=cell;raw.height=h;const rc=raw.getContext('2d',{willReadFrequently:true});rc.drawImage(image,-n*cell,0);
        const pixels=rc.getImageData(0,0,cell,h);let l=cell,r=0,t=h,b=0;
        for(let y=0;y<h;y++)for(let x=0;x<cell;x++)if(pixels.data[(y*cell+x)*4+3]>96){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
        const texture=document.createElement('canvas');texture.width=r-l+1;texture.height=b-t+1;
        const c=texture.getContext('2d');c.drawImage(raw,l,t,texture.width,texture.height,0,0,texture.width,texture.height);
        this.frames.push({texture,frame:{w:texture.width,h:texture.height},contacts:ScrollMovement.footContacts(c.getImageData(0,0,texture.width,texture.height).data,texture.width,texture.height),grips:[[.65,.45]],direction:1,stride:.29,legKnees:n===1?[.29,.73]:undefined});
      }
    }
    get height(){return .285+(this.y-.76)*.55;}
    get headHeight(){return this.height*(1-this.seatBlend*.24);}
    position(){
      const [x,y]=this.project([this.x,this.y]),[a,b]=this.project([0,0]),[c,d]=this.project([0,this.height]);
      const scale=(d-b)/252;
      Object.assign(this.canvas.style,{left:`${x}px`,top:`${y}px`,width:`${400*scale}px`,height:`${352*scale}px`});
      this.onFrame?.();
    }
    draw(){
      this.position();if(!this.frames)return;
      const ratio=Math.min(3,Math.max(2,window.devicePixelRatio||1));
      if(this.canvas.width!==400*ratio){this.canvas.width=400*ratio;this.canvas.height=352*ratio;}
      const c=this.ctx;c.setTransform(ratio,0,0,ratio,0,0);c.clearRect(0,0,400,352);c.imageSmoothingQuality='high';
      if(this.seatBlend>0){
        c.globalAlpha=this.seatBlend;
        const frame=this.frames[2],ratio=252/this.frames[0].frame.h;
        c.drawImage(frame.texture,200-frame.frame.w*ratio/2,340-frame.frame.h*ratio,frame.frame.w*ratio,frame.frame.h*ratio);
      }
      if(this.seatBlend<1){
        c.globalAlpha=1-this.seatBlend;
        c.save();c.translate(200,340);c.scale(this.facing,1);
        const art=this.frames[0],tw=art.frame.w,th=art.frame.h,scale=252/th;
        if(!this.moving){c.drawImage(art.texture,-tw*scale/2,-252,tw*scale,252);}
        else{
          // The intact painted silhouette sways gently, like the attendant.
          // No separated thigh/shin meshes or forced anatomical stride.
          const beat=this.phase*2.2,weight=this.weight;
          const point=(u,v)=>{
            const lower=Math.max(0,(v-.68)/.32),side=u<.5?-1:1;
            return {source:[u*tw,v*th],target:[(u-.5)*tw*scale+Math.sin(beat)*2.8*lower*side*weight,(v-1)*252-Math.max(0,Math.sin(beat)*side)*1.8*lower*weight-Math.abs(Math.sin(beat))*1.1*(1-lower)*weight]};
          };
          const cols=8,rows=18;
          const points=Array.from({length:rows+1},(_,y)=>Array.from({length:cols+1},(_,x)=>point(x/cols,y/rows)));
          for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
            const a=points[j][i],b=points[j][i+1],d=points[j+1][i],e=points[j+1][i+1];
            this.renderer.cell(c,art.texture,a,b,d,e);
          }
        }
        c.restore();
      }
      c.globalAlpha=1;
    }
    cancel(){this.generation++;this.finish?.(false);this.finish=null;this.moving=false;document.body.dataset.actorMoving='false';}
    reset(){this.cancel();this.x=.17;this.y=.79;this.sitting=false;this.phase=0;this.weight=0;this.seatBlend=0;this.facing=1;this.draw();}
    async move(x,y,sit=false){
      this.cancel();const token=this.generation;this.sitting=false;this.seatBlend=0;
      try{await this.ready;}catch{this.x=x;this.y=y;this.sitting=sit;this.draw();return true;}
      if(token!==this.generation)return false;
      const sx=this.x,sy=this.y,dx=x-sx,dy=y-sy,distance=Math.hypot(dx*1536,dy*1024);
      this.facing=dx<-.001?-1:1;
      const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.max(800,distance/85*1000);
      this.moving=duration>0;document.body.dataset.actorMoving=String(this.moving);
      return new Promise(resolve=>{
        this.finish=resolve;let start=null,last=0;
        const finish=()=>{this.moving=false;document.body.dataset.actorMoving='false';this.finish=null;this.draw();resolve(true);};
        const tick=time=>{
          if(token!==this.generation)return;
          if(start===null)start=time;
          const t=duration?Math.min(1,(time-start)/duration):1,u=t<.16?t*t/(2*.16*(1-.16)):t>.84?1-(1-t)*(1-t)/(2*.16*(1-.16)):(t-.08)/.84;
          this.x=sx+dx*u;this.y=sy+dy*u;this.phase+=(u-last)*distance/(this.height*1024/63)*.15;last=u;this.weight=Math.min(1,t*8,(1-t)*8);
          if(t===1){
            this.weight=0;this.sitting=sit;
            if(sit&&duration){
              const began=time;
              const settle=now=>{if(token!==this.generation)return;const a=Math.min(1,(now-began)/380);this.seatBlend=a*a*(3-2*a);this.draw();if(a<1)requestAnimationFrame(settle);else finish();};
              requestAnimationFrame(settle);return;
            }
            this.seatBlend=sit?1:0;finish();return;
          }
          this.draw();requestAnimationFrame(tick);

        };requestAnimationFrame(tick);
      });
    }
  }
  window.SunyangPainter=Painter;
})();
