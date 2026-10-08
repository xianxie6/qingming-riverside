const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const movement=require('../src/movement.js');

function context(){return new Proxy({draws:[],drawImage(...args){this.draws.push(args);}},{get(target,key){return target[key]??(()=>{});}});}
function load(extras={}){
  const scope={window:{ScrollMovement:movement},Image:class{},document:{createElement(){return {width:0,height:0,getContext:()=>context()};}},...extras};
  vm.runInNewContext(fs.readFileSync(`${__dirname}/../src/inhabitants.js`,'utf8'),scope);
  return new scope.window.Inhabitants();
}

test('stationary gestures reuse a bounded bitmap while walking feet rebuild every frame',()=>{
  const crowd=load(),ctx=context();let triangles=0;
  crowd.triangle=()=>triangles++;crowd.quad=()=>triangles+=2;crowd.motionContext=context();crowd.motionSurface={};
  const art={frame:{w:200,h:400},texture:{width:200,height:400},direction:1,
    contacts:[{x:40,y:395},{x:160,y:400}],grips:[[.7,.4]]};
  const p={id:'resident-1',art,h:66,phase:0};
  const item={p,x:10,y:477,direction:1,walking:false,pose:movement.activityAt('drink',1)};
  crowd.sprite(ctx,item,1);assert.equal(triangles,72);
  const firstImage=ctx.draws.at(-1)[0];
  crowd.sprite(ctx,item,1.01);assert.equal(triangles,72);assert.equal(ctx.draws.at(-1)[0],firstImage);
  crowd.sprite(ctx,item,1.1);assert.equal(triangles,144);
  for(let t=2;t<10;t+=.1)crowd.sprite(ctx,item,t);
  assert.equal(crowd.residentFrames.size,1);assert.equal(ctx.draws.at(-1)[0],firstImage);
  const before=triangles;item.p={...p,id:'walker-1'};item.walking=true;
  crowd.sprite(ctx,item,10);const firstWalk=triangles-before;
  crowd.sprite(ctx,item,10.001);
  assert.ok(firstWalk>0);
  assert.equal(triangles-before,firstWalk*2,'walking feet are never cached between frames');
});

test('walking leg meshes never turn inside out when the feet pass each other',()=>{
  const crowd=load(),ctx=context();
  crowd.motionContext=context();crowd.motionSurface={};
  let checked=0;
  const verify=(_ctx,_texture,vertices)=>{
    const [a,b,c]=vertices.map(v=>v.target);
    const area=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
    assert.ok(area>0,'a leg must retain its orientation throughout the stride');checked++;
  };
  crowd.triangle=verify;crowd.quad=(ctx,texture,p,q,r)=>verify(ctx,texture,[p,q,r]);
  for(const natural of [-1,1])for(const direction of [-1,1])for(let step=0;step<64;step++){
    const art={frame:{w:200,h:400},texture:{width:200,height:400},direction:natural,
      contacts:[{x:40,y:395},{x:160,y:400}],grips:[[.7,.4]]};
    crowd.sprite(ctx,{p:{art,h:63},x:0,y:0,direction,walking:true,
      pose:{phase:step/64*63*.64*.15}},0);
  }
  assert.ok(checked>1000);
});

test('mesh cells sample only their local source rectangle, with all three vertices inside it',()=>{
  const crowd=load(),ctx=context(),texture={width:400,height:800};
  const vertices=[{source:[100,200],target:[0,0]},{source:[200,200],target:[30,0]},
    {source:[100,300],target:[2,25]}];
  crowd.triangle(ctx,texture,vertices);
  const [image,x,y,w,h,dx,dy,dw,dh]=ctx.draws[0];
  assert.equal(image,texture);assert.ok(w*h<texture.width*texture.height*.04);
  for(const {source:[u,v]} of vertices)assert.ok(u>=x&&u<=x+w&&v>=y&&v<=y+h);
  assert.deepEqual([dx,dy,dw,dh],[x,y,w,h],'cropping preserves source coordinates for the affine transform');
});


