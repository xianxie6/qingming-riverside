import * as THREE from '../vendor/three.module.js';

const vertexShader=`
varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}
`;
const riverSurfaceShader=`
float heightAt(vec2 p){
 p=vec2(p.x-uTime*8.,(p.y-uBankY+2.)*3.3);
 float h=0.;
 // Deep-water dispersion: shorter waves travel more slowly; no sliding grid.
 for(int i=0;i<7;i++){
  float f=float(i),k=.065+f*.029;
  vec2 d=normalize(vec2(cos(f*2.399),sin(f*2.399)));
  h+=sin(dot(p,d)*k-sqrt(58.*k)*uTime+f*3.71)*(.62/(1.+f*.65));
 }
 return h;
}
vec3 shadeRiver(vec3 base,float spec,float h){
  vec3 col=mix(base,vec3(.30,.37,.35),.16);
  col+=vec3(.88,.87,.75)*(spec*.19);
  col-=vec3(.04)*smoothstep(-.1,.65,h);
  return col;
}
`;
const fragmentShader=`
precision highp float;
uniform float uTime,uPass,uBankY,uBackdropHeight;
uniform vec4 uView,uBackdropRect;
uniform sampler2D uBackdrop;
varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
${riverSurfaceShader}
void main(){
 vec2 p=vec2(uView.x+vUv.x*uView.z,uView.y+(1.-vUv.y)*uView.w);
 if(uPass<.5){
  float bank=smoothstep(uBankY,uBankY+16.,p.y);if(bank<.001)discard;
  float h=heightAt(p),dx=(heightAt(p+vec2(.7,0.))-h)/.7,dy=(heightAt(p+vec2(0.,.7))-h)/.7;
  vec3 normal=normalize(vec3(-dx,-dy*.32,1.));
  float spec=pow(max(dot(normal,normalize(vec3(-.22,-.28,1.))),0.),48.);
  vec2 offset=vec2(dx*16.,dy*3.4)*bank;
  vec2 samplePosition=p+offset;
  vec2 uv=vec2((samplePosition.x-uBackdropRect.x)/uBackdropRect.z,1.-(samplePosition.y-uBackdropRect.y)/uBackdropRect.w);
  uv=clamp(uv,vec2(.001),vec2(.999));
  vec3 base=texture2D(uBackdrop,uv).rgb;
  vec3 col=shadeRiver(base,spec,h);
  gl_FragColor=vec4(col,bank*.9);
 }else{
  // Advect texture by free-fall travel time, so streaks accelerate downward.
  float y=p.y-367.,g=185.,v0=35.;
  float tau=(sqrt(v0*v0+2.*g*max(y,0.))-v0)/g;
  float center=-1505.2-15.*exp(-max(y,0.)/18.);
  float width=13.+4.*clamp(y/173.,0.,1.);
  float edge=1.-smoothstep(width-2.,width+2.,abs(p.x-center));
  float mask=edge*smoothstep(365.,372.,p.y)*(1.-smoothstep(535.,546.,p.y));
  float threads=noise(vec2((p.x-center)*.55,(tau-uTime)*7.));
  float fine=noise(vec2((p.x-center)*1.8,(tau-uTime)*16.));
  float white=smoothstep(.38,.77,threads*.75+fine*.25);
  vec3 col=mix(vec3(.46,.53,.49),vec3(.94,.94,.84),white);
  float alpha=mask*(.28+white*.56);
  vec2 q=vec2(p.x+1505.2,(p.y-542.)*3.8);
  float r=length(q),foam=(1.-smoothstep(8.,40.,r))*noise(p*vec2(.30,.7)-vec2(uTime*1.8,uTime*3.));
  float ring=pow(.5+.5*sin(r*.52-uTime*5.5),14.)*exp(-r*.028)*smoothstep(12.,23.,r);
  float impact=max(foam*.86,ring*.27)*smoothstep(533.,541.,p.y);
  col=mix(col,vec3(.94,.94,.85),impact/max(alpha+impact,.001));
  alpha=max(alpha,impact);
  if(alpha<.005)discard;gl_FragColor=vec4(col,alpha);
 }
}
`;

