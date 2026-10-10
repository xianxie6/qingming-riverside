(() => {
  'use strict';
  function line(ctx,points,color='#665a43',width=.6){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
  function oval(ctx,x,y,rx,ry,fill){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='#665a43';ctx.lineWidth=.5;ctx.stroke();}
  function polygon(ctx,points,fill){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='#665a43';ctx.lineWidth=.55;ctx.stroke();}
  function object(ctx,prop,x,y,scale=1){
    if(prop.amount!==undefined&&prop.amount<=0)return;
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.globalAlpha*=prop.amount??1;
    const kind=prop.kind;
    if(kind==='kettle'){
      ctx.rotate(-prop.pour*.38);oval(ctx,2,1,4,3.6,'#93947a');oval(ctx,2,-2.5,2.5,.8,'#b5ae8e');
      line(ctx,[[-2,0],[-5,-3],[-6,-1],[-4,2]],'#665a43',.8);line(ctx,[[5,0],[8,-2],[9,-1]],'#665a43',1.1);
      if(prop.pour>.3)line(ctx,[[9,-1],[11,2],[11,7]],'#d2ceb0',.75);
    }else if(kind==='pot'){
      const r=prop.size??6;
      polygon(ctx,[[-r*.5,-3],[-r*.9,0],[-r,5],[-r*.55,8],[r*.55,8],[r,5],[r*.9,0],[r*.5,-3]],'#b39775');
      oval(ctx,0,-3,r*.55,1.2,'#8a785e');line(ctx,[[-r*.7,2],[r*.7,2]],'#8f7657');line(ctx,[[-r*.65,5],[r*.65,5]],'#8f7657');
    }else if(kind==='cloth'){
      const w=11+(prop.open??0)*20;
      polygon(ctx,[[0,-2],[w,-1],[w-1,9],[2,8]],'#8c9b98');
      for(let a=4;a<w;a+=4)line(ctx,[[a,-1],[a+1,8]],a%8?'#617b7c':'#c0bc9d',.45);
      line(ctx,[[1,2],[w,3]],'#b7b69c',.5);
    }else if(kind==='ledger'){
      polygon(ctx,[[-4,-3],[6,-5],[8,4],[-2,6]],'#c9b98f');
      line(ctx,[[0,-2],[5,-3],[6,-1],[1,0]],'#81745a',.45);line(ctx,[[1,2],[6,1]],'#81745a',.45);
    }else if(kind==='produce'){
      oval(ctx,2,5,9,2.5,'#a59671');
      for(const [a,b,c] of [[-4,1,'#8b8b60'],[1,0,'#afa06b'],[6,2,'#758467']])oval(ctx,a,b,3.5,3,c);
    }else{
      const w=kind==='bale'?15:10,h=kind==='bale'?11:7;
      polygon(ctx,[[-w/2,-h/2],[w/2-1,-h/2-1],[w/2+1,h/2],[-w/2+1,h/2+1]],kind==='bale'?'#b09b76':'#bdaf8a');
      line(ctx,[[-1,-h/2],[-1,h/2+1]],'#776b4d',.8);line(ctx,[[-w/2,0],[w/2+1,0]],'#776b4d',.8);
      if(kind==='bale')for(let a=-w/2+2;a<w/2;a+=2)line(ctx,[[a,-h/2+1],[a+1,h/2]],'#8e7c5d',.35);
    }
    ctx.restore();
  }
  function draw(ctx,frame,range,anchors){
    for(const prop of frame.props){
      if(prop.kind==='load'){
        const a=anchors.get(prop.from);if(!a)continue;
        const x=a.x+(prop.x-a.x)*prop.u,y=a.y+(prop.y-a.y)*prop.u;
        line(ctx,[[a.x,a.y],[x,y-6]],'#847355',.6);object(ctx,{kind:'bale'},x,y);continue;
      }
      if(prop.kind==='transfer'){
        const a=anchors.get(prop.from),b=anchors.get(prop.to);if(!a||!b)continue;
        object(ctx,{kind:prop.object},a.x+(b.x-a.x)*prop.u,a.y+(b.y-a.y)*prop.u);continue;
      }
      if(prop.x<range[0]-80||prop.x>range[1]+80)continue;
      if(prop.kind==='hoop'){
        ctx.save();ctx.translate(prop.x,prop.y);ctx.rotate(prop.angle);
        for(const r of [11.5,12.5]){ctx.beginPath();ctx.ellipse(0,0,r,r,0,0,Math.PI*2);ctx.strokeStyle='#7d6950';ctx.lineWidth=.65;ctx.stroke();}
        line(ctx,[[9,-7],[11,-5]],'#aa9470',1.2);ctx.restore();
        const side=Math.sign(prop.x-prop.childX)||1;
        line(ctx,[[prop.childX+side*6,window.ScrollWorld.streetY(prop.childX)-24],[prop.x-side*9,prop.y+6]],'#78654b',.7);
      }else if(prop.kind==='sparrows'){
        for(let i=0;i<3;i++){
          const x=prop.x+i*9+prop.flight*(36+i*11),y=prop.y-4-prop.flight*(30+i*9),wing=Math.sin(prop.t*17+i)*4*prop.flight;
          oval(ctx,x,y,2.5,1.6,'#8e8b70');oval(ctx,x+2,y-1,1.2,1.3,'#8e8b70');
          line(ctx,[[x-2,y],[x-5,y-3-wing],[x-7,y-2-wing]],'#6c6b56',.65);
        }
      }else if(prop.kind==='kiln'&&prop.heat>0){
        ctx.save();ctx.globalAlpha*=prop.heat*.3;
        for(let i=0;i<4;i++){const u=(frame.time*.22+i/4)%1;line(ctx,[[prop.x+Math.sin(u*6+i)*2,prop.y-u*20],[prop.x+3+Math.sin(u*8+i)*2,prop.y-7-u*20]],'#d8cbae',1.3);}
        ctx.restore();
      }
    }
    if(frame.cargoBasket&&frame.cargoBasket.x>range[0]-30&&frame.cargoBasket.x<range[1]+30){
      const p=frame.cargoBasket;object(ctx,{kind:'bale',amount:p.amount},p.x,p.y);
    }
  }
  function breeze(ctx,frame,range){
    // A few drifting leaves share the same breeze as the shop pennant.
    for(const [i,base] of [-1920,-520,1030,1760,2880,3670].entries()){
      if(base<range[0]-70||base>range[1]+70)continue;
      const t=(frame.time+i*7.3)%23;if(t>8)continue;
      const x=base+t*7+Math.sin(t*1.4+i)*6,y=350+t*15;
      if(y>479)continue;
      ctx.save();ctx.translate(x,y);ctx.rotate(frame.wind+t*.8);ctx.globalAlpha*=Math.min(1,t,8-t)*.65;
      polygon(ctx,[[-3,0],[0,-1.8],[3,0],[0,1.2]],'#8d8e63');ctx.restore();
    }
  }
  window.StreetDetails={object,draw,breeze};
})();
