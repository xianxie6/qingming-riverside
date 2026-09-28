const test=require('node:test');
const assert=require('node:assert/strict');
const {crowdPresence}=require('../src/night.js');

test('dusk gradually thins the street while shops retain a warm evening crowd',()=>{
  const walkers=Array.from({length:100},(_,i)=>({id:`walker-${i}`}));
  const workers=Array.from({length:100},(_,i)=>({id:`worker-${i}`,role:'work'}));
  const count=(people,level,kind)=>people.filter(p=>crowdPresence(level,p,kind)>.18).length;
  assert.equal(count(walkers,0,'walker'),100);
  assert.ok(count(walkers,.55,'walker')<100);
  assert.ok(count(walkers,1,'walker')>=20&&count(walkers,1,'walker')<=38);
  assert.ok(count(workers,1,'resident')>count(walkers,1,'walker'));
});

test('each departing person fades continuously instead of popping out',()=>{
  const person=Array.from({length:100},(_,i)=>({id:`walker-${i}`}))
    .find(p=>crowdPresence(1,p,'walker')===0);
  const samples=Array.from({length:101},(_,i)=>crowdPresence(i/100,person,'walker'));
  assert.ok(samples.every((value,i)=>i===0||value<=samples[i-1]));
  assert.ok(samples.some(value=>value>0&&value<1));
});
