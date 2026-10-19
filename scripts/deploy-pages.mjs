import {execFile as execFileCallback} from 'node:child_process';
import {promisify} from 'node:util';
import {cp,mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validatePublicDirectory} from './check-public-assets.mjs';

const execFile=promisify(execFileCallback);
const root=fileURLToPath(new URL('../',import.meta.url));
const run=async(command,args,cwd=root)=>(await execFile(command,args,{cwd,maxBuffer:4*1024*1024})).stdout.trim();
const dist=resolve(root,'dist');
await validatePublicDirectory(dist);
if(!(await readFile(resolve(dist,'index.html'),'utf8')).includes('data-release="crossing"'))throw new Error('Pages deployment requires a crossing release');
const remote=await run('git',['remote','get-url','origin']);
if(remote!=='https://github.com/xianxie6/qingming-riverside.git')throw new Error('Unexpected Pages repository');
// Use the gh-pages publishing branch already allowed by the environment.
const repo='xianxie6/qingming-riverside',branch='gh-pages';
const checkout=await mkdtemp(resolve(tmpdir(),'qingming-pages-'));
try{
  const existing=await run('git',['ls-remote','--heads',remote,`refs/heads/${branch}`]);
  if(existing){
    // Only the parent tree is needed; dist supplies the complete new files.
    await run('git',['clone','--filter=blob:none','--no-checkout','--single-branch','--depth','1','--branch',branch,remote,checkout]);
    await run('git',['read-tree','HEAD'],checkout);
  }
  else{
    await run('git',['init','--initial-branch',branch],checkout);
    await run('git',['remote','add','origin',remote],checkout);
  }
  const name=await run('git',['config','user.name']),email=await run('git',['config','user.email']);
  await run('git',['config','user.name',name],checkout);
  await run('git',['config','user.email',email],checkout);
  await rm(resolve(checkout,'dist'),{recursive:true,force:true});
  await cp(dist,resolve(checkout,'dist'),{recursive:true});
  await mkdir(resolve(checkout,'.github/workflows'),{recursive:true});
  // Dispatch the existing workflow's path using this branch's artifact-only job.
  // The master branch and its source history are never replaced.
  await writeFile(resolve(checkout,'.github/workflows/verify-and-deploy.yml'),`name: Deploy crossing release
on:
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - name: Deploy crossing release
        id: deployment
        uses: actions/deploy-pages@v4
`);
  await run('git',['add','dist','.github/workflows/verify-and-deploy.yml'],checkout);
  if(await run('git',['status','--porcelain'],checkout))await run('git',['commit','-m','Publish crossing journey and seasonal street only'],checkout);
  const commit=await run('git',['rev-parse','HEAD'],checkout);
  await run('git',['push','origin',`HEAD:refs/heads/${branch}`],checkout);
  await run('gh',['workflow','run','verify-and-deploy.yml','--repo',repo,'--ref',branch]);
  console.log(JSON.stringify({repository:repo,branch,commit,workflow:'verify-and-deploy.yml',status:'dispatched'}));
}finally{
  await rm(checkout,{recursive:true,force:true});
}
