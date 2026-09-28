const test=require('node:test');
const assert=require('node:assert/strict');
const {definitions,storyAt,Director}=require('../src/street-life.js');
const population=require('../src/population.js');
const world=require('../src/world.js');

test('all six street events have an ordered beginning, exchange or response, and return',()=>{
  assert.equal(definitions.length,6);
  for(const d of definitions){
    const stages=[];
    for(let t=0;t<d.period;t+=.1){
      const s=storyAt(d.id,t-d.offset);if(stages.at(-1)!==s.stage)stages.push(s.stage);
    }
    assert.deepEqual(stages,d.stages.map(s=>s[1]));
    const s=storyAt(d.id,0);
    assert.ok(Object.keys(s.actors).length>=2);
    for(const home of Object.keys(s.actors))assert.ok(population.residents.some(p=>p.x===Number(home)),`${d.id}: existing resident ${home}`);
  }
});

test('working residents stay on continuous paths through pauses and loop boundaries',()=>{
  for(const d of definitions){
    let previous=storyAt(d.id,0);
    for(let t=1/60;t<d.period*2;t+=1/60){
      const next=storyAt(d.id,t);
      for(const [home,a] of Object.entries(next.actors)){
        const before=previous.actors[home],x=a.x??Number(home),last=before.x??Number(home);
        assert.ok(Math.abs(x-last)<.8,`${d.id}: ${home} does not teleport at ${t}`);
        assert.ok(x>population.bounds.min&&x<population.bounds.max);
        if(a.x!==undefined){assert.equal(a.front,true);assert.ok(a.gaitWeight>=0&&a.gaitWeight<=1);assert.ok(a.phase>=before.phase-1e-7);}
      }
      previous=next;
    }
  }
});

test('parcels have one owner during handoff and pottery is collected before being carried',()=>{
  for(const [id,time,from,to] of [['produce',12,-348,-270],['pottery',10,-1240,-1165],['freight',13,3780,3980]]){
    const d=definitions.find(d=>d.id===id),s=storyAt(id,time-d.offset);
    assert.equal(s.actors[from].prop,null);assert.equal(s.actors[to].prop,null);
    const transfer=s.props.find(p=>p.kind==='transfer');assert.equal(transfer.from,from);assert.equal(transfer.to,to);
    assert.ok(transfer.u>0&&transfer.u<1);
  }
  const d=definitions.find(d=>d.id==='pottery');
  assert.ok(storyAt('pottery',10-d.offset).actors[-1165].x<-1200);
  assert.ok(storyAt('pottery',16-d.offset).actors[-1165].x>-1130);
});

test('the entire story, cargo and crowd freeze when simulation time is paused',()=>{
  const life=new Director(population),ferry=world.createFerry(),player={x:585,moving:false,facing:1};
  life.advance(.1,8,{player,ferry});
  const frame=structuredClone(life.frame),clocks=structuredClone(life.clocks);
  life.advance(0,8,{player,ferry});
  assert.deepEqual(life.frame,frame);assert.deepEqual(life.clocks,clocks);assert.deepEqual(life.events,[]);
});

test('yielding pauses a walker clock and resumes without a position or foot-phase jump',()=>{
  const p=population.walkers[16],life=new Director({walkers:[p]}),ferry=world.createFerry();
  let pose=life.walkerAt(p,0),time=0;
  for(let i=0;i<40;i++){
    time+=1/60;
    life.advance(1/60,time,{ferry,player:{x:pose.x+pose.direction*20,facing:-pose.direction,moving:true}});
    const next=life.walkerAt(p,time);
    assert.ok(Math.abs(next.x-pose.x)<=p.speed/60+.001);pose=next;
  }
  assert.ok(life.clocks.get(p.id).rate<.01);
  const stopped=pose.x;
  for(let i=0;i<90;i++){
    time+=1/60;life.advance(1/60,time,{ferry,player:{x:9999,facing:1,moving:false}});
    const next=life.walkerAt(p,time);assert.ok(Math.abs(next.x-pose.x)<=p.speed/60+.001);assert.ok(next.phase>=pose.phase);pose=next;
  }
  assert.ok(Math.abs(pose.x-stopped)>20);
});

test('ambient ferry calls respect user journeys and cargo workers return to the quay',()=>{
  const life=new Director(population),ferry=world.createFerry(),player={x:585,moving:false,facing:1,pending:null,action:null};
  assert.equal(life.shouldCallFerry(14,ferry,{...player,pending:'landing'}),false);
  assert.equal(life.shouldCallFerry(14,ferry,{...player,action:'voyage'}),false);
  assert.equal(life.shouldCallFerry(14,ferry,player),true);
  assert.equal(life.shouldCallFerry(14,ferry,player),false);
  world.summonFerry(ferry,'east');let time=14,sawCargo=false,lastY=world.streetY(2010);
  for(let i=0;i<1200;i++){
    time+=1/30;world.stepFerry(ferry,1/30);life.advance(1/30,time,{player,ferry});
    const actor=life.frame.actors[2010],y=actor.y??world.streetY(actor.x);
    assert.ok(Math.abs(y-lastY)<1.3,'worker follows the landing without a vertical jump');lastY=y;
    if(life.frame.cargoActive)sawCargo=true;
  }
  assert.ok(sawCargo);assert.equal(life.frame.cargoActive,false);assert.equal(life.frame.actors[2010].x,2010);
});

test('boarding during cargo work sends the porter back continuously and cancels loading',()=>{
  const life=new Director(population),ferry=world.createFerry(),player={x:585,moving:false,facing:1};
  Object.assign(ferry,{mode:'docked',berth:'east',visits:1});
  life.advance(.1,10,{player,ferry});life.advance(.1,11.8,{player,ferry});
  let last=life.frame.actors[2010];assert.ok(last.y>500);
  assert.equal(world.boardFerry(ferry),true);
  for(let i=1;i<=100;i++){
    const time=11.8+i/30;life.advance(1/30,time,{player:{...player,action:'voyage'},ferry});
    const next=life.frame.actors[2010],y=next.y??world.streetY(next.x);
    assert.ok(Math.abs(y-(last.y??world.streetY(last.x)))<1.3);
    assert.ok(!life.frame.props.some(p=>p.kind==='load'));assert.equal(life.frame.cargoBasket,null);last=next;
  }
  assert.equal(last.x,2010);assert.equal(life.frame.cargoActive,false);
});
