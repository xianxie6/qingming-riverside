import * as THREE from '../vendor/three.module.js';
import {assemblyProgress,ease} from './crossing-motion.js';
import {timberBreath,createRowingRig,rowingPoint,paddleThroughHands,rowingStroke} from './crossing-details.js?v=17-river';

// Original procedural meshes. No external model or photographed bridge is used.
export async function createCrossingWorld(keep){
  const root=new THREE.Group(),bridge=new THREE.Group(),village=new THREE.Group();root.add(bridge,village);
  let seed=928;
  const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
  function surface(kind){
    const c=document.createElement('canvas');c.width=512;c.height=512;const ctx=c.getContext('2d');
    ctx.fillStyle=kind==='wood'?'#c5b18b':kind==='roof'?'#737a73':'#a9a797';ctx.fillRect(0,0,512,512);
    if(kind==='wood'){
      for(let i=0;i<1400;i++){const y=rand()*512;ctx.beginPath();ctx.lineWidth=rand()*1.8+.2;ctx.strokeStyle=rand()>.3?`rgba(45,29,15,${rand()*.25})`:`rgba(244,219,168,${rand()*.35})`;ctx.moveTo(0,y);for(let x=0;x<=512;x+=12)ctx.lineTo(x,y+Math.sin(x*.024+i)*2+Math.sin(x*.007+i)*6);ctx.stroke();}
      for(let i=0;i<13;i++){const x=rand()*512,y=rand()*512;ctx.strokeStyle='#47341b55';ctx.lineWidth=.6;ctx.beginPath();ctx.ellipse(x,y,12+rand()*22,2+rand()*3,0,0,Math.PI*2);ctx.stroke();}
    }else{
      for(let i=0;i<22000;i++){const v=rand();ctx.fillStyle=v>.5?'#e6dfc412':'#1f2c2118';ctx.fillRect(rand()*512,rand()*512,rand()*3+.5,rand()*3+.5);}
      if(kind==='stone'){ctx.strokeStyle='#55584655';ctx.lineWidth=1.2;for(let y=0;y<512;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();for(let x=(y%64?32:0);x<512;x+=64){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+32);ctx.stroke();}}}
      if(kind==='roof')for(let y=0;y<512;y+=32){ctx.fillStyle='#232b2970';ctx.fillRect(0,y,512,3);for(let x=0;x<512;x+=20){ctx.fillStyle='#a7aa9255';ctx.fillRect(x+(y%64?10:0),y,2,29);}}
    }
    const texture=keep(new THREE.CanvasTexture(c));texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=4;return texture;
  }
  const woodMap=surface('wood'),stoneMap=surface('stone'),roofMap=surface('roof');
  stoneMap.repeat.set(4,4);
  const material=(color,map=null,roughness=.85)=>keep(new THREE.MeshStandardMaterial({color,map,roughness,metalness:0}));
  const wood=material('#f2e1bf',woodMap),darkWood=material('#b4a17d',woodMap),lightWood=material('#f2e5c9',woodMap);
  wood.bumpMap=woodMap;wood.bumpScale=.045;darkWood.bumpMap=woodMap;darkWood.bumpScale=.035;
  const stone=material('#929083',stoneMap),plaster=material('#d0c2a2',stoneMap),roofMat=material('#536464',roofMap);
  const riverBank=material('#727965',stoneMap),cloth=material('#d4c19b',woodMap),red=material('#8d4432'),black=material('#373c33');
  const box=keep(new THREE.BoxGeometry(1,1,1)),sphere=keep(new THREE.SphereGeometry(1,10,8));
  const cylinder=keep(new THREE.CylinderGeometry(1,1,1,10));
  function mesh(geo,mat,pos,scale,parent=root){const m=new THREE.Mesh(geo,mat);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function block(pos,scale,mat=wood,parent=root){return mesh(box,mat,pos,scale,parent);}
  function beam(a,b,width,depth,mat=wood,parent=root){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);const m=block(start.clone().add(end).multiplyScalar(.5).toArray(),[start.distanceTo(end),width,depth],mat,parent);m.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),end.sub(start).normalize());return m;}

  // A bevel catches light on the edges of every independent timber.
  const outline=new THREE.Shape();outline.moveTo(-.46,-.46);outline.lineTo(.46,-.46);outline.lineTo(.46,.46);outline.lineTo(-.46,.46);outline.closePath();
  const timberGeo=keep(new THREE.ExtrudeGeometry(outline,{depth:.92,steps:1,bevelEnabled:true,bevelSegments:2,bevelSize:.04,bevelThickness:.04}));timberGeo.translate(0,0,-.46);
  const parts=[];
  const arch=x=>1.12+3.65*(1-(x/8.25)**2);
  function part(pos,scale,rotation,order,kind=0){
    const index=parts.length;parts.push({pos:new THREE.Vector3(...pos),scale:new THREE.Vector3(...scale),q:new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,rotation)),order,kind,
      offset:new THREE.Vector3((pos[0]<0?-1:1)*(.1+rand()*.3),.65+rand()*1.4,(pos[2]<0?-1:1)*(.15+rand()*.4)).multiplyScalar(order<.3?.22:(index%3===0?1:.22)),
      twist:(rand()-.5)*.13,index});
  }
  function timber(a,b,width,depth,order,kind=0){const dx=b[0]-a[0],dy=b[1]-a[1];part([(a[0]+b[0])/2,(a[1]+b[1])/2,a[2]],[Math.hypot(dx,dy),width,depth],Math.atan2(dy,dx),order,kind);}
  // Four ribs and staggered lower interlocking timbers expose real depth under the deck.
  for(const z of [-1.63,-.56,.56,1.63])for(let i=0;i<12;i++){
    const a=-8.2+i*16.4/12,b=a+16.4/12+.16;
    timber([a,arch(a)-.43,z],[b,arch(b)-.43,z],.37,.28,.1+Math.abs((a+b)/2)/8*.12,1);
    if(i<11){const x=a+.5;timber([x,arch(x)-.78,z],[x+1.5,arch(x+1.5)-.78,z],.25,.24,.18,1);}
  }
  for(let i=0;i<=44;i++){
    const x=-8.22+i*16.44/44,slope=Math.atan(-7.3*x/(8.25**2));
    part([x,arch(x),0],[.345,.18,3.84],slope,.22+(.98-Math.abs(x)/8.25)*.65,0);
    if(i%4===0)part([x,arch(x)-.58,0],[.24,.26,4.12],slope,.20,1);
  }
  for(const z of [-1.92,1.92])for(let i=0;i<=16;i++){
    const x=-8.1+i*16.2/16,y=arch(x);
    part([x,y+.62,z],[.14,1.24,.14],0,.5+(.98-Math.abs(x)/8.25)*.48,1);
    part([x,y+1.28,z],[.23,.10,.23],0,.73,2);
    if(i<16){const nx=x+16.2/16,ny=arch(nx);for(const h of [.42,1.10])timber([x,y+h,z],[nx,ny+h,z],.11,.11,.58+(.98-Math.abs(x)/8.25)*.38,0);
      part([x+.506,(y+ny)/2+.76,z],[.065,.54,.065],0,.8,1);}
  }
  const batches=[wood,darkWood,lightWood].map((mat,kind)=>{
    const list=parts.filter(p=>p.kind===kind),m=new THREE.InstancedMesh(timberGeo,mat,list.length);m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.castShadow=true;m.receiveShadow=true;m.frustumCulled=false;bridge.add(m);return {m,list};
  });
  const edgeTemplate=keep(new THREE.EdgesGeometry(box));
  const inkGlow={value:0};
  const inkMaterial=keep(new THREE.ShaderMaterial({uniforms:{glow:inkGlow},transparent:true,depthWrite:false,
    vertexShader:'attribute vec4 row0;attribute vec4 row1;attribute vec4 row2;attribute vec4 row3;varying float distanceToEye;void main(){mat4 transform=mat4(row0,row1,row2,row3);vec4 p=modelViewMatrix*transform*vec4(position,1.);distanceToEye=-p.z;gl_Position=projectionMatrix*p;}',
    fragmentShader:'uniform float glow;varying float distanceToEye;void main(){vec3 color=mix(vec3(.22,.18,.12),vec3(.83,1.,.94),glow);gl_FragColor=vec4(color,mix(.46,.92,glow)*exp(-distanceToEye*.008));}'
  }));
  for(const batch of batches){
    const g=keep(new THREE.InstancedBufferGeometry());g.setAttribute('position',edgeTemplate.attributes.position);g.instanceCount=batch.list.length;
    batch.inkBuffer=new THREE.InstancedInterleavedBuffer(batch.m.instanceMatrix.array,16);batch.inkBuffer.setUsage(THREE.DynamicDrawUsage);
    for(let i=0;i<4;i++)g.setAttribute('row'+i,new THREE.InterleavedBufferAttribute(batch.inkBuffer,4,i*4));
    const line=new THREE.LineSegments(g,inkMaterial);line.frustumCulled=false;bridge.add(line);
  }
  const pegCount=parts.filter(p=>p.kind===1&&p.scale.x>.8).length*2;
  const pegs=new THREE.InstancedMesh(box,keep(new THREE.MeshBasicMaterial({color:'#59482f'})),pegCount);pegs.frustumCulled=false;bridge.add(pegs);
  const pegDummy=new THREE.Object3D(),pegPoint=new THREE.Vector3();
  const dummy=new THREE.Object3D(),euler=new THREE.Euler();
  function assemble(progress,time){
    let pegIndex=0;
    for(const {m,list,inkBuffer} of batches){
      list.forEach((p,i)=>{const arrive=assemblyProgress(progress,p.order),float=1-arrive;
        dummy.position.copy(p.pos).addScaledVector(p.offset,float);
        const breath=timberBreath(p.index,arrive,time);dummy.position.x+=breath.x;dummy.position.y+=breath.y;dummy.position.z+=breath.z;
        p.current=dummy.position.clone();p.arrive=arrive;
        dummy.quaternion.copy(p.q);euler.set(breath.roll*.4,0,float*p.twist+breath.roll);dummy.quaternion.multiply(new THREE.Quaternion().setFromEuler(euler));dummy.scale.copy(p.scale);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix);
        if(p.kind===1&&p.scale.x>.8)for(const side of [-1,1]){
          pegPoint.set(side*.36,0,.52).applyMatrix4(dummy.matrix);pegDummy.position.copy(pegPoint);pegDummy.quaternion.copy(dummy.quaternion);pegDummy.scale.set(.065,.065,.024);pegDummy.updateMatrix();pegs.setMatrixAt(pegIndex++,pegDummy.matrix);
        }
        if(time===0)m.setColorAt(i,new THREE.Color().setScalar(.79+(p.index%7)*.05));
      });m.instanceMatrix.needsUpdate=true;inkBuffer.needsUpdate=true;
    }
    pegs.instanceMatrix.needsUpdate=true;
  }
  assemble(0,0);

  // Masonry, banks, mooring posts, steps. Shared instanced stones keep draw calls low.
  const stones=[],bankMasses=[];
  for(const side of [-1,1]){


    for(let row=0;row<4;row++)for(let j=0;j<5;j++)stones.push({p:[side*8.1,.24+row*.35,-2.6+j*1.2],s:[1.2,.32,1.13]});

    // Solid quays sit behind the bridge abutments, leaving open water in front.
    bankMasses.push(block([side*20.4,-.16,-17],[24,.75,39],stone));
    for(let z=-35;z<2.6;z+=1.15)for(let row=0;row<3;row++)stones.push({p:[side*(8.32+row*.12),-.35+row*.30,z+(row%2)*.35],s:[.68,.28,1.08]});
    for(let z=-35;z<2.4;z+=1.15)stones.push({p:[side*8.55,.62,z],s:[1.15,.16,1.10]});

  }
  const stoneInstances=new THREE.InstancedMesh(box,stone,stones.length);stones.forEach((s,i)=>{dummy.position.set(...s.p);dummy.scale.set(...s.s);dummy.rotation.set(0,0,0);dummy.updateMatrix();stoneInstances.setMatrixAt(i,dummy.matrix);stoneInstances.setColorAt(i,new THREE.Color().setScalar(.72+rand()*.3));});stoneInstances.castShadow=true;stoneInstances.receiveShadow=true;root.add(stoneInstances);

  // A planked boat with a concave hull, bent bamboo canopy and a boatman.
  const boat=new THREE.Group();root.add(boat);
  const hullPoints=[],hullUv=[],hullIndices=[];
  for(let j=0;j<=20;j++){
    const z=(j/20-.5)*4.6,width=.13+.76*Math.pow(Math.sin(j/20*Math.PI),.62);
    const cross=[[-width,.48],[-width*.74,.09],[0,-.09],[width*.74,.09],[width,.48]];
    cross.forEach(([x,y],i)=>{hullPoints.push(x,y+.13,z);hullUv.push(j/4,i/4);});
    if(j<20)for(let i=0;i<4;i++){const a=j*5+i;hullIndices.push(a,a+5,a+1,a+1,a+5,a+6);}
  }
  const hullGeo=keep(new THREE.BufferGeometry());hullGeo.setAttribute('position',new THREE.Float32BufferAttribute(hullPoints,3));hullGeo.setAttribute('uv',new THREE.Float32BufferAttribute(hullUv,2));hullGeo.setIndex(hullIndices);hullGeo.computeVertexNormals();
  const hullMaterial=keep(darkWood.clone());hullMaterial.side=THREE.DoubleSide;const hull=new THREE.Mesh(hullGeo,hullMaterial);hull.castShadow=true;boat.add(hull);
  for(let j=0;j<14;j++){const z=-1.96+j*.30,w=.12+.7*Math.pow(Math.sin((z/4.6+.5)*Math.PI),.62);block([0,.38,z],[w*1.85,.055,.275],wood,boat);}
  for(const side of [-1,1]){const points=[];for(let i=0;i<=20;i++){const z=(i/20-.5)*4.6;points.push(new THREE.Vector3(side*(.13+.76*Math.pow(Math.sin(i/20*Math.PI),.62)),.61,z));}boat.add(new THREE.Mesh(keep(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,.055,6,false)),lightWood));}
  // Explicit arch canopy makes the longitudinal direction unambiguous.
  const coverPos=[],coverUv=[],coverIdx=[];
  for(let i=0;i<=20;i++){const angle=i/20*Math.PI;for(const z of [-1.2,.6]){coverPos.push(Math.cos(angle)*.76,.64+Math.sin(angle)*.86,z);coverUv.push(i/4,z<0?0:2);}}
  for(let i=0;i<20;i++){let n=i*2;coverIdx.push(n,n+1,n+2,n+1,n+3,n+2);}
  const cg=keep(new THREE.BufferGeometry());cg.setAttribute('position',new THREE.Float32BufferAttribute(coverPos,3));cg.setAttribute('uv',new THREE.Float32BufferAttribute(coverUv,2));cg.setIndex(coverIdx);cg.computeVertexNormals();const coverMat=keep(cloth.clone());coverMat.side=THREE.DoubleSide;boat.add(new THREE.Mesh(cg,coverMat));
  for(let z=-1.2;z<=.61;z+=.3){const points=[];for(let i=0;i<=16;i++){const a=i/16*Math.PI;points.push(new THREE.Vector3(Math.cos(a)*.77,.64+Math.sin(a)*.87,z));}boat.add(new THREE.Mesh(keep(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,.018,4,false)),darkWood));}
  const man=new THREE.Group();man.position.set(.3,.44,1.45);boat.add(man);
  const robe=keep(new THREE.CylinderGeometry(.18,.28,.72,9));mesh(robe,black,[0,.56,0],[1,1,1],man);
  mesh(sphere,lightWood,[0,1.06,0],[.135,.16,.13],man);
  mesh(keep(new THREE.ConeGeometry(.39,.17,16)),cloth,[0,1.23,0],[1,1,1],man);
  for(const s of [-1,1]){block([s*.10,.13,0],[.11,.30,.13],darkWood,man);beam([s*.14,.84,0],[s*.35,.62,.17],.12,.10,black,man);}
  // Shaft and blade are positioned in boat space, independent of billboard rotation.
  const oarMat=keep(new THREE.MeshBasicMaterial({color:'#705335',map:woodMap}));
  const shaft=mesh(keep(new THREE.CylinderGeometry(.014,.018,1,8)),oarMat,[0,0,0],[1,1,1],boat);
  const blade=block([0,0,0],[.11,.34,.024],oarMat,boat);
  const grip=new THREE.Vector3(),lowerGrip=new THREE.Vector3(),tip=new THREE.Vector3(),axis=new THREE.Vector3(0,1,0);
  const manWorld=new THREE.Vector3(),boatRotation=new THREE.Quaternion(),facing=new THREE.Quaternion();
  let rowerArt=null,rowerMesh=null,rowerUvs=[];
  const paddleWorld=new THREE.Vector3();let strokeTime=0,paddlePower=0;
  const flagPole=beam([.63,.5,-.55],[.63,2.15,-.55],.035,.035,darkWood,boat);
  const flagGeo=keep(new THREE.PlaneGeometry(.4,.67,7,7)),flag=new THREE.Mesh(flagGeo,keep(new THREE.MeshStandardMaterial({color:'#91432e',side:THREE.DoubleSide,roughness:1})));flag.position.set(.83,1.72,-.55);boat.add(flag);
  const flagOriginal=flagGeo.attributes.position.array.slice();

  // Original hand-drawn districts sit at separate depths around the physical bridge.
  const loader=new THREE.TextureLoader();
  const [west,east,panorama,boatArt,riverForward]=await Promise.all(['assets/district-west-fast.webp','assets/district-east-fast.webp','assets/qingming-panorama-v1.webp','assets/boat.webp','assets/crossing-river-forward-v1.png'].map(async url=>{const t=keep(await loader.loadAsync(url));t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;}));
  const inkStone=keep(west.clone());inkStone.offset.set(.05,.25);inkStone.repeat.set(.8,.07);inkStone.needsUpdate=true;stoneInstances.material=keep(new THREE.MeshBasicMaterial({map:inkStone,color:'#f1e5ca'}));const quayTop=keep(new THREE.MeshBasicMaterial({map:stoneMap,color:'#d1c7a5'}));for(const bank of bankMasses)bank.material=[stoneInstances.material,stoneInstances.material,quayTop,stoneInstances.material,stoneInstances.material,stoneInstances.material];
  const inkWood=keep(boatArt.clone());inkWood.offset.set(.10,.41);inkWood.repeat.set(.16,.08);inkWood.needsUpdate=true;
  for(const m of [wood,darkWood,lightWood,hullMaterial]){m.map=inkWood;m.bumpMap=null;m.color.set('#fff7e6');m.needsUpdate=true;}
  const canopyInk=keep(boatArt.clone());canopyInk.offset.set(.36,.49);canopyInk.repeat.set(.20,.23);canopyInk.needsUpdate=true;coverMat.map=canopyInk;coverMat.color.set('#fff9e5');coverMat.needsUpdate=true;
  const inkTimber=keep(new THREE.MeshBasicMaterial({map:inkWood,color:'#eee1c2'}));
  const inkHull=keep(new THREE.MeshBasicMaterial({map:inkWood,color:'#d8c59e',side:THREE.DoubleSide}));
  const inkCanopy=keep(new THREE.MeshBasicMaterial({map:canopyInk,color:'#fff4d9',side:THREE.DoubleSide}));
  for(const batch of batches)batch.m.material=inkTimber;
  hull.material=inkHull;boat.traverse(object=>{if(object.material===coverMat)object.material=inkCanopy;});
  if(window.ScrollFeatured&&window.Inhabitants){
    const figures=new window.ScrollFeatured.Characters();await figures.assetsReady;
    const frame=figures.sprites.boatman,texture=keep(new THREE.CanvasTexture(frame.texture));texture.colorSpace=THREE.SRGBColorSpace;
    man.clear();rowerArt=frame;
    const columns=[...new Set([...Array.from({length:33},(_,i)=>i/32),...frame.grips.map(uv=>uv[0])])].sort((a,b)=>a-b);
    const rows=[...new Set([...Array.from({length:49},(_,i)=>i/48),...frame.grips.map(uv=>uv[1])])].sort((a,b)=>a-b);
    const positions=[],uvs=[],indices=[];
    for(const v of rows)for(const u of columns){rowerUvs.push([u,v]);positions.push(0,0,0);uvs.push(u,1-v);}
    for(let y=0;y<rows.length-1;y++)for(let x=0;x<columns.length-1;x++){
      const a=y*columns.length+x,b=a+columns.length;indices.push(a,b,a+1,a+1,b,b+1);
    }
    const geometry=keep(new THREE.BufferGeometry());geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);
    rowerMesh=new THREE.Mesh(geometry,keep(new THREE.MeshBasicMaterial({map:texture,color:'#fff5de',transparent:true,depthWrite:false,side:THREE.DoubleSide})));
    rowerMesh.frustumCulled=false;man.add(rowerMesh);
  }

  const markers=parts.filter(p=>p.pos.z>1.8&&p.order>.5&&p.scale.y>1).filter((_,i)=>i%2===0);
  const paintedMaterials=[];
  function paintedStreet(texture,x,y,z,w,h,angle=0){
    const mat=keep(new THREE.ShaderMaterial({uniforms:{map:{value:texture}},transparent:true,depthWrite:true,side:THREE.DoubleSide,
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:`uniform sampler2D map;varying vec2 vUv;void main(){vec4 c=texture2D(map,vec2(vUv.x,.22+vUv.y*.78));float edge=smoothstep(0.,.045,vUv.x)*smoothstep(0.,.045,1.-vUv.x)*smoothstep(0.,.055,vUv.y)*smoothstep(0.,.16,1.-vUv.y);float pigment=1.-smoothstep(.57,.73,dot(c.rgb,vec3(.3,.55,.15)));float paperMask=mix(1.,pigment,smoothstep(.52,.93,vUv.y));gl_FragColor=vec4(c.rgb,edge*paperMask);
      #include <colorspace_fragment>
      }`}));
    paintedMaterials.push(mat);const plane=new THREE.Mesh(keep(new THREE.PlaneGeometry(w,h)),mat);plane.position.set(x,y,z);plane.rotation.y=angle;village.add(plane);
  }
  paintedStreet(west,-21,5.4,-13,26,10.4,.10);
  paintedStreet(east,21,5.4,-13,26,10.4,-.10);
  // The assembled bridge is behind the camera after passage; the far view is open river.
  paintedStreet(riverForward,0,7.5,-48,73,17.2);
  paintedStreet(west,-19.5,3.5,2,24,7.2,.36);
  paintedStreet(east,19.5,3.5,2,24,7.2,-.36);
  let previousAssembly=-1;
  function update(progress,time,pose){
    if(progress<.68)assemble(progress,time);previousAssembly=progress;
    boat.position.set(pose.boatX,.06+Math.sin(time*1.2)*.035,pose.boatZ);boat.rotation.z=Math.sin(time*.8)*.012;
    const a=flagGeo.attributes.position;for(let i=0;i<a.count;i++)a.array[i*3+2]=flagOriginal[i*3+2]+Math.sin(time*2+flagOriginal[i*3]*9+flagOriginal[i*3+1]*5)*.035*(flagOriginal[i*3]+.2);a.needsUpdate=true;
    strokeTime=time;
    inkGlow.value=(.63+.15*Math.sin(time*.85))*(1-ease(.44,.72,progress));
  }
  return {root,bridge,boat,village,update,panorama,riverInk:east,markers,partCount:parts.length,paddleWorld,get paddlePower(){return paddlePower;},faceBoatman(camera){
    root.updateMatrixWorld(true);man.getWorldPosition(manWorld);boat.getWorldQuaternion(boatRotation);
    facing.setFromAxisAngle(new THREE.Vector3(0,1,0),Math.atan2(camera.position.x-manWorld.x,camera.position.z-manWorld.z));
    man.quaternion.copy(boatRotation).invert().multiply(facing);
    if(rowerArt){
      const rig=createRowingRig(rowerArt,strokeTime,window.ScrollMovement),positions=rowerMesh.geometry.attributes.position;
      rowerUvs.forEach(([u,v],i)=>{const [x,y]=rowingPoint(u,v,rig);positions.setXYZ(i,x,-y,0);});positions.needsUpdate=true;
      const [upper,lower]=rig.grips.map(uv=>rowingPoint(...uv,rig));
      // The wood sits just behind the painted fingers so they wrap over it.
      grip.set(upper[0],-upper[1],-.008).applyQuaternion(man.quaternion).add(man.position);
      lowerGrip.set(lower[0],-lower[1],-.008).applyQuaternion(man.quaternion).add(man.position);
    }else{
      grip.set(.35,1.03,.10).applyQuaternion(man.quaternion).add(man.position);
      lowerGrip.set(.62,.81,.10).applyQuaternion(man.quaternion).add(man.position);
    }
    const stroke=rowingStroke(strokeTime);paddlePower=stroke.power;
    const paddle=paddleThroughHands(grip,lowerGrip,stroke.waterY);
    tip.set(paddle.tip.x,paddle.tip.y,paddle.tip.z);const start=new THREE.Vector3(paddle.start.x,paddle.start.y,paddle.start.z);
    const direction=tip.clone().sub(start).normalize();
    shaft.position.copy(start).add(tip).multiplyScalar(.5);shaft.scale.y=start.distanceTo(tip);shaft.quaternion.setFromUnitVectors(axis,direction);
    blade.position.copy(tip).addScaledVector(direction,-.10);blade.quaternion.copy(shaft.quaternion);
    boat.updateMatrixWorld(true);paddleWorld.copy(tip).applyMatrix4(boat.matrixWorld);
  }};
}
