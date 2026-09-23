const test=require('node:test');
const assert=require('node:assert/strict');
const {isFireworksTime,isSponsorTime,FireworkShow}=require('./atlas-fireworks.js');

test('22:00 sponsor slot follows Beijing time and cannot trigger early or on another day',()=>{
  for(const [date,expected] of [
    ['2026-09-25T21:59:59.999+08:00',false],['2026-09-25T22:00:00+08:00',true],
    ['2026-09-25T14:00:30Z',true],['2026-09-25T22:01:00+08:00',false],['2026-09-26T22:00:00+08:00',false]
  ])assert.equal(isSponsorTime(Date.parse(date)),expected,date);
});

test('sponsor plays thank-you then ChatGPT exactly three times and resumes normal progress',()=>{
  const show=new FireworkShow();show.resize(1440,900,520);
  show.textDisplays=5;show.shapeDisplays=2;show.shot=12;show.burstCount=12;
  show.shapePoints={rabbit:[{x:0,y:0}],fairies:[[{x:0,y:0}]]};
  show.sponsorPoints={thanks:[{x:0,y:0}],chatgpt:[{x:-100,y:0},{x:100,y:0}]};
  const blooms=[];show.onBloom=rocket=>{if(!rocket.accompaniment)blooms.push(show.greeting?.kind);};
  assert.equal(show.beginSponsor(),true);assert.equal(show.beginSponsor(),false);
  const acts=[];let previous=null;
  for(let i=0;i<1400&&show.sponsorCompleted<6;i++){
    show.update(.04);
    if(show.greeting&&show.greeting!==previous)acts.push(show.greeting.kind);
    previous=show.greeting;
    assert.equal(show.textDisplays,5);assert.equal(show.shapeDisplays,2);
  }
  assert.deepEqual(acts,Array(3).fill(['sponsor-thanks','sponsor-chatgpt']).flat());
  assert.equal(blooms.length,6,'One sound event per special bloom');
  assert.equal(show.sponsorCompleted,6);assert.equal(show.sponsorStep,-1);
  assert.equal(show.beginSponsor(),false,'No repeat during the same 22:00 minute');
  assert.equal(show.shot,12);assert.equal(show.burstCount,12);
  for(let i=0;i<90;i++)show.update(.04);
  assert.equal(show.greeting.kind,'rabbit');assert.equal(show.shapeDisplays,3);
});

test('sponsor lettering has continuous accompanying shells without changing the ordinary sequence',()=>{
  for(const width of [390,1440]){
    const show=new FireworkShow();show.resize(width,900,520);
    show.sponsorPoints={thanks:[{x:0,y:0}],chatgpt:[{x:0,y:0}]};
    show.textDisplays=5;show.shapeDisplays=2;show.burstCount=12;show.shot=12;
    const bursts=[];show.onBloom=rocket=>{
      if(rocket.accompaniment){
        bursts.push({time:show.elapsed,kind:show.greeting?.kind});
        assert.equal(rocket.formation,null);
      }
    };
    show.beginSponsor();
    for(let i=0;i<1500&&show.sponsorCompleted<6;i++){
      show.update(.04);
      assert.equal(show.textDisplays,5);assert.equal(show.shapeDisplays,2);
      assert.ok(show.rockets.length<=3);assert.ok(show.stars.length<1300);assert.ok(show.sparks.length<=2200);
    }
    assert.ok(bursts.length>20,'Frequent actual explosions throughout all three rounds');
    assert.ok(bursts.some(b=>b.kind==='sponsor-thanks'));
    assert.ok(bursts.some(b=>b.kind==='sponsor-chatgpt'));
    assert.ok(bursts.every((b,i)=>!i||b.time-bursts[i-1].time<3),'No long silent gaps between explosions');
    assert.equal(show.burstCount,12);assert.equal(show.shot,12);
    // Trailing accompaniment shells remain harmless after the sponsor programme ends.
    show.nextLaunch=10;for(let i=0;i<60;i++)show.update(.04);
    assert.equal(show.burstCount,12);assert.equal(show.shapeDisplays,2);assert.equal(show.greeting,null);
  }
});

