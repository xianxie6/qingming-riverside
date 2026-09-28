(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  document.addEventListener('click',event=>{
    const control=event.target.closest('button,a.quiet-link');
    if(event.isTrusted&&control&&!control.disabled){
      window.SunyangSound.click();
      if(control.id!=='musicToggle')window.SunyangSound.start();
    }
  },true);
  $('musicToggle').addEventListener('click',()=>window.SunyangSound.toggle());
  const dishes=[
    {name:'胡饼',desc:'一味饼食，先垫垫旅途的饥肠。',path:['田间收麦','磨坊成粉','沿街送店','厨下制饼'],note:'从城外的麦田到临河磨坊，一份饼食，连着画卷里的日常劳作。',color:'#b99150'},
    {name:'乳炊羊',desc:'添一份羊肉，慢慢用些热食。',path:['牲畜供给','市集交易','店家采买','厨下烹制'],note:'商贩、脚夫与厨人各忙一程，才有桌上的这一味。',color:'#936e4e'},
    {name:'旋切莴苣',desc:'一碟清鲜菜蔬，配着酒食正好。',path:['城郊菜圃','清晨采收','挑担入市','洗切上桌'],note:'清早挑进城的菜蔬，也把城郊与街市的一日连在一起。',color:'#72825b'}
  ];
  dishes.push(
    {name:'炙鱼',path:['河中捕捞','鱼市鲜售','店家采买','慢火炙香'],note:'鱼鲜从河岸送入厨下，添一味鲜香。'},
    {name:'白切鸡',path:['乡间饲养','挑担入城','厨下煮熟','斩件上桌'],note:'清淡的鸡肉，配饼配蔬都合宜。'},
    {name:'笋肉包',path:['采笋收麦','市集采买','调馅包制','笼中蒸熟'],note:'松软面皮裹着笋肉，趁热慢用。'},
    {name:'桂花糕',path:['收米成粉','桂花入糖','厨下蒸糕','切块上桌'],note:'一口清甜，给这席酒食收个尾。'},
    {name:'时令鲜果',path:['果园采收','挑担入市','店家挑选','洗净上桌'],note:'梨、枣与葡萄，为席间添些清鲜。'}
  );
  dishes.push({name:'东坡肉',path:['市集采买','切块焯水','慢火煨炖','收汁上桌'],note:'慢火煨出的酱香，配一味饼食正好。'});
  ['hubing','ruchuiyang','woju','zhiyu','baiqieji','sunroubao','guihuagao','xianguo','dongporou'].forEach((file,i)=>dishes[i].image=`assets/food/${file}-v1.webp`);
  const anchors={door:[.135,.65],window:[.29,.57],hall:[.55,.60],kitchen:[.85,.54]};
  const tablePoints={window:[.29,.588],hall:[.55,.607]};
  const labels=['入店','寻席落座','点食备餐','一席已成'];
  let phase=0,seat='',selected=new Set(),served=false,menuOpen=false,previousFocus=null,menuGeneration=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const action=(label,value,primary=true)=>`<button class="${primary?'ink-button':'text-button'}" data-action="${value}">${label}</button>`;
  const seatName=()=>seat==='window'?'临窗席':'堂中席';
  let speakerKind='painter',speechTimer=null,speechGeneration=0;
  const host=new SunyangHost($('hostActor'),$('roomArt'),point);
  const painter=new SunyangPainter($('painterActor'),point,positionSpeech);
  const guests=new SunyangGuests($('sceneWorld'),point,dishes);
  const thinking=document.createElement('canvas');thinking.id='thinkingPainter';thinking.setAttribute('role','img');thinking.setAttribute('aria-label','客官托腮抬头，思考头顶菜单');
  const thought=document.createElement('p');thought.id='thinkingWords';
  thought.setAttribute('aria-label','全世界都安静了，只有我一个人在思考吃什么');
  function renderThought(){
    thought.replaceChildren();let index=0;
    for(const line of ['全世界都安静了，','只有我一个人在思考吃什么']){
      const row=document.createElement('span');row.className='thought-line';row.setAttribute('aria-hidden','true');
      for(const letter of line){
        const sample=document.createElement('canvas');sample.width=24;sample.height=24;
        const sc=sample.getContext('2d');sc.font='bold 21px "PingFang SC",sans-serif';sc.textBaseline='top';sc.fillText(letter,1,1);
        const pixels=sc.getImageData(0,0,24,24).data;
        const glyph=document.createElement('canvas');glyph.width=96;glyph.height=96;glyph.className='thought-glyph';glyph.style.setProperty('--char',index++);
        const gc=glyph.getContext('2d');gc.fillStyle='#fff0c8';
        for(let y=0;y<24;y++)for(let x=0;x<24;x++)if(pixels[(y*24+x)*4+3]>45){gc.beginPath();gc.arc(x*4+2,y*4+2,1.7,0,Math.PI*2);gc.fill();}
        row.append(glyph);
      }
      thought.append(row);
    }
    const dots=document.createElement('span');dots.className='thought-dots';dots.setAttribute('aria-hidden','true');dots.innerHTML='<i></i><i></i><i></i>';thought.append(dots);
  }
  renderThought();
  $('menuSheet').prepend(thinking,thought);
  const thinkingArt=new Image();
  thinkingArt.onload=()=>{
    const c=thinking.getContext('2d');thinking.width=thinkingArt.naturalWidth;thinking.height=thinkingArt.naturalHeight;c.drawImage(thinkingArt,0,0);
    const {data}=c.getImageData(0,0,thinking.width,thinking.height);let l=thinking.width,t=thinking.height,r=0,b=0;
    for(let y=0;y<thinking.height;y++)for(let x=0;x<thinking.width;x++)if(data[(y*thinking.width+x)*4+3]>96){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
    thinking.width=r-l+1;thinking.height=b-t+1;c.drawImage(thinkingArt,l,t,thinking.width,thinking.height,0,0,thinking.width,thinking.height);
    document.body.classList.add('thinking-ready');positionMenu();
  };
  thinkingArt.src='assets/painter-thinking-v1.webp';
  function positionSpeech(){
    const bubble=$('speechBubble');if(bubble.hidden)return;
    // Anchor to the crown, in the same source-art coordinates as the feet.
    const anchor=speakerKind==='painter'?[painter.x+.012*painter.facing,painter.y-painter.headHeight]:host.head;
    const [x,y]=point(anchor),world=$('sceneWorld');
    const bw=bubble.offsetWidth,bh=bubble.offsetHeight;
    const left=Math.max(8,Math.min(world.clientWidth-bw-8,x-bw/2));
    bubble.style.left=`${left}px`;
    bubble.style.top=`${Math.max(8,y-bh-22)}px`;
    bubble.style.setProperty('--tail-x',`${x-left}px`);
  }
  function hush(){clearTimeout(speechTimer);speechGeneration++;$('speechBubble').hidden=true;}
  function talk(lines,onComplete){
    hush();const token=speechGeneration;
    async function next(index){
      if(token!==speechGeneration)return;
      if(index>=lines.length){if(onComplete){hush();onComplete();}return;}
      const [kind,text]=lines[index];
      if(kind==='staff'&&seat){$('speechBubble').hidden=true;if(!await host.approach(seat)||token!==speechGeneration)return;}
      speakerKind=kind;if(kind==='staff')host.invite();$('speechName').textContent=kind==='painter'?'画师':'店中伙计';$('speechText').textContent=text.replace(/\n/g,'');$('speechBubble').hidden=false;positionSpeech();
      const [x]=point(kind==='painter'?[painter.x,painter.y]:host.head);
      $('sceneScroll').scrollTo({left:x-$('sceneScroll').clientWidth/2,behavior:reduced.matches?'instant':'smooth'});
      speechTimer=setTimeout(()=>next(index+1),3200);
    }next(0);
  }
  let roomView;
  function measureRoom(){
    const world=$('sceneWorld');roomView={width:world.clientWidth,height:world.clientHeight};
  }
  function point([x,y]){
    if(!roomView)measureRoom();
    const art=$('roomArt'),w=roomView.width,h=roomView.height;
    const nw=art.naturalWidth||1536,nh=art.naturalHeight||1024,scale=Math.max(w/nw,h/nh);
    return [x*nw*scale-(nw*scale-w)*.5,y*nh*scale-(nh*scale-h)*.55];
  }
  function place(el,anchor){const [x,y]=point(anchor);el.style.left=`${x}px`;el.style.top=`${y}px`;}
  function position(){
    measureRoom();
    // Register the window apertures to the same cover transform as the room.
    const art=$('roomArt'),world=$('sceneWorld'),layer=$('roomExterior');
    const width=art.naturalWidth||1536,height=art.naturalHeight||1024;
    const scale=Math.max(world.clientWidth/width,world.clientHeight/height);
    Object.assign(layer.style,{width:`${width*scale}px`,height:`${height*scale}px`,left:`${(world.clientWidth-width*scale)*.5}px`,top:`${(world.clientHeight-height*scale)*.55}px`});
    document.querySelectorAll('[data-place]').forEach(el=>place(el,el.dataset.place==='door'?[painter.x+.052,painter.y-painter.height*.66]:anchors[el.dataset.place]));
    if(seat){place($('seatMark'),tablePoints[seat]);SunyangGuests.layoutMeal($('tableMeal'),seat,point);}
    painter.position();host.position();guests.position();positionMenu();
  }
  function positionMenu(){
    if(!menuOpen)return;
    const rect=$('sceneScroll').getBoundingClientRect(),world=$('sceneWorld').getBoundingClientRect();
    const sheet=$('menuSheet');
    const menuTop=innerHeight<500?24:Math.max(65,rect.top+rect.height*.055);
    sheet.style.setProperty('--menu-top',`${menuTop}px`);
    sheet.style.setProperty('--menu-left',`${Math.max(12,rect.left+rect.width*.035)}px`);
    sheet.style.setProperty('--menu-width',`${Math.min(innerWidth-24,rect.width*.93)}px`);
    const [x,y]=point([painter.x+.045,painter.y-painter.headHeight+.035]);
    const button=$('prepare');
    button.style.left=`${Math.max(12,Math.min(innerWidth-button.offsetWidth-12,world.left+x))}px`;
    button.style.top=`${Math.max(120,Math.min(innerHeight-65,world.top+y))}px`;
    const [feetX,feetY]=point([painter.x,painter.y]);
    const seatedRatio=painter.frames? painter.frames[2].frame.h/painter.frames[0].frame.h:.76;
    const height=(point([0,painter.height])[1]-point([0,0])[1])*seatedRatio;
    const thinkingWidth=height*thinking.width/thinking.height;
    const visibleX=Math.max(thinkingWidth/2+12,Math.min(innerWidth-thinkingWidth/2-12,world.left+feetX));
    const visibleY=Math.min(innerHeight-16,world.top+feetY);
    Object.assign(thinking.style,{left:`${visibleX}px`,top:`${visibleY}px`,height:`${height}px`,width:`${thinkingWidth}px`});
    const wordsWidth=Math.min(300,innerWidth-32);
    Object.assign(thought.style,{width:`${wordsWidth}px`,left:`${Math.max(16,Math.min(innerWidth-wordsWidth-16,visibleX+height*.3))}px`,top:`${Math.max(80,visibleY-height-14)}px`});
    button.style.top=`${Math.min(innerHeight-60,visibleY-height*.36)}px`;
  }
  function lookAt(placeName){
    const [x]=point(anchors[placeName]),scroller=$('sceneScroll');
    scroller.scrollTo({left:x-scroller.clientWidth*.5,behavior:reduced.matches?'instant':'smooth'});
  }
  function menu(show){
    menuGeneration++;
    $('menuSheet').classList.remove('leaving');$('menuSheet').inert=false;
    $('menuSheet').removeAttribute('aria-busy');
    menuOpen=show;$('menuSheet').hidden=!show;$('menuShade').hidden=!show;
    document.body.classList.toggle('menu-open',show);
    document.querySelectorAll('.page-header,.intro,.scene-scroll,.pan-guide,#foodJourney,#steps').forEach(el=>el.inert=show);
    if(show){
      renderThought();
      previousFocus=document.activeElement;
      const title=$('menuTitle');
      title.innerHTML=[...'客官，想用些什么？'].map((letter,i)=>`<span aria-hidden="true" style="--i:${i};--wind-x:${85+i*13}px;--wind-y:${-35-(i%4)*19}px;--wind-turn:${i%2?14:-9}deg">${letter}</span>`).join('');
      title.setAttribute('aria-label','客官，想用些什么？');
      updateSelection();
      $('menuSheet').setAttribute('role','dialog');
      $('menuSheet').setAttribute('aria-modal','true');
      $('menuSheet').scrollTop=0;
      $('closeMenu').focus({preventScroll:true});
      positionMenu();
    }else{previousFocus?.focus({preventScroll:true});}
  }
  async function finishOrdering(){
    if($('menuSheet').classList.contains('leaving'))return false;
    if(!menuOpen)return true;
    const token=menuGeneration;
    $('menuSheet').classList.add('leaving');$('menuSheet').inert=true;
    $('menuSheet').setAttribute('aria-busy','true');
    await new Promise(resolve=>setTimeout(resolve,reduced.matches?0:1850));
    if(token!==menuGeneration)return false;
    menu(false);return true;
  }
  function updateSelection(){
    $('prepare').disabled=!selected.size;
    $('selectionNote').textContent=selected.size?`已点 ${selected.size} 味 · ${[...selected].map(i=>dishes[i].name).join('、')}`:'尚未点食';
    const kitchen=document.querySelector('[data-place="kitchen"]');
    kitchen.disabled=!selected.size;
    kitchen.querySelector('span').textContent=selected.size?'请伙计备餐':'先选几样酒食';
  }
  function render(focus=false){
    document.body.dataset.phase=['door','seat','menu','served'][phase];
    $('steps').innerHTML=labels.map((label,i)=>`<span class="${i===phase?'active':''}" ${i===phase?'aria-current="step"':''}><b>0${i+1}</b>${label}</span>`).join('');
    document.querySelectorAll('[data-place]').forEach(el=>{
      const key=el.dataset.place;el.hidden=!(phase===0?key==='door':phase===1?['window','hall'].includes(key):false);
    });
    $('seatMark').hidden=!seat||served;$('tableMeal').hidden=!served;
    $('actions').hidden=phase<2;
    $('actions').innerHTML=phase===2?action('食单 →','menu')+action('换一席','reseat',false):
      served?'':action('上菜','serve')+action('添菜','menu',false);
    $('dishes').innerHTML=dishes.map((dish,i)=>`<label class="dish" style="--dish-i:${i}"><input type="checkbox" value="${i}" aria-label="${dish.name}" ${selected.has(i)?'checked':''}><span class="food-portrait"><img src="${dish.image}" alt="" width="1024" height="1024" draggable="false"><span class="food-selected" aria-hidden="true">✓</span></span><span class="dish-name">${dish.name}</span></label>`).join('');
    if(served)$('tableMeal').innerHTML=[...selected].map(i=>`<img src="${dishes[i].image}" alt="${dishes[i].name}" width="48" height="40">`).join('');
    updateSelection();position();
    $('announcement').textContent=labels[phase];
    if(focus)document.querySelector('[data-place]:not([hidden]),#actions button')?.focus({preventScroll:true});
  }
  async function act(value){
    if((painter.moving||host.walking)&&value!=='restart')return;
    if(value==='enter'){
      host.invite();
      talk([['painter','伙计，\n歇歇脚！']]);
      if(!await painter.move(.21,.80))return;
      phase=1;render(true);talk([['staff','客官，\n里面请！']]);
    }
    else if(value==='window'||value==='hall'){
      hush();seat=value;lookAt(value);
      const token=speechGeneration;
      const arrived=await Promise.all([
        painter.move(value==='window'?.225:.447,value==='window'?.727:.746,true),
        host.approach(value)
      ]);
      if(token!==speechGeneration||arrived.some(done=>!done))return;
      phase=2;render(true);
      talk([['staff','好嘞！\n客官吃点啥？']],()=>{if(phase===2&&seat===value&&!menuOpen)menu(true);});
    }
    else if(value==='menu'){hush();phase=2;served=false;render();menu(true);}
    else if(value==='prepare'||value==='kitchen'){if(!selected.size||!await finishOrdering())return;phase=3;render(true);guests.enter(seat);talk([['painter','伙计，\n照食单上吧！'],['staff','好嘞，\n这就来！']]);}
    else if(value==='serve'){if(!selected.size||!seat)return;served=true;render(true);talk([['staff','酒食齐了，\n客官慢用！'],['painter','有劳，\n有劳！']]);}
    else if(value==='reseat'){hush();host.cancelWalk();menu(false);seat='';if(!await painter.move(.21,.80))return;phase=1;render(true);lookAt('window');}
    else if(value==='restart'){hush();guests.reset();host.reset();painter.reset();menu(false);phase=0;seat='';served=false;selected.clear();render(true);lookAt('door');talk([['staff','客官，\n里面请！']]);}
  }
  document.addEventListener('click',e=>{const el=e.target.closest('[data-action],[data-place]');if(el)act(el.dataset.action||(el.dataset.place==='door'?'enter':el.dataset.place));});
  $('restart').addEventListener('click',()=>act('restart'));
  $('prepare').addEventListener('click',()=>act('prepare'));
  $('closeMenu').addEventListener('click',()=>menu(false));
  $('menuShade').addEventListener('click',()=>menu(false));
  $('dishes').addEventListener('change',e=>{if(!e.target.matches('input'))return;const i=Number(e.target.value);e.target.checked?selected.add(i):selected.delete(i);window.SunyangSound.select();window.SunyangSound.start();updateSelection();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&menuOpen){e.preventDefault();menu(false);}
    if(e.key==='Tab'&&menuOpen){
      const items=[...$('menuSheet').querySelectorAll('button:not(:disabled),input')],first=items[0],last=items.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  $('roomArt').addEventListener('load',position);
  window.addEventListener('resize',positionMenu);
  window.addEventListener('scroll',positionMenu,{passive:true});
  $('sceneScroll').addEventListener('scroll',positionMenu,{passive:true});
  $('roomArt').addEventListener('error',()=>{$('announcement').textContent='店堂画面未能载入，请重新载入页面。';});
  document.fonts.ready.then(positionSpeech);
  new ResizeObserver(position).observe($('sceneWorld'));render();talk([['staff','客官，\n里面请！']]);
})();
