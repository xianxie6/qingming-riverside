import {cp,mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {population} from '../src/extension-people-data.js';
import {createDisplayPopulation} from '../src/extension-people-layout.js';
import {LIMITED_DIR} from '../src/extension-limited-animation.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'output/street-extension-preview');
const files=['extension-preview.html','styles/extension-preview.css','src/extension-preview.js','assets/fonts/sunyang-brush.woff2','assets/district-west-fast.webp','assets/street-empty-fast.webp','assets/district-east-fast.webp',...['west-far','west-near','east-near','east-far','center-east-seam-repaired-v1'].map(id=>`assets/extension-preview/${id}.webp`)];
// Key-pose sheets are copied only once installed and listed in the manifest.
const limited=JSON.parse(await readFile(new URL(`../${LIMITED_DIR}/manifest.json`,import.meta.url),'utf8')).installed.map(file=>`${LIMITED_DIR}/${file}.webp`);
files.push('src/extension-limited-animation.js',`${LIMITED_DIR}/manifest.json`,...limited);
files.push('src/extension-people.js','src/extension-motion.js','src/extension-walkers.js','src/extension-puppet.js','src/extension-people-data.js','src/bridge-railing.js',...population.assets);
files.push('src/extension-workshop.js','src/extension-workshop-state.js',...['warehouse-clean','inn-open','curtain','cargo'].map(id=>`assets/extension-preview/workshop/${id}.webp`));
files.push('src/extension-flower-state.js','src/extension-flower-shop.js','styles/extension-flower-shop.css',...['flower-shop','florist','florist-wave','peony','plum','orchid','flower-home'].map(id=>`assets/extension-preview/workshop/${id}.webp`));
files.push('src/extension-people-layout.js','src/extension-flower-customers.js','assets/extension-preview/workshop/flower-customers-v2.webp');
files.push('src/extension-flower-street.js',...['street-men-v1','street-women-v1','street-conversation-v1','wall-roses-v2'].map(id=>`assets/extension-preview/workshop/${id}.webp`));
let bytes=0;
for(const file of files){const src=path.join(root,file);bytes+=(await stat(src)).size;const dest=path.join(output,file);await mkdir(path.dirname(dest),{recursive:true});await cp(src,dest);}
await writeFile(path.join(output,'index.html'),await readFile(path.join(root,'extension-preview.html')));
console.log(JSON.stringify({output,files:files.length+1,bytes,world:{min:-5430,max:7602,width:13032,height:724},people:population.count,scenes:createDisplayPopulation(population).people.length,preview:'Spring street with larger residents, two purple and pink flower customers visiting together, porter who shoulders each hoisted sack and stacks it, travellers walking the street with planted steps, and a flower shop with local vase arrangements.'},null,2));
