(() => {
  'use strict';
  const TAU=Math.PI*2;
  const random=(min,max)=>min+Math.random()*(max-min);
  function remember(trail,x,y,limit){
    const point=trail.length===limit?trail.pop():{};
    point.x=x;point.y=y;trail.unshift(point);
  }
  const SHOW_START=Date.parse('2026-09-25T20:00:00+08:00');
  const SHOW_END=Date.parse('2026-09-26T00:00:00+08:00');
  const SPONSOR_START=Date.parse('2026-09-25T22:00:00+08:00');
  const REPLAY_START=Date.parse('2026-09-27T08:24:00+08:00');
  const REPLAY_END=Date.parse('2026-09-28T00:00:00+08:00');
  const REPLAY_SPONSOR_START=Date.parse('2026-09-27T22:00:00+08:00');
  // Absolute instants keep this one festival evening on Beijing time worldwide.
  function isFireworksTime(now=Date.now()){
    const time=Number(now);
    return (time>=SHOW_START&&time<SHOW_END)||(time>=REPLAY_START&&time<REPLAY_END);
  }
  function isSponsorTime(now=Date.now()){
    const time=Number(now);
    return [SPONSOR_START,REPLAY_SPONSOR_START].some(start=>time>=start&&time<start+60000);
  }

  class FireworkShow {
    constructor(){this.rockets=[];this.stars=[];this.sparks=[];this.flashes=[];this.elapsed=0;this.nextLaunch=.3;this.shot=0;this.burstCount=0;this.greeting=null;this.letterPoints={zh:[],en:[]};this.shapePoints={rabbit:[],fairies:[]};this.textDisplays=0;this.shapeDisplays=0;this.sponsorPoints={thanks:[],chatgpt:[]};this.sponsorStep=-1;this.sponsorStarted=false;this.sponsorCompleted=0;}
    resize(width,height,horizon){
      this.width=width;this.height=height;this.horizon=horizon;
      this.scale=Math.max(.45,Math.min(1.45,width/1440,horizon/450));
      this.mobile=width<600;
    }
    clear(){this.rockets.length=this.stars.length=this.sparks.length=this.flashes.length=0;this.nextLaunch=.3;this.sponsorLaunch=.2;this.sponsorShot=0;this.shot=0;this.burstCount=0;this.greeting=null;}
    get showingFigures(){return this.textDisplays>=(Math.floor(this.shapeDisplays/6)+1)*5;}
    beginSponsor(){
      if(this.sponsorStarted||!this.sponsorPoints.thanks.length||!this.sponsorPoints.chatgpt.length)return false;
      this.sponsorStarted=true;
      // Discard in-flight shells, but keep the ordinary programme's completed progress.
      this.sponsorResume={shot:this.burstCount,burstCount:this.burstCount};
      this.clear();this.sponsorStep=0;this.nextLaunch=0;return true;
    }
    playSponsorAct(){
      const thanks=this.sponsorStep%2===0;
      const rocket={x:this.width*.5,y:this.horizon*.5,size:1.9};
      this.form(rocket,this.sponsorPoints[thanks?'thanks':'chatgpt'],thanks?'sponsor-thanks':'sponsor-chatgpt',thanks?'zh':'en');
      this.flashes.push({...rocket,age:0,life:.65,color:'173,244,211',radius:130*this.scale});
      this.onBloom?.(rocket);
    }
    greet(rocket){
      if(this.showingFigures)return;
      const language=this.textDisplays%2===0?'zh':'en',points=this.letterPoints[language];
      if(!points.length)return;
      this.form(rocket,points,'text',language);this.textDisplays++;
    }
    form(rocket,points,kind,language=null){
      const figure=kind==='rabbit'||kind==='fairy',sponsor=kind.startsWith('sponsor-');
      const pointScale=figure&&rocket.size<=1.5?.82:1;
      const rabbitIndex=Math.floor(this.shapeDisplays/2),rabbitTone=[0,2,3,4,5,1][rabbitIndex%6];
      const rabbitAction=['ears','leap','look'][rabbitIndex%3],mirror=kind==='rabbit'&&Math.floor(rabbitIndex/3)%2?-1:1;
      const colorful=kind==='text'&&this.textDisplays>=5;
      const minX=Math.min(...points.map(p=>p.x)),spanX=Math.max(...points.map(p=>p.x))-minX+1;
      const palette=[3,5,4,2,0],rotation=Math.floor(this.textDisplays/5)%palette.length;
      const centerX=this.width*(sponsor?.5:this.mobile?.5:.43),centerY=this.horizon*(kind==='sponsor-thanks'&&!this.mobile?.42:sponsor?.5:figure?.55:.46);
      const life=sponsor?(kind==='sponsor-thanks'?6.8:7.8):figure?6.8:5.2;
      this.greeting={kind,language,colorful,rabbitAction,rabbitTone,centerX,centerY,age:0,life,holdUntil:life-2.05,particles:points.map(point=>({
        targetX:centerX+point.x*pointScale*mirror,targetY:centerY+point.y*pointScale,
        localX:point.x*pointScale*mirror,localY:point.y*pointScale,
        tone:kind==='rabbit'?rabbitTone:colorful?palette[(Math.floor((point.x-minX)/spanX*palette.length)+rotation)%palette.length]:point.tone||0,edge:point.edge??1,
        startX:rocket.x+random(-12,12)*this.scale,startY:rocket.y+random(-12,12)*this.scale,
        x:rocket.x,y:rocket.y,px:rocket.x,py:rocket.y,
        delay:random(0,.2),seed:random(0,TAU),size:random(.65,1.15),
        vx:random(-15,15)*this.scale,vy:random(4,18)*this.scale
      }))};
      // Let each particle figure settle, shimmer and fall before the next launch.
      this.nextLaunch=this.greeting.life+.3;
    }
    launch(accompaniment=false){
      const s=this.scale;
      const shot=accompaniment?this.sponsorShot:this.shot;
      const size=shot%2===0?1.35:1.9;
      // The left and middle sky leave breathing room around the moon and branch.
      const positions=accompaniment?[.18,.82,.3,.7]:[.28,.53,.39,.61,.22,.47,.79];
      const margin=Math.min(this.width*.3,115*s*size);
      const x=Math.max(margin,Math.min(this.width-margin,this.width*(positions[shot%positions.length]+random(-.035,.035))));
      const y=this.horizon*(accompaniment?random(.38,.65):random(.44,.58));
      const duration=random(1.25,1.7),startY=this.horizon+35*s;
      const startX=x+random(-70,70)*s,gravity=115*s;
      const kind=['willow','peony','chrysanthemum','willow','double'][shot%5];
      const colors=['255,202,116','255,129,160','130,192,255','159,235,181','207,158,255','255,232,183'];
      const palettes=[['255,202,116','255,129,160','151,218,255'],['255,166,214','187,161,255','255,225,159'],['132,224,196','144,186,255','255,216,137']];
      const palette=shot%3===0?[colors[Math.floor(shot/3)%colors.length]]:palettes[shot%palettes.length];
      const color=palette[0];
      const formation=!accompaniment&&this.showingFigures?(this.shapeDisplays%2===0?'rabbit':'fairy'):null;
      this.rockets.push({x:startX,y:startY,vx:(x-startX)/duration,vy:(y-startY)/duration-gravity*duration/2,
        gravity,age:0,life:duration,kind,color,palette,size,formation,accompaniment,trail:[]});
      if(accompaniment)this.sponsorShot++;else this.shot++;
    }
    burst(rocket){
      this.onBloom?.(rocket);
      const {x,y,kind,color,palette=[color],size=1}=rocket,s=this.scale;
      const count=Math.round((this.mobile?82:150)*(size>1.5?1.6:1.2)*(rocket.formation?.35:1));
      const willow=kind==='willow',speed=random(100,132)*s*size;
      const phase=random(0,TAU);
      // Project a sphere, including its interior stars, instead of a flat wheel.
      for(let i=0;i<count;i++){
        const z=1-2*(i+.5)/count,angle=i*2.399963+phase;
        const ring=Math.sqrt(1-z*z),jitter=random(.92,1.06);
        const life=willow?random(3.3,4.8):random(1.8,3.1);
        this.stars.push({x,y,px:x,py:y,vx:Math.cos(angle)*ring*speed*jitter,
          vy:z*speed*jitter,age:0,life,color:palette[i%palette.length],
          drag:willow?.48:.85,gravity:(willow?31:39)*s,willow,
          glitter:kind!=='peony',seed:random(0,TAU),sparkClock:random(0,.09),trail:[]});
      }
      if(kind==='double'){
        for(let i=0;i<42;i++){
          const angle=TAU*i/42;
          this.stars.push({x,y,px:x,py:y,vx:Math.cos(angle)*speed*.47,vy:Math.sin(angle)*speed*.47,
            age:0,life:random(1.7,2.4),color:'255,231,180',drag:.7,gravity:34*s,
            willow:false,glitter:false,seed:0,sparkClock:0,trail:[]});
        }
      }
      this.flashes.push({x,y,age:0,life:.65,color,radius:145*s*size});
      // Accompany the sponsor text without replacing it or advancing the main programme.
      if(rocket.accompaniment)return;
      this.burstCount++;
      if(rocket.formation){
        const poses=this.shapePoints.fairies;
        const points=rocket.formation==='rabbit'?this.shapePoints.rabbit:poses[Math.floor(this.shapeDisplays/2)%Math.max(1,poses.length)];
        if(points?.length){this.form(rocket,points,rocket.formation);this.shapeDisplays++;}
      }else if(this.burstCount%2===0)this.greet(rocket);
    }
    spark(x,y,vx,vy,color,life){
      if(this.sparks.length>=2200)return;
      this.sparks.push({x,y,px:x,py:y,vx,vy,color,age:0,life,seed:random(0,TAU)});
    }
    update(dt){
      // Never catch up a background tab by simulating its entire absence.
      dt=Math.min(.04,Math.max(0,dt));this.elapsed+=dt;this.nextLaunch-=dt;
      if(this.sponsorStep>=0&&!this.greeting&&this.nextLaunch<=0)this.playSponsorAct();
      if(this.sponsorStep>=0){
        this.sponsorLaunch-=dt;
        if(this.sponsorLaunch<=0&&this.stars.length<(this.mobile?500:1000)&&this.rockets.length<3){
          this.launch(true);this.sponsorLaunch=this.mobile?random(1.2,1.6):random(.85,1.25);
        }
      }
      if(this.sponsorStep<0&&this.nextLaunch<=0&&!this.greeting&&!((this.showingFigures||this.shot%2===0)&&this.rockets.length)){
        if(this.stars.length<850&&this.rockets.length<4)this.launch();
        // Alternating solo shells and close pairs, with room for the falling gold.
        this.nextLaunch=this.shot%7===3?.6:random(1.7,2.9);
      }
      for(let i=this.rockets.length-1;i>=0;i--){
        const r=this.rockets[i];r.age+=dt;r.vy+=r.gravity*dt;r.x+=r.vx*dt;r.y+=r.vy*dt;
        remember(r.trail,r.x,r.y,15);
        this.spark(r.x,r.y,random(-12,12)*this.scale,random(12,42)*this.scale,'255,191,99',random(.3,.7));
        if(r.age>=r.life){this.burst(r);this.rockets.splice(i,1);}
      }
      for(let i=this.stars.length-1;i>=0;i--){
        const p=this.stars[i];p.age+=dt;
        if(p.age>=p.life){this.stars.splice(i,1);continue;}
        p.px=p.x;p.py=p.y;const drag=Math.exp(-p.drag*dt);
        p.vx*=drag;p.vy=p.vy*drag+p.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
        remember(p.trail,p.x,p.y,p.willow?20:12);
        p.sparkClock-=dt;
        if(p.glitter&&p.sparkClock<=0){
          this.spark(p.x,p.y,p.vx*.16+random(-5,5),p.vy*.14,'255,203,123',random(.35,p.willow?1.1:.6));
          p.sparkClock=this.mobile?.13:.075;
        }
      }
      for(let i=this.sparks.length-1;i>=0;i--){
        const p=this.sparks[i];p.age+=dt;
        if(p.age>=p.life){this.sparks.splice(i,1);continue;}
        p.px=p.x;p.py=p.y;p.vx*=Math.exp(-dt*1.5);p.vy+=22*this.scale*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
        p.band=Math.min(2,Math.floor((1-p.age/p.life)*(.65+.35*Math.sin(p.age*32+p.seed)**2)*3));
      }
      for(let i=this.flashes.length-1;i>=0;i--){this.flashes[i].age+=dt;if(this.flashes[i].age>=this.flashes[i].life)this.flashes.splice(i,1);}
      if(this.greeting){
        const greeting=this.greeting;greeting.age+=dt;
        if(greeting.age>=greeting.life){
          if(greeting.kind.startsWith('sponsor-')){
            this.sponsorStep++;this.sponsorCompleted++;
            if(this.sponsorStep===6){this.sponsorStep=-1;Object.assign(this,this.sponsorResume);}
            this.nextLaunch=.35;
          }
          this.greeting=null;return;
        }
        for(const p of greeting.particles){
          p.px=p.x;p.py=p.y;
          const t=Math.max(0,greeting.age-p.delay),gather=Math.min(1,t/1.15),ease=1-(1-gather)**3;
          const fall=Math.max(0,t-greeting.holdUntil);
          // Match the stage dancer's floating sleeves, ribbons and gentle sway.
          const sleeve=greeting.kind==='fairy'?Math.min(1,Math.abs(p.localX)/90)*Math.max(0,1-(p.localY+160)/320):0;
          let danceX=Math.sin(t*1.7+p.localY*.012)*sleeve*8*this.scale;
          let danceY=Math.cos(t*1.4+p.localX*.015)*sleeve*5*this.scale;
          if(greeting.kind==='rabbit'){
            const phase=Math.max(0,greeting.age-1.15),s=this.scale;
            const ear=Math.max(0,Math.min(1,(-p.localY/Math.max(s,.6)-15)/75));
            if(greeting.rabbitAction==='ears'){
              danceX=Math.sin(phase*2.5+p.localX*.006)*ear*18*s;
              danceY=Math.sin(phase*1.8)*p.localY*.014;
            }else if(greeting.rabbitAction==='leap'){
              const jump=Math.sin(phase*1.5)**2,angle=-.14+.1*Math.sin(phase*1.5);
              danceX=p.localX*(Math.cos(angle)-1)-p.localY*Math.sin(angle)+Math.sin(phase*1.5)*22*s;
              danceY=p.localX*Math.sin(angle)+p.localY*(Math.cos(angle)-1)-jump*34*s;
            }else{
              const upper=Math.max(0,Math.min(1,(25*s-p.localY)/(70*s))),angle=.18+.06*Math.sin(phase*1.7);
              const x=p.localX+22*s,y=p.localY-15*s;
              danceX=(x*(Math.cos(angle)-1)-y*Math.sin(angle))*upper+ear*Math.sin(phase*2)*5*s;
              danceY=(x*Math.sin(angle)+y*(Math.cos(angle)-1))*upper;
            }
          }
          p.x=p.startX+(p.targetX+danceX-p.startX)*ease+Math.sin(t*2.6+p.seed)*.55*ease+p.vx*fall;
          p.y=p.startY+(p.targetY+danceY-p.startY)*ease+Math.sin(t*3+p.seed)*.45*ease+p.vy*fall+13*this.scale*fall*fall;
        }
      }
    }
    draw(ctx){
      ctx.clearRect(0,0,this.width,this.height);ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
      // Keep the continuous shells behind the lettering visually quieter.
      ctx.globalAlpha=this.sponsorStep>=0?.62:1;
      for(const f of this.flashes){
        const alpha=Math.pow(1-f.age/f.life,3),r=f.radius;
        const glow=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,r);
        glow.addColorStop(0,`rgba(${f.color},${alpha*.24})`);glow.addColorStop(.15,`rgba(${f.color},${alpha*.08})`);glow.addColorStop(1,`rgba(${f.color},0)`);
        ctx.fillStyle=glow;ctx.fillRect(f.x-r,f.y-r,r*2,r*2);
      }
      const stroke=(trail,color,alpha,width)=>{
        if(trail.length<2)return;
        ctx.lineWidth=width;ctx.strokeStyle=`rgba(${color},${alpha})`;ctx.beginPath();
        ctx.moveTo(trail[0].x,trail[0].y);for(let j=1;j<trail.length;j++)ctx.lineTo(trail[j].x,trail[j].y);ctx.stroke();
      };
      for(const p of this.stars){
        const t=p.age/p.life,fade=Math.pow(1-t,.65),ignition=Math.min(1,p.age*12);
        const shimmer=t>.55?.65+.35*Math.sin(p.age*25+p.seed)**2:1;
        const alpha=fade*ignition*shimmer;
        stroke(p.trail,p.color,alpha*.12,3.5*this.scale);
        stroke(p.trail,p.color,alpha*.55,.85*this.scale);
        ctx.fillStyle=`rgba(${p.color},${alpha})`;ctx.fillRect(p.x,p.y,1.3*this.scale,1.3*this.scale);
        if(t<.25){ctx.fillStyle=`rgba(255,248,223,${alpha*.8})`;ctx.fillRect(p.x,p.y,.9*this.scale,.9*this.scale);}
      }
      ctx.lineWidth=.75*this.scale;
      // One path per palette avoids thousands of individual glow filters.
      for(const color of ['255,203,123','255,191,99']){
        for(let band=0;band<3;band++){
          ctx.strokeStyle=`rgba(${color},${[.14,.36,.66][band]})`;ctx.beginPath();
          for(const p of this.sparks){
            if(p.color!==color||p.band!==band)continue;
            ctx.moveTo(p.px,p.py);ctx.lineTo(p.x+.45*this.scale,p.y+.7*this.scale);
          }
          ctx.stroke();
        }
      }
      for(const r of this.rockets){
        stroke(r.trail,'255,174,84',.13,5*this.scale);stroke(r.trail,'255,218,159',.8,1.2*this.scale);
        ctx.fillStyle='#fff1cd';ctx.fillRect(r.x,r.y,1.6*this.scale,2.8*this.scale);
      }
      ctx.globalAlpha=1;
      if(this.greeting){
        const g=this.greeting,thanks=g.kind==='sponsor-thanks',dot=(this.mobile?.85:1.1)*(thanks?.82:1);
        for(const p of g.particles){
          const t=Math.max(0,g.age-p.delay),fade=Math.min(1,t/.55)*Math.max(0,1-Math.max(0,t-g.holdUntil)/1.85);
          const alpha=fade*(.65+.35*Math.sin(t*14+p.seed)**2)*(p.edge?1:.65);
          ctx.globalAlpha=alpha;
          const texture=this.emberTextures?.[p.tone]||this.emberTexture;
          if(texture){const r=dot*p.size*(thanks?2.8:g.language==='en'?3.7:5);ctx.drawImage(texture,p.x-r,p.y-r,r*2,r*2);}
          ctx.fillStyle=['#ffe9b2','#fff5df','#bdfff0','#ffc7db','#c7e5ff','#ead0ff'][p.tone];ctx.fillRect(p.x,p.y,dot*p.size,dot*p.size);
          if(t<1.15||t>g.holdUntil){
            ctx.strokeStyle='rgba(255,190,89,.5)';ctx.lineWidth=dot*.65;
            ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.x,p.y);ctx.stroke();
          }
        }
        ctx.globalAlpha=1;
      }
      ctx.globalCompositeOperation='source-over';
    }
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={isFireworksTime,isSponsorTime,FireworkShow};
  if(typeof document==='undefined')return;
  const atlas=document.querySelector('#atlas'),stage=document.querySelector('#atlasStage');
  if(!atlas||!stage)return;
  const canvas=document.createElement('canvas');canvas.id='atlasFireworks';canvas.setAttribute('aria-hidden','true');stage.append(canvas);
  const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return;}
  const button=document.createElement('button');button.id='atlasFireworksToggle';button.hidden=true;atlas.append(button);
  const audioButton=document.createElement('button');audioButton.id='atlasFireworksSound';audioButton.hidden=true;atlas.append(audioButton);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const query=new URLSearchParams(location.search);
  const preview=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&query.get('fireworks')==='preview';
  const sponsorPreview=preview&&query.get('act')==='sponsor';
  const show=new FireworkShow();let paused=reduced.matches,running=false,raf=0,last=0;
  const sound=new window.FireworkAudio('assets/firework-bloom.mp3',{musicUrl:'assets/firework-background.mp3',onChange:updateAudioButton});
  function updateAudioButton(){
    const audible=sound.enabled&&(sound.musicPlaying||sound.unlocked);
    audioButton.textContent=audible?'声音 · 已开':!sound.enabled?'声音 · 静音':sound.error||sound.musicError?'声音 · 重试':'声音 · 开启';
    audioButton.setAttribute('aria-label',audible?'静音背景音乐和烟花音效':'开启背景音乐和烟花音效');audioButton.setAttribute('aria-pressed',String(audible));
  }
  show.onBloom=()=>sound.play();
  audioButton.addEventListener('click',async()=>{
    if(sound.enabled&&(sound.musicPlaying||sound.unlocked))sound.setEnabled(false);
    else{sound.setEnabled(true);await sound.unlock();}
    updateAudioButton();
  });
  const unlockAudio=event=>{
    if(atlas.hidden||atlas.classList.contains('inspecting')||event.target.closest?.('#atlasFireworksSound')||!sound.enabled||(sound.unlocked&&sound.musicUnlocked))return;
    void sound.unlock();
  };
  document.addEventListener('pointerdown',unlockAudio);
  document.addEventListener('keydown',unlockAudio);
  // Local review links can jump to an act without waiting through the opening.
  if(preview){
    const act=new URLSearchParams(location.search).get('act');
    const offset={'rabbit-1':0,'rabbit-2':2,'rabbit-3':4,'colorful-text':6}[act];
    if(offset!==undefined){show.textDisplays=5;show.shapeDisplays=offset;}
  }
  show.emberTextures=['255,195,101','255,236,199','128,241,208','255,151,186','126,190,255','201,147,255'].map(color=>{
    const ember=document.createElement('canvas');ember.width=ember.height=32;
    const ec=ember.getContext('2d'),glow=ec.createRadialGradient(16,16,0,16,16,16);
    glow.addColorStop(0,'#fff8db');glow.addColorStop(.12,`rgba(${color},.86)`);glow.addColorStop(.3,`rgba(${color},.4)`);glow.addColorStop(1,`rgba(${color},0)`);
    ec.fillStyle=glow;ec.fillRect(0,0,32,32);return ember;
  });
  show.emberTexture=show.emberTextures[0];
  function buildFigures(){
    const art=globalThis.QingmingFireworkShapes;
    if(!art)return;
    const height=Math.min(320,show.horizon*.64,show.width*(show.mobile?.64:.3));
    const limit=show.mobile?1100:1800;
    const fit=points=>{
      const selected=points.length<=limit?points:Array.from({length:limit},(_,i)=>points[Math.floor(i*points.length/limit)]);
      return selected.map(([x,y,tone,edge])=>({x:x*height/1000,y:y*height/1000,tone,edge}));
    };
    show.shapePoints={rabbit:fit(art.rabbit),fairies:art.fairies.map(fit)};
  }
  function buildLetters(){
    // Rasterize glyphs once on resize; the visible message consists only of embers.
    const size=Math.max(28,Math.min(68,show.width*.078,show.horizon*.14)),gap=size*.17;
    const mask=document.createElement('canvas');mask.width=Math.ceil(size*5);mask.height=Math.ceil(size*2.65);
    const ink=mask.getContext('2d',{willReadFrequently:true});
    ink.font=`600 ${size}px "Songti SC","STSong","Noto Serif CJK SC",serif`;ink.textBaseline='middle';ink.textAlign='center';ink.fillStyle='#fff';
    ['中秋快乐','爱你们'].forEach((line,row)=>{
      [...line].forEach((letter,i)=>ink.fillText(letter,mask.width/2+(i-(line.length-1)/2)*(size+gap),size*(.65+row*1.2)));
    });
    function sample(step){
      const pixels=ink.getImageData(0,0,mask.width,mask.height).data,points=[];
      for(let y=0;y<mask.height;y+=step)for(let x=0;x<mask.width;x+=step){
        if(pixels[(y*mask.width+x)*4+3]>90)points.push({x:x-mask.width/2,y:y-mask.height/2});
      }
      // Bound cost on dense fallback fonts while retaining an even spatial sample.
      const limit=show.mobile?1000:1800;
      return points.length<=limit?points:Array.from({length:limit},(_,i)=>points[Math.floor(i*points.length/limit)]);
    }
    show.letterPoints.zh=sample(show.mobile?2:3);
    const lines=show.mobile?['Happy Mid-Autumn','Festival','Love you all']:['Happy Mid-Autumn Festival','Love you all'];
    const fontSize=Math.min(show.mobile?28:46,size*.85),font=`600 ${fontSize}px Georgia,"Times New Roman",serif`;
    ink.font=font;
    const widest=Math.max(...lines.map(line=>ink.measureText(line).width));
    const fit=Math.min(1,show.width*(show.mobile?.86:.65)/widest);
    const englishSize=fontSize*fit,lineHeight=englishSize*1.4;
    mask.width=Math.ceil(widest*fit+16);mask.height=Math.ceil(lineHeight*lines.length+16);
    ink.font=`600 ${englishSize}px Georgia,"Times New Roman",serif`;
    ink.textBaseline='middle';ink.textAlign='center';ink.fillStyle='#fff';
    lines.forEach((line,row)=>ink.fillText(line,mask.width/2,mask.height/2+(row-(lines.length-1)/2)*lineHeight));
    show.letterPoints.en=sample(2);
  }
  function buildSponsor(){
    const mask=document.createElement('canvas');mask.width=Math.ceil(show.width);mask.height=Math.ceil(show.horizon);
    const ink=mask.getContext('2d',{willReadFrequently:true}),centerX=show.width*.5,centerY=show.horizon*.5;
    const sample=(step,limit,tone)=>{
      const rgba=ink.getImageData(0,0,mask.width,mask.height).data,points=[];
      for(let y=0;y<mask.height;y+=step)for(let x=0;x<mask.width;x+=step){
        if(rgba[(y*mask.width+x)*4+3]>85)points.push({x:x-centerX,y:y-centerY,tone:typeof tone==='function'?tone(x,y):tone});
      }
      return points.length<=limit?points:Array.from({length:limit},(_,i)=>points[Math.floor(i*points.length/limit)]);
    };
    const stamp=(text,x,y,size,maxWidth,font='"Songti SC","STSong",serif',weight=600)=>{
      ink.font=`${weight} ${size}px ${font}`;
      const fit=Math.min(1,maxWidth/ink.measureText(text).width);
      ink.font=`${weight} ${size*fit}px ${font}`;ink.textAlign='center';ink.textBaseline='middle';ink.fillStyle='#fff';ink.fillText(text,x,y);
    };
    const lines=show.mobile?['感谢 OpenAI','对本次烟花的','大力赞助～']:['感谢 OpenAI','对本次烟花的大力赞助～'];
    const size=Math.min(show.mobile?31:52,show.horizon*.105),lineHeight=size*1.65;
    lines.forEach((text,i)=>stamp(text,centerX,centerY+(i-(lines.length-1)/2)*lineHeight,size,show.width*.86,undefined,400));
    show.sponsorPoints.thanks=sample(show.mobile?1:2,show.mobile?1900:3400,0);
    ink.clearRect(0,0,mask.width,mask.height);
    const top=Math.min(140,show.horizon*.3),bottom=show.horizon-38,skyHeight=bottom-top;
    const columns=show.mobile?2:4,cell=show.width/columns;
    for(const row of [0,1])for(let col=0;col<columns;col++){
      stamp('ChatGPT',cell*(col+.5),top+skyHeight*(row?.88:.1),Math.min(48,cell*.19,skyHeight*.15),cell*.88,'Georgia,serif');
    }
    stamp('ChatGPT',centerX,top+skyHeight*.49,Math.min(show.width*.14,skyHeight*.4),show.width*.88,'Georgia,serif');
    show.sponsorPoints.chatgpt=sample(2,show.mobile?2600:5200,(x,y)=>y>top+skyHeight*.28&&y<top+skyHeight*.68?2:[0,1,2][Math.floor(x/cell)%3]);
  }
  let geometryKey='';
  function resize(){
    // Text masks and shape templates are only needed while fireworks are visible.
    if(!running)return;
    const rect=stage.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const ratio=Math.min(devicePixelRatio||1,1.5);
    const key=`${rect.width}:${rect.height}:${ratio}`;
    if(key===geometryKey)return;
    geometryKey=key;
    canvas.width=Math.round(rect.width*ratio);canvas.height=Math.round(rect.height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
    // Match atlas.js's final overview layout, not a halfway CSS transform during load.
    const paintingHeight=724*rect.width/2172;
    const paintingTop=rect.width<=600?(rect.height-paintingHeight)*.6:Math.max(0,rect.height-paintingHeight);
    const horizon=Math.max(rect.height*.3,Math.min(rect.height*.78,paintingTop+paintingHeight*.2));
    show.resize(rect.width,rect.height,horizon);
    buildLetters();
    buildFigures();
    buildSponsor();
    canvas.style.maskImage=`linear-gradient(to bottom,#000 ${Math.max(0,horizon-30)}px,transparent ${horizon+65}px)`;
    canvas.style.webkitMaskImage=canvas.style.maskImage;
    show.clear();
  }
  function tick(time){
    if(!running)return;
    // Check the real clock every frame, including the midnight boundary.
    if(!(preview||isFireworksTime())){sync();return;}
    if(!show.sponsorStarted&&(isSponsorTime()||sponsorPreview))show.beginSponsor();
    show.update(last?(time-last)/1000:1/60);last=time;show.draw(ctx);raf=requestAnimationFrame(tick);
  }
  function sync(){
    const scheduled=preview||isFireworksTime();
    button.hidden=!scheduled;
    audioButton.hidden=false;
    sound.setSceneActive(!atlas.hidden&&!atlas.classList.contains('inspecting')&&!document.hidden);
    updateAudioButton();
    button.textContent=paused?'烟花 · 播放':'烟花 · 暂停';
    button.setAttribute('aria-label',paused?'播放烟花':'暂停烟花');button.setAttribute('aria-pressed',String(!paused));
    const active=scheduled&&!paused&&!atlas.hidden&&!atlas.classList.contains('inspecting');
    if(atlas.classList.contains('fireworks-evening')!==active)atlas.classList.toggle('fireworks-evening',active);
    const next=active&&!document.hidden;
    if(next===running)return;
    running=next;
    sound.setActive(running);
    if(running){resize();last=0;raf=requestAnimationFrame(tick);}
    else{cancelAnimationFrame(raf);raf=0;show.clear();ctx.clearRect(0,0,show.width||0,show.height||0);}
  }
  button.addEventListener('click',()=>{paused=!paused;sync();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pageshow',sync);
  new MutationObserver(sync).observe(atlas,{attributes:true,attributeFilter:['hidden','class']});
  new ResizeObserver(resize).observe(stage);
  // Wake at the exact next second; checking wall time also handles clock changes.
  function schedule(){sync();setTimeout(schedule,1000-Date.now()%1000);}
  schedule();
  window.AtlasFireworks={isFireworksTime,get state(){return {scheduled:preview||isFireworksTime(),preview,running,paused,rockets:show.rockets.length,stars:show.stars.length,sparks:show.sparks.length,bursts:show.burstCount,greetingAge:show.greeting?.age??null,greetingLanguage:show.greeting?.language??null,greetingKind:show.greeting?.kind??null,colorfulText:show.greeting?.colorful??false,rabbitAction:show.greeting?.kind==='rabbit'?show.greeting.rabbitAction:null,rabbitTone:show.greeting?.kind==='rabbit'?show.greeting.rabbitTone:null,textDisplays:show.textDisplays,shapeDisplays:show.shapeDisplays,letterParticles:show.greeting?.particles.length??0,sponsorActive:show.sponsorStep>=0,sponsorCompleted:show.sponsorCompleted,soundEnabled:sound.enabled,soundUnlocked:sound.unlocked,soundPlays:sound.plays,soundVoices:sound.voices.size,musicPlaying:sound.musicPlaying,musicTime:sound.music?.currentTime??0,musicLoop:sound.music?.loop??false,soundError:sound.error||sound.musicError,soundContext:sound.context?.state??null};}};
})();
