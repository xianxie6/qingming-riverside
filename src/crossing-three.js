import * as THREE from '../vendor/three.module.js';
import {createCrossingWorld} from './crossing-world.js?v=17-river';
import {createRiverWater,waterLevel} from './crossing-water.js?v=20-project-water';
import {createTraces} from './crossing-traces.js';
import {createCourtyard} from './crossing-courtyard.js?v=15-welcome';
import {createJourney,journeyPose,ease,clamp01} from './crossing-motion.js?v=13-soft';

const noise=`float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}`;

export async function createCrossing(host,signal){
  if(signal.aborted)throw new DOMException('Cancelled','AbortError');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  const resources=new Set(),keep=value=>{if(disposed)value.dispose();else resources.add(value);return value;};
  const events=new AbortController();let disposed=false,raf=0,finish=null,resize=()=>{},traces=null;
  function dispose(){
    if(disposed)return;disposed=true;cancelAnimationFrame(raf);events.abort();finish?.();
    signal.removeEventListener('abort',dispose);
    for(const resource of resources)resource.dispose();
    traces?.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();
  }
  signal.addEventListener('abort',dispose,{once:true});
  const listen=(target,type,handler,options={})=>target.addEventListener(type,handler,{...options,signal:events.signal});
  renderer.domElement.setAttribute('aria-hidden','true');host.prepend(renderer.domElement);
  listen(renderer.domElement,'webglcontextlost',event=>{event.preventDefault();dispose();});
  try{
    const mobile=host.clientWidth<600;
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:1.65));
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.10;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.shadowMap.autoUpdate=false;
    const scene=new THREE.Scene();scene.background=new THREE.Color('#e2d4b6');scene.fog=new THREE.FogExp2('#e2d4b6',.013);
    const camera=new THREE.PerspectiveCamera(44,1,.12,230);
    const hemi=new THREE.HemisphereLight('#f5e8cf','#b8a987',2.2);scene.add(hemi);
    const sun=new THREE.DirectionalLight('#fff1d8',1.7);sun.position.set(-15,24,12);sun.castShadow=true;sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);
    Object.assign(sun.shadow.camera,{left:-24,right:24,top:20,bottom:-20,near:1,far:85});sun.shadow.normalBias=.055;sun.shadow.bias=-.0002;scene.add(sun);
    const fill=new THREE.DirectionalLight('#b8d3d2',.65);fill.position.set(12,7,-16);scene.add(fill);
    const world=await createCrossingWorld(keep);if(signal.aborted){dispose();throw new DOMException('Cancelled','AbortError');}scene.add(world.root);traces=createTraces(host,world.markers);

    const reflection=keep(new THREE.WebGLRenderTarget(mobile?384:768,mobile?384:768,{type:THREE.HalfFloatType,depthBuffer:true}));
    const reflectCamera=new THREE.PerspectiveCamera(),textureMatrix=new THREE.Matrix4();
    const bias=new THREE.Matrix4().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);
    const river=await createRiverWater(keep,{reflection,textureMatrix,effects:window.ScrollWater});if(signal.aborted)throw new DOMException('Cancelled','AbortError');
    const water=river.mesh;scene.add(water);
    const reflectionPlane=new THREE.Plane(),clipPlane=new THREE.Vector4(),clipCorner=new THREE.Vector4();

    const mistUniforms={time:{value:0}};
    const mistMaterial=keep(new THREE.ShaderMaterial({uniforms:mistUniforms,transparent:true,depthWrite:false,side:THREE.DoubleSide,
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:`varying vec2 vUv;uniform float time;${noise}void main(){float n=noise(vUv*vec2(9.,2.)+vec2(time*.025,0.));float alpha=sin(vUv.x*3.14159)*pow(sin(vUv.y*3.14159),2.)*n*.20;gl_FragColor=vec4(.79,.81,.74,alpha);}`
    }));
    const mistGeo=keep(new THREE.PlaneGeometry(66,5));for(const z of [-8,-23,-40]){const m=new THREE.Mesh(mistGeo,mistMaterial);m.position.set(0,1.5,z);scene.add(m);}

    const paintedFrame=keep(new THREE.WebGLRenderTarget(1,1,{depthBuffer:true}));paintedFrame.texture.colorSpace=THREE.SRGBColorSpace;paintedFrame.samples=mobile?0:2;
    const tunnel=await createCourtyard(keep,mobile);if(signal.aborted)throw new DOMException('Cancelled','AbortError');
    const paperU={tunnelMap:{value:tunnel.texture},tunnelBlend:{value:0},map:{value:paintedFrame.texture},paper:{value:world.panorama},pixel:{value:new THREE.Vector2(1,1)}};
    const paperScene=new THREE.Scene(),paperCamera=new THREE.Camera();
    const paperMat=keep(new THREE.ShaderMaterial({uniforms:paperU,depthTest:false,depthWrite:false,
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
      fragmentShader:`uniform sampler2D map,paper,tunnelMap;uniform float tunnelBlend;uniform vec2 pixel;varying vec2 vUv;
      vec3 radiance(vec2 uv,float radius){vec3 sum=vec3(0.);float total=0.;for(int x=-3;x<=3;x++){for(int y=-3;y<=3;y++){float weight=exp(-float(x*x+y*y)*.24);vec3 light=texture2D(tunnelMap,uv+vec2(float(x),float(y))*pixel*radius).rgb;sum+=max(light-vec3(.30),vec3(0.))*weight;total+=weight;}}return sum/total;}
      void main(){vec3 c=texture2D(map,vUv).rgb;vec3 dx=texture2D(map,vUv+vec2(pixel.x,0.)).rgb-texture2D(map,vUv-vec2(pixel.x,0.)).rgb;vec3 dy=texture2D(map,vUv+vec2(0.,pixel.y)).rgb-texture2D(map,vUv-vec2(0.,pixel.y)).rgb;float edge=smoothstep(.06,.38,length(dx)+length(dy));c*=1.-edge*.21;vec3 fiber=texture2D(paper,vec2(vUv.x,.94+vUv.y*.055)).rgb;float grain=dot(fiber,vec3(.333))-.68;c+=vec3(grain*.025);vec3 tunnelColor=texture2D(tunnelMap,vUv).rgb;if(tunnelBlend>0.){tunnelColor+=radiance(vUv,3.)*.12;}c=mix(c,tunnelColor,tunnelBlend);gl_FragColor=vec4(c,1.);
      #include <colorspace_fragment>
      }`}));paperScene.add(new THREE.Mesh(keep(new THREE.PlaneGeometry(2,2)),paperMat));
    const journey=createJourney({pauseAt:.95}),pointer=new THREE.Vector2(),parallax=new THREE.Vector2(),look=new THREE.Vector3();
    const autoButton=host.querySelector('#crossingAuto'),range=host.querySelector('#crossingSeek');
    let time=0,frameNumber=0,holdTime=0,drag=null,lastUi=0,atMeeting=false,departing=false;
    resize=()=>{if(disposed)return;const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);paintedFrame.setSize(Math.round(w*renderer.getPixelRatio()),Math.round(h*renderer.getPixelRatio()));paperU.pixel.value.set(1/paintedFrame.width,1/paintedFrame.height);camera.aspect=w/h;camera.updateProjectionMatrix();};
    listen(window,'resize',resize);resize();
    listen(host,'wheel',event=>{
      if(atMeeting||departing||event.ctrlKey||event.target.closest('button,input'))return;event.preventDefault();
      const unit=event.deltaMode===1?16:event.deltaMode===2?host.clientHeight:1;
      journey.advance(Math.max(-220,Math.min(220,event.deltaY*unit))/4800);
    },{passive:false});
    listen(host,'pointermove',event=>{
      if(event.pointerType==='mouse'){const r=host.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,(event.clientY-r.top)/r.height*2-1);}
      if(!atMeeting&&!departing&&drag&&event.pointerId===drag.id){journey.seek(drag.progress+(drag.y-event.clientY)/(host.clientHeight*1.7));}
    });
    listen(host,'pointerdown',event=>{if(atMeeting||departing||event.button!==0||event.target.closest('button,input'))return;drag={id:event.pointerId,y:event.clientY,progress:journey.target};host.setPointerCapture(event.pointerId);});
    const endDrag=()=>{drag=null;};listen(host,'pointerup',endDrag);listen(host,'pointercancel',endDrag);listen(host,'pointerleave',()=>pointer.set(0,0));
    listen(autoButton,'click',()=>{if(atMeeting)host.querySelector('#crossingGuide').click();else if(!departing)journey.toggle();});
    listen(host.querySelector('#crossingBurst'),'click',()=>tunnel.burst());
    listen(host,'click',event=>{if(!atMeeting&&!departing&&journey.progress>.78&&!event.target.closest('button,input'))tunnel.burst();});
    listen(range,'input',()=>journey.seek(Math.min(.95,Number(range.value)/1000)));
    listen(host,'keydown',event=>{
      if(atMeeting||departing||event.target.closest('button,input'))return;
      if(['ArrowDown','ArrowRight','PageDown','ArrowUp','ArrowLeft','PageUp',' ','Home','End'].includes(event.key))event.preventDefault();
      if(['ArrowDown','ArrowRight','PageDown'].includes(event.key))journey.advance(.055);
      if(['ArrowUp','ArrowLeft','PageUp'].includes(event.key))journey.advance(-.055);
      if(event.key===' ')journey.toggle();if(event.key==='Home')journey.seek(0);if(event.key==='End')journey.seek(1);
    });
    function draw(progress,dt){
      const pose=journeyPose(progress,camera.aspect);world.update(progress,time,pose);
      parallax.lerp(pointer,1-Math.exp(-dt*3));const shift=(1-ease(.38,.72,progress));
      camera.position.set(pose.camera[0]+parallax.x*1.05*shift,pose.camera[1]-parallax.y*.5*shift,pose.camera[2]);
      look.set(...pose.look);look.x+=parallax.x*.25*shift;camera.lookAt(look);camera.updateMatrixWorld();world.faceBoatman(camera);
      river.update(time,dt,camera.position,world.boat.position,world.paddleWorld);mistUniforms.time.value=time;
      renderer.shadowMap.needsUpdate=frameNumber%3===0;
      if(frameNumber%2===0){
        water.visible=false;reflectCamera.copy(camera);reflectCamera.position.y=waterLevel*2-camera.position.y;
        reflectCamera.up.set(0,-1,0);reflectCamera.lookAt(look.x,waterLevel*2-look.y,look.z);reflectCamera.updateMatrixWorld();
        textureMatrix.copy(bias).multiply(reflectCamera.projectionMatrix).multiply(reflectCamera.matrixWorldInverse);
        // Oblique near-plane clipping keeps submerged geometry out of reflections.
        reflectionPlane.set(new THREE.Vector3(0,1,0),-waterLevel).applyMatrix4(reflectCamera.matrixWorldInverse);
        clipPlane.set(reflectionPlane.normal.x,reflectionPlane.normal.y,reflectionPlane.normal.z,reflectionPlane.constant);
        const projection=reflectCamera.projectionMatrix.elements;
        clipCorner.set((Math.sign(clipPlane.x)+projection[8])/projection[0],(Math.sign(clipPlane.y)+projection[9])/projection[5],-1,(1+projection[10])/projection[14]);
        clipPlane.multiplyScalar(2/clipPlane.dot(clipCorner));
        projection[2]=clipPlane.x;projection[6]=clipPlane.y;projection[10]=clipPlane.z+1-.003;projection[14]=clipPlane.w;
        renderer.setRenderTarget(reflection);renderer.render(scene,reflectCamera);renderer.setRenderTarget(null);water.visible=true;
      }
      paperU.tunnelBlend.value=tunnel.render(renderer,progress,time,paintedFrame.width,paintedFrame.height,parallax,departing);
      host.classList.toggle('crossing-in-courtyard',progress>.72&&progress<.99);
      renderer.setRenderTarget(paintedFrame);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(paperScene,paperCamera);frameNumber++;traces.draw(camera,progress,time);
      host.style.setProperty('--crossing-mist',String(pose.fade));
      return pose;
    }
    draw(0,.016);
    return {dispose,guide(){if(departing||!atMeeting)return;departing=true;atMeeting=false;autoButton.disabled=true;range.disabled=true;journey.seek(.95);journey.toggle();},play(update){return new Promise(resolve=>{
      finish=resolve;let last=performance.now();
      function frame(now){
        if(disposed){resolve();return;}
        if(document.hidden){last=now;raf=requestAnimationFrame(frame);return;}
        const dt=Math.min(.06,(now-last)/1000);last=now;time+=dt;
        if(!departing&&journey.target>.95)journey.seek(.95);
        const progress=journey.step(dt);
        atMeeting=!departing&&progress>=.948;
        if(atMeeting)journey.pause();
        const pose=draw(progress,dt);
        holdTime=progress>=.999?holdTime+dt:0;
        if(time-lastUi>.06){
          lastUi=time;const titles=['虹桥初成','一舟入画',progress<.91?'聚沙成形':'宋人相逢'];
          const hints=departing?'随画客向前，走入汴京':atMeeting?'一位画客，邀你同游':progress<.4?'滚动或拖动，让木梁逐段合拢':progress<.67?'滚动或拖动，随舟划过虹桥':progress<.91?'微尘聚拢，故人渐现':'移目细看，再向前走入汴京';
          update({title:titles[pose.phase],hint:hints,progress,playing:journey.playing,meeting:atMeeting,departing});
          range.value=String(Math.round((journey.playing?progress:journey.target)*1000));range.setAttribute('aria-valuetext',`${titles[pose.phase]}，${Math.round(progress*100)}%`);
          autoButton.textContent=atMeeting?'随他游街':journey.playing?'暂停行舟':progress>.94?'走入汴京':progress>0?'继续行舟':'启程';autoButton.setAttribute('aria-pressed',String(journey.playing));
        }
        if(holdTime>.25){finish=null;resolve();return;}
        raf=requestAnimationFrame(frame);
      }
      raf=requestAnimationFrame(frame);
    });}};
  }catch(error){dispose();throw error;}
}
