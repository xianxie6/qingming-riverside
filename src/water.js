(function(root,factory){
  const water=factory();
  if(typeof module==='object'&&module.exports)module.exports=water;
  else root.ScrollWater=water;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
  const mod=(value,size)=>((value%size)+size)%size;

  // Deterministic currents keep the water alive without covering the painted
  // river with a uniform procedural pattern.
  function surfaceLines(time,min,max,count=118){
    const span=Math.max(1,max-min),lines=[];
    for(let i=0;i<count;i++){
      const depth=(i*47.73)%168,y=548+depth;
      const drift=time*(6.2+depth*.036);
      const x=min-45+mod(i*131.37+drift,span+90);
      const length=16+mod(i*17.19,48)*(0.72+depth/560);
      const bend=Math.sin(time*.28+i*1.71)*(0.5+depth/170);
      lines.push({x,y,length,bend,light:i%5===0,alpha:.04+.05*(depth/168)+.015*Math.sin(time*.33+i)});
    }
    return lines;
  }

  // A single power stroke: the blade catches, throws a small crest, then the
  // ring widens after the blade has left the water.
  function strokeEffect(time,period=3.6){
    const cycle=mod(time,period)/period;
    const contact=clamp((cycle-.08)/.44);
    const release=clamp((cycle-.52)/.38);
    const power=cycle>=.08&&cycle<=.52?Math.sin(contact*Math.PI):0;
    return {cycle,power,release,ring:3+contact*4+release*7,opacity:(1-release)*(.12+power*.34)};
  }
  function waterfallStrands(time,count=16){
    const strands=[];
    for(let i=0;i<count;i++){
      const across=count===1?0:i/(count-1),phase=mod(time*.72+i*.173,1);
      strands.push({
        x:(across-.5)*38+Math.sin(time*.86+i*2.31)*1.8,
        sway:Math.sin(time*1.18+i*1.47)*3.4,
        phase,
        width:.55+(i%4)*.16,
        alpha:.13+(i%5)*.025
      });
    }
    return strands;
  }
  function wakeStrength(moving){return moving?{dark:.17,light:.26,length:1.18}:{dark:.035,light:.055,length:.42};}
  return {surfaceLines,strokeEffect,waterfallStrands,wakeStrength};
});
