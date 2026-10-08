const test=require('node:test');
const assert=require('node:assert/strict');
const {atmosphereAt,moonAt,moonPath}=require('../src/atlas-atmosphere.js');
const at=value=>new Date(value);
function reading(now,code){return {fetchedAt:now.getTime(),data:{current:{time:now.getTime()/1000,weather_code:code},daily:{time:[Date.parse('2026-10-07T00:00:00+08:00')/1000],sunrise:[Date.parse('2026-10-07T06:20:00+08:00')/1000],sunset:[Date.parse('2026-10-07T17:55:00+08:00')/1000]}}};}
test('Beijing clock works independently of the host timezone, including date rollover',()=>{
  assert.equal(atmosphereAt(at('2026-10-06T22:00:00Z')).night,false);
  assert.equal(atmosphereAt(at('2026-10-07T10:00:00Z')).night,true);
  assert.equal(atmosphereAt(at('2026-10-07T16:30:00Z')).date,'2026-10-08');
});
test('current weather controls the daytime sun; rain and overcast suppress it',()=>{
  const now=at('2026-10-07T12:00:00+08:00');
  for(const code of [0,1])assert.equal(atmosphereAt(now,reading(now,code)).mode,'sunny');
  for(const code of [2,3,45,61,95])assert.equal(atmosphereAt(now,reading(now,code)).mode,'cloudy');
});
test('sunrise and sunset override fallback hours, and night wins over clear weather',()=>{
  for(const [time,night] of [['06:19',true],['06:20',false],['17:54',false],['17:55',true]]){
    const now=at(`2026-10-07T${time}:00+08:00`);
    assert.equal(atmosphereAt(now,reading(now,0)).night,night);
  }
});
test('missing, stale or invalid readings do not pretend to report current sunshine',()=>{
  const now=at('2026-10-07T12:00:00+08:00');
  assert.equal(atmosphereAt(now).mode,'unknown');
  const cached=reading(now,0);cached.fetchedAt-=2*3600000;
  assert.equal(atmosphereAt(now,cached).mode,'unknown');
  assert.equal(atmosphereAt(now,{fetchedAt:now.getTime(),data:{}}).mode,'unknown');
});
test('moon follows the instant across host timezones and labels the Beijing date',()=>{
  const utc=moonAt(at('2026-10-07T16:30:00Z'));
  assert.deepEqual(utc,moonAt(at('2026-10-08T00:30:00+08:00')));
  assert.equal(utc.date,'2026-10-08');
  assert.equal(utc.name,'残月');
  assert.ok(utc.illumination<.15);
  assert.notEqual(utc.phase,moonAt(at('2026-10-09T00:30:00+08:00')).phase);
});
test('approximate lunation agrees with published USNO primary phases',()=>{
  for(const [date,lit] of [['2026-01-18T19:52:00Z',0],['2026-01-26T04:47:00Z',.5],['2026-02-01T22:09:00Z',1],['2026-02-09T12:43:00Z',.5]]){
    assert.ok(Math.abs(moonAt(at(date)).illumination-lit)<.04,date);
  }
  assert.ok(moonAt(at('1999-12-01T00:00:00Z')).phase>=0);
});
test('moon silhouette has the right lit area and lights opposite sides at quarters',()=>{
  function polygon(phase){return moonPath(phase).slice(1,-1).split('L').map(p=>p.split(',').map(Number));}
  function area(points){return Math.abs(points.reduce((a,[x,y],i)=>{const [xx,yy]=points[(i+1)%points.length];return a+x*yy-xx*y;},0)/2);}
  for(const phase of [0,.1,.25,.5,.75,.9,1]){
    const expected=(1-Math.cos(phase*Math.PI*2))/2;
    assert.ok(Math.abs(area(polygon(phase))/(Math.PI*34**2)-expected)<.001);
  }
  assert.ok(polygon(.25).every(([x])=>x>=0));
  assert.ok(polygon(.75).every(([x])=>x<=0));
});
