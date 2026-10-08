export function timberBreath(index,arrival,time){
  const strength=.035+.965*(1-arrival),phase=index*2.39996;
  return {x:Math.sin(time*.43+phase)*.045*strength,
    y:Math.sin(time*.82+phase)*.17*strength,
    z:Math.cos(time*.57+phase)*.065*strength,
    roll:Math.sin(time*.61+phase)*.026*strength};
}

// The blade stays outboard throughout the stroke. At gunwale height the shaft
// must already clear the widest part of the hull (0.89 units).
export function paddleTip(grip,time){
  return {x:Math.max(1.95,grip.x+1.65),y:-.24+.10*Math.sin(time*1.4),z:grip.z+.32+Math.sin(time*1.4)*.30};
}
