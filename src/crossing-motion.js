// Progress is independent of frame rate and input device. All routes stay in the river channel.
export const clamp01=value=>Math.max(0,Math.min(1,value));
export const ease=(a,b,value)=>{const t=clamp01((value-a)/(b-a));return t*t*(3-2*t);};
export function assemblyProgress(progress,order){return ease(order*.19,.20+order*.19,progress);}
export function journeyPose(progress,aspect=1.5){
  const p=clamp01(progress),approach=ease(.35,.52,p),pass=ease(.50,.70,p);
  const portrait=aspect<.8;
  const start=portrait?[4.5,7.8,46]:[4.8,5.7,22];
  const near=[.5,2.15,10.2],end=[.0,1.7,-8];
  const mix=(a,b,t)=>a+(b-a)*t;
  const camera=start.map((v,i)=>mix(mix(v,near[i],approach),end[i],pass));
  return {camera,look:[mix(0,0,pass),mix(2.3,2.0,pass),mix(0,-20,pass)],
    boatZ:mix(7.8,-13,ease(.42,.72,p)),boatX:mix(.4,0,ease(.4,.7,p)),
    fade:ease(.988,1,p),phase:p<.40?0:p<.67?1:2};
}
export function createJourney({pauseAt=null}={}){
  let target=0,current=0,playing=false,held=false;
  return {
    get progress(){return current;},get target(){return target;},get playing(){return playing;},
    seek(value){target=clamp01(value);playing=false;held=pauseAt!==null&&target>=pauseAt;},
    advance(amount){this.seek(target+amount);},
    toggle(){playing=!playing;return playing;},
    pause(){playing=false;},
    step(seconds){const dt=Math.max(0,Math.min(.08,seconds));if(playing){target=clamp01(target+dt/50);if(pauseAt!==null&&!held&&target>=pauseAt){target=pauseAt;playing=false;held=true;}}
      current+=(target-current)*(1-Math.exp(-dt*6));if(Math.abs(target-current)<.00015)current=target;return current;}
  };
}
