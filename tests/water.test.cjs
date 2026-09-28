const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {surfaceLines,strokeEffect,waterfallStrands,wakeStrength}=require('../src/water.js');

test('river currents remain varied and inside the painted water band',()=>{
  const a=surfaceLines(2,300,900),b=surfaceLines(3,300,900);
  assert.equal(a.length,118);assert.equal(b.length,118);
  assert.ok(a.every(line=>line.y>=548&&line.y<=716));
  assert.ok(a.every(line=>line.alpha>0&&line.alpha<.11));
  assert.ok(new Set(a.map(line=>Math.round(line.length))).size>20);
  assert.notDeepEqual(a,b,'current markings drift with simulation time');
});

test('each oar stroke catches, splashes and fades before the next stroke',()=>{
  const dry=strokeEffect(0),catching=strokeEffect(3.6*.3),released=strokeEffect(3.6*.75),next=strokeEffect(3.6);
  assert.equal(dry.power,0);assert.ok(catching.power>.8);
  assert.equal(released.power,0);assert.ok(released.release>0);
  assert.ok(released.ring>catching.ring);assert.ok(released.opacity<catching.opacity);
  assert.deepEqual(next,dry);
});

test('falling water uses staggered strands and a moving boat makes the stronger wake',()=>{
  const a=waterfallStrands(1),b=waterfallStrands(1.5);
  assert.equal(a.length,16);assert.ok(a.every(s=>s.x>-23&&s.x<23));
  assert.ok(new Set(a.map(s=>s.phase.toFixed(2))).size>10);
  assert.notDeepEqual(a,b);
  assert.ok(wakeStrength(true).dark>wakeStrength(false).dark);
  assert.ok(wakeStrength(true).length>wakeStrength(false).length);
});

test('Three.js water is vendored locally and the scene enters through an ES module',()=>{
  assert.ok(fs.statSync(`${__dirname}/../vendor/three.module.js`).size>600000);
  assert.ok(fs.statSync(`${__dirname}/../vendor/three.core.js`).size>1400000);
  const loader=fs.readFileSync(`${__dirname}/../src/dynamic-loader.js`,'utf8');
  assert.match(loader,/add\('scene\.js\?v=[\w.-]+',true\)/);
  assert.match(fs.readFileSync(`${__dirname}/../src/scene.js`,'utf8'),/new ThreeWaterRenderer\(\)/);
});

test('boat impulses stay in world space, freeze on pause, and do not emit teleport wakes',()=>{
  const vm=require('node:vm');
  const scene=fs.readFileSync(__dirname+'/../src/scene.js','utf8');
  const code=scene.slice(scene.indexOf('  const waterEvents='),scene.indexOf('  function drawBoatDisturbances'));
  const scope={state:{time:0}};
  vm.createContext(scope);
  vm.runInContext(code+';this.events=waterEvents;this.emit=disturbBoat;',scope);
  const emit=(time,x)=>{scope.state.time=time;scope.emit('boat',x,600,1,time,1,true,{x:-70,y:25});};
  emit(.6,100);emit(.7,101);
  assert.equal(scope.events.length,1);
  assert.equal(scope.events[0].x,31);
  assert.equal(scope.events[0].y,625);
  emit(.7,101);assert.equal(scope.events.length,1,'paused frame cannot emit twice');
  emit(.8,102);assert.equal(scope.events[0].x,31,'impulse does not follow boat');
  emit(.9,900);assert.equal(scope.events.length,1,'teleports create no wake');
  emit(1.1,901);assert.equal(scope.events.length,2,'moving hull leaves a wake');
});

test('waterfall composites after the mill foreground and water time never resets on pause',()=>{
  const scene=fs.readFileSync(__dirname+'/../src/scene.js','utf8');
  const renderer=fs.readFileSync(__dirname+'/../src/water-three.js','utf8');
  assert.ok(scene.indexOf('pass:1')>scene.indexOf('districts.animate(ctx'));
  assert.match(renderer,/uTime.value=time/);
  assert.doesNotMatch(renderer,/uTime\s*\*\s*uMotion/);
  assert.match(renderer,/CanvasTexture\(this\.backdropSource\)/);
});
