const test=require('node:test');
const assert=require('node:assert/strict');
const detail=import('../src/crossing-details.js');

test('every idle timber keeps moving even when the scroll position is fixed',async()=>{
  const {timberBreath}=await detail;
  for(let i=0;i<400;i++)for(const arrival of [0,.5,1]){
    const a=timberBreath(i,arrival,0),b=timberBreath(i,arrival,2);
    assert.ok(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)>.0001);
    assert.ok(Math.abs(b.y)<=.17);
  }
});

test('paddle shaft clears the gunwale throughout the stroke',async()=>{
  const {paddleTip}=await detail;
  for(let t=0;t<12;t+=.1)for(const x of [.25,.4,.55]){
    const grip={x,y:1.4,z:1.55},tip=paddleTip(grip,t);
    const fraction=(grip.y-.64)/(grip.y-tip.y);
    assert.ok(grip.x+(tip.x-grip.x)*fraction>.89,'shaft must cross deck height outside hull');
    assert.ok(tip.y<0);assert.ok(tip.x>1.9);
  }
});
