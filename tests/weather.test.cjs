const test=require('node:test'),assert=require('node:assert/strict');
const {RainEvent,weatherAt,carriesUmbrella,umbrellaProgress}=require('../src/weather.js');

test('the rain story moves through the full ordered weather sequence',()=>{
  const rain=new RainEvent();assert.equal(rain.start(),true);assert.equal(rain.start(),false);const seen=['gather'];
  while(rain.active){rain.step(.1);for(const event of rain.events)seen.push(event);}
  assert.deepEqual(seen,['gather','shower','downpour','easing','afterglow','complete']);assert.equal(rain.sample().rain,0);
});
test('weather values stay bounded and clear continuously',()=>{
  let previous=weatherAt(0,true);
  for(let t=.01;t<=88;t+=.01){const next=weatherAt(t,true);for(const key of ['rain','wet','gloom','wind'])assert.ok(next[key]>=0&&next[key]<=1);assert.ok(Math.abs(next.rain-previous.rain)<.01);previous=next;}
  assert.ok(weatherAt(36,true).rain>.9);assert.ok(weatherAt(55,true).wet>.8);assert.ok(weatherAt(80,true).gloom<.1);
});
test('pause freezes weather and refresh rate does not alter it',()=>{
  const paused=new RainEvent();paused.start();paused.step(12);const before={time:paused.time,stage:paused.stage};paused.step(0);assert.deepEqual({time:paused.time,stage:paused.stage},before);
  const a=new RainEvent(),b=new RainEvent();a.start();b.start();for(let t=0;t<40;t+=1/60)a.step(1/60);for(let t=0;t<40;t+=1/30)b.step(1/30);assert.equal(a.stage,b.stage);assert.ok(Math.abs(a.sample().rain-b.sample().rain)<.002);
});

test('outdoor people open umbrellas gradually before the downpour',()=>{
  const people=Array.from({length:24},(_,i)=>({id:`person-${i}`,h:44+i%4*7,layer:'street',activity:i%3?'talk':'work'}));
  assert.ok(people.every(carriesUmbrella));
  assert.ok(people.every(p=>umbrellaProgress({time:3,rain:.05},p)===0));
  const middle=people.map(p=>umbrellaProgress({time:9,rain:.3},p));
  assert.ok(middle.some(value=>value===0));
  assert.ok(middle.some(value=>value>0&&value<1));
  assert.ok(people.every(p=>umbrellaProgress({time:16,rain:.48},p)>.99));
  assert.equal(carriesUmbrella({h:64}),false);
});

test('sheltered residents never open umbrellas in rain',()=>{
  const {residents,walkers}=require('../src/population.js');
  const sheltered=residents.filter(p=>['balcony','pavilion'].includes(p.layer));
  assert.ok(sheltered.length>0);
  for(const p of [...sheltered,{id:'indoor-person',indoor:true},{id:'interior-person',layer:'interior'}]){
    assert.equal(carriesUmbrella(p),false);
    assert.equal(umbrellaProgress(weatherAt(36),p),0);
  }
  assert.ok(walkers.every(p=>umbrellaProgress(weatherAt(36),p)===1));
});
test('rain becomes visible soon after starting and builds sooner',()=>{
  assert.equal(weatherAt(0).rain,0);
  assert.equal(weatherAt(3).stage,'shower');
  assert.ok(weatherAt(5).rain>.015);
  assert.equal(weatherAt(16).rain,.5);
  assert.equal(weatherAt(28).rain,1);
});
