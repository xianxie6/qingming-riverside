const test=require('node:test');
const assert=require('node:assert/strict');

test('unlit particle geometry removes only duplicate seam and pole vertices',async()=>{
  const THREE=await import('../vendor/three.module.js');
  const {createParticleGeometry}=await import('../src/crossing-hero.js');
  const before=new THREE.SphereGeometry(1,6,4),after=createParticleGeometry();
  assert.equal(before.attributes.position.count,35);
  assert.equal(after.attributes.position.count,20);
  assert.equal(after.index.count,before.index.count,'keep every triangle and its winding');
  assert.equal(after.index.count/3,36);
  for(let i=0;i<before.index.count;i++){
    const a=before.index.getX(i),b=after.index.getX(i);
    for(const axis of ['getX','getY','getZ']){
      assert.ok(Math.abs(before.attributes.position[axis](a)-after.attributes.position[axis](b))<1e-7,'every triangle corner retains its position');
    }
  }
  before.dispose();after.dispose();
});
