(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ScrollWorkshop=api;
})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  // Landmarks belong to this generated atlas, not to the old bent worker.
  const rows=[
    {season:'spring',top:0,bottom:420,heads:[39,45],hands:[[[370,31],[349,64]],[[730,104],[724,158]]]},
    {season:'autumn',top:420,bottom:823,heads:[440,450],hands:[[[371,443],[349,476]],[[730,508],[725,564]]]},
    {season:'winter',top:823,bottom:1254,heads:[844,852],hands:[[[369,841],[349,872]],[[731,918],[731,966]]]}
  ];
  const roles=['hang-cloth','arrange-frame'];
  class Artists{
    constructor(){
      this.sprites=new Map();const image=new Image();
      this.ready=new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>reject(new Error('布坊人物素材载入超时')),25000);
        image.onload=()=>{clearTimeout(timer);try{this.prepare(image);resolve();}catch(error){reject(error);}};
        image.onerror=()=>{clearTimeout(timer);reject(new Error('布坊人物素材载入失败'));};
      });
      this.ready.catch(()=>{});
      image.src='assets/seasons/workshop-actors-v1.webp';
    }
    prepare(image){
      if(image.naturalWidth!==1254||image.naturalHeight!==1254)throw new Error('布坊人物图集尺寸不正确');
      const atlas=document.createElement('canvas');atlas.width=atlas.height=1254;
      const c=atlas.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);
      const pixels=c.getImageData(0,0,1254,1254).data;
      for(const row of rows)for(let column=0;column<2;column++){
        let left=1254,right=0,top=1254,bottom=0;
        for(let y=row.top;y<row.bottom;y++)for(let x=column*627;x<(column+1)*627;x++)if(pixels[(y*1254+x)*4+3]>96){
          left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
        }
        // Padding preserves translucent ink edges, fingertips and shoe tips.
        left-=3;top=Math.max(row.top,top-3);right+=4;bottom=Math.min(row.bottom,bottom+4);
        const texture=document.createElement('canvas');texture.width=right-left;texture.height=bottom-top;
        const ctx=texture.getContext('2d',{willReadFrequently:true});ctx.drawImage(atlas,left,top,texture.width,texture.height,0,0,texture.width,texture.height);
        const frame={x:0,y:0,w:texture.width,h:texture.height};
        const contacts=window.ScrollMovement.footContacts(ctx.getImageData(0,0,frame.w,frame.h).data,frame.w,frame.h);
        const sole=top+Math.max(...contacts.map(p=>p.y));
        const grips=row.hands[column].map(([x,y])=>[(x-left)/frame.w,(y-top)/frame.h]);
        this.sprites.set(`${row.season}:${roles[column]}`,{texture,frame,contacts,grips,direction:-1,workshop:roles[column],heightScale:frame.h/(sole-row.heads[column])});
      }
    }
    get(role,season){return this.sprites.get(`${season==='summer'?'spring':season}:${role}`);}
  }
  function drawProp(ctx,art,rig){
    const movement=window.ScrollMovement,points=art.grips.map(uv=>movement.deform(...uv,rig));
    const rest=art.grips.map(uv=>movement.deform(...uv,{...rig,pose:{}}));
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round';
    if(art.workshop==='hang-cloth'){
      const [hand,support]=points,railY=rest[0][1]-3;
      const left=hand[0]-6,right=hand[0]+11,top=hand[1]-.8,hem=top+38;
      // A fixed short hanging bar; only the loose linen rises with the hands.
      ctx.strokeStyle='#605439';ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(rest[0][0]-10,railY);ctx.lineTo(rest[0][0]+15,railY);ctx.stroke();
      ctx.strokeStyle='#a18a5e';ctx.lineWidth=.65;ctx.stroke();
      ctx.beginPath();ctx.moveTo(left,top+2);ctx.quadraticCurveTo(hand[0],top-1,right,top);
      ctx.lineTo(right-.5,hem);ctx.quadraticCurveTo(left+8,hem+2,left+1,hem-.6);ctx.closePath();
      ctx.fillStyle='#cdbb96';ctx.fill();ctx.strokeStyle='#807356';ctx.lineWidth=.45;ctx.stroke();
      ctx.strokeStyle='#a28e69';ctx.lineWidth=.35;
      for(let i=1;i<6;i++){const x=left+i*(right-left)/6;ctx.beginPath();ctx.moveTo(x,top+1);ctx.bezierCurveTo(x-1,top+10,x+Math.sin(i)*1.3,hem-12,x-.4,hem);ctx.stroke();}
      ctx.strokeStyle='#e2d2ae';ctx.beginPath();ctx.moveTo(support[0],support[1]);ctx.quadraticCurveTo(left+5,top+14,left+4,hem-1);ctx.stroke();
    }else{
      const [upper,lower]=points,[a,b]=rest;
      const left=(upper[0]+lower[0])/2,top=upper[1]-3,width=21,height=29;
      // The rack stays grounded while its removable frame is straightened.
      ctx.strokeStyle='#635237';ctx.lineWidth=1.5;
      for(const x of [a[0]-1,a[0]+width+1]){ctx.beginPath();ctx.moveTo(x,Math.min(a[1],b[1])-7);ctx.lineTo(x,0);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(a[0]-2,-12);ctx.lineTo(a[0]+width+2,-12);ctx.stroke();
      ctx.translate(left+width/2,top+height);ctx.rotate((rig.pose.frameTilt||0));
      ctx.strokeStyle='#8b7149';ctx.lineWidth=1.5;ctx.strokeRect(-width/2,-height,width,height);
      ctx.strokeStyle='#c1a277';ctx.lineWidth=.55;ctx.strokeRect(-width/2+.2,-height+.2,width-.4,height-.4);
      ctx.strokeStyle='#ab9b78';ctx.lineWidth=.3;
      for(let i=1;i<9;i++){const x=-width/2+i*width/9;ctx.beginPath();ctx.moveTo(x,-height+1);ctx.lineTo(x,-1);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(-width/2,-height*.52);ctx.lineTo(width/2,-height*.52);ctx.stroke();
    }
    ctx.restore();
  }
  return {Artists,rows,roles,drawProp};
});
