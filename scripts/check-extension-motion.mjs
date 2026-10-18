import assert from 'node:assert/strict';
import {population} from '../src/extension-people-data.js';
import {createActionPlans,actionAt,jointOffset,bridgeHeight} from '../src/extension-motion.js';
const plans=createActionPlans(population),counts={};
for(const p of population.people){const plan=plans.get(p.id);counts[plan.role.kind]=(counts[plan.role.kind]||0)+1;}
// Sample an entire 112-second scene, including independently phased turnarounds.
for(let t=0;t<112;t+=.2){
 const live=population.people.map(p=>({...p,...actionAt(p,plans.get(p.id),t)}));
 for(const p of live){
  const plan=plans.get(p.id),base=population.people.find(q=>q.id===p.id);
  const route=plan.walk;
  if(route)assert(p.x>=route.a-route.step-.001&&p.x<=route.b+route.step+.001,p.id+' leaves its street route');
  else assert(p.x>=plan.left-.001&&p.x<=plan.right+.001,p.id+' leaves assigned path');
  // Passers-by use the open front lanes of the street, still above the quay wall.
  assert(p.y<=(route?.lane?488.001:480.001),p.id+' enters river');
  assert(p.x+p.w/2<=-1800||p.x-p.w/2>=-1395,p.id+' crosses waterwheel');
  if(!plan.moving)assert.equal(p.x,base.x,p.id+' drifts away from work');
  if(p.surface==='bridge')assert(Math.abs(p.y-(bridgeHeight(p.x)-2))<.1||Math.abs((p.y-base.y)-(bridgeHeight(p.x)-bridgeHeight(base.x)))<.1,p.id+' leaves bridge deck');
  for(let v=0;v<=1;v+=.1)for(let u=0;u<1;u+=.1){const d=jointOffset(p,{...p,hand:plan.hand},u,v);assert(Number.isFinite(d.x)&&Number.isFinite(d.y));assert(Math.abs(d.x)<12&&Math.abs(d.y)<12,p.id+' excessive deformation');}
 }
 for(let i=0;i<live.length;i++)for(let j=i+1;j<live.length;j++){
  const a=live[i],b=live[j];
  // Street walkers pass in front of or behind others; the still layout must stay clear.
  if(plans.get(a.id).walk||plans.get(b.id).walk)continue;
  const ox=Math.min(a.x+a.w/2,b.x+b.w/2)-Math.max(a.x-a.w/2,b.x-b.w/2);
  const oy=Math.min(a.y,b.y)-Math.max(a.y-a.h,b.y-b.h);
  assert(ox<=1||oy<=8,`${a.id}/${b.id} collide at ${t}`);
 }
}
const walkers=[...plans.values()].filter(p=>p.moving);
assert(walkers.length>20,'local walking missing');
assert([...plans.values()].filter(p=>p.walk).length>40,'street walking missing');
for(const kind of ['harvest','weed','craft','drink','pour','write','walk','cart','chat'])assert(counts[kind]>0,'missing role '+kind);
console.log(JSON.stringify({people:population.count,actors:population.people.length,localPaths:walkers.length,streetWalkers:[...plans.values()].filter(p=>p.walk).length,roles:counts,verifiedSeconds:112},null,2));
