// Pack the generated atlas into uniform, foot-aligned cells; retain source alpha.
const sharp=require('sharp');
const fs=require('node:fs/promises');
(async()=>{
 const source='art-source/visitors/duos-original.png';
 const {width,height}=await sharp(source).metadata(),size=192,tiles=[];
 for(let i=0;i<64;i++){
  const left=Math.round(i%8*width/8),top=Math.round(Math.floor(i/8)*height/8);
  const cell=await sharp(source).extract({left,top,width:Math.round(width/8),height:Math.round(height/8)}).toBuffer();
  const {data,info}=await sharp(cell).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let x1=info.width,y1=info.height,x2=0,y2=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>64){x1=Math.min(x1,x);x2=Math.max(x2,x);y1=Math.min(y1,y);y2=Math.max(y2,y);}
  const {data:input,info:out}=await sharp(cell).extract({left:x1,top:y1,width:x2-x1+1,height:y2-y1+1}).resize({width:160,height:161,fit:'inside'}).png().toBuffer({resolveWithObject:true});
  tiles.push({input,left:i%8*size+Math.round((size-out.width)/2),top:Math.floor(i/8)*size+Math.round(size*.92)-out.height});
 }
 const packed=await sharp({create:{width:size*8,height:size*8,channels:4,background:'#00000000'}}).composite(tiles).png().toBuffer();
 await fs.mkdir('assets/explore/visitors',{recursive:true});
 await sharp(packed).webp({quality:92,alphaQuality:100}).toFile('assets/explore/visitors/duos.webp');
 await sharp(packed).resize(768,768).webp({quality:86,alphaQuality:100}).toFile('assets/explore/visitors/duos-low.webp');
 console.log('Packed 64 unique duos with aligned feet.');
})();
