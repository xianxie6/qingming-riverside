(() => {
  'use strict';
  const population=window.ScrollPopulation;
  const movement=window.ScrollMovement;
  // One shared GPU mesh surface; immutable painted textures upload only once.
  class PeopleMesh {
    constructor(){
      this.active=false;this.textures=new Map();this.canvas=document.createElement('canvas');
      this.canvas.width=512;this.canvas.height=384;
      try{
        const gl=this.gl=this.canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true,depth:false,stencil:false});
        if(!gl)return;
        const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('Mesh shader');return s;};
        const vertex=shader(gl.VERTEX_SHADER,'attribute vec2 position;attribute vec2 uv;varying vec2 texcoord;void main(){texcoord=uv;gl_Position=vec4(position,0.,1.);}');
        const fragment=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 texcoord;uniform sampler2D image;void main(){gl_FragColor=texture2D(image,texcoord);}');
        const program=this.program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
        gl.deleteShader(vertex);gl.deleteShader(fragment);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Mesh program');
        this.maxSize=gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.position=gl.getAttribLocation(program,'position');this.uv=gl.getAttribLocation(program,'uv');this.buffer=gl.createBuffer();
        this.canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.active=false;});
        this.active=true;
      }catch{this.active=false;}
    }
    beginBatch(items,density){
      if(!this.active||!items.length)return;
      const sizes=items.map(({p})=>{const f=p.art?.frame??window.PEOPLE_FRAMES[p.sprite];return [(p.h*f.w/f.h*([6,7,8].includes(p.sprite)?.80:1)+24)*density,(p.h+16)*density];});
      this.tileWidth=Math.ceil(Math.max(...sizes.map(s=>s[0])));this.tileHeight=Math.ceil(Math.max(...sizes.map(s=>s[1])));
      this.columns=Math.ceil(Math.sqrt(items.length));this.index=0;
      const width=this.tileWidth*this.columns,height=this.tileHeight*Math.ceil(items.length/this.columns);
      if(width>this.maxSize||height>this.maxSize)return;
      if(width>this.canvas.width)this.canvas.width=width;
      if(height>this.canvas.height)this.canvas.height=height;
      this.batching=true;this.gl.clearColor(0,0,0,0);this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    begin(width,height,density,w,h){
      const gl=this.gl;
      if(width>this.canvas.width)this.canvas.width=width;
      if(height>this.canvas.height)this.canvas.height=height;
      this.region=this.batching?{x:this.index%this.columns*this.tileWidth,y:Math.floor(this.index++/this.columns)*this.tileHeight}:{x:0,y:0};
      this.density=density;this.x=w/2+12+this.region.x/density;this.y=h+8+this.region.y/density;
      gl.viewport(0,0,this.canvas.width,this.canvas.height);if(!this.batching){gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);}
      gl.useProgram(this.program);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
      gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
      gl.enableVertexAttribArray(this.position);gl.vertexAttribPointer(this.position,2,gl.FLOAT,false,16,0);
      gl.enableVertexAttribArray(this.uv);gl.vertexAttribPointer(this.uv,2,gl.FLOAT,false,16,8);
    }
    upload(texture){
      const gl=this.gl;let stored=this.textures.get(texture);
      if(!stored){
        if(this.textures.size>=128){const first=this.textures.keys().next().value;gl.deleteTexture(this.textures.get(first));this.textures.delete(first);}
        stored=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,stored);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture);this.textures.set(texture,stored);
      }else gl.bindTexture(gl.TEXTURE_2D,stored);
    }
    draw(texture,points){
      const gl=this.gl;this.upload(texture);
      const count=(points.length-1)*(points[0].length-1)*6;
      this.vertices??=new Float32Array(4096);
      let i=0;const add=p=>{this.vertices[i++]=(p.target[0]+this.x)*this.density/this.canvas.width*2-1;this.vertices[i++]=1-(p.target[1]+this.y)*this.density/this.canvas.height*2;this.vertices[i++]=p.source[0]/texture.width;this.vertices[i++]=p.source[1]/texture.height;};
      for(let r=0;r<points.length-1;r++)for(let c=0;c<points[r].length-1;c++){
        const p=points[r][c],q=points[r][c+1],a=points[r+1][c],b=points[r+1][c+1];add(p);add(q);add(a);add(q);add(b);add(a);
      }
      gl.bufferData(gl.ARRAY_BUFFER,this.vertices.subarray(0,i),gl.STREAM_DRAW);gl.drawArrays(gl.TRIANGLES,0,count);
    }
  }

  class Inhabitants {
    constructor(){
      this.season='spring';this.raining=false;
      this.art=new Image();this.ready=false;this.attention=new Map();this.visible=0;this.phaseSample=0;this.outfits=new Map();this.walkLayers=new WeakMap();this.residentFrames=new Map();this.hits=[];this.storyHands=new Map();
      this.assetsReady=new Promise((resolve,reject)=>{
        this.art.onload=async()=>{try{await this.prepare();this.ready=true;resolve();}catch(error){reject(error);}};
        this.art.onerror=()=>reject(new Error('人物素材加载失败'));
      });
      // The scene observes this promise once its own artwork finishes loading.
      this.assetsReady.catch(()=>{});
      this.art.src='assets/people-ink.webp';
    }
    async prepare(){
      let sliceStart=performance.now();
      const yieldToBrowser=async()=>{
        if(performance.now()-sliceStart<8)return;
        await new Promise(resolve=>setTimeout(resolve,0));sliceStart=performance.now();
      };
      this.frames=await this.prepareFrames(this.art);
      this.contacts=this.frames.map(c=>movement.footContacts(c.getContext('2d').getImageData(0,0,c.width,c.height).data,c.width,c.height));
      this.motionSurface=document.createElement('canvas');this.motionSurface.width=512;this.motionSurface.height=384;
      // Animation surfaces are draw-only: let the browser accelerate their
      // mesh clips and composites. Pixel extraction above stays CPU-backed.
      this.motionContext=this.motionSurface.getContext('2d');this.mesh=new PeopleMesh();
      for(const p of [...population.residents,...population.walkers]){
        const texture=this.textureFor(p);
        if(this.mesh.active&&p.id.startsWith('walker-')){
          const layers=[0,1,2,4,5,9,10,11].includes(p.sprite)?this.robeLayers(texture,p.sprite,window.PEOPLE_FRAMES[p.sprite]):[texture];
          for(const layer of layers)this.mesh.upload(layer);
        }
        await yieldToBrowser();
      }
    }
    async prepareFrames(image){
      let sliceStart=performance.now();
      const yieldToBrowser=async()=>{
        if(performance.now()-sliceStart<8)return;
        await new Promise(resolve=>setTimeout(resolve,0));sliceStart=performance.now();
      };
      const frames=[];
      for(const f of window.PEOPLE_FRAMES){
        const canvas=document.createElement('canvas');canvas.width=f.w;canvas.height=f.h;
        const c=canvas.getContext('2d',{willReadFrequently:true});
        c.drawImage(image,f.x,f.y,f.w,f.h,0,0,f.w,f.h);
        // Extract the actual ink contour. Coarse polygons left white wedges
        // around hair and bowls and shaved off ribbons and fingertips.
        const pixels=c.getImageData(0,0,f.w,f.h);
        this.removePaper(pixels);
        c.putImageData(pixels,0,0);
        c.globalCompositeOperation='source-atop';c.fillStyle='rgba(125,101,55,.13)';c.fillRect(0,0,f.w,f.h);
        frames.push(canvas);
        await yieldToBrowser();
      }
      return frames;
    }
    async loadWardrobe(source){
      const image=await new Promise((resolve,reject)=>{
        const image=new Image(),timer=setTimeout(()=>reject(new Error('冬装素材载入超时')),25000);
        image.onload=()=>{clearTimeout(timer);resolve(image);};
        image.onerror=()=>{clearTimeout(timer);reject(new Error('冬装素材载入失败'));};
        image.src=source;
      });
      await image.decode();
      if(image.naturalWidth!==1536||image.naturalHeight!==1024)throw new Error('冬装人物图集尺寸不正确');
      const frames=await this.prepareFrames(image);
      const contacts=frames.map(c=>movement.footContacts(c.getContext('2d').getImageData(0,0,c.width,c.height).data,c.width,c.height));
      return {frames,contacts};
    }
    removePaper({data,width,height}){
      const count=width*height,background=new Uint8Array(count),queue=new Int32Array(count);
      let head=0,tail=0;
      const paper=i=>{const k=i*4,r=data[k],g=data[k+1],b=data[k+2];return data[k+3]<24||(Math.min(r,g,b)>220&&Math.max(r,g,b)-Math.min(r,g,b)<25);};
      const visit=i=>{if(!background[i]&&paper(i)){background[i]=1;queue[tail++]=i;}};
      for(let x=0;x<width;x++){visit(x);visit((height-1)*width+x);}
      for(let y=0;y<height;y++){visit(y*width);visit(y*width+width-1);}
      while(head<tail){const i=queue[head++],x=i%width;
        if(x)visit(i-1);if(x<width-1)visit(i+1);if(i>=width)visit(i-width);if(i<count-width)visit(i+width);
      }
      // Remove white matte contamination only on the exterior contour;
      // light garments and porcelain inside the figure remain opaque.
      for(let i=0;i<count;i++){
        const k=i*4;if(background[i]){data[k+3]=0;continue;}
        const x=i%width,edge=(x&&background[i-1])||(x<width-1&&background[i+1])||(i>=width&&background[i-width])||(i<count-width&&background[i+width]);
        if(!edge)continue;
        const low=Math.min(data[k],data[k+1],data[k+2]),high=Math.max(data[k],data[k+1],data[k+2]);
        if(low<145||high-low>45)continue;
        const alpha=Math.max(.12,Math.min(1,(255-low)/110));
        for(let c=0;c<3;c++)data[k+c]=Math.max(0,255+(data[k+c]-255)/alpha);
        data[k+3]=Math.round(data[k+3]*alpha);
      }
    }
    seat(ctx,p,x,y){
      if(![6,7,8].includes(p.sprite)||p.layer!=='street')return;
      const ground=477,half=p.h*.19,top=y-2;
      ctx.save();ctx.lineJoin='round';ctx.strokeStyle='#655a40';ctx.lineWidth=.85;
      ctx.fillStyle='#8d7b57';
      for(const side of [-1,1]){
        const sx=x+side*half*.76;
        ctx.beginPath();ctx.moveTo(sx-1,top);ctx.lineTo(sx+1,top);ctx.lineTo(sx+side*1.5+1,ground);ctx.lineTo(sx+side*1.5-1,ground);ctx.closePath();ctx.fill();ctx.stroke();
      }
      ctx.beginPath();ctx.moveTo(x-half*.8,ground-5);ctx.lineTo(x+half*.8,ground-5);ctx.stroke();
      ctx.fillStyle='#a08b62';ctx.beginPath();ctx.moveTo(x-half,top-1);ctx.lineTo(x+half,top-1);ctx.lineTo(x+half+1,top+2);ctx.lineTo(x-half-1,top+2);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.restore();
    }
    textureFor(p){
      // The complete winter paintings include covered sleeves, legs and shoes.
      // Do not reapply spring clothing masks or restore exposed spring skin.
      if(this.activeWardrobe)return this.activeWardrobe.frames[p.sprite];
      const mode=window.QingmingSeasons?.outfit(this.season,p,this.raining)??'spring';
      const key=`${p.sprite}:${p.outfit}:${mode}`;
      if(this.outfits.has(key))return this.outfits.get(key);
      const base=this.frames[p.sprite],f=window.PEOPLE_FRAMES[p.sprite];
      const wardrobe=window.ScrollWardrobe,garment=wardrobe.garments[p.sprite],palette=wardrobe.palettes[p.outfit];
      const texture=document.createElement('canvas');texture.width=base.width;texture.height=base.height;
      const c=texture.getContext('2d');c.drawImage(base,0,0);c.save();c.translate(-f.x,-f.y);
      for(const part of ['upper','lower']){
        c.beginPath();garment[part].forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();
        c.globalCompositeOperation='color';c.fillStyle=palette[part];c.globalAlpha=1;c.fill();
        c.globalCompositeOperation='multiply';c.globalAlpha=.12;c.fill();
      }
      window.QingmingSeasons?.dress(c,f,garment,wardrobe.protectedParts[p.sprite][0],mode);
      c.save();c.beginPath();
      for(const [x,y,rx,ry] of wardrobe.protectedParts[p.sprite]){c.moveTo(x+rx,y);c.ellipse(x,y,rx,ry,0,0,Math.PI*2);}
      c.clip();c.globalCompositeOperation='source-over';c.globalAlpha=1;c.drawImage(base,f.x,f.y);c.restore();
      c.restore();c.globalCompositeOperation='destination-in';c.drawImage(base,0,0);
      this.outfits.set(key,texture);return texture;
    }
    robeLayers(texture,sprite,f){
      if(this.walkLayers.has(texture))return this.walkLayers.get(texture);
      const mask=document.createElement('canvas');mask.width=f.w;mask.height=f.h;
      const c=mask.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,f.w,f.h*.71);
      c.beginPath();
      window.ScrollWardrobe.garments[sprite].lower.forEach(([x,y],i)=>i?c.lineTo(x-f.x,y-f.y):c.moveTo(x-f.x,y-f.y));
      c.closePath();c.fill();c.strokeStyle='#fff';c.lineWidth=1;c.stroke();
      const layers=['destination-in','destination-out'].map(operation=>{
        const canvas=document.createElement('canvas');canvas.width=f.w;canvas.height=f.h;
        const ctx=canvas.getContext('2d');ctx.drawImage(texture,0,0);
        ctx.globalCompositeOperation=operation;
        ctx.drawImage(mask,0,0);
        // Discard residual garment-edge ink; it must not travel with a foot.
        if(operation==='destination-out')ctx.clearRect(0,0,f.w,f.h*([.895,.895,.95,.75,.93,.91,0,0,0,.94,.75,.80][sprite]??.90));
        return canvas;
      });
      // The source painting only contains the portions visible below the
      // robe. Reconstruct the hidden stocking behind that ink BEFORE
      // skinning, so a moving shoe always has a leg reaching into the robe.
      const legs=layers[1],lc=legs.getContext('2d');
      const contacts=(this.activeWardrobe?.contacts??this.contacts)[sprite],pixels=texture.getContext('2d').getImageData(0,0,f.w,f.h).data;
      lc.globalCompositeOperation='destination-over';lc.lineJoin='round';
      for(const contact of contacts){
        const center=(contacts[0].x+contacts[1].x)/2;
        const ankleY=contact.y-f.h*.035,hipX=center+(contact.x-center)*.25;
        // Sample the original ankle wash rather than recoloring shoes or
        // copying robe fragments into the moving lower leg.
        const samples=[];
        for(let y=Math.floor(ankleY-f.h*.018);y<ankleY+f.h*.012;y++)
          for(let x=Math.floor(contact.x-f.h*.022);x<contact.x+f.h*.022;x++){
            if(x<0||x>=f.w||y<0||y>=f.h)continue;
            const k=(y*f.w+x)*4;
            if(pixels[k+3]>160&&pixels[k]>160&&pixels[k+1]>140&&pixels[k]>=pixels[k+1]&&pixels[k+1]>=pixels[k+2])samples.push([pixels[k],pixels[k+1],pixels[k+2]]);
          }
        samples.sort((a,b)=>a[0]+a[1]+a[2]-b[0]-b[1]-b[2]);
        const color=samples[Math.floor(samples.length*.65)]??[190,174,140];
        const half=f.h*.021;
        lc.beginPath();lc.moveTo(hipX-half*1.25,f.h*.60);
        lc.lineTo(hipX+half*1.25,f.h*.60);
        lc.lineTo(contact.x+half*.65,ankleY+f.h*.014);
        lc.lineTo(contact.x-half*.65,ankleY+f.h*.014);lc.closePath();
        lc.fillStyle=`rgb(${color.join(',')})`;lc.fill();
        lc.strokeStyle='rgba(83,70,47,.65)';lc.lineWidth=f.h*.0025;lc.stroke();
      }
      this.walkLayers.set(texture,layers);return layers;
    }
    react(x,y,time,streetY){
      const p=this.hits.find(hit=>Math.abs(hit.x-x)<20&&y<hit.y+5&&y>hit.y-hit.p.h)?.p;
      if(!p)return false;
      this.attention.set(p.id,time+4);return p;
    }
    draw(ctx,time,range,streetY,walkerAt,fallback,drawFurniture,life=null,afterPerson=null,presence=null){
      this.visible=0;this.hits=[];this.storyHands.clear();
      const residents=[],walkers=[];
      for(const p of population.residents){
        const story=life?.actors[p.x],x=story?.x??p.x;
        if(x<range[0]-60||x>range[1]+60)continue;
        const left=(this.attention.get(p.id)||0)-time;
        if(left<=0)this.attention.delete(p.id);
        const conversation=life&&window.ScrollLife?.conversation(p,time);
        const base=population.residentPose(p,time,left>0?Math.sin(Math.min(left,1)*Math.PI*.5):0);
        const pose={...base,...((p.activity==='talk'||p.activity==='look')?conversation?.pose:{}),...story?.pose};
        if(life&&left>0){
          const elapsed=4-left,envelope=Math.min(1,elapsed*4,left);
          pose.nod+=(Math.sin(elapsed*3.3)*.07)*envelope;
        }
        if(story?.phase!==undefined){pose.phase=story.phase;pose.gaitWeight=story.gaitWeight;}
        const ground=story?.y!==undefined?null:story?.front||p.layer==='bridge'?streetY:null;
        const y=story?.y??(ground?streetY(x):p.y);
        const person=story?{...p,activity:story.activity??p.activity,story:story.story,storyProp:story.prop,originX:p.x}:p;
        const item={p:person,x,y,pose,walking:story?.walking??false,direction:story?.direction??conversation?.direction??p.direction,ground};
        const alpha=presence?.(p,'resident')??1;
        if(alpha>.01)(story?.front?walkers:residents).push({...item,alpha});
        if(alpha>.18)this.hits.push({p,x,y});
      }
      for(const p of population.walkers){
        const pose=walkerAt(p,time);
        if(pose.x<range[0]-65||pose.x>range[1]+65)continue;
        const alpha=presence?.(p,'walker')??1;
        if(alpha>.01)walkers.push({p,x:pose.x,y:streetY(pose.x),pose,walking:pose.moving,direction:pose.direction,ground:streetY,alpha});
      }
      const drawGroup=(items,batch=false)=>{
        if(batch)this.mesh?.beginBatch(items,this.motionDensity??3);
        const composites=[];
        items.sort((a,b)=>a.y-b.y);
        for(const item of items){
          if(item.alpha>.18)this.visible++;
          const fading=item.alpha<.999;
          if(fading){ctx.save();ctx.globalAlpha*=item.alpha;}
          if(this.ready&&window.PEOPLE_FRAMES){const result=this.sprite(ctx,item,time);if(result){this.storyHands.set(item.p.originX??item.p.x,result.hand);if(result.composite){const alpha=ctx.globalAlpha;composites.push(()=>{ctx.save();ctx.globalAlpha=alpha;result.composite();afterPerson?.(item,result);ctx.restore();});}else afterPerson?.(item,result);}}
          else{
            fallback(item.x,item.y,item.p.h/33,item.pose.phase,item.direction,window.ScrollWardrobe?.palettes[item.p.outfit]?.upper||'#8b917c',item.walking);
            afterPerson?.(item,{hand:{x:item.x+item.direction*item.p.h*.1,y:item.y-item.p.h*.48}});
          }
          if(fading)ctx.restore();
        }
        for(const composite of composites)composite();
        if(this.mesh)this.mesh.batching=false;
      };
      // Dining and shop activity is behind the furniture. The public walking
      // lane is in front, even when a passerby shares a diner's foot height.
      drawGroup(residents);
      drawFurniture();
      drawGroup(walkers,true);
      this.phaseSample=Math.sin(time*.81+population.residents[0].phase);
    }
    sprite(ctx,{p,x,y,pose,walking,direction,ground},time){
      if(!walking&&!p.story)this.seat(ctx,p,x,y);
      const art=p.art,f=art?.frame??window.PEOPLE_FRAMES[p.sprite],texture=art?.texture??this.textureFor(p),h=p.h,w=h*f.w/f.h*([6,7,8].includes(p.sprite)?.80:1);
      const natural=art?.direction??[1,1,1,1,1,-1,1,-1,1,-1,1,1][p.sprite];
      const seated=[6,7,8].includes(p.sprite),flip=direction*natural,contacts=art?.contacts??(this.activeWardrobe?.contacts??this.contacts)[p.sprite];
      // The controlled figure keeps the last foot placement on release.
      // Only the lifted sole settles; the legs do not snap to the source pose.
      const animatedGait=!seated&&(walking||pose.gaitWeight!==undefined);
      const longRobe=!art&&[0,1,2,4,5,9,10,11].includes(p.sprite);
      // Narrow robes take smaller steps. Change the distance per cycle too,
      // keeping the support foot planted instead of shrinking its motion.
      const stride=art?.stride??(longRobe?([10,11].includes(p.sprite)?.28:p.sprite===4?.17:.21):.32);
      const footCenter=((contacts[0].x+contacts[1].x)/(2*f.w)-.5)*w;
      const feet=(animatedGait?movement.gaitAt((pose.phase||0)/.15,h,pose.gaitWeight??1,stride).map(foot=>({...foot,x:footCenter+foot.x*natural})):contacts.map(c=>({x:(c.x/f.w-.5)*w,lift:0,stance:true})))
        .map(foot=>({...foot,y:(ground?ground(x+foot.x*flip)-y:0)-foot.lift}));
      const hand=art?.grips[0]??movement.hands[p.sprite].map((n,i)=>(n-(i?f.y:f.x))/(i?f.h:f.w));
      // Keep anatomical ownership through the passing pose. The source
      // back leg starts behind the body, regardless of facing direction.
      if(animatedGait&&natural===1)feet.reverse();
      if(animatedGait&&!art&&[0,1,2,10].includes(p.sprite)){
        const cycle=(pose.phase||0)/.15/(h*stride*2)*Math.PI*2;
        const weight=pose.gaitWeight??1;
        pose={...pose,handX:(pose.handX||0)+Math.sin(cycle)*1.25*weight,
          handY:(pose.handY||0)+Math.cos(cycle)*.35*weight,
          lean:(pose.lean||0)+natural*.012*weight};
      }
      const rig={w,h,f,contacts,feet,pose,hand,walking,natural,stride,legKnees:art?.legKnees,skeletal:animatedGait};
      const density=this.motionDensity??3,pw=Math.ceil((w+24)*density),ph=Math.ceil((h+16)*density);
      if(this.motionSurface.width<pw||this.motionSurface.height<ph){
        this.motionSurface.width=Math.max(pw,this.motionSurface.width);
        this.motionSurface.height=Math.max(ph,this.motionSurface.height);
      }
      // Small seated/working gestures need fewer mesh rebuilds than camera
      // movement. Stagger them by character; moving feet still update every
      // display frame. Each resident retains just one bounded-size bitmap.
      const cacheable=p.id?.startsWith('resident-')&&!walking&&pose.gaitWeight===undefined,tick=Math.floor((time+(p.phase||0))*12);
      let cached=cacheable?this.residentFrames.get(p.id):null;
      if(cacheable&&!cached){
        const image=document.createElement('canvas');image.width=pw;image.height=ph;
        cached={image,context:image.getContext('2d'),tick:-1};this.residentFrames.set(p.id,cached);
      }
      if(cached&&(cached.image.width!==pw||cached.image.height!==ph||cached.density!==density)){
        cached.image.width=pw;cached.image.height=ph;cached.density=density;cached.tick=-1;
      }
      const gpu=!cached&&this.mesh?.active;
      if(cached&&cached.texture!==texture){cached.texture=texture;cached.tick=-1;}
      if(!cached||cached.tick!==tick){
        const surface=cached?.context??this.motionContext;
        surface.setTransform(1,0,0,1,0,0);surface.clearRect(0,0,pw,ph);
        surface.setTransform(density,0,0,density,(w/2+12)*density,(h+8)*density);
        if(gpu)this.mesh.begin(pw,ph,density,w,h);
        const split=(contacts[0].x+contacts[1].x)/(2*f.w);
        const layers=longRobe&&animatedGait?this.robeLayers(texture,p.sprite,f):null;
        const panels=animatedGait?[
          {columns:[0,split/2,split],rows:[.60,.68,.76,.84,.91,.965,1],leg:0},
          {columns:[split,(split+1)/2,1],rows:[.60,.68,.76,.84,.91,.965,1],leg:1},
          {columns:[0,.25,.5,.75,1],rows:longRobe?[0,.12,.24,.38,.51,.60,.71,.80,.88,.94,1]:[0,.12,.24,.38,.51,.60,.64],cloth:longRobe}
        ]:[{columns:[0,.25,.5,.75,1],rows:[0,.12,.24,.38,.51,.64,.74,.84,.94,1]}];
        for(const {columns,rows,leg,cloth} of panels){
        const panelRig={...rig,leg,cloth};
        if(animatedGait&&leg!==undefined)panelRig.skeleton=movement.legSkeleton(panelRig);
        // Garment and leg masks retain their painted contours. Each leg
        // includes its ankle and shoe in the same skeletal mesh.
        const panelTexture=layers?layers[cloth?0:1]:texture;
        surface.save();
        const points=rows.map(v=>columns.map(u=>({source:[u*f.w,v*f.h],target:movement.deform(u,v,panelRig)})));
        if(gpu){this.mesh.draw(panelTexture,points);surface.restore();continue;}
        for(let row=0;row<rows.length-1;row++)for(let col=0;col<columns.length-1;col++){
          const p=points[row][col],q=points[row][col+1],r=points[row+1][col],s=points[row+1][col+1];
          // Rigid walking leg sections are affine too. Keep every vertex,
          // but sample those cells once without a triangular clip.
          // A quad is safe only when its fourth corner is exactly affine.
          // The old .12 tolerance left disconnected edges when zoomed in.
          if(Math.hypot(q.target[0]+r.target[0]-p.target[0]-s.target[0],q.target[1]+r.target[1]-p.target[1]-s.target[1])<1e-8){
            this.quad(surface,panelTexture,p,q,r);
          }else{
            this.triangle(surface,panelTexture,[p,q,r]);this.triangle(surface,panelTexture,[q,s,r]);
          }
        }
        surface.restore();
        }
        if(cached){cached.tick=tick;cached.hand=movement.deform(...hand,rig);}
      }
      const region=gpu?this.mesh.region:{x:0,y:0};
      const composite=()=>{
      ctx.save();ctx.translate(x,y);ctx.scale(flip,1);
      if(!seated)for(const foot of feet){
        ctx.beginPath();ctx.ellipse(foot.x,foot.y+foot.lift+.25,w*.085,.65,0,0,Math.PI*2);
        ctx.fillStyle=foot.stance?'#50463144':'#5046311b';ctx.fill();
      }
      ctx.drawImage(gpu?this.mesh.canvas:cached?.image??this.motionSurface,region.x,region.y,pw,ph,-w/2-12,-h-8,pw/density,ph/density);
      const handPoint=cached?.hand??movement.deform(...hand,rig);
      this.workObject(ctx,p,handPoint,h);
      ctx.restore();
      };
      if(!this.mesh?.batching)composite();
      const handPoint=cached?.hand??movement.deform(...hand,rig);
      const project=point=>({x:x+point[0]*flip,y:y+point[1]});
      return {composite:this.mesh?.batching?composite:null,hand:project(handPoint),hands:(art?.grips??[hand]).map(uv=>project(movement.deform(...uv,rig)))};
    }
    workObject(ctx,p,[hx,hy],height){
      if(p.storyProp){window.StreetDetails?.object(ctx,p.storyProp,hx,hy,height/66);return;}
      if(p.story&&p.activity!=='weave')return;
      if(!['pack','weave','tend'].includes(p.activity))return;
      ctx.save();ctx.lineWidth=.55;ctx.strokeStyle='#665640';ctx.fillStyle='#ae9270';
      if(p.activity==='pack'){
        const size=height/60;
        ctx.translate(hx+2.4*size,hy+2.7*size);ctx.scale(size,size);
        ctx.beginPath();ctx.moveTo(-4,-2.3);ctx.quadraticCurveTo(0,-4,4.4,-2.1);ctx.lineTo(4.8,2.7);ctx.quadraticCurveTo(0,4,-4.4,2.5);ctx.closePath();ctx.fill();ctx.stroke();
        ctx.beginPath();ctx.moveTo(-.8,-2.8);ctx.lineTo(.2,3.2);ctx.moveTo(-4.3,.4);ctx.lineTo(4.5,.2);ctx.stroke();
      }else if(p.activity==='weave'){
        ctx.beginPath();ctx.moveTo(hx-4,hy);ctx.lineTo(hx,hy-1.4);ctx.lineTo(hx+4,hy);ctx.lineTo(hx,hy+1.2);ctx.closePath();ctx.fill();ctx.stroke();
        ctx.beginPath();ctx.moveTo(hx-2,hy);ctx.lineTo(hx+2,hy);ctx.strokeStyle='#d1bf97';ctx.stroke();
      }else{
        ctx.beginPath();ctx.moveTo(hx-2,hy-2);ctx.lineTo(hx+8,-1);ctx.stroke();
        ctx.beginPath();ctx.moveTo(hx+6,-1);ctx.lineTo(hx+10,-1);ctx.lineTo(hx+11,1);ctx.lineTo(hx+6,1);ctx.closePath();ctx.fillStyle='#6b6957';ctx.fill();
      }
      ctx.restore();
    }
    quad(ctx,texture,p,q,r){
      const [sx,sy]=p.source,w=q.source[0]-sx,h=r.source[1]-sy;
      const a=(q.target[0]-p.target[0])/w,b=(q.target[1]-p.target[1])/w;
      const c=(r.target[0]-p.target[0])/h,d=(r.target[1]-p.target[1])/h;
      ctx.save();ctx.transform(a,b,c,d,p.target[0]-a*sx-c*sy,p.target[1]-b*sx-d*sy);
      ctx.drawImage(texture,sx,sy,w,h,sx,sy,w,h);ctx.restore();
    }
    cell(ctx,texture,p,q,r,s){
      // Undeformed/affine cells need one image sample and no clipping path.
      // Only use the fast path when both triangles have the same transform.
      if(Math.abs(q.target[0]+r.target[0]-p.target[0]-s.target[0])<1e-8&&
         Math.abs(q.target[1]+r.target[1]-p.target[1]-s.target[1])<1e-8){
        this.quad(ctx,texture,p,q,r);
      }else{
        this.triangle(ctx,texture,[p,q,r]);this.triangle(ctx,texture,[q,s,r]);
      }
    }
    triangle(ctx,texture,vertices){
      const [p,q,r]=vertices,[sx,sy]=p.source,ux=q.source[0]-sx,uy=q.source[1]-sy,vx=r.source[0]-sx,vy=r.source[1]-sy;
      const det=ux*vy-uy*vx,dx=q.target[0]-p.target[0],dy=q.target[1]-p.target[1],ex=r.target[0]-p.target[0],ey=r.target[1]-p.target[1];
      const a=(dx*vy-ex*uy)/det,b=(dy*vy-ey*uy)/det,c=(ex*ux-dx*vx)/det,d=(ey*ux-dy*vx)/det;
      const cx=(p.target[0]+q.target[0]+r.target[0])/3,cy=(p.target[1]+q.target[1]+r.target[1])/3;
      ctx.save();ctx.beginPath();
      for(let i=0;i<3;i++){
        const [x,y]=vertices[i].target,distance=Math.hypot(x-cx,y-cy)||1;
        const px=x+(x-cx)/distance*.13,py=y+(y-cy)/distance*.13;i?ctx.lineTo(px,py):ctx.moveTo(px,py);
      }
      // Limit sampling to this mesh cell instead of resampling the whole
      // portrait behind every small triangular clip.
      const left=Math.max(0,Math.floor(Math.min(sx,q.source[0],r.source[0]))-1);
      const top=Math.max(0,Math.floor(Math.min(sy,q.source[1],r.source[1]))-1);
      const width=Math.min(texture.width,Math.ceil(Math.max(sx,q.source[0],r.source[0]))+1)-left;
      const height=Math.min(texture.height,Math.ceil(Math.max(sy,q.source[1],r.source[1]))+1)-top;
      ctx.closePath();ctx.clip();ctx.transform(a,b,c,d,p.target[0]-a*sx-c*sy,p.target[1]-b*sx-d*sy);
      ctx.drawImage(texture,left,top,width,height,left,top,width,height);ctx.restore();
    }
  }
  Inhabitants.MeshRenderer=PeopleMesh;
  window.Inhabitants=Inhabitants;
})();
