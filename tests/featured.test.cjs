const test=require('node:test');
const assert=require('node:assert/strict');
const {poleThrough,boat}=require('../src/featured-characters.js');
const {deform,activityAt}=require('../src/movement.js');
const world=require('../src/world.js');

test('boarding, sailing and disembarking all join the visible boat deck',()=>{
  for(const berth of ['east','west']){
    const ferry={...world.createFerry(),...world.berths[berth],origin:berth,destination:berth};
    const expectedY=ferry.y+boat.deckY*world.ferryGeometry.scale;
    for(const [mode,tripTime] of [['boarding',3.4],['sailing',0],['disembarking',0]]){
      const pose=world.passengerPose({...ferry,mode,tripTime});
      assert.ok(Math.abs(pose.y-expectedY)<1e-8,`${berth} ${mode}: soles stay on the drawn deck`);
    }
  }
});

test('boat pole follows both animated grips while both feet stay on the deck',()=>{
  const contacts=[{x:80,y:880},{x:420,y:880}],grips=[[.96,.28],[.92,.43]];
  for(let t=0;t<12;t+=.05){
    const rig={w:33,h:boat.crewHeight,f:{w:550,h:885},contacts,
      feet:contacts.map(p=>({x:(p.x/550-.5)*33,y:0})),pose:activityAt('row',t,0,4.8),hand:grips[0],walking:false};
    const hands=grips.map(uv=>{const [x,y]=deform(...uv,rig);return {x:x+boat.crewX,y:y+boat.deckY};});
    const pole=poleThrough(hands);
    for(const hand of hands){
      const cross=(hand.x-pole.top.x)*(pole.tip.y-pole.top.y)-(hand.y-pole.top.y)*(pole.tip.x-pole.top.x);
      assert.ok(Math.abs(cross)<1e-7,'both hands remain on the pole');
    }
    assert.ok(pole.tip.y>boat.top+boat.height,'pole reaches the water below the hull');
    for(const foot of contacts)assert.ok(Math.abs(deform(foot.x/550,foot.y/885,rig)[1])<1e-8,'rowing does not lift either foot');
  }
});
