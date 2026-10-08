const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(__dirname+'/../src/crossing.js','utf8').replace("import('./crossing-three.js?v=15-welcome')",'loadVisualModule()');
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function harness({reduced=false,webgl=true}={}){
  class Element{
    constructor(){this.events={};this.style={};this.hidden=true;this.disabled=false;this.textContent='';this.classList={add:()=>{},remove:()=>{}};}
    addEventListener(name,fn){(this.events[name]??=[]).push(fn);}
    emit(name){return Promise.all((this.events[name]||[]).map(fn=>fn({preventDefault(){},stopPropagation(){}})));}
    querySelectorAll(selector){return selector==='[data-question]'?this.questions||[]:[];}
    setAttribute(){} focus(){this.focused=true;} showModal(){this.open=true;} close(){this.open=false;} remove(){this.removed=true;}
    querySelector(selector){return this.children[selector];}
  }
  const entry=new Element(),painting=new Element(),loading=deferred(),animation=deferred();
  let update,guideCalls=0,dialog,entered=0,disposed=0,visuals=0,inAtlas=true;
  const document={querySelector:s=>s==='#crossingEntry'?entry:painting,
    createElement:()=>{dialog=new Element();dialog.children=Object.fromEntries(['#crossingStatus','#crossingTitle','#crossingSkip','#crossingCancel','#crossingProgress','#crossingAuto','#crossingSeek','.crossing-welcome','#crossingDialogue','#crossingGuide','#crossingAlone','#crossingAsk','#crossingQuestions'].map(s=>[s,new Element()]));dialog.questions=['bridge','tea','painter'].map(question=>{const el=new Element();el.dataset={question};return el;});return dialog;},
    body:{append(){},classList:{contains:()=>inAtlas}}};
  vm.runInNewContext(source,{document,location:{protocol:'http:',reload(){}},AbortController,addEventListener(){},
    matchMedia:()=>({matches:reduced}),setTimeout:fn=>{fn();},
    window:{loadQingmingScene:()=>loading.promise,prepareQingmingEntry:async x=>assert.equal(x,1560),AtlasTour:{enterBridge:async()=>{entered++;inAtlas=false;return true;}}},
    loadVisualModule:async()=>({createCrossing:async()=>{visuals++;if(!webgl)throw Error('No WebGL');return {guide:()=>{guideCalls++;},play:fn=>{update=fn;return animation.promise;},dispose:()=>{disposed++;animation.resolve();}};}})});
  return {entry,painting,loading,animation,update:info=>update(info),get guideCalls(){return guideCalls;},get dialog(){return dialog;},get entered(){return entered;},get disposed(){return disposed;},get visuals(){return visuals;}};
}

test('complete journey enters the prepared bridge exactly once and releases the visual',async()=>{
  const h=harness(),run=h.entry.emit('click');h.loading.resolve();await tick();
  h.animation.resolve();await run;
  assert.equal(h.entered,1);assert.equal(h.disposed,1);assert.equal(h.dialog.removed,true);assert.equal(h.entry.disabled,false);assert.equal(h.painting.focused,true);
});

test('cancelling during loading never enters later and restores the entry button',async()=>{
  const h=harness(),run=h.entry.emit('click');await tick();
  await h.dialog.children['#crossingCancel'].emit('click');h.loading.resolve();await run;await tick();
  assert.equal(h.entered,0);assert.equal(h.disposed,1);assert.equal(h.entry.disabled,false);assert.equal(h.entry.focused,true);
});

test('skip waits for assets but still allows returning while those assets are pending',async()=>{
  const h=harness(),run=h.entry.emit('click');await tick();
  await h.dialog.children['#crossingSkip'].emit('click');await tick();assert.equal(h.entered,0);
  await h.dialog.children['#crossingCancel'].emit('click');h.loading.resolve();await run;await tick();
  assert.equal(h.entered,0);assert.equal(h.dialog.removed,true);
});

test('skip and animation completion racing cannot enter twice',async()=>{
  const h=harness(),run=h.entry.emit('click');await tick();
  await h.dialog.children['#crossingSkip'].emit('click');h.animation.resolve();h.loading.resolve();await run;await tick();
  assert.equal(h.entered,1);assert.equal(h.disposed,1);
});

test('reduced motion enters without constructing a WebGL renderer',async()=>{
  const h=harness({reduced:true}),run=h.entry.emit('click');h.loading.resolve();await run;
  assert.equal(h.visuals,0);assert.equal(h.entered,1);assert.equal(h.dialog.removed,true);
});

test('a device without WebGL still enters the bridge',async()=>{
  const h=harness({webgl:false}),run=h.entry.emit('click');h.loading.resolve();await run;
  assert.equal(h.entered,1);assert.equal(h.dialog.removed,true);
});

test('failed scene loading presents recovery and leaves the route unchanged',async()=>{
  const h=harness(),run=h.entry.emit('click');h.loading.reject(Error('offline'));await tick();h.animation.resolve();await run;
  assert.equal(h.entered,0);assert.equal(h.dialog.children['#crossingSkip'].textContent,'重新载入');assert.equal(h.dialog.children['#crossingCancel'].disabled,false);
  await h.dialog.children['#crossingCancel'].emit('click');assert.equal(h.entry.disabled,false);
});

 test('meeting waits for a choice, answers questions and guides only on request',async()=>{
  const h=harness(),run=h.entry.emit('click');h.loading.resolve();await tick();
  h.update({title:'宋人相逢',hint:'一位画客，邀你同游',progress:.95,meeting:true});
  assert.equal(h.entered,0);assert.equal(h.dialog.children['.crossing-welcome'].hidden,false);
  await h.dialog.children['#crossingAsk'].emit('click');
  assert.equal(h.dialog.children['#crossingQuestions'].hidden,false);
  await h.dialog.questions[0].emit('click');assert.match(h.dialog.children['#crossingDialogue'].textContent,/桥墩/);
  await h.dialog.children['#crossingGuide'].emit('click');assert.equal(h.guideCalls,1);assert.equal(h.entered,0);
  h.animation.resolve();await run;assert.equal(h.entered,1);
 });
 test('leaving the meeting backwards hides dialogue and returning restores the greeting',async()=>{
  const h=harness(),run=h.entry.emit('click');h.loading.resolve();await tick();
  h.update({title:'宋人相逢',hint:'相逢',progress:.95,meeting:true});
  h.update({title:'聚沙成形',hint:'聚形',progress:.8,meeting:false});assert.equal(h.dialog.children['.crossing-welcome'].hidden,true);
  h.update({title:'宋人相逢',hint:'相逢',progress:.95,meeting:true});assert.match(h.dialog.children['#crossingDialogue'].textContent,/初来汴京/);
  await h.dialog.children['#crossingAlone'].emit('click');await run;assert.equal(h.entered,1);
 });
