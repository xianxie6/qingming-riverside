const test=require('node:test');
const assert=require('node:assert/strict');
const model=import('../src/extension-workshop-state.js');
test('the florist waves briefly and returns to a steady resting pose',async()=>{
 const {floristWaveFrame}=await model;
 for(const t of [undefined,NaN,-1,0,.2,1.85,2,100])assert.equal(floristWaveFrame(t),0);
 assert.notEqual(floristWaveFrame(.6),floristWaveFrame(.8));
 for(let t=0;t<2.4;t+=.01)assert([0,1,2,3].includes(floristWaveFrame(t)));
});

test('an incomplete or cancelled rope pull returns cargo without completing a delivery',async()=>{
 const {createWorkshopState,CARGO}=await model;
 for(const cancelled of [false,true]){
  const s=createWorkshopState();assert(s.beginPull());s.pull(cancelled?1:.6);s.release(cancelled);
  assert.equal(s.warehouse.phase,'returning');s.step(1);
  assert.equal(s.warehouse.phase,'idle');assert.equal(s.warehouse.progress,0);assert.equal(s.warehouse.runs,0);assert.equal(s.cargo().y,CARGO.restY);
 }
});
test('cargo clears nearby bodies during the entire lift, handoff and stacking',async()=>{
 const {createWorkshopState,CARGO,PILE,pileSlot,warehouseActorPose}=await model;
 const {population}=await import('../src/extension-people-data.js');
 const s=createWorkshopState();s.lift();
 for(let t=0;t<9;t+=.01){
  const c=s.cargo();
  for(const p of population.people.filter(p=>p.x>4380&&p.x<4580&&p.id!=='mill-15')){
   const pose=warehouseActorPose(p,{x:p.x,y:p.y},s.warehouse);
   const overlapX=Math.min(c.x+CARGO.w/2,pose.x+p.w/2+3)-Math.max(c.x-CARGO.w/2,pose.x-p.w/2-3);
   const overlapY=Math.min(c.y+CARGO.h/2,pose.y)-Math.max(c.y-CARGO.h/2,pose.y-p.h);
   assert(overlapX<=0||overlapY<=0,`${p.id} intersects cargo at ${t.toFixed(2)}s (${s.warehouse.phase})`);
  }
  s.step(.01);
 }
 assert.equal(s.warehouse.phase,'complete');
 const placed=s.cargo();assert.deepEqual({x:placed.x,y:placed.y},pileSlot(0));assert.equal(placed.y+CARGO.h/2,PILE.groundY);
});
test('the sack is lowered onto the waiting porter, carried to the stack and the porter walks back',async()=>{
 const {createWorkshopState,PORTER,CARGO,shoulderSack}=await model,s=createWorkshopState();
 s.lift();let previous=s.cargo(),porter=s.porter();const phases=[];
 for(let t=0;t<9;t+=.01){
  s.step(.01);const c=s.cargo(),p=s.porter();
  if(phases.at(-1)!==s.warehouse.phase)phases.push(s.warehouse.phase);
  // Neither the sack nor the porter ever jumps between frames.
  assert(Math.hypot(c.x-previous.x,c.y-previous.y)<2.5,`sack jumps in ${s.warehouse.phase}`);
  assert(Math.abs(p.x-porter.x)<1,`porter jumps in ${s.warehouse.phase}`);
  if(['receiving','carrying'].includes(s.warehouse.phase)){
   assert.equal(c.on,'porter');assert.equal(c.tied,false);
   assert.deepEqual({x:c.x,y:c.y},shoulderSack(p.x,p.back,p.squash));
   // The sack rests behind the head, never covering the face.
   assert(c.y-CARGO.h/2>PORTER.y-PORTER.h-4&&c.y<PORTER.y-PORTER.h*.6);
  }
  if(s.warehouse.phase==='carrying'&&s.warehouse.elapsed>.2&&s.warehouse.elapsed<1.1)assert(p.frame>0&&p.flip);
  if(s.warehouse.phase==='homing'&&s.warehouse.elapsed>.2&&s.warehouse.elapsed<1.1)assert(p.frame>0&&!p.flip&&!p.carrying);
  previous=c;porter=p;
 }
 assert.deepEqual(phases,['hoisting','lowering','receiving','carrying','placing','homing','complete']);
 assert.equal(s.porter().x,PORTER.x);assert.equal(s.porter().frame,0);
 assert.equal(s.hook().empty,true);
});
test('a full pull runs one ordered handoff and each run adds one sack to the stack',async()=>{
 const {createWorkshopState,PILE,pileSlot}=await model,s=createWorkshopState();
 for(let run=1;run<=7;run++){
  assert(s.beginPull());s.pull(2);assert.equal(s.warehouse.progress,1);s.release();s.release();
  assert.equal(s.warehouse.phase,'lowering');assert.equal(s.beginPull(),false);assert.equal(s.lift(),false);
  s.step(1.5);assert.equal(s.warehouse.phase,'receiving');assert.equal(s.cargo().tied,false);
  s.step(.8+1.35);assert.equal(s.warehouse.phase,'placing');s.step(.9);
  assert.equal(s.warehouse.runs,run);assert.equal(s.pileCount(),Math.min(run,PILE.max));
  s.step(1.35);assert.equal(s.warehouse.phase,'complete');assert.equal(s.busy,false);
  s.step(100);assert.equal(s.warehouse.runs,run);
 }
 // The stack never grows above its last slot.
 assert.deepEqual(pileSlot(20),pileSlot(PILE.max-1));
 s.reset('warehouse');assert.equal(s.pileCount(),0);
});
test('the button shares the delivery sequence and reset interrupts every stage',async()=>{
 const {createWorkshopState}=await model;
 for(const elapsed of [.2,1.1,2.2,3.5,5,6.5]){
  const s=createWorkshopState();assert(s.lift());s.step(elapsed);s.reset('warehouse');s.step(20);
  assert.equal(s.warehouse.phase,'idle');assert.equal(s.warehouse.progress,0);assert.equal(s.warehouse.runs,0);
 }
 const s=createWorkshopState();s.lift();s.step(100);assert.equal(s.warehouse.phase,'complete');assert.equal(s.warehouse.runs,1);
});
test('curtains reverse halfway and reset independently of the warehouse',async()=>{
 const {createWorkshopState}=await model,s=createWorkshopState();
 s.lift();s.toggleInn();s.step(.25);assert(s.inn.progress>0&&s.inn.progress<1);
 s.toggleInn();s.step(1);assert.equal(s.inn.progress,0);
 s.toggleInn();s.step(1);assert.equal(s.inn.progress,1);s.reset('inn');assert.equal(s.inn.target,0);assert.equal(s.inn.progress,0);
 assert.notEqual(s.warehouse.phase,'idle');
});
test('invalid input cannot leave a rope outside its limits or advance a scene',async()=>{
 const {createWorkshopState}=await model,s=createWorkshopState();
 s.beginPull();s.pull(NaN);s.pull(Infinity);s.step(NaN);s.step(-10);assert.equal(s.warehouse.progress,0);
 s.pull(-5);assert.equal(s.warehouse.progress,0);s.release();s.step(10);assert.equal(s.warehouse.phase,'idle');
});
test('a deliberate response stays at the actor and returns exactly to the ambient pose',async()=>{
 const {reactionPose}=await model;
 const base={x:10,y:450,kind:'walk',stride:1,bend:0,nod:0,lift:0,reach:0,hand:[.5,.4]},idle={...base,x:15,stride:-1};
 assert.deepEqual(reactionPose({},base,idle,0),{...idle,activity:undefined});
 const response=reactionPose({},base,idle,.6);assert.equal(response.x,10);assert.equal(response.stride,0);assert.equal(response.activity,'抬手招呼');assert(response.lift>0);
 assert.deepEqual(reactionPose({},base,idle,2.35),idle);
 for(let t=0;t<3;t+=.02){const pose=reactionPose({},base,idle,t);assert(pose.x>=10&&pose.x<=15);for(const k of ['x','y','stride','bend','nod','lift','reach'])assert(Number.isFinite(pose[k]));}
});
test('the hauled rope pays back out while the sack is lowered, hand over hand',async()=>{
 const {createWorkshopState,haulFrame}=await model,s=createWorkshopState();
 assert.equal(haulFrame(0),0);assert.equal(haulFrame(1),2);
 // Hauling cycles reach, chest, waist, then regrip high: never skipping a pose.
 const seen=[];for(let p=0;p<=1.0001;p+=.01){const f=haulFrame(p);if(seen.at(-1)!==f)seen.push(f);}
 assert.deepEqual(seen,[0,1,2,0,1,2]);
 s.beginPull();s.pull(1);s.release();assert.equal(s.warehouse.progress,1);
 let previous=1;
 while(s.warehouse.phase==='lowering'){s.step(.02);assert(s.warehouse.progress<=previous);assert(previous-s.warehouse.progress<.05,'rope never snaps back');previous=s.warehouse.progress;}
 assert.equal(s.warehouse.phase,'receiving');assert.equal(s.warehouse.progress,0);
});
