const test=require('node:test');
const assert=require('node:assert/strict');
const modules=Promise.all([import('../src/extension-people-data.js'),import('../src/extension-people-layout.js'),import('../src/extension-flower-customers.js'),import('../src/extension-workshop-state.js')]);
test('larger people preserve foot anchors and the pair becomes two independent customers',async()=>{
 const [{population:source},{createDisplayPopulation,STREET_PERSON_SCALE,FLORIST_SCALE,TRAVELLER_SCALE}]=await modules;
 const result=createDisplayPopulation(source);
 assert.equal(result.people.reduce((sum,p)=>sum+p.members,0),source.count);
 assert.equal(result.people.filter(p=>p.customer!==undefined).length,2);
 assert(!result.people.some(p=>p.id==='visitors-47'));
 for(const original of source.people.filter(p=>p.id!=='visitors-47')){
  const p=result.people.find(q=>q.id===original.id);if(original.id==='tea-18'||original.id==='visitors-49'||original.id==='visitors-50')continue;if(p.flowerStreet||p.porter)continue;assert.equal(p.x,original.x);assert.equal(p.y,original.y);
  assert.equal(p.h,original.h*(p.id==='bridge-33'?FLORIST_SCALE:p.id==='bridge-36'?TRAVELLER_SCALE:STREET_PERSON_SCALE));
 }
});
test('each customer enters the actual doorway before buying and continues down the street without jumps',async()=>{
 const [{population:source},{createDisplayPopulation},{flowerCustomerPose,CUSTOMER_DEPARTURE_TIME},{INN}]=await modules;
 for(const p of createDisplayPopulation(source).people.filter(p=>p.customer!==undefined)){
  const phases=new Set();let previous=flowerCustomerPose(p,0,true),bought=false;
  for(let time=.01;time<CUSTOMER_DEPARTURE_TIME+45;time+=.01){
   const pose=flowerCustomerPose(p,time,true);phases.add(pose.visitPhase);
   assert(Math.hypot(pose.x-previous.x,pose.y-previous.y)<1,'position jumps');
   if(pose.visitPhase==='choosing'||pose.visitPhase==='buying'){
    assert(pose.x>INN.x+10&&pose.x<INN.x+INN.w-10);assert(pose.y<INN.y+INN.h);assert(pose.clip);
   }
   if(pose.flower>0){assert(['buying','leaving','departing'].includes(pose.visitPhase));bought=true;}
   previous=pose;
  }
  assert(bought);assert.equal(phases.size,7);assert(previous.x>7602,'customers must keep going beyond the visible end');assert.equal(previous.flower,1);
 }
});
test('closed curtains hold the visit clock, reopening resumes, reset clears only the local visit',async()=>{
 const [,,, {createWorkshopState}]=await modules,s=createWorkshopState();
 s.stepCustomers(10);assert.equal(s.customers.time,0);
 s.toggleInn();s.step(1);s.stepCustomers(5);assert.equal(s.customers.time,5);
 s.toggleInn();s.step(1);s.stepCustomers(9);assert.equal(s.customers.time,5);
 s.toggleInn();s.step(1);s.stepCustomers(2);assert.equal(s.customers.time,7);
 s.reset('warehouse');assert.equal(s.customers.time,7);
 s.reset('inn');assert.deepEqual(s.customers,{time:0,started:false});
});
test('the pair share every visit phase and clear the doorway before turning into the street',async()=>{
 const [{population:source},{createDisplayPopulation},{flowerCustomerPose,CUSTOMER_DEPARTURE_TIME},{INN}]=await modules;
 const pair=createDisplayPopulation(source).people.filter(p=>p.customer!==undefined);
 for(let time=0;time<=CUSTOMER_DEPARTURE_TIME+45;time+=.01){
  const [a,b]=pair.map(p=>flowerCustomerPose(p,time,true));
  assert.equal(a.visitPhase,b.visitPhase,'one customer left the other behind');
  assert.equal(a.flower,b.flower,'flowers must be received together');
  assert(b.x-a.x>=24-1e-6,'the two walking lanes merge');
  for(const pose of [a,b]){
   if(pose.y>=INN.y+INN.h)assert.equal(pose.clip,undefined,'outside skirt is clipped by the doorway');
   if(pose.visitPhase==='departing')assert(pose.y>=480,'turned across curtain before clearing threshold');
  }
 }
});
test('the enlarged warehouse actors still leave the entire cargo path clear',async()=>{
 const [{population:source},{createDisplayPopulation},,{createWorkshopState,warehouseActorPose,CARGO}]=await modules;
 // The porter is meant to receive the sack; everyone else must stay clear of it.
 const s=createWorkshopState(),people=createDisplayPopulation(source).people.filter(p=>p.x>4380&&p.x<4580&&!p.porter);s.lift();
 for(let t=0;t<8;t+=.01){
  const cargo=s.cargo();
  for(const p of people){const pose=warehouseActorPose(p,p,s.warehouse);
   const x=Math.min(cargo.x+CARGO.w/2,pose.x+p.w/2+3)-Math.max(cargo.x-CARGO.w/2,pose.x-p.w/2-3);
   const y=Math.min(cargo.y+CARGO.h/2,pose.y)-Math.max(cargo.y-CARGO.h/2,pose.y-p.h);
   assert(x<=0||y<=0,`${p.id} intersects cargo at ${t}`);
  }
  s.step(.01);
 }
});
test('departed customers keep going forwards even when the shop curtain closes',async()=>{
 const [{population:source},{createDisplayPopulation},{flowerCustomerPose,CUSTOMER_DEPARTURE_TIME},{createWorkshopState}]=await modules;
 const s=createWorkshopState(),pair=createDisplayPopulation(source).people.filter(p=>p.customer!==undefined);
 s.toggleInn();s.step(1);s.stepCustomers(CUSTOMER_DEPARTURE_TIME+2);
 const before=pair.map(p=>flowerCustomerPose(p,s.customers.time,true)),hostTime=s.florist.time;
 s.toggleInn();s.step(1);s.stepCustomers(30);
 const after=pair.map(p=>flowerCustomerPose(p,s.customers.time,true));
 after.forEach((pose,i)=>{assert(pose.x>before[i].x+700);assert.equal(pose.visitPhase,'departing');assert.equal(pose.flip,false);assert.equal(pose.flower,1);});
 assert.equal(s.florist.time,hostTime,'owner cannot walk through a closed curtain');
 s.reset('inn');assert.deepEqual(s.florist,{time:0,started:false});
});
test('the florist greets outside, serves inside, and then stays fully outside to see the pair off',async()=>{
 const [,,{flowerFloristPose},{INN,floristWaveFrame}]=await modules;
 let previous=flowerFloristPose({},0,true);const phases=new Set();
 for(let t=.01;t<30;t+=.01){
  const pose=flowerFloristPose({},t,true);phases.add(pose.hostPhase);
  assert(Math.hypot(pose.x-previous.x,pose.y-previous.y)<1,'florist jumps at a waypoint');
  if(floristWaveFrame(pose.waveTime)>0){assert(pose.y>INN.y+INN.h);assert.equal(pose.clip,undefined,'curtain clips a greeting');}
  previous=pose;
 }
 assert.equal(phases.size,6);assert.equal(flowerFloristPose({},12,true).hostPhase,'serving');
 assert.equal(previous.hostPhase,'outside');assert(previous.x>INN.x+INN.w);assert.equal(previous.clip,undefined);
});
