/* Reuse the original painted residents and their animation/occlusion system. */
(() => {
  let ready;
  window.createTimeLensResidents=()=>{
    if(ready)return ready;
    ready=(async()=>{
      await window.loadQingmingScene();
      const {inhabitants,characters}=window.QingmingFestivalActors;
      await Promise.all([inhabitants.assetsReady,characters.assetsReady]);
      const districts=new window.Districts(),world=window.ScrollWorld,movement=window.ScrollMovement;
      const boat=new Image();
      await new Promise((resolve,reject)=>{boat.onload=resolve;boat.onerror=()=>reject(Error('Boat image unavailable'));boat.src='assets/boat.webp';});
      await districts.load();
      const modernImage=new Image();
      await new Promise((resolve,reject)=>{modernImage.onload=resolve;modernImage.onerror=()=>reject(Error('Modern pedestrians unavailable'));modernImage.src='assets/time-lens/modern-walkers-v1.png';});
      const modernSprites=Array.from({length:4},(_,index)=>{
        const width=Math.floor(modernImage.naturalWidth/4),height=modernImage.naturalHeight;
        const cell=document.createElement('canvas');cell.width=width;cell.height=height;
        const c=cell.getContext('2d',{willReadFrequently:true});c.drawImage(modernImage,index*width,0,width,height,0,0,width,height);
        const pixels=c.getImageData(0,0,width,height);let left=width,right=0,top=height,bottom=0;
        for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(pixels.data[(y*width+x)*4+3]>96){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
        const texture=document.createElement('canvas');texture.width=right-left+1;texture.height=bottom-top+1;
        const tc=texture.getContext('2d',{willReadFrequently:true});tc.drawImage(cell,left,top,texture.width,texture.height,0,0,texture.width,texture.height);
        return {texture,frame:{x:0,y:0,w:texture.width,h:texture.height},direction:1,stride:.27,grips:[[.65,.48]],contacts:movement.footContacts(tc.getImageData(0,0,texture.width,texture.height).data,texture.width,texture.height)};
      });
      const vessel=window.ScrollFeatured.boat;
      return {
        drawModern(ctx,time,range=[0,2172]){
          let visible=0;
          for(let i=0;i<22;i++){
            const direction=i%3===0?-1:1,speed=8+i%5;
            const x=-2172+(((i*307+time*speed*direction)%6516)+6516)%6516;
            if(x<range[0]-60||x>range[1]+60)continue;
            const lane=(i%3-1)*4,ground=n=>window.TimeLensBridge.ground(n)+lane;
            const phase=time*speed*.15+i*3;
            inhabitants.sprite(ctx,{p:{art:modernSprites[i%4],h:50+i%5*2},x,y:ground(x),walking:true,direction,ground,pose:{phase,gaitWeight:1,handX:Math.sin(time*3+i)*1.1,handY:0,lean:.01,sway:Math.sin(time*3+i)*.12}},time);visible++;
          }
          return visible;
        },
        draw(ctx,time,art,range=[0,2172]){
          inhabitants.season='spring';inhabitants.raining=false;
          const [min,max]=range;
          ctx.save();ctx.globalAlpha=.94;inhabitants.motionDensity=2;
          inhabitants.draw(ctx,time,range,world.streetY,world.pedestrianAt,()=>{},()=>districts.furniture(ctx,art,min,max));
          const hero={art:(characters.springSprites??characters.sprites).painter,h:window.ScrollFeatured.heroHeight};
          inhabitants.sprite(ctx,{p:hero,x:1035,y:world.streetY(1035),pose:movement.activityAt('look',time,0,6),walking:false,direction:1,ground:world.streetY},time);
          window.BridgeRailing.draw(ctx,art,min,max);districts.foreground(ctx,art,min,max);
          ctx.translate(690,589+Math.sin(time*.7)*.6);ctx.scale(1.2,1.2);
          ctx.drawImage(boat,40,150,2100,425,vessel.left,vessel.top,vessel.width,vessel.height);
          const crew=inhabitants.sprite(ctx,{p:{art:(characters.springSprites??characters.sprites).boatman,h:vessel.crewHeight},x:vessel.crewX,y:vessel.deckY,pose:movement.activityAt('row',time,0,3.6),walking:false,direction:1},time);
          const pole=window.ScrollFeatured.poleThrough(crew.hands);ctx.strokeStyle='#65563d';ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(pole.top.x,pole.top.y);ctx.lineTo(pole.tip.x,pole.tip.y);ctx.stroke();ctx.restore();
          return inhabitants.visible+2;
        }
      };
    })().catch(error=>{ready=null;throw error;});
    return ready;
  };
})();
