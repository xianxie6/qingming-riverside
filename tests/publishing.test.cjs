const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const os=require('node:os');
const path=require('node:path');

async function fixture(t){
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'qingming-publish-'));
  t.after(()=>fs.rm(root,{recursive:true,force:true}));
  const write=async(name,content)=>{await fs.mkdir(path.dirname(path.join(root,name)),{recursive:true});await fs.writeFile(path.join(root,name),content);};
  await write('index.html','<link href="styles/site.css"><script src="src/main.js"></script>');
  await write('sunyang.html','<a href="index.html">返回</a>');
  await write('explore.html','<a href="index.html">返回</a>');
  await write('.nojekyll','');
  await write('src/main.js',"import './scene.js'; const image='assets/picture.webp';");
  await write('src/scene.js','');
  await write('styles/site.css',"body{background:url('../assets/picture.webp')}");
  await write('assets/picture.webp','fixture');
  await write('assets/private-draft.png','must not publish');
  await write('art-source/old.png','must not publish');
  await write('.env','DUMMY=must-not-publish');
  await write('worker.js','must not publish');
  await write('scripts/public-assets.json',JSON.stringify({files:['assets/picture.webp']}));
  return {root,write};
}
test('publication contains only selected assets and portable page/module/style URLs',async t=>{
  const {root}=await fixture(t);
  const {buildStatic}=await import('../scripts/build-static.mjs');
  const {validatePublicDirectory}=await import('../scripts/check-public-assets.mjs');
  const files=await buildStatic(root);
  assert.equal(await validatePublicDirectory(path.join(root,'dist')),files.length);
  for(const name of ['assets/private-draft.png','art-source/old.png','.env','worker.js']){
    await assert.rejects(fs.access(path.join(root,'dist',name)),{code:'ENOENT'});
  }
  await fs.unlink(path.join(root,'dist/assets/picture.webp'));
  await assert.rejects(validatePublicDirectory(path.join(root,'dist')),/missing assets\/picture.webp/);
});
test('invalid or missing manifest entries fail before replacing the previous build',async t=>{
  const {root,write}=await fixture(t);
  const {buildStatic}=await import('../scripts/build-static.mjs');
  await write('dist/previous.html','previous build');
  await write('scripts/public-assets.json',JSON.stringify({files:['assets/../../outside.png']}));
  await assert.rejects(buildStatic(root),/Invalid public asset/);
  await write('scripts/public-assets.json',JSON.stringify({files:['assets/missing.png']}));
  await assert.rejects(buildStatic(root),{code:'ENOENT'});
  assert.equal(await fs.readFile(path.join(root,'dist/previous.html'),'utf8'),'previous build');
});
