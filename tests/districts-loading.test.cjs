const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function setup(){
  const requests=[];
  class Image{
    set src(value){this.url=value;requests.push(this);}
    async decode(){}
  }
  const scope={window:{},Image,setTimeout:()=>1,clearTimeout:()=>{}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/../src/districts.js','utf8'),scope);
  return {districts:new scope.window.Districts(),requests};
}
test('a selected view waits only for its visible side artwork, including overlap strips',async()=>{
  const {districts:d,requests}=setup();
  assert.equal(requests.length,0,'constructor must not download both districts');
  await d.loadRange(100,2072);assert.equal(requests.length,0);
  const west=d.loadRange(-2172,-600);
  assert.equal(requests.length,1);assert.match(requests[0].url,/district-west-fast/);
  assert.equal(d.hasRange(-2172,-600),false);
  await requests[0].onload();await west;
  assert.equal(d.hasRange(-2172,-600),true);
  assert.equal(d.hasRange(99,2072),true);
  assert.equal(d.hasRange(100,2073),false,'east overlap must be ready before displaying it');
  const east=d.loadRange(1800,3000);
  assert.equal(requests.length,2);await requests[1].onload();await east;
  assert.equal(d.hasRange(-2172,4344),true);
  assert.equal(d.revision,2,'water backdrop invalidates when architecture arrives');
});
test('background loads deduplicate, promote priority, and failures remain retryable',async()=>{
  const {districts:d,requests}=setup();
  const background=d.load();
  assert.equal(requests.length,2);assert.equal(requests[0].fetchPriority,'low');
  const foreground=d.loadRange(-1500,-500);
  assert.equal(requests.length,2);assert.equal(requests[0].fetchPriority,'high');
  await requests[0].onload();await foreground;
  const failure=assert.rejects(background,/Failed to load/);requests[1].onerror();await failure;
  assert.equal(d.hasRange(2500,4000),false);
  const retry=d.loadRange(2500,4000);assert.equal(requests.length,3);
  await requests[2].onload();await retry;
  assert.equal(d.hasRange(2500,4000),true);
});
