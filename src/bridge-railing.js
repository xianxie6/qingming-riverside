(function(root,factory){
  const railing=factory();
  if(typeof module==='object'&&module.exports)module.exports=railing;
  else root.BridgeRailing=railing;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  // Source-painting coordinates, not offsets from the pedestrian path.
  // Each timber has its own silhouette; the openings remain transparent.
  const cap=[[1352,424],[1380,411],[1400,404],[1425,396],[1450,388],
    [1471,383],[1508,379],[1544,379],[1576,382],[1595,386],[1618,394],
    [1645,405],[1688,427],[1718,445]];
  const capBottom=[[1352,429],[1380,416],[1400,409],[1425,401],[1450,393],
    [1471,388],[1508,384],[1544,384],[1576,387],[1595,391],[1618,399],
    [1645,410],[1688,432],[1718,450]];
  const middle=[[1352,438],[1380,425],[1400,417],[1425,409],[1450,401],
    [1471,397],[1508,391],[1544,391],[1576,394],[1595,398],[1618,405],
    [1645,417],[1688,440],[1718,457]];
  for(const point of middle)point[1]-=2.5;
  const middleBottom=middle.map(([x,y])=>[x,y+3.4]);
  const sill=[[1350,454],[1380,442],[1400,433],[1425,425],[1450,416],
    [1471,411],[1508,405],[1544,405],[1576,408],[1595,413],[1618,421],
    [1645,433],[1688,455],[1718,472]];
  const underside=[[1350,469],[1380,457],[1400,448],[1425,439],[1450,431],
    [1471,425],[1508,420],[1544,420],[1576,424],[1595,429],[1618,437],
    [1645,449],[1688,471],[1718,480]];
  const posts=[
    [1356,420,458,7],[1427,385,434,8],[1472,373,415,5],
    [1508,373,411,5],[1544,373,410,4.5],[1576,372,418,5.5],
    [1618,383,436,8],[1691,418,467,7],[1718,440,478,6]
  ];
  const at=(path,x)=>{
    let i=0;while(i<path.length-2&&path[i+1][0]<x)i++;
    const [a,b]=path[i],[c,d]=path[i+1];return b+(d-b)*(x-a)/(c-a);
  };
  const band=(top,bottom)=>[...top,...bottom.slice().reverse()];
  const silhouettes=[band(cap,capBottom),band(middle,middleBottom),band(sill,underside)];
  for(const [x,top,bottom,w] of posts){
    // Rounded carved finial, shoulder, upright. No oversized rectangular eraser.
    silhouettes.push([[x-w*.35,top+2],[x-w*.22,top],[x+w*.22,top],
      [x+w*.4,top+2],[x+w*.4,top+5],[x+w*.5,top+6],
      [x+w*.5,bottom],[x-w*.5,bottom],[x-w*.5,top+6],[x-w*.35,top+5]]);
  }
  // Small uprights only between the middle beam and sill; never through bodies
  // above the handrail. Their spacing follows the individual painted panels.
  const balusters=[1365,1372,1383,1393,1403,1412,1419,
    1437,1444,1452,1459,1466,1479,1486,1493,1500,
    1516,1523,1530,1537,1551,1558,1566,1584,1591,1598,1605,1612,
    1627,1634,1641,1648,1655,1662,1669,1676,1683,1700,1707];
  for(const x of balusters){
    const top=at(middleBottom,x),bottom=at(sill,x);
    silhouettes.push([[x-1,top],[x+1,top],[x+1,bottom],[x-1,bottom]]);
  }
  function draw(ctx,artwork,min,max){
    if(max<1346||min>1723)return;
    ctx.save();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    ctx.beginPath();
    for(const ring of silhouettes){
      ring.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
    }
    ctx.clip();
    // Restore actual ink/wood texture, rather than cutting transparent stripes
    // through people and hoping the stripes happen to match the painting.
    ctx.drawImage(artwork,0,0,2172,724);
    ctx.restore();
  }
  return {draw,silhouettes,posts,cap,capBottom,middle,middleBottom,sill};
});
