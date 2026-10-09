const test=require('node:test');
const assert=require('node:assert/strict');
const detail=import('../src/crossing-details.js');
const movement=require('../src/movement.js');

test('every idle timber keeps moving even when the scroll position is fixed',async()=>{
  const {timberBreath}=await detail;
  for(let i=0;i<400;i++)for(const arrival of [0,.5,1]){
    const a=timberBreath(i,arrival,0),b=timberBreath(i,arrival,2);
    assert.ok(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)>.0001);
    assert.ok(Math.abs(b.y)<=.17);
  }
});

test('painted rowing hands both grip the shaft and soles stay planted across strokes and camera angles',async()=>{
  const {createRowingRig,rowingPoint,paddleThroughHands,rowingStroke}=await detail;
  const art={frame:{w:549,h:887},grips:[[.964692,.281596],[.919927,.428212]],contacts:[{x:75.712,y:881},{x:429.469,y:887}]};
  let first=null,moved=false;
  for(let t=0;t<10.8;t+=.06){
    const rig=createRowingRig(art,t,movement),hands=rig.grips.map(uv=>rowingPoint(...uv,rig));
    for(const arm of rig.arms)for(let j=0;j<2;j++){
      const length=Math.hypot(arm.target[j+1][0]-arm.target[j][0],arm.target[j+1][1]-arm.target[j][1]);
      assert.ok(Math.abs(length-arm.lengths[j])<1e-8,'neither upper arm nor forearm stretches');
    }
    for(const uv of rig.grips){
      const nearby=[uv[0]-.012,uv[1]+.005],source=movement.deform(...uv,rig),sourceNear=movement.deform(...nearby,rig);
      const hand=rowingPoint(...uv,rig),handNear=rowingPoint(...nearby,rig);
      assert.ok(Math.abs(Math.hypot(hand[0]-handNear[0],hand[1]-handNear[1])-Math.hypot(source[0]-sourceNear[0],source[1]-sourceNear[1]))<1e-8,'the painted fist rotates without warping');
    }
    if(first)moved ||= Math.hypot(hands[0][0]-first[0],hands[0][1]-first[1])>.05;else first=hands[0];
    for(const foot of art.contacts){const p=rowingPoint(foot.x/art.frame.w,foot.y/art.frame.h,rig);
      assert.ok(Math.abs(p[0]-(foot.x/art.frame.w-.5)*rig.w)<1e-8);
      assert.ok(Math.abs(p[1]-(foot.y-887)/887*rig.h)<1e-8);
    }
    for(const yaw of [-.15,0,.35]){
      const [upper,lower]=hands.map(([x,y])=>({x:.3+x*Math.cos(yaw),y:.44-y,z:1.45-x*Math.sin(yaw)}));
      const {start,tip}=paddleThroughHands(upper,lower,rowingStroke(t).waterY);
      const axis=[tip.x-start.x,tip.y-start.y,tip.z-start.z];
      for(const hand of [upper,lower]){
        const offset=[hand.x-start.x,hand.y-start.y,hand.z-start.z];
        assert.ok(Math.hypot(offset[1]*axis[2]-offset[2]*axis[1],offset[2]*axis[0]-offset[0]*axis[2],offset[0]*axis[1]-offset[1]*axis[0])<1e-8);
      }
      const fraction=(.64-start.y)/(tip.y-start.y);
      assert.ok(start.x+(tip.x-start.x)*fraction>.89,'the gripped shaft clears the hull');
      assert.equal(tip.y,rowingStroke(t).waterY);
    }
  }
  assert.ok(moved,'the hands keep rowing at a fixed journey progress');
});

test('the blade lifts clear for recovery and disturbs water only during the power stroke',async()=>{
  const {rowingStroke}=await detail;
  assert.ok(rowingStroke(.9).waterY<0);assert.ok(rowingStroke(.9).power>.9);
  assert.ok(rowingStroke(2.8).waterY>0);assert.equal(rowingStroke(2.8).power,0);
  assert.deepEqual(rowingStroke(0),rowingStroke(3.6));
});
