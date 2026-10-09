const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function harness(){
  let pending=null,calls=0;
  class Audio{
    constructor(src){this.src=src;this.paused=true;this.events={};}
    addEventListener(n,f){this.events[n]=f;}
    removeEventListener(n){delete this.events[n];}
    removeAttribute(){this.src='';}load(){}
    pause(){this.paused=true;}
    play(){calls++;this.paused=false;return pending||Promise.resolve();}
  }
  const window={};vm.runInNewContext(fs.readFileSync(__dirname+'/../src/crossing-audio.js','utf8'),{window,Audio});
  return {music:new window.CrossingAudio(),pending:p=>{pending=p;},get calls(){return calls;}};
}
test('entry starts the supplied track synchronously in a loop, mute and resume retain its position',async()=>{
  const h=harness(),m=h.music;
  m.setActive(true);assert.equal(h.calls,1);assert.equal(m.audio.paused,false);
  assert.equal(m.audio.src,'assets/audio/crossing-background.mp3');assert.equal(m.audio.loop,true);
  m.audio.currentTime=18;m.toggle();assert.equal(m.audio.paused,true);assert.equal(m.enabled,false);
  m.toggle();await tick();assert.equal(m.audio.paused,false);assert.equal(m.audio.currentTime,18);
});
test('hidden tabs pause; coming back respects the mute choice; disposal releases the track',()=>{
  const m=harness().music;m.setActive(true);m.setActive(false);assert.equal(m.audio.paused,true);
  m.setActive(true);assert.equal(m.audio.paused,false);m.toggle();m.setActive(false);m.setActive(true);
  assert.equal(m.audio.paused,true);m.dispose();m.setActive(true);assert.equal(m.audio.paused,true);assert.equal(m.audio.src,'');
});
test('pending playback cannot restart after mute or exit',async()=>{
  for(const action of ['toggle','dispose']){
    const h=harness(),m=h.music;let resolve;
    h.pending(new Promise(r=>{resolve=r;}));m.setActive(true);m[action]();
    m.audio.paused=false;resolve();await tick();assert.equal(m.audio.paused,true);
  }
});
test('blocked playback can be retried by the sound switch without affecting the journey',async()=>{
  const h=harness(),m=h.music;h.pending(Promise.reject(Error('blocked')));
  m.setActive(true);await tick();assert.equal(m.blocked,true);
  h.pending(null);m.toggle();await tick();assert.equal(m.enabled,true);assert.equal(m.blocked,false);assert.equal(m.audio.paused,false);
});
