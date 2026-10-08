/* The modern bridge is traced in its own 2172 × 724 artwork coordinates. */
(function(root,factory){
  const bridge=factory();
  if(typeof module==='object'&&module.exports)module.exports=bridge;
  else root.TimeLensBridge=bridge;
})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  const deck=[[1250,433],[1280,433],[1310,427],[1360,414],[1430,400],
    [1475,393],[1515,391],[1555,394],[1620,407],[1675,424],[1730,433],[1750,433]];
  const cap=[[1275,410],[1305,401],[1360,385],[1430,370],[1475,365],
    [1515,365],[1555,368],[1620,382],[1675,398],[1729,416]];
  const middle=[[1275,422],[1305,413],[1360,397],[1430,383],[1475,377],
    [1515,377],[1555,380],[1620,394],[1675,410],[1729,428]];
  const sill=[[1275,434],[1305,427],[1360,413],[1430,398],[1475,392],
    [1515,391],[1555,394],[1620,408],[1675,424],[1729,439]];
  function at(path,x){
    if(x<=path[0][0])return path[0][1];
    if(x>=path.at(-1)[0])return path.at(-1)[1];
    let i=0;while(path[i+1][0]<x)i++;
    const [a,b]=path[i],[c,d]=path[i+1];return b+(d-b)*(x-a)/(c-a);
  }
  const band=(path,width)=>[...path,...path.map(([x,y])=>[x,y+width]).reverse()];
  const silhouettes=[band(cap,3),band(middle,2.5),band(sill,7)];
  for(const x of [1274,1306,1359,1431,1514,1554,1620,1675,1728]){
    const top=at(cap,x)-5,bottom=at(sill,x)+7,w=x===1431||x===1620?5:3;
    silhouettes.push([[x-w,top],[x+w,top],[x+w,bottom],[x-w,bottom]]);
  }
  function ground(x){
    // Match the modern street, including a gradual join into the side districts.
    if(x<0)return 433+22*Math.min(1,-x/100);
    if(x>2172)return 433+22*Math.min(1,(x-2172)/100);
    return at(deck,x);
  }
  function drawRailing(ctx,art,min,max){
    if(max<1270||min>1735)return;
    ctx.save();ctx.beginPath();
    for(const ring of silhouettes){ring.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();}
    ctx.clip();ctx.drawImage(art,0,0,2172,724);ctx.restore();
  }
  return {ground,drawRailing,deck,silhouettes};
});
