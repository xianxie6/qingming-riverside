(() => {
  'use strict';
  const entry=document.querySelector('#paperTheatreEntry');
  const chapters=[
    {name:'柳岸初晴',mark:'壹',line:'水轮带动磨坊，挑担人把新粮送往沿街货摊。',story:'一担春色过汴河',text:'水轮拨开河水，带动磨坊。脚夫接过新粮，沿着作坊前的石路送往货摊；陶匠在隔壁的案前俯身忙碌。'},
    {name:'茶坊闲话',mark:'贰',line:'茶客坐在棚下，茶博士提壶续水，桌上热气未散。',story:'且坐，茶还温着',text:'茶客坐在铺前的木桌旁，茶博士提壶为他续水。棚檐遮在头上，桌沿挡住衣袍，杯中升起一缕热气。'},
    {name:'虹桥相逢',mark:'叁',line:'船夫撑船过桥，孩子伏在栏边，循着船声探望。',story:'桥头的一次相逢',text:'孩子站在桥面上，隔着木栏探看。船夫的双脚踏在船板上，竹篙探入河水；船身移动，水纹跟着船尾展开。'},
    {name:'城门归客',mark:'肆',line:'旅人穿门入城，脚夫在货栈前装袋交货。',story:'长卷未尽，来日再游',text:'旅人从门洞走入城中，身影渐渐变小。货栈的脚夫俯身装袋，粮包挡住他的下摆，下一担货正等着上路。'}
  ];
  let active=false,remembered=0;
  entry.addEventListener('click',async event=>{
    event.stopPropagation();if(active)return;active=true;
    const controller=new AbortController(),{signal}=controller;
    const dialog=document.createElement('dialog');dialog.id='paperTheatreDialog';dialog.setAttribute('aria-labelledby','paperTheatreTitle');
    dialog.innerHTML=`<div class="pt-shell">
      <header class="pt-header"><button data-close autofocus>← <span>返回长卷</span></button><div class="pt-brand"><span class="pt-seal" aria-hidden="true">纸境</span><h2 id="paperTheatreTitle">纸上汴京</h2><span class="pt-edition">清明上河 · 叠景长卷</span></div><button data-play aria-pressed="false" disabled>▷ 自动游卷</button></header>
      <nav class="pt-chapters" aria-label="画卷篇章">${chapters.map((c,i)=>`<button data-chapter="${i}" aria-current="${i===0?'step':'false'}"><small>${c.mark}</small>${c.name}</button>`).join('')}</nav>
      <div class="pt-stage" aria-busy="true"><canvas tabindex="0" role="img" aria-label="分层剪纸画境：柳岸、茶坊、虹桥与城门。左右拖动、滚动或按方向键游览；点击人物展开画中小事。"></canvas>
        <div class="pt-inscription"><span data-mark>壹</span><div><p>汴河畔 · 春日</p><h3 data-title>柳岸初晴</h3></div></div>
        <button class="pt-arrow pt-prev" data-prev aria-label="上一景" disabled>←</button><button class="pt-arrow pt-next" data-next aria-label="下一景" disabled>→</button>
        <div class="pt-loading" role="status"><span>正在裁景，铺开汴京…</span><button data-retry hidden>重新展开</button></div>
        <aside class="pt-story" hidden aria-labelledby="paperStoryTitle"><button data-story-close aria-label="收起画中小事">×</button><small>画中小事</small><h3 id="paperStoryTitle"></h3><p data-story-text></p><span>据画意编写</span></aside>
        <aside class="pt-wardrobe" hidden aria-labelledby="paperWardrobeTitle"><button data-wardrobe-close aria-label="收起人物妆造">×</button><small>妆造小笺 · 画中人</small><h3 id="paperWardrobeTitle">行旅书生</h3><canvas class="pt-portrait" role="img" aria-label="人物妆造细节"></canvas><p data-palette></p><nav data-characters aria-label="选择妆造人物"></nav></aside><span class="pt-stage-note" aria-hidden="true">点水轮、茶桌、木船，唤动画中小事</span>
      </div>
      <footer class="pt-footer"><div class="pt-caption"><p data-caption role="status">${chapters[0].line}</p><nav class="pt-caption-actions" aria-label="画中细节"><button data-wardrobe aria-expanded="false" disabled>人物妆造</button><button data-story disabled>画中小事 ↗</button></nav></div>
        <div class="pt-navigation"><span class="pt-page"><b data-page>01</b> / 12 景</span><nav class="pt-shots" aria-label="十二景">${Array.from({length:12},(_,i)=>`<button data-shot="${i}" aria-label="第${i+1}景 · ${chapters[Math.min(3,Math.floor(i/3))].name}" aria-current="${i===0?'step':'false'}"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('')}</nav><button data-spread aria-pressed="false" disabled>展开纸层</button></div>
        <div class="pt-bottom"><span>拖动或滚动游览 · ← → 换景 · 空格自动</span><label class="pt-slider-label">游卷进度<input data-seek type="range" min="0" max="1000" value="0" aria-label="纸上汴京游卷进度" disabled></label><span>淡墨设色 · 一纸千年</span></div>
      </footer></div>`;
    document.body.append(dialog);dialog.showModal();document.body.classList.add('paper-theatre-open');
    const atlas=document.querySelector('#atlas');atlas.classList.add('paper-theatre-active');
    const $=selector=>dialog.querySelector(selector),listen=(node,type,fn,options={})=>node.addEventListener(type,fn,{...options,signal});
    const canvas=$('canvas'),stage=$('.pt-stage'),play=$('[data-play]'),seek=$('[data-seek]');
    let visual=null,loadedArt=null,playing=false,hits=[],shot=-1,chapter=0,drag=null,spread=false,loading=false;
    function close(){if(signal.aborted)return;remembered=visual?.progress??remembered;controller.abort();visual?.dispose();dialog.close();dialog.remove();document.body.classList.remove('paper-theatre-open');atlas.classList.remove('paper-theatre-active');active=false;entry.focus({preventScroll:true});}
    function setPlaying(value){playing=value;visual?.play(value);play.setAttribute('aria-pressed',String(value));play.textContent=value?'Ⅱ 暂停游卷':'▷ 自动游卷';}
    function move(p){if(!visual)return;setPlaying(false);visual.seek(p);$('.pt-story').hidden=true;}
    function showStory(which=chapter){setPlaying(false);visual?.interact(which);$('#paperStoryTitle').textContent=chapters[which].story;$('[data-story-text]').textContent=chapters[which].text;$('.pt-story').hidden=false;}
    function update({progress,playing:running,hits:positions}){
      hits=positions;if(playing!==running)setPlaying(running);
      if(document.activeElement!==seek)seek.value=String(Math.round(progress*1000));
      const next=Math.min(11,Math.round(progress*11));if(next===shot)return;shot=next;chapter=Math.min(3,Math.floor(shot/3));
      $('[data-page]').textContent=String(shot+1).padStart(2,'0');$('[data-title]').textContent=chapters[chapter].name;$('[data-mark]').textContent=chapters[chapter].mark;$('[data-caption]').textContent=chapters[chapter].line;
      for(const btn of dialog.querySelectorAll('[data-shot]'))btn.setAttribute('aria-current',Number(btn.dataset.shot)===shot?'step':'false');
      for(const btn of dialog.querySelectorAll('[data-chapter]'))btn.setAttribute('aria-current',Number(btn.dataset.chapter)===chapter?'step':'false');
      $('[data-prev]').disabled=shot===0;$('[data-next]').disabled=shot===11;
    }
    async function load(){
      if(loading)return;loading=true;$('.pt-loading').hidden=false;$('[data-retry]').hidden=true;
      $('.pt-loading span').textContent='正在裁景，铺开汴京…';
      try{
        const {loadPaperArt,createPaperScene}=await import('./paper-theatre-scene.js?v=6');const art=await loadPaperArt();if(signal.aborted)return;
        loadedArt=art;visual=createPaperScene(canvas,art,update);visual.seek(remembered);
        $('.pt-loading').hidden=true;stage.setAttribute('aria-busy','false');
        for(const control of dialog.querySelectorAll('[data-play],[data-seek],[data-spread],[data-story],[data-wardrobe]'))control.disabled=false;
      }catch(error){if(signal.aborted)return;$('.pt-loading span').textContent='画片暂未展开，请重试。';$('[data-retry]').hidden=false;stage.setAttribute('aria-busy','false');}
      finally{loading=false;}
    }
    const wardrobeNames=['行旅书生','青衫过客','春日仕女','挑担脚夫','茶坊侍者','提壶茶博士','闲坐茶客','席间说书人','捧碗食客','桥头先生','柳下童子','货栈伙计','汴河船夫'];
    const palettes=['豆绿 · 米白 · 深灰绿','雾蓝 · 石褐 · 暖灰','米白 · 藕荷 · 微青玉饰','石褐 · 墨蓝 · 本色竹编','旧金 · 米白 · 深橄榄','灰绿 · 石褐 · 墨色壶','象牙白 · 浅石青','灰紫 · 烟褐 · 墨色巾','鼠尾草绿 · 米白','烟灰蓝 · 象牙白','浅豆绿 · 灰米色','淡赭 · 墨蓝 · 本色麻衣','灰青 · 墨蓝 · 麦色竹笠'];
    function portrait(index){
      if(!loadedArt)return;
      const picture=$('.pt-portrait'),c=picture.getContext('2d'),sprite=index===12?loadedArt.crew:loadedArt.figures[index];picture.width=600;picture.height=650;
      c.clearRect(0,0,600,650);const scale=Math.min(490/sprite.width,595/sprite.height);c.drawImage(sprite,300-sprite.width*scale/2,625-sprite.height*scale,sprite.width*scale,sprite.height*scale);
      $('#paperWardrobeTitle').textContent=wardrobeNames[index];$('[data-palette]').textContent=palettes[index];picture.setAttribute('aria-label',wardrobeNames[index]+'妆造细节，'+palettes[index]);
      for(const button of $('[data-characters]').children)button.setAttribute('aria-pressed',String(Number(button.dataset.person)===index));
    }
    function hideWardrobe(){$('.pt-wardrobe').hidden=true;$('[data-wardrobe]').setAttribute('aria-expanded','false');$('[data-wardrobe]').focus({preventScroll:true});}
    wardrobeNames.forEach((name,i)=>{const button=document.createElement('button');button.textContent=name;button.dataset.person=i;button.setAttribute('aria-pressed','false');$('[data-characters]').append(button);listen(button,'click',()=>portrait(i));});
    listen($('[data-wardrobe]'),'click',()=>{setPlaying(false);$('.pt-story').hidden=true;$('.pt-wardrobe').hidden=false;$('.pt-wardrobe').scrollTop=0;$('[data-wardrobe]').setAttribute('aria-expanded','true');portrait(2);$('[data-wardrobe-close]').focus({preventScroll:true});});
    listen($('[data-wardrobe-close]'),'click',hideWardrobe);
    listen($('[data-close]'),'click',close);listen(dialog,'cancel',e=>{e.preventDefault();if(!$('.pt-wardrobe').hidden){hideWardrobe();return;}close();});listen(window,'hashchange',close);
    listen($('[data-retry]'),'click',load);listen(play,'click',()=>setPlaying(!playing));
    listen($('[data-prev]'),'click',()=>move((shot-1)/11));listen($('[data-next]'),'click',()=>move((shot+1)/11));
    for(const btn of dialog.querySelectorAll('[data-shot]'))listen(btn,'click',()=>move(Number(btn.dataset.shot)/11));
    for(const btn of dialog.querySelectorAll('[data-chapter]'))listen(btn,'click',()=>move(Number(btn.dataset.chapter)*3/11));
    listen(seek,'input',()=>move(Number(seek.value)/1000));
    listen($('[data-story]'),'click',()=>showStory());listen($('[data-story-close]'),'click',()=>{$('.pt-story').hidden=true;});
    listen($('[data-spread]'),'click',()=>{spread=!spread;visual?.spread(spread);$('[data-spread]').setAttribute('aria-pressed',String(spread));$('[data-spread]').textContent=spread?'收拢纸层':'展开纸层';});
    listen(dialog,'keydown',e=>{
      e.stopPropagation();if(e.target.matches('input')||e.target.closest('.pt-wardrobe'))return;
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move((shot+(e.key==='ArrowRight'?1:-1))/11);}
      if(e.key==='Home'||e.key==='End'){e.preventDefault();move(e.key==='Home'?0:1);}
      if(e.code==='Space'&&!e.target.closest('button')){e.preventDefault();if(visual)setPlaying(!playing);}
    });listen(dialog,'keyup',e=>e.stopPropagation());
    listen(canvas,'pointerdown',e=>{if(!visual||e.button!==0)return;setPlaying(false);drag={id:e.pointerId,x:e.clientX,y:e.clientY,p:visual.progress,moved:false};canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});});
    listen(canvas,'pointermove',e=>{
      const box=canvas.getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top;
      visual?.look((x/box.width-.5)*2,(y/box.height-.5)*2);
      if(drag&&drag.id===e.pointerId){const dx=e.clientX-drag.x;if(Math.abs(dx)>5)drag.moved=true;if(drag.moved)move(drag.p-dx/(box.height*3.8));}
      canvas.style.cursor=drag?'grabbing':hits.some(h=>x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h)?'pointer':'grab';
    });
    listen(canvas,'pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;if(!drag.moved){const b=canvas.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;const hit=hits.findLast(h=>x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h);if(hit)showStory(hit.chapter);}drag=null;});
    listen(canvas,'pointercancel',()=>{drag=null;});listen(canvas,'lostpointercapture',()=>{drag=null;});listen(canvas,'pointerleave',()=>visual?.look(0,0));
    listen(stage,'wheel',e=>{if(!visual||e.target.closest('.pt-story,.pt-wardrobe'))return;e.preventDefault();const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;move(visual.progress+d*(e.deltaMode===1?16:e.deltaMode===2?stage.clientHeight:1)/(stage.clientHeight*6));},{passive:false});
    listen(document,'visibilitychange',()=>{if(document.hidden)setPlaying(false);});
    await load();
  });
})();
