const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

function canvas(){
  let width=0,height=0,resets=0;
  return {get width(){return width;},set width(v){width=Math.floor(v);resets++;},
    get height(){return height;},set height(v){height=Math.floor(v);resets++;},get resets(){return resets;}};
}

test('fractional zoom and DPR reuse the actor backing store without losing resolution',()=>{
  const source=fs.readFileSync(__dirname+'/../src/scene.js','utf8');
  const start=source.indexOf('  function drawActors(){');
  const sizing=source.slice(start,source.indexOf('    actorContext.setTransform',start))+'\n}';
  for(const dpr of [1,1.25,2,3])for(const scale of [.97,1.333,2.375]){
    const actors=canvas(),state={camera:35.5,width:1365,scale};
    const scope={actors,state,H:724,devicePixelRatio:dpr};vm.createContext(scope);
    vm.runInContext(sizing+';drawActors();',scope);
    const resets=actors.resets;
    for(let i=0;i<60;i++){state.camera+=.123;vm.runInContext('drawActors()',scope);}
    assert.equal(actors.resets,resets,'panning must not reallocate a canvas');
    assert.ok(actors.height>=724*Math.min(dpr*scale,4),'keep full original pixel density');
    state.width+=100;vm.runInContext('drawActors()',scope);
    assert.ok(actors.resets>resets,'a real size change reallocates');
  }
});

test('dining guests clear and reset transforms without reallocating unchanged HD canvases',()=>{
  const scope={window:{},devicePixelRatio:2};vm.runInNewContext(fs.readFileSync(__dirname+'/../src/sunyang-guests.js','utf8'),scope);
  const calls=[];
  const ctx=new Proxy({}, {get:(_,key)=>(...args)=>calls.push([key,...args]),set:()=>true});
  const target=canvas();target.style={};target.getContext=()=>ctx;
  const guest={canvas:target,frames:[{width:200,height:400},{width:200,height:300}],x:.5,y:.7,phase:1,seated:1,blend:1};
  const renderer=Object.create(scope.window.SunyangGuests.prototype);renderer.project=([x,y])=>[x*1440,y*900];
  renderer.draw(guest);const resets=target.resets;
  for(let i=0;i<60;i++){guest.phase+=.01;renderer.draw(guest);}
  assert.equal(target.resets,resets);
  assert.equal(calls.filter(([key])=>key==='clearRect').length,61);
  assert.equal(calls.filter(([key])=>key==='setTransform').length,122);
  assert.equal(target.width,Math.ceil(.265*900*2));
});
