(() => {
  'use strict';
  const MAX_AGE=90*60*1000;
  const beijingDate=now=>new Date(now.getTime()+8*3600000).toISOString().slice(0,10);
  // Low-order solar/lunar ecliptic longitudes, including orbital anomalies.
  // Formula reference: https://github.com/mourner/suncalc/tree/v1.9.0
  // A phase is a shared instant worldwide; only its calendar label uses UTC+8.
  function moonAt(now=new Date()){
    const days=(now.getTime()-Date.parse('2000-01-01T12:00:00Z'))/86400000;
    const rad=Math.PI/180,solarAnomaly=rad*(357.5291+.98560028*days);
    const solarLongitude=solarAnomaly+rad*(1.9148*Math.sin(solarAnomaly)+.02*Math.sin(2*solarAnomaly)+.0003*Math.sin(3*solarAnomaly)+102.9372)+Math.PI;
    const lunarLongitude=rad*(218.316+13.176396*days+6.289*Math.sin(rad*(134.963+13.064993*days)));
    const cycles=(lunarLongitude-solarLongitude)/(2*Math.PI);
    const phase=((cycles%1)+1)%1,illumination=(1-Math.cos(phase*Math.PI*2))/2;
    const name=illumination<.01?'新月':illumination>.99?'满月':Math.abs(illumination-.5)<.035?(phase<.5?'上弦月':'下弦月'):phase<.5?(illumination<.5?'娥眉月':'盈凸月'):(illumination<.5?'残月':'亏凸月');
    return {phase,illumination,name,date:beijingDate(now)};
  }
  function moonPath(phase,radius=34){
    const side=phase<.5?1:-1,terminator=Math.cos(phase*Math.PI*2),points=[];
    for(let i=0;i<=64;i++){
      const angle=Math.PI*i/64;
      points.push([side*radius*Math.sin(angle),-radius*Math.cos(angle)]);
    }
    for(let i=64;i>=0;i--){
      const angle=Math.PI*i/64;
      points.push([side*terminator*radius*Math.sin(angle),-radius*Math.cos(angle)]);
    }
    return `M${points.map(p=>p.map(v=>v.toFixed(3)).join(',')).join('L')}Z`;
  }
  function atmosphereAt(now=new Date(),record=null){
    const time=now.getTime();
    const fresh=record&&Number.isFinite(record.fetchedAt)&&time>=record.fetchedAt&&time-record.fetchedAt<MAX_AGE;
    const data=fresh?record.data:null;
    const day=data?.daily?.time?.findIndex(t=>beijingDate(new Date(t*1000))===beijingDate(now))??-1;
    const sunrise=data?.daily?.sunrise?.[day]*1000,sunset=data?.daily?.sunset?.[day]*1000;
    const hour=new Date(time+8*3600000).getUTCHours();
    const night=Number.isFinite(sunrise)&&Number.isFinite(sunset)&&sunset>sunrise?time<sunrise||time>=sunset:hour<6||hour>=18;
    const current=data?.current;
    const valid=Number.isFinite(current?.weather_code)&&Number.isFinite(current?.time)&&Math.abs(time-current.time*1000)<MAX_AGE;
    const weather=valid?(current.weather_code<=1?'sunny':'cloudy'):'unknown';
    return {night,weather,mode:night?'night':weather,date:beijingDate(now),moon:moonAt(now)};
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={atmosphereAt,moonAt,moonPath};
  if(typeof document==='undefined')return;
  const atlas=document.querySelector('#atlas');if(!atlas)return;
  const CACHE='qingming-kaifeng-weather-v1';
  const endpoint='https://api.open-meteo.com/v1/forecast?latitude=34.80&longitude=114.31&current=weather_code&daily=sunrise,sunset&timezone=Asia%2FShanghai&timeformat=unixtime&forecast_days=2';
  let record=null,busy=false,lastAttempt=0;
  try{record=JSON.parse(localStorage.getItem(CACHE));}catch{}
  const status=document.createElement('a');status.id='atlasWeatherStatus';status.href='https://open-meteo.com/';status.target='_blank';status.rel='noopener noreferrer';atlas.append(status);
  function update(){
    const state=atmosphereAt(new Date(),record);
    atlas.dataset.atmosphere=state.mode;
    const moon=document.querySelector('#atlasMoon');
    if(moon){
      moon.querySelector('path').setAttribute('d',moonPath(state.moon.phase));
      moon.style.setProperty('--moon-glow',String(.08+state.moon.illumination*.22));
      moon.dataset.phase=state.moon.name;
    }
    status.textContent=`开封 · ${state.night?'夜景':state.weather==='sunny'?'晴':state.weather==='cloudy'?'阴云':'日间'} · 北京时间${state.weather==='unknown'?' · 天气暂未更新':''}`;
    status.title=`天气数据：Open-Meteo；昼夜按北京时间及当地日出日落切换；${state.date} ${state.moon.name}（近似月相）`;
    document.dispatchEvent(new CustomEvent('atlas-atmosphere',{detail:state}));
  }
  async function refresh(){
    if(busy||document.hidden||Date.now()-lastAttempt<5*60000)return;
    if(record&&Date.now()-record.fetchedAt<15*60000)return;
    busy=true;lastAttempt=Date.now();
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
    try{
      const response=await fetch(endpoint,{signal:controller.signal});
      if(!response.ok)throw new Error('Weather unavailable');
      const data=await response.json();
      if(!Number.isFinite(data.current?.weather_code)||!Number.isFinite(data.current?.time))throw new Error('Invalid weather');
      record={data,fetchedAt:Date.now()};
      try{localStorage.setItem(CACHE,JSON.stringify(record));}catch{}
    }catch{/* Keep a recent cached reading; otherwise show time-only lighting. */}
    finally{clearTimeout(timeout);busy=false;update();}
  }
  update();void refresh();
  setInterval(()=>{if(!document.hidden){update();void refresh();}},60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){update();void refresh();}});
})();