test('paper extraction removes exterior white but preserves enclosed ivory and dark hair',()=>{
  const crowd=load(),width=7,height=7,data=new Uint8ClampedArray(width*height*4).fill(255);
  const pixel=(x,y,color)=>data.set([...color,255],(y*width+x)*4);
  for(let y=1;y<=5;y++)for(let x=1;x<=5;x++)pixel(x,y,[50,45,35]);
  pixel(3,3,[248,247,244]); // ivory enclosed by the ink contour
  pixel(1,3,[210,208,205]); // exterior antialiased fringe
  crowd.removePaper({data,width,height});
  assert.equal(data[3],0);
  assert.equal(data[(3*width+3)*4+3],255);
  assert.equal(data[(2*width+2)*4+3],255);
  assert.ok(data[(3*width+1)*4+3]>0&&data[(3*width+1)*4+3]<255);
  assert.ok(data[(3*width+1)*4]<210,'white contamination is removed from the soft edge');
});


test('each ankle and shoe stay rigidly attached through passing poses and slopes',()=>{
  const contacts=[{x:40,y:395},{x:160,y:400}],h=63,f={w:200,h:400};
  for(const slope of [-.45,0,.45])for(const natural of [-1,1])for(let step=0;step<128;step++){
    const phase=step/128*h*.64*.15;
    const feet=movement.gaitAt(phase/.15,h).map(foot=>({...foot,x:foot.x*natural,
      y:foot.x*natural*slope-foot.lift}));
    for(let leg=0;leg<2;leg++){
      const rig={w:h*.5,h,f,contacts,feet,pose:{phase},hand:[.7,.4],skeletal:true,leg,natural};
      const u=contacts[leg].x/f.w,v=contacts[leg].y/f.h;
      const sole=movement.deform(u,v,rig),edge=movement.deform(u+.05,v,rig);
      assert.ok(Math.abs(sole[0]-feet[leg].x)<1e-8,'sole follows its own ankle horizontally');
      assert.ok(Math.abs(sole[1]-feet[leg].y)<1e-8,'sole meets the ground or swings with its own leg');
      assert.ok(Math.abs(edge[0]-sole[0]-.05*rig.w)<1e-8,'shoe width stays constant');
      assert.ok(Math.abs(edge[1]-sole[1])<1e-8,'shoe is not sheared away from the ankle');
      for(const joint of [.60,(.60+v-.035)/2,v-.035]){
        const a=movement.deform(u,joint-1e-7,rig),b=movement.deform(u,joint+1e-7,rig);
        assert.ok(Math.hypot(a[0]-b[0],a[1]-b[1])<.0001,'continuous hip, knee and ankle joins');
      }
    }
  }
});

test('resident bitmaps rebuild at the correct size when pixel density changes between scenes',()=>{
  const crowd=load(),ctx=context();let rebuilds=0;
  crowd.triangle=()=>rebuilds++;crowd.quad=()=>rebuilds++;
  crowd.motionSurface={width:512,height:384};crowd.motionContext=context();
  const art={frame:{w:200,h:400},texture:{width:200,height:400},direction:1,
    contacts:[{x:40,y:395},{x:160,y:400}],grips:[[.7,.4]]};
  const item={p:{id:'resident-density',art,h:66},x:0,y:0,direction:1,walking:false,pose:movement.activityAt('drink',1)};
  crowd.motionDensity=1.25;crowd.sprite(ctx,item,1);
  const first=crowd.residentFrames.get(item.p.id),before=rebuilds;
  crowd.motionDensity=3;crowd.sprite(ctx,item,1);
  assert.ok(rebuilds>before,'same animation tick still rebuilds at a new density');
  assert.equal(first.image.width,Math.ceil((33+24)*3));
  assert.equal(first.image.height,Math.ceil((66+16)*3));
  const after=rebuilds;crowd.sprite(ctx,item,1);assert.equal(rebuilds,after);
});

test('affine mesh cells skip clips while a deformed fourth corner retains both triangles',()=>{
  const crowd=load(),calls=[];
  crowd.quad=(...args)=>calls.push(['quad',args]);crowd.triangle=(...args)=>calls.push(['triangle',args]);
  const vertices=[[0,0],[1,0],[0,1],[1,1]].map(([x,y])=>({source:[x*100,y*100],target:[x*20+y*2,y*30]}));
  crowd.cell({}, {}, ...vertices);assert.deepEqual(calls.map(c=>c[0]),['quad']);
  vertices[3].target[0]+=.01;calls.length=0;
  crowd.cell({}, {}, ...vertices);assert.deepEqual(calls.map(c=>c[0]),['triangle','triangle']);
});

