export const FLOWERS=[
 {id:'peony',name:'粉牡丹',price:24,epithet:'重瓣叠香',description:'层层粉瓣舒展，深浅随光而变。挑一枝盛开的，配上一枚含苞的，插在圆腹瓶里最显丰盈。',detail:'看花瓣由外向内的层叠，也看看叶片与花朵的疏密。'},
 {id:'plum',name:'白梅枝',price:18,epithet:'疏枝横斜',description:'一段瘦枝，几点白花，花心藏着淡淡的红。留出枝条之间的空白，窄口瓶里便有一幅小景。',detail:'细看五片花瓣与细蕊，转一转枝向，试试不同的留白。'},
 {id:'orchid',name:'幽兰',price:22,epithet:'清雅有致',description:'细长的叶片舒展成弧，浅色小花隐在其间。让叶势自然垂下，案头便多了一分清静。',detail:'沿着叶片的弧线欣赏，看看小花与长叶怎样相互映衬。'}
];
export const FLOWER_KEY='qingming-flower-home-v1';
const valid=id=>FLOWERS.some(f=>f.id===id),integer=(n,max)=>Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
export function createFlowerState(raw){
 const slots=Array.from({length:3},(_,i)=>valid(raw?.slots?.[i])?raw.slots[i]:null);
 const bag=Object.fromEntries(FLOWERS.map(f=>[f.id,integer(raw?.bag?.[f.id],99-slots.filter(id=>id===f.id).length)]));
 const rotations=Array.from({length:3},(_,i)=>Number.isFinite(raw?.rotations?.[i])?Math.max(-24,Math.min(24,raw.rotations[i])):0);
 return{version:1,coins:raw?integer(raw.coins,120):120,bag,slots,rotations};
}
export function buyFlower(state,id){
 const flower=FLOWERS.find(f=>f.id===id);if(!flower)return false;
 if(state.coins<flower.price||state.bag[id]+state.slots.filter(v=>v===id).length>=99)return false;
 state.coins-=flower.price;state.bag[id]++;return true;
}
export function arrangeFlower(state,id,slot){
 if(!valid(id)||!Number.isInteger(slot)||slot<0||slot>2)return false;
 if(state.slots[slot]===id)return true;
 if(state.bag[id]>0)state.bag[id]--;
 else{const from=state.slots.indexOf(id);if(from===-1)return false;state.slots[from]=null;state.rotations[from]=0;}
 if(state.slots[slot])state.bag[state.slots[slot]]++;
 state.slots[slot]=id;state.rotations[slot]=0;return true;
}
export function removeFlower(state,slot){
 if(!Number.isInteger(slot)||slot<0||slot>2||!state.slots[slot])return false;
 state.bag[state.slots[slot]]++;state.slots[slot]=null;state.rotations[slot]=0;return true;
}
