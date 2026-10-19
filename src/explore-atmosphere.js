// Small environmental movement stays anchored to the painting's world coordinates.
export function buildAtmosphere(world,W,H){
 world.querySelector('.street-atmosphere')?.remove();
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('aria-hidden','true');svg.classList.add('street-atmosphere');
 const add=(kind,points,draw)=>points.forEach(([x,y],i)=>{
  const g=document.createElementNS(ns,'g');g.setAttribute('transform',`translate(${x*W} ${y*H})`);
  const ink=document.createElementNS(ns,'g');ink.classList.add(kind);ink.style.setProperty('--delay',`${-i*1.7}s`);draw(ink,i);g.append(ink);svg.append(g);
 });
 const path=(g,d,cls)=>{const p=document.createElementNS(ns,'path');p.setAttribute('d',d);if(cls)p.setAttribute('class',cls);g.append(p);};
 add('river-breath',[[.515,.405],[.535,.679],[.516,.815],[.361,.899],[.615,.927],[.744,.929],[.902,.951],[.305,.958]],g=>{
  path(g,'M-8 0 Q0 3 8 0 M-12 3 Q0 7 12 3 M-6 7 Q0 9 6 7');
 });
 // Warm wisps above the existing tea/food awnings, not over the target figures.
 add('tea-steam',[[.363,.635],[.423,.607],[.68,.677]],g=>{
  path(g,'M0 0 C-3 -4 4 -7 0 -12 S-2 -18 1 -21');
  path(g,'M4 -1 C7 -5 1 -8 5 -13','steam-faint');
 });
 world.insertBefore(svg,world.querySelector('#residents'));
}
