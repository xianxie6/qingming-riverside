import {writeFile} from 'node:fs/promises';
import {createPopulation} from '../src/explore-population.js';
import {applyCityFusion} from '../src/city-fusion.js';
import {visitors} from '../src/visitors-data.js';

// Reuse the audited artwork and alpha bounds, never the old overhead-map positions.
const source=applyCityFusion([...createPopulation(),...visitors.map(p=>({...p,regionId:'visitors',role:'结伴游人',action:'结伴出行',assetVariants:{high:'assets/explore/visitors/duos.webp'},atlasColumns:8,atlasRows:8}))]).sort((a,b)=>a.id.localeCompare(b.id));
const used=new Set(),people=[];
const heights={standing:55,bent:47,seated:39,child:36};
const walking=/过桥|让路|避让|缓行|登岸|穿行|背儿|负锄|负禾|指路|到访|驻足|登坡|提水|结伴/;
const eligible=p=>p.regionId!=='boats'&&!/看船|观水|上桥|撑|划桨/.test(p.action||'');
function take(regions,predicate=()=>true){return source.find(p=>!used.has(p.id)&&regions.includes(p.regionId)&&eligible(p)&&predicate(p));}
function dimensions(p,multiplier=1){
 const m=p.visualMetrics,h=(heights[p.posture]||55)*multiplier,ratio=p.atlasColumns===8&&p.atlasRows===8?1:(p.spriteAspectRatio||.75);
 return {h,w:h*(m.right-m.left)/(m.bottom-m.top)*ratio};
}
function put(p,x,y,surface,multiplier=1){
 if(!p)return;used.add(p.id);const {w,h}=dimensions(p,multiplier);
 people.push({id:p.id,src:p.assetVariants.high,sprite:p.sprite,cols:p.atlasColumns||4,rows:p.atlasRows||2,bounds:p.visualMetrics,x:+x.toFixed(2),y:+y.toFixed(2),w:+w.toFixed(2),h:+h.toFixed(2),members:p.members||1,label:p.role+' · '+p.action,surface,posture:p.posture});
}
// Small working scenes on the open plots and footpaths, away from cottages and trellises.
for(const [x,y,h] of [[-5210,358,.68],[-5138,378,.74],[-5035,344,.66],[-4900,394,.78],[-4830,414,.82],[-4755,385,.72]])put(take(['fields'],p=>/收割|除草/.test(p.action)),x,y,'field',h);
// The well itself occupies x=-3190..-3120; use the alley to its right.
put(take(['temple'],p=>/提水|扫地/.test(p.action)),-3062,450,'garden-path',.88);
// Door recess is deeper than the front road; each guard has an unobstructed foot position.
put(source.find(p=>p.id==='gate-41'),3305,449,'gate-recess',.88);
put(take(['gate'],p=>/值守/.test(p.action)),3400,451,'gate-recess',.9);
const bridge=[[1250,477],[1280,474],[1310,467],[1340,457],[1370,445],[1400,432],[1430,422],[1460,413],[1490,407],[1520,404],[1550,405],[1580,409],[1610,418],[1640,430],[1670,445],[1700,461],[1740,477]];
const deck=x=>{let i=0;while(i<bridge.length-2&&bridge[i+1][0]<x)i++;const [a,b]=bridge[i],[c,d]=bridge[i+1];return b+(d-b)*(x-a)/(c-a);};
for(const x of [1284,1337,1392,1450,1505,1566,1621,1677,1730])put(take(['bridge'],p=>walking.test(p.action)&&p.posture==='standing'),x,deck(x)-2,'bridge',.94);

