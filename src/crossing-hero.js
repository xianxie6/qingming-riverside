import * as THREE from '../vendor/three.module.js';

// Painted color samples form a shallow 3D particle relief, not a full character mesh.
export async function createParticleHero(keep,mobile){
  let seed=90721;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const texture=await new THREE.TextureLoader().loadAsync('assets/crossing-painter-v2.png');
  const canvas=document.createElement('canvas'),width=texture.image.width,height=texture.image.height;
  canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(texture.image,0,0);const pixels=ctx.getImageData(0,0,width,height).data;texture.dispose();
  const count=mobile?60000:160000,geometry=keep(new THREE.SphereGeometry(1,6,4));
  const bow={value:0},gather={value:0},time={value:0},hover={value:0},burst={value:0},touch={value:new THREE.Vector3(99,99,99)};
  const material=keep(new THREE.MeshBasicMaterial({color:'#ffffff'}));
  material.onBeforeCompile=shader=>{
    shader.uniforms.uBow=bow;shader.uniforms.uHover=hover;shader.uniforms.uBurst=burst;shader.uniforms.uGather=gather;shader.uniforms.uTime=time;shader.uniforms.uTouch=touch;
    shader.vertexShader='attribute vec3 aScatter;attribute float aPhase;attribute float aRadius;uniform float uBow;uniform float uHover;uniform float uBurst;uniform float uGather;uniform float uTime;uniform vec3 uTouch;varying float vMotion;\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      float arrival=smoothstep(aPhase*.12,.85+aPhase*.12,uGather);
      float loose=max(1.-arrival,uBurst);vec3 drift=vec3(sin(uTime*.53+aPhase*50.),cos(uTime*.47+aPhase*30.),sin(uTime*.41+aPhase*70.));
      transformed+=aScatter*loose+drift*(.002+.16*loose)/aRadius;
      vec3 vortex=vec3(cos(uTime*.36+aPhase*6.283),sin(uTime*.29+aPhase*4.),sin(uTime*.36+aPhase*6.283));
      transformed+=vortex*(loose*sin((1.-loose)*3.14159)*1.8)/aRadius;
      vec3 center=instanceMatrix[3].xyz+aScatter*aRadius*loose;
      vec3 delta=center-uTouch;float distanceSq=dot(delta,delta);
      float influence=exp(-distanceSq/1.15)*uHover;
      transformed+=(delta/sqrt(distanceSq+.20))*.32*influence/aRadius;
      // Bend the painted upper body gently; feet stay anchored to the terrace.
      vec3 painted=instanceMatrix[3].xyz;
      float upper=smoothstep(1.6,3.8,painted.y)*(1.-loose);
      transformed.y-=upper*uBow*.12/aRadius;
      transformed.z+=upper*uBow*.18/aRadius;
      vMotion=max(sin(arrival*3.14159),uBurst);`);
    shader.fragmentShader='varying float vMotion;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n diffuseColor.rgb+=vec3(.07,.055,.025)*vMotion;');
  };
  const grains=new THREE.InstancedMesh(geometry,material,count);grains.frustumCulled=false;
  const scatter=new Float32Array(count*3),phases=new Float32Array(count),radii=new Float32Array(count),dummy=new THREE.Object3D(),p=new THREE.Vector3();
  for(let i=0;i<count;i++){
    let x,y,offset;
    do{x=Math.floor(random()*width);y=Math.floor(random()*height);offset=(y*width+x)*4;}while(pixels[offset+3]<245);
    const py=(1-y/height)*4.7,px=(x/width-.5)*4.7*width/height;
    // A shallow relief keeps the painted facial features intact during parallax.
    const depth=.10*Math.cos(px*2)+.035*Math.sin(py*2)+(random()-.5)*.013;
    p.set(px,py,depth);
    const radius=(mobile?.0105:.0075)*(.85+random()*.25);
    dummy.position.copy(p);dummy.scale.setScalar(radius);dummy.updateMatrix();grains.setMatrixAt(i,dummy.matrix);
    const color=new THREE.Color().setRGB(pixels[offset]/255,pixels[offset+1]/255,pixels[offset+2]/255,THREE.SRGBColorSpace);
    grains.setColorAt(i,color);
    const angle=random()*Math.PI*2,spread=2+random()*4;
    scatter[i*3]=(Math.cos(angle)*spread-p.x)/radius;scatter[i*3+1]=(random()*5.5-p.y+.1)/radius;scatter[i*3+2]=(Math.sin(angle)*spread-p.z)/radius;
    phases[i]=random();radii[i]=radius;
  }
  geometry.setAttribute('aScatter',new THREE.InstancedBufferAttribute(scatter,3));geometry.setAttribute('aPhase',new THREE.InstancedBufferAttribute(phases,1));geometry.setAttribute('aRadius',new THREE.InstancedBufferAttribute(radii,1));
  let lastUpdate=null;
  return {object:grains,count,update(progress,seconds,cursor,disperse=0,greetingAge=0,departing=false){
    const dt=lastUpdate===null?1/60:Math.min(.08,Math.max(0,seconds-lastUpdate));lastUpdate=seconds;
    bow.value=departing?0:Math.sin(Math.min(1,greetingAge/2.4)*Math.PI);
    burst.value=disperse;gather.value=progress;time.value=seconds;
    hover.value+=((cursor?1:0)-hover.value)*(1-Math.exp(-dt*3.2));
    if(cursor){if(touch.value.x===99)touch.value.copy(cursor);else touch.value.lerp(cursor,1-Math.exp(-dt*5));}
  }};
}
