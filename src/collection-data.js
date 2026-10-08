// V3.1 targets bind to the existing V2 population. No new residents are created.
export const categories=[['tea','茶市烟火'],['mill','作坊营生'],['bridge','桥上往来'],['quay','码头舟楫'],['city','城内城外']];
const definitions=[
 ['tea','添茶的茶博士',['tea-01'],'茶市西侧，茶客身旁的人正提着茶壶。','沿河茶市题签左上方，寻找背身提壶的人。','壶在手中，茶客在身旁。一壶新茶，续着街市里的闲话。'],
 ['tea','抱碗穿行的跑堂',['tea-06'],'茶市西侧，他把一摞碗抱在胸前。','留意茶市题签左侧，添茶人下方的蓝衣跑堂。','碗叠在怀里，脚步却没有停。桌席之间，总有人忙着照应。'],
 ['tea','举杯的老茶客',['tea-02'],'添茶人身旁，一位老者把杯子举到嘴边。','到茶市题签左上方，找坐着举杯的灰发茶客。','坐下来，喝口茶。来往脚步匆匆，他有自己的从容。'],
 ['tea','听故事的小圈子',['tea-07','tea-08','tea-09'],'茶市中段，一人挥扇，两人侧耳。','茶市题签正上方，留意拿扇的讲述者和身旁两位听众。','一把扇子展开故事，几位听客围在身旁。片刻闲暇也有滋味。'],
 ['tea','摊前递碗',['tea-13','tea-14'],'茶市东头，一碗食物与一枚钱相对。','茶市靠虹桥的一端，寻找端碗摊主与伸手的顾客。','摊主递出一碗热食，客人伸手付钱。寻常买卖，都是日子的温度。'],
 ['mill','倾袋卸粮的工人',['mill-01'],'作坊上方，他正弯身倒出粮袋。','水磨作坊北侧的小组中，留意倾斜的粮袋。','粮袋倾下，今日的忙碌从这里开始。'],
 ['mill','提笔登记的账房',['mill-13'],'作坊东侧，一位记账人低头提笔。','水磨右上方，几位送粮人身旁有一位账房。','来货一笔，交接一笔。院中的忙碌，被仔细记下。'],
 ['mill','坐饮的搬夫',['mill-26'],'作坊中间的路边，有人坐着喝水。','水磨院中南北通路上，寻找拿着葫芦歇脚的人。','放下肩上的活计，先喝一口水。歇息也是劳作的一部分。'],
 ['mill','作坊交接',['mill-05','mill-06','mill-07'],'作坊西侧，记账、开筐与接粮连成一组。','水磨题签上方，寻找账房、送粮农户与接粮帮工。','一人登记，一人打开粮筐，一人接取。院里的活计彼此衔接。'],
 ['mill','车旁搬运',['mill-09','mill-11','mill-12'],'作坊东南，搬粮的人与推车者挨在一起。','水磨题签右侧偏下，留意粮袋、搬运者和车夫。','人力与小车接力，把粮食送向下一处。'],
 ['bridge','凭栏看船的人',['bridge-05'],'虹桥东头，有人停下来看水。','虹桥最右端的小组里，寻找弯身看船的大人。','桥上脚步不停，他却停下来，把目光交给河上的船。'],
 ['bridge','背囊过桥的行人',['bridge-15'],'桥中央，一位行客把包袱背在身后。','虹桥中段，看船人右侧有一位背囊行客。','行囊随身，桥那头还有路要走。'],
 ['bridge','用力推车的人',['bridge-25'],'桥面西半段，双手向前，身体用力。','留意虹桥西半段靠前的通路，推车人的姿态与行客不同。','双手扶稳，身体前倾。一步一步，把车推过桥面。'],
 ['bridge','桥头相让',['bridge-02','bridge-03'],'虹桥西头，两位携物人侧身相让。','到虹桥左端，找提篮者和紧邻的携物人。','桥头来往密，一次侧身，给彼此让出一步。'],
 ['bridge','一起看船',['bridge-21','bridge-22'],'虹桥东半段，大人与孩子都朝向河面。','虹桥右半段偏下，寻找相邻的看船人和俯身孩子。','大人停步，孩子俯身。河面上的来往，把两道目光留住。'],
 ['quay','岸边盘绳的船夫',['quay-24'],'东岸货运处，有人低身收拢绳索。','东岸码头中段，接货小组右侧有人盘绳。','缆绳一圈圈收好，下一次靠岸才会妥帖。'],
 ['quay','船上摇橹的人',['boats-12'],'河心大船的下方，一位船工坐着摇橹。','虹桥下方的河心船上，顺着船身向南找。','一橹一橹，船与流水缓缓相应。'],
 ['quay','守着行囊的老者',['quay-17'],'东岸西端，老者坐在行李旁等候。','到东岸码头的西端，寻找提箱旅人旁的候船老者。','行李放在身边，等船也等一段新的路。'],
 ['quay','码头接货',['quay-21','quay-22'],'东岸中段，一人递包，一人俯身接取。','东岸码头中部，盘绳船夫左侧是两位接力的人。','一人递出，一人接住。货物在两个人的忙碌之间交接。'],
 ['quay','旅人与递水人',['quay-26','quay-29'],'东岸最东端，提箱旅人与持碗者相邻。','沿东岸向右找，旅人身边有人端着一碗水。','带着行李的人停下脚步，旁边有人端水而来。'],
 ['city','展布的摊主',['gate-01'],'城门货市北侧，一位摊主双手展布。','城门下方偏左的第一组摊贩里，寻找展开的布料。','布料在双手之间铺开，等来往的人细看。'],
 ['city','门边值守者',['gate-41'],'城门下方，持杖的人守着往来通路。','城门正下方的北端入口，一位门吏独自站立。','城门迎来送往，持杖的人留在路旁。'],
 ['city','院内扫地的僧人',['temple-04'],'塔院西侧，一把扫帚划过庭院。','到高塔西侧的小院，寻找弯身持帚的僧人。','一帚一帚，扫过院中的日常。山路的喧声留在门外。'],
 ['city','田间劳作',['fields-01','fields-02'],'西北田畴，一人收割，一人除草。','画卷最左上方的田地里，两位俯身劳作的人并肩。','低头收割，弯腰除草。田间的时辰，写在手上的活计里。'],
 ['city','布摊细看',['gate-11','gate-12','gate-13'],'城门货市中段，展布、看布与叠布连成一组。','城门下方中段，寻找布商、伸手买家和蹲着的伙计。','一人展开，一人细看，一人低头整理。摊前的买卖自有节奏。']
];
export const occlusionPolygons=[[[.444,.632],[.577,.632],[.578,.646],[.444,.646]],[[.308,.657],[.34,.657],[.34,.683],[.308,.685]],[[.349,.638],[.369,.636],[.369,.665],[.349,.668]]];
export function inPolygon(x,y,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
export function personBounds(p,W,H){return{x:p.position[0]*W-p.scale*.375,y:p.position[1]*H-p.scale*.92,w:p.scale*.75,h:p.scale};}
export function createTargets(people,W=2004,H=785){return definitions.map(([categoryId,title,ids,clue,hintText,description],i)=>{const members=ids.map(id=>people.find(p=>p.id===id));if(members.some(p=>!p))throw new Error(`Missing collection member: ${title}`);const rects=members.map(p=>personBounds(p,W,H)),left=Math.min(...rects.map(r=>r.x)),top=Math.min(...rects.map(r=>r.y)),right=Math.max(...rects.map(r=>r.x+r.w)),bottom=Math.max(...rects.map(r=>r.y+r.h));return{targetId:`life-${String(i+1).padStart(2,'0')}`,categoryId,title,sceneEntityIds:ids,members,targetType:ids.length===1?'人物':'群像',clue,hintText,description,contentVersion:1,focusBounds:{x:left,y:top,w:right-left,h:bottom-top},hintBounds:{x:(left+right)/2/W,y:(top+bottom)/2/H,w:.10,h:.17}};});}
export function sanitizeCollection(raw,targets){const ids=new Set(targets.map(t=>t.targetId)),source=raw&&typeof raw==='object'?raw:{};const found=[...new Set(Array.isArray(source.foundTargetIds)?source.foundTargetIds:[])].filter(id=>ids.has(id));const hints={},dates={};for(const id of ids){const h=source.hintUsageByTarget?.[id];if(h&&typeof h==='object')hints[id]={level:Math.max(0,Math.min(2,Number(h.level)||0)),count:Math.max(0,Math.min(1e6,Number(h.count)||0)),guided:h.guided===true};if(found.includes(id)&&typeof source.foundAtByTarget?.[id]==='string')dates[id]=source.foundAtByTarget[id];}return{saveSchemaVersion:1,foundTargetIds:found,foundAtByTarget:dates,hintUsageByTarget:hints,selectedTargetId:ids.has(source.selectedTargetId)?source.selectedTargetId:targets[0]?.targetId,completionSeen:found.length===targets.length&&source.completionSeen===true};}
export function recordFound(state,id,now=new Date().toISOString()){if(state.foundTargetIds.includes(id))return false;state.foundTargetIds.push(id);state.foundAtByTarget[id]=now;return true;}
export function collectionStats(state){const helped=state.foundTargetIds.filter(id=>{const h=state.hintUsageByTarget[id];return h&&(h.level>0||h.guided);}).length;return{found:state.foundTargetIds.length,helped,independent:state.foundTargetIds.length-helped};}
