(() => {
  'use strict';
  class CrossingAudio {
    constructor({enabled=true,onChange=()=>{}}={}) {
      this.audio=new Audio('assets/audio/crossing-background.mp3');
      this.audio.loop=true;this.audio.volume=.38;this.audio.preload='auto';
      this.enabled=enabled;this.active=false;this.blocked=false;this.disposed=false;
      this.onChange=onChange;this.revision=0;
      this.error=()=>{if(!this.disposed){this.blocked=true;this.onChange();}};
      this.audio.addEventListener('error',this.error);
    }
    setActive(active) {
      if(this.disposed)return;
      this.active=active;this.sync();
    }
    toggle() {
      if(this.disposed)return;
      this.enabled=this.blocked?true:!this.enabled;this.sync();
    }
    sync() {
      const revision=++this.revision;
      if(!this.enabled||!this.active){this.audio.pause();this.onChange();return;}
      this.blocked=false;
      // Called synchronously from the entry click, before scene loading awaits.
      try {
        const playing=this.audio.play();
        Promise.resolve(playing).then(()=>{
          if(this.disposed||!this.active||!this.enabled){this.audio.pause();return;}
          if(revision===this.revision){this.blocked=false;this.onChange();}
        },()=>{
          if(!this.disposed&&revision===this.revision){this.blocked=true;this.onChange();}
        });
      } catch(error) {this.blocked=true;}
      this.onChange();
    }
    dispose() {
      if(this.disposed)return;
      this.disposed=true;this.active=false;++this.revision;this.audio.pause();
      this.audio.removeEventListener('error',this.error);
      this.audio.removeAttribute('src');this.audio.load();
    }
  }
  window.CrossingAudio=CrossingAudio;
})();
