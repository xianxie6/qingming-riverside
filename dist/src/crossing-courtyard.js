import * as THREE from '../vendor/three.module.js';
import {ease} from './crossing-motion.js?v=13-soft';
import {createParticleHero} from './crossing-hero.js?v=16-performance';

export async function createCourtyard(keep,mobile,particleCount){
  const scene=new THREE.Scene();scene.background=new THREE.Color('#bbc5c4');scene.fog=new THREE.FogExp2('#bbc5c4',.012);
  const camera=new THREE.PerspectiveCamera(39,1,.1,120);
  const target=keep(new THREE.WebGLRenderTarget(1,1));target.texture.colorSpace=THREE.SRGBColorSpace;target.samples=mobile?0:2;
  scene.add(new THREE.HemisphereLight('#f4f2e8','#6f7a7b',1.25));
  const key=new THREE.DirectionalLight('#fff6e5',2.5);key.position.set(-5,9,6);scene.add(key);
  const rim=new THREE.DirectionalLight('#d4f2ff',2.8);rim.position.set(4,6,-4);scene.add(rim);
  const fill=new THREE.DirectionalLight('#a4b5c4',.5);fill.position.set(5,2,4);scene.add(fill);
  const [backdrop,hero]=await Promise.all([new THREE.TextureLoader().loadAsync('assets/crossing-courtyard-painted-v2.webp').then(keep),createParticleHero(keep,mobile,particleCount)]);
  backdrop.colorSpace=THREE.SRGBColorSpace;scene.background=backdrop;
  let seed=821;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  scene.add(hero.object);
  // Soft contact shade anchors the figure to its stone terrace.
  const shadeCanvas=document.createElement('canvas');shadeCanvas.width=shadeCanvas.height=128;const sc=shadeCanvas.getContext('2d'),gradient=sc.createRadialGradient(64,64,2,64,64,64);gradient.addColorStop(0,'#26333c88');gradient.addColorStop(1,'#26333c00');sc.fillStyle=gradient;sc.fillRect(0,0,128,128);
  const shadowMap=keep(new THREE.CanvasTexture(shadeCanvas));const shadow=new THREE.Mesh(keep(new THREE.PlaneGeometry(3.8,3.8)),keep(new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false})));shadow.rotation.x=-Math.PI/2;shadow.position.y=.003;scene.add(shadow);
  const dustPositions=[];for(let i=0;i<350;i++)dustPositions.push((random()-.5)*24,random()*9,(random()-.5)*20);
  const dustGeo=keep(new THREE.BufferGeometry());dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(dustPositions,3));const dust=new THREE.Points(dustGeo,keep(new THREE.PointsMaterial({color:'#f2ffff',size:.018,transparent:true,opacity:.5,depthWrite:false})));scene.add(dust);
  // Triangulated scanning cage surrounding the artwork, open at top and bottom.
  const cageGeometry=keep(new THREE.CylinderGeometry(2.25,2.5,5.7,36,20,true));
  const cageMaterial=keep(new THREE.MeshBasicMaterial({color:'#bdfff0',wireframe:true,transparent:true,opacity:.14,depthWrite:false}));
  const cage=new THREE.Mesh(cageGeometry,cageMaterial);cage.position.y=2.35;scene.add(cage);
  const labels=[];
  for(let i=0;i<6;i++){
    const c=document.createElement('canvas');c.width=128;c.height=64;
    const map=keep(new THREE.CanvasTexture(c));map.colorSpace=THREE.SRGBColorSpace;
    const sprite=new THREE.Sprite(keep(new THREE.SpriteMaterial({map,transparent:true,depthTest:false,opacity:1})));
    sprite.scale.set(.82,.41,1);scene.add(sprite);labels.push({canvas:c,map,sprite});
  }
  let burstStart=-100,lastTime=0,lastNumber=-1,greetingStart=null;
  let pointerX=0,pointerY=0;const cursor=new THREE.Vector3(),ray=new THREE.Vector3();
  return {burst(){burstStart=lastTime;},texture:target.texture,count:hero.count,render(renderer,progress,time,width,height,pointer,departing=false){
    const blend=ease(.685,.765,progress);if(!blend)return 0;
    const w=Math.round(width),h=Math.round(height);if(target.width!==w||target.height!==h)target.setSize(w,h);
    lastTime=time;
    const formation=ease(.735,.925,progress);
    const age=time-burstStart,disperse=ease(0,.8,age)*(1-ease(1.5,5.5,age));
    if(progress<.94)greetingStart=null;
    if(progress>=.94&&greetingStart===null)greetingStart=time;
    const greetingAge=greetingStart===null?0:time-greetingStart;
    const settled=ease(0,2.2,greetingAge);
    cage.rotation.y=time*.035;cageMaterial.opacity=(.38+disperse*.20)*(1-settled);
    const tick=Math.floor(time*5);
    labels.forEach((label,i)=>{
      label.sprite.material.opacity=1-settled;
      const angle=i/6*Math.PI*2+time*.025;
      label.sprite.position.set(Math.cos(angle)*2.65,.45+i*.78,Math.sin(angle)*.8+.4);
      if(tick!==lastNumber){const ctx=label.canvas.getContext('2d');ctx.clearRect(0,0,128,64);ctx.font='bold 26px monospace';const text='+ '+String((tick*7+i*137)%1000).padStart(3,'0');ctx.lineWidth=4;ctx.strokeStyle='#294d49';ctx.shadowColor='#aaffee';ctx.shadowBlur=9;ctx.strokeText(text,7,39);ctx.fillStyle='#e2fff7';ctx.fillText(text,7,39);label.map.needsUpdate=true;}
    });lastNumber=tick;
    pointerX+=((pointer?.x||0)-pointerX)*.025;pointerY+=((pointer?.y||0)-pointerY)*.025;
    pointerX=THREE.MathUtils.clamp(pointerX,-1,1);pointerY=THREE.MathUtils.clamp(pointerY,-1,1);
    const portrait=width/height<.8,approach=ease(.72,.91,progress),angle=.025+pointerX*.035;
    const distance=portrait?14.5:11-approach*.5;
    camera.aspect=width/height;
    const imageAspect=backdrop.image.width/backdrop.image.height;
    if(camera.aspect<imageAspect){backdrop.repeat.set(camera.aspect/imageAspect,1);backdrop.offset.set((1-backdrop.repeat.x)/2,0);}else{backdrop.repeat.set(1,imageAspect/camera.aspect);backdrop.offset.set(0,(1-backdrop.repeat.y)/2);}
    camera.updateProjectionMatrix();camera.position.set(Math.sin(angle)*distance,2.65+pointerY*.15,Math.cos(angle)*distance);camera.lookAt(0,2.0,0);camera.updateMatrixWorld();
    if(Math.abs(pointerX)+Math.abs(pointerY)>.025){ray.set(pointerX,-pointerY,.5).unproject(camera).sub(camera.position).normalize();cursor.copy(camera.position).addScaledVector(ray,-camera.position.z/ray.z);hero.update(formation,time,cursor,disperse,greetingAge,departing);}else hero.update(formation,time,null,disperse,greetingAge,departing);
    const lead=ease(.95,1,progress);
    hero.object.position.x=departing?lead*.85:0;
    hero.object.rotation.y=departing?-lead*.22:0;
    camera.position.z-=departing?lead*1.8:0;camera.updateMatrixWorld();
    shadow.position.x=hero.object.position.x;
    shadow.material.opacity=formation*.85;dust.rotation.y=time*.012;
    renderer.setRenderTarget(target);renderer.render(scene,camera);renderer.setRenderTarget(null);return blend;
  }};
}
