// Reuses original atlas pixels; only computes placement and contact geometry.
const fs=require('node:fs');
const sharp=require(process.env.CITY_FUSION_SHARP||'sharp');
const W=2004,H=785;
const input=JSON.parse(fs.readFileSync('docs/city-fusion/original-population.json','utf8'));
const groups=JSON.parse(fs.readFileSync('docs/people-v2/collection-targets-v31.json','utf8'));
const targetIds=new Set(groups.flatMap(t=>t.sceneEntityIds));
const related=new Map(groups.filter(t=>t.sceneEntityIds.length>1).flatMap(t=>t.sceneEntityIds.map(id=>[id,t.sceneEntityIds])));
const audit=JSON.parse(fs.readFileSync('docs/city-fusion/ground-review.json','utf8'));
// All poses were reviewed from the actual atlas cells, including seated figures
// whose authored role/action text does not mention sitting.
const poseReview=JSON.parse(fs.readFileSync('docs/city-fusion/posture-review.json','utf8'));
function posture(p){const name=p.assetVariants.high.split('/').at(-1).replace('.webp','');const atlas=poseReview.atlases[name];if(!atlas)throw Error('Unreviewed atlas '+name);return Object.keys(atlas).find(k=>atlas[k].includes(p.sprite))||'standing';}
function visibleHeight(p){return poseReview.visibleHeights[posture(p)];}
const order=['boats','bridge','quay','temple','fields','mill','tea','gate','lanes'];
const inPoly=(x,y,poly)=>{let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;};
const overlap=(a,b)=>Math.min(a.x+a.w,b.x+b.w)>Math.max(a.x,b.x)&&Math.min(a.y+a.h,b.y+b.h)>Math.max(a.y,b.y);
function bounds(p,x,y,h){const m=p.visualMetrics,w=h*(p.ambient?1:.75);return{x:x-w/2+w*m.left-.6,y:y-h*m.bottom+h*m.top-.6,w:w*(m.right-m.left)+1.2,h:h*(m.bottom-m.top)+1.2};}
(async()=>{
 const {walkableSurfaces,foregroundKeepouts}=await import('../src/population-v3-data.js');
 const {data}=await sharp('docs/city-fusion/layout-reference.png').raw().toBuffer({resolveWithObject:true});
 const ground=new Uint8Array(W*H),sum=new Uint32Array((W+1)*(H+1));
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const at=(y*W+x)*3,r=data[at],g=data[at+1],b=data[at+2];ground[y*W+x]=r>151&&g>128&&b>89&&r-g>6&&r-g<55&&g-b>8&&g-b<78?1:0;}
 const review=JSON.parse(fs.readFileSync('docs/people-v3/placement-review.json','utf8'));
 const blocks=[[251,560,355,593],[657,540,760,574],[981,514,1077,550],[1572,570,1692,610],...foregroundKeepouts.map(([l,t,r,b])=>[l*W,t*H,r*W,b*H]),...review.keepouts.map(q=>q.bounds),...audit.buildings,...audit.groundObstacles].map(b=>b.map(Math.round));
 for(const [l,t,r,b]of blocks)for(let y=t;y<b;y++)for(let x=l;x<r;x++)ground[y*W+x]=0;
 for(const poly of audit.bridgeRails)for(let y=440;y<510;y++)for(let x=882;x<1170;x++)if(inPoly(x,y,poly))ground[y*W+x]=0;
 // Ink joints are allowed; broad roof, vegetation and water areas remain excluded.
 const footGround=new Uint8Array(ground);
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(!ground[y*W+x]){let n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)n+=ground[(y+dy)*W+x+dx];if(n>=5)footGround[y*W+x]=1;}
 function coverage(x,y,w,h){const l=Math.max(0,Math.floor(x)),t=Math.max(0,Math.floor(y)),r=Math.min(W,Math.ceil(x+w)),b=Math.min(H,Math.ceil(y+h));if(r<=l||b<=t)return 0;return(sum[b*(W+1)+r]-sum[t*(W+1)+r]-sum[b*(W+1)+l]+sum[t*(W+1)+l])/((r-l)*(b-t));}
 // Do not let paving-joint dilation reopen buildings or either bridge rail.
 for(const [l,t,r,b]of blocks)for(let y=t;y<b;y++)for(let x=l;x<r;x++)footGround[y*W+x]=0;
 for(const poly of audit.bridgeRails)for(let y=440;y<510;y++)for(let x=882;x<1170;x++)if(inPoly(x,y,poly))footGround[y*W+x]=0;
 // Rebuild coverage after exact exclusions.
 sum.fill(0);for(let y=0;y<H;y++){let line=0;for(let x=0;x<W;x++){line+=footGround[y*W+x];sum[(y+1)*(W+1)+x+1]=sum[y*(W+1)+x+1]+line;}}
 const cells=new Map(),out={},stats={},candidates={},rasters=new Map(),atlasImages=new Map(),occupancy=new Uint8Array(W*2*H*2);
 async function atlas(url){if(!atlasImages.has(url))atlasImages.set(url,await sharp(url).ensureAlpha().raw().toBuffer({resolveWithObject:true}));return atlasImages.get(url);}
 function cellAlpha(p,im){const cols=p.atlasColumns||4,rows=p.atlasRows||2,cw=im.info.width/cols,ch=im.info.height/rows,alpha=new Uint8Array(cw*ch);for(let y=0;y<ch;y++)for(let x=0;x<cw;x++)alpha[y*cw+x]=im.data[((Math.floor(p.sprite/cols)*ch+y)*im.info.width+p.sprite%cols*cw+x)*4+3];return{alpha,cw,ch};}
 function connectedMetrics({alpha,cw,ch},duo){
  const visited=new Uint8Array(alpha.length),queue=new Int32Array(alpha.length),components=[];
  for(let i=0;i<alpha.length;i++){if(visited[i]||alpha[i]<100)continue;let n=1,read=0,left=cw,right=0,top=ch,bottom=0;queue[0]=i;visited[i]=1;while(read<n){const at=queue[read++],x=at%cw,y=Math.floor(at/cw);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy;if(nx<0||nx>=cw||ny<0||ny>=ch)continue;const ni=ny*cw+nx;if(!visited[ni]&&alpha[ni]>=100){visited[ni]=1;queue[n++]=ni;}}}components.push({n,left,right,top,bottom});}
  components.sort((a,b)=>b.n-a.n);const largest=components[0];if(!largest)throw Error('Empty sprite');
  // Keep substantial detached props and both members of a duo; ignore tiny
  // clipped fragments from the neighboring atlas cell.
  const kept=components.filter(c=>c.n>=largest.n*(duo?.18:.035));
  const m={left:Math.max(0,Math.min(...kept.map(c=>c.left))-1)/cw,right:Math.min(cw,Math.max(...kept.map(c=>c.right))+2)/cw,top:Math.max(0,Math.min(...kept.map(c=>c.top))-1)/ch,bottom:Math.min(ch,Math.max(...kept.map(c=>c.bottom))+2)/ch};
  return m;
 }
 const measured=[];
 for(const original of [...input.residents,...input.visitors]){const p={...original},key=p.assetVariants.low+'#'+p.sprite;
  if(!rasters.has(key)){const high=cellAlpha(p,await atlas(p.assetVariants.high)),low=cellAlpha(p,await atlas(p.assetVariants.low));rasters.set(key,{...low,metrics:connectedMetrics(high,p.ambient)});}
  p.visualMetrics=rasters.get(key).metrics;measured.push(p);
 }
 // Alpha collision keeps empty space around sleeves, furniture and poles usable.
 function solidPixels(p,x,y,h){const {alpha,cw,ch}=rasters.get(p.assetVariants.low+'#'+p.sprite),w=h*(p.ambient?1:.75),left=x-w/2,top=y-h*p.visualMetrics.bottom,points=[];for(let yy=Math.max(0,Math.ceil(top*2));yy<Math.min(H*2,(top+h)*2);yy++)for(let xx=Math.max(0,Math.ceil(left*2));xx<Math.min(W*2,(left+w)*2);xx++){const sx=Math.min(cw-1,Math.floor((xx/2-left)/w*cw)),sy=Math.min(ch-1,Math.floor((yy/2-top)/h*ch));if(sx/cw>=p.visualMetrics.left&&sx/cw<p.visualMetrics.right&&sy/ch>=p.visualMetrics.top&&sy/ch<p.visualMetrics.bottom&&alpha[sy*cw+sx]>160)points.push(yy*W*2+xx);}return points;}
 function silhouetteConflict(p,x,y,h){const pixels=solidPixels(p,x,y,h);return pixels.filter(i=>occupancy[i]).length/Math.max(1,pixels.length);}

 function nearby(b){const set=new Set();for(let y=Math.floor(b.y/32);y<=Math.floor((b.y+b.h)/32);y++)for(let x=Math.floor(b.x/32);x<=Math.floor((b.x+b.w)/32);x++)for(const q of cells.get(x+','+y)||[])set.add(q);return[...set];}
 function occupy(b){for(let y=Math.floor(b.y/32);y<=Math.floor((b.y+b.h)/32);y++)for(let x=Math.floor(b.x/32);x<=Math.floor((b.x+b.w)/32);x++){const key=x+','+y;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(b);}}
 for(const region of order){const list=[];for(let y=16;y<H-3;y+=2)for(let x=12;x<W-12;x+=2){if(!footGround[y*W+x])continue;if(region==='boats'){if(!audit.boatDecks.some(poly=>inPoly(x,y,poly)))continue;}else{if([[0,0],[-2,0],[2,0],[0,-2],[0,2]].some(([dx,dy])=>inPoly(x+dx,y+dy,audit.river)&&!inPoly(x+dx,y+dy,audit.bridgeDeck)))continue;if(region!=='lanes'&&!walkableSurfaces[region].some(poly=>inPoly(x/W,y/H,poly)))continue;}list.push([x,y]);}candidates[region]=list;}
 const all=measured.sort((a,b)=>order.indexOf(a.regionId)-order.indexOf(b.regionId)||(targetIds.has(a.id)?0:1)-(targetIds.has(b.id)?0:1)||(a.ambient?1:0)-(b.ambient?1:0)||a.id.localeCompare(b.id));
 for(const p of all){const reg=p.regionId,original=[p.position[0]*W,p.position[1]*H];let best;
  const wanted=visibleHeight(p)/(p.visualMetrics.bottom-p.visualMetrics.top);
  const family=(related.get(p.id)||all.filter(q=>q.groupId&&q.groupId===p.groupId).map(q=>q.id)).map(id=>out[id]).filter(Boolean);
  const desired=family.length?[family.reduce((n,q)=>n+q.position[0]*W,0)/family.length,family.reduce((n,q)=>n+q.position[1]*H,0)/family.length]:original;
  const options=candidates[reg].map(([x,y])=>({x,y,score:(x-desired[0])**2+(y-desired[1])**2*1.7})).sort((a,b)=>a.score-b.score);
  const h=+wanted.toFixed(5),boat=reg==='boats',visible=visibleHeight(p);
  function tryPlace(q){
   const b=bounds(p,q.x,q.y,h),foot=coverage(q.x-visible*.14,q.y-2,visible*.28,4),body=coverage(b.x,b.y,b.w,b.h);
   if(b.y<1||b.x<1||b.x+b.w>=W||b.y+b.h>=H||foot<(boat?.5:.84)||body<(boat?0:.45))return;
   if(boat&&audit.boatCanopies.some(([l,t,r,d])=>q.y<d+1&&overlap(b,{x:l,y:t,w:r-l,h:d-t})))return;
   if(q.x>886&&q.x<1168&&q.y>442&&q.y<510&&!inPoly(q.x,q.y,audit.bridgeDeck))return;
   // No torso floating on a roof behind its frontage; in-front overlap is natural.
   if(!boat&&audit.buildings.some(([l,t,r,d])=>q.y<d+2&&overlap(b,{x:l-1,y:t-1,w:r-l+2,h:d-t+2})))return;
   if(blocks.slice(0,4).some(([l,t,r,d])=>overlap(b,{x:l,y:t,w:r-l,h:d-t})))return;
   if(nearby(b).some(other=>overlap(b,other))&&silhouetteConflict(p,q.x,q.y,h)>.01)return;
   best={x:q.x,y:q.y,h,box:b,foot,body};
  }
  for(const q of options){tryPlace(q);if(best)break;}
  if(!best&&!boat){
   const nearbyPaths=candidates.lanes.map(([x,y])=>({x,y,score:(x-original[0])**2+(y-original[1])**2*1.7})).filter(q=>q.score<350**2).sort((a,b)=>a.score-b.score);
   for(const q of nearbyPaths){tryPlace(q);if(best)break;}
  }
  if(!best)throw Error('No safe placement for '+p.id);
  occupy(best.box);for(const i of solidPixels(p,best.x,best.y,best.h))occupancy[i]=1;out[p.id]={position:[+(best.x/W).toFixed(7),+(best.y/H).toFixed(7)],scale:best.h,anchor:[.5,p.visualMetrics.bottom],visualMetrics:p.visualMetrics,footCoverage:+best.foot.toFixed(3),bodyCoverage:+best.body.toFixed(3),visibleHeight:visibleHeight(p),posture:posture(p),surfaceId:reg+'-fusion-ground'};
  (stats[reg]??=[]).push(visibleHeight(p));
 }
 const summary=Object.fromEntries(Object.entries(stats).map(([k,a])=>[k,{count:a.length,min:Math.min(...a),average:+(a.reduce((s,v)=>s+v,0)/a.length).toFixed(2),max:Math.max(...a)}]));
 fs.writeFileSync('src/city-fusion-data.js','// Original artwork, calibrated contact anchors and placements. Generated by scripts/layout-city-fusion.cjs.\nexport const fusionPlacements='+JSON.stringify(out)+';\n');
 fs.writeFileSync('docs/city-fusion/layout.json',JSON.stringify({size:[W,H],placements:out,summary},null,2));
 console.log(JSON.stringify(summary,null,2));
})();
