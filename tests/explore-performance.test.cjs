const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

test('panning keeps layout scale and zoom label untouched while preserving screen coordinates',()=>{
  const code=fs.readFileSync(__dirname+'/../src/explore-people.js','utf8');
  const source=code.slice(code.indexOf('function paint(){'),code.indexOf('function move('));
  let zoomWrites=0,labelWrites=0,label='';
  const style={set zoom(value){zoomWrites++;this.scale=value;}};
  const zoom={get textContent(){return label;},set textContent(value){label=value;labelWrites++;}};
  const scope={clamp:()=>{},districtOutline:null,paintedScale:undefined,paintedOutline:undefined,
    world:{style},s:1.25,min:.5,x:50,y:25,$:()=>zoom,lodTimer:0,setTimeout:()=>1,clearTimeout:()=>{},updateLOD:()=>{}};
  vm.createContext(scope);vm.runInContext(source+';paint();',scope);
  for(let i=0;i<60;i++){scope.x-=2;scope.y+=1;vm.runInContext('paint()',scope);}
  assert.equal(zoomWrites,1,'dragging does not rewrite CSS zoom and invalidate layout');
  assert.equal(labelWrites,1,'dragging does not replace the text node every frame');
  const [x,y]=style.transform.match(/-?\d+(?:\.\d+)?/g).map(Number);
  assert.equal(x*scope.s,scope.x);assert.equal(y*scope.s,scope.y);
  scope.s=2;vm.runInContext('paint()',scope);
  assert.equal(zoomWrites,2);assert.equal(label,'4.0×','actual zoom still updates the native raster scale');
});
