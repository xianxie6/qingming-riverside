const test=require('node:test');
const assert=require('node:assert/strict');
const bridge=require('../src/time-lens-bridge.js');

test('modern pedestrians follow their bridge and join both streets without jumping',()=>{
  assert.equal(bridge.ground(1200),433);
  assert.equal(bridge.ground(1515),391);
  assert.equal(bridge.ground(1800),433);
  for(let x=-2200;x<4350;x+=.25){
    assert.ok(Math.abs(bridge.ground(x+.25)-bridge.ground(x))<.1);
  }
});
test('modern railing restores only its own artwork inside timber silhouettes',()=>{
  let draws=0,clips=0,saves=0,rings=0;
  const ctx={save(){saves++;},restore(){saves--;},beginPath(){},moveTo(){rings++;},lineTo(){},closePath(){},clip(){clips++;},
    drawImage(art,...args){assert.equal(art,'modern');assert.deepEqual(args,[0,0,2172,724]);draws++;}};
  bridge.drawRailing(ctx,'modern',1200,1800);
  assert.equal(draws,1);assert.equal(clips,1);assert.equal(saves,0);assert.equal(rings,bridge.silhouettes.length);
  bridge.drawRailing(ctx,'modern',0,1000);assert.equal(draws,1);
  for(const ring of bridge.silhouettes)for(const [x,y] of ring){
    assert.ok(x>=1270&&x<=1735);assert.ok(y>=350&&y<450,'never restore buildings or river around the bridge');
  }
});
