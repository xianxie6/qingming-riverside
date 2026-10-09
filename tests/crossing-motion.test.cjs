const test=require('node:test');
const assert=require('node:assert/strict');
const motion=import('../src/crossing-motion.js');

test('the character reveal holds for inspection and resumes only on request',async()=>{
  const {createJourney}=await motion,j=createJourney({pauseAt:.95});j.toggle();
  for(let i=0;i<60*60;i++)j.step(1/60);
  assert.equal(j.target,.95);assert.equal(j.progress,.95);assert.equal(j.playing,false);
  j.toggle();for(let i=0;i<5*60;i++)j.step(1/60);assert.equal(j.progress,1);
  j.seek(.8);j.toggle();for(let i=0;i<15*60;i++)j.step(1/60);
  assert.equal(j.target,.95);assert.equal(j.playing,false);
});

test('manual seeking is reversible, bounded and pauses autoplay',async()=>{
  const {createJourney}=await motion,j=createJourney();
  j.toggle();j.seek(.7);assert.equal(j.playing,false);
  for(let i=0;i<120;i++)j.step(1/60);
  assert.ok(Math.abs(j.progress-.7)<.001);
  j.advance(-2);for(let i=0;i<180;i++)j.step(1/60);
  assert.equal(j.progress,0);j.seek(2);assert.equal(j.target,1);
});

test('autoplay duration remains consistent across frame rates and finishes',async()=>{
  const {createJourney}=await motion;
  const run=(fps,seconds)=>{const j=createJourney();j.toggle();for(let i=0;i<fps*seconds;i++)j.step(1/fps);return j.progress;};
  assert.ok(Math.abs(run(30,12)-run(120,12))<.002);
  assert.equal(run(30,52),1);assert.equal(run(120,52),1);
});

test('bridge completes before the boat enters and camera clears its arch',async()=>{
  const {assemblyProgress,journeyPose}=await motion;
  for(let i=0;i<=100;i++)assert.equal(assemblyProgress(.4,i/100),1);
  for(const aspect of [.46,1,1.78])for(let i=0;i<=1000;i++){
    const pose=journeyPose(i/1000,aspect);
    assert.ok(pose.camera.every(Number.isFinite));
    if(Math.abs(pose.camera[2])<2.2){assert.ok(Math.abs(pose.camera[0])<.6);assert.ok(pose.camera[1]>1.5&&pose.camera[1]<3);}
    if(Math.abs(pose.boatZ)<2.2)assert.ok(i/1000>.4);
  }
});
