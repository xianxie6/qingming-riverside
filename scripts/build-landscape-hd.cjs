// Package the imagegen-restored tiles without changing the 2004 × 785 world.
// Run after placing 0-0.png … 3-1.png in art-source/landscape-hd/tiles/.
const sharp=require('sharp');
const fs=require('node:fs/promises');
(async()=>{
 const width=5600,height=Math.round(width*785/2004),tileWidth=width/4;
 const split=Math.round(height*392/785),layers=[];
 for(let row=0;row<2;row++)for(let col=0;col<4;col++){
  const tileHeight=row?height-split:split;
  // Opaque restored tiles cover every pixel: never blend in the low-res overview.
  const input=await sharp(`art-source/landscape-hd/tiles/${col}-${row}.png`)
   .resize(tileWidth,tileHeight,{fit:'fill'}).removeAlpha().png().toBuffer();
  layers.push({input,left:col*tileWidth,top:row?split:0});
 }
 const base=await sharp({create:{width,height,channels:3,background:'#eee3c8'}})
  .composite(layers).png().toBuffer();
 const layout=JSON.parse(await fs.readFile('art-source/landscape-hd/seams/layout.json','utf8'));
 const patches=[];
 // Overlapping seam restorations contain real, native-density detail.
 // Only the central strip is used; the surrounding image supplies context.
 for(const p of layout.sort((a,b)=>a.id.localeCompare(b.id))){
  const vertical=p.id.startsWith('v'),w=p.width,h=p.height;
  const alpha=Buffer.alloc(w*h*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const distance=Math.abs((vertical?x:y)-(vertical?w:h)/2);
   const strength=Math.min(1,Math.max(0,(144-distance)/40));
   const at=(y*w+x)*4;alpha[at]=alpha[at+1]=alpha[at+2]=255;
   alpha[at+3]=Math.round(255*strength);
  }
  let patch=sharp(`art-source/landscape-hd/seams/restored/${p.id}.png`);
  // The portrait outputs include white side padding outside the artwork.
  if(vertical)patch=patch.trim({background:'#ffffff',threshold:15});
  const input=await patch.resize(w,h,{fit:'fill'}).ensureAlpha()
   .composite([{input:alpha,raw:{width:w,height:h,channels:4},blend:'dest-in'}]).png().toBuffer();
  patches.push({input,left:p.left,top:p.top});
 }
 await sharp(base).composite(patches).webp({quality:94,effort:6})
  .toFile('assets/explore/people-v3/background-hd.webp');
 const stat=await fs.stat('assets/explore/people-v3/background-hd.webp');
 console.log(`${width} × ${height}; ${(stat.size/1024/1024).toFixed(2)} MiB`);
})();
