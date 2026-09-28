(function(root,factory){
  const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BridgeStory=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
  const lerp=(a,b,u)=>a+(b-a)*u;
  const station=1408;
  const stages={idle:'虹桥过船',approach:'货船正在靠近虹桥',call:'船工请你到桥边接绳',rig:'船工正在降桅，向左缓缓牵绳',guide:'船正在过桥，放缓牵引',clear:'船已通过，船工向你致意',record:'画师正在记录虹桥过船',complete:'虹桥过船画稿已收好'};
  class Crossing{
    constructor(){this.stage='idle';this.time=0;this.stageTime=0;this.input=0;this.tension=0;this.rig=0;this.progress=0;this.work=0;this.overpull=0;this.joined=false;this.participated=false;this.events=[];this.result=null;this.count=0;}
    get active(){return !['idle','complete'].includes(this.stage);}
    get working(){return ['rig','guide'].includes(this.stage);}
    get busy(){return ['call','rig','guide'].includes(this.stage);}
    start(){if(this.active)return false;const n=this.count+1;Object.assign(this,new Crossing());this.count=n;this.enter('approach');return true;}
    enter(stage){this.stage=stage;this.stageTime=0;this.events.push(stage);if(stage==='clear'){this.joined=false;this.input=0;this.result={helped:this.work>1.5,quality:this.work>1.5?(this.overpull>4?'steadying':'steady'):'watched',version:1};}}
    join(){if(!['call','rig','guide'].includes(this.stage))return false;this.joined=true;this.participated=true;if(this.stage==='call')this.enter('rig');return true;}
    release(){this.joined=false;this.input=0;}
    pull(value){this.input=this.joined&&this.working?clamp(value):0;}
    step(dt,{arriving=false}={}){
      this.events=[];if(dt<=0||!this.active)return;
      this.time+=dt;this.stageTime+=dt;
      this.tension+=(this.input-this.tension)*(1-Math.exp(-dt*5));
      const force=this.tension,good=clamp(1-Math.abs(force-.56)/.32);
      if(this.joined&&force>.12){this.work+=dt*good;this.overpull+=dt*(force>.85?1:0);}
      if(this.stage==='approach'&&this.stageTime>=11)this.enter('call');
      else if(this.stage==='call'&&this.stageTime>=(arriving?38:22))this.enter('rig');
      else if(this.stage==='rig'){
        this.rig=clamp(this.rig+dt*(.033+(this.joined?.040*good:0)));
        if(this.rig>=1)this.enter('guide');
      }else if(this.stage==='guide'){
        // Crew always retain control. Excess force slows, never crashes the boat.
        const assistance=this.joined?good*.023:0;
        const resistance=force>.85?.006:0;
        this.progress=clamp(this.progress+dt*(.029+assistance-resistance));
        if(this.progress>=1)this.enter('clear');
      }else if(this.stage==='clear'&&this.stageTime>5.5)this.enter('record');
      else if(this.stage==='record'&&this.stageTime>6)this.enter('complete');
    }
    get visible(){return this.stage!=='idle';}
    vessel(){
      // Hull baseline stays on the tributary water. Depth is conveyed by scale,
      // not by lifting a full-size ship into the bridge's stone embankment.
      let x=1790,y=662,scale=1.17,axisX=-.86,axisY=-.06,mast=0;
      if(this.stage==='approach'){
        const u=smooth(this.stageTime/11);x=lerp(1790,1635,u);y=lerp(662,596,u);axisX=lerp(-.86,-.72,u);
      }else if(this.stage==='call'){x=1635;y=596;axisX=-.72;}
      else if(this.stage==='rig'){
        const u=smooth(this.rig);x=lerp(1635,1530,u);y=lerp(596,550,u);scale=lerp(1.17,1.05,u);axisX=lerp(-.72,-.68,u);mast=u;
      }else if(['guide','clear','record','complete'].includes(this.stage)){
        const u=smooth(this.progress);x=lerp(1530,1510,u);y=lerp(550,485,u);scale=lerp(1.05,.42,u);axisX=lerp(-.68,-.62,u);mast=1;
      }
      const strain=this.working?Math.max(0,this.tension-.82)*.025:0;
      x+=Math.sin(this.time*.8)*(this.working?(1-this.tension)*1.5:0)+Math.sin(this.time*5)*strain;
      return {x,y,scale,axisX,axisY,mast,opacity:this.visible?1:0,occluded:['guide','clear','record','complete'].includes(this.stage),wave:this.stage==='clear'||this.stage==='record'};
    }
    residents(world){
      if(!this.active)return {};
      const out={},working=this.working,attention=this.busy?1:clamp(1-this.stageTime/5.5),pull=.28+this.tension*.7;
      for(const x of [1338,1368,1432,1466,1520,1546,1583,1629,1678]){
        const helper=[1432,1466].includes(x),phase=this.time*1.4+(x%5);
        out[x]={story:'crossing',direction:x<1520?1:-1,pose:{nod:.05*attention+Math.sin(phase)*.012,handX:helper&&working?4+pull*3:2*attention,handY:helper&&working?2:-5*attention,lean:helper&&working?-.055*pull:.015*attention}};
      }
      return out;
    }
    static dragForce(startX,currentX){return clamp(.28+(startX-currentX)/145);}
  }
  return {Crossing,station,stages,smooth,clamp};
});
