const test=require('node:test'),assert=require('node:assert/strict');
const {Crossing}=require('../src/bridge-event.js');
const {Director}=require('../src/street-life.js');
const population=require('../src/population.js'),world=require('../src/world.js');
function run(force,dt=1/60){
  const e=new Crossing();e.start();let elapsed=0,last=e.vessel();const stages=['approach'];
  while(e.active&&elapsed<150){
    if(force!==null&&e.stage==='call')e.join();if(e.joined)e.pull(force);
    e.step(dt);elapsed+=dt;const b=e.vessel();
    if(e.active){assert.ok(Math.hypot(b.x-last.x,b.y-last.y)<2,'ship has no positional jumps');assert.ok(Math.abs(b.scale-last.scale)<.03);}
    if(e.stage!==stages.at(-1))stages.push(e.stage);
    if(b.occluded)assert.equal(b.mast,1,'mast is fully down before the arch');last=b;
  }
  assert.equal(e.stage,'complete');return {e,elapsed,stages};
}
test('a spectator sees a complete safe crossing and receives a viewing record',()=>{
  const {e,elapsed,stages}=run(null);
  assert.deepEqual(stages,['approach','call','rig','guide','clear','record','complete']);
  assert.ok(elapsed>90&&elapsed<120);assert.equal(e.result.helped,false);
});
test('steady participation changes the duration and recorded outcome at both refresh rates',()=>{
  const a=run(.56),b=run(.56,1/30),watch=run(null);
  assert.ok(a.elapsed<watch.elapsed-30);assert.ok(Math.abs(a.elapsed-b.elapsed)<.2);
  assert.equal(a.e.result.helped,true);assert.equal(a.e.result.quality,'steady');
});
test('overpull slows the crossing but the crew can still complete it',()=>{
  const steady=run(.56),rough=run(1);assert.ok(rough.elapsed>steady.elapsed+20);
  assert.ok(rough.e.overpull>20);assert.equal(rough.e.result.helped,false);
});
test('release, pause and rejoining preserve mast and ship progress',()=>{
  const e=new Crossing();e.start();e.step(11);assert.equal(e.join(),true);
  e.pull(.56);for(let i=0;i<100;i++)e.step(.05);
  const snapshot=structuredClone(e);e.step(0);assert.deepEqual({...e,events:snapshot.events},snapshot);
  e.release();assert.equal(e.input,0);const before=e.rig;e.step(.05);assert.ok(e.rig>=before);
  const releasedRig=e.rig;assert.equal(e.join(),true);assert.equal(e.rig,releasedRig);assert.equal(e.input,0);
});
test('restart is explicit and input is bounded and unavailable away from the rope',()=>{
  const e=new Crossing();e.pull(1);assert.equal(e.input,0);assert.equal(e.join(),false);
  e.start();assert.equal(e.start(),false);e.step(11);e.join();e.pull(5);assert.equal(e.input,1);e.pull(-5);assert.equal(e.input,0);
  const done=run(.56).e;assert.equal(done.start(),true);assert.equal(done.stage,'approach');assert.equal(done.result,null);assert.equal(done.work,0);
  assert.equal(Crossing.dragForce(100,40),.28+60/145);assert.equal(Crossing.dragForce(100,-500),1);
});
test('bridge traffic resumes from its waiting position after the vessel clears',()=>{
  const p=population.walkers.find(p=>p.from===1110),life=new Director({walkers:[p]}),ferry=world.createFerry(),player={x:1408,moving:false,facing:1};
  let time=0,pose=life.walkerAt(p,time);const block=[p.from-20,p.to+20];
  for(let i=0;i<180;i++){time+=1/60;life.advance(1/60,time,{player,ferry,roadblock:block});}
  assert.ok(life.clocks.get(p.id).rate<.001);pose=life.walkerAt(p,time);
  life.advance(1/60,time+1/60,{player,ferry});const next=life.walkerAt(p,time+1/60);
  assert.ok(Math.abs(next.x-pose.x)<p.speed/60);assert.ok(next.phase>=pose.phase);
});

test('the receding hull stays in the water channel and remains visible after completion',()=>{
  const e=new Crossing();e.start();let last=e.vessel();
  for(let i=0;i<9000&&e.active;i++){
    e.step(1/60);const b=e.vessel();
    assert.ok(b.y>=485,'boat cannot rise onto the far stone bank');
    assert.ok(Math.abs(b.axisY)<=.06,'gunwale stays level on the water');
    if(e.stage==='guide'){
      assert.ok(b.scale<=last.scale+.001,'boat shrinks as it recedes');
      // The full hull remains inside the traced opening, not hidden above it.
      const halfWidth=86*b.scale*Math.abs(b.axisX);
      assert.ok(b.x-halfWidth>1428&&b.x+halfWidth<1595);
      assert.ok(b.y-64*b.scale>427,'crew stays below the bridge arch');
    }
    assert.ok(Math.hypot(b.x-last.x,b.y-last.y)<2);last=b;
  }
  assert.equal(e.stage,'complete');assert.equal(e.visible,true);
  const docked=e.vessel();assert.equal(docked.opacity,1);
  e.step(60);assert.deepEqual(e.vessel(),docked,'completed boat remains in the distant channel');
});
