import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {population} from '../src/extension-people-data.js';

const {people,roads}=population;
assert.equal(new Set(people.map(p=>p.id)).size,people.length,'duplicate person');
assert.equal(new Set(people.map(p=>p.src+'#'+p.sprite)).size,people.length,'repeated artwork');
assert.equal(people.reduce((s,p)=>s+p.members,0),population.count);
for(const src of population.assets)await access(new URL('../'+src,import.meta.url));
// A cart wheel drawn in front of the carter reaches below his feet; the river rule applies to the feet.
const inFront={'mill-12':7};
for(const p of people){
 assert(p.sprite>=0&&p.sprite<p.cols*p.rows,p.id+' invalid cell');
 const b=p.bounds;assert(b.left>=0&&b.right<=1&&b.left<b.right&&b.top>=0&&b.bottom<=1&&b.top<b.bottom,p.id+' invalid alpha bounds');
 assert(p.x-p.w/2>=-5430&&p.x+p.w/2<=7602,p.id+' outside scroll');
 assert(p.y-(inFront[p.id]||0)<=480,p.id+' in river');
 const road=roads.find(r=>r.id===p.surface);
 if(road){assert(p.x-p.w/2>=road.range[0]-.02&&p.x+p.w/2<=road.range[1]+.02,p.id+' outside safe road');assert(p.y>=474,p.id+' behind storefront');}
 if(p.surface==='bridge')assert(p.x>=1250&&p.x<=1740&&p.y>=402&&p.y<=477);
 assert(p.x+p.w/2<=-1800||p.x-p.w/2>=-1395,p.id+' intersects waterwheel');
 if(p.y<=467)assert(p.x+p.w/2<=-3190||p.x-p.w/2>=-3120,p.id+' stands on well');
}
for(let i=0;i<people.length;i++)for(let j=i+1;j<people.length;j++){
 const a=people[i],b=people[j];
 const overlapX=Math.min(a.x+a.w/2,b.x+b.w/2)-Math.max(a.x-a.w/2,b.x-b.w/2);
 const overlapY=Math.min(a.y,b.y)-Math.max(a.y-a.h,b.y-b.h);
 assert(overlapX<=1||overlapY<=8,`${a.id} overlaps ${b.id}`);
}
console.log(`Verified ${people.length} unique scenes / ${population.count} people: source cells, safe ground, waterwheel clearance, and figure separation.`);
