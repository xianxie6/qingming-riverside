const {test}=require('node:test');const assert=require('node:assert/strict');
const load=name=>import(require('node:url').pathToFileURL(require('node:path').resolve('src',name)).href);
test('city fusion preserves all 448 original people, unique artwork and 25 target IDs',async()=>{
 const {createPopulation}=await load('explore-population.js'),{visitors}=await load('visitors-data.js'),{applyCityFusion}=await load('city-fusion.js'),{createTargets}=await load('collection-data.js');
 const original=createPopulation(),people=applyCityFusion(original),byId=new Map(original.map(p=>[p.id,p]));
 assert.equal(people.reduce((n,p)=>n+p.members,0)+visitors.reduce((n,p)=>n+p.members,0),448);
 for(const p of people){const old=byId.get(p.id);if(p.repairedArtwork){assert.ok(['bridge-25','gate-41'].includes(p.id));assert.deepEqual(p.originalAssetVariants,old.assetVariants);assert.equal(p.atlasColumns,1);assert.equal(p.atlasRows,1);}else{assert.equal(p.sprite,old.sprite);assert.deepEqual(p.assetVariants,old.assetVariants);}assert.equal(p.visualIdentity,old.visualIdentity);assert.ok(p.anchor[1]>.3&&p.anchor[1]<=1);}
 assert.deepEqual(createTargets(people).map(t=>t.targetId),createTargets(original).map(t=>t.targetId));
});
test('all reviewed poses use a consistent visible scale and keep feet off buildings, rails and boat canopies',async()=>{
 const {createPopulation}=await load('explore-population.js'),{visitors}=await load('visitors-data.js'),{applyCityFusion}=await load('city-fusion.js');
 const audit=require('../docs/city-fusion/ground-review.json'),poses=require('../docs/city-fusion/posture-review.json');
 const inPoly=(x,y,poly)=>{let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;};
 const all=applyCityFusion([...createPopulation(),...visitors.map(p=>({...p,ambient:true}))]);
 assert.equal(all.length,382);
 for(const p of all){
  const m=p.visualMetrics,x=p.position[0]*2004,y=p.position[1]*785;
  const atlas=poses.atlases[p.assetVariants?.high?.split('/').at(-1).replace('.webp','')||'duos'];
  const posture=p.repairedArtwork?p.posture:Object.keys(atlas).find(k=>atlas[k].includes(p.sprite))||'standing';
  assert.equal(p.posture,posture,p.id);
  assert.ok(Math.abs(p.scale*(m.bottom-m.top)-(p.reviewedPointFix?p.visibleHeight:poses.visibleHeights[posture]))<.001,`${p.id} has inconsistent silhouette scale`);
  assert.ok(p.footCoverage>=(p.regionId==='boats'?.5:.84),p.id);
  assert.ok(!audit.bridgeRails.some(poly=>inPoly(x,y,poly)),`${p.id} stands on a rail`);
  if(p.regionId==='boats'){
   assert.ok(audit.boatDecks.some(poly=>inPoly(x,y,poly)),`${p.id} is not on open deck`);
   assert.ok(!audit.boatCanopies.some(([l,t,r,b])=>x>l&&x<r&&y>t&&y<b),`${p.id} is on a canopy`);
  }else{
   assert.ok(![...audit.buildings,...audit.groundObstacles].some(([l,t,r,b])=>x>l&&x<r&&y>t&&y<b),`${p.id} stands on a structure`);
   assert.ok(!inPoly(x,y,audit.river)||inPoly(x,y,audit.bridgeDeck),`${p.id} stands in the river`);
  }
 }
});
