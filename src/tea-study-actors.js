// Original, unmodified tea atlas. Coordinates use the 1120 × 800 study canvas.
export const teaStudyAtlas='assets/explore/people-v2/tea.webp';
export const teaStudyScene='assets/explore/fusion-tea/scene-original-style-v3.webp';
export const teaStudyActors=[
 {id:'tea-01',name:'添茶的茶博士',sprite:0,x:145,y:371,height:122,foot:488/512,shadow:[.40,.63],depth:371},
 {id:'tea-02',name:'举杯的老茶客',sprite:1,x:279,y:379,height:112,foot:475/512,shadow:[.43,.68],depth:379,flip:true},
 {id:'tea-07',name:'挥扇的说书人',sprite:3,x:190,y:521,height:128,foot:508/512,shadow:[.47,.64],depth:521},
 {id:'tea-08',name:'侧耳听书的老者',sprite:4,x:112,y:547,height:115,foot:462/512,shadow:[.30,.64],depth:547},
 {id:'tea-09',name:'坐听的年轻茶客',sprite:2,x:284,y:534,height:104,foot:493/512,shadow:[.42,.59],depth:534},
 {id:'tea-13',name:'端碗的摊主',sprite:5,x:700,y:450,height:100,foot:453/512,shadow:[.48,.61],depth:390},
 {id:'tea-14',name:'买食的女顾客',sprite:6,x:679,y:482,height:106,foot:451/512,shadow:[.47,.63],depth:482},
 {id:'tea-06',name:'抱碗的跑堂',sprite:7,x:562,y:587,height:117,foot:473/512,shadow:[.42,.69],depth:587}
];
export function buildTeaStudyActors(container){
 for(const p of [...teaStudyActors].sort((a,b)=>a.depth-b.depth)){
  const el=document.createElement('span');el.className='study-original-actor';el.dataset.personId=p.id;el.setAttribute('role','img');el.setAttribute('aria-label',p.name);
  const width=p.height*.75;
  el.style.cssText=`left:${p.x-width/2}px;top:${p.y-p.height*p.foot}px;width:${width}px;height:${p.height}px;z-index:${p.depth};--foot:${p.foot*100}%;background-image:url("${teaStudyAtlas}");background-position:${p.sprite%4/3*100}% ${Math.floor(p.sprite/4)*100}%;`;
  if(p.flip)el.style.transform='scaleX(-1)';
  for(const at of p.shadow){const contact=document.createElement('i');contact.className='study-foot-contact';contact.style.left=at*100+'%';el.append(contact);}
  container.append(el);
 }
 for(const [name,depth,points] of [
  ['counter',400,[[664,414],[741,414],[741,439],[664,439]]],
  ['canopy',401,[[651,313],[751,313],[751,368],[651,368]]]
 ]){const mask=document.createElement('span');mask.className='study-scene-occlusion';mask.dataset.mask=name;mask.style.zIndex=depth;mask.style.clipPath=`polygon(${points.map(([x,y])=>`${x/1120*100}% ${y/800*100}%`).join(',')})`;container.append(mask);}
 // The younger seated sprite has no chair. This small stool sits behind his body.
 const stool=document.createElementNS('http://www.w3.org/2000/svg','svg');
 stool.classList.add('study-seat');stool.setAttribute('viewBox','0 0 48 45');stool.setAttribute('aria-hidden','true');
 stool.innerHTML='<path d="M7 13 12 42 17 40 14 15M34 14 32 40 37 42 42 14" fill="#887258" stroke="#534d3b" stroke-width="1.3"/><path d="m3 10 29-8 14 8-28 9z" fill="#b49b73" stroke="#534d3b" stroke-width="1.2"/><path d="m3 10 15 9 28-9v5l-28 9L3 15z" fill="#8e775b" stroke="#534d3b" stroke-width="1.2"/>';
 stool.style.cssText='left:267px;top:487px;width:37px;height:35px;z-index:500';container.append(stool);
}
