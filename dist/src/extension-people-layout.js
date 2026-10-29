import {refineFlowerStreetPeople} from './extension-flower-street.js?v=street-4';
import {PORTER} from './extension-workshop-state.js?v=haul-2';
// Display sizes share the original scene population.
export const STREET_PERSON_SCALE=1.15;
export const FLORIST_SCALE=1.32;
export const TRAVELLER_SCALE=1.05;
export const CUSTOMER_IDS=['flower-customer-rose','flower-customer-sage'];
// Their drawn key poses stand upright, but the layout sized them as seated or
// bent figures from the original stills, so they read as children.
export const STANDING_HEIGHT={'tea-13':55,'tea-04':52,'gate-11':55,'bridge-10':55};
export function createDisplayPopulation(source){
 const people=source.people.map(p=>{
  const h=STANDING_HEIGHT[p.id];
  return h?{...p,w:p.w*h/p.h,h,posture:'standing'}:p;
 }).flatMap(p=>{
  if(p.id==='visitors-47')return CUSTOMER_IDS.map((id,i)=>({
   ...p,id,x:p.x+(i?17:-17),w:29,h:p.h*STREET_PERSON_SCALE,members:1,
   label:i?'紫衣女客 · 结伴买花':'粉衣女客 · 结伴买花',customer:i
  }));
  // The warehouse helper becomes the porter who shoulders each hoisted sack.
  if(p.id==='mill-15')return[{...p,x:PORTER.x,y:PORTER.y,w:PORTER.w,h:PORTER.h,members:1,posture:'standing',label:'搬夫 · 接包入仓',porter:true}];
  // The stout traveller with the trunk reads oversized beside the slender family.
  const scale=p.id==='bridge-33'?FLORIST_SCALE:p.id==='bridge-36'?TRAVELLER_SCALE:STREET_PERSON_SCALE;
  return[{...p,w:p.w*scale,h:p.h*scale}];
 });
 return {...source,people:refineFlowerStreetPeople(people)};
}
