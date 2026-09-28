const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const world=require('../src/world.js');

test('every district moves the visitor and clears an old journey, including aboard a ferry',()=>{
  const source=fs.readFileSync(__dirname+'/../src/scene.js','utf8');
  const code=source.slice(source.indexOf("  window.addEventListener('atlas-enter'"),source.indexOf('  const loadError='));
  for(const x of [-1550,650,1560,3360])for(const mode of ['waiting','boarding','sailing','disembarking']){
    let enter;
    const player={x:585,pose:{y:550},velocity:100,goal:900,pending:'dock',action:'voyage',moving:true};
    const ferry={...world.createFerry(),mode};
    const state={loaded:true,width:1280,scale:1,max:3064};
    const scope={window:{addEventListener:(_,fn)=>{enter=fn;}},world,player,ferry,state,
      MIN:-2172,MAX:4344,clamp:world.clamp,painting:{dataset:{}},
      aboard:()=>world.isPassenger(ferry),
      cancelJourney:()=>{assert.equal(world.isPassenger(ferry),false);Object.assign(player,{velocity:0,goal:null,pending:null,action:null,moving:false});},
      zoomAt:()=>{},setFollow:value=>{player.follow=value;},
      cameraForPlayer:()=>player.x-state.width*.44,
      updateHailUI:()=>{},announce:()=>{}};
    vm.runInNewContext(code,scope);enter({detail:{x}});
    assert.equal(player.x,x);assert.equal(player.pose,null);assert.equal(player.goal,null);
    assert.equal(player.velocity,0);assert.equal(player.follow,true);
    assert.equal(state.camera,state.target);assert.equal(state.camera,x-1280*.44);
    assert.equal(scope.painting.dataset.entryX,String(x));
  }
});
