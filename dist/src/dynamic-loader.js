(() => {
  'use strict';
  const scripts=[
    'world.js?v=8.3','bridge-railing.js?v=2','night.js?v=1.4-shared-lights','weather.js?v=10.5',
    'sound.js?v=10.6-festival','water.js?v=1.3','movement.js?v=8.2','population.js?v=6.5-tree-seat',
    'street-life.js?v=9.1','street-details.js?v=8.1','bridge-event.js?v=9.2',
    'bridge-art.js?v=9.2','people-frames.js','people-masks.js','wardrobe.js?v=5.2.1',
    'inhabitants.js?v=19-song-autumn-wardrobe','featured-characters.js?v=9-yield-preparation','districts.js?v=6.0'
  ];
  let loading=null;
  let sceneStarted=false;
  let warmed=false;
  function warm(){
    if(warmed)return;warmed=true;
    for(const src of ['assets/street-empty-fast.webp',
      'assets/people-ink.webp','assets/featured-characters-v7.webp','assets/boat.webp']){
      const link=document.createElement('link');link.rel='preload';link.as='image';link.href=src;document.head.append(link);
    }
    for(const src of ['scene.js?v=24-song-autumn-wardrobe','water-three.js?v=3-world-cache','vendor/three.module.js','vendor/three.core.js']){
      const link=document.createElement('link');link.rel='modulepreload';link.href=src.startsWith('vendor/')?src:`src/${src}`;document.head.append(link);
    }
  }

  function add(src,module=false){
    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src=`src/${src}`;script.async=false;
      if(module)script.type='module';script.onload=resolve;script.onerror=()=>reject(new Error(`Failed to load ${src}`));
      document.body.append(script);
    });
  }

  window.loadQingmingScene=()=>{
    if(document.body.classList.contains('ready'))return Promise.resolve();
    if(loading)return loading;
    loading=(async()=>{
      warm();
      // async=false preserves insertion/execution order while every request
      // is in flight together, rather than paying one round trip per script.
      await Promise.all(scripts.map(src=>add(src)));
      let cleanup;
      const ready=new Promise((resolve,reject)=>{
        const success=()=>resolve();
        const failure=()=>reject(new Error('Scene assets failed to load'));
        const timer=setTimeout(()=>reject(new Error('Scene loading timed out')),30000);
        cleanup=()=>{clearTimeout(timer);removeEventListener('atlas-ready',success);removeEventListener('atlas-error',failure);};
        addEventListener('atlas-ready',success,{once:true});
        addEventListener('atlas-error',failure,{once:true});
      });
      // ES modules execute once per page. A failed scene needs a page reload,
      // not a second module tag that can wait forever for another ready event.
      sceneStarted=true;
      try{await Promise.all([add('scene.js?v=24-song-autumn-wardrobe',true),ready]);}
      finally{cleanup();}
    })().catch(error=>{if(!sceneStarted)loading=null;throw error;});
    return loading;
  };
  const prepare=()=>{
    if(location.protocol==='file:')return;
    if(navigator.connection?.saveData)return;
    const start=()=>{window.loadQingmingScene().catch(()=>{});};
    if(window.requestIdleCallback)requestIdleCallback(start,{timeout:1500});
    else setTimeout(start,300);
  };
  if(document.readyState==='complete')prepare();
  else window.addEventListener('load',prepare,{once:true});
})();
