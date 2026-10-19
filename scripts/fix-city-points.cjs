// Local corrections for six browser annotations; the rest of the layout stays fixed.
const fs=require('fs'),sharp=require(process.env.CITY_FUSION_SHARP||'sharp');
const W=2004,H=785,base=require('../docs/city-fusion/layout.json').placements,audit=require('../docs/city-fusion/ground-review.json'),repairs=require('../docs/city-fusion/point-repairs.json');
const input=require('../docs/city-fusion/original-population.json'),all=[...input.residents,...input.visitors].map(p=>({...p,...base[p.id]})),byId=new Map(all.map(p=>[p.id,p]));
const requests={
 'bridge-25':{...repairs['bridge-25'],desired:[918,478]},
 'bridge-09':{desired:[844,484]},'bridge-10':{desired:[1244,490]},'bridge-11':{desired:[1290,486]},
 'gate-41':{...repairs['gate-41'],desired:[1830,426]},
 'bridge-35':{desired:[1258,434]},'bridge-36':{desired:[1272,462]},'visitors-04':{desired:[1276,486]},'bridge-32':{desired:[1256,514]},
 'boats-21':{desired:[1579,718]},'boats-22':{desired:[1598,716]},'boats-23':{desired:[1709,714]},
 'quay-27':{desired:[1854,626],visibleHeight:19},
 'quay-23':{desired:[1722,632]},'quay-33':{desired:[1704,631]},'quay-38':{desired:[1685,631]},'quay-40':{desired:[1737,634]}
};
const inPoly=(x,y,poly)=>{let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;};
function box(p){const m=p.visualMetrics,w=p.scale*(p.spriteAspectRatio||(p.ambient?1:.75));return{x:p.position[0]*W-w/2+w*m.left,y:p.position[1]*H-p.scale*p.anchor[1]+p.scale*m.top,w:w*(m.right-m.left),h:p.scale*(m.bottom-m.top)};}
const overlap=(a,b)=>Math.min(a.x+a.w,b.x+b.w)>Math.max(a.x,b.x)&&Math.min(a.y+a.h,b.y+b.h)>Math.max(a.y,b.y);
(async()=>{
 const {data,info}=await sharp('docs/city-fusion/layout-reference.png').removeAlpha().raw().toBuffer({resolveWithObject:true});
 function ground(x,y,p){let good=0,total=0;for(let dy=-1;dy<=1;dy++)for(let dx=-2;dx<=2;dx++){const xx=Math.round(x+dx),yy=Math.round(y+dy),at=(yy*info.width+xx)*3,r=data[at],g=data[at+1],b=data[at+2];good+=r>151&&g>128&&b>89&&r-g>6&&r-g<55&&g-b>8&&g-b<78?1:0;total++;}return good/total;}
 const cache=new Map(),occ=new Uint8Array(W*2*H*2);
 async function raster(p){const url=p.assetVariants.low;if(!cache.has(url))cache.set(url,await sharp(url).ensureAlpha().raw().toBuffer({resolveWithObject:true}));const im=cache.get(url),cols=p.atlasColumns||4,rows=p.atlasRows||2,cw=im.info.width/cols,ch=im.info.height/rows,w=p.scale*(p.spriteAspectRatio||(p.ambient?1:.75)),left=p.position[0]*W-w/2,top=p.position[1]*H-p.scale*p.anchor[1],m=p.visualMetrics,points=[];for(let y=Math.max(0,Math.ceil((top+p.scale*m.top)*2));y<Math.min(H*2,(top+p.scale*m.bottom)*2);y++)for(let x=Math.max(0,Math.ceil((left+w*m.left)*2));x<Math.min(W*2,(left+w*m.right)*2);x++){const sx=Math.min(cw-1,Math.floor((x/2-left)/w*cw)),sy=Math.min(ch-1,Math.floor((y/2-top)/p.scale*ch));if(im.data[((Math.floor(p.sprite/cols)*ch+sy)*im.info.width+p.sprite%cols*cw+sx)*4+3]>160)points.push(y*W*2+x);}return points;}
 for(const p of all.filter(p=>!requests[p.id]))for(const i of await raster(p))occ[i]=1;
 const occupied=all.filter(p=>!requests[p.id]).map(box),out={};
 for(const [id,req]of Object.entries(requests)){
  const old=byId.get(id),p={...old,...req};delete p.desired;
  if(req.visibleHeight&&!req.repairedArtwork)p.scale=req.visibleHeight/(p.visualMetrics.bottom-p.visualMetrics.top);
  const boat=p.regionId==='boats',options=[];for(let y=req.desired[1]-50;y<=req.desired[1]+50;y++)for(let x=req.desired[0]-50;x<=req.desired[0]+50;x++)options.push({x,y,score:(x-req.desired[0])**2+(y-req.desired[1])**2});options.sort((a,b)=>a.score-b.score);
  let found;
  for(const q of options){
   p.position=[q.x/W,q.y/H];const b=box(p),coverage=ground(q.x,q.y,p);
   if(coverage<(boat?.53:.84))continue;
   if(id==='bridge-25'&&!inPoly(q.x,q.y,audit.bridgeDeck))continue;
   if(id==='bridge-25'&&[[-17,-3],[-2,-3],[7,0]].some(([dx,dy])=>ground(q.x+dx,q.y+dy,p)<.65||(inPoly(q.x+dx,q.y+dy,audit.river)&&!inPoly(q.x+dx,q.y+dy,audit.bridgeDeck))))continue;
   if(audit.bridgeRails.some(poly=>inPoly(q.x,q.y,poly)))continue;
   if(boat){
    if(!audit.boatDecks.some(poly=>inPoly(q.x,q.y,poly)))continue;
    if(audit.boatCanopies.some(([l,t,r,d])=>overlap(b,{x:l,y:t,w:r-l,h:d-t})))continue;
   }else{
    if(inPoly(q.x,q.y,audit.river)&&!inPoly(q.x,q.y,audit.bridgeDeck))continue;
    if([...audit.buildings,...audit.groundObstacles,[1697,570,1747,619]].some(([l,t,r,d])=>q.x>=l&&q.x<=r&&q.y>=t&&q.y<=d))continue;
    if(audit.buildings.some(([l,t,r,d])=>q.y<d+1&&overlap(b,{x:l,y:t,w:r-l,h:d-t})))continue;
   }
   const pixels=await raster(p);if(pixels.filter(i=>occ[i]).length/Math.max(1,pixels.length)>.02)continue;
   found={...req,position:p.position,scale:p.scale,footCoverage:coverage,reviewedPointFix:true};delete found.desired;occupied.push(b);for(const i of pixels)occ[i]=1;break;
  }
  if(!found)throw Error('No local safe placement: '+id);
  out[id]=found;console.log(id,found.position.map((v,i)=>Math.round(v*[W,H][i])));
 }
 fs.writeFileSync('src/city-point-fixes.js','// Reviewed corrections for browser annotations. Generated by scripts/fix-city-points.cjs.\nexport const pointFixes='+JSON.stringify(out)+';\n');
 fs.writeFileSync('docs/city-fusion/point-fixes.json',JSON.stringify(out,null,2)+'\n');
})();
