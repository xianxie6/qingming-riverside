import * as THREE from '../vendor/three.module.js';
import {ease} from './crossing-motion.js?v=13-soft';

// Values are each timber's actual assembly percentage, projected from its current 3D position.
export function createTraces(host,markers){
  const canvas=document.createElement('canvas');canvas.className='crossing-traces';canvas.setAttribute('aria-hidden','true');host.append(canvas);
  const ctx=canvas.getContext('2d'),point=new THREE.Vector3();let w=0,h=0,painted=false;
  function draw(camera,progress,time){
    const opacity=1-ease(.40,.64,progress);
    if(opacity<.001){if(painted)ctx.clearRect(0,0,w,h);painted=false;return;}
    const width=host.clientWidth,height=host.clientHeight,dpr=Math.min(devicePixelRatio,1.5);
    if(w!==width||h!==height){w=width;h=height;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
    ctx.clearRect(0,0,w,h);painted=true;
    const nodes=markers.map(m=>{point.copy(m.current).project(camera);return {x:(point.x*.5+.5)*w,y:(.5-point.y*.5)*h,z:point.z,value:Math.round(m.arrive*100)};}).filter(p=>p.z>-1&&p.z<1&&p.x>25&&p.x<w-25&&p.y>220&&p.y<h-160);
    ctx.save();ctx.globalAlpha=opacity;ctx.lineJoin='round';
    // Soft light remains attached to the bridge, rather than washing out the original painting.
    for(const p of nodes){const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,38);glow.addColorStop(0,'rgba(230,255,236,.68)');glow.addColorStop(.26,'rgba(198,244,224,.28)');glow.addColorStop(1,'rgba(198,244,224,0)');ctx.fillStyle=glow;ctx.fillRect(p.x-38,p.y-38,76,76);}
    ctx.strokeStyle='rgba(238,255,238,.7)';ctx.lineWidth=.7;ctx.shadowColor='#bfffe8';ctx.shadowBlur=9;
    ctx.beginPath();nodes.forEach((p,i)=>{if(i)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);});ctx.stroke();
    for(let i=0;i<nodes.length-2;i+=2){ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[i+2].x,nodes[i+2].y);ctx.stroke();}
    ctx.font=`500 ${w<600?12:14}px ui-monospace,Menlo,monospace`;ctx.textAlign='left';
    const boxes=[];
    for(const p of nodes){
      ctx.strokeStyle='#f2fff0';ctx.beginPath();ctx.moveTo(p.x-4,p.y);ctx.lineTo(p.x+4,p.y);ctx.moveTo(p.x,p.y-4);ctx.lineTo(p.x,p.y+4);ctx.stroke();
      if(boxes.some(b=>Math.abs(b.x-p.x)<42&&Math.abs(b.y-p.y)<26))continue;boxes.push(p);
      ctx.shadowColor='#173d31';ctx.shadowBlur=5;ctx.fillStyle='#f5fff4';ctx.fillText(String(p.value).padStart(2,'0'),p.x+8,p.y-11);
      ctx.shadowColor='#bfffe8';ctx.shadowBlur=9;
    }
    ctx.shadowBlur=0;ctx.fillStyle='#52675b';ctx.font='10px "Songti SC",serif';ctx.fillText('木构归位 · %',w<600?22:36,226);
    ctx.restore();
  }
  return {draw,dispose(){canvas.remove();}};
}
