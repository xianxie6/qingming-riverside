import * as THREE from '../vendor/three.module.js';
import {ease} from './crossing-motion.js';

// A separate perspective scene carries the viewer through rings, coordinates and a wire lattice.
export function createTunnel(keep){
  const scene=new THREE.Scene();scene.background=new THREE.Color('#102925');scene.fog=new THREE.FogExp2('#102925',.022);
  const camera=new THREE.PerspectiveCamera(65,1,.1,140);
  const target=keep(new THREE.WebGLRenderTarget(1,1));target.texture.colorSpace=THREE.SRGBColorSpace;
  const rings=[],glyphs=[];
  const core=keep(new THREE.MeshBasicMaterial({color:'#ebfff6'}));
  const shell=keep(new THREE.MeshBasicMaterial({color:'#81918a'}));
  const halo=alpha=>keep(new THREE.MeshBasicMaterial({color:'#a0ffdf',transparent:true,opacity:alpha,depthWrite:false,blending:THREE.AdditiveBlending}));
  const arc=keep(new THREE.TorusGeometry(3.35,.16,8,20,Math.PI*.15));
  const thin=keep(new THREE.TorusGeometry(3.12,.028,6,72));
  const mist=keep(new THREE.TorusGeometry(3.12,.15,8,72));
  const broad=keep(new THREE.TorusGeometry(3.12,.36,8,72));
  const glowMat=halo(.20),broadMat=halo(.035);
  for(let i=0;i<12;i++){
    const ring=new THREE.Group();ring.position.z=-i*7;
    for(let j=0;j<10;j++){const m=new THREE.Mesh(arc,shell);m.rotation.z=j*Math.PI/5;ring.add(m);}
    ring.add(new THREE.Mesh(thin,core),new THREE.Mesh(mist,glowMat),new THREE.Mesh(broad,broadMat));
    scene.add(ring);rings.push(ring);
  }
  const vertices=[];
  const at=(j,k)=>{const angle=j*Math.PI/12+.07*Math.sin(k*1.7+j);return [3.07*Math.cos(angle),3.07*Math.sin(angle),-k*2];};
  for(let k=0;k<44;k++)for(let j=0;j<24;j++)for(const [jj,kk] of [[j+1,k],[j,k+1],[j+1,k+1]])vertices.push(...at(j,k),...at(jj,kk));
  const lattice=keep(new THREE.BufferGeometry());lattice.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  scene.add(new THREE.LineSegments(lattice,keep(new THREE.LineBasicMaterial({color:'#bbfbe6',transparent:true,opacity:.15,blending:THREE.AdditiveBlending,depthWrite:false}))));
  const motes=[];for(let i=0;i<220;i++){const a=i*2.39996,r=1.6+(i%17)/17*1.5;motes.push(Math.cos(a)*r,Math.sin(a)*r,-i*.42);}
  const dust=keep(new THREE.BufferGeometry());dust.setAttribute('position',new THREE.Float32BufferAttribute(motes,3));const dustMaterial=keep(new THREE.PointsMaterial({color:'#f5ffe4',size:.05,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(new THREE.Points(dust,dustMaterial));
  const sheet=document.createElement('canvas');sheet.width=512;sheet.height=256;const ctx=sheet.getContext('2d');
  ctx.font='28px Menlo,monospace';ctx.fillStyle='#e4fff3';
  for(let i=0;i<24;i++)ctx.fillText(String(i*7+11).padStart(3,'0'),(i%6)*84,Math.floor(i/6)*64+36);
  const atlas=keep(new THREE.CanvasTexture(sheet));atlas.colorSpace=THREE.SRGBColorSpace;
  for(let i=0;i<40;i++){
    const tex=keep(atlas.clone());tex.repeat.set(1/6,1/4);tex.offset.set((i%6)/6,Math.floor(i%24/6)/4);tex.needsUpdate=true;
    const sprite=new THREE.Sprite(keep(new THREE.SpriteMaterial({map:tex,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending})));
    const a=i*2.4;sprite.position.set(Math.cos(a)*2.8,Math.sin(a)*2.8,-i*2.1);sprite.scale.set(.48,.36,1);scene.add(sprite);glyphs.push(sprite);
  }
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;
  const g=glowCanvas.getContext('2d'),gradient=g.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'#f8fff6');gradient.addColorStop(.12,'#bdffe1');gradient.addColorStop(.4,'#4abda980');gradient.addColorStop(1,'#0a463000');g.fillStyle=gradient;g.fillRect(0,0,128,128);
  const lightMap=keep(new THREE.CanvasTexture(glowCanvas));lightMap.colorSpace=THREE.SRGBColorSpace;dustMaterial.map=lightMap;dustMaterial.needsUpdate=true;
  const light=new THREE.Sprite(keep(new THREE.SpriteMaterial({map:lightMap,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})));light.position.z=-91;light.scale.set(15,15,1);scene.add(light);
  return {texture:target.texture,render(renderer,progress,time,width,height){
    const blend=ease(.64,.77,progress);if(!blend)return 0;
    const w=Math.round(width*.85),h=Math.round(height*.85);if(target.width!==w||target.height!==h)target.setSize(w,h);
    camera.aspect=width/height;camera.updateProjectionMatrix();camera.position.set(Math.sin(time*.16)*.10,Math.cos(time*.18)*.08,7-ease(.64,1,progress)*68);camera.lookAt(0,0,camera.position.z-20);
    rings.forEach((ring,i)=>{ring.rotation.z=Math.sin(time*.14+i)*.13+i*.09;});
    renderer.setRenderTarget(target);renderer.render(scene,camera);renderer.setRenderTarget(null);return blend;
  }};
}