export class ThreeWaterRenderer{
 static get riverSurfaceShader(){return riverSurfaceShader;}
 constructor({bankY=542}={}){
  this.active=false;this.bankY=bankY;
  try{
   this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,premultipliedAlpha:true});
   this.renderer.setClearColor(0,0);
   this.scene=new THREE.Scene();this.camera=new THREE.Camera();
   this.uniforms={uTime:{value:0},uPass:{value:0},uBankY:{value:bankY},uBackdropHeight:{value:1},uView:{value:new THREE.Vector4()},uBackdropRect:{value:new THREE.Vector4()},uBackdrop:{value:null}};
   this.material=new THREE.ShaderMaterial({vertexShader,fragmentShader,uniforms:this.uniforms,transparent:true,depthTest:false,depthWrite:false});
   this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),this.material));
   this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.active=false;});
   this.renderer.domElement.addEventListener('webglcontextrestored',()=>{this.backdropKey=undefined;this.active=true;});
   this.active=true;
  }catch(error){console.warn('Water uses Canvas fallback',error);}
 }
 resize(width,height,dpr=1){
  if(!this.active||width===this.width&&height===this.height&&dpr===this.dpr)return;
  this.width=width;this.height=height;this.dpr=dpr;
  this.renderer.setPixelRatio(Math.min(dpr,1.35));this.renderer.setSize(width,height,false);
 }
 render({time,camera,viewY,width,height,scale,source,sourceRect,backdropKey,pass=0}){
  if(!this.active)return null;
  const clamp=(n,max)=>Math.max(0,Math.min(max,n));
  const left=pass?clamp(Math.floor((-1665-camera)*scale),width):0;
  const right=pass?clamp(Math.ceil((-1345-camera)*scale),width):width;
  const top=clamp(Math.floor(((pass?365:this.bankY??542)-viewY)*scale),height);
  const bottom=pass?clamp(Math.ceil((585-viewY)*scale),height):height;
  this.region={left,top,width:right-left,height:bottom-top,camera,viewY,scale,viewWidth:width,viewHeight:height};
  // Zoomed views above the bank do not need a texture upload or water pass.
  if(right<=left||bottom<=top)return null;
  if(source){
   // Only the river pixels can be sampled by this shader. Keep a 20-world-
   // unit margin for displaced samples, retaining the source pixel density.
   const rect=sourceRect??{x:camera,y:viewY,width:width/scale,height:height/scale};
   const cropTop=Math.max(0,Math.min(source.height-1,Math.floor(((this.bankY??542)-20-rect.y)*source.height/rect.height)));
   const cropHeight=source.height-cropTop;
   this.backdropSource??=document.createElement('canvas');
   const resized=this.backdropWidth!==source.width||this.backdropHeight!==cropHeight;
   if(!this.backdrop||resized){
    this.backdrop?.dispose();this.backdropKey=undefined;
    this.backdropWidth=source.width;this.backdropHeight=cropHeight;
    this.backdropSource.width=source.width;this.backdropSource.height=cropHeight;
    this.backdrop=new THREE.CanvasTexture(this.backdropSource);
    this.backdrop.minFilter=THREE.LinearFilter;this.backdrop.generateMipmaps=false;
    this.uniforms.uBackdrop.value=this.backdrop;
   }
   // The backdrop contains architecture and wet ground, not animated actors.
   // Upload again only when the view or wetness changes.
   if(backdropKey===undefined||backdropKey!==this.backdropKey){
    this.backdropSource.getContext('2d').drawImage(source,0,cropTop,source.width,cropHeight,0,0,source.width,cropHeight);
    this.backdrop.needsUpdate=true;this.backdropKey=backdropKey;
   }
   this.uniforms.uBackdropHeight.value=cropHeight/source.height;
   this.uniforms.uBackdropRect?.value?.set(rect.x,rect.y+cropTop*rect.height/source.height,rect.width,cropHeight*rect.height/source.height);
  }
  // Simulation time already freezes on pause. Never reset it to zero.
  this.uniforms.uTime.value=time;this.uniforms.uPass.value=pass;
  this.uniforms.uView.value.set(camera,viewY,width/scale,height/scale);
  // Scissor before the fragment shader: the waterfall otherwise evaluates
  // its noise over the entire viewport, only to discard almost every pixel.
  this.renderer.setScissor(left,height-bottom,right-left,bottom-top);
  this.renderer.setScissorTest(true);
  this.renderer.render(this.scene,this.camera);return this.renderer.domElement;
 }
 composite(ctx,layer){
  if(!layer)return;
  const r=this.region,sx=layer.width/r.viewWidth,sy=layer.height/r.viewHeight;
  ctx.drawImage(layer,r.left*sx,r.top*sy,r.width*sx,r.height*sy,
   r.camera+r.left/r.scale,r.viewY+r.top/r.scale,r.width/r.scale,r.height/r.scale);
 }
}
