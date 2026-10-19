import {fusionPlacements} from './city-fusion-data.js?v=scale-audit-v2-20261009';
import {pointFixes} from './city-point-fixes.js?v=point-fixes-20261009';
export function applyCityFusion(people){return people.map(p=>{const placed={...p,...fusionPlacements[p.id],...pointFixes[p.id]};if(placed.repairedArtwork)placed.originalAssetVariants=p.assetVariants;placed.depthOrder=placed.position[1];return placed;}).sort((a,b)=>a.depthOrder-b.depthOrder);}

// Foreground portions of the original painting. Each has a ground-depth baseline.
// Figures behind an object are covered; figures walking in front remain visible.
export const cityOccluders=[
 {id:'bridge-front-rail',depth:509,polygon:[[886,490],[998,483],[1080,485],[1167,494],[1167,508],[1080,499],[998,497],[886,504]]},
 {id:'west-quay-wall',depth:624,polygon:[[378,614],[500,603],[634,609],[779,600],[818,604],[816,617],[646,628],[494,621],[377,629]]},
 {id:'east-quay-wall',depth:662,polygon:[[1245,610],[1440,641],[1570,649],[1776,655],[2004,661],[2004,672],[1768,666],[1559,660],[1434,650],[1245,623]]},
 {id:'tea-main-canopy',depth:542,polygon:[[614,505],[678,506],[678,530],[614,531]]},
 {id:'tea-small-canopy',depth:526,polygon:[[700,497],[738,496],[738,521],[700,523]]},
 {id:'tea-east-canopy',depth:491,polygon:[[749,461],[784,461],[784,484],[748,486]]},
 {id:'market-front-canopy',depth:565,polygon:[[1618,539],[1683,536],[1682,561],[1618,562]]},
 {id:'market-east-canopy',depth:547,polygon:[[1710,506],[1749,508],[1750,542],[1710,541]]},
 {id:'market-west-canopy',depth:557,polygon:[[1453,509],[1507,509],[1508,542],[1454,544]]},
 {id:'mill-willow',depth:532,polygon:[[273,421],[291,416],[313,435],[311,476],[302,514],[287,532],[271,513],[272,473],[264,448]]},
 {id:'tea-yard-tree',depth:524,polygon:[[567,467],[580,447],[602,454],[617,473],[615,500],[599,518],[580,524],[559,508],[556,484]]},
 {id:'market-yard-tree',depth:585,polygon:[[1513,541],[1544,538],[1563,561],[1554,585],[1529,584],[1508,567]]},
 {id:'temple-garden-tree',depth:222,polygon:[[1335,173],[1359,161],[1380,179],[1379,203],[1359,221],[1339,213]]},
 {id:'village-road-tree',depth:329,polygon:[[224,293],[247,281],[267,293],[267,316],[249,329],[227,318]]}
];
export function isCityOccluded(p,x,y){return cityOccluders.some(m=>p.position[1]*785<m.depth&&inPolygon(x,y,m.polygon));}
function inPolygon(x,y,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
export function addCityForeground(world,W,H){
 world.querySelectorAll('.foreground-mask').forEach(e=>e.remove());
 for(const m of cityOccluders){const e=document.createElement('div');e.className='foreground-mask';e.dataset.mask=m.id;e.style.zIndex=Math.round(m.depth*10);e.style.clipPath=`polygon(${m.polygon.map(([x,y])=>`${x/W*100}% ${y/H*100}%`).join(',')})`;world.append(e);}
}
export function addCityFurnishings(layer,people,W,H){
 const byId=new Map(people.map(p=>[p.id,p]));
 const ns='http://www.w3.org/2000/svg';
 function furniture(id,x,y,width,height,drawing,depth){const e=document.createElementNS(ns,'svg');e.classList.add('city-furnishing');e.dataset.furniture=id;e.setAttribute('viewBox','0 0 60 50');e.setAttribute('aria-hidden','true');e.style.cssText=`left:${x}px;top:${y}px;width:${width}px;height:${height}px;z-index:${Math.round(depth*10)}`;e.innerHTML=drawing;layer.append(e);}
 const table='<ellipse cx="29" cy="45" rx="25" ry="3" fill="#56472b" opacity=".15"/><path d="M7 20 10 43 14 44 13 21M46 20 43 43 48 42 52 19" fill="#927c59" stroke="#65513b" stroke-width="1"/><path d="m3 15 31-12 22 12-32 12z" fill="#bda17b" stroke="#65513b" stroke-width="1"/><path d="m3 15 21 12 32-12v5L24 32 3 20z" fill="#92764d" stroke="#65513b" stroke-width="1"/><ellipse cx="24" cy="15" rx="3" ry="1.6" fill="#dcd5bd" stroke="#6b6752" stroke-width=".7"/><ellipse cx="37" cy="13" rx="3" ry="1.6" fill="#dcd5bd" stroke="#6b6752" stroke-width=".7"/>';
 const desk='<path d="M6 19 10 43 15 42 13 19M45 18 42 42 47 44 52 19" fill="#937b54" stroke="#66513c" stroke-width="1"/><path d="m2 13 32-10 24 12-32 11z" fill="#bc9f74" stroke="#66513c" stroke-width="1"/><path d="m2 13 24 13 32-11v4L26 30 2 17z" fill="#947950" stroke="#66513c" stroke-width="1"/><path d="m20 12 17-4 8 6-17 5z" fill="#eee2bc" stroke="#82704e" stroke-width=".5"/>';
 for(const [id,kind] of [['tea-01','tea'],['gate-01','desk']]){const p=byId.get(id);if(!p)continue;const x=p.position[0]*W,y=p.position[1]*H;const size=p.scale;furniture(id+'-surface',x+size*.18,y-size*.52,size*.64,size*.46,kind==='tea'?table:desk,y-size*.08);}
 // Existing seated atlas cells already contain their chairs and stools.
}
