(function(root,factory){
  const featured=factory();
  if(typeof module==='object'&&module.exports)module.exports=featured;
  else root.ScrollFeatured=featured;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  // Keep the protagonist inside the same 61–66 unit adult band as nearby
  // residents. His broader robe and carrying frame otherwise read oversized.
  const heroHeight=63;
  const boat={width:172,height:52,left:-86,top:-43,deckY:-10,crewX:-64,crewHeight:51};
  const definitions={
    painter:{side:0,grips:[[.468,.498]]},
    boatman:{side:1,grips:[[.906,.324],[.890,.451]]}
  };
  function poleThrough(hands,waterY=25){
    const [upper,lower]=[...hands].sort((a,b)=>a.y-b.y);
    const slope=(lower.x-upper.x)/Math.max(1,lower.y-upper.y);
    const at=y=>({x:upper.x+(y-upper.y)*slope,y});
    return {top:at(upper.y-10),tip:at(waterY)};
  }
  class Characters{
    constructor(){
      this.ready=false;this.sprites={};this.image=new Image();
      this.assetsReady=new Promise((resolve,reject)=>{
        this.image.onload=()=>{try{this.prepare();this.ready=true;resolve();}catch(error){reject(error);}};
        this.image.onerror=()=>reject(new Error('画师素材加载失败'));
      });
      this.assetsReady.catch(()=>{});
      this.image.src='assets/featured-characters-v7.webp';
    }
    prepare(){
      const image=this.image,w=image.naturalWidth,h=image.naturalHeight;
      const matte=document.createElement('canvas');matte.width=w;matte.height=h;
      const ctx=matte.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
      const pixels=ctx.getImageData(0,0,w,h),data=pixels.data;
      // Use the same exterior matte and edge decontamination as the crowd.
      window.Inhabitants.prototype.removePaper(pixels);
      ctx.putImageData(pixels,0,0);
      for(const [name,definition] of Object.entries(definitions)){
        let left=w,top=h,right=0,bottom=0;
        const start=definition.side*w/2,end=start+w/2;
        for(let y=0;y<h;y++)for(let x=start;x<end;x++)if(data[(y*w+x)*4+3]>96){
          left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
        }
        const texture=document.createElement('canvas');texture.width=right-left+1;texture.height=bottom-top+1;
        const c=texture.getContext('2d');c.drawImage(matte,left,top,texture.width,texture.height,0,0,texture.width,texture.height);
        c.globalCompositeOperation='multiply';c.fillStyle='#eee3cd';c.fillRect(0,0,texture.width,texture.height);
        c.globalCompositeOperation='destination-in';c.drawImage(matte,left,top,texture.width,texture.height,0,0,texture.width,texture.height);
        const frame={x:0,y:0,w:texture.width,h:texture.height};
        const grips=definition.grips.map(([x,y])=>[(x*w-left)/frame.w,(y*h-top)/frame.h]);
        const contacts=window.ScrollMovement.footContacts(c.getImageData(0,0,frame.w,frame.h).data,frame.w,frame.h);
        this.sprites[name]={texture,frame,grips,contacts,direction:1};
      }
    }
  }
  return {Characters,heroHeight,boat,poleThrough};
});
