/* One image-space camera for both eras: moving the lens never moves the street. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.TimeLensGeometry=api;
})(typeof window!=='undefined'?window:globalThis,()=>{
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function camera(width,height,zoom=1,center=.33,bounds={min:0,max:2172}){
    const scale=Math.max(width/2172,height/724)*zoom;
    const span=width/scale,worldWidth=bounds.max-bounds.min,max=bounds.max-span;
    return {scale,left:clamp(bounds.min+center*worldWidth-span/2,bounds.min,max),top:(724-height/scale)/2,span,max,min:bounds.min,worldWidth};
  }
  function lens(width,height,x,y,radius){
    const r=Math.min(radius,width*.36,height*.42);
    return {x:clamp(x*width,r+8,width-r-8),y:clamp(y*height,r+8,height-r-8),radius:r};
  }
  function worldAt(view,x,y){return {x:view.left+x/view.scale,y:view.top+y/view.scale};}
  function pan(view,pixels){return clamp((view.left-view.min-pixels/view.scale+view.span/2)/view.worldWidth,view.span/(2*view.worldWidth),1-view.span/(2*view.worldWidth));}
  function nearest(point,stops){return stops.reduce((best,stop)=>Math.abs(point.x-stop.x)<Math.abs(point.x-best.x)?stop:best,stops[0]);}
  function dividerAxis(width,height,angle){
    const radians=angle*Math.PI/180;
    const nx=Math.abs(Math.cos(radians))<1e-10?0:Math.cos(radians);
    const ny=Math.abs(Math.sin(radians))<1e-10?0:Math.sin(radians);
    return {nx,ny,min:Math.min(0,nx*width)+Math.min(0,ny*height),span:Math.abs(nx)*width+Math.abs(ny)*height};
  }
  function dividerPosition(width,height,x,y,angle){
    const a=dividerAxis(width,height,angle);
    return clamp((x*a.nx+y*a.ny-a.min)/a.span,0,1);
  }
  // Clip the modern half-plane and use its exact edge for the draggable divider.
  function divider(width,height,position,angle=0){
    const a=dividerAxis(width,height,angle),offset=a.min+clamp(position,0,1)*a.span;
    const corners=[{x:0,y:0},{x:width,y:0},{x:width,y:height},{x:0,y:height}];
    const polygon=[],edge=[],distance=p=>p.x*a.nx+p.y*a.ny-offset;
    for(let i=0;i<4;i++){
      const p=corners[i],q=corners[(i+1)%4],dp=distance(p),dq=distance(q);
      if(dp>=0)polygon.push(p);
      if(Math.abs(dp)<1e-8)edge.push(p);
      if((dp<0&&dq>0)||(dp>0&&dq<0)){
        const t=dp/(dp-dq),cross={x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t};
        polygon.push(cross);edge.push(cross);
      }
    }
    const first=edge[0],last=edge[edge.length-1];
    let area=0;
    for(let i=0;i<polygon.length;i++){
      const p=polygon[i],q=polygon[(i+1)%polygon.length];area+=p.x*q.y-q.x*p.y;
    }
    return {...a,polygon,x:(first.x+last.x)/2,y:(first.y+last.y)/2,
      length:Math.hypot(last.x-first.x,last.y-first.y),song:clamp(1-Math.abs(area)/(2*width*height),0,1)};
  }
  return {clamp,camera,lens,worldAt,pan,nearest,divider,dividerPosition};
});
