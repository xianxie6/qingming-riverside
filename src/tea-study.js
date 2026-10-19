import {buildTeaStudyActors,teaStudyAtlas,teaStudyScene} from './tea-study-actors.js?v=original-v3';
// A complete-scene art study. The main map and its collection coordinates stay intact.
export function initTeaStudy() {
 const trigger=document.createElement('button');
 trigger.id='teaStudy';trigger.textContent='茶摊新画法';trigger.setAttribute('aria-haspopup','dialog');
 document.querySelector('.settings').prepend(trigger);
 const dialog=document.createElement('dialog');dialog.className='tea-study';
 dialog.setAttribute('aria-labelledby','tea-study-title');
 dialog.innerHTML=`<header class="study-heading"><div><small>沿河茶市 · 局部试作</small><h2 id="tea-study-title">让人住进画里</h2></div><button class="study-close" aria-label="关闭茶摊对比">返回画卷 <span aria-hidden="true">×</span></button></header>
 <div class="study-toolbar"><div class="study-modes" role="group" aria-label="画面对比"><button data-mode="before" aria-pressed="false">修改前</button><button data-mode="compare" aria-pressed="false">左右对比</button><button data-mode="after" aria-pressed="true">修改后</button></div><p>滚轮 / 双指放大 · 拖动细看</p><div class="study-zoom"><button data-zoom="out" aria-label="缩小样板">−</button><output aria-label="样板放大倍数">1.0×</output><button data-zoom="in" aria-label="放大样板">＋</button><button data-zoom="detail">茶桌近看</button><button data-zoom="fit">适合窗口</button></div></div>
 <div class="study-viewport" tabindex="0" aria-label="茶摊对比画面，可拖动，滚轮缩放；方向键移动，加减键缩放，Home复位"><div class="study-art"><div class="study-after-layer"><img class="study-after" src="${teaStudyScene}" alt="淡彩水墨茶市，保留原有人物的衣纹与细节，按桌椅和柜台重新调整比例" draggable="false"><div class="study-original-actors"></div></div><img class="study-before" src="assets/explore/fusion-tea/before.webp" alt="修改前，独立人物图块叠放在茶市场景上" draggable="false"><div class="study-divider"></div></div><span class="study-badge study-badge-before">修改前</span><span class="study-badge study-badge-after">修改后</span><p class="study-loading" role="status">正在展开茶市…</p></div>
 <footer class="study-footer"><p>围桌饮茶 · 听书闲坐 · 摊前递碗<span>保留原有人物 · 调整比例、场景与遮挡。</span></p><label class="study-slider" hidden>拖动分界<input type="range" min="0" max="100" value="50" aria-label="修改前画面所占比例"></label><button class="study-retry" hidden>重新加载画面</button></footer>`;
 document.body.append(dialog);
 buildTeaStudyActors(dialog.querySelector('.study-original-actors'));
 const atlasImage=new Image();atlasImage.src=teaStudyAtlas;
 const viewport=dialog.querySelector('.study-viewport'),art=dialog.querySelector('.study-art'),range=dialog.querySelector('input'),status=dialog.querySelector('.study-loading'),retry=dialog.querySelector('.study-retry');
 const images=[...art.querySelectorAll('img'),atlasImage],pointers=new Map();
 let scale=1,fit=1,x=0,y=0,mode='after',drag=null,pinch=null,returnFocus;
 const W=1120,H=800;
 function paint(){const vw=viewport.clientWidth,vh=viewport.clientHeight;
  x=W*scale<=vw?(vw-W*scale)/2:Math.max(vw-W*scale,Math.min(0,x));
  y=H*scale<=vh?(vh-H*scale)/2:Math.max(vh-H*scale,Math.min(0,y));
  art.style.zoom=scale;art.style.transform=`translate(${x/scale}px,${y/scale}px)`;
  dialog.querySelector('output').value=(scale/fit).toFixed(1)+'×';
 }
 function reset(initial=false){fit=Math.min(viewport.clientWidth/W,viewport.clientHeight/H);scale=fit;x=0;y=0;if(initial&&viewport.clientWidth<700){scale=fit*2;x=viewport.clientWidth/2-W*scale*.3;y=viewport.clientHeight/2-H*scale*.5;}paint();}
 function zoom(factor,cx=viewport.clientWidth/2,cy=viewport.clientHeight/2){const next=Math.max(fit,Math.min(fit*4,scale*factor));x=cx-(cx-x)*next/scale;y=cy-(cy-y)*next/scale;scale=next;paint();}
 function setMode(value){mode=value;dialog.dataset.mode=mode;dialog.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));dialog.querySelector('.study-slider').hidden=mode!=='compare';}
 async function checkImages(){status.hidden=false;retry.hidden=true;status.textContent='正在展开茶市…';try{await Promise.all(images.map(im=>im.decode()));status.hidden=true;}catch{status.textContent='画面暂未加载成功，请重试。';retry.hidden=false;}}
 retry.onclick=()=>{images.forEach(im=>{const url=new URL(im.src);url.searchParams.set('retry',Date.now());im.src=url.href;});dialog.querySelectorAll(".study-original-actor").forEach(el=>el.style.backgroundImage=`url("${atlasImage.src}")`);checkImages();};
 function open(){if(dialog.open)return;returnFocus=document.activeElement;dialog.showModal();reset(true);checkImages();}
 trigger.onclick=open;dialog.querySelector('.study-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{pointers.clear();drag=null;pinch=null;(returnFocus?.isConnected?returnFocus:trigger).focus();});
 dialog.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
 dialog.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>{if(b.dataset.zoom==='fit')reset();else if(b.dataset.zoom==='detail'){scale=fit*2.8;x=viewport.clientWidth/2-230*scale;y=viewport.clientHeight/2-360*scale;paint();}else zoom(b.dataset.zoom==='in'?1.35:1/1.35);});
 range.oninput=()=>art.style.setProperty('--split',range.value+'%');
 viewport.addEventListener('wheel',e=>{e.preventDefault();const b=viewport.getBoundingClientRect();zoom(Math.exp(-e.deltaY*.0015),e.clientX-b.left,e.clientY-b.top);},{passive:false});
 viewport.addEventListener('pointerdown',e=>{if(e.button>0)return;viewport.focus({preventScroll:true});viewport.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);drag=[e.clientX,e.clientY];pinch=null;});
 viewport.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===2){const [a,b]=[...pointers.values()],mid=[(a[0]+b[0])/2,(a[1]+b[1])/2],distance=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch){x+=mid[0]-pinch.mid[0];y+=mid[1]-pinch.mid[1];const box=viewport.getBoundingClientRect();zoom(distance/Math.max(1,pinch.distance),mid[0]-box.left,mid[1]-box.top);}pinch={mid,distance};}else if(pointers.size===1&&drag){x+=e.clientX-drag[0];y+=e.clientY-drag[1];paint();}drag=[e.clientX,e.clientY];});
 function end(e){pointers.delete(e.pointerId);drag=pointers.size?[...pointers.values()][0]:null;pinch=null;}
 viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);viewport.addEventListener('lostpointercapture',end);
 viewport.addEventListener('keydown',e=>{const d={ArrowLeft:[60,0],ArrowRight:[-60,0],ArrowUp:[0,60],ArrowDown:[0,-60]}[e.key];if(d){e.preventDefault();x+=d[0];y+=d[1];paint();}else if(['+','=','-','Home'].includes(e.key)){e.preventDefault();e.key==='Home'?reset():zoom(e.key==='-'?1/1.35:1.35);}});
 new ResizeObserver(()=>{if(dialog.open)reset(true);}).observe(viewport);
 setMode('after');
 if(new URLSearchParams(location.search).get('study')==='tea')open();
}
