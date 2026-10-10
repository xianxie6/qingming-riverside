import * as THREE from '../vendor/three.module.js';
import {ThreeWaterRenderer} from './water-three.js?v=2-shared-river';

export const waterLevel=.015;
const vertexShader=`
uniform mat4 reflectionMatrix;varying vec3 worldPosition;varying vec4 mirrorCoord;
void main(){vec4 world=modelMatrix*vec4(position,1.);worldPosition=world.xyz;mirrorCoord=reflectionMatrix*world;gl_Position=projectionMatrix*viewMatrix*world;}
`;
const fragmentShader=`
uniform float uTime,uBankY,ring,ringOpacity;uniform sampler2D inkMap,reflectionMap;
uniform vec3 eye;uniform vec2 paddle;uniform vec4 ripples[12];
varying vec3 worldPosition;varying vec4 mirrorCoord;
${ThreeWaterRenderer.riverSurfaceShader}
vec3 encoded(vec3 c){return mix(c*12.92,1.055*pow(max(c,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),c));}
vec3 linear(vec3 c){return mix(c/12.92,pow((max(c,vec3(0.))+.055)/1.055,vec3(2.4)),step(vec3(.04045),c));}
float mirror(float value){return 1.-abs(mod(value,2.)-1.);}
float line(float radius,float distance){float width=max(.006,fwidth(distance)*.8);return 1.-smoothstep(width,width*2.,abs(distance-radius));}
void main(){
  vec2 p=worldPosition.xz;
  // Evaluate the street renderer in the same painted-pixel coordinate scale.
  vec2 painted=vec2(p.x*92.,uBankY+(p.y+18.)*12.);
  float h=heightAt(painted),dx=(heightAt(painted+vec2(.7,0.))-h)/.7,dy=(heightAt(painted+vec2(0.,.7))-h)/.7;
  vec3 normal=normalize(vec3(-dx,-dy*.32,1.));
  float spec=pow(max(dot(normal,normalize(vec3(-.22,-.28,1.))),0.),48.);
  // Summer water is already used by the street scene. Only the river below
  // the quay is sampled; displacement, shade and highlights are shared code.
  vec2 uv=vec2(mirror(.47+p.x*.044),.015+mirror((p.y+12.)*.17)*.10);
  uv+=vec2(dx*16./2171.,-dy*3.4/724.);uv.y=clamp(uv.y,.01,.13);
  vec3 color=linear(shadeRiver(encoded(texture2D(inkMap,uv).rgb),spec,h));
  vec3 n=normalize(vec3(-dx,1.,-dy*.32)),view=normalize(eye-worldPosition);
  vec2 reflectionUv=clamp(mirrorCoord.xy/mirrorCoord.w+n.xz*.013,vec2(.003),vec2(.997));
  float reflectance=.025+.055*pow(1.-max(0.,dot(n,view)),3.);
  color=mix(color,texture2D(reflectionMap,reflectionUv).rgb,reflectance);
  float distanceToBlade=length(p-paddle);
  color=mix(color,linear(vec3(.87,.85,.75)),line(ring,distanceToBlade)*ringOpacity*.4);
  // The same three expanding, fading rings used by scene.js boat impulses.
  for(int i=0;i<12;i++){
    float age=uTime-ripples[i].z;
    if(age>0.&&age<3.8){
      vec2 q=p-ripples[i].xy-vec2(age*.035,0.);
      float distance=length(q),fade=pow(1.-age/3.8,2.)*ripples[i].w;
      for(int j=0;j<3;j++){
        float radius=.07+age*.34-float(j)*.09;
        if(radius>0.){
          float opacity=fade*line(radius,distance)*(j==1?.30:.65);
          vec3 ink=j==1?vec3(.322,.388,.353):vec3(.933,.914,.831);
          color=mix(color,linear(ink),opacity);
        }
      }
    }
  }
  float distanceToEye=length(eye-worldPosition);
  float shadow=exp(-pow(p.y*.32,2.))*exp(-pow(p.x/8.,8.));color*=1.-shadow*.07;
  color=mix(color,vec3(.64,.62,.49),1.-exp(-pow(distanceToEye*.004,2.)));
  gl_FragColor=vec4(color,1.);
  #include <colorspace_fragment>
}`;

export async function createRiverWater(keep,{reflection,textureMatrix,effects}){
  const texture=keep(await new THREE.TextureLoader().loadAsync('assets/crossing-river-summer.webp'));
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
  const ripples=Array.from({length:12},()=>new THREE.Vector4(0,0,-100,0));
  const uniforms={uTime:{value:0},uBankY:{value:542},inkMap:{value:texture},reflectionMap:{value:reflection.texture},reflectionMatrix:{value:textureMatrix},
    eye:{value:new THREE.Vector3()},paddle:{value:new THREE.Vector2()},ring:{value:0},ringOpacity:{value:0},ripples:{value:ripples}};
  const mesh=new THREE.Mesh(keep(new THREE.PlaneGeometry(240,240)),keep(new THREE.ShaderMaterial({uniforms,vertexShader,fragmentShader})));
  mesh.rotation.x=-Math.PI/2;mesh.position.y=waterLevel;
  let previousBoat=null,previousPower=0,rippleIndex=0,lastWake=0;
  const emit=(x,z,time,strength)=>{ripples[rippleIndex].set(x,z,time,strength);rippleIndex=(rippleIndex+1)%ripples.length;};
  return {mesh,update(time,dt,eye,boat,blade){
    uniforms.uTime.value=time;uniforms.eye.value.copy(eye);uniforms.paddle.value.set(blade.x,blade.z);
    const stroke=effects.strokeEffect(time,3.6);
    uniforms.ring.value=stroke.ring*.025;uniforms.ringOpacity.value=stroke.opacity;
    if(stroke.power>.16&&previousPower<=.16)emit(blade.x,blade.z,time,1);
    if(previousBoat&&dt>0){const speed=Math.hypot(boat.x-previousBoat.x,boat.z-previousBoat.y)/dt;
      if(speed>.1&&speed<8&&time-lastWake>.32){emit(boat.x,boat.z+1.9,time,Math.min(1,speed/.9));lastWake=time;}}
    previousPower=stroke.power;previousBoat??=new THREE.Vector2();previousBoat.set(boat.x,boat.z);
  }};
}
