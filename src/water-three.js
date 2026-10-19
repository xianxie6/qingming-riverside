import * as THREE from '../vendor/three.module.js';

const vertexShader=`
varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}
`;
const riverSurfaceShader=`
// River current: slow along the bank, quicker in the channel (world px/s).
float currentAt(float depth){return 7.+15.*smoothstep(0.,110.,depth);}
// Small wind and current ripples, stretched along the flow.
float ripples(vec2 p){
 vec2 q=vec2(p.x*.05,p.y*.34);
 return noise(q)*.52+noise(q*2.07+vec2(5.2,1.3))*.31+noise(q*4.3+vec2(1.7,8.4))*.17;
}
// Two copies of the ripple field travel with the current and are crossfaded,
// so faster mid-river water never shears the pattern apart.
float advected(vec2 p,float speed){
 float period=7.,a=fract(uTime/period),b=fract(uTime/period+.5);
 float wa=1.-abs(a*2.-1.);
 float ra=ripples(p-vec2(speed*a*period,0.));
 float rb=ripples(p-vec2(speed*b*period,0.)+vec2(41.,17.));
 return mix(rb,ra,wa);
}
// Long pale seams drifting with the current, crossfaded the same way.
float seams(vec2 p,float speed){
 float period=11.,a=fract(uTime/period),b=fract(uTime/period+.5);
 float wa=1.-abs(a*2.-1.);
 float sa=noise(vec2((p.x-speed*a*period)*.012,p.y*.16));
 float sb=noise(vec2((p.x-speed*b*period)*.012+3.7,p.y*.16+5.1));
 return smoothstep(.6,.88,mix(sb,sa,wa));
}
float heightAt(vec2 p){
 float depth=p.y-bankAt(p.x);
 float speed=currentAt(depth);
 vec2 s=vec2(p.x-uTime*8.,(p.y-uBankY+2.)*3.3);
 float h=0.;
 // Long, gentle swell; shorter waves travel more slowly.
 for(int i=0;i<5;i++){
  float f=float(i),k=.05+f*.026;
  vec2 d=normalize(vec2(cos(f*2.399),sin(f*2.399)));
  h+=sin(dot(s,d)*k-sqrt(58.*k)*uTime+f*3.71)*(.42/(1.+f*.65));
 }
 return h+(advected(p,speed)-.5)*2.2*smoothstep(0.,14.,depth);
}
vec3 shadeRiver(vec3 base,float spec,float h,float streak){
  vec3 col=mix(base,vec3(.30,.37,.35),.14);
  col+=vec3(.92,.90,.78)*(spec*.24);
  col-=vec3(.045)*smoothstep(-.2,.9,h);
  col=mix(col,col*vec3(.93,.95,.94),streak*.35);
  return col;
}
`;
const fragmentShader=`
precision highp float;
uniform float uTime,uPass,uBankY,uBackdropHeight,uBankStepX,uBankStepY,uFadeY;
uniform vec4 uView,uBackdropRect;
uniform sampler2D uBackdrop;
varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
float bankAt(float x){return x>uBankStepX?uBankStepY:uBankY;}
${riverSurfaceShader}
void main(){
 vec2 p=vec2(uView.x+vUv.x*uView.z,uView.y+(1.-vUv.y)*uView.w);
 if(uPass<.5){
  float bankY=bankAt(p.x);
  float bank=smoothstep(bankY,bankY+16.,p.y);if(bank<.001)discard;
  float h=heightAt(p),dx=(heightAt(p+vec2(.7,0.))-h)/.7,dy=(heightAt(p+vec2(0.,.7))-h)/.7;
  vec3 normal=normalize(vec3(-dx,-dy*.32,1.));
  float spec=pow(max(dot(normal,normalize(vec3(-.22,-.28,1.))),0.),40.);
  float depth=p.y-bankY;
  float streak=seams(p,currentAt(depth))*smoothstep(4.,30.,depth);
  vec2 offset=vec2(dx*16.,dy*3.4)*bank;
  vec2 samplePosition=p+offset;
  vec2 uv=vec2((samplePosition.x-uBackdropRect.x)/uBackdropRect.z,1.-(samplePosition.y-uBackdropRect.y)/uBackdropRect.w);
  uv=clamp(uv,vec2(.001),vec2(.999));
  vec3 base=texture2D(uBackdrop,uv).rgb;
  vec3 col=shadeRiver(base,spec,h,streak);
  // Past the painting's lower edge the water dissolves into the paper.
  float fade=1.-smoothstep(uFadeY-24.,uFadeY+56.,p.y);if(fade<.001)discard;
  gl_FragColor=vec4(col,bank*.9*fade);
 }else{
  // Advect texture by free-fall travel time, so streaks accelerate downward.
  float y=p.y-367.,g=185.,v0=35.;
  float tau=(sqrt(v0*v0+2.*g*max(y,0.))-v0)/g;
  float fall=clamp(y/173.,0.,1.);
  float center=-1505.2-15.*exp(-max(y,0.)/18.)+sin(uTime*1.3+y*.05)*.6*fall;
  float width=12.+5.5*fall;
  float across=p.x-center;
  // Ragged edges: the sheet frays into strands as it falls.
  float fray=noise(vec2(across*.35,(tau-uTime)*5.))*(2.+5.*fall);
  float edge=1.-smoothstep(width-2.5-fray,width+1.5,abs(across));
  float mask=edge*smoothstep(363.,371.,p.y)*(1.-smoothstep(536.,546.,p.y));
  float threads=noise(vec2(across*.85,(tau-uTime)*7.));
  float fine=noise(vec2(across*2.6,(tau-uTime)*17.));
  float white=smoothstep(.3,.8,threads*.62+fine*.38);
  // Lower down the sheet breaks open, letting the buckets show through.
  float holes=smoothstep(.55,.85,noise(vec2(across*.45,(tau-uTime)*3.2+9.)))*fall*.75;
  vec3 col=mix(vec3(.62,.68,.64),vec3(.96,.96,.88),white);
  float core=1.-smoothstep(0.,width,abs(across));
  float alpha=mask*(.42+white*.48+core*.14)*(1.-holes);
  // Spray thrown off the edges near the bottom.
  float spray=step(.93,noise(vec2(across*1.6,(tau-uTime)*22.)))*smoothstep(width-3.,width+6.,abs(across))*(1.-smoothstep(width+6.,width+14.,abs(across)))*smoothstep(460.,520.,p.y)*(1.-smoothstep(538.,548.,p.y));
  col=mix(col,vec3(.97,.97,.9),spray);alpha=max(alpha,spray*.75);
  // Impact: churning foam, outward rings and a rising mist.
  vec2 q=vec2(p.x+1505.2,(p.y-542.)*3.8);
  float r=length(q);
  float churn=noise(p*vec2(.32,.8)-vec2(uTime*1.6,uTime*3.4))*.6+noise(p*vec2(.9,1.9)+vec2(uTime*2.3,-uTime*4.))*.4;
  float foam=(1.-smoothstep(6.,38.,r))*smoothstep(.32,.7,churn);
  float ring=pow(.5+.5*sin(r*.5-uTime*5.),12.)*exp(-r*.026)*smoothstep(12.,24.,r);
  float impact=max(foam*.9,ring*.3)*smoothstep(532.,540.,p.y);
  vec2 m=vec2((p.x+1505.2)*.08,(p.y-536.)*.09+uTime*.55);
  float mist=noise(m)*noise(m*2.3+3.)*1.6;
  mist*=(1.-smoothstep(10.,46.,abs(p.x+1505.2)))*smoothstep(560.,532.,p.y)*smoothstep(488.,522.,p.y);
  col=mix(col,vec3(.94,.94,.86),impact/max(alpha+impact,.001));
  alpha=max(alpha,impact);
  col=mix(col,vec3(.92,.93,.88),mist*.4/max(alpha+mist*.4,.001));
  alpha=max(alpha,mist*.32);
  if(alpha<.005)discard;gl_FragColor=vec4(col,alpha);
 }
}
`;

export class ThreeWaterRenderer{
 static get riverSurfaceShader(){return riverSurfaceShader;}
 // `bankStep` lets a wider scroll lower the waterline east of a world x.
 // `fadeY` ends the river softly where a page shows paper below the painting.
 constructor({bankY=542,bankStep=null,fadeY=1e9}={}){
  this.active=false;this.bankY=bankY;
  try{
   this.renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,premultipliedAlpha:true});
   this.renderer.setClearColor(0,0);
   this.scene=new THREE.Scene();this.camera=new THREE.Camera();
   this.uniforms={uTime:{value:0},uPass:{value:0},uBankY:{value:bankY},uBankStepX:{value:bankStep?.x??1e9},uBankStepY:{value:bankStep?.y??bankY},uFadeY:{value:fadeY},uBackdropHeight:{value:1},uView:{value:new THREE.Vector4()},uBackdropRect:{value:new THREE.Vector4()},uBackdrop:{value:null}};
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
