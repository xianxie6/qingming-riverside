const test=require('node:test');
const assert=require('node:assert/strict');
const {FireworkAudio}=require('./firework-audio.js');
class Context {
  constructor(){this.state='suspended';this.destination={};this.sources=[];}
  createGain(){return {gain:{value:0},connect(){}};}
  async resume(){this.state='running';}
  async decodeAudioData(){return {duration:2.351};}
  createBufferSource(){const source={connect(){},disconnect(){},start(){this.started=true;},stop(){this.stopped=true;}};this.sources.push(source);return source;}
}
const fetcher=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(4)});
class Media {
  constructor(url){this.src=url;this.paused=true;this.currentTime=0;}
  async play(){this.paused=false;}
  pause(){this.paused=true;}
}

test('background loops outside the show and keeps playing when fireworks stop; master mute controls both',async()=>{
  const sound=new FireworkAudio('bloom.mp3',{Context,Media,musicUrl:'background.mp3',fetcher});
  sound.setSceneActive(true);
  assert.equal(sound.musicPlaying,false,'Wait for a user gesture');
  await sound.unlock();
  assert.equal(sound.music.src,'background.mp3');assert.equal(sound.music.loop,true);
  assert.equal(sound.musicPlaying,true);assert.equal(sound.play(),false,'Outside fireworks schedule');
  sound.setActive(true);assert.equal(sound.play(),true);
  sound.setActive(false);assert.equal(sound.voices.size,0);assert.equal(sound.musicPlaying,true);
  sound.setActive(true);sound.play();sound.music.currentTime=13;
  sound.setEnabled(false);assert.equal(sound.voices.size,0);assert.equal(sound.musicPlaying,false);
  sound.setSceneActive(false);sound.setSceneActive(true);
  assert.equal(sound.musicPlaying,false,'Returning does not override mute');
  sound.setEnabled(true);await sound.unlock();assert.equal(sound.musicPlaying,true);
  assert.equal(sound.music.currentTime,13,'Resume without restarting the recording');
  sound.setSceneActive(false);assert.equal(sound.musicPlaying,false);assert.equal(sound.play(),false);
  sound.setSceneActive(true);assert.equal(sound.musicPlaying,true);
});

test('a delayed play promise cannot restart music after mute or leaving the homepage',async()=>{
  let finish;
  class DelayedMedia extends Media {play(){this.paused=false;return new Promise(resolve=>{finish=resolve;});}}
  const sound=new FireworkAudio('bloom.mp3',{Context,Media:DelayedMedia,musicUrl:'background.mp3',fetcher});
  sound.setSceneActive(true);const unlocking=sound.unlock();
  sound.setEnabled(false);finish();await unlocking;assert.equal(sound.musicPlaying,false);
  sound.setEnabled(true);sound.setSceneActive(false);finish();
  await new Promise(resolve=>setImmediate(resolve));assert.equal(sound.musicPlaying,false);
});

test('browser fetch retains its global receiver when loading the recording',async()=>{
  const original=globalThis.fetch;
  globalThis.fetch=function(){assert.equal(this,globalThis);return fetcher();};
  try{
    const sound=new FireworkAudio('sound.mp3',{Context});sound.setActive(true);
    assert.equal(await sound.unlock(),true);assert.equal(sound.play(),true);
  }finally{globalThis.fetch=original;}
});

test('each new bloom starts the supplied buffer once; silence before unlock and after pause',async()=>{
  const sound=new FireworkAudio('assets/firework-bloom.mp3',{Context,fetcher});
  sound.setActive(true);assert.equal(sound.play(),false);
  await sound.unlock();assert.equal(sound.plays,0,'Unlock does not replay old blooms');
  for(let i=0;i<3;i++)assert.equal(sound.play(),true);
  assert.equal(sound.plays,3);assert.equal(sound.voices.size,3);
  assert.ok(sound.context.sources.every(s=>s.buffer===sound.buffer));
  sound.setActive(false);assert.equal(sound.voices.size,0);assert.equal(sound.play(),false);
  assert.ok(sound.context.sources.every(s=>s.stopped));
  sound.setActive(true);sound.setEnabled(false);assert.equal(sound.play(),false);
  sound.setEnabled(true);assert.equal(sound.play(),true);
});

test('overlap is bounded and failed loading can be retried without queuing late sounds',async()=>{
  let attempts=0;
  const sound=new FireworkAudio('sound.mp3',{Context,fetcher:async()=>{if(++attempts===1)throw Error('offline');return fetcher();}});
  sound.setActive(true);await new Promise(resolve=>setImmediate(resolve));
  assert.equal(await sound.unlock(),true);
  for(let i=0;i<10;i++)sound.play();
  assert.equal(sound.voices.size,4);assert.equal(sound.plays,10);
  assert.ok(sound.context.sources.slice(0,6).every(s=>s.stopped));
  for(const source of [...sound.voices])source.onended();
  assert.equal(sound.voices.size,0);
});
