// Bound GPU work by actual viewport area, including large desktop displays.
export function crossingQuality(width,height,dpr=1,cores=8){
  const mobile=width<600,limited=cores<=4;
  const budget=limited?800000:1400000;
  return {mobile,particles:mobile?24000:limited?40000:80000,
    pixelRatio:Math.min(dpr,mobile?1:1.25,Math.sqrt(budget/Math.max(1,width*height))),
    reflectionSize:mobile||limited?256:512,shadowSize:mobile||limited?512:1024};
}

// Reduce resolution only after sustained slow frames; ignore background pauses.
export function createFrameBudget(pixelRatio){
  let seconds=0,frames=0,ratio=pixelRatio;
  return {sample(dt){
    if(dt<=0||dt>.15){seconds=0;frames=0;return null;}
    seconds+=dt;frames++;
    if(seconds<2||frames<30)return null;
    const average=seconds/frames;seconds=0;frames=0;
    const next=Math.max(Math.min(.65,pixelRatio*.65),ratio*.82);
    if(average<=.026||ratio-next<.01)return null;
    ratio=next;return ratio;
  }};
}
