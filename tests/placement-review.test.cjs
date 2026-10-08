const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {pathToFileURL}=require('node:url');
const {resolve}=require('node:path');
const load=name=>import(pathToFileURL(resolve('src',name)).href);
const review=JSON.parse(readFileSync('docs/people-v3/placement-review.json','utf8'));

test('final rendered residents and visitor pairs clear the reviewed roofs and awnings',async()=>{
 const {createPopulation}=await load('explore-population.js'),{visitors}=await load('visitors-data.js');
 for(const p of [...createPopulation(),...visitors.map(p=>({...p,ambient:true}))]){
  const w=p.scale*(p.ambient?1:.75),x=p.position[0]*2004,y=p.position[1]*785;
  const a=[x-w/2,y-p.scale*.92,x+w/2,y+p.scale*.08];
  for(const {id,bounds:b} of review.keepouts){
   const overlap=Math.min(a[2],b[2])>Math.max(a[0],b[0])&&Math.min(a[3],b[3])>Math.max(a[1],b[1]);
   assert.ok(!overlap,`${p.id} intersects ${id} after final scaling`);
  }
 }
});

test('terraces contain working villagers and the expanded lanes carry more visitors',async()=>{
 const {createPopulation}=await load('explore-population.js'),{visitors}=await load('visitors-data.js');
 const farmers=createPopulation().filter(p=>p.surfaceId==='terrace-reviewed-bench');
 assert.equal(farmers.length,10);
 assert.ok(farmers.every(p=>p.regionId==='fields'&&p.position[1]<.25&&p.scale===12));
 assert.ok(visitors.filter(p=>p.regionId==='lanes').length>=51);
});
