const test=require('node:test');
const assert=require('node:assert/strict');
const S=require('../src/seasons.js');
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
test('rapid season choices apply only the newest complete scenery and wardrobe',async()=>{
  const summer=deferred(),winter=deferred(),applied=[];
  const c=new S.Controller(id=>({summer,winter}[id].promise),(id,art)=>applied.push([id,art]));
  const a=c.select('summer'),b=c.select('winter');
  winter.resolve('snow-and-coats');assert.equal(await b,true);
  summer.resolve('leaves-and-linen');assert.equal(await a,false);
  assert.equal(c.id,'winter');assert.equal(c.pending,null);assert.deepEqual(applied,[['winter','snow-and-coats']]);
});
test('failed scenery keeps the last season and can retry while successful assets are cached',async()=>{
  let requests=0;const applied=[];
  const c=new S.Controller(()=>{if(++requests===1)throw Error('offline');return 'complete';},id=>applied.push(id));
  assert.equal(await c.select('autumn'),false);assert.equal(c.id,'spring');assert.equal(c.pending,null);assert.deepEqual(applied,[]);
  assert.equal(await c.select('autumn'),true);assert.equal(await c.select('autumn'),true);
  assert.equal(requests,2);assert.equal(c.id,'autumn');
});
test('a return to spring cancels an outstanding seasonal request',async()=>{
  const slow=deferred(),applied=[];
  const c=new S.Controller(id=>id==='winter'?slow.promise:'original',id=>applied.push(id));
  const pending=c.select('winter');await c.select('spring');slow.resolve('winter');await pending;
  assert.equal(c.id,'spring');assert.deepEqual(applied,['spring']);
});
test('winter uses snow and summer rain keeps the same light clothes',()=>{
  const rain={rain:1,wet:1,gloom:.6,time:25};
  for(const id of ['spring','summer','autumn'])assert.equal(S.weather(id,rain),rain);
  const winter=S.weather('winter',rain,true,7);assert.equal(winter.rain,0);assert.equal(winter.stage,'snow');assert.equal(winter.time,7);
  assert.equal(S.weather('winter',rain,false).snow,0);
  for(const p of [{layer:'street'},{layer:'balcony'},{indoor:true}])assert.equal(S.outfit('summer',p,true),S.outfit('summer',p,false));
  const W=require('../src/weather.js');
  assert.equal(W.umbrellaProgress(W.weatherAt(30),{id:'summer-walker',layer:'street'}),1);
  assert.equal(S.outfit('autumn',{layer:'street'},true),'autumn-rain');
  assert.equal(S.outfit('autumn',{indoor:true},true),'autumn');
  assert.equal(S.outfit('winter',{layer:'street'},true),'winter');
});
test('seasonal particles use scene time and remain bounded when paused or resumed',()=>{
  for(const id of ['autumn','winter'])for(let i=0;i<420;i++){
    assert.deepEqual(S.particle(id,i,42),S.particle(id,i,42));
    for(const time of [0,100,86400]){
      const p=S.particle(id,i,time);assert.ok(Number.isFinite(p.x)&&p.y>=0&&p.y<=660&&p.r<3);
    }
  }
});
