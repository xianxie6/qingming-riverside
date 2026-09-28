(() => {
  class Guests {
    static layoutMeal(container,table,project){
      const hall=table==='hall',scale=project([1,0])[0]-project([0,0])[0];
      const items=[...container.children],rows=Math.ceil(items.length/3);
      items.forEach((img,i)=>{
        const row=Math.floor(i/3),inRow=Math.min(3,items.length-row*3),col=i%3;
        const x=(hall?.543:.283)+(col-(inRow-1)/2)*(hall?.042:.033);
        const y=(hall?.605:.583)-(rows-1-row)*.009;
        const [px,py]=project([x,y]);
        Object.assign(img.style,{left:`${px}px`,top:`${py}px`,width:`${scale*(hall?.033:.028)}px`,height:`${scale*.022}px`,zIndex:String(row)});
      });
    }
    constructor(world,project,dishes){
      this.project=project;this.world=world;this.token=0;this.started=false;
      this.meal=document.createElement('div');this.meal.className='guest-banquet';this.meal.hidden=true;this.meal.setAttribute('aria-label','游客桌上的九道酒食');world.append(this.meal);
      this.meal.innerHTML=dishes.map(d=>`<img src="${d.image}" alt="${d.name}" draggable="false">`).join('');
      this.queue=document.createElement('canvas');this.queue.className='waiting-guests';this.queue.hidden=true;this.queue.setAttribute('role','img');this.queue.setAttribute('aria-label','三位不同年龄的游客坐在门旁长凳上，吃着小食等位');world.append(this.queue);
      this.queueNumbers=[68,67,66].map((number,i)=>{
        const badge=document.createElement('canvas');badge.className='queue-number';badge.hidden=true;badge.width=48;badge.height=30;badge.setAttribute('role','img');badge.setAttribute('aria-label',`等位 ${number} 号`);badge.style.animationDelay=`${-i*1.1}s`;
        const digits={6:['01110','10000','10000','11110','10001','10001','01110'],7:['11111','00001','00010','00100','01000','01000','01000'],8:['01110','10001','10001','01110','10001','10001','01110']},c=badge.getContext('2d');
        c.fillStyle='#563a2b';c.beginPath();c.roundRect(.5,.5,47,29,5);c.fill();
        c.strokeStyle='#e2bc79';c.lineWidth=1.2;c.stroke();c.fillStyle='#ffdf9c';
        [...String(number)].forEach((digit,k)=>digits[digit].forEach((row,y)=>[...row].forEach((bit,x)=>{if(bit==='1'){c.beginPath();c.arc(3+k*24+x*4,3+y*4,1.5,0,Math.PI*2);c.fill();}})));
        world.append(badge);return badge;
      });
      this.queueRenderer=Object.create(window.Inhabitants.prototype);
      this.queueTicket=document.createElement('div');this.queueTicket.className='speech-bubble queue-ticket';this.queueTicket.textContent='等位区';this.queueTicket.hidden=true;world.append(this.queueTicket);
      const queueArt=new Image();queueArt.onload=()=>{
        const canvas=this.queue,c=canvas.getContext('2d');canvas.width=queueArt.naturalWidth;canvas.height=queueArt.naturalHeight;c.drawImage(queueArt,0,0);
        const {data}=c.getImageData(0,0,canvas.width,canvas.height);let l=canvas.width,r=0,t=canvas.height,b=0;
        for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(data[(y*canvas.width+x)*4+3]>96){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
        this.queueTexture=document.createElement('canvas');this.queueTexture.width=r-l+1;this.queueTexture.height=b-t+1;this.queueTexture.getContext('2d').drawImage(queueArt,l,t,r-l+1,b-t+1,0,0,r-l+1,b-t+1);this.queueReady=true;this.positionMeal();
        if(this.started&&this.people.every(p=>p.blend===1))this.showQueue();
      };queueArt.src='assets/waiting-guests-v1.webp';
      this.people=['scholar','traveler'].map((name,i)=>{
        const canvas=document.createElement('canvas');canvas.className='dining-guest';canvas.hidden=true;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',i?'藕衣女游客':'青衫书生');world.append(canvas);
        const person={canvas,i,x:.13,y:.8,seated:0,blend:0,phase:0,frames:[]};
        person.ready=new Promise(resolve=>{
          const image=new Image();image.onload=()=>{
            const w=Math.floor(image.naturalWidth/2),h=image.naturalHeight;
            for(let cell=0;cell<2;cell++){
              const tmp=document.createElement('canvas');tmp.width=w;tmp.height=h;const c=tmp.getContext('2d');c.drawImage(image,-cell*w,0);
              const data=c.getImageData(0,0,w,h).data;let l=w,r=0,t=h,b=0;
              for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>96){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
              const frame=document.createElement('canvas');frame.width=r-l+1;frame.height=b-t+1;frame.getContext('2d').drawImage(tmp,l,t,frame.width,frame.height,0,0,frame.width,frame.height);person.frames.push(frame);
            }resolve(true);
          };image.onerror=()=>resolve(false);image.src=`assets/guest-${name}-v2.webp`;
        });return person;
      });
    }
    draw(p){
      if(!p.frames.length)return;
      const [x,y]=this.project([p.x,p.y]),height=this.project([0,.265])[1]-this.project([0,0])[1];
      Object.assign(p.canvas.style,{left:`${x}px`,top:`${y}px`,width:`${height}px`,height:`${height+12}px`});
      const ratio=Math.min(3,devicePixelRatio||2),size=Math.ceil(height*ratio),pixelHeight=Math.ceil((height+12)*ratio);
      if(p.canvas.width!==size)p.canvas.width=size;
      if(p.canvas.height!==pixelHeight)p.canvas.height=pixelHeight;
      const c=p.canvas.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,p.canvas.width,p.canvas.height);
      c.setTransform(ratio,0,0,ratio,0,0);c.imageSmoothingQuality='high';
      c.translate(height/2,height+10);
      const bob=p.seated?Math.sin(p.phase)*.65:Math.abs(Math.sin(p.phase))*1.8;
      c.rotate(Math.sin(p.phase)*(p.seated?.002:.009));
      for(let i=0;i<2;i++){
        const alpha=i?p.blend:1-p.blend;if(alpha<=0)continue;
        const frame=p.frames[i],fh=i?height*.74:height,fw=fh*frame.width/frame.height;
        c.save();c.globalAlpha=alpha;if(i&&p.i===1)c.scale(-1,1);c.drawImage(frame,-fw/2,-fh-bob,fw,fh);c.restore();
      }
    }
    showQueue(){this.queue.hidden=false;this.queueTicket.hidden=false;this.queueNumbers.forEach(b=>b.hidden=false);}
    drawQueue(now=0){
      if(!this.queueTexture)return;
      const canvas=this.queue,texture=this.queueTexture,c=canvas.getContext('2d');
      c.clearRect(0,0,canvas.width,canvas.height);
      if(!now||matchMedia('(prefers-reduced-motion: reduce)').matches){c.drawImage(texture,0,0,canvas.width,canvas.height);return;}
      // Local upper-body deformation leaves the bench and feet anchored.
      const cols=16,rows=26,vertices=[];
      for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
        const u=x/cols,v=y/rows;let dx=0,dy=0;
        [[.21,.18,.23,.30],[.48,.28,.22,.32],[.8,.40,.25,.34]].forEach(([cx,cy,rx,ry],i)=>{
          const distance=((u-cx)/rx)**2+((v-cy)/ry)**2,weight=Math.max(0,1-distance)**2,phase=now/(780+i*190)+i*2.1;
          dx+=Math.sin(phase)*weight*.007;dy+=Math.sin(phase*.83)*weight*.004;
        });
        vertices.push({source:[u*texture.width,v*texture.height],target:[(u+dx)*canvas.width,(v+dy)*canvas.height]});
      }
      for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
        const a=y*(cols+1)+x,b=a+1,d=a+cols+1,e=d+1;
        this.queueRenderer.cell(c,texture,vertices[a],vertices[b],vertices[d],vertices[e]);
      }
    }
    positionMeal(){
      const [qx,qy]=this.project([.09,.815]),qh=this.project([0,.28])[1]-this.project([0,0])[1];
      const qw=qh*(this.queueTexture?this.queueTexture.width/this.queueTexture.height:2/3);
      Object.assign(this.queue.style,{left:`${qx}px`,top:`${qy}px`,height:`${qh}px`,width:`${qw}px`});
      this.queue.width=Math.ceil(qw*2);this.queue.height=Math.ceil(qh*2);this.drawQueue();
      this.queueNumbers.forEach((badge,i)=>{const [u,v]=[[.20,-.035],[.47,.07],[.79,.18]][i];Object.assign(badge.style,{left:`${qx-qw/2+qw*u}px`,top:`${qy-qh+qh*v}px`,width:`${Math.max(34,qh*.22)}px`});});
      const [ticketX,ticketY]=this.project([.09,.47]);Object.assign(this.queueTicket.style,{left:`${ticketX}px`,top:`${ticketY}px`});
      if(!this.table)return;
      Guests.layoutMeal(this.meal,this.table,this.project);
    }
    position(){this.people.forEach(p=>{if(!p.canvas.hidden)this.draw(p);});this.positionMeal();}
    reset(){this.token++;this.started=false;this.meal.hidden=true;this.queue.hidden=true;this.queueTicket.hidden=true;this.queueNumbers.forEach(b=>b.hidden=true);cancelAnimationFrame(this.frame);this.people.forEach(p=>{p.canvas.hidden=true;p.seated=0;p.blend=0;});}
    async enter(mainSeat){
      if(this.started)return;this.started=true;const token=++this.token;
      const ready=await Promise.all(this.people.map(p=>p.ready));if(token!==this.token||ready.some(x=>!x))return;
      const table=mainSeat==='window'?'hall':'window';
      this.table=table;this.positionMeal();
      const destinations=table==='window'?[[.225,.727],[.36,.715]]:[[.465,.715],[.65,.72]];
      const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
      const start=performance.now();
      const tick=now=>{
        if(token!==this.token)return;
        if(document.hidden){this.frame=requestAnimationFrame(tick);return;}
        this.people.forEach((p,i)=>{
          const elapsed=now-start-i*850;if(elapsed<0&&!reduced)return;
          p.canvas.hidden=false;const target=destinations[i],duration=table==='window'?3800+i*900:6500+i*900;
          const t=reduced?1:Math.min(1,Math.max(0,elapsed/duration));
          const ease=t*t*(3-2*t);p.x=.135+(target[0]-.135)*ease;p.y=.8+(target[1]-.8)*ease;
          p.seated=t===1;p.blend=reduced?1:Math.min(1,Math.max(0,(elapsed-duration)/400));p.phase=elapsed/(p.seated?800:170);this.draw(p);
        });
        if(this.people.every(p=>p.blend===1)){this.meal.hidden=false;if(this.queueReady)this.showQueue();}
        if(!this.queue.hidden&&(!this.queueLastFrame||now-this.queueLastFrame>40)){this.drawQueue(reduced?0:now);this.queueLastFrame=now;}
        if(!reduced)this.frame=requestAnimationFrame(tick);
      };this.frame=requestAnimationFrame(tick);
    }
  }
  window.SunyangGuests=Guests;
})();
