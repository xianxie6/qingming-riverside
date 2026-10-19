// Prepare reference crops and image_gen prompt JSONs for every street-extension
// figure that has no drawn key-pose sheet yet.
// Usage: node scripts/prepare-limited-animation-batch.mjs [--batch 5] [--force]
// Writes art-source/street-extension/limited-animation/<id>-reference.png,
// <id>-<action>-v1.json and batch-<n>-index.md. Existing files are kept unless --force.
import sharp from 'sharp';
import {writeFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {population} from '../src/extension-people-data.js';
import {LIMITED} from '../src/extension-limited-animation.js';
import {motionProfile} from '../src/extension-motion.js';
import {planWalk} from '../src/extension-walkers.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const OUT='art-source/street-extension/limited-animation';
const args=process.argv.slice(2),force=args.includes('--force');
const batch=args.includes('--batch')?args[args.indexOf('--batch')+1]:'5';
// Figures redrawn by other means: the flower street cast, the two flower
// customers (visitors-47), the warehouse porter (mill-15) and the florist.
const HANDLED=new Set(['tea-15','tea-16','tea-17','tea-18','tea-19','bridge-34','bridge-35',
 'visitors-46','visitors-47','visitors-48','visitors-49','visitors-50','mill-15','bridge-33']);
const exists=f=>access(f).then(()=>true,()=>false);

// Finished sheets of other people that fix camera angle, scale and cell layout.
const LAYOUT={
 work:`${OUT}/fields-03-basket-v1.png`,
 workPair:`${OUT}/visitors-01-point-v1.png`,
 walk:`${OUT}/bridge-23-walk-v1.png`,
 walkPair:`${OUT}/visitors-04-walk-v1.png`,
 // Deep-bent field work borrows a finished sheet of the same work, so the
 // stoop and the reach toward the ground are not copied from a standing pose.
 weed:`${OUT}/fields-02-weed-v1.png`,
 harvest:`${OUT}/fields-01-harvest-v1.png`,
};

// Three key poses per work role: [file suffix, Chinese activity names, cell descriptions].
// Cell 1 is always the rest pose the figure holds between actions.
function workPoses(p,kind){
 const l=p.label;
 const W=(file,activity,cells)=>({file,activity,cells});
 if(kind==='harvest')return W('harvest',['拢住麦穗','拉镰收割','收拢麦束'],['bent forward, the free hand gathering a bunch of standing grain stalks, sickle held low','pulling the sickle through the stalks near the root, shoulders turning with the cut','straightening a little, holding the cut bundle against the body']);
 if(kind==='weed')return W('weed',['俯身寻草','伸手拔草','起身甩草'],['bent low over the crop rows, looking for weeds, one hand on the knee','reaching down and gripping a weed at the root, pulling it up','half rising, shaking the soil off the pulled weed held out to the side']);
 if(kind==='craft'&&/农耙/.test(l))return W('rake',['扶住农耙','抬手敲修','敲紧耙齿'],['holding the wooden rake head steady across the knees, looking at the tines','raising a small wooden mallet in the free hand','tapping a loose tine tight with the mallet, head bent to watch']);
 if(kind==='craft')return W('mend',['扶稳工具','抬手敲修','敲紧榫头'],['holding the wooden part steady with one hand, studying the joint','raising a small mallet in the other hand','striking the tenon home, shoulders behind the blow']);
 if(kind==='drink'&&/葫芦/.test(l))return W('gourd',['捧着葫芦歇脚','仰头喝水','放下葫芦擦汗'],['resting with the water gourd held in the lap','tilting the head back and drinking from the gourd','lowering the gourd, the other hand wiping the brow']);
 if(kind==='drink')return W('tea',['端盏歇坐','举杯饮一口','放低杯盏'],['sitting at ease, the tea cup held in both hands at chest height','raising the cup to the lips, taking a sip','lowering the cup, looking aside contentedly']);
 if(kind==='listen'&&/听书/.test(l))return W('listen',['侧耳听书','抬手捋须','点头称是'],['sitting still, head tilted toward the storyteller','one hand raised to the chin or beard, thinking','nodding with a small smile, hand back on the knee']);
 if(kind==='listen')return W('listen',['坐着听人','侧身插话','点头回应'],['sitting at ease, listening, hands on the knees','leaning forward slightly, one hand raised as if adding a word','nodding and smiling, sitting back']);
 if(kind==='pour')return W('pour',['提壶靠近','倾壶添茶','扶正茶壶'],['bent forward, holding the teapot just above a cup, other hand steadying the lid','tilting the pot, a thin stream of tea pouring into the cup','lifting the pot upright, about to straighten']);
 if(kind==='tell')return W('tell',['举扇开讲','挥扇比画','收扇停顿'],['standing tall, folding fan raised at shoulder height, mouth open mid-sentence','sweeping the fan out to the side in a dramatic gesture','leaning in, fan closed and pointed, pausing for effect']);
 if(kind==='child')return W('basket',['低头看篮','拨弄篮中物','抬头张望'],['looking down into the basket held with both hands','one small hand reaching into the basket, picking something up','looking up and around, hugging the basket']);
 if(kind==='cart')return W('cart',['扶稳车把','直身擦汗','回头看粮袋'],['both hands on the cart handles, standing behind the cart','straightening up beside the cart, one hand wiping the brow','turning to look at the grain sacks on the cart, one hand resting on a sack']);
 if(kind==='write')return W('ledger',['低头看簿','提笔记账','停笔抬头'],['looking down at the open ledger, brush held ready','writing in the ledger, brush moving','pausing, brush lifted, looking up to check the goods']);
 if(kind==='sort'&&/菜筐/.test(l))return W('greens',['俯身理菜','捧菜入筐','理齐菜筐'],['bent over the vegetable basket, hands on its rim','lifting a bunch of greens with both hands','pressing the greens neatly into the basket']);
 if(kind==='sort'&&/卸粮/.test(l))return W('pour',['倾袋倒粮','抬袋抖粮','放低抖净'],['tipping the grain sack, grain pouring from its mouth','lifting the sack higher and shaking it','lowering the nearly empty sack, shaking out the last grain']);
 if(kind==='sort'&&/粮筐/.test(l))return W('grain',['掀开筐盖','捧粮查看','让粮流回筐里'],['hands on the basket lid, opening it','scooping a double handful of grain to look at it','letting the grain run back into the basket through the fingers']);
 if(kind==='sort'&&/粮粉/.test(l))return W('flour',['托袋候粉','接住粮粉','扎紧袋口'],['holding a cloth bag open at waist height','flour pouring into the bag, arms braced','twisting and tying the bag mouth shut']);
 if(kind==='sort'&&/叠布/.test(l))return W('cloth',['展开布匹','对折布匹','压平叠好'],['crouching, a length of cloth spread across the hands','folding the cloth in half, arms brought together','pressing the folded cloth flat on the pile']);
 if(kind==='sort'&&/盘绳/.test(l))return W('rope',['理顺缆绳','绕绳成圈','压紧绳圈'],['kneeling, pulling a length of rope through the hands','looping the rope around into a coil','pressing the finished coil down']);
 if(kind==='sort')return W('sort',['俯身整理','双手收拢','理齐归置'],['bent over the goods, both hands on them','gathering the goods together with both hands','setting them down neatly']);
 if(/看瓮/.test(l))return W('jar',['俯身看瓮','伸手敲瓮','端详瓮口'],['bending to look at the pottery jar','tapping the side of the jar with a knuckle, listening','lifting the head and looking at the jar mouth, hand on the rim']);
 if(/展布/.test(l))return W('cloth',['托布候客','展开布匹','递布给人摸'],['holding a folded bolt of cloth at chest height','unrolling a length of the cloth to show it','holding the cloth out so the buyer can feel it']);
 if(/看布/.test(l))return W('feel',['打量布匹','伸手摸布','点头问价'],['standing and looking at the cloth','reaching out and feeling the cloth between finger and thumb','nodding, hand raised asking the price']);
 if(/递钱/.test(l))return W('pay',['看看吃食','伸手递钱','接过吃食'],['looking at the food, coins held in the hand','holding out the coins','receiving the food with both hands']);
 if(/秤量/.test(l))return W('scale',['提秤','拨动秤砣','看秤点头'],['holding up the steelyard, goods hanging from its hook','sliding the counterweight along the beam','reading the beam and nodding']);
 if(/递碗/.test(l))return W('bowl',['端碗候客','双手递碗','收手示意'],['holding a bowl of food at chest height','holding the bowl out with both hands','drawing back the hands, gesturing politely']);
 if(/递包/.test(l))return W('bundle',['抱着货包','侧身递包','收手站稳'],['holding a cloth-wrapped bundle against the body','turning and handing the bundle out','hands back, standing steady']);
 if(/接货/.test(l))return W('receive',['俯身伸手','接住货包','抱货起身'],['bent forward, hands out ready','catching the bundle in both hands','half rising, holding the bundle to the chest']);
 if(/送水/.test(l))return W('water',['端碗候人','递碗送水','收碗示意'],['holding a bowl of water steady at waist height','holding the bowl out in front','drawing back, one hand raised in greeting']);
 if(/糕饼/.test(l))return W('cakes',['端盘候客','托盘招呼','拈饼递出'],['holding the tray of cakes at chest height','raising the tray, calling to passers-by','taking one cake from the tray and holding it out']);
 if(/指路|问询/.test(l))return W('ask',['停步问路','抬手指路','摊手问询'],['standing, turned toward someone, about to ask','one arm raised, pointing ahead along the road','palms turned up, asking a question']);
 if(p.members>1&&p.posture==='child')return W('play',['拍手嬉戏','蹦跳笑闹','并肩站定'],['the two children face each other, hands raised to clap together','one child hops with arms flung up laughing, the other claps','the two stand side by side, catching their breath and grinning']);
 if(p.members>1)return W('chat',['并肩站定','抬手指点','相视交谈'],['the two stand side by side at ease','one raises an arm and points into the distance, the other turns to look','they turn toward each other talking, one nods']);
 return W('greet',['侧身招呼','抬手示意','点头回应'],['standing at ease, turned slightly','one hand raised in greeting','nodding with a small bow']);
}

// Walk speed in figure heights per second, from the same cues as the street walkers.
function walkPace(p){
 const l=p.label;
 if(/拄杖/.test(l))return .3;
 if(/跑堂|穿行/.test(l))return .55;
 if(/抬运|扶杠|背囊|提箱/.test(l))return .4;
 return p.members>1?.38:.45;
}

// Lessons from the earlier batches: wide strides and staffs crossed cell lines
// (visitors-13, bridge-36), captions disagreed with the reference art (bridge-26),
// and planted shoes drifted between work cells.
const TRUST='If the Chinese role caption disagrees with the FIRST reference (for example the reference carries a staff, basket, box or bundle the caption does not mention), follow the reference.';
const GRID=n=>`Canvas: one wide landscape image split into exactly ${n} invisible equal-width columns. Every part of each figure - farthest stride, staff tip, trailing sleeve, bundle - stays wholly inside its own column with a clear transparent gap of at least one tenth of the column width on both sides; nothing overlaps a neighbouring column. If a pose is too wide, draw the figure smaller in ALL cells rather than let it cross a column line.`;
const STYLE='Fine ink outlines and muted antique Chinese watercolor exactly matching the first reference, same line weight, same palette, same paper-grain shading. Truly transparent alpha background, no ground shadow, no glow, no grid lines, no numbers, no text.';

function workPrompt(p,poses,pair){
 const who=pair?'these two Song dynasty figures':'this exact Song dynasty figure';
 const seated=p.posture==='seated';
 const cells=poses.cells.map((c,i)=>`Cell ${i+1}${i?'':' (left) = rest'}: ${c}.`).join(' ');
 return `Use case: identity-preserve. Asset type: a THREE-FRAME limited-animation key-pose SPRITE SHEET of ${who} (role: ${p.label}; the Chinese caption is for context only, never draw text). TWO reference images. The FIRST shows the exact ${pair?'pair':'person'} to draw: copy identity, faces, hair, clothing colours, headwear and every carried object or tool from it, and keep the same facing direction. Its camera angle may be from above; IGNORE that angle. The SECOND reference is a finished three-cell sheet of ${pair?'a different pair':'a different person'}: copy ONLY its camera angle (eye-level three-quarter view, the same as every other figure on the street), its figure scale and its three-cell layout. Do NOT copy ${pair?'those people':'that person'}${seated?', and do not copy their standing pose: this figure stays SEATED or crouching exactly as in the first reference, keeping any stool, bench or mat shown there (if none is shown, a plain low wooden stool)':''}. ${cells} The feet${seated?', knees and seat':''} stay planted on exactly the same spot in all three cells; only the arms, hands, heads and upper bodies move, with believable weight at the hips and knees. Objects stay the same size and colour in every cell and stay attached to the hands that hold them. ${TRUST} The soles of the planted shoes sit at exactly the same height and the same horizontal position in all three cells, so the cells can be stacked on top of each other. ${STYLE} One single horizontal row of 3 equal-width cells, one full ${pair?'group':'figure'} per cell, centered in its cell with generous margin so hands, tools, sleeves and feet never touch a cell edge. ${GRID(3)} Identical character size and identical camera angle in every cell. Redraw at higher detail than the small reference without changing the design. Make every cell match the first reference and match each other as strictly as possible.`;
}

function walkPrompt(p,pair){
 const carry=' Carried objects stay in the same hands or on the same shoulder or back in every cell.'+(/拄杖/.test(p.label)?' The walking stick is planted on the ground on the side of the supporting leg and swings forward with the opposite leg.':' If the figure holds a walking stick or staff, it reaches the ground and swings forward with the opposite leg.');
 const gait=pair?'They walk SIDE BY SIDE with a small gap between them, both facing right, the farther one slightly behind. They are NOT in step: when one has a leg forward the other is passing. For cells 2-5, BOTH figures follow the contact/passing sequence, each with their own legs.':'';
 return `Use case: identity-preserve. Asset type: a FIVE-FRAME SPRITE SHEET of ${pair?'these two Song dynasty companions':'this exact Song dynasty figure'} (role: ${p.label}; the Chinese caption is for context only, never draw text): one standing pose plus one complete four-frame walk cycle, walking toward the RIGHT of the image. TWO reference images. The FIRST shows the exact character(s) to draw: copy identity, faces, hair, clothing colours, headwear and carried objects from it. Its camera angle may be from behind or from above; IGNORE that angle and its facing. The SECOND reference is a finished walk sheet of ${pair?'a different pair':'a different person'}: copy ONLY its camera angle (eye-level three-quarter side view, the same as every other figure on the street), its figure scale and its five-cell layout. Do NOT copy ${pair?'those people':'that person'}. ${gait}${carry} Cell 1 = standing at rest, facing right. Cell 2 = contact: front leg forward with heel touching the ground, back leg on its toes, longest stride. Cell 3 = passing: weight on the straight supporting leg under the body, the other leg bent and passing forward, foot just off the ground. Cell 4 = contact with the opposite leg forward, mirror of cell 2. Cell 5 = passing with the opposite leg, mirror of cell 3. The head stays at the same height and the same horizontal position in every walking cell; the body only bobs very slightly. Correct leg anatomy, robe and skirt hems swing with the legs, no extra limbs. ${TRUST} ${STYLE} One single horizontal row of 5 equal-width cells, all walking toward the RIGHT of the image, centered in each cell with generous margin so heads, tools, bundles and feet never touch a cell edge. ${GRID(5)} Identical figure size and identical camera angle in every cell. Redraw at higher detail than the small reference without changing the design. Make every cell match the first reference and match each other as strictly as possible.`;
}

// Crop one figure from its transparent atlas, with a small margin inside its cell.
async function crop(p,target){
 const meta=await sharp(path.join(root,p.src)).metadata();
 const cw=meta.width/p.cols,ch=meta.height/p.rows,cx=(p.sprite%p.cols)*cw,cy=Math.floor(p.sprite/p.cols)*ch,pad=8;
 const left=Math.max(Math.floor(cx),Math.floor(cx+p.bounds.left*cw)-pad),top=Math.max(Math.floor(cy),Math.floor(cy+p.bounds.top*ch)-pad);
 const right=Math.min(Math.floor(cx+cw),Math.ceil(cx+p.bounds.right*cw)+pad),bottom=Math.min(Math.floor(cy+ch),Math.ceil(cy+p.bounds.bottom*ch)+pad);
 await sharp(path.join(root,p.src)).extract({left,top,width:right-left,height:bottom-top}).png().toFile(target);
}

const rows=[];
for(const p of population.people){
 if(LIMITED[p.id]||HANDLED.has(p.id))continue;
 const kind=motionProfile(p).kind,pair=p.members>1;
 // Anything the street schedules as a walker gets a walk cycle; the rest work in place.
 const walk=kind==='walk'||!!planWalk(p,kind);
 const poses=walk?null:workPoses(p,kind);
 const file=`${p.id}-${walk?'walk':poses.file}`,save=`${OUT}/${file}-v1.png`;
 const ref=`${OUT}/${p.id}-reference.png`,json=path.join(root,`${OUT}/${file}-v1.json`);
 if(force||!await exists(path.join(root,ref)))await crop(p,path.join(root,ref));
 const limited=walk
  ?{file,cols:5,anchor:'head',walk:true,cycle:.85,pace:walkPace(p),activity:['停步看看','沿路慢行']}
  :{file,cols:3,anchor:'feet',activity:poses.activity,timeline:[[0,1.8],[1,.6],[2,.9],[1,.4],[0,1.3]]};
 const spec={
  prompt:{
   referenced_image_paths:[path.join(root,ref),path.join(root,LAYOUT[walk?(pair?'walkPair':'walk'):pair?'workPair':LAYOUT[poses.file]&&!pair?poses.file:'work'])],
   transparent_background:true,
   prompt:walk?walkPrompt(p,pair):workPrompt(p,poses,pair)},
  save_as:save,
  cells:limited.cols,
  install:`node scripts/install-limited-animation.mjs ${save}`,
  // Registered in src/extension-limited-animation.js once installed; soles
  // (work) or cycle (walk) are measured from the generated sheet then.
  id:p.id,label:p.label,limited};
 if(force||!await exists(json))await writeFile(json,JSON.stringify(spec,null,1)+'\n');
 rows.push({id:p.id,label:p.label,file,walk,pair,district:p.id.split('-')[0]});
}

const DISTRICTS={gate:'城门',visitors:'游人',bridge:'桥边与菜园',mill:'水磨与仓场',tea:'茶市',fields:'田畴',quay:'码头'};
const lines=[`# 关键帧第 ${batch} 批 · 待生图清单`,'',`共 ${rows.length} 组：走路 ${rows.filter(r=>r.walk).length}（5 格），原地动作 ${rows.filter(r=>!r.walk).length}（3 格）。由 \`node scripts/prepare-limited-animation-batch.mjs\` 生成。`,'',
 '每项在 Codex 里用内置 `image_gen` 按同名 JSON 的 `prompt` 生成（两张参考图都要附上），原图存到 `save_as`。生好后交回安装、标定鞋底与步幅。','',
 '生图后自查（不合格就重生，不要交回）：','',
 '- 格数正确：走路 5 格、原地动作 3 格，一行排开，背景透明。',
 '- 人物、手杖、步子、包袱都在本格内，左右留空，不压到相邻格。',
 '- 走路全部朝右；每格人物同样大小、同样平视侧面角度。',
 '- 原地动作三格脚底落在同一处，只有上身和手在动。',
 '- 人物身份、衣色、所带物件与第一张参考图一致（与中文角色名不符时以参考图为准）。',
 '- 已有同名 PNG 的不要覆盖。',''];
for(const [d,name] of Object.entries(DISTRICTS)){
 const list=rows.filter(r=>r.district===d).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}));if(!list.length)continue;
 lines.push(`## ${name}（${list.length}）`,'');
 for(const r of list)lines.push(`- [ ] \`${r.file}-v1.json\` · ${r.id} ${r.label}${r.pair?' · 双人':''}${r.walk?' · 走路':''}`);
 lines.push('');
}
await writeFile(path.join(root,`${OUT}/batch-${batch}-index.md`),lines.join('\n'));
console.log(JSON.stringify({figures:rows.length,walk:rows.filter(r=>r.walk).length,work:rows.filter(r=>!r.walk).length,index:`${OUT}/batch-${batch}-index.md`}));