test('rigid walking cells use the affine path without changing the animated mesh',()=>{
  const crowd=load(),ctx=context();crowd.motionContext=context();crowd.motionSurface={width:512,height:384};
  const art={frame:{w:200,h:400},texture:{width:200,height:400},direction:1,
    contacts:[{x:40,y:395},{x:160,y:400}],grips:[[.7,.4]]};
  let quads=0,triangles=0;
  crowd.quad=(_ctx,_texture,p,q,r)=>{
    assert.ok([p,q,r].every(v=>v.target.every(Number.isFinite)));quads++;
  };
  crowd.triangle=()=>triangles++;
  for(let step=0;step<32;step++){
    crowd.sprite(ctx,{p:{art,h:63},x:0,y:0,direction:1,walking:true,
      pose:{phase:step/32*63*.64*.15,lean:.02,nod:.03,handX:1,handY:.5}},step/60);
  }
  assert.ok(quads>0,'affine walking cells no longer pay for two clipped draws');
  assert.ok(triangles>0,'bent joints and cloth still use their original triangles');
  // Walking panels contain 48 cells per frame: 24 leg and 24 torso cells.
  assert.equal(quads*2+triangles,32*48*2,'every original mesh cell is retained');
});


test('GPU walking atlas keeps separate tiles, full-density vertices and uploads static ink once',()=>{
  const calls=[],events={};let target;
  const gl=new Proxy({}, {get:(_,key)=>{
    if(key==='getShaderParameter'||key==='getProgramParameter')return ()=>true;
    if(key==='getParameter')return ()=>4096;
    if(key.startsWith('create'))return ()=>({});
    if(key==='getAttribLocation')return (_p,name)=>name==='position'?0:1;
    if(key.toUpperCase()===key)return key;
    return (...args)=>calls.push([key,...args.map(x=>ArrayBuffer.isView(x)?Array.from(x):x)]);
  }});
  const crowd=load({document:{createElement:()=>target={width:0,height:0,getContext:()=>gl,addEventListener:(name,fn)=>events[name]=fn}}});
  const mesh=new crowd.constructor.MeshRenderer();assert.equal(mesh.active,true);
  const texture={width:20,height:40},p={h:40,art:{frame:{w:20,h:40}}};
  mesh.beginBatch([{p},{p}],2);
  const points=[[{source:[0,0],target:[-10,-40]},{source:[20,0],target:[10,-40]}],
    [{source:[0,40],target:[-10,0]},{source:[20,40],target:[10,0]}]];
  const regions=[];
  for(let i=0;i<2;i++){mesh.begin(88,112,2,20,40);regions.push({...mesh.region});mesh.draw(texture,points);}
  assert.ok(regions[1].x>=regions[0].x+88,'adjacent figures cannot overwrite each other');
  assert.equal(calls.filter(c=>c[0]==='clear').length,1,'the atlas is cleared once for the whole crowd');
  assert.equal(calls.filter(c=>c[0]==='texImage2D').length,1,'unchanged painting is uploaded once');
  assert.deepEqual(calls.filter(c=>c[0]==='drawArrays').map(c=>c[3]),[6,6]);
  const buffers=calls.filter(c=>c[0]==='bufferData');
  for(let i=0;i<2;i++){
    const vertices=buffers[i][2];assert.equal(vertices.length,24);
    assert.ok(Math.abs((vertices[0]+1)*target.width/2-(regions[i].x+24))<.0001);
    assert.ok(Math.abs((1-vertices[1])*target.height/2-(regions[i].y+16))<.0001);
    assert.deepEqual(vertices.slice(2,4),[0,0]);
  }
  let prevented=false;events.webglcontextlost({preventDefault:()=>prevented=true});
  assert.equal(prevented,true);assert.equal(mesh.active,false,'context loss selects the existing Canvas renderer');
});

test('GPU drawing gracefully falls back when WebGL is unavailable',()=>{
  const crowd=load({document:{createElement:()=>({width:0,height:0,getContext:()=>null})}});
  const mesh=new crowd.constructor.MeshRenderer();assert.equal(mesh.active,false);
  mesh.beginBatch([],2);assert.equal(mesh.batching,undefined);
});
