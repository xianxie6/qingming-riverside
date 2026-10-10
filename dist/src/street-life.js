(function(root,factory){
  const life=factory(typeof module==='object'&&module.exports?require('./movement.js'):root.ScrollMovement,
    typeof module==='object'&&module.exports?require('./world.js'):root.ScrollWorld);
  if(typeof module==='object'&&module.exports)module.exports=life;else root.ScrollLife=life;
})(typeof globalThis!=='undefined'?globalThis:this,function(movement,world){
  'use strict';
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const ramp=(t,a,b)=>{const u=clamp((t-a)/(b-a));return u*u*(3-2*u);};
  const windowAt=(t,a,b,c,d)=>ramp(t,a,b)-ramp(t,c,d);
  const definitions=[
    {id:'tea',x:760,period:38,offset:1,stages:[[3,'order'],[7,'approach'],[11,'pour'],[16,'return'],[27,'drink'],[38,'talk']]},
    {id:'produce',x:-320,period:36,offset:7,stages:[[4,'browse'],[7,'approach'],[11,'choose'],[15,'exchange'],[20,'leave'],[36,'sort']]},
    {id:'pottery',x:-1165,period:40,offset:9,stages:[[7,'shape'],[11,'collect'],[17,'carry'],[21,'shelve'],[27,'return'],[40,'prepare']]},
    {id:'cloth',x:2510,period:38,offset:12,stages:[[5,'measure'],[9,'approach'],[15,'unfold'],[19,'fold'],[24,'leave'],[38,'weave']]},
    {id:'children',x:1110,period:30,offset:2,stages:[[4,'ready'],[8,'roll'],[14,'catch'],[18,'return'],[25,'show'],[30,'rest']]},
    {id:'freight',x:3920,period:42,offset:5,stages:[[4,'pack'],[10,'carry'],[14,'handoff'],[20,'store'],[28,'return'],[42,'count']]}
  ];
  function journey(home,to,t,cycle,a,b,c,d){
    const position=q=>home+(to-home)*(ramp(q,a,b)-ramp(q,c,d));
    const speed=(position(t+.005)-position(t-.005))/.01;
    return {x:position(t),front:true,walking:Math.abs(speed)>.08,
      direction:Math.sign(speed)||((t>=c)?-Math.sign(to-home):Math.sign(to-home)),
      phase:(Math.abs(to-home)*(ramp(t,a,b)+ramp(t,c,d)+cycle*2))*.15,
      gaitWeight:clamp(Math.abs(speed)/28)};
  }
  function itinerary(home,steps,t,cycle){
    const position=q=>{let x=home,previous=home;for(const [to,a,b] of steps){x+=(to-previous)*ramp(q,a,b);previous=to;}return x;};
    let distance=0,total=0,previous=home,direction=Math.sign(steps[0][0]-home);
    for(const [to,a,b] of steps){const length=Math.abs(to-previous);distance+=length*ramp(t,a,b);total+=length;if(t>=a)direction=Math.sign(to-previous);previous=to;}
    const speed=(position(t+.005)-position(t-.005))/.01;
    return {x:position(t),front:true,walking:Math.abs(speed)>.08,direction,phase:(distance+cycle*total)*.15,gaitWeight:clamp(Math.abs(speed)/28)};
  }
  function storyAt(id,time){
    const definition=definitions.find(d=>d.id===id);
    if(!definition)return null;
    const absolute=time+definition.offset,cycle=Math.floor(absolute/definition.period),t=absolute-cycle*definition.period;
    const stage=definition.stages.find(([end])=>t<end)[1],actors={},props=[];
    const actor=(home,activity,options={})=>{
      actors[home]={activity,pose:movement.activityAt(activity,t,0,6),...options,story:id,stage};
      return actors[home];
    };
    if(id==='tea'){
      const call=windowAt(t,0,1,2,3),pour=windowAt(t,7,8,10,11);
      actor(785,t<11?'look':'drink',{direction:-1,pose:{handY:-9*call-(t>11?6*windowAt(t,12,14,22,25):0),nod:.04,handX:-2}});
      actor(823,'serve',{...journey(823,755,t,cycle,3,7,11,16),
        direction:t<7?-1:1,pose:{handX:3*pour,handY:-2*pour,lean:.018*pour,nod:.04*pour},prop:{kind:'kettle',pour}});
      actor(691,'talk',{direction:1,pose:{handX:2*windowAt(t,24,25,29,31),nod:.04*Math.sin(t*.9)}});
    }else if(id==='produce'){
      const handover=windowAt(t,10,11,14,15);
      actor(-348,'trade',{direction:1,pose:{handX:5*handover,handY:-2*handover,lean:.03*handover,nod:.04},
        prop:t<11?{kind:'produce',amount:windowAt(t,7,8,10,11)}:null});
      actor(-270,'trade',{...journey(-270,-306,t,cycle,4,7,16,20),
        prop:t>=13&&t<23?{kind:'parcel',amount:1-ramp(t,21,23)}:null});
      if(t>=11&&t<13)props.push({kind:'transfer',from:-348,to:-270,u:ramp(t,11,13),object:'parcel'});
      actor(-416,'talk',{direction:1,pose:{nod:.045*Math.sin(t),handY:-2*windowAt(t,12,13,17,19)}});
    }else if(id==='pottery'){
      actor(-1240,'pottery',{direction:1,prop:t>=9&&t<11?null:{kind:'pot',amount:1,size:4+3*windowAt(t,0,6,9,11)}});
      actor(-1165,'pack',{...itinerary(-1165,[[-1206,7,10],[-1118,11,17],[-1165,21,27]],t,cycle),
        prop:t>=11&&t<21?{kind:'pot',amount:1-ramp(t,19,21),size:7}:null});
      if(t>=9&&t<11)props.push({kind:'transfer',from:-1240,to:-1165,u:ramp(t,9,11),object:'pot'});
      actor(-1090,t<17?'pottery':'pack',{direction:-1,pose:{handX:-3*windowAt(t,16,17,20,21),handY:2,nod:.045}});
      props.push({kind:'kiln',x:-1140,y:236,heat:windowAt(t,18,21,34,38)});
    }else if(id==='cloth'){
      const open=windowAt(t,9,12,15,18);
      actor(2480,'trade',{direction:1,pose:{handX:5*open,handY:-2*open,nod:.04},prop:{kind:'cloth',open,amount:1}});
      actor(2540,'trade',{...journey(2540,2520,t,cycle,5,9,19,24),
        prop:t>=19&&t<28?{kind:'cloth',open:0,amount:1-ramp(t,25,28)}:null});
      if(t>=17&&t<19)props.push({kind:'transfer',from:2480,to:2540,u:ramp(t,17,19),object:'cloth'});
      actor(2610,'weave',{direction:-1,pose:{handX:Math.sin(t*2)*3,handY:1,nod:.03}});
    }else if(id==='children'){
      const lead=journey(1134,1064,t,cycle,4,8,14,18),follow=journey(1157,1087,t,cycle,4,8,14,18);
      const raised=windowAt(t,9,11,13,14)+windowAt(t,20,22,26,28);
      actor(1134,'look',{...lead,pose:{handX:3,handY:-3*raised,nod:.04}});
      actor(1157,'look',{...follow,pose:{handX:2,handY:-5*windowAt(t,9,10,13,14),nod:.06}});
      const side=-18+36*ramp(t,11,13)-36*ramp(t,23,25);
      props.push({kind:'hoop',x:lead.x+side,y:world.streetY(lead.x)-12-raised*13,
        angle:(70*(ramp(t,4,8)+ramp(t,14,18))+cycle*140)/12,childX:lead.x,raised});
      props.push({kind:'sparrows',x:1048,y:477,flight:windowAt(t,6,8,12,15),t});
    }else if(id==='freight'){
      actor(3780,'pack',{...journey(3780,3935,t,cycle,4,10,14,20),
        pose:{handX:1+6*windowAt(t,10,11,13,14),handY:1,lean:.035,nod:.05},prop:t<12?{kind:'bale',amount:ramp(t,0,3)}:null});
      actor(3980,'pack',{...journey(3980,4040,t,cycle,16,20,24,28),
        direction:t<16?-1:t<24?1:-1,pose:{handX:1+6*windowAt(t,10,11,13,14),handY:1,lean:.03,nod:.04},prop:t>=14&&t<24?{kind:'bale',amount:1-ramp(t,21,24)}:null});
      if(t>=12&&t<14)props.push({kind:'transfer',from:3780,to:3980,u:ramp(t,12,14),object:'bale'});
      actor(3850,'trade',{direction:1,pose:{handY:-4*windowAt(t,2,4,11,13),handX:2,nod:.05*Math.sin(t*.7)},prop:{kind:'ledger',amount:1}});
    }
    return {id,x:definition.x,t,cycle,stage,actors,props};
  }
  function conversation(p,time){
    const group=Math.floor(p.x/140),speaker=((Math.floor((time+group*.71)/4.8)%2)+2)%2;
    const index=Number(p.id.slice(9)),talking=index%2===speaker;
    const strength=windowAt(((time+group*.71)%4.8+4.8)%4.8,0,.7,3.4,4.8);
    const pose={handX:(talking?3:.5)*strength,handY:-(talking?3:1)*strength,
      nod:(talking?.025:.055)*Math.sin(time*(talking?.8:1.4)+p.phase)};
    return {pose,direction:['balcony','pavilion'].includes(p.layer)?(p.x===797||index%2?-1:1):p.direction};
  }
  class Director{
    constructor(population){
      this.population=population;this.clocks=new Map();this.lastStages=new Map();this.lastVisit=0;
      this.cargoStart=-Infinity;this.cargoReturn=null;this.nextFerry=14;this.time=0;this.frame=this.sample(0);this.events=[];
    }
    sample(time){
      const stories=definitions.map(d=>storyAt(d.id,time)),actors=Object.assign({},...stories.map(s=>s.actors));
      actors[2010]={x:2010,front:true,story:'landing',stage:'wait',pose:{nod:Math.sin(time*.7)*.045}};
      const props=stories.flatMap(s=>s.props);
      const cargo=time-this.cargoStart;
      if(cargo>=0&&cargo<6.4){
        // The porter stays on the existing landing, clear of the ferry cabin.
        const q=journey(2010,2025,cargo,0,0,2.3,3.5,6.4);
        const height=53*(ramp(cargo,0,2.3)-ramp(cargo,3.5,6.4));
        actors[2010]={...q,phase:Math.hypot(15,53)*(ramp(cargo,0,2.3)+ramp(cargo,3.5,6.4))*.15,
          y:world.streetY(q.x)+height,story:'landing',stage:cargo<2.3?'load':cargo<3.5?'handoff':'return',
          pose:{lean:.035,nod:.045,handX:2,handY:1},prop:cargo<2.3?{kind:'bale',amount:1}:null};
        if(cargo>=2.3&&cargo<3.5)props.push({kind:'load',from:2010,x:2041,y:539,u:ramp(cargo,2.3,3.5)});
      }
      if(this.cargoReturn){
        const back=this.cargoReturn,t=time-back.time,u=ramp(t,0,2.6),distance=Math.hypot(back.x-2010,back.y-world.streetY(2010));
        const speed=(ramp(t+.005,0,2.6)-ramp(t-.005,0,2.6))/.01*distance;
        actors[2010]={x:back.x+(2010-back.x)*u,y:back.y+(world.streetY(2010)-back.y)*u,
          front:true,walking:speed>.08,direction:-1,phase:back.phase+distance*u*.15,gaitWeight:clamp(speed/28),
          story:'landing',stage:'clear',pose:{lean:.02,nod:.045},prop:back.prop?{...back.prop,amount:1-ramp(t,2,2.6)}:null};
      }
      return {time,stories,actors,props,cargoActive:!!this.cargoReturn||(cargo>=0&&cargo<6.4),
        cargoBasket:!this.cargoReturn&&cargo>=3.5&&cargo<8?{x:(this.ferry?.x??2085)-44,y:(this.ferry?.y??556)-17,amount:1-ramp(cargo,6.4,8)}:null,
        wind:Math.sin(time*.43)*.55+Math.sin(time*.17+1)*.45};
    }
    advance(dt,time,{player,ferry,roadblock=null}){
      this.events=[];
      if(dt<=0)return;
      this.time=time;
      this.ferry=ferry;
      if(ferry.visits!==this.lastVisit){
        this.lastVisit=ferry.visits;
        if(ferry.berth==='east'&&!player.pending&&!player.action)this.cargoStart=time;
      }
      // A user boarding takes priority; the porter walks back from his actual
      // position instead of finishing a delivery to a boat that has departed.
      if(world.isPassenger(ferry)&&!this.cargoReturn&&this.frame.cargoActive){
        const p=this.frame.actors[2010];
        this.cargoReturn={time,x:p.x,y:p.y??world.streetY(p.x),phase:p.phase??0,prop:p.prop};this.cargoStart=-Infinity;
      }
      if(this.cargoReturn&&time-this.cargoReturn.time>=2.6)this.cargoReturn=null;
      this.frame=this.sample(time);
      for(const story of this.frame.stories){
        if(this.lastStages.has(story.id)&&this.lastStages.get(story.id)!==story.stage)this.events.push({id:story.id,stage:story.stage,x:story.x});
        this.lastStages.set(story.id,story.stage);
      }
      for(const p of this.population.walkers){
        const c=this.clocks.get(p.id)||{time:time-dt,rate:1};
        const pose=world.pedestrianAt(p,c.time),distance=player.x-pose.x;
        const bridgeWaiting=roadblock&&pose.x>roadblock[0]&&pose.x<roadblock[1];
        const yielding=bridgeWaiting||(player.moving&&Math.abs(distance)<34&&distance*pose.direction>0&&player.facing!==pose.direction);
        c.rate+=((yielding?0:1)-c.rate)*(1-Math.exp(-dt*12));c.time+=dt*c.rate;
        const next=world.pedestrianAt(p,c.time);c.phase=(c.phase??pose.phase)+Math.abs(next.x-pose.x)*.15;
        this.clocks.set(p.id,c);
      }
    }
    walkerAt(p,time){
      const c=this.clocks.get(p.id),pose=world.pedestrianAt(p,c?.time??time),rate=c?.rate??1;
      return {...pose,phase:c?.phase??pose.phase,moving:pose.moving&&rate>.04,gaitWeight:pose.moving?rate:0,nod:(1-rate)*.07,handY:-(1-rate)*2};
    }
    shouldCallFerry(time,ferry,player){
      if(time<this.nextFerry||ferry.mode!=='waiting'||ferry.hold||player.pending||player.action)return false;
      this.nextFerry=time+72;return true;
    }
  }
  return {definitions,storyAt,conversation,Director,ramp,windowAt};
});
