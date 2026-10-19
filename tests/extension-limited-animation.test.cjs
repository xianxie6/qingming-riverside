const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const model=import('../src/extension-limited-animation.js');

test('work cycles hold the rest pose longest and only show drawn cells',async()=>{
 const {LIMITED,limitedFrame}=await model;
 for(const [id,spec] of Object.entries(LIMITED)){
  if(spec.walk)continue;
  const shown=new Map();let previous=limitedFrame(spec,{},0),switches=0;
  for(let t=0;t<60;t+=.01){
   const f=limitedFrame(spec,{},t,.37);
   assert(Number.isInteger(f)&&f>=0&&f<spec.cols,`${id} shows a missing cell`);
   shown.set(f,(shown.get(f)||0)+.01);if(f!==previous)switches++;previous=f;
  }
  // Every pose the timeline names is shown; a sheet may hold an unused cell.
  assert.deepEqual([...shown.keys()].sort(),[...new Set(spec.timeline.map(([f])=>f))].sort(),`${id} never shows some poses`);
  assert(shown.size>=2,`${id} needs at least two poses`);
  // Limited animation: poses are held, never flickered at frame rate.
  assert(switches/60<4,`${id} switches too often`);
  assert(shown.get(0)>=Math.max(...shown.values())-1e-6,`${id} should rest longest`);
  assert.equal(spec.activity.length,spec.cols);
 }
 // A still scroll always shows the rest pose.
 for(const spec of Object.values(LIMITED))assert.equal(limitedFrame(spec,{gaitWeight:1,walked:7},null),0);
});

test('a walk cycle stands still when stopped and advances one cell per quarter stride',async()=>{
 const {LIMITED,limitedFrame}=await model,spec={...LIMITED['bridge-23'],stride:20};
 assert.equal(limitedFrame(spec,{gaitWeight:0,walked:13},5),0);
 const seen=[];for(let d=0;d<40;d+=1)seen.push(limitedFrame(spec,{gaitWeight:1,walked:d},5));
 assert.deepEqual([...new Set(seen)],[1,2,3,4]);
 assert.equal(limitedFrame(spec,{gaitWeight:1,walked:0},5),limitedFrame(spec,{gaitWeight:1,walked:20},5));
 for(let d=1;d<seen.length;d++)assert([0,1,-3].includes(seen[d]-seen[d-1]),'walk cells skip');
});

test('cells are measured and aligned on soles or head, not on their boxes',async()=>{
 const {measureCell,alignCells}=await model;
 // Two 40x60 cells: a figure (head 6..14, body, feet) shifted by (+5,-3) in the second cell.
 const width=80,height=60,pixels=new Uint8Array(width*height);
 const paint=(dx,dy,arm)=>{
  for(let y=4;y<50;y++)for(let x=14;x<26;x++)pixels[(y+dy)*width+x+dx]=255;
  for(let y=30;y<34;y++)for(let x=26;x<26+arm;x++)pixels[(y+dy)*width+x+dx]=255;
 };
 paint(0,0,4);paint(45,-3,10);
 const alpha=(x,y)=>pixels[y*width+x];
 const cells=[measureCell(alpha,width,height,0,40),measureCell(alpha,width,height,40,40)];
 for(const anchor of ['feet','head']){
  const [a,b]=alignCells(cells,anchor);assert.deepEqual(a,{x:0,y:0});
  assert.equal(b.y,3,'sole lines must match');assert.equal(b.x,-5,`${anchor} anchor ignores the outstretched arm`);
 }
 assert.equal(measureCell(()=>0,width,height,0,40),null);
});

test('figures without installed sheets keep the original still art',async()=>{
 const {LIMITED,LIMITED_DIR}=await model;
 const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'..',LIMITED_DIR,'manifest.json'),'utf8'));
 assert(Array.isArray(manifest.installed));
 for(const file of manifest.installed){
  assert(Object.values(LIMITED).some(s=>s.file===file),`${file} is not configured`);
  assert(fs.existsSync(path.join(__dirname,'..',LIMITED_DIR,file+'.webp')),`${file}.webp is missing`);
 }
 for(const spec of Object.values(LIMITED)){
  const prompt=path.join(__dirname,'..','art-source/street-extension/limited-animation',spec.file+'-v1.json');
  const job=JSON.parse(fs.readFileSync(prompt,'utf8'));
  assert.equal(job.cells,spec.cols,`${spec.file} prompt asks for the wrong number of cells`);
  // Jobs record absolute paths from the authoring machine; check them inside this checkout.
  for(const ref of job.prompt.referenced_image_paths){
   const at=ref.indexOf('art-source/'),local=at<0?ref:path.join(__dirname,'..',ref.slice(at));
   assert(fs.existsSync(local),`${ref} is missing`);
  }
 }
});

test('figures with drawn walk cycles face the way they walk, in both directions',async()=>{
 const [{population:source},{createDisplayPopulation},{createActionPlans,actionAt}]=await Promise.all([import('../src/extension-people-data.js'),import('../src/extension-people-layout.js'),import('../src/extension-motion.js')]);
 const {LIMITED}=await model,population=createDisplayPopulation(source),plans=createActionPlans(population);
 for(const [id,spec] of Object.entries(LIMITED)){
  if(!spec.walk)continue;
  const p=population.people.find(q=>q.id===id),plan=plans.get(id);
  assert(plan.walk,`${id} has a walk cycle but no route`);
  assert.equal(plan.walk.style,'side',`${id} must use the side-view walk`);
  let previous=actionAt(p,plan,0),left=0,right=0;
  for(let t=.05;t<plan.walk.timeline.period*1.2;t+=.05){
   const pose=actionAt(p,plan,t),dx=pose.x-previous.x;
   // Drawn cells face right; walking left must mirror the figure.
   if(dx<-.05){assert.equal(pose.flip,true,`${id} walks backwards to the left at ${t.toFixed(2)}s`);left++;}
   if(dx>.05){assert.equal(pose.flip,false,`${id} walks backwards to the right at ${t.toFixed(2)}s`);right++;}
   previous=pose;
  }
  assert(left>10&&right>10,`${id} should walk both ways`);
 }
});
