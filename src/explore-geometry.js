export function contains(area,x,y){
 if(area.type==='rect')return x>=area.x&&x<=area.x+area.w&&y>=area.y&&y<=area.y+area.h;
 let inside=false; const p=area.points;
 for(let i=0,j=p.length-1;i<p.length;j=i++)if((p[i][1]>y)!==(p[j][1]>y)&&x<(p[j][0]-p[i][0])*(y-p[i][1])/(p[j][1]-p[i][1])+p[i][0])inside=!inside;
 return inside;
}
export function areaSize(a){if(a.type==='rect')return a.w*a.h;return Math.abs(a.points.reduce((sum,p,i)=>{const q=a.points[(i+1)%a.points.length];return sum+p[0]*q[1]-q[0]*p[1]},0))/2}
export function hitTarget(targets,x,y){return targets.flatMap(t=>t.hitAreas.filter(a=>contains(a,x,y)).map(a=>({target:t,size:areaSize(a)}))).sort((a,b)=>a.size-b.size)[0]?.target}
export function sanitize(raw,targets,eggs,version){const unique=(xs,all)=>Array.isArray(xs)?[...new Set(xs.filter(x=>all.some(t=>t.id===x)))]:[];const number=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0?n:0;return {version,found:unique(raw?.found,targets),eggs:unique(raw?.eggs,eggs),hints:number(raw?.hints),seconds:number(raw?.seconds),sound:raw?.sound===true,view:raw?.view&&[raw.view.x,raw.view.y,raw.view.zoom].every(Number.isFinite)?{x:Math.max(0,Math.min(1,raw.view.x)),y:Math.max(0,Math.min(1,raw.view.y)),zoom:Math.max(1,Math.min(4,raw.view.zoom))}:null}}
