// Check a generated key-pose sheet, convert it to WebP and register it.
// Usage: node scripts/install-limited-animation.mjs art-source/street-extension/limited-animation/fields-02-weed-v1.png [--out <folder>]
import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {LIMITED,LIMITED_DIR,LIMITED_SCALE,measureSheet,alignCells} from '../src/extension-limited-animation.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const args=process.argv.slice(2),outAt=args.indexOf('--out');
const outDir=outAt>=0?args.splice(outAt,2)[1]:LIMITED_DIR;
const [source]=args;
if(!source){console.error('Usage: node scripts/install-limited-animation.mjs <sheet.png> [--out <folder>]');process.exit(2);}
const file=path.basename(source).replace(/-v\d+\.png$/i,'').replace(/\.png$/i,'');
// Figures not yet registered fall back to the `limited` block of the prompt JSON
// saved beside the sheet (written by prepare-limited-animation-batch.mjs).
const pending=await readFile(path.resolve(root,source.replace(/\.png$/i,'.json')),'utf8').then(JSON.parse).catch(()=>null);
const id=Object.keys(LIMITED).find(k=>LIMITED[k].file===file)||(pending?.limited?.file===file?pending.id:null);
if(!id){console.error(`No figure is configured for ${file}. Known: ${Object.values(LIMITED).map(s=>s.file).join(', ')}`);process.exit(2);}
const spec=LIMITED[id]||pending.limited;
if(!LIMITED[id])console.warn(`NOTE: ${id} is not registered yet. Add to LIMITED in src/extension-limited-animation.js: '${id}':${JSON.stringify(spec)}`);

const {data,info}=await sharp(path.resolve(root,source)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const alpha=(x,y)=>data[(y*info.width+x)*4+3];
const problems=[];
let transparent=0;for(let i=3;i<data.length;i+=4)if(data[i]<8)transparent++;
if(transparent/(info.width*info.height)<.3)problems.push('background is not transparent');
const cellWidth=Math.floor(info.width/spec.cols);
const cells=measureSheet(alpha,info.width,info.height,spec);
cells.forEach((c,i)=>{
 if(!c){problems.push(`cell ${i+1} is empty`);return;}
 // A figure touching its cell edge was usually cut off, or the grid is wrong.
 if(c.left<=1||c.right>=cellWidth-2)problems.push(`cell ${i+1} touches the cell edge (wrong cell count or cropped figure)`);
});
if(!problems.length){
 const heights=cells.map(c=>c.bottom-c.top+1),rest=heights[0];
 // Work poses may crouch or raise a tool; a walk keeps nearly the same height.
 const limit=spec.walk?.12:.35;
 heights.forEach((h,i)=>{if(Math.abs(h-rest)/rest>limit)problems.push(`cell ${i+1} figure height ${h}px differs from rest pose ${rest}px`);});
 const widths=cells.map(c=>c.right-c.left+1);
 if(Math.max(...widths)>cellWidth*.98)problems.push('a figure fills its whole cell');
}
const report={id,file,size:`${info.width}x${info.height}`,cells:spec.cols,cellWidth,anchor:spec.anchor,
 figures:cells.map(c=>c&&{height:c.bottom-c.top+1,width:c.right-c.left+1,feet:Math.round(c.feet),sole:c.sole,head:Math.round(c.head)}),
 soles:spec.soles?'marked':'automatic'};
if(problems.length){console.error(JSON.stringify({...report,problems},null,1));process.exit(1);}

// Contact preview: every cell aligned on its anchor and sole line, over paper.
const shifts=alignCells(cells,spec.anchor),preview=path.join(root,'output/limited-animation',`${file}-aligned.png`);
await mkdir(path.dirname(preview),{recursive:true});
// Pad by the largest shift so a cell moved up or left is not clamped at the edge,
// and rule the shared sole line so mismatched footing is easy to see.
const pad=Math.max(20,...shifts.map(t=>Math.max(Math.abs(t.x),Math.abs(t.y))))+10;
const composites=await Promise.all(cells.map(async(c,i)=>({
 input:await sharp(path.resolve(root,source)).extract({left:i*cellWidth,top:0,width:cellWidth,height:info.height}).png().toBuffer(),
 left:pad+i*cellWidth+shifts[i].x,top:pad+shifts[i].y})));
const sole=pad+(cells[0].sole??cells[0].bottom);
composites.push({input:{create:{width:info.width,height:2,channels:4,background:'#b0583c99'}},left:pad,top:sole});
await sharp({create:{width:info.width+pad*2,height:info.height+pad*2,channels:4,background:'#e8dfc8'}}).composite(composites).png().toFile(preview);

const target=path.join(root,outDir,`${file}.webp`);
await mkdir(path.dirname(target),{recursive:true});
// Checks above use the generated size; the installed sheet is stored smaller.
const scale=outDir===LIMITED_DIR?LIMITED_SCALE:1;
await sharp(path.resolve(root,source)).resize(Math.round(info.width*scale),Math.round(info.height*scale),{kernel:'lanczos3'}).webp({quality:92,alphaQuality:100,effort:6}).toFile(target);
const manifestPath=path.join(root,outDir,'manifest.json');
const manifest=JSON.parse(await readFile(manifestPath,'utf8').catch(()=>'{"installed":[]}'));
manifest.installed=[...new Set([...(manifest.installed||[]),file])].sort();
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({...report,installed:path.relative(root,target),preview:path.relative(root,preview)},null,1));
// Marked soles belong to one generated sheet; a regenerated sheet needs new ones.
if(spec.soles)console.warn(`NOTE: ${id} has hand-marked soles in src/extension-limited-animation.js. If this is a newly generated sheet, check ${path.relative(root,preview)}: the red sole line must pass under the planted feet in every cell, otherwise mark new soles and reinstall.`);
