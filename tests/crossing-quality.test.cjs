const test=require('node:test');
const assert=require('node:assert/strict');
const quality=import('../src/crossing-quality.js');

test('high DPI and large displays stay within the rendering pixel budget',async()=>{
  const {crossingQuality}=await quality;
  for(const [w,h] of [[390,844],[1200,910],[1920,1080],[3840,2160]]){
    const q=crossingQuality(w,h,3);
    assert.ok(w*h*q.pixelRatio*q.pixelRatio<=1400000.001);
    assert.ok(q.pixelRatio>0&&q.pixelRatio<=1.25);
  }
  assert.ok(crossingQuality(1200,910,2,4).particles<crossingQuality(1200,910,2,8).particles);
});

test('sustained slow frames lower resolution, fast frames and background pauses do not',async()=>{
  const {createFrameBudget}=await quality;
  const fast=createFrameBudget(1.25);
  for(let i=0;i<240;i++)assert.equal(fast.sample(1/60),null);
  assert.equal(fast.sample(10),null);
  const slow=createFrameBudget(1.25),changes=[];
  for(let i=0;i<500;i++){const next=slow.sample(1/25);if(next!==null)changes.push(next);}
  assert.ok(changes.length>0);
  assert.ok(changes.every((value,i)=>value>=.65&&value<(i?changes[i-1]:1.25)));
  assert.equal(changes.at(-1),.65);
});
