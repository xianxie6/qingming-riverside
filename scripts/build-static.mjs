import {cp,mkdir,readdir,readFile,rm,stat} from 'node:fs/promises';
import {dirname,resolve,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const projectRoot=fileURLToPath(new URL('../',import.meta.url));
export async function buildStatic(root=projectRoot,output=resolve(root,'dist')){
  const manifest=JSON.parse(await readFile(resolve(root,'scripts/public-assets.json'),'utf8'));
  const files=['index.html','sunyang.html','.nojekyll'];
  for(const [directory,extension] of [['src','.js'],['styles','.css']]){
    for(const entry of await readdir(resolve(root,directory),{withFileTypes:true})){
      if(entry.isFile()&&entry.name.endsWith(extension))files.push(`${directory}/${entry.name}`);
    }
  }
  for(const file of manifest.files){
    if(!/^(assets|vendor)\//.test(file)||file.includes('\\')||file.split('/').includes('..'))throw new Error(`Invalid public asset: ${file}`);
    files.push(file);
  }
  // Validate the complete input before replacing the previous build.
  for(const file of files){
    if(!(await stat(resolve(root,file))).isFile())throw new Error(`Not a file: ${file}`);
  }
  const outputPath=resolve(output),inside=relative(root,outputPath);
  if(!inside||inside.startsWith(`..${sep}`)||inside==='..'||inside.includes(sep)||inside!=='dist')throw new Error('Build output must be the project dist directory');
  await rm(outputPath,{recursive:true,force:true});
  await mkdir(outputPath,{recursive:true});
  for(const file of files){
    const destination=resolve(outputPath,file);
    await mkdir(dirname(destination),{recursive:true});
    await cp(resolve(root,file),destination);
  }
  return files;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const files=await buildStatic();
  console.log(`Prepared ${files.length} public files in ${resolve(projectRoot,'dist')}`);
}