test('resize or pause restarts only the interrupted sponsor act, without skipping or adding rounds',()=>{
  const show=new FireworkShow();show.resize(390,844,450);
  show.sponsorPoints={thanks:[{x:0,y:0}],chatgpt:[{x:0,y:0}]};show.beginSponsor();
  show.update(.04);show.clear();show.nextLaunch=0;show.update(.04);
  assert.equal(show.greeting.kind,'sponsor-thanks');assert.equal(show.sponsorCompleted,0);
  for(let i=0;i<1500&&show.sponsorCompleted<6;i++)show.update(.04);
  assert.equal(show.sponsorCompleted,6);assert.equal(show.sponsorStep,-1);
});

test('one Beijing festival evening, including every second of 23:59',()=>{
  const cases=[
    ['2026-09-24T20:00:00+08:00',false],
    ['2026-09-25T19:59:59.999+08:00',false],
    ['2026-09-25T20:00:00+08:00',true],
    ['2026-09-25T23:59:00+08:00',true],
    ['2026-09-25T23:59:59.999+08:00',true],
    ['2026-09-26T00:00:00+08:00',false],
    ['2026-09-26T20:00:00+08:00',false],
    ['2027-09-25T20:00:00+08:00',false],
  ];
  for(const [date,expected] of cases)assert.equal(isFireworksTime(Date.parse(date)),expected,date);
  // These are the same start instant, expressed in visitors' different zones.
  for(const date of ['2026-09-25T12:00:00Z','2026-09-25T05:00:00-07:00','2026-09-25T21:00:00+09:00']){
    assert.equal(isFireworksTime(new Date(date)),true,date);
  }
});

test('continuous show launches varied shells and keeps particles bounded',()=>{
  const show=new FireworkShow();show.resize(1440,900,520);
  let bursts=0,maxParticles=0;const kinds=new Set();
  const burst=show.burst.bind(show);show.burst=r=>{bursts++;kinds.add(r.kind);burst(r);};
  // Ten minutes exercises many cycles of every shell, including long gold tails.
  for(let frame=0;frame<15000;frame++){
    show.update(.04);
    maxParticles=Math.max(maxParticles,show.stars.length+show.sparks.length);
    assert.ok(show.rockets.length<=4);
    assert.ok(show.sparks.length<=2200);
    assert.ok(show.stars.length<1200);
  }
  assert.ok(bursts>200);assert.equal(kinds.size,4);assert.ok(maxParticles>300);
  show.clear();assert.equal(show.stars.length+show.sparks.length+show.rockets.length+show.flashes.length,0);
});

test('background gaps do not create a catch-up storm; resized mobile show still runs',()=>{
  const show=new FireworkShow();show.resize(390,844,400);
  show.update(4*60*60);assert.equal(show.rockets.length,0);
  for(let i=0;i<200;i++)show.update(1/60);
  assert.ok(show.stars.length>0);
  for(const p of show.stars)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
  show.clear();show.resize(844,390,200);
  for(let i=0;i<200;i++)show.update(1/60);
  assert.ok(show.stars.length>0);
});

test('warm trails reuse their points and each spark keeps the original brightness band',()=>{
  const show=new FireworkShow();show.resize(1440,900,520);show.launch();
  const rocket=show.rockets[0];
  for(let i=0;i<15;i++)show.update(.01);
  const allocated=new Set(rocket.trail);
  for(let i=0;i<30;i++){
    show.update(.01);
    assert.equal(rocket.trail.length,15);
    assert.ok(rocket.trail.every(p=>allocated.has(p)),'No point allocations after the trail is warm');
    assert.equal(rocket.trail[0].x,rocket.x);assert.equal(rocket.trail[0].y,rocket.y);
    for(const p of show.sparks){
      const expected=Math.min(2,Math.floor((1-p.age/p.life)*(.65+.35*Math.sin(p.age*32+p.seed)**2)*3));
      assert.equal(p.band,expected);
    }
  }
});

