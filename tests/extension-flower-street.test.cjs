const test=require('node:test');
const assert=require('node:assert/strict');
const data=Promise.all([import('../src/extension-people-data.js'),import('../src/extension-people-layout.js'),import('../src/extension-flower-street.js'),import('../src/extension-workshop-state.js'),import('../src/extension-flower-customers.js')]);
test('all fifteen surrounding residents use detailed art without changing the population',async()=>{
 const [{population},{createDisplayPopulation}]=await data,p=createDisplayPopulation(population);
 assert.equal(p.people.reduce((s,a)=>s+a.members,0),230);
 assert.equal(p.people.filter(a=>a.flowerStreet).reduce((s,a)=>s+a.members,0),15);
 assert.equal(new Set(p.people.map(a=>a.id)).size,p.people.length);
 for(const a of p.people.filter(a=>a.x>6200&&a.x<7160))assert(a.flowerStreet||a.customer!==undefined||a.id==='bridge-33',a.id+' still uses the old mesh');
});
test('walking stays grounded and continuous, and only turns during a standing pause',async()=>{
 const [{population},{createDisplayPopulation},{flowerStreetPose}]=await data;
 for(const p of createDisplayPopulation(population).people.filter(p=>p.flowerStreet?.role==='walk')){
  let previous=flowerStreetPose(p,0),frames=new Set();
  assert(Math.abs(previous.x-p.x)<1e-6);
  for(let time=1/60;time<120;time+=1/60){
   const pose=flowerStreetPose(p,time);frames.add(pose.streetFrame);
   assert(Math.abs(pose.x-previous.x)<=p.flowerStreet.speed/60+1e-6,'teleport or ungrounded reversal');
   assert.equal(pose.y,p.y);assert.equal(pose.scale,1);assert.equal(pose.scripted,true);
   assert.equal(pose.bend,0);assert.equal(pose.stride,0);
   if(pose.flip!==previous.flip)assert.equal(pose.kind,'chat');
   previous=pose;
  }
  assert.equal(frames.size,5);
 }
});
test('companions stay together and conversational actors keep their feet planted',async()=>{
 const [{population},{createDisplayPopulation},{flowerStreetPose}]=await data,people=createDisplayPopulation(population).people;
 for(let t=0;t<120;t+=.1){
  for(const id of ['visitors-49','visitors-50']){
   const a=flowerStreetPose(people.find(p=>p.id===id+'-lead'),t),b=flowerStreetPose(people.find(p=>p.id===id+'-companion'),t);
   assert(Math.abs(b.x-a.x-34)<1e-6);assert.equal(a.flip,b.flip);
  }
  for(const p of people.filter(p=>p.flowerStreet?.role==='chat')){
   const pose=flowerStreetPose(p,t);assert.equal(pose.x,p.x);assert.equal(pose.y,p.y);assert(pose.streetFrame>=0&&pose.streetFrame<4);
  }
 }
});
test('closed cloth completely hides indoor people while outside greeters remain visible',async()=>{
 const [,,, {clipBehindFlowerCurtain,flowerDoorOpening,INN},{flowerFloristPose}]=await data;
 for(const t of [0,7.5,10,12]){
  const pose=flowerFloristPose({},t,true),closed=clipBehindFlowerCurtain(pose,0);
  assert.equal(closed.hidden,true);assert.equal(closed.clip.w,0);
  let previous=0;
  for(let p=0;p<=1;p+=.01){const result=clipBehindFlowerCurtain(pose,p),opening=flowerDoorOpening(p);assert.deepEqual(result.clip,opening);assert(opening.w>=previous);previous=opening.w;}
 }
 for(const t of [3,20,24]){const pose=flowerFloristPose({},t,true),closed=clipBehindFlowerCurtain(pose,0);assert(closed.y>INN.y+INN.h);assert(!closed.hidden);assert.equal(closed.clip,undefined);}
});
