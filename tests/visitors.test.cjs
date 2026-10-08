const {test}=require('node:test');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {resolve}=require('node:path');
const load=name=>import(pathToFileURL(resolve('src',name)).href);
test('128 additional visitors have unique drawings and keep all collection targets intact',async()=>{
 const {visitors}=await load('visitors-data.js'),{createPopulation}=await load('explore-population.js'),{createTargets}=await load('collection-data.js');
 const people=createPopulation();
 assert.equal(visitors.length,64);assert.equal(new Set(visitors.map(p=>p.sprite)).size,64);
 assert.equal(people.reduce((n,p)=>n+p.members,0)+visitors.reduce((n,p)=>n+p.members,0),448);
 assert.equal(createTargets(people).length,25);
 for(const p of visitors){assert.ok(p.footCoverage>=.95);assert.ok(p.hdFootCoverage>=.85);assert.ok(p.groundCoverage>=.78);}
});
test('visitor silhouettes never cover residents or other visitor groups',async()=>{
 const {visitors}=await load('visitors-data.js'),{createPopulation}=await load('explore-population.js'),{personBounds}=await load('collection-data.js');
 const occupied=createPopulation().map(p=>({...personBounds(p,2004,785),id:p.id}));
 for(const p of visitors){
  const a={x:p.position[0]*2004-p.scale/2,y:p.position[1]*785-p.scale*.92,w:p.scale,h:p.scale};
  for(const b of occupied)assert.ok(Math.min(a.x+a.w,b.x+b.w)<=Math.max(a.x,b.x)||Math.min(a.y+a.h,b.y+b.h)<=Math.max(a.y,b.y),`${p.id} covers ${b.id}`);
  occupied.push({...a,id:p.id});
 }
});
