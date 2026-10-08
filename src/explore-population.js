import {uniqueAssets,groundPlacements} from './population-v3-data.js?v=20261008-ground2';
import {residentScales} from './visitors-data.js?v=20261008-ground2';
export const regions = [
 {id:'mill',name:'水磨作坊',description:'卸粮、搬运、登记与歇脚，沿着作坊外院形成相接的生活片段。',point:[.21,.66],count:40,surface:'mill-yard',size:21,groups:[[.211,.59],[.21,.686],[.274,.73],[.267,.63],[.261,.775],[.254,.56]],flow:[[.206,.55],[.208,.65],[.20,.72],[.27,.765]]},
 {id:'tea',name:'沿河茶市',description:'茶客围坐、跑堂添茶、摊前递碗与听书，街道中间留出往来通道。',point:[.35,.675],count:65,surface:'tea-street',size:21,groups:[[.309,.708],[.356,.691],[.415,.637],[.269,.706],[.261,.758],[.288,.738],[.41,.728],[.27,.568]],flow:[[.251,.691],[.285,.711],[.312,.712],[.38,.692],[.423,.651]]},
 {id:'bridge',name:'虹桥往来',description:'桥头有交易，桥上有人赶路、推车和凭栏看船，双向人流避让而行。',point:[.513,.611],count:40,surface:'bridge-deck',size:19,groups:[[.432,.606],[.584,.606],[.47,.613],[.497,.617],[.537,.612],[.564,.622]],flow:[[.447,.627],[.477,.625],[.521,.625],[.576,.629]]},
 {id:'gate',name:'城门货市',description:'布摊前议价，店前理货，城门两侧有人值守，商旅沿中轴入城。',point:[.873,.655],count:60,surface:'gate-square',size:21,groups:[[.891,.604],[.925,.615],[.903,.66],[.914,.706],[.888,.749],[.92,.781],[.855,.77],[.765,.78]],flow:[[.913,.544],[.914,.589],[.896,.65],[.91,.725],[.918,.797]]},
 {id:'quay',name:'两岸码头',description:'岸边接货、盘绳、核对货物与候船，装卸点聚集，其他岸线留白。',point:[.813,.844],count:45,surface:'quay-stone',size:20,groups:[[.222,.795],[.315,.78],[.396,.769],[.758,.821],[.834,.832],[.942,.825]],flow:[[.632,.78],[.72,.811],[.81,.835],[.914,.833]]},
 {id:'boats',name:'河上行舟',description:'大船上整理货物，小舟上操桨，旅人留在可见甲板和敞开的篷口。',point:[.494,.769],count:30,surface:'boat-deck',size:14,groups:[[.212,.927],[.285,.842],[.401,.867],[.487,.774],[.48,.953],[.566,.884],[.694,.855],[.82,.907],[.963,.928]],flow:[[.082,.877],[.157,.865],[.433,.794]]},
 {id:'temple',name:'塔院山路',description:'扫地、提水、问路、院中小坐与登坡，人物沿庭院和山径疏落分布。',point:[.73,.233],count:20,surface:'temple-court',size:17,groups:[[.7005,.1516],[.704,.211],[.773,.178],[.759,.2614],[.6915,.292]],flow:[[.672,.185],[.675,.245],[.689,.291]]},
 {id:'fields',name:'田畴村舍',description:'收割、除草、递篮与村口交谈，田埂清楚，乡野保持疏朗。',point:[.14,.22],count:20,surface:'field-ground',size:18,groups:[[.041,.271],[.112,.332],[.14,.35],[.169,.29]],flow:[[.044,.418],[.135,.31]]}
];
export const roleActions={
 tea:[['茶博士','俯身添茶'],['老茶客','侧坐饮茶'],['年轻茶客','坐听交谈'],['讲述者','挥扇讲述'],['听书老者','侧耳听书'],['食摊主人','双手递碗'],['女顾客','递钱买食'],['跑堂','抱碗穿行']],
 mill:[['磨坊工人','倾袋卸粮'],['车夫','推车运粮'],['账房','提笔登记'],['送粮农户','打开粮筐'],['修磨匠','敲榫检修'],['磨坊帮工','接取粮粉'],['歇脚搬夫','坐饮葫芦水'],['抬运者','扶杠搬运']],
 bridge:[['远行客','背囊过桥'],['提篮人','回身避让'],['携物人','侧身让路'],['孩童','俯身看船'],['看船人','凭栏观水'],['推车人','用力上桥'],['糕饼贩','兜售糕饼'],['长者','拄杖缓行']],
 gate:[['布商','展布示客'],['买布人','伸手看布'],['伙计','蹲身叠布'],['商人','核对秤量'],['陶器买家','俯身看瓮'],['门吏','持杖值守'],['商旅','指路问询'],['菜摊伙计','整理菜筐']],
 quay:[['装卸工','侧身递包'],['接货工','俯身接货'],['货主','核对货簿'],['船夫','跪地盘绳'],['旅人','提箱登岸'],['候船老者','看守行囊'],['递水人','持碗送水'],['背货人','负箱弯行']],
 boats:[['撑篙人','撑篙操船'],['摇桨人','坐姿摇橹'],['掌舵人','回身掌舵'],['旅客','盘坐抱包'],['女旅人','跪坐望岸'],['系缆人','俯身打结'],['船工','拖拽货袋'],['老旅客','持杯闲谈']],
 temple:[['僧人','持帚扫地'],['院工','挑桶提水'],['老僧','举手指路'],['女访客','合手驻足'],['读书人','持礼到访'],['山路行人','背篓登坡'],['歇脚客','坐石休息'],['园丁','跪身修枝']],
 fields:[['农人','俯身收割'],['女农人','弯腰除草'],['扛锄人','负锄行走'],['村妇','递出菜篮'],['孩童','低头看篮'],['老农','蹲修农具'],['农夫','肩负禾束'],['母亲与幼儿','背儿行走']]
};
// Structured, relational arrangements; no random scattering over the image.
const formations={
 tea:[[[-15,1,0],[-2,5,1],[12,6,2],[-10,20,5],[6,24,6],[19,24,7]],[[-15,0,3],[-2,8,4],[12,6,2],[-12,22,1],[4,23,0],[20,22,7]],[[-14,0,5],[1,4,6],[15,1,7],[-13,23,3],[3,24,4],[18,22,2]]],
 mill:[[[-13,1,0],[1,8,3],[16,5,7],[29,8,1]],[[-12,1,2],[5,4,3],[17,8,5],[29,9,0]]],
 bridge:[[[-10,0,6],[5,3,1],[18,6,2],[29,2,7]],[[-12,0,4],[0,1,3],[12,1,0],[25,2,2]]],
 gate:[[[-14,1,0],[0,2,1],[14,6,2],[28,4,4],[38,12,7]],[[-14,1,3],[1,5,4],[16,3,6],[29,9,7],[39,1,1]]],
 quay:[[[-16,1,0],[-1,2,1],[14,8,2],[28,4,3],[38,9,6]],[[-16,1,4],[-2,3,5],[13,6,7],[27,2,6],[39,6,2]]],
 boats:[[[-10,0,0],[0,0,3],[10,0,6]]],
 temple:[[[-10,1,2],[3,3,4],[15,6,3]],[[-10,1,0],[3,7,1],[17,4,7]]],
 fields:[[[-14,0,0],[0,5,1],[14,7,3],[27,9,2]],[[-14,0,5],[0,5,4],[14,7,6],[27,9,7]]]
};
export function createPopulation(width=2004,height=785){
 const people=[];let n=0;
 for(const region of regions){let count=0;const add=(x,y,variant,groupId,extra={})=>{const [role,action]=roleActions[region.id][variant];people.push({id:`${region.id}-${String(++count).padStart(2,'0')}`,regionId:region.id,groupId,role,action,costumeVariant:`${region.id}-${variant}`,assetVariants:{low:`assets/explore/people-v2/${region.id}-low.webp`,high:`assets/explore/people-v2/${region.id}.webp`},sourceAsset:{directory:"art-source/people-v2",name:region.id,format:"png"},sprite:variant,position:[x,y],anchor:[.5,.92],scale:region.size*.92,facing:variant%3===0?'side':'three-quarter',surfaceId:region.surface,depthOrder:y,occlusionMaskId:region.id==='bridge'?'bridge-front-rail':region.id==='boats'?'boat-canopies':null,interaction:`${role}正在${action}。`,animation:null,accessibilityDescription:`${region.name}，${role}${action}`,members:region.id==='fields'&&variant===7?2:1,...extra});n++};
  region.groups.forEach((center,i)=>{const f=formations[region.id][i%formations[region.id].length];
   const decks=[[[.187,.926],[.23,.93],[.237,.931]],[[.278,.845],[.32,.85],[.326,.848]],[[.383,.867],[.421,.869],[.426,.868]],[[.488,.744],[.488,.756],[.488,.826]],[[.462,.914],[.491,.955],[.496,.962]],[[.553,.858],[.579,.91],[.585,.923]],[[.658,.845],[.711,.866],[.718,.872]],[[.795,.901],[.845,.912],[.859,.915]],[[.94,.899],[.976,.953],[.984,.961]]];
   f.forEach(([dx,dy,v],j)=>{const pos=region.id==='boats'?decks[i][j]:[center[0]+dx*(region.id==='temple'?0.9:region.id==='fields'?1:1.15)/width,center[1]+dy/height];add(...pos,region.id==='boats'?(i+j*3)%8:v,`${region.id}-scene-${i+1}`,region.id==='boats'?{surfaceId:`boat-${i+1}`,occlusionMaskId:`boat-${i+1}-canopy`}:{});});});
  // Guarantee all eight independently drawn role/action combinations occur in every region.
  const missing=[0,1,2,3,4,5,6,7].filter(v=>!people.some(p=>p.regionId===region.id&&p.sprite===v));
  const budget=region.count-people.filter(p=>p.regionId===region.id).reduce((sum,p)=>sum+p.members,0);
  for(let i=0;i<budget;i++){const path=region.flow,k=i%Math.max(1,path.length-1),a=path[k],b=path[Math.min(k+1,path.length-1)];const t=(Math.floor(i/(path.length-1))+.5)/Math.ceil(budget/(path.length-1));const v=missing[i]??((i*3+1)%8);const remaining=region.count-people.filter(p=>p.regionId===region.id).reduce((sum,p)=>sum+p.members,0);if(remaining<=0)break;add(region.id==='boats'?region.flow[i][0]:a[0]+(b[0]-a[0])*t,region.id==='boats'?region.flow[i][1]:a[1]+(b[1]-a[1])*t+(i%2?4:-4)/height,(region.id==='fields'&&v===7&&remaining<2)?2:v,`${region.id}-passing-${i+1}`)}
 }
 const originalCounts=new Map();for(const p of people)originalCounts.set(p.costumeVariant,(originalCounts.get(p.costumeVariant)||0)+1);
 for(const p of people){if(p.groupId.includes('-passing-')&&!['boats','fields'].includes(p.regionId)&&originalCounts.get(p.costumeVariant)>1){
 const i=Number(p.id.split('-').at(-1)),source=i%3===0?'quay':'bridge',v=source==='quay'?4:[0,1,2,7][i%4];const [role,action]=roleActions[source][v];
 p.role=role;p.action=action;p.sprite=v;p.assetRegion=source;p.assetVariants={low:`assets/explore/people-v2/${source}-low.webp`,high:`assets/explore/people-v2/${source}.webp`};p.sourceAsset={directory:'art-source/people-v2',name:source,format:'png'};p.interaction=`${role}正在${action}。`;p.accessibilityDescription=p.interaction;
 }}
 // Retain each authored action at least once after assigning itinerant passers.
 for(const r of regions){const missing=[0,1,2,3,4,5,6,7].filter(v=>!people.some(p=>p.sourceAsset.name===r.id&&p.sprite===v));const candidates=people.filter(p=>p.regionId===r.id&&p.groupId.includes('-passing-'));missing.forEach((v,i)=>{const p=candidates[i];if(!p)return;p.sprite=v;p.assetRegion=r.id;[p.role,p.action]=roleActions[r.id][v];p.sourceAsset={directory:'art-source/people-v2',name:r.id,format:'png'};p.assetVariants={low:`assets/explore/people-v2/${r.id}-low.webp`,high:`assets/explore/people-v2/${r.id}.webp`};p.interaction=`${p.role}正在${p.action}。`;p.accessibilityDescription=p.interaction;});}
 // Each actor gets a one-use drawing and a placement verified against the actual ground image.
 for(const p of people){Object.assign(p,uniqueAssets[p.id]||{},groundPlacements[p.id]);p.scale=residentScales[p.id]||p.scale;p.depthOrder=p.position[1];p.visualIdentity=`${p.assetVariants.high}#${p.sprite}`;}
 return people.sort((a,b)=>a.depthOrder-b.depthOrder);
}