test('five messages and three rabbit/fairy pairs repeat, with changing rabbits and rainbow text',()=>{
  const show=new FireworkShow();show.resize(1440,900,520);
  show.letterPoints={zh:[{x:-30,y:-20},{x:0,y:0},{x:30,y:20}],en:[{x:-50,y:-10},{x:50,y:10}]};
  show.shapePoints={rabbit:[{x:0,y:-50},{x:30,y:40}],fairies:[[{x:-40,y:-20},{x:40,y:20}]]};
  const events=[],languages=[],rabbits=[];let previous=null;
  for(let i=0;i<6500;i++){
    show.update(.04);
    if(show.greeting&&show.greeting!==previous){
      const g=show.greeting;events.push(g.kind);
      if(g.kind==='text'){
        languages.push(g.language);
        assert.equal(g.colorful,languages.length>5);
        const tones=new Set(g.particles.map(p=>p.tone));
        assert.equal(tones.size>1,g.colorful);
      }else if(g.kind==='rabbit'){
        rabbits.push({action:g.rabbitAction,tone:g.rabbitTone});
        assert.ok(g.particles.every(p=>p.tone===g.rabbitTone));
      }
    }
    if(show.greeting&&show.greeting.age>1.5&&show.greeting.age<3){
      for(const p of show.greeting.kind==='text'?show.greeting.particles:[]){
        assert.ok(Math.abs(p.x-p.targetX)<1);
        assert.ok(Math.abs(p.y-p.targetY)<1);
      }
      assert.equal(show.rockets.length,0,'New shells must wait until the current act ends');
    }
    previous=show.greeting;
  }
  const cycle=['text','text','text','text','text','rabbit','fairy','rabbit','fairy','rabbit','fairy'];
  assert.ok(events.length>=22,'At least two complete cycles');
  assert.deepEqual(events,events.map((_,i)=>cycle[i%11]));
  assert.deepEqual(languages,languages.map((_,i)=>i%2===0?'zh':'en'));
  assert.deepEqual(rabbits.slice(0,3),[{action:'ears',tone:0},{action:'leap',tone:2},{action:'look',tone:3}]);
  assert.ok(rabbits.every((r,i)=>!i||(r.action!==rabbits[i-1].action&&r.tone!==rabbits[i-1].tone)));
  const progress=[show.textDisplays,show.shapeDisplays,show.showingFigures];
  show.clear();assert.equal(show.greeting,null);
  assert.deepEqual([show.textDisplays,show.shapeDisplays,show.showingFigures],progress,'Pause/resize must preserve round progress');
});

test('rabbit actions actually move particles differently without losing finite positions',()=>{
  const positions=[];
  for(let variant=0;variant<3;variant++){
    const show=new FireworkShow();show.resize(1440,900,520);
    show.textDisplays=5;show.shapeDisplays=variant*2;
    show.form({x:600,y:240,size:1.35},[{x:-65,y:-85},{x:45,y:85}],'rabbit');
    for(let frame=0;frame<60;frame++)show.update(.04);
    positions.push(show.greeting.particles.map(p=>[p.x-p.targetX,p.y-p.targetY]));
    assert.ok(positions[variant].flat().every(Number.isFinite));
  }
  assert.ok(Math.abs(positions[0][1][1])<2,'Ear-wiggle pose keeps the body seated');
  assert.ok(positions[1][1][1]<-15,'Leaping pose lifts the whole body');
  assert.ok(Math.abs(positions[2][1][1])<2,'Looking up keeps the hindquarters seated');
  assert.ok(positions[2][0][0]>10,'Looking up rotates the head and ears');
});

test('existing rabbit and all three stage dancers have bounded, detailed particle templates',()=>{
  require('./atlas-firework-shapes.js');
  const {rabbit,fairies}=globalThis.QingmingFireworkShapes;
  assert.equal(fairies.length,3);
  for(const points of [rabbit,...fairies]){
    assert.ok(points.length>500&&points.length<=1800);
    assert.ok(points.some(p=>p[3]===0)&&points.some(p=>p[3]===1));
    for(const [x,y,tone,edge] of points){assert.ok(Math.abs(x)<=600&&Math.abs(y)<=500);assert.ok(tone>=0&&tone<=3);assert.ok(edge===0||edge===1);}
  }
});

test('large and extra-large shells alternate with both monochrome and multicolor bursts',()=>{
  const show=new FireworkShow();show.resize(1440,900,520);
  const sizes=[],paletteSizes=new Set();
  for(let i=0;i<6;i++){
    show.launch();const rocket=show.rockets.pop();
    sizes.push(rocket.size);paletteSizes.add(rocket.palette.length);
    show.stars.length=0;show.burst(rocket);
    assert.deepEqual(new Set(show.stars.map(p=>p.color)),new Set(rocket.kind==='double'?[...rocket.palette,'255,231,180']:rocket.palette));
  }
  assert.deepEqual(sizes,[1.35,1.9,1.35,1.9,1.35,1.9]);
  assert.deepEqual(paletteSizes,new Set([1,3]));
});
