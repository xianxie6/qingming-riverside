(() => {
  'use strict';
  const ink='#5e513d',hemp='#a48d64';
  const line=(c,points,color=ink,width=.65)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.stroke();};
  const ellipse=(c,x,y,rx,ry,color)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();};
  function project(b,x,y){return {x:b.x+x*b.scale*b.axisX,y:b.y+(x*b.axisY+y)*b.scale};}
  function riverClip(c){
    // The ship recedes beneath the traced timber arch; the architecture masks
    // its mast, crew and stern in turn, rather than fading the vessel away.
    c.beginPath();c.moveTo(1200,724);c.lineTo(1200,542);c.lineTo(1428,542);c.lineTo(1428,448);
    c.bezierCurveTo(1470,423,1538,422,1595,450);c.lineTo(1595,542);c.lineTo(1900,542);c.lineTo(1900,724);c.closePath();c.clip();
  }
  function drawShip(c,event,texture,inhabitants,characters,time){
    const b=event.vessel();if(!b.opacity||!texture.width)return;
    c.save();c.globalAlpha*=.96*b.opacity;if(b.occluded)riverClip(c);
    const stern=project(b,-82,5),bow=project(b,80,4),water=project(b,0,9);
    c.save();c.globalAlpha*=.20;
    for(let i=0;i<5;i++)line(c,[[stern.x+6+i*2,stern.y+(2+i*2)*b.scale],[water.x+Math.sin(time+i)*b.scale,water.y+(2+i*2)*b.scale],[bow.x-5-i*2,bow.y+(2+i*2)*b.scale]],'#727c68',.7);
    c.restore();
    c.save();c.translate(b.x,b.y);c.scale(b.scale,b.scale);c.transform(b.axisX,b.axisY,0,1,0,0);
    c.drawImage(texture,-86,-43,172,52);
    // Open-deck cargo and mast hinge share the same hull coordinates.
    for(const [x,y] of [[36,-13],[52,-12],[64,-10]]){
      ellipse(c,x,y,7,6,'#b5a382');line(c,[[x-6,y],[x+6,y]],'#7c694c');line(c,[[x,y-5],[x,y+5]],'#7c694c');
    }
    c.restore();
    const footAt=x=>project(b,x,-10);
    let grips=[];
    if(inhabitants.ready&&characters.ready){
      for(const [i,x] of [-62,47].entries()){
        const foot=footAt(x),working=event.working,pose={phase:0,handX:working?Math.sin(time*1.5+i)*1.4+3:0,handY:working?1:-4,nod:.04,lean:working?.035:0};
        if(b.wave||(event.recognized&&event.stage==='approach'&&event.stageTime<5)){pose.handY=-9;pose.handX=Math.sin(time*3)*3;pose.nod=.05;}
        const result=inhabitants.sprite(c,{p:{art:characters.sprites.boatman,h:53*b.scale},x:foot.x,y:foot.y,pose,walking:false,direction:i?-1:1,ground:null},time);
        grips.push(result.hand);
        if(i===0){const top=result.hands[0],lower=result.hands[1],tip={x:foot.x+16,y:foot.y+22};line(c,[[top.x,top.y-8],[lower.x,lower.y],[tip.x,tip.y]],ink,.9);}
      }
    }
    const base=project(b,-23,-11),angle=b.mast*1.46;
    const tip=project(b,-23+100*Math.sin(angle),-11-100*Math.cos(angle));
    line(c,[[base.x,base.y],[tip.x,tip.y]],ink,2.2*b.scale);
    line(c,[[base.x+1,base.y],[tip.x+1,tip.y]],'#c3ac7d',.6*b.scale);
    for(const end of [-71,70]){const a=project(b,end,-10);line(c,[[a.x,a.y],[tip.x,tip.y]],'#7e7155',.55*b.scale);}
    // Furled sail and lashing follow the mast as it is lowered.
    const dx=tip.x-base.x,dy=tip.y-base.y,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
    for(let i=0;i<10;i++){const u=.47+i*.043,px=base.x+dx*u,py=base.y+dy*u;line(c,[[px-nx*3,py-ny*3],[px+nx*3,py+ny*3]],i%2?'#98846a':'#c7b897',2.4*b.scale);}
    if(grips[1])line(c,[[grips[1].x,grips[1].y],[base.x+dx*.45,base.y+dy*.45]],'#806d4e',.6);
    // The near gunwale covers the crew's feet.
    c.save();c.translate(b.x,b.y);c.scale(b.scale,b.scale);c.transform(b.axisX,b.axisY,0,1,0,0);
    c.drawImage(texture,0,texture.height*.78,texture.width,texture.height*.22,-86,-2.44,172,11.44);c.restore();
    c.restore();return project(b,57,-10);
  }
  function drawRope(c,event,hand,time){
    if(!event.active||['record','complete'].includes(event.stage))return;
    const b=event.vessel(),a=project(b,57,-10),fair={x:1414,y:window.ScrollWorld.frontRailY(1414)-1};
    const reach=event.stage==='approach'?window.BridgeStory.smooth((event.stageTime-7)/4):1;
    if(reach<=0)return;
    const end={x:a.x+(fair.x-a.x)*reach,y:a.y+(fair.y-a.y)*reach};
    const slack=(1-event.tension)*19;
    c.save();c.globalAlpha*=event.stage==='clear'?0:event.stage==='guide'?.95*(1-window.BridgeStory.smooth((event.progress-.76)/.22)):.95;
    c.beginPath();c.moveTo(a.x,a.y);c.quadraticCurveTo((a.x+end.x)/2,(a.y+end.y)/2+slack,end.x,end.y);c.strokeStyle=ink;c.lineWidth=1.65;c.stroke();
    c.strokeStyle=hemp;c.lineWidth=.65;c.stroke();
    const hold=event.joined&&hand?hand:{x:1408,y:window.ScrollWorld.streetY(1408)-7};
    line(c,[[end.x,end.y],[hold.x,hold.y]],ink,1.4);line(c,[[end.x,end.y],[hold.x,hold.y]],hemp,.6);
    if(event.joined&&hand){ellipse(c,hand.x,hand.y,1.4,1.6,'#b78e64');}
    else if(event.stage!=='approach'){
      c.beginPath();c.ellipse(hold.x,hold.y,5,2,0,0,Math.PI*3);c.strokeStyle=ink;c.lineWidth=1;c.stroke();
    }
    c.restore();return hold;
  }
  function drawRail(c,original){
    c.save();c.beginPath();
    const world=window.ScrollWorld;
    for(const [offset,width] of [[0,3.8],[12,2.5],[26,3.2]]){
      for(let x=1353;x<=1711;x+=2){const y=world.frontRailY(x)+offset-width/2;x===1353?c.moveTo(x,y):c.lineTo(x,y);}
      for(let x=1711;x>=1353;x-=2)c.lineTo(x,world.frontRailY(x)+offset+width/2);c.closePath();
    }
    for(const [x,top,bottom,width] of world.bridgeGeometry.posts)c.rect(x-width/2,top,width,bottom-top);
    for(let x=1364;x<1709;x+=10)c.rect(x-.55,world.frontRailY(x)+13,1.1,12);
    c.clip();c.drawImage(original,0,0);c.restore();
  }
  window.BridgeArt={drawShip,drawRope,project,drawRail};
})();
