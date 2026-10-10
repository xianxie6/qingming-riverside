(() => {
  'use strict';
  class InkSound {
    constructor(){this.enabled=false;this.running=true;this.night=false;this.festival=false;this.lastStroke=-Infinity;this.rainLevel=0;this.musicLevel=.68;}
    async toggle(){
      try{
        if(!this.context)this.create();
        await this.context.resume();this.enabled=!this.enabled;
        if(this.enabled&&this.running)await this.currentMusic().play();
        this.setRunning(this.running);
      }catch{this.enabled=false;}
      return this.enabled;
    }
    create(){
      const Audio=window.AudioContext||window.webkitAudioContext;
      if(!Audio)throw new Error('Audio unavailable');
      const c=this.context=new Audio();
      const noise=this.noise=c.createBuffer(1,c.sampleRate*4,c.sampleRate),data=noise.getChannelData(0);
      let brown=0;
      for(let i=0;i<data.length;i++){brown=(brown+Math.random()*.04-.02)/1.015;data[i]=brown*3;}
      this.master=c.createGain();this.master.gain.value=0;this.master.connect(c.destination);
      this.music=c.createGain();this.music.gain.value=this.musicLevel;
      this.dayMusic=this.createMusicTrack('assets/audio/day-ambience.mp3',!this.festival&&!this.night?1:0);
      this.nightMusic=this.createMusicTrack('assets/audio/night-music.mp3',!this.festival&&this.night?1:0);
      this.festivalMusic=this.createMusicTrack('assets/audio/day-ambience.mp3',this.festival?1:0);
      this.music.connect(this.master);
      const rain=c.createBufferSource();rain.buffer=noise;rain.loop=true;
      const rainFilter=c.createBiquadFilter();rainFilter.type='bandpass';rainFilter.frequency.value=1850;rainFilter.Q.value=.34;
      this.rain=c.createGain();this.rain.gain.value=0;
      rain.connect(rainFilter);rainFilter.connect(this.rain);this.rain.connect(this.master);rain.start();
    }
    createMusicTrack(src,level){
      const element=new window.Audio(src);
      element.loop=true;element.preload='auto';element.playsInline=true;
      const gain=this.context.createGain();gain.gain.value=level;
      const source=this.context.createMediaElementSource(element);
      source.connect(gain);gain.connect(this.music);
      return {element,gain,source};
    }
    currentTrack(){return this.festival?this.festivalMusic:(this.night?this.nightMusic:this.dayMusic);}
    currentMusic(){return this.currentTrack().element;}
    setNight(active){
      this.night=Boolean(active);this.switchMusic();
    }
    setFestival(active){
      this.festival=Boolean(active);this.switchMusic();
    }
    switchMusic(){
      if(!this.context)return;
      const now=this.context.currentTime,current=this.currentTrack(),previous=[this.dayMusic,this.nightMusic,this.festivalMusic].filter(track=>track!==current);
      clearTimeout(this.musicSwitchTimer);
      current.gain.gain.setTargetAtTime(1,now,.45);
      previous.forEach(track=>track.gain.gain.setTargetAtTime(0,now,.45));
      if(this.enabled&&this.running){
        current.element.play().catch(()=>{});
        this.musicSwitchTimer=setTimeout(()=>{for(const track of previous)if(track!==this.currentTrack())track.element.pause();},2400);
      }else previous.forEach(track=>track.element.pause());
    }
    setRunning(running){
      this.running=running;if(!this.context)return;
      const active=this.enabled&&running,now=this.context.currentTime;
      this.master.gain.setTargetAtTime(active ? .32 : 0,now,.15);
      this.setMusicLevel(this.rainLevel,.35);
      clearTimeout(this.pauseTimer);
      if(active)this.currentMusic().play().catch(()=>{});
      else this.pauseTimer=setTimeout(()=>{if(!this.enabled||!this.running){this.dayMusic.element.pause();this.nightMusic.element.pause();this.festivalMusic.element.pause();}},600);
    }
    setMusicLevel(rain,timeConstant){
      if(!this.context)return;
      const target=this.enabled&&this.running?this.musicLevel*Math.pow(1-rain,1.7):0;
      this.music.gain.setTargetAtTime(target,this.context.currentTime,timeConstant);
    }
    noisePulse(pan,duration=.6,level=.22){
      if(!this.enabled||!this.running)return;
      const c=this.context,t=c.currentTime,source=c.createBufferSource();source.buffer=this.noise;
      const filter=c.createBiquadFilter();filter.type='bandpass';filter.frequency.value=750;filter.Q.value=.5;
      const gain=c.createGain();gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(level,t+.12);gain.gain.exponentialRampToValueAtTime(.001,t+duration);
      const stereo=c.createStereoPanner();stereo.pan.value=Math.max(-1,Math.min(1,pan));
      source.connect(filter);filter.connect(gain);gain.connect(stereo);stereo.connect(this.master);
      source.start(t,Math.random()*2);source.stop(t+duration);
      source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();stereo.disconnect();};
    }
    splash(x,camera,width){this.noisePulse((x-camera)/width*2-1,.8,.28);}
    clink(){
      if(!this.enabled||!this.running)return;
      const c=this.context,t=c.currentTime;
      for(const [frequency,level] of [[1720,.025],[2810,.008]]){
        const o=c.createOscillator(),g=c.createGain();o.frequency.value=frequency;
        g.gain.setValueAtTime(level,t);g.gain.exponentialRampToValueAtTime(.0001,t+.65);
        o.connect(g);g.connect(this.master);o.start(t);o.stop(t+.7);o.onended=()=>{o.disconnect();g.disconnect();};
      }
    }
    street(events,camera,width){
      if(!this.enabled||!this.running)return;
      for(const event of events){
        if(event.x<camera||event.x>camera+width)continue;
        if(event.id==='tea'&&event.stage==='drink'){this.clink();continue;}
        if(!['shelve','handoff','fold','exchange'].includes(event.stage))continue;
        const c=this.context,t=c.currentTime,o=c.createOscillator(),gain=c.createGain(),pan=c.createStereoPanner();
        o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(75,t+.1);
        gain.gain.setValueAtTime(.035,t);gain.gain.exponentialRampToValueAtTime(.0001,t+.16);
        pan.pan.value=(event.x-camera)/width*2-1;o.connect(gain);gain.connect(pan);pan.connect(this.master);
        o.start(t);o.stop(t+.18);o.onended=()=>{o.disconnect();gain.disconnect();pan.disconnect();};
      }
    }
    crossing(event,camera,width){
      if(!this.enabled||!this.running||!event.active)return;
      const b=event.vessel();if(b.x<camera-100||b.x>camera+width+100)return;
      const pan=(b.x-camera)/width*2-1;
      if(event.events.includes('guide'))this.noisePulse(pan,.5,.055);
      if(event.stage==='guide'&&event.time-(this.lastBridgeWater??-99)>2.6){this.lastBridgeWater=event.time;this.noisePulse(pan,.85,.08);}
      if(event.tension>.2&&event.time-(this.lastRope??-99)>3.4){
        this.lastRope=event.time;const c=this.context,t=c.currentTime,o=c.createOscillator(),g=c.createGain();
        o.type='triangle';o.frequency.setValueAtTime(87,t);o.frequency.linearRampToValueAtTime(63+event.tension*45,t+.25);
        g.gain.setValueAtTime(.009,t);g.gain.exponentialRampToValueAtTime(.0001,t+.35);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+.4);o.onended=()=>{o.disconnect();g.disconnect();};
      }
      if(event.stage==='approach'&&event.stageTime<.1){this.lastBridgeWater=-99;this.lastRope=-99;}
    }
    weather(sample){
      if(!this.context)return;
      const previous=this.rainLevel;this.rainLevel=Math.max(0,Math.min(1,sample.rain));
      this.rain.gain.setTargetAtTime(this.enabled&&this.running?this.rainLevel*.72:0,this.context.currentTime,.35);
      // Let the recorded background recede behind the original rain bed, then
      // return more slowly as the shower clears.
      this.setMusicLevel(this.rainLevel,this.rainLevel>previous?2.2:4.2);
    }
    update(time,running,ferry,camera,width){
      if(!this.enabled||!running)return;
      const rowing=['sailing','approaching','departing','returning'].includes(ferry.mode);
      if(rowing&&ferry.x>camera-90&&ferry.x<camera+width+90&&time-this.lastStroke>2.1){
        this.noisePulse((ferry.x-camera)/width*2-1,.85,.24);this.lastStroke=time;
      }
    }
  }
  window.InkSound=InkSound;
})();
