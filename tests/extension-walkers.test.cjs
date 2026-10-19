const test=require('node:test');
const assert=require('node:assert/strict');
const modules=Promise.all([import('../src/extension-people-data.js'),import('../src/extension-people-layout.js'),import('../src/extension-motion.js'),import('../src/extension-walkers.js')]);
async function setup(){
 const [{population:source},{createDisplayPopulation},motion,walkers]=await modules;
 const population=createDisplayPopulation(source);
 return {population,plans:motion.createActionPlans(population),motion,walkers};
}

test('travellers walk long routes on connected street stretches only',async()=>{
 const {population,plans,walkers}=await setup(),{STREETS,BRIDGE,WORLD}=walkers;
 const walking=population.people.filter(p=>plans.get(p.id).walk);
 assert(walking.reduce((n,p)=>n+p.members,0)>=50,'too few people walk the street');
 let long=0;
 for(const p of walking){
  const w=plans.get(p.id).walk;
  assert(w.a<=w.b&&w.a>=WORLD.left&&w.b<=WORLD.right,`${p.id} leaves the scroll`);
  if(p.surface==='bridge'){assert(w.a>=Math.min(p.x,BRIDGE.deckLeft)&&w.b<=Math.max(p.x,BRIDGE.deckRight)+w.step,`${p.id} leaves the bridge deck`);continue;}
  // A walker on the short strip at a bridge foot crosses the deck and keeps to the strip.
  if(w.bridge){const [left,right]=walkers.streetAt(p.x);assert(w.a>=BRIDGE.deckLeft-w.step&&w.b<=BRIDGE.deckRight+w.step||w.a>=BRIDGE.deckLeft-w.step&&w.b+p.w/2<=right+1e-6&&left===BRIDGE.right||w.b<=BRIDGE.deckRight+w.step&&w.a-p.w/2>=left-1e-6&&right===BRIDGE.left,`${p.id} leaves the bridge and its foot`);continue;}
  if(/^field/.test(p.surface))continue;
  // The mill race, the bridge and the pavilion plinth are never walked through.
  assert(STREETS.some(([a,b])=>w.a-p.w/2>=a-1e-6&&w.b+p.w/2<=b+w.step+1e-6),`${p.id} crosses a blocked stretch: ${w.a}..${w.b}`);
  assert(w.lane>=481&&w.lane<=488,`${p.id} is outside the open front of the street`);
  if(w.b-w.a>300)long++;
 }
 assert(long>=25,'most travellers should cover several shop fronts');
 // Hand carts and talking pairs stay where they are drawn.
 for(const id of ['mill-04','mill-12','mill-20','visitors-05','visitors-19'])assert.equal(plans.get(id).walk,null,id);
});

test('every walker starts where the still scroll draws them and never jumps',async()=>{
 const {population,plans,motion:{actionAt}}=await setup();
 for(const p of population.people){
  const plan=plans.get(p.id);if(!plan.walk)continue;
  let previous=actionAt(p,plan,0);
  assert(Math.abs(previous.x-p.x)<=plan.gait.cycle/16+1e-6,`${p.id} starts away from its drawn spot`);
  for(let t=.05;t<240;t+=.05){
   const pose=actionAt(p,plan,t);
   assert(Math.abs(pose.x-previous.x)<=plan.walk.speed*.05+plan.gait.cycle/16+1e-6,`${p.id} jumps at ${t.toFixed(2)}s`);
   // People only turn round while standing still.
   if(pose.flip!==previous.flip)assert.equal(pose.gaitWeight,0,`${p.id} turns while walking`);
   previous=pose;
  }
 }
});

test('the foot on the ground stays planted while the body walks over it',async()=>{
 const {population,plans,motion:{actionAt,footAt}}=await setup();
 const p=population.people.find(p=>plans.get(p.id).walk?.style==='side'&&p.members===1);
 const plan=plans.get(p.id),reach=plan.gait.reach;
 let checked=0,last=null;
 for(let t=0;t<60;t+=1/60){
  const pose=actionAt(p,plan,t);
  if(pose.gaitWeight!==1){last=null;continue;}
  const side=pose.flip?-1:1,foot=footAt(pose.gait);
  if(foot.lift>0){last=null;continue;}
  // World position of the stance foot: hips plus the foot's backward travel.
  const x=pose.x+side*foot.travel*reach;
  // Consecutive frames of one stance: the cycle has advanced without wrapping.
  if(last&&pose.gait>=last.gait&&pose.flip===last.flip){
   assert(Math.abs(x-last.x)<1e-6,`stance foot slides by ${(x-last.x).toFixed(3)} at ${t.toFixed(2)}s`);checked++;
  }
  last={x,gait:pose.gait,flip:pose.flip};
 }
 assert(checked>100,'too few stance frames checked');
});

test('swinging feet lift and land smoothly, and the gait settles when stopping',async()=>{
 const {motion:{footAt}}=await setup();
 let previous=footAt(0);
 for(let c=.001;c<=1;c+=.001){
  const f=footAt(c);
  assert(Math.abs(f.travel-previous.travel)<.01,'foot jumps');
  assert(f.lift>=0&&f.lift<=1);
  previous=f;
 }
 assert.equal(footAt(.3).lift,0);assert(footAt(.8).lift>.9);
});

test('a reaction overlay settles a walker\'s feet and returns to the walk',async()=>{
 const [{population:source},{createDisplayPopulation},{createActionPlans,actionAt}]=await modules;
 const {reactionPose}=await import('../src/extension-workshop-state.js');
 const population=createDisplayPopulation(source),plans=createActionPlans(population);
 const p=population.people.find(p=>plans.get(p.id).walk),plan=plans.get(p.id);
 const idle=actionAt(p,plan,3),settled=reactionPose(p,idle,idle,1);
 assert(settled.gaitWeight<.1);assert.equal(settled.x,idle.x);
 assert.deepEqual(reactionPose(p,idle,idle,2.35),idle);
});
