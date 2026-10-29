import {FLOWERS,FLOWER_KEY,createFlowerState,buyFlower,arrangeFlower,removeFlower} from './extension-flower-state.js?v=flowers-3';
const ROOT='assets/extension-preview/workshop/';
const vaseNames=['青瓷圆腹瓶','白瓷长颈瓶','天青小瓶'];
const vaseX=[27.3,49.9,72.3],mouthY=[54.8,46.1,53.9];
export function createFlowerShop({fallbackFocus=()=>null,onOpen=()=>{},onClose=()=>{},getArt=id=>ROOT+id+'.webp',getArtMetrics=()=>({stemX:.5})}={}){
 let state,storage=true;try{const value=JSON.parse(localStorage.getItem(FLOWER_KEY)||'null');state=createFlowerState(value);}catch{state=createFlowerState();storage=false;}
 let mode='shop',selected='peony',vase=0,inspecting=false,zoom=1,message='',returnFocus;
 const dialog=document.createElement('dialog');dialog.id='flowerShop';dialog.className='flower-dialog';dialog.setAttribute('aria-labelledby','flowerTitle');
 document.body.append(dialog);
 const flower=()=>FLOWERS.find(f=>f.id===selected)||FLOWERS[0];
 const picture=id=>getArt(id);
 const save=()=>{try{localStorage.setItem(FLOWER_KEY,JSON.stringify(state));}catch{storage=false;message+=' 花案暂存在当前页面。';}};
 function render(){
  const f=flower();
  dialog.innerHTML=`<div class="flower-head"><div><span class="flower-kicker">一间花肆 · 一方花案</span><h2 id="flowerTitle">${inspecting?'细看一枝花':mode==='shop'?'汴京花肆':'我的花案'}</h2></div><div class="flower-head-tools"><button data-action="shop" aria-pressed="${mode==='shop'&&!inspecting}">花肆挑花</button><button data-action="home" aria-pressed="${mode==='home'&&!inspecting}">回家插花</button><button data-action="close" class="flower-close" aria-label="离开花肆，返回画卷">×</button></div></div>
   <div class="flower-content">${inspecting?inspectMarkup(f):mode==='shop'?shopMarkup(f):homeMarkup()}</div>
   <div class="flower-foot"><p id="flowerNotice" role="status" aria-live="polite">${message||(mode==='home'?'先选一只瓶，再点花材插入；也可以把花材拖到瓶中。':'女郎：花枝都在这里，慢慢挑，也可以只赏花。')}</p><span class="flower-purse" data-coins="${state.coins}">试游铜钱 <strong>${state.coins}</strong> 文</span></div>`;
  for(const el of dialog.querySelectorAll('[draggable=true]'))el.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',el.dataset.flower));
  for(const el of dialog.querySelectorAll('[data-vase]')){
   el.addEventListener('dragover',e=>e.preventDefault());
   el.addEventListener('drop',e=>{e.preventDefault();vase=Number(el.dataset.vase);place(e.dataTransfer.getData('text/plain'));});
  }
 }
 function shopMarkup(f){return`<div class="flower-shop-layout"><div class="flower-room"><img class="flower-room-art" src="${getArt("shop")}" alt="摆满花枝、瓷器、竹篮与花架的宋代花肆"><img class="flower-lady" src="${getArt("florist")}" alt="身着浅绿衣裙的插花女郎"><div class="flower-greeting">女郎正在理花<br><span>选一枝喜欢的，带回家慢慢看。</span></div></div><div class="flower-choice"><span class="flower-small">今日花材 · 随心选一枝</span><div class="flower-specimen"><img src="${picture(f.id)}" alt="${f.name}，点击下方细看花朵按钮可放大欣赏"></div><div class="flower-choice-heading"><h3>${f.name}</h3><span>${f.price} 文 / 枝</span></div><p class="flower-epithet">${f.epithet}</p><p>${f.description}</p><div class="flower-buy-row"><button id="buyFlower" class="flower-primary" data-action="buy" ${state.coins<f.price?'disabled':''}>买一枝 · ${f.price}文</button><button data-action="inspect">细看花朵</button></div><p class="flower-stock">行囊中 ${state.bag[f.id]} 枝${state.coins<f.price?' · 铜钱不足，仍可赏花':''}</p></div></div><div class="flower-catalog" role="group" aria-label="挑选花材">${FLOWERS.map(g=>`<button data-action="select" data-flower="${g.id}" aria-pressed="${selected===g.id}"><img src="${picture(g.id)}" alt=""><span><strong>${g.name}</strong><small>${g.epithet} · ${g.price}文</small></span></button>`).join('')}</div>`;}
 function homeMarkup(){return`<div class="flower-home-scene"><img class="flower-home-art" src="${getArt("home")}" alt="家中的木案，案上摆着三只空瓷瓶">${state.slots.map((id,i)=>id?`<img class="flower-arranged" data-slot-flower="${i}" src="${picture(id)}" alt="${vaseNames[i]}中的${FLOWERS.find(f=>f.id===id).name}" style="left:${vaseX[i]}%;top:${mouthY[i]+.45}%;height:${i===1?38:44}%;--stem:${getArtMetrics(id).stemX*100}%;--turn:${state.rotations[i]}deg">`:'').join('')}${vaseNames.map((name,i)=>`<button class="flower-vase-pick ${vase===i?'chosen':''}" data-action="vase" data-vase="${i}" style="left:${vaseX[i]}%;top:${mouthY[i]-3}%;height:${84-mouthY[i]}%" aria-label="选择${name}" aria-pressed="${vase===i}"><span>${name}</span></button>`).join('')}</div><div class="flower-arrange-tools"><span>正在布置：${vaseNames[vase]}</span><div><button data-action="turn-left" ${!state.slots[vase]?'disabled':''}>向左轻转</button><button data-action="turn-right" ${!state.slots[vase]?'disabled':''}>向右轻转</button><button data-action="remove" ${!state.slots[vase]?'disabled':''}>取出花枝</button><button data-action="inspect-home" ${!state.slots[vase]?'disabled':''}>欣赏这枝花</button></div></div><div class="flower-bag" role="group" aria-label="带回家的花材">${FLOWERS.map(g=>{const available=state.bag[g.id]>0||state.slots.includes(g.id);return`<button draggable="${available}" data-action="place" data-flower="${g.id}" ${!available?'disabled':''}><img src="${picture(g.id)}" alt=""><span><strong>${g.name}</strong><small>${state.bag[g.id]} 枝待插${state.slots.includes(g.id)?' · 已入瓶':''}</small></span><em>${available?'插入此瓶':'尚未买入'}</em></button>`;}).join('')}</div>`;}
 function inspectMarkup(f){return`<div class="flower-inspect-layout"><div class="flower-inspect-art" aria-label="花朵细节"><img src="${picture(f.id)}" alt="${f.name}花瓣与枝叶细节" style="transform:scale(${zoom})"></div><div class="flower-inspect-copy"><span class="flower-small">赏花 · ${f.epithet}</span><h3>${f.name}</h3><p>${f.description}</p><p>${f.detail}</p><div class="flower-zoom"><button data-action="zoom-out" aria-label="缩小花朵">−</button><span>${zoom.toFixed(1)}×</span><button data-action="zoom-in" aria-label="放大花朵">＋</button></div><button data-action="back">返回${mode==='home'?'花案':'花肆'}</button></div></div>`;}
 function place(id){if(arrangeFlower(state,id,vase)){selected=id;message=`${vaseNames[vase]}已插入${flower().name}。`;save();render();}}
 dialog.addEventListener('click',e=>{
  const button=e.target.closest('button[data-action]');if(!button||button.disabled)return;
  const action=button.dataset.action;
  if(action==='close'){dialog.close();return;}
  message='';
  if(action==='shop'||action==='home'){mode=action;inspecting=false;}
  if(action==='select')selected=button.dataset.flower;
  if(action==='buy'&&buyFlower(state,selected)){message=`${flower().name}已包好，带回家选一只瓶插上吧。`;save();}
  if(action==='vase')vase=Number(button.dataset.vase);
  if(action==='place'){place(button.dataset.flower);return;}
  if(action==='remove'){removeFlower(state,vase);message='花枝已收回行囊，可以重新搭配。';save();}
  if(action==='turn-left'||action==='turn-right'){state.rotations[vase]=Math.max(-24,Math.min(24,state.rotations[vase]+(action==='turn-left'?-8:8)));save();}
  if(action==='inspect'||action==='inspect-home'){if(action==='inspect-home')selected=state.slots[vase];inspecting=true;zoom=1;}
  if(action==='zoom-in')zoom=Math.min(2.6,zoom+.3);
  if(action==='zoom-out')zoom=Math.max(1,zoom-.3);
  if(action==='back')inspecting=false;
  render();
  if(['shop','home','inspect','inspect-home','back'].includes(action))dialog.scrollTop=0;
  // Keep keyboard activation on the corresponding control after a small update.
  const next=action==='select'?dialog.querySelector(`[data-action="select"][data-flower="${selected}"]`):dialog.querySelector(`[data-action="${action}"]`);next?.focus({preventScroll:true});
 });
 // Safari does not focus a clicked button, so focus may have been on the page itself.
 dialog.addEventListener('close',()=>{onClose();(returnFocus&&returnFocus!==document.body?returnFocus:fallbackFocus())?.focus({preventScroll:true});});
 let outside=false;
 dialog.addEventListener('pointerdown',e=>{outside=e.target===dialog;});
 dialog.addEventListener('pointerup',e=>{if(outside&&e.target===dialog)dialog.close();outside=false;});
 return{open(next='shop'){mode=next;inspecting=false;message=storage?'':'花案暂存在当前页面。';returnFocus=document.activeElement;onOpen();render();if(!dialog.open)dialog.showModal();},get state(){return state;},get isOpen(){return dialog.open;}};
}
