(() => {
  'use strict';
  // All geometry is authored in the original panorama's 2172 × 724 coordinates.
  const W=2172,H=724,NS='http://www.w3.org/2000/svg';
  const places=[
    {id:'mill',name:'水磨作坊',box:[76,298,244,174],label:[210,514],world:-1550,description:'水轮随汴水转动，磨坊与作坊临河而立。岸边车马往来，日常生计在水声中展开。'},
    {id:'tea',name:'沿河茶市',box:[470,232,397,252],label:[665,528],world:650,description:'茶肆沿河相接，檐下摆开桌案。商旅在这里歇脚饮茶，也把远方的消息带入街市。'},
    {id:'bridge',name:'虹桥烟火',box:[861,283,493,212],label:[1100,561],world:1560,description:'虹桥飞架汴河，两岸人流在桥头交汇。船只穿行桥下，水路与街市在此相逢。'},
    {id:'gate',name:'城门货市',box:[1680,75,488,445],label:[1908,567],world:3360,description:'城楼俯瞰繁忙的货市，车马从城门出入。临河货栈与摊铺相连，汇聚汴京的日用百货。'}
  ];
  const atlas=document.querySelector('#atlas'),frame=document.querySelector('#atlasFrame'),img=document.querySelector('#atlasImage'),message=document.querySelector('#atlasMessage');
  const fileMode=location.protocol==='file:';
  const localPreviewHint='请双击项目中的“打开清明上河.command”启动交互预览';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const stage=document.createElement('div');stage.id='atlasStage';frame.before(stage);stage.append(frame);
  const nav=document.querySelector('#atlasPlaces');nav.replaceChildren();atlas.append(nav);nav.setAttribute('aria-label','长卷景点');nav.setAttribute('role','navigation');
  document.querySelector('#atlasInk').remove();
  const svg=document.createElementNS(NS,'svg');svg.id='atlasDraft';svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('aria-hidden','true');frame.append(svg);
  const defs=document.createElementNS(NS,'defs');svg.append(defs);
  // Full-size registered artwork only. Missing artwork never falls back to a filter.
  const layers=new Map();let draftReady=false,selected=null,hovered=null,focused=null,paintingHovered=false,revision=0,lastTrigger=null,entryStatus=false;
  const card=document.createElement('article');card.id='atlasCard';card.hidden=true;card.innerHTML='<span class="atlas-kicker">汴河拾景</span><h2></h2><p></p>';atlas.append(card);
  const live=document.createElement('button');live.id='atlasLive';live.hidden=true;live.setAttribute('aria-label','走入动态街市');live.innerHTML='<span>走入动态街市</span><i aria-hidden="true">↗</i>';frame.append(live);
  const back=document.createElement('button');back.id='atlasOverview';back.textContent='← 退回长卷';back.hidden=true;atlas.append(back);
  function element(tag,attrs,parent){const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);parent.append(el);return el;}
  for(const [i,p] of places.entries()){
    const [x,y,w,h]=p.box;
    const mask=element('mask',{id:`draft-${p.id}`,maskUnits:'userSpaceOnUse',x:0,y:0,width:W,height:H},defs);
    const filter=element('filter',{id:`paper-${p.id}`,x:'-5%',y:'-5%',width:'110%',height:'110%'},defs);
    element('feTurbulence',{type:'fractalNoise',baseFrequency:'.045',numOctaves:3,seed:i+2,result:'grain'},filter);
    element('feDisplacementMap',{in:'SourceGraphic',in2:'grain',scale:5,xChannelSelector:'R',yChannelSelector:'G'},filter);
    element('rect',{x:x-12,y:y-12,width:w+24,height:h+24,rx:24,fill:'white',filter:`url(#paper-${p.id})`},mask);
    const layer=element('g',{mask:`url(#draft-${p.id})`,class:'draft-region'},svg);
    const art=element('image',{x:0,y:0,width:W,height:H,preserveAspectRatio:'none'},layer);layers.set(p.id,{layer,art});
    const hotspot=document.createElement('button');hotspot.className='atlas-hotspot';hotspot.dataset.place=p.id;hotspot.setAttribute('aria-label',`${p.name}，点击入画`);hotspot.style.cssText=`left:${x/W*100}%;top:${y/H*100}%;width:${w/W*100}%;height:${h/H*100}%`;frame.append(hotspot);
    const marker=document.createElement('button');marker.className='atlas-scene-marker';marker.dataset.place=p.id;marker.setAttribute('aria-label',`${p.name}，点击进入动态街市`);marker.innerHTML=`<span>${p.name}</span><i aria-hidden="true">↗</i>`;marker.style.cssText=`left:${(x+w*.5)/W*100}%;top:${(y+h*.48)/H*100}%`;frame.append(marker);
    const label=document.createElement('button');label.className='atlas-label';label.dataset.place=p.id;label.innerHTML=`<small>0${i+1}</small><span>${p.name}</span><em>点击入画</em>`;nav.append(label);
    for(const button of [hotspot,marker,label]){
      button.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hovered=p.id;preview();}});
      button.addEventListener('pointerleave',()=>{hovered=null;preview();});
      button.addEventListener('focus',()=>{focused=p.id;preview();});
      button.addEventListener('blur',()=>{focused=null;preview();});
      button.addEventListener('click',()=>launchScene(p,button===hotspot?marker:button));
    }
  }
  let preloadStarted=false;
  frame.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){paintingHovered=true;preview();if(!preloadStarted){preloadStarted=true;window.loadQingmingScene().catch(()=>{preloadStarted=false;});}}});
  frame.addEventListener('pointerleave',()=>{paintingHovered=false;preview();});
  function preview(){
    const id=null;
    const showingChoices=paintingHovered||Boolean(focused);
    for(const p of places){layers.get(p.id).layer.classList.toggle('revealed',false);for(const b of document.querySelectorAll(`[data-place="${p.id}"]`))b.classList.toggle('preview',showingChoices||id===p.id);for(const b of document.querySelectorAll(`.atlas-scene-marker[data-place="${p.id}"]`)){b.classList.toggle('visible',showingChoices);b.tabIndex=showingChoices?0:-1;}}
    if(!entryStatus)message.textContent=fileMode?localPreviewHint:selected?'可直接切换景点 · Esc 退回长卷':showingChoices?'点击景点漫游街市':'移笔游目，点景入画';
  }
  function layout(){
    const r=stage.getBoundingClientRect();if(!r.width||!r.height)return;
    // Keep both banks at the viewport edges; the sky has its own responsive fit.
    let scale=r.width/W,tx=0,ty=Math.max(0,r.height-H*scale);
    if(r.width<=600)ty=(r.height-H*scale)*.6;
    const skyline=ty+H*scale*.2,skyHeight=Math.min(r.width/3,Math.max(100,skyline/.62));
    stage.style.setProperty('--atlas-sky-height',`${skyHeight}px`);
    stage.style.setProperty('--atlas-sky-top',`${Math.max(0,skyline-skyHeight*.62)}px`);
    if(selected){const [x,y,w,h]=selected.box,pad=Math.min(40,r.width*.06);scale=Math.min((r.width-pad*2)/w,(r.height-pad*2)/h);tx=r.width/2-(x+w/2)*scale;ty=r.height/2-(y+h/2)*scale;}
    frame.style.setProperty('--atlas-label-scale',String(1/scale));
    frame.style.transform=`translate(${tx}px,${ty}px) scale(${scale})`;
    atlas.dataset.place=selected?.id||'overview';
  }
  async function enter(p,button){
    const token=++revision;lastTrigger=button;selected=p;hovered=null;focused=null;preview();card.hidden=true;live.hidden=true;back.hidden=false;
    const [x,y,w,h]=p.box;live.style.left=`${x+w*.1}px`;live.style.top=`${y+h*.62}px`;
    for(const b of nav.children)b.setAttribute('aria-current',String(b.dataset.place===p.id));
    // Give the color layer time to return before camera movement.
    await new Promise(r=>setTimeout(r,reduced.matches?0:420));if(token!==revision)return;
    atlas.classList.add('inspecting');layout();await new Promise(r=>setTimeout(r,reduced.matches?0:1050));if(token!==revision)return;
    card.querySelector('h2').textContent=p.name;card.querySelector('p').textContent=p.description;card.hidden=false;live.hidden=false;
    message.textContent=`已到达${p.name} · Esc 退回长卷`;
  }
  function overview(){++revision;selected=null;hovered=null;focused=null;paintingHovered=false;card.hidden=true;live.hidden=true;back.hidden=true;atlas.classList.remove('inspecting');for(const b of nav.children)b.removeAttribute('aria-current');layout();preview();lastTrigger?.focus({preventScroll:true});}
  back.addEventListener('click',()=>{setRoute('');showOverview();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!atlas.hidden){e.preventDefault();setRoute('');showOverview();}});
  function isolate(on){for(const el of document.body.children)if(el!==atlas&&el.tagName!=='SCRIPT')el.inert=on;document.querySelector('#atlasReturn').hidden=on;}
  const pendingButtons=new Map();
  function setRoute(hash){
    if(location.hash!==hash)history.pushState(null,'',location.pathname+location.search+hash);
  }
  async function launchScene(place,button,{restore=false,festival=false}={}){
    if(!place)return;
    if(fileMode){message.textContent=localPreviewHint;return;}
    const token=++revision,original=pendingButtons.get(button)?.original??button.innerHTML;
    pendingButtons.set(button,{token,original});
    if(!restore)setRoute(`#${place.id}`);
    entryStatus=true;
    button.disabled=true;button.querySelector('span').textContent='正在进入…';const icon=button.querySelector('i');if(icon)icon.hidden=true;message.textContent='正在展开动态街市，请稍候';
    try{
      await window.loadQingmingScene();
      if(token!==revision)return;
      await window.prepareQingmingEntry(place.world);
      if(token!==revision)return;
      window.dispatchEvent(new CustomEvent('atlas-enter',{detail:{x:place.world}}));
      entryStatus=false;
      atlas.hidden=true;document.body.classList.remove('in-atlas');isolate(false);document.querySelector('#painting').focus();
      if(festival)document.querySelector('#midautumnEntry').click();
      window.warmQingmingDistricts();
    }catch(error){
      if(token!==revision)return;
      console.error(error);message.textContent='动态街市加载失败，请检查网络后重试。';
      const retry=document.createElement('button');retry.id='atlasRetry';retry.textContent='重新载入';
      retry.addEventListener('click',()=>location.reload());message.append(retry);
    }finally{
      if(pendingButtons.get(button)?.token===token){button.disabled=false;button.innerHTML=original;pendingButtons.delete(button);}
      if(token===revision)atlas.classList.remove('route-loading');
    }
  }
  live.addEventListener('click',()=>launchScene(selected,live));
  function showOverview(){
    entryStatus=false;atlas.classList.remove('route-loading');
    for(const [button,{original}] of pendingButtons){button.disabled=false;button.innerHTML=original;}
    pendingButtons.clear();
    atlas.hidden=false;document.body.classList.add('in-atlas');isolate(true);overview();
  }
  document.querySelector('#atlasReturn').addEventListener('click',()=>{setRoute('');showOverview();});
  const load=()=>{if(img.naturalWidth!==W||img.naturalHeight!==H){message.textContent='原图尺寸已改变，请重新校准景点坐标';return;}layout();preview();};
  img.addEventListener('load',load);img.addEventListener('error',()=>{message.textContent='画卷加载失败，请刷新重试';});if(img.complete&&img.naturalWidth)load();

  new ResizeObserver(layout).observe(stage);reduced.addEventListener('change',layout);isolate(true);
  function restoreRoute(){
    if(fileMode)return;
    let id=location.hash.slice(1);
    if(id==='midautumn'&&document.body.dataset.midautumnEnabled!=='true'){
      id='gate';history.replaceState(null,'',location.pathname+location.search+'#gate');
    }
    const festival=id==='midautumn';
    const dialog=document.querySelector('#midautumnWelcome');
    if(dialog.open&&!festival)dialog.close();
    // Keep the existing shop return URL landing outside the tea-market building.
    const place=id==='sunyang'?{...places.find(p=>p.id==='tea'),world:380}:places.find(p=>p.id===(festival?'gate':id));
    if(!place){showOverview();return;}
    atlas.classList.add('route-loading');
    void launchScene(place,nav.querySelector(`[data-place="${place.id}"]`),{restore:true,festival});
  }
  window.addEventListener('hashchange',restoreRoute);
  window.AtlasTour={places,layout,setRoute,get selected(){return selected?.id||null;}};
  restoreRoute();
  // Optional replacement must have exactly the same canvas, crop and registration.
  if(!fileMode)fetch('assets/atlas-draft.json').then(r=>r.json()).then(async manifest=>{
    if(!manifest.src)return;
    const draft=new Image();draft.src=manifest.src;await draft.decode();
    if(draft.naturalWidth!==W||draft.naturalHeight!==H)throw Error('Draft dimensions do not match panorama');
    for(const {art} of layers.values())art.setAttribute('href',manifest.src);draftReady=true;preview();
  }).catch(error=>console.warn('Aligned atlas draft unavailable:',error));
})();
