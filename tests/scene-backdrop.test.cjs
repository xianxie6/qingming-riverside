const test=require('node:test');
const assert=require('node:assert/strict');
const backdrop=import('../src/scene-backdrop.js');
function canvas(){
  const context={setTransform(){},clearRect(){}};let width=0,height=0,resets=0;
  return {get width(){return width;},set width(value){width=value;resets++;},get height(){return height;},set height(value){height=value;resets++;},get resets(){return resets;},getContext(){return context;}};
}
test('walking and reversing reuse the full-density background until the viewport leaves its tile',async()=>{
  const {BackdropCache}=await backdrop;
  for(const density of [1,1.25,2.61,5.22]){
    const source=canvas(),cache=new BackdropCache(()=>source);let draws=0;
    const view={camera:1150.25,viewWidth:837.5,height:724,density,key:'summer:dry'};
    cache.get(view,()=>draws++);const version=cache.version,resets=source.resets;
    for(let i=0;i<120;i++)cache.get({...view,camera:view.camera+i*.9},()=>draws++);
    for(let i=0;i<120;i++)cache.get({...view,camera:view.camera+108-i*.9},()=>draws++);
    assert.equal(draws,1);assert.equal(cache.version,version);assert.equal(source.resets,resets);
    assert.ok(source.height>=724*density);assert.ok(source.width>=837.5*density);
    cache.get({...view,camera:view.camera+170},()=>draws++);
    assert.equal(draws,2);assert.equal(source.resets,resets,'a new camera tile reuses its allocation');
    assert.ok(cache.rect.x<=view.camera+170);assert.ok(cache.rect.x+cache.rect.width>=view.camera+170+view.viewWidth);
  }
});
test('artwork, wetness, zoom and resize rebuild the background, and explicit invalidation is honored',async()=>{
  const {BackdropCache}=await backdrop,cache=new BackdropCache(canvas);let draws=0;
  let view={camera:-1750,viewWidth:900,height:724,density:2,key:'1:0'};
  const draw=()=>draws++;
  cache.get(view,draw);
  for(const change of [{key:'2:0'},{key:'2:0.5'},{density:3},{viewWidth:450}]){
    view={...view,...change};cache.get(view,draw);
  }
  assert.equal(draws,5);cache.invalidate();cache.get(view,draw);assert.equal(draws,6);
});
