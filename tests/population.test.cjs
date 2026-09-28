const test=require('node:test');
const assert=require('node:assert/strict');
const {bounds,proportions,figureHeight,residents,walkers,residentPose}=require('../src/population.js');
const {pedestrianAt,streetY}=require('../src/world.js');
const {palettes,garments}=require('../src/wardrobe.js');

test('three districts have unique inhabitants inside the expanded world',()=>{
  assert.equal(bounds.max-bounds.min,3*bounds.originalWidth);
  const ids=[...residents,...walkers].map(p=>p.id);assert.equal(new Set(ids).size,ids.length);
  for(const [min,max] of [[bounds.min,0],[0,2172],[2172,bounds.max]]){
    assert.ok(residents.filter(p=>p.x>=min&&p.x<max).length>=20);
    assert.ok(walkers.filter(p=>p.from>=min&&p.from<max).length>=8);
  }
  for(const p of residents)assert.ok(p.x>bounds.min&&p.x<bounds.max);
});
test('figures share a coherent height system for their pose and scene depth',()=>{
  for(const p of residents){
    const band=p.sprite===10?proportions.child:
      [6,7,8].includes(p.sprite)?proportions.seated:
      p.layer==='bridge'?proportions.bridge:
      p.layer==='pavilion'?proportions.pavilion:proportions.adult;
    assert.ok(p.h>=band.min&&p.h<=band.max,`${p.id} height ${p.h} escapes its visual band`);
  }
  assert.equal(figureHeight(74,9,'street'),66,'foreground adults cannot become giants');
  assert.equal(figureHeight(65,6,'street'),48,'seated crops preserve adult head scale');
  assert.equal(figureHeight(65,9,'bridge'),58,'distant bridge figures stay behind the foreground');
  const diner=residents.find(p=>p.x===620);
  assert.equal(diner.h,48);assert.equal(diner.y,459,'a resized diner rises to the stool instead of sinking into the table');
});
test('men and women in every district wear stable, varied two-part outfits',()=>{
  for(const p of [...residents,...walkers]){
    assert.ok(palettes[p.outfit],`${p.id} has an outfit`);
    assert.ok(garments[p.sprite],`${p.id} has clothing masks`);
  }
  for(const sprite of [0,1,2,10]){
    assert.ok(new Set(walkers.filter(p=>p.sprite===sprite).map(p=>p.outfit)).size>=6,'appearance does not repeat with walking route or gender');
  }
  for(const [min,max] of [[-2172,0],[0,2172],[2172,4344]]){
    assert.ok(new Set(residents.filter(p=>p.x>=min&&p.x<max).map(p=>p.outfit)).size>=6);
  }
  assert.ok(palettes.every(p=>p.upper!==p.lower));
});
test('every resident has independent motion, including balcony diners and bridge groups',()=>{
  for(const p of residents){
    const a=residentPose(p,0),b=residentPose(p,.75);
    assert.notEqual(a.sway,b.sway,p.id);
    assert.deepEqual(residentPose(p,12),residentPose(p,12),'paused time is deterministic');
    if(p.layer==='bridge')assert.ok(streetY(p.x)>=402&&streetY(p.x)<=477);
  }
  assert.equal(residents.filter(p=>p.layer==='balcony').length,7);
  assert.equal(residents.filter(p=>p.layer==='pavilion').length,2);
  assert.ok(new Set(residents.map(p=>residentPose(p,2).gesture.toFixed(3))).size>20);
});
test('expanded walking routes remain continuous at zero and the east boundary',()=>{
  assert.ok(walkers.some(p=>p.from<0&&p.to>0));
  assert.ok(walkers.some(p=>p.from<2172&&p.to>2172));
  for(const p of walkers){
    let last=pedestrianAt(p,0);
    for(let time=1/30;time<240;time+=1/30){
      const pose=pedestrianAt(p,time);
      assert.ok(pose.x>=p.from&&pose.x<=p.to);
      assert.ok(Math.abs(pose.x-last.x)<=p.speed/30+.001);
      last=pose;
    }
  }
});
