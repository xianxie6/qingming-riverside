const test=require('node:test');
const assert=require('node:assert/strict');
const {residents,residentPose}=require('../src/population.js');
const {activityAt,deform}=require('../src/movement.js');
const workers=residents.filter(p=>[-845,-790,-715].includes(p.x));

test('all three weavers stand on the street after the seated source is replaced',()=>{
  assert.equal(workers.length,3);
  for(const p of workers){
    assert.equal(p.sprite,11);
    assert.equal(p.y,p.groundY);assert.ok(p.y>=474&&p.y<=475);
    assert.equal(p.h,63);
  }
  assert.equal(new Set(workers.map(p=>p.outfit)).size,3);
  assert.equal(new Set(workers.map(p=>p.period)).size,3);
  assert.deepEqual(workers.map(p=>p.activity),['hang-cloth','weave','arrange-frame']);
});

test('a complete work cycle has a readable reach, gentle return and no loop jump',()=>{
  const period=5.6;
  for(const key of ['handX','handY','lean','nod','sway']){
    const before=activityAt('weave',period-1e-5,0,period)[key];
    const after=activityAt('weave',period+1e-5,0,period)[key];
    assert.ok(Math.abs(before-after)<.001,`${key} jumps at the loop`);
  }
  assert.equal(activityAt('weave',period*.05,0,period).handX,0);
  assert.ok(activityAt('weave',period*.5,0,period).handX>2);
  for(const p of workers)assert.deepEqual(residentPose(p,9),residentPose(p,9));
});

test('hanging cloth lifts visibly and both workshop cycles return without a snap',()=>{
  for(const activity of ['hang-cloth','arrange-frame']){
    const period=8,first=activityAt(activity,.01,0,period),middle=activityAt(activity,period*.5,0,period);
    assert.ok(middle.handY<first.handY-.7);
    for(const key of ['handX','handY','lean','nod']){
      assert.ok(Math.abs(activityAt(activity,period-1e-5,0,period)[key]-activityAt(activity,period+1e-5,0,period)[key])<.001);
    }
    // Rear-view sprites have one sole close to the middle of the image.
    // Calibrate to the actual contacts, not a fixed left/right split.
    const f={w:209,h:372},h=64,w=h*f.w/f.h,contacts=[{x:99,y:369},{x:183,y:363}];
    const feet=contacts.map(c=>({x:(c.x/f.w-.5)*w,y:0,lift:0}));
    for(let t=0;t<period;t+=1/60)for(const c of contacts){
      const point=deform(c.x/f.w,c.y/f.h,{f,h,w,contacts,feet,pose:activityAt(activity,t,0,period),hand:[.1,.2],workshop:activity,continuous:true});
      assert.ok(Math.abs(point[1])<1e-8);
    }
  }
});

test('weaver mesh retains orientation and planted shoes for every frame of a cycle',()=>{
  const f={x:1340,y:597,w:158,h:352},h=63,w=h*f.w/f.h;
  const contacts=[{x:48,y:350},{x:129,y:347}];
  const feet=contacts.map(c=>({x:(c.x/f.w-.5)*w,y:0,lift:0}));
  const columns=[0,.2,.35,.5,.65,.8,1],rows=[0,.12,.24,.32,.40,.47,.54,.62,.72,.84,.94,1];
  const area=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  for(const p of workers)for(let frame=0;frame<360;frame++){
    const rig={w,h,f,contacts,feet,pose:residentPose(p,frame/60),hand:[87/158,156/352],working:true,workshop:p.workshop};
    for(const contact of contacts){
      const sole=deform(contact.x/f.w,contact.y/f.h,rig);
      assert.ok(Math.abs(sole[1])<1e-8,'shoe lifts from street');
      assert.ok(Math.abs(sole[0]-(contact.x/f.w-.5)*w)<1e-8,'shoe slides');
    }
    const points=rows.map(v=>columns.map(u=>deform(u,v,rig)));
    for(let r=0;r<rows.length-1;r++)for(let c=0;c<columns.length-1;c++){
      const a=points[r][c],b=points[r][c+1],d=points[r+1][c],e=points[r+1][c+1];
      assert.ok(area(a,b,d)>0&&area(b,e,d)>0,'robe folds inside out');
    }
  }
});
