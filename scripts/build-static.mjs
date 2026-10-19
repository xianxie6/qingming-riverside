import {cp,mkdir,readdir,readFile,rm,stat,writeFile} from 'node:fs/promises';
import {dirname,resolve,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {crossingFiles,crossingSource} from './crossing-release.mjs';
import {transform} from 'esbuild';

const projectRoot=fileURLToPath(new URL('../',import.meta.url));
export async function buildStatic(root=projectRoot,output=resolve(root,'dist'),{profile='all'}={}){
  if(!['all','crossing'].includes(profile))throw new Error(`Unknown release profile: ${profile}`);
  const manifest=JSON.parse(await readFile(resolve(root,'scripts/public-assets.json'),'utf8'));
  const files=profile==='crossing'?[...crossingFiles]:['index.html','sunyang.html','explore.html','.nojekyll'];
  for(const [directory,extension] of profile==='crossing'?[]:[['src','.js'],['styles','.css']]){
    for(const entry of await readdir(resolve(root,directory),{withFileTypes:true})){
      if(entry.isFile()&&entry.name.endsWith(extension))files.push(`${directory}/${entry.name}`);
    }
  }
  for(const file of manifest.files){
    if(!/^(assets|vendor)\//.test(file)||file.includes('\\')||file.split('/').includes('..'))throw new Error(`Invalid public asset: ${file}`);
    if(profile==='all')files.push(file);
  }
  if(profile==='crossing')for(const file of files.filter(file=>file.startsWith('assets/')||file.startsWith('vendor/'))){
    if(!manifest.files.includes(file))throw new Error(`Crossing asset is not in public manifest: ${file}`);
  }
  // Validate the complete input before replacing the previous build.
  for(const file of files){
    if(!(await stat(resolve(root,file))).isFile())throw new Error(`Not a file: ${file}`);
  }
  const transformed=new Map();
  // Three.js ships unminified (2.1 MB); identifiers and exports are kept, only whitespace and locals shrink.
  for(const file of files.filter(file=>/^vendor\/three\.(?:core|module)\.js$/.test(file))){
    const {code}=await transform(await readFile(resolve(root,file),'utf8'),{format:'esm',minify:true,legalComments:'inline',target:'es2020'});
    transformed.set(file,code);
  }
  if(profile==='crossing')for(const file of ['index.html','src/scene.js','src/sound.js','src/crossing.js']){
    transformed.set(file,crossingSource(file,await readFile(resolve(root,file),'utf8')));
  }
  const outputPath=resolve(output),inside=relative(root,outputPath);
  if(!inside||inside.startsWith(`..${sep}`)||inside==='..'||inside.includes(sep)||inside!=='dist')throw new Error('Build output must be the project dist directory');
  await rm(outputPath,{recursive:true,force:true});
  await mkdir(outputPath,{recursive:true});
  for(const file of files){
    const destination=resolve(outputPath,file);
    await mkdir(dirname(destination),{recursive:true});
    if(transformed.has(file))await writeFile(destination,transformed.get(file));
    else await cp(resolve(root,file),destination);
  }
  return files;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const profile=process.argv.includes('--all')?'all':'crossing';
  const files=await buildStatic(projectRoot,resolve(projectRoot,'dist'),{profile});
  console.log(`Prepared ${profile} release: ${files.length} public files in ${resolve(projectRoot,'dist')}`);
}
