const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');

test('street scripts download together, execute in order, and share one startup',async()=>{
  const scripts=[],links=[],events=new Map();let ready=false;
  const window={addEventListener:(name,fn)=>events.set(name,fn)};
  const scope={window,navigator:{},document:{readyState:'loading',
    createElement:()=>({}),head:{append:node=>links.push(node)},
    body:{classList:{contains:()=>ready},append:node=>scripts.push(node)}},
    addEventListener:window.addEventListener,removeEventListener:name=>events.delete(name),setTimeout:()=>1,clearTimeout:()=>{}};
  vm.runInNewContext(fs.readFileSync(__dirname+'/../src/dynamic-loader.js','utf8'),scope);
  const pending=window.loadQingmingScene();
  assert.equal(window.loadQingmingScene(),pending);
  assert.equal(scripts.length,19,'all dependencies start without waiting for a round trip');
  assert.ok(scripts.every(s=>s.async===false),'classic scripts retain dependency order');
  assert.equal(links.filter(l=>l.as==='image').length,5,'shared images start alongside code; side districts wait for the selected view');
  assert.ok(links.some(l=>l.href==='vendor/three.core.js'));
  scripts.slice(0,18).forEach(s=>s.onload());await Promise.resolve();
  assert.equal(scripts.length,19,'scene cannot execute before all dependencies');
  scripts[18].onload();await Promise.resolve();await Promise.resolve();
  assert.equal(scripts.length,20);assert.equal(scripts[19].type,'module');
  scripts[19].onload();ready=true;events.get('atlas-ready')();await pending;
  await window.loadQingmingScene();assert.equal(scripts.length,20);
  assert.equal(events.has('atlas-error'),false,'ready removes the unused failure listener');
});

test('a failed scene module rejects promptly and cleans up its readiness timeout',async()=>{
  const scripts=[],events=new Map();let cleared=0;
  const window={addEventListener:(name,fn)=>events.set(name,fn)};
  const scope={window,navigator:{},document:{readyState:'loading',createElement:()=>({}),
    head:{append:()=>{}},body:{classList:{contains:()=>false},append:node=>scripts.push(node)}},
    addEventListener:window.addEventListener,removeEventListener:name=>events.delete(name),
    setTimeout:()=>1,clearTimeout:()=>cleared++};
  vm.runInNewContext(fs.readFileSync(__dirname+'/../src/dynamic-loader.js','utf8'),scope);
  const pending=window.loadQingmingScene();
  scripts.forEach(script=>script.onload());await Promise.resolve();await Promise.resolve();
  const rejected=assert.rejects(pending,/Failed to load scene/);
  scripts.at(-1).onerror();await rejected;
  assert.equal(cleared,1);assert.equal(events.has('atlas-ready'),false);assert.equal(events.has('atlas-error'),false);
  assert.equal(window.loadQingmingScene(),pending,'do not duplicate a module that cannot initialize twice');
  assert.equal(scripts.length,20);
});
