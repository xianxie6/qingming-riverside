(() => {
  'use strict';
  class FireworkAudio {
    constructor(url,{Context=globalThis.AudioContext||globalThis.webkitAudioContext,Media=globalThis.Audio,musicUrl,fetcher=(...args)=>globalThis.fetch(...args),onChange=()=>{}}={}){
      this.url=url;this.Context=Context;this.fetcher=fetcher;this.onChange=onChange;
      this.enabled=true;this.active=false;this.context=null;this.buffer=null;this.loading=null;this.voices=new Set();this.plays=0;this.error='';
      this.sceneActive=false;this.musicUnlocked=false;this.musicError='';
      if(musicUrl&&Media){this.music=new Media(musicUrl);this.music.loop=true;this.music.preload='auto';this.music.volume=.32;}
    }
    get unlocked(){return Boolean(this.buffer&&this.context?.state==='running');}
    get musicPlaying(){return Boolean(this.music&&!this.music.paused);}
    async startMusic(){
      if(!this.music||!this.enabled||!this.sceneActive)return false;
      try{
        await this.music.play();this.musicUnlocked=true;this.musicError='';
        if(!this.enabled||!this.sceneActive)this.music.pause();
        this.onChange();return this.musicPlaying;
      }catch(error){if(error.name!=='AbortError')this.musicError=error.message;this.onChange();return false;}
    }
    setSceneActive(active){
      if(this.sceneActive===Boolean(active))return;
      this.sceneActive=Boolean(active);
      if(!this.sceneActive){this.music?.pause();this.setActive(false);}
      else if(this.musicUnlocked)void this.startMusic();
      this.onChange();
    }
    preload(){
      if(!this.loading)this.loading=this.fetcher(this.url).then(r=>{if(!r.ok)throw Error('Firework audio unavailable');return r.arrayBuffer();}).catch(error=>{this.loading=null;throw error;});
      return this.loading;
    }
    async unlock(){
      if(!this.enabled)return false;
      // Start media playback synchronously inside the same trusted gesture as resume().
      const musicReady=this.startMusic();
      if(!this.Context)return musicReady;
      this.error='';
      try{
        if(!this.context){this.context=new this.Context();this.master=this.context.createGain();this.master.gain.value=.5;this.master.connect(this.context.destination);}
        // Resume inside the user's gesture, before fetching or decoding.
        const resumed=this.context.resume();
        const [,bytes]=await Promise.all([resumed,this.preload()]);
        if(!this.buffer){this.decoding??=this.context.decodeAudioData(bytes.slice(0));this.buffer=await this.decoding;}
        await musicReady;this.onChange();return this.unlocked;
      }catch(error){this.error=error.message;this.decoding=null;this.onChange();return false;}
    }
    setActive(active){this.active=Boolean(active);if(!active)this.stop();else this.preload().catch(()=>{});}
    setEnabled(enabled){this.enabled=Boolean(enabled);if(!enabled){this.stop();this.music?.pause();}else if(this.musicUnlocked)void this.startMusic();this.onChange();}
    play(){
      // Never queue old bursts while audio loads or remains locked.
      if(!this.enabled||!this.active||!this.unlocked)return false;
      if(this.voices.size>=4){const oldest=this.voices.values().next().value;oldest.stop();oldest.disconnect();this.voices.delete(oldest);}
      const source=this.context.createBufferSource();source.buffer=this.buffer;source.connect(this.master);
      source.onended=()=>{this.voices.delete(source);source.disconnect();};this.voices.add(source);
      source.start();this.plays++;return true;
    }
    stop(){for(const source of this.voices){source.stop();source.disconnect();}this.voices.clear();}
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={FireworkAudio};
  else globalThis.FireworkAudio=FireworkAudio;
})();
