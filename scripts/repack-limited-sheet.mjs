// Re-pack a generated key-pose sheet whose poses ignore the equal-width grid.
// Splits the row at its transparent column gaps into `cells` figures, keeps each
// figure's vertical position, and centres them in equal cells wide enough for the
// widest one. The original is kept beside it as <name>-uneven.png.
// Usage: node scripts/repack-limited-sheet.mjs <sheet.png> <cells>
import sharp from 'sharp';
import {rename} from 'node:fs/promises';

const [source,count]=process.argv.slice(2),cells=Number(count);
if(!source||!cells){console.error('Usage: node scripts/repack-limited-sheet.mjs <sheet.png> <cells>');process.exit(2);}
const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const {width,height}=info,filled=new Array(width).fill(false);
for(let x=0;x<width;x++)for(let y=0;y<height;y++)if(data[(y*width+x)*4+3]>24){filled[x]=true;break;}
// Runs of painted columns; merge across the narrowest gaps until `cells` remain.
let runs=[];for(let x=0;x<width;x++)if(filled[x]){if(runs.length&&runs.at(-1)[1]===x-1)runs.at(-1)[1]=x;else runs.push([x,x]);}
runs=runs.filter(([a,b])=>b-a>=4);
while(runs.length>cells){
 let best=0;for(let i=1;i<runs.length-1;i++)if(runs[i+1][0]-runs[i][1]<runs[best+1][0]-runs[best][1])best=i;
 runs.splice(best,2,[runs[best][0],runs[best+1][1]]);
}
if(runs.length!==cells){console.error(`found ${runs.length} separate figures, expected ${cells}`);process.exit(1);}
const margin=24,cellWidth=Math.max(...runs.map(([a,b])=>b-a+1))+margin*2;
const parts=await Promise.all(runs.map(async([a,b],i)=>({
 input:await sharp(source).extract({left:a,top:0,width:b-a+1,height}).png().toBuffer(),
 left:i*cellWidth+Math.round((cellWidth-(b-a+1))/2),top:0})));
const uneven=source.replace(/\.png$/i,'-uneven.png');
await rename(source,uneven);
await sharp({create:{width:cellWidth*cells,height,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(parts).png().toFile(source);
console.log(JSON.stringify({source,kept:uneven,figures:runs,cellWidth,size:`${cellWidth*cells}x${height}`}));
