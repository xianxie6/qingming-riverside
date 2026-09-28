const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const railing=require('../src/bridge-railing.js');
const inside=([x,y],poly)=>{
 let result=false;
 for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const [a,b]=poly[i],[c,d]=poly[j];
  if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)result=!result;
 }
 return result;
};
const masked=(x,y)=>railing.silhouettes.some(p=>inside([x,y],p));
test('bridge timber covers foreground but preserves openings and upper bodies',()=>{
 assert.ok(masked(1520,382),'handrail');
 assert.ok(masked(1520,389),'middle beam follows the painted upper edge');
 assert.equal(masked(1520,394),false,'no background stripe below the middle beam');
 assert.ok(masked(1544,398),'previously missing center post');
 assert.ok(masked(1520,412),'front deck conceals feet below the deck');
 assert.equal(masked(1520,386.5),false,'upper opening stays transparent');
 assert.equal(masked(1520,399),false,'lower opening stays transparent');
 for(let x=1360;x<1710;x+=3)assert.equal(masked(x,350),false,'no stray cuts above the railing');
});
test('railing restores original painting at full opacity and restores caller state',()=>{
 let draws=0,saved;
 const c={globalAlpha:.91,globalCompositeOperation:'source-over',
 save(){saved=[this.globalAlpha,this.globalCompositeOperation];},
 restore(){[this.globalAlpha,this.globalCompositeOperation]=saved;},
 beginPath(){},moveTo(){},lineTo(){},closePath(){},clip(){},
 drawImage(image,...args){draws++;assert.equal(image,'painting');assert.equal(this.globalAlpha,1);
 assert.equal(this.globalCompositeOperation,'source-over');assert.deepEqual(args,[0,0,2172,724]);}};
 railing.draw(c,'painting',1300,1750);assert.equal(draws,1);assert.equal(c.globalAlpha,.91);
 railing.draw(c,'painting',0,1000);assert.equal(draws,1,'offscreen bridge has no compositing cost');
});
test('foreground restoration follows all pedestrians and zoom increases their resolution',()=>{
 const scene=fs.readFileSync(__dirname+'/../src/scene.js','utf8');
 assert.doesNotMatch(scene,/eraseFrontRailing/);
 assert.ok(scene.indexOf('window.BridgeRailing.draw')>scene.indexOf('ctx.drawImage(actors'));
 assert.match(scene,/density=Math.min\(\(devicePixelRatio\|\|1\)\*state.scale,4\)/);
 assert.match(fs.readFileSync(__dirname+'/../src/dynamic-loader.js','utf8'),/'bridge-railing\.js\?v=/);
});
