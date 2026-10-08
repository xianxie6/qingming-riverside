const test=require('node:test');
const assert=require('node:assert/strict');
const G=require('../src/time-lens-geometry.js');

test('divider switches between horizontal, vertical and reversed comparison',()=>{
  for(const [angle,x,y,length] of [[0,100,150,300],[90,200,75,400],[180,300,150,300]]){
    const d=G.divider(400,300,.25,angle);
    assert.ok(Math.abs(d.x-x)<1e-8);assert.ok(Math.abs(d.y-y)<1e-8);
    assert.ok(Math.abs(d.length-length)<1e-8);assert.ok(Math.abs(d.song-.25)<1e-8);
  }
});
test('rotated divider and clip stay aligned across angles, endpoints and resized viewports',()=>{
  for(const [w,h] of [[1440,560],[390,490],[320,220]])for(let angle=0;angle<=180;angle++){
    for(const position of [0,.01,.25,.5,.99,1]){
      const d=G.divider(w,h,position,angle),offset=d.min+position*d.span;
      assert.ok(Number.isFinite(d.length)&&d.length>=0);
      assert.ok(d.x>=-1e-8&&d.x<=w+1e-8&&d.y>=-1e-8&&d.y<=h+1e-8);
      assert.ok(Math.abs(d.x*d.nx+d.y*d.ny-offset)<1e-7);
      for(const p of d.polygon){
        assert.ok(p.x>=-1e-8&&p.x<=w+1e-8&&p.y>=-1e-8&&p.y<=h+1e-8);
        assert.ok(p.x*d.nx+p.y*d.ny>=offset-1e-7);
      }
      if([0,.5,1].includes(position))assert.ok(Math.abs(d.song-position)<1e-8);
      assert.ok(Math.abs(G.dividerPosition(w,h,d.x,d.y,angle)-position)<1e-8);
      // Moving along the divider must not change the selected split.
      assert.ok(Math.abs(G.dividerPosition(w,h,d.x-d.ny*20,d.y+d.nx*20,angle)-position)<1e-8);
    }
  }
});

test('one registered camera fills desktop and mobile viewports without exposing blank edges',()=>{
  for(const [w,h] of [[1440,560],[390,490],[320,220],[1920,300]])for(const zoom of [1,1.65])for(const center of [0,.32,1]){
    const view=G.camera(w,h,zoom,center);
    assert.ok(view.left>=0);assert.ok(view.left+view.span<=2172+1e-8);
    assert.ok(view.top>=-1e-8);assert.ok(view.top+h/view.scale<=724+1e-8);
    // Pixel-to-image conversion must agree for both image layers at all positions.
    const point=G.worldAt(view,w*.43,h*.51);
    assert.ok(Math.abs((point.x-view.left)*view.scale-w*.43)<1e-8);
    assert.ok(Math.abs((point.y-view.top)*view.scale-h*.51)<1e-8);
  }
});
test('lens stays inside the screen after drag beyond edges and viewport resizing',()=>{
  for(const [w,h] of [[320,220],[390,460],[1440,600]])for(const x of [-4,.5,3])for(const y of [-4,.5,3]){
    const lens=G.lens(w,h,x,y,175);
    assert.ok(lens.x-lens.radius>=7.99);assert.ok(lens.y-lens.radius>=7.99);
    assert.ok(lens.x+lens.radius<=w-7.99);assert.ok(lens.y+lens.radius<=h-7.99);
  }
});
test('panning clamps at both riverbank edges and is independent of the lens position',()=>{
  const view=G.camera(390,450,1,.4),before={...view};
  const right=G.camera(390,450,1,G.pan(view,-100000));
  const left=G.camera(390,450,1,G.pan(view,100000));
  assert.equal(left.left,0);assert.ok(Math.abs(right.left-right.max)<1e-8);
  G.lens(390,450,.1,.8,112);assert.deepEqual(view,before);
  const shifted=G.camera(390,450,1,G.pan(view,30));
  assert.ok(Math.abs(shifted.left-(view.left-30/view.scale))<1e-8);
});
test('story selection follows image coordinates after camera movement',()=>{
  const stops=[{id:'tea',x:675},{id:'cloth',x:985},{id:'bridge',x:1490}];
  for(const stop of stops){
    const view=G.camera(390,450,1,stop.x/2172);
    assert.equal(G.nearest(G.worldAt(view,195,220),stops).id,stop.id);
  }
});

 test('full street reaches both districts and keeps gate and watermill registered',()=>{
   const bounds={min:-2172,max:4344};
   for(const [w,h] of [[1440,600],[390,490]])for(const zoom of [1,1.65]){
     const first=G.camera(w,h,zoom,0,bounds),last=G.camera(w,h,zoom,1,bounds);
     assert.equal(first.left,bounds.min);
     assert.ok(Math.abs(last.left+last.span-bounds.max)<1e-8);
     for(const x of [-1577,675,1490,3360,4020]){
       const v=G.camera(w,h,zoom,(x-bounds.min)/6516,bounds);
       assert.ok(v.left<=x&&v.left+v.span>=x);
       const next=G.camera(w,h,zoom,G.pan(v,-50),bounds);
       assert.ok(next.left>=v.left-1e-8);
       assert.ok(next.left+next.span<=bounds.max+1e-8);
     }
   }
 });
