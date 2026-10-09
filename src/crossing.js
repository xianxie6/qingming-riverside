(() => {
  'use strict';
  const entry=document.querySelector('#crossingEntry');
  let active=null,musicEnabled=true;
  entry.addEventListener('click',async event=>{
    event.stopPropagation();
    if(active)return;
    if(location.protocol==='file:'){
      document.querySelector('#atlasMessage').textContent='请双击“打开清明上河.command”启动穿越体验';return;
    }
    const controller=new AbortController(),{signal}=controller;
    active=controller;entry.disabled=true;
    const dialog=document.createElement('dialog');dialog.id='crossingDialog';
    dialog.setAttribute('aria-labelledby','crossingTitle');
    dialog.innerHTML='<div class="crossing-caption"><h2 id="crossingTitle">虹桥初成</h2></div><div class="crossing-top-actions"><button id="crossingCancel" autofocus>← 返回长卷</button><button id="crossingSound" type="button" aria-label="穿越背景音乐" aria-pressed="true">关闭声音</button><button id="crossingSkip">直接入画 ↗</button></div><div class="crossing-navigation"><p id="crossingStatus" role="status" aria-live="polite">正在搭建虹桥…</p><button id="crossingAuto" aria-pressed="false" disabled>启程</button><button id="crossingBurst" type="button">打散 · 重聚</button><div class="crossing-track"><span>木梁合拢</span><input id="crossingSeek" type="range" min="0" max="1000" value="0" aria-label="穿越进度" disabled><span>宋人相逢</span></div></div><section class="crossing-welcome" hidden aria-label="与宋人相逢"><div class="crossing-welcome-name"><span>汴京画客</span><small>相逢 · 虹桥畔</small></div><p id="crossingDialogue" role="status" aria-live="polite">客官初来汴京？随我去虹桥看看。</p><div class="crossing-welcome-actions"><button id="crossingGuide">随他游街 ↗</button><button id="crossingAsk" aria-expanded="false">问问汴京</button><button id="crossingAlone">自行入画</button></div><div id="crossingQuestions" hidden><button data-question="bridge">虹桥有何奇处？</button><button data-question="tea">何处歇脚饮茶？</button><button data-question="painter">你在画些什么？</button></div></section><div id="crossingProgress" aria-hidden="true"></div>';
    document.body.append(dialog);dialog.showModal();
    const soundButton=dialog.querySelector('#crossingSound');
    const music=new window.CrossingAudio({enabled:musicEnabled,onChange:()=>{
      const audible=music.enabled&&!music.blocked;
      soundButton.textContent=audible?'关闭声音':'开启声音';
      soundButton.setAttribute('aria-pressed',String(audible));
    }});
    soundButton.addEventListener('click',()=>{music.toggle();musicEnabled=music.enabled;});
    document.addEventListener('visibilitychange',()=>music.setActive(!document.hidden),{signal});
    // Start in the entry gesture so mobile browsers can authorize playback.
    music.setActive(!document.hidden);
    const atlas=document.querySelector('#atlas');atlas.classList.add('crossing-active');
    const status=dialog.querySelector('#crossingStatus'),skip=dialog.querySelector('#crossingSkip');
    let visual=null,leaving=false,committing=false,done=false,failed=false,welcoming=false;
    const welcome=dialog.querySelector('.crossing-welcome'),dialogue=dialog.querySelector('#crossingDialogue');
    function meeting(show){
      if(show===welcoming)return;welcoming=show;welcome.hidden=!show;
      if(show){dialog.classList.add('crossing-welcoming');dialogue.textContent='客官初来汴京？随我去虹桥看看。';}
      else {dialog.classList.remove('crossing-welcoming');dialog.querySelector('#crossingQuestions').hidden=true;dialog.querySelector('#crossingAsk').setAttribute('aria-expanded','false');}
    }
    dialog.querySelector('#crossingGuide').addEventListener('click',()=>{
      if(leaving||!welcoming)return;
      dialogue.textContent='这边请。桥上车马来往，桥下船家正忙。';
      dialog.classList.add('crossing-guiding');
      for(const button of welcome.querySelectorAll('button'))button.disabled=true;
      visual?.guide();
    });
    dialog.querySelector('#crossingAlone').addEventListener('click',()=>void enter());
    dialog.querySelector('#crossingAsk').addEventListener('click',()=>{
      const questions=dialog.querySelector('#crossingQuestions');questions.hidden=!questions.hidden;
      dialog.querySelector('#crossingAsk').setAttribute('aria-expanded',String(!questions.hidden));
    });
    const answers={bridge:'且看这座木桥，桥下不设桥墩，大船也能从桥腹穿过。随我近前瞧瞧。',tea:'游街累了，便去孙羊店歇歇脚。临街坐下，听听汴京的热闹。',painter:'我想把桥上的行人、河上的船，都收进一卷画里。今日与你相逢，也是一景。'};
    for(const button of dialog.querySelectorAll('[data-question]'))button.addEventListener('click',()=>{dialogue.textContent=answers[button.dataset.question];});
    const dispose=()=>{visual?.dispose();visual=null;};
    const close=()=>{
      if(done)return;done=true;controller.abort();music.dispose();dispose();dialog.close();dialog.remove();
      entry.disabled=false;active=null;atlas.classList.remove('crossing-active');
      (document.body.classList.contains('in-atlas')?entry:document.querySelector('#painting')).focus({preventScroll:true});
    };
    // Keep Escape and movement keys out of the atlas and street handlers.
    dialog.addEventListener('keydown',event=>event.stopPropagation());
    dialog.addEventListener('keyup',event=>event.stopPropagation());
    dialog.addEventListener('cancel',event=>{event.preventDefault();if(!committing)close();});
    dialog.querySelector('#crossingCancel').addEventListener('click',()=>{if(!committing)close();});
    addEventListener('hashchange',close,{signal});
    addEventListener('pagehide',close,{signal});
    const ready=window.loadQingmingScene().then(()=>window.prepareQingmingEntry(1560));
    let loadError=null;const prepared=ready.catch(error=>{loadError=error;});
    async function enter(){
      if(leaving||signal.aborted)return;
      leaving=true;welcome.hidden=true;skip.disabled=true;dialog.querySelector('#crossingAuto').disabled=true;dialog.querySelector('#crossingSeek').disabled=true;status.textContent='虹桥将至，正在展开街市…';
      await prepared;
      if(signal.aborted)return;
      if(loadError){fail();return;}
      committing=true;
      dialog.querySelector('#crossingCancel').disabled=true;
      const entered=await window.AtlasTour.enterBridge();
      if(signal.aborted)return;
      if(!entered){fail();return;}
      dialog.classList.add('crossing-leaving');
      if(matchMedia('(prefers-reduced-motion: reduce)').matches){close();return;}
      setTimeout(close,720);
    }
    function fail(){
      dispose();welcome.hidden=true;leaving=false;committing=false;failed=true;status.textContent='街市暂未展开，请返回长卷后重新载入。';
      skip.textContent='重新载入';skip.disabled=false;
      dialog.querySelector('#crossingCancel').disabled=false;
    }
    skip.addEventListener('click',()=>{if(failed)location.reload();else void enter();});
    try{
      if(matchMedia('(prefers-reduced-motion: reduce)').matches){await enter();return;}
      const {createCrossing}=await import('./crossing-three.js?v=20-project-water');
      if(signal.aborted||leaving)return;
      visual=await createCrossing(dialog,signal);
      if(signal.aborted||leaving){dispose();return;}
      dialog.querySelector('#crossingAuto').disabled=false;dialog.querySelector('#crossingSeek').disabled=false;
      await visual.play(({title,hint,progress,meeting:atMeeting,departing})=>{
        if(leaving)return;
        if(!departing)meeting(Boolean(atMeeting));
        const heading=dialog.querySelector('#crossingTitle');if(heading.textContent!==title)heading.textContent=title;
        if(status.textContent!==hint)status.textContent=hint;
        dialog.querySelector('#crossingProgress').style.transform=`scaleX(${progress})`;
      });
      if(!signal.aborted)await enter();
    }catch(error){
      if(signal.aborted)return;
      // Devices without WebGL still reach the same playable bridge.
      dispose();status.textContent='正在进入虹桥…';await enter();
    }
  });
})();