// Roads are explicit painting coordinates. Gaps reserve waterwheel, tree bases,
// pavilion masonry and the narrow approaches to the bridge.
const roads=[
 {id:'田畴',range:[-5300,-3890],regions:['fields','temple','visitors'],gap:37,duo:3},
 {id:'菜园',range:[-3755,-2210],regions:['fields','temple','visitors','bridge'],gap:29,duo:3},
 {id:'水磨西',range:[-2125,-1810],regions:['mill','visitors'],gap:16,duo:4},
 {id:'作坊',range:[-1390,-80],regions:['mill','gate','visitors'],gap:13,duo:4},
 {id:'茶市',range:[100,1000],regions:['tea','visitors'],gap:12,duo:3},
 {id:'桥西',range:[1090,1230],regions:['bridge','visitors'],gap:14,duo:3},
 {id:'桥东',range:[1780,1830],regions:['bridge'],gap:12,duo:3},
 {id:'东市',range:[2025,2320],regions:['gate','tea','visitors'],gap:14,duo:4},
 {id:'货市',range:[2405,3240],regions:['gate','visitors'],gap:12,duo:3},
 {id:'城门',range:[3275,3470],regions:['gate','visitors'],gap:20,duo:3},
 {id:'东仓',range:[3500,4200],regions:['quay','mill','visitors'],gap:16,duo:4},
 {id:'仓场',range:[4290,5310],regions:['quay','mill','visitors'],gap:14,duo:4},
 {id:'仓街',range:[5340,5830],regions:['quay','tea','visitors'],gap:17,duo:3},
 {id:'客舍',range:[5910,6640],regions:['tea','visitors'],gap:18,duo:3},
 {id:'柳岸',range:[6690,7520],regions:['visitors','bridge','temple'],gap:34,duo:2}
];
for(const road of roads){
 let edge=road.range[0],i=0;
 while(edge<road.range[1]){
  const duo=i%road.duo===1;
  let p=duo?take(['visitors']):take(road.regions.filter(r=>r!=='visitors'),p=>road.id==='柳岸'?walking.test(p.action):true);
  p ||= take(road.regions);if(!p)break;
  const {w,h}=dimensions(p),x=edge+w/2;if(x+w/2>road.range[1])break;
  const y=474+[0,5,1,3,6,2][i%6];
  const obstruction=people.find(q=>Math.min(y,q.y)-Math.max(y-h,q.y-q.h)>8&&x-w/2<q.x+q.w/2+8&&x+w/2>q.x-q.w/2-8);
  if(obstruction){edge=obstruction.x+obstruction.w/2+14;continue;}
  put(p,x,y,road.id);
  edge=x+w/2+road.gap+[0,7,0,15,4][i%5];i++;
 }
}
// Browser annotations 1–3: preserve the rest of the reviewed layout while moving
// these particular actions off the through-road and onto appropriate work surfaces.
const workPlacements=[
 {id:'fields-04',x:-5008,y:391,multiplier:.78,surface:'field-ridge',label:'扛锄人 · 沿田埂去耕作'},
 {id:'fields-05',x:-5110,y:444,multiplier:.86,surface:'field-edge',label:'老农 · 田边修整农耙'},
 {id:'fields-13',x:-3264,y:465,multiplier:.88,surface:'tool-shed',label:'村人 · 棚前整理农具'},
 // The carter's feet sat on the dark foot of the log stack and read as floating;
 // the grain farmer stoops over her basket, so standing height made her too large.
 {id:'mill-12',x:4116.19,y:487,surface:'东仓',label:'车夫 · 推车运粮'},
 {id:'mill-14',x:4308.21,y:474,multiplier:.82,surface:'仓场',label:'送粮农户 · 打开粮筐'},
 // The clerk's desk did not belong on the granary road; she is redrawn standing
 // with the account book, so she takes standing height (55) and the road edge.
 {id:'mill-13',x:4173.42,y:480,multiplier:55/39,surface:'东仓',label:'账房 · 持簿记账'}
];
for(const placement of workPlacements){
 const p=people.find(p=>p.id===placement.id),original=source.find(p=>p.id===placement.id);
 if(!p||!original)throw new Error('Missing annotated figure: '+placement.id);
 const {w,h}=dimensions(original,placement.multiplier);
 Object.assign(p,{x:placement.x,y:placement.y,w:+w.toFixed(2),h:+h.toFixed(2),surface:placement.surface,label:placement.label});
}
// Further browser feedback: the incomplete cake seller and the two stationary
// grain-handling scenes do not belong on these garden-side walking paths.
// The annotated gate guard is also excluded.
// Remove after layout so no replacement appears in the same spot on regeneration.
const excludedFromPreview=new Set(['bridge-01','mill-01','mill-02','gate-41']);
for(let i=people.length-1;i>=0;i--)if(excludedFromPreview.has(people[i].id))people.splice(i,1);
const manifest={people:people.sort((a,b)=>a.y-b.y),roads,assets:[...new Set(people.map(p=>p.src))],count:people.reduce((s,p)=>s+p.members,0)};
await writeFile(new URL('../src/extension-people-data.js',import.meta.url),'// Generated by scripts/layout-extension-people.mjs; each artwork is used once.\nexport const population='+JSON.stringify(manifest,null,2)+';\n');
console.log(JSON.stringify({instances:people.length,people:manifest.count,atlases:manifest.assets.length,areas:Object.fromEntries([...new Set(people.map(p=>p.surface))].map(r=>[r,people.filter(p=>p.surface===r).reduce((s,p)=>s+p.members,0)]))},null,2));
