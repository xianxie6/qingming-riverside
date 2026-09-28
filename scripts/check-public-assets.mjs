import {readdir,readFile} from 'node:fs/promises';
import {resolve,posix,relative} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

async function listFiles(directory,prefix=''){
  const result=[];
  for(const entry of await readdir(resolve(directory,prefix),{withFileTypes:true})){
    const name=posix.join(prefix,entry.name);
    if(entry.isDirectory())result.push(...await listFiles(directory,name));
    else result.push(name);
  }
  return result;
}
const external=/^(?:[a-z]+:|\/\/|#)/i;
const fileExtension=/\.(?:js|css|html|png|webp|svg|mp3|woff2|json)(?:[?#].*)?$/;
function references(source,file){
  const refs=[];
  if(file.startsWith('vendor/')){
    // Third-party documentation contains example filenames, not site requests.
    for(const match of source.matchAll(/(?:from|import)\s*["'](\.[^"']+)["']/g))refs.push(match[1]);
  }else if(file.endsWith('.html')){
    for(const match of source.matchAll(/(?:src|href|data-src)=["']([^"']+)["']/g))refs.push(match[1]);
  }else if(file.endsWith('.css')){
    for(const match of source.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g))refs.push(match[1]);
  }else if(file.endsWith('.js')){
    // Includes URL templates for dishes, guest sprites and side districts.
    for(const match of source.matchAll(/["'`]([^"'`\n]+)["'`]/g)){
      if(fileExtension.test(match[1])&&!/\s/.test(match[1]))refs.push(match[1]);
    }
  }
  return refs.filter(ref=>!external.test(ref));
}
function templatePattern(path){
  return new RegExp('^'+path.split(/\$\{[^}]+\}/).map(part=>part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('[^/]+')+'$');
}
export async function validatePublicDirectory(directory){
  const files=await listFiles(directory),available=new Set(files),errors=[];
  for(const file of files){
    if(/^(?:art-source|docs|tests|scripts|migrations|\.github)\//.test(file)||/\.test\.cjs$/.test(file)||/(?:^|\/)(?:\.env.*|\.dev.vars.*|worker\.js)$/.test(file))errors.push(`Private/build-only file in site: ${file}`);
    if(!/\.(?:html|css|js)$/.test(file))continue;
    const source=await readFile(resolve(directory,file),'utf8');
    for(const raw of references(source,file)){
      const clean=raw.split(/[?#]/)[0];
      // Images/fetch URLs in JS resolve from the HTML page; module imports
      // resolve from the JS file. CSS always resolves from the stylesheet.
      const base=file.endsWith('.css')||clean.startsWith('./')||clean.startsWith('../')?posix.dirname(file):
        file.startsWith('src/')&&/^[\w-]+\.js/.test(clean)?'src':posix.dirname(file.endsWith('.html')?file:'index.html');
      const target=posix.normalize(posix.join(base,clean));
      if(clean.startsWith('/')||target.startsWith('../')){errors.push(`${file}: non-portable URL ${raw}`);continue;}
      if(target.includes('${')){
        if(!files.some(candidate=>templatePattern(target).test(candidate)))errors.push(`${file}: unmatched URL template ${raw}`);
      }else if(!available.has(target))errors.push(`${file}: missing ${raw} (resolved to ${target})`);
    }
  }
  if(errors.length)throw new Error(errors.join('\n'));
  return files.length;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const directory=fileURLToPath(new URL('../dist/',import.meta.url));
  console.log(`Verified public paths across ${await validatePublicDirectory(directory)} files (${relative(process.cwd(),directory)})`);
}
