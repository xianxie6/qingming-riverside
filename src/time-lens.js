(() => {
  'use strict';
  const G=window.TimeLensGeometry;
  const bounds={min:-2172,max:4344},worldWidth=6516;
  const entries=[document.querySelector('#timeLensEntry'),document.querySelector('#timeLensStreetEntry')].filter(Boolean);
  const stops=[
    {id:'mill',label:'水磨旧址',x:-1577,y:410,title:'水轮退场，河岸向人开放',then:'水轮带动作坊，窑炉与布匹围绕生产展开。',now:'水磨与窑坊已经消失，原地成为亲水广场、书店和餐饮街。人们来这里散步、读书、坐在河边休息。'},
    {id:'tea',label:'茶坊旧址',x:675,y:350,title:'茶坊散去，商场亮起',then:'木楼檐下摆着桌案，茶客围坐歇脚。',now:'街区重新建设，玻璃商场与咖啡外摆取代木楼。购物、休闲与匆匆路过的人，组成新的日常。'},
    {id:'cloth',label:'衣铺旧址',x:985,y:395,title:'布匹铺面，变成购物街区',then:'布料悬在檐下，小店向街道敞开。',now:'现代商业建筑、品牌橱窗与电子屏取代旧铺面，人们提着购物袋穿过步行街。'},
    {id:'bridge',label:'桥头',x:1490,y:405,title:'河道依旧，桥边已是今日',then:'木桥连接两岸，桥头与河岸共同构成街市的动线。',now:'以同一处河道开口作为定位点，今日步行桥连接两侧商业街，桥边店铺与人群转换为三里屯商业街风貌。'},
    {id:'gate',label:'城门旧址',x:3360,y:320,title:'城墙消失，街道向城市延伸',then:'城墙与城门限定内外，商贩和脚夫从门洞穿行。',now:'城墙与门楼已被拆除，开放的步行大道向现代城市延伸。地铁出入口与商业广场承接新的往来。'},
    {id:'cargo',label:'货市旧址',x:4020,y:410,title:'货栈离岸，生活来到水边',then:'木车、货包和吊架围绕河岸货栈展开。',now:'货运功能退出河岸，购物中心、外摆餐饮与休闲空间接替货栈，配送由街侧的快递与电动车承担。'}
  ];
  let active=null,images=null;
  let remembered={center:(2172+695)/6516,x:.5,y:.51,zoom:1,era:1,angle:0};
  function loadImages(){
    if(images)return images;
    images=Promise.all(['assets/street-empty.webp','assets/time-lens/street-sanlitun-aligned-v5.png','assets/time-lens/boat-cyber-v1.png','assets/district-west-fast.webp','assets/district-east-fast.webp','assets/time-lens/district-west-sanlitun-v3.png','assets/time-lens/district-east-sanlitun-v3.png'].map((src,index)=>new Promise((resolve,reject)=>{
      const image=new Image();image.onload=()=>{if(index!==2&&Math.abs(image.naturalWidth/image.naturalHeight-3)>.03){reject(Error('Street artwork must have a 3:1 panorama aspect ratio'));return;}resolve(image);};image.onerror=()=>reject(Error('Street artwork failed to load'));image.src=src;
    }))).catch(error=>{images=null;throw error;});
    return images;
  }
  function open(trigger){
    if(active)return;
    const controller=new AbortController(),{signal}=controller;
    const dialog=document.createElement('dialog');dialog.id='timeLensDialog';dialog.setAttribute('aria-labelledby','timeLensTitle');
    dialog.innerHTML=`<div class="tl-shell">
      <header class="tl-header"><button data-close autofocus>← 返回画卷</button><div class="tl-title"><p>河流依旧 · 城市已换</p><h2 id="timeLensTitle">一街千年</h2></div><div class="tl-header-actions"><button data-zoom aria-pressed="false" aria-label="放大细看" title="放大细看"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M7 10h6"/><path class="tl-zoom-plus" d="M10 7v6"/></svg></button></div></header>
      <div class="tl-stage" aria-busy="true"><canvas role="img" tabindex="0" aria-label="方向键左右游览。同一条河岸街景，左侧宋代插画，右侧三里屯风貌现代街景，可拖动画面游览"></canvas><div class="tl-outside">宋代</div><button class="tl-mirror" role="slider" aria-label="宋代与今日对比分界" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" disabled><span aria-hidden="true">‹ ›</span></button><div class="tl-today">今日 · 三里屯风貌</div><p class="tl-help">拖动分界线对比古今 · 拖动画面游览</p><div class="tl-loading"><span role="status">正在展开两幅街景…</span><button data-retry hidden>重新载入</button></div>
      <article class="tl-story" aria-labelledby="tlStoryTitle" hidden><button class="tl-story-close" aria-label="收起变化说明">收起 ×</button><small>同一位置 · 两种日常</small><h3 id="tlStoryTitle"></h3><p data-then></p><p data-now></p><small>保留原景与原有人物，以同一河岸为线索，参考三里屯商业风貌重构今日街景；并非真实地点的历史复原。</small></article></div>
      <footer class="tl-footer"><div class="tl-found"><button data-story disabled>看这里的变化 ↗</button><nav class="tl-stops" aria-label="浏览街区">${stops.map(s=>`<button data-stop="${s.id}" aria-pressed="false" disabled>${s.label}</button>`).join('')}</nav></div>
      <div class="tl-direction" role="group" aria-label="分界线方向"><span>滑动方向</span><div class="tl-direction-presets"><button data-angle="0" aria-pressed="true" disabled>↔ 左右</button><button data-angle="90" aria-pressed="false" disabled>↕ 上下</button></div><label class="tl-angle-control"><span>角度</span><input data-angle-range type="range" min="0" max="180" step="1" value="0" aria-label="分界线旋转角度" disabled><output data-angle-value>0°</output></label></div>
      <div class="tl-timeline" role="group" aria-label="古今对比比例"><button class="tl-era" data-era="0" aria-pressed="false" disabled>宋代<small>画卷原景</small></button><div class="tl-ruler"><input data-era-range type="range" min="0" max="100" step="1" value="50" aria-label="古今对比比例" aria-valuetext="左侧宋代50%，右侧今日50%" disabled></div><button class="tl-era" data-era="1" aria-pressed="false" disabled>今日<small>步行街新景</small></button></div>
      </footer></div>`;
    document.body.append(dialog);dialog.showModal();active={close};
    const atlas=document.querySelector('#atlas');atlas.classList.add('time-lens-active');document.body.classList.add('time-lens-open');
    const stage=dialog.querySelector('.tl-stage'),canvas=dialog.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false}),mirror=dialog.querySelector('.tl-mirror');
    const eraRange=dialog.querySelector('[data-era-range]'),zoom=dialog.querySelector('[data-zoom]'),loading=dialog.querySelector('.tl-loading'),story=dialog.querySelector('.tl-story');
    const angleRange=dialog.querySelector('[data-angle-range]'),angleValue=dialog.querySelector('[data-angle-value]');
    const state={...remembered,width:0,height:0,art:null,view:null,lens:null,stop:stops[0],drag:null,people:null,time:12};
    let frame=0,closed=false,loadRevision=0,animationTimer=0,lastTick=0;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let layers=null;
    function compose(art,west,east){
      const layer=document.createElement('canvas');layer.width=worldWidth;layer.height=724;
      const c=layer.getContext('2d'),districts=new window.Districts();
      districts.west=west;districts.east=east;districts.prepare(art);
      c.translate(-bounds.min,0);districts.draw(c,art,bounds.min,bounds.max);return layer;
    }
    const observer=new ResizeObserver(resize);observer.observe(stage);
    function listen(el,name,fn){el.addEventListener(name,fn,{signal});}
    function requestDraw(){if(!frame&&!closed)frame=requestAnimationFrame(()=>{frame=0;draw();});}
    function resize(){
      state.width=stage.clientWidth;state.height=stage.clientHeight;
      const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(state.width*dpr);canvas.height=Math.round(state.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);requestDraw();
    }
    function draw(){
      if(!state.art||!state.width||!state.height)return;
      const {width,height}=state;state.view=G.camera(width,height,state.zoom,state.center,bounds);state.x=Math.max(0,Math.min(1,state.x));state.lens=G.divider(width,height,state.x,state.angle);
      const v=state.view,l=state.lens;
      const paint=img=>ctx.drawImage(img,(bounds.min-v.left)*v.scale,-v.top*v.scale,worldWidth*v.scale,724*v.scale);
      paint(layers[0]);
      ctx.save();ctx.translate(-v.left*v.scale,-v.top*v.scale);ctx.scale(v.scale,v.scale);
      if(state.people)dialog.dataset.people=String(state.people.draw(ctx,state.time,state.art[0],[v.left,v.left+v.span]));
      ctx.restore();ctx.save();ctx.beginPath();l.polygon.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.clip();
      if(state.era){
        ctx.save();ctx.filter='saturate(.45) contrast(1.06)';paint(layers[1]);ctx.restore();
      }
      ctx.save();ctx.translate(-v.left*v.scale,-v.top*v.scale);ctx.scale(v.scale,v.scale);
      if(state.people)dialog.dataset.modernPeople=String(state.people.drawModern(ctx,state.time,[v.left,v.left+v.span]));
      ctx.save();ctx.filter='saturate(.45) contrast(1.06)';
      window.TimeLensBridge.drawRailing(ctx,state.art[1],v.left,v.left+v.span);ctx.restore();ctx.restore();
      ctx.save();ctx.globalCompositeOperation='color';ctx.fillStyle='rgba(83,132,166,.42)';ctx.fillRect(0,0,width,height);ctx.restore();
      ctx.restore();
      mirror.style.left=`${l.x}px`;mirror.style.top=`${l.y}px`;mirror.style.height=`${Math.max(1,l.length)}px`;
      mirror.style.transform=`translate(-50%,-50%) rotate(${state.angle}deg)`;
      mirror.style.cursor=state.angle===90?'ns-resize':state.angle===0||state.angle===180?'ew-resize':state.angle<90?'nwse-resize':'nesw-resize';
      mirror.setAttribute('aria-orientation',state.angle===90?'vertical':'horizontal');
      mirror.setAttribute('aria-valuenow',String(Math.round(state.x*100)));eraRange.value=String(Math.round(state.x*100));
      const songPercent=Math.round(l.song*100);
      const sides=state.angle===0?['左侧','右侧']:state.angle===90?['上方','下方']:state.angle===180?['右侧','左侧']:state.angle<90?['左上','右下']:['右上','左下'];
      const comparison=`${sides[0]}宋代${songPercent}%，${sides[1]}今日${100-songPercent}%`;
      mirror.setAttribute('aria-valuetext',comparison);eraRange.setAttribute('aria-valuetext',comparison);
      canvas.setAttribute('aria-label',`方向键左右游览。同一条河岸街景，${comparison}，可拖动画面游览`);
      dialog.dataset.direction=state.angle===0?'horizontal':state.angle===90?'vertical':state.angle===180?'reverse':state.angle<90?'diagonal':'diagonal-reverse';
      angleRange.value=String(state.angle);angleValue.value=`${state.angle}°`;angleRange.setAttribute('aria-valuetext',`${state.angle}度，${sides[0]}宋代，${sides[1]}今日`);
      for(const button of dialog.querySelectorAll('[data-angle]'))button.setAttribute('aria-pressed',String(Number(button.dataset.angle)===state.angle));
      for(const button of dialog.querySelectorAll('[data-era]'))button.setAttribute('aria-pressed',String(Number(button.dataset.era)===0?state.x===1:state.x===0));
      const nearest=G.nearest(G.worldAt(v,l.x,l.y),stops);
      state.stop=nearest;
      for(const button of dialog.querySelectorAll('[data-stop]'))button.setAttribute('aria-pressed',String(button.dataset.stop===nearest.id));
      dialog.dataset.era=state.era?'today':'song';dialog.dataset.camera=v.left.toFixed(2);dialog.dataset.lensX=l.x.toFixed(2);dialog.dataset.lensY=l.y.toFixed(2);dialog.dataset.angle=String(state.angle);
    }
    function setEra(value){
      state.era=1;state.x=Number(value)===0?1:0;
      story.hidden=true;requestDraw();
    }
    async function load(){
      const revision=++loadRevision;loading.hidden=false;loading.querySelector('span').textContent='正在展开两幅街景…';loading.querySelector('button').hidden=true;stage.setAttribute('aria-busy','true');
      try{
        const [art,people]=await Promise.all([loadImages(),window.createTimeLensResidents()]);if(closed||revision!==loadRevision)return;
        layers=[compose(art[0],art[3],art[4]),compose(art[1],art[5],art[6])];state.art=art;state.people=people;loading.hidden=true;stage.setAttribute('aria-busy','false');for(const b of dialog.querySelectorAll('[disabled]'))b.disabled=false;resize();animate();
        const initialStop=new URLSearchParams(location.search).get('stop');
        if(stops.some(s=>s.id===initialStop))dialog.querySelector(`[data-stop="${initialStop}"]`).click();
      }catch(error){
        if(closed||revision!==loadRevision)return;
        loading.querySelector('span').textContent='街景未能载入，请重试。';loading.querySelector('button').hidden=false;stage.setAttribute('aria-busy','false');
      }
    }
    function animate(){
      clearTimeout(animationTimer);
      if(closed||document.hidden||reduced.matches||!state.people)return;
      const now=performance.now();state.time+=lastTick?Math.min((now-lastTick)/1000,.1):0;lastTick=now;requestDraw();
      animationTimer=setTimeout(animate,60);
    }
    listen(document,'visibilitychange',()=>{lastTick=0;animate();});
    listen(reduced,'change',()=>{lastTick=0;animate();});
    function close(){
      if(closed)return;closed=true;remembered={center:state.center,x:state.x,y:state.y,zoom:state.zoom,era:state.era,angle:state.angle};
      controller.abort();observer.disconnect();cancelAnimationFrame(frame);clearTimeout(animationTimer);dialog.close();dialog.remove();atlas.classList.remove('time-lens-active');document.body.classList.remove('time-lens-open');active=null;trigger.focus({preventScroll:true});
    }
    listen(dialog.querySelector('[data-close]'),'click',close);
    listen(dialog,'cancel',e=>{e.preventDefault();close();});
    listen(dialog,'close',close);
    listen(window,'hashchange',close);
    listen(dialog,'keydown',e=>e.stopPropagation());listen(dialog,'keyup',e=>e.stopPropagation());
    listen(dialog.querySelector('[data-retry]'),'click',load);
    listen(eraRange,'input',()=>{state.x=Number(eraRange.value)/100;story.hidden=true;requestDraw();});
    function setAngle(value){state.angle=G.clamp(Number(value),0,180);story.hidden=true;requestDraw();}
    listen(angleRange,'input',()=>setAngle(angleRange.value));
    for(const b of dialog.querySelectorAll('[data-angle]'))listen(b,'click',()=>setAngle(b.dataset.angle));
    for(const b of dialog.querySelectorAll('[data-era]'))listen(b,'click',()=>setEra(b.dataset.era));
    listen(zoom,'click',()=>{state.zoom=state.zoom===1?1.65:1;zoom.setAttribute('aria-pressed',String(state.zoom>1));zoom.setAttribute('aria-label',state.zoom>1?'退回全景':'放大细看');zoom.title=state.zoom>1?'退回全景':'放大细看';requestDraw();});
    for(const button of dialog.querySelectorAll('[data-stop]'))listen(button,'click',()=>{
      const stop=stops.find(s=>s.id===button.dataset.stop);state.center=(stop.x-bounds.min)/worldWidth;state.x=.5;state.y=.54;story.hidden=true;requestDraw();
      // Keep the comparison divider on the selected landmark.
      const v=G.camera(state.width,state.height,state.zoom,state.center,bounds);state.x=G.dividerPosition(state.width,state.height,(stop.x-v.left)*v.scale,(stop.y-v.top)*v.scale,state.angle);
    });
    listen(dialog.querySelector('[data-story]'),'click',()=>{
      dialog.querySelector('#tlStoryTitle').textContent=state.stop.title;dialog.querySelector('[data-then]').textContent=`画中 · ${state.stop.then}`;dialog.querySelector('[data-now]').textContent=`今日 · ${state.stop.now}`;story.hidden=false;story.querySelector('button').focus({preventScroll:true});
    });
    listen(story.querySelector('button'),'click',()=>{story.hidden=true;dialog.querySelector('[data-story]').focus({preventScroll:true});});
    function start(e,kind){
      if(!state.art||state.drag||(e.pointerType==='mouse'&&e.button!==0))return;
      e.preventDefault();e.stopPropagation();story.hidden=true;
      state.drag={id:e.pointerId,kind,startX:e.clientX,startY:e.clientY,position:state.x,axis:state.lens,view:state.view};e.currentTarget.setPointerCapture(e.pointerId);
    }
    listen(mirror,'pointerdown',e=>start(e,'lens'));listen(canvas,'pointerdown',e=>start(e,'pan'));
    function move(e){
      const d=state.drag;if(!d||e.pointerId!==d.id)return;e.preventDefault();
      if(d.kind==='lens'){state.x=G.clamp(d.position+((e.clientX-d.startX)*d.axis.nx+(e.clientY-d.startY)*d.axis.ny)/d.axis.span,0,1);}
      else state.center=G.pan(d.view,e.clientX-d.startX);
      requestDraw();
    }
    function end(e){if(state.drag?.id!==e.pointerId)return;state.drag=null;}
    for(const el of [canvas,mirror]){listen(el,'pointermove',move);listen(el,'pointerup',end);listen(el,'pointercancel',end);listen(el,'lostpointercapture',end);}
    listen(canvas,'keydown',e=>{
      if(!state.view||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();story.hidden=true;
      state.center=e.key==='Home'?0:e.key==='End'?1:G.pan(state.view,e.key==='ArrowLeft'?80:-80);requestDraw();
    });
    listen(mirror,'keydown',e=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();
      if(!state.lens)return;
      const horizontal=e.key==='ArrowLeft'||e.key==='ArrowRight';
      const component=horizontal?state.lens.nx:state.lens.ny;
      const direction=(e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1)*(Math.abs(component)<1e-8?1:Math.sign(component));
      state.x=e.key==='Home'?0:e.key==='End'?1:G.clamp(state.x+direction*.02,0,1);story.hidden=true;requestDraw();
    });
    zoom.setAttribute('aria-pressed',String(state.zoom>1));zoom.setAttribute('aria-label',state.zoom>1?'退回全景':'放大细看');zoom.title=state.zoom>1?'退回全景':'放大细看';state.era=1;void load();
  }
  for(const entry of entries)entry.addEventListener('click',()=>open(entry));
  if(new URLSearchParams(location.search).get('view')==='time-lens'&&entries[0])open(entries[0]);
})();
