const test=require('node:test');
const assert=require('node:assert/strict');
const {createWalkInput,stepWalk,gaitAt,speeds}=require('../src/movement.js');

function run(duration,hz,options,initial={x:0,velocity:0}){
  let p=initial;
  for(let i=0;i<Math.round(duration*hz);i++)p=stepWalk(p.x,p.velocity,1/hz,options);
  return p;
}

test('short keyboard taps have the same destination with or without a rendered frame',()=>{
  for(const elapsed of [0,16,80]){
    const input=createWalkInput();
    input.press('ArrowRight',1,585,0);
    const p=stepWalk(585,0,elapsed/1000,{direction:input.direction});
    const goal=input.release('ArrowRight',p.x,elapsed);
    assert.equal(goal,603);assert.equal(input.direction,0);
    const end=run(2,60,{goal},p);
    assert.equal(end.x,603);assert.equal(end.velocity,0);
  }
});

test('long presses ignore keyboard repeat and release without adding another step',()=>{
  const input=createWalkInput();input.press('ArrowRight',1,0,0);
  let p={x:0,velocity:0};
  for(let i=0;i<120;i++){
    assert.equal(input.press('ArrowRight',1,p.x,i*1000/60),false);
    p=stepWalk(p.x,p.velocity,1/60,{direction:input.direction});
  }
  assert.equal(input.release('ArrowRight',p.x,2000),null);
  const end=run(1,60,{},p);
  assert.ok(end.x>p.x&&end.x-p.x<4,'release eases to rest within four world pixels');
  assert.equal(end.velocity,0);
});

test('mouse taps use the press position and interrupted captures cannot leave a held direction',()=>{
  const input=createWalkInput();
  input.press('pointer:7',1,100,0,45);
  assert.equal(input.release('pointer:7',112,150),145);
  assert.equal(input.release('pointer:7',112,151,true),null,'lost capture after pointerup is harmless');
  input.press('pointer:8',-1,145,200,45);
  assert.equal(input.release('pointer:8',140,220,true),null);
  assert.equal(input.direction,0);
  input.press('ArrowLeft',-1,140,230);input.clear();
  assert.equal(input.direction,0);assert.equal(input.release('ArrowLeft',140,240),null);
});

test('simultaneous controls keep the most recent direction until that source is released',()=>{
  const input=createWalkInput();
  input.press('ArrowLeft',-1,100,0);
  input.press('pointer:2',1,100,10,45);assert.equal(input.direction,1);
  assert.equal(input.release('pointer:2',110,100),null);assert.equal(input.direction,-1);
  input.release('ArrowLeft',90,500);assert.equal(input.direction,0);
});

test('held movement is refresh-rate independent and rapid taps preserve velocity',()=>{
  const positions=[30,60,120].map(hz=>run(2,hz,{direction:1}));
  for(const p of positions)assert.ok(Math.abs(p.x-positions[0].x)<1e-8);
  const p=run(.2,60,{direction:1});
  const released=stepWalk(p.x,p.velocity,1/60,{goal:45});
  const pressed=stepWalk(released.x,released.velocity,1/60,{direction:1});
  assert.ok(released.velocity>95&&pressed.velocity>95,'a new press does not restart from zero');
  const reverse=stepWalk(p.x,p.velocity,1/60,{direction:-1});
  assert.ok(reverse.velocity>0&&reverse.velocity<p.velocity,'a reversal brakes before changing direction');
  assert.ok(run(.3,60,{direction:-1},reverse).velocity<-100);
  assert.deepEqual(stepWalk(p.x,p.velocity,0,{direction:1}),{...p,arrived:false},'pause preserves motion state');
});

test('destinations and street boundaries stop the figure without overshooting',()=>{
  for(const goal of [-600,-18,18,600]){
    let p={x:0,velocity:0},arrived=false;
    for(let i=0;i<1200;i++){
      p=stepWalk(p.x,p.velocity,1/60,{goal,min:-500,max:500});
      assert.ok(p.x>=-500&&p.x<=500);assert.ok(Math.abs(p.velocity)<=speeds.walk);
      if(p.arrived){arrived=true;break;}
    }
    assert.ok(arrived);assert.equal(p.x,Math.max(-500,Math.min(500,goal)));assert.equal(p.velocity,0);
  }
  assert.deepEqual(run(1,60,{direction:1,min:-10,max:10}),{x:10,velocity:0,arrived:false});
});

test('slowing to a stop lowers the raised foot without resetting either horizontal foot position',()=>{
  for(let distance=0;distance<50;distance+=.5){
    const walking=gaitAt(distance,66);
    for(const weight of [.8,.4,0]){
      const settling=gaitAt(distance,66,weight);
      settling.forEach((foot,i)=>{
        assert.equal(foot.x,walking[i].x);
        assert.equal(foot.lift,walking[i].lift*weight);
        if(weight===0){assert.equal(foot.lift,0);assert.equal(foot.stance,true);}
      });
    }
  }
});
