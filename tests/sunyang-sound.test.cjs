const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

function load(state='running'){
  const starts=[];
  const parameter={value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}};
  const node=()=>({gain:{...parameter},frequency:{...parameter},Q:{...parameter},
    connect(target){return target;},start(time){starts.push(time);},stop(){}});
  let resolveResume,rejectResume,resumes=0;
  const context={state,currentTime:0,sampleRate:44100,destination:{},
    createGain:node,createBiquadFilter:node,createBufferSource:node,createOscillator:node,
    createBuffer:(_,length)=>({getChannelData:()=>new Float32Array(length)}),
    resume(){resumes++;return new Promise((resolve,reject)=>{
      resolveResume=()=>{context.state='running';context.currentTime=5;resolve();};rejectResume=reject;
    });}};
  const music={paused:true,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}};
  const window={AudioContext:function(){return context;},addEventListener(){}};
  const document={hidden:false,addEventListener(){},querySelector(){return null;}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/../src/sunyang-sound.js','utf8'),
    {window,document,Audio:function(){return music;}});
  return {sound:window.SunyangSound,context,starts,music,
    resume:()=>resolveResume(),reject:()=>rejectResume(new Error('Playback blocked')),
    get resumes(){return resumes;}};
}

for(const state of ['suspended','interrupted'])test(`shop feedback waits for ${state} audio and uses the resumed clock`,async()=>{
  const audio=load(state),pending=audio.sound.click();
  assert.equal(audio.resumes,1);
  assert.equal(audio.starts.length,0,'no short sounds are consumed before audio resumes');
  audio.resume();await pending;
  assert.ok(audio.starts.length>0);
  assert.ok(audio.starts.every(time=>time>=5),'sounds start on the restored clock');
});

test('blocked audio can be retried by the next dish selection',async()=>{
  const audio=load('suspended'),first=audio.sound.select();
  audio.reject();await first;
  assert.equal(audio.starts.length,0);
  const retry=audio.sound.select();audio.resume();await retry;
  assert.ok(audio.starts.length>0);
});

test('turning off shop music keeps both button and dish feedback available',async()=>{
  const audio=load();audio.sound.toggle();
  assert.equal(audio.music.paused,true);
  await audio.sound.click();const buttonStarts=audio.starts.length;
  await audio.sound.select();
  assert.ok(buttonStarts>0);
  assert.ok(audio.starts.length>buttonStarts);
  assert.equal(audio.music.paused,true);
});
