const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
test('water reuses the backdrop until the camera, size or wet ground changes',()=>{
  const scope={document:{createElement:()=>({getContext:()=>({drawImage(){}})})},THREE:{CanvasTexture:class{constructor(source){this.source=source;this.uploads=0;}dispose(){this.disposed=true;}set needsUpdate(value){if(value)this.uploads++;}},LinearFilter:1}};
  const source=fs.readFileSync(__dirname+'/../src/water-three.js','utf8').replace(/^import .*;\s*/,'').replace('export class ThreeWaterRenderer','globalThis.ThreeWaterRenderer=class ThreeWaterRenderer');
  vm.runInNewContext(source,scope);
  const renderer=Object.create(scope.ThreeWaterRenderer.prototype);
  Object.assign(renderer,{active:true,uniforms:{uBackdrop:{},uBackdropHeight:{},uTime:{},uPass:{},uView:{value:{set(){}}}},renderer:{render(){},setScissor(){},setScissorTest(){},domElement:{}}});
  const frame={time:0,camera:0,viewY:0,width:800,height:600,scale:1,source:{width:800,height:600},backdropKey:'initial'};
  renderer.render(frame);const texture=renderer.backdrop;
  for(let time=1;time<60;time++)renderer.render({...frame,time});
  assert.equal(texture.uploads,1);
  assert.equal(renderer.backdropSource.width,800,'keep original horizontal resolution');
  assert.equal(renderer.backdropSource.height,78,'upload only river pixels plus the displacement margin');
  assert.equal(renderer.uniforms.uBackdropHeight.value,78/600);
  for(const backdropKey of ['camera moved','resized','wet ground'])renderer.render({...frame,backdropKey});
  assert.equal(texture.uploads,4);
  renderer.render({...frame,source:undefined,pass:1});assert.equal(texture.uploads,4);
  renderer.render({...frame,backdropKey:undefined});assert.equal(texture.uploads,5);
  renderer.render({...frame,source:{width:390,height:844}});
  assert.equal(texture.disposed,true,'resized canvas needs a new GPU texture allocation');
  assert.notEqual(renderer.backdrop,texture);assert.equal(renderer.backdrop.uploads,1);
});

test('water clips its draw and composite to visible water, and skips offscreen uploads',()=>{
  const source=fs.readFileSync(__dirname+'/../src/water-three.js','utf8').replace(/^import .*;\s*/,'').replace('export class ThreeWaterRenderer','globalThis.ThreeWaterRenderer=class ThreeWaterRenderer');
  const scope={};vm.runInNewContext(source,scope);
  const water=Object.create(scope.ThreeWaterRenderer.prototype),scissors=[],draws=[];
  const layer={width:1080,height:810};let renders=0;
  Object.assign(water,{active:true,bankY:542,uniforms:{uTime:{},uPass:{},uView:{value:{set(){}}}},renderer:{setScissor(...args){scissors.push(args);},setScissorTest(){},render(){renders++;},domElement:layer}});
  const frame={time:1,camera:0,viewY:0,width:800,height:600,scale:1};
  water.composite({drawImage(...args){draws.push(args);}},water.render(frame));
  assert.deepEqual(scissors[0],[0,0,800,58]);
  assert.deepEqual(draws[0].slice(5),[0,542,800,58]);
  // The source is deliberately unusable: an invisible river must return
  // before attempting CanvasTexture allocation or upload.
  assert.equal(water.render({...frame,scale:2,source:{width:800,height:600}}),null);
  assert.equal(renders,1);
  water.render({...frame,camera:-1800,pass:1});
  assert.deepEqual(scissors.at(-1),[135,15,320,220]);
});
