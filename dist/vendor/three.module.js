/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */import{Matrix3 as ye,Vector2 as ht,Color as je,Vector3 as Ne,mergeUniforms as gt,CubeUVReflectionMapping as sn,Mesh as Pt,BoxGeometry as En,ShaderMaterial as Lt,BackSide as vt,cloneUniforms as Wn,Matrix4 as Wt,ColorManagement as tt,SRGBTransfer as Ye,PlaneGeometry as kn,FrontSide as Jt,getUnlitUniformColorSpace as _r,IntType as zn,warn as Ve,HalfFloatType as Ut,UnsignedByteType as Tt,FloatType as yt,RGBAFormat as Dt,Plane as gr,CubeReflectionMapping as jt,CubeRefractionMapping as kt,BufferGeometry as ln,OrthographicCamera as Xn,PerspectiveCamera as cn,NoToneMapping as At,MeshBasicMaterial as vr,NoBlending as wt,WebGLRenderTarget as Mt,BufferAttribute as Mn,LinearSRGBColorSpace as Kn,LinearFilter as St,CubeTexture as Yn,LinearMipmapLinearFilter as zt,CubeCamera as Sr,EquirectangularReflectionMapping as xn,EquirectangularRefractionMapping as Tn,warnOnce as Er,Uint32BufferAttribute as Mr,Uint16BufferAttribute as xr,error as Qe,DataArrayTexture as qn,Vector4 as mt,Float32BufferAttribute as Zn,RawShaderMaterial as Tr,CustomToneMapping as $n,NeutralToneMapping as Qn,AgXToneMapping as Jn,ACESFilmicToneMapping as jn,CineonToneMapping as ei,ReinhardToneMapping as ti,LinearToneMapping as ni,Data3DTexture as Ar,GreaterEqualCompare as An,LessEqualCompare as Rn,DepthTexture as fn,Texture as Rr,GLSL3 as ii,VSMShadowMap as en,PCFShadowMap as dn,AddOperation as br,MixOperation as Cr,MultiplyOperation as Pr,LinearTransfer as ri,UniformsUtils as Lr,DoubleSide as It,NormalBlending as un,TangentSpaceNormalMap as ai,ObjectSpaceNormalMap as Ur,Layers as Dr,RGFormat as Xt,RG11_EAC_Format as bn,RED_GREEN_RGTC2_Format as Cn,MeshDepthMaterial as wr,MeshDistanceMaterial as Ir,PCFSoftShadowMap as Nr,DepthFormat as Kt,NearestFilter as Gt,CubeDepthTexture as yr,UnsignedIntType as Ht,Frustum as oi,LessEqualDepth as si,ReverseSubtractEquation as Fr,SubtractEquation as Or,AddEquation as tn,OneMinusConstantAlphaFactor as Br,ConstantAlphaFactor as Gr,OneMinusConstantColorFactor as Hr,ConstantColorFactor as Vr,OneMinusDstAlphaFactor as Wr,OneMinusDstColorFactor as kr,OneMinusSrcAlphaFactor as zr,OneMinusSrcColorFactor as Xr,DstAlphaFactor as Kr,DstColorFactor as Yr,SrcAlphaSaturateFactor as qr,SrcAlphaFactor as Zr,SrcColorFactor as $r,OneFactor as Qr,ZeroFactor as Jr,NotEqualDepth as jr,GreaterDepth as ea,GreaterEqualDepth as ta,EqualDepth as na,LessDepth as ia,AlwaysDepth as ra,NeverDepth as aa,CullFaceNone as oa,CullFaceBack as li,CullFaceFront as sa,CustomBlending as la,MultiplyBlending as ci,SubtractiveBlending as fi,AdditiveBlending as di,ReversedDepthFuncs as go,MinEquation as ca,MaxEquation as fa,MirroredRepeatWrapping as da,ClampToEdgeWrapping as Pn,RepeatWrapping as ua,LinearMipmapNearestFilter as Ln,NearestMipmapLinearFilter as pn,NearestMipmapNearestFilter as pa,NotEqualCompare as ha,GreaterCompare as ma,EqualCompare as _a,LessCompare as ga,AlwaysCompare as va,NeverCompare as Sa,NoColorSpace as Yt,DepthStencilFormat as qt,getByteLength as Ea,UnsignedInt248Type as nn,UnsignedShortType as hn,createElementNS as vo,UnsignedShort4444Type as ui,UnsignedShort5551Type as pi,UnsignedInt5999Type as Ma,UnsignedInt101111Type as xa,ByteType as Ta,ShortType as Aa,AlphaFormat as Ra,RGBFormat as ba,RedFormat as Ca,RedIntegerFormat as hi,RGIntegerFormat as mi,RGBAIntegerFormat as _i,RGB_S3TC_DXT1_Format as Un,RGBA_S3TC_DXT1_Format as Dn,RGBA_S3TC_DXT3_Format as wn,RGBA_S3TC_DXT5_Format as In,RGB_PVRTC_4BPPV1_Format as gi,RGB_PVRTC_2BPPV1_Format as vi,RGBA_PVRTC_4BPPV1_Format as Si,RGBA_PVRTC_2BPPV1_Format as Ei,RGB_ETC1_Format as Mi,RGB_ETC2_Format as xi,RGBA_ETC2_EAC_Format as Ti,R11_EAC_Format as Ai,SIGNED_R11_EAC_Format as Ri,SIGNED_RG11_EAC_Format as bi,RGBA_ASTC_4x4_Format as Ci,RGBA_ASTC_5x4_Format as Pi,RGBA_ASTC_5x5_Format as Li,RGBA_ASTC_6x5_Format as Ui,RGBA_ASTC_6x6_Format as Di,RGBA_ASTC_8x5_Format as wi,RGBA_ASTC_8x6_Format as Ii,RGBA_ASTC_8x8_Format as Ni,RGBA_ASTC_10x5_Format as yi,RGBA_ASTC_10x6_Format as Fi,RGBA_ASTC_10x8_Format as Oi,RGBA_ASTC_10x10_Format as Bi,RGBA_ASTC_12x10_Format as Gi,RGBA_ASTC_12x12_Format as Hi,RGBA_BPTC_Format as Vi,RGB_BPTC_SIGNED_Format as Wi,RGB_BPTC_UNSIGNED_Format as ki,RED_RGTC1_Format as zi,SIGNED_RED_RGTC1_Format as Xi,SIGNED_RED_GREEN_RGTC2_Format as Ki,ExternalTexture as Yi,EventDispatcher as Pa,ArrayCamera as La,WebXRController as Nn,RAD2DEG as So,DataTexture as Ua,createCanvasElement as Da,SRGBColorSpace as wa,REVISION as Ia,log as qi,WebGLCoordinateSystem as Zi,probeAsync as Eo}from"./three.core.js";import{AdditiveAnimationBlendMode as Md,AlwaysStencilFunc as xd,AmbientLight as Td,AnimationAction as Ad,AnimationClip as Rd,AnimationLoader as bd,AnimationMixer as Cd,AnimationObjectGroup as Pd,AnimationUtils as Ld,ArcCurve as Ud,ArrowHelper as Dd,AttachedBindMode as wd,Audio as Id,AudioAnalyser as Nd,AudioContext as yd,AudioListener as Fd,AudioLoader as Od,AxesHelper as Bd,BasicDepthPacking as Gd,BasicShadowMap as Hd,BatchedMesh as Vd,BezierInterpolant as Wd,Bone as kd,BooleanKeyframeTrack as zd,Box2 as Xd,Box3 as Kd,Box3Helper as Yd,BoxHelper as qd,BufferGeometryLoader as Zd,Cache as $d,Camera as Qd,CameraHelper as Jd,CanvasTexture as jd,CapsuleGeometry as eu,CatmullRomCurve3 as tu,CircleGeometry as nu,Clock as iu,ColorKeyframeTrack as ru,Compatibility as au,CompressedArrayTexture as ou,CompressedCubeTexture as su,CompressedTexture as lu,CompressedTextureLoader as cu,ConeGeometry as fu,Controls as du,CubeTextureLoader as uu,CubicBezierCurve as pu,CubicBezierCurve3 as hu,CubicInterpolant as mu,CullFaceFrontBack as _u,Curve as gu,CurvePath as vu,CylinderGeometry as Su,Cylindrical as Eu,DataTextureLoader as Mu,DataUtils as xu,DecrementStencilOp as Tu,DecrementWrapStencilOp as Au,DefaultLoadingManager as Ru,DetachedBindMode as bu,DirectionalLight as Cu,DirectionalLightHelper as Pu,DiscreteInterpolant as Lu,DodecahedronGeometry as Uu,DynamicCopyUsage as Du,DynamicDrawUsage as wu,DynamicReadUsage as Iu,EdgesGeometry as Nu,EllipseCurve as yu,EqualStencilFunc as Fu,Euler as Ou,ExtrudeGeometry as Bu,FileLoader as Gu,Float16BufferAttribute as Hu,Fog as Vu,FogExp2 as Wu,FramebufferTexture as ku,FrustumArray as zu,GLBufferAttribute as Xu,GLSL1 as Ku,GreaterEqualStencilFunc as Yu,GreaterStencilFunc as qu,GridHelper as Zu,Group as $u,HTMLTexture as Qu,HemisphereLight as Ju,HemisphereLightHelper as ju,IcosahedronGeometry as ep,ImageBitmapLoader as tp,ImageLoader as np,ImageUtils as ip,IncrementStencilOp as rp,IncrementWrapStencilOp as ap,InstancedBufferAttribute as op,InstancedBufferGeometry as sp,InstancedInterleavedBuffer as lp,InstancedMesh as cp,Int16BufferAttribute as fp,Int32BufferAttribute as dp,Int8BufferAttribute as up,InterleavedBuffer as pp,InterleavedBufferAttribute as hp,Interpolant as mp,InterpolateBezier as _p,InterpolateDiscrete as gp,InterpolateLinear as vp,InterpolateSmooth as Sp,InterpolationSamplingMode as Ep,InterpolationSamplingType as Mp,InvertStencilOp as xp,KeepStencilOp as Tp,KeyframeTrack as Ap,LOD as Rp,LatheGeometry as bp,LessEqualStencilFunc as Cp,LessStencilFunc as Pp,Light as Lp,LightProbe as Up,LightShadow as Dp,Line as wp,Line3 as Ip,LineBasicMaterial as Np,LineCurve as yp,LineCurve3 as Fp,LineDashedMaterial as Op,LineLoop as Bp,LineSegments as Gp,LinearInterpolant as Hp,LinearMipMapLinearFilter as Vp,LinearMipMapNearestFilter as Wp,Loader as kp,LoaderUtils as zp,LoadingManager as Xp,LoopOnce as Kp,LoopPingPong as Yp,LoopRepeat as qp,MOUSE as Zp,Material as $p,MaterialBlending as Qp,MaterialLoader as Jp,MathUtils as jp,Matrix2 as eh,MeshLambertMaterial as th,MeshMatcapMaterial as nh,MeshNormalMaterial as ih,MeshPhongMaterial as rh,MeshPhysicalMaterial as ah,MeshStandardMaterial as oh,MeshToonMaterial as sh,NearestMipMapLinearFilter as lh,NearestMipMapNearestFilter as ch,NeverStencilFunc as fh,NoNormalPacking as dh,NormalAnimationBlendMode as uh,NormalGAPacking as ph,NormalRGPacking as hh,NotEqualStencilFunc as mh,NumberKeyframeTrack as _h,Object3D as gh,ObjectLoader as vh,OctahedronGeometry as Sh,Path as Eh,PlaneHelper as Mh,PointLight as xh,PointLightHelper as Th,Points as Ah,PointsMaterial as Rh,PolarGridHelper as bh,PolyhedronGeometry as Ch,PositionalAudio as Ph,PropertyBinding as Lh,PropertyMixer as Uh,QuadraticBezierCurve as Dh,QuadraticBezierCurve3 as wh,Quaternion as Ih,QuaternionKeyframeTrack as Nh,QuaternionLinearInterpolant as yh,RGBADepthPacking as Fh,RGBDepthPacking as Oh,RGBIntegerFormat as Bh,RGDepthPacking as Gh,Ray as Hh,Raycaster as Vh,RectAreaLight as Wh,RenderObjectRefreshType as kh,RenderTarget as zh,RenderTarget3D as Xh,ReplaceStencilOp as Kh,RingGeometry as Yh,Scene as qh,ShadowMaterial as Zh,Shape as $h,ShapeGeometry as Qh,ShapePath as Jh,ShapeUtils as jh,Skeleton as em,SkeletonHelper as tm,SkinnedMesh as nm,Source as im,Sphere as rm,SphereGeometry as am,Spherical as om,SphericalHarmonics3 as sm,SplineCurve as lm,SpotLight as cm,SpotLightHelper as fm,Sprite as dm,SpriteMaterial as um,StaticCopyUsage as pm,StaticDrawUsage as hm,StaticReadUsage as mm,StereoCamera as _m,StreamCopyUsage as gm,StreamDrawUsage as vm,StreamReadUsage as Sm,StringKeyframeTrack as Em,TOUCH as Mm,TetrahedronGeometry as xm,TextureLoader as Tm,TextureSource as Am,TextureUtils as Rm,Timer as bm,TimestampQuery as Cm,TorusGeometry as Pm,TorusKnotGeometry as Lm,Triangle as Um,TriangleFanDrawMode as Dm,TriangleStripDrawMode as wm,TrianglesDrawMode as Im,TubeGeometry as Nm,UVMapping as ym,Uint8BufferAttribute as Fm,Uint8ClampedBufferAttribute as Om,Uniform as Bm,UniformsGroup as Gm,VectorKeyframeTrack as Hm,VideoFrameTexture as Vm,VideoTexture as Wm,WebGL3DRenderTarget as km,WebGLArrayRenderTarget as zm,WebGPUCoordinateSystem as Xm,WireframeGeometry as Km,WrapAroundEnding as Ym,ZeroCurvatureEnding as qm,ZeroSlopeEnding as Zm,ZeroStencilOp as $m,getConsoleFunction as Qm,setConsoleFunction as Jm}from"./three.core.js";function Na(){let e=null,n=!1,t=null,i=null;function l(o,d){i=e.requestAnimationFrame(l),t(o,d)}return{start:function(){n!==!0&&t!==null&&e!==null&&(i=e.requestAnimationFrame(l),n=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(i),n=!1},setAnimationLoop:function(o){t=o},setContext:function(o){e=o}}}function Mo(e){const n=new WeakMap;function t(g,R){const T=g.array,H=g.usage,I=T.byteLength,p=e.createBuffer();e.bindBuffer(R,p),e.bufferData(R,T,H),g.onUploadCallback();let x;if(T instanceof Float32Array)x=e.FLOAT;else if(typeof Float16Array<"u"&&T instanceof Float16Array)x=e.HALF_FLOAT;else if(T instanceof Uint16Array)g.isFloat16BufferAttribute?x=e.HALF_FLOAT:x=e.UNSIGNED_SHORT;else if(T instanceof Int16Array)x=e.SHORT;else if(T instanceof Uint32Array)x=e.UNSIGNED_INT;else if(T instanceof Int32Array)x=e.INT;else if(T instanceof Int8Array)x=e.BYTE;else if(T instanceof Uint8Array)x=e.UNSIGNED_BYTE;else if(T instanceof Uint8ClampedArray)x=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+T);return{buffer:p,type:x,bytesPerElement:T.BYTES_PER_ELEMENT,version:g.version,size:I}}function i(g,R,T){const H=R.array,I=R.updateRanges;if(e.bindBuffer(T,g),I.length===0)e.bufferSubData(T,0,H);else{I.sort((x,N)=>x.start-N.start);let p=0;for(let x=1;x<I.length;x++){const N=I[p],W=I[x];W.start<=N.start+N.count+1?N.count=Math.max(N.count,W.start+W.count-N.start):(++p,I[p]=W)}I.length=p+1;for(let x=0,N=I.length;x<N;x++){const W=I[x];e.bufferSubData(T,W.start*H.BYTES_PER_ELEMENT,H,W.start,W.count)}R.clearUpdateRanges()}R.onUploadCallback()}function l(g){return g.isInterleavedBufferAttribute&&(g=g.data),n.get(g)}function o(g){g.isInterleavedBufferAttribute&&(g=g.data);const R=n.get(g);R&&(e.deleteBuffer(R.buffer),n.delete(g))}function d(g,R){if(g.isInterleavedBufferAttribute&&(g=g.data),g.isGLBufferAttribute){const H=n.get(g);(!H||H.version<g.version)&&n.set(g,{buffer:g.buffer,type:g.type,bytesPerElement:g.elementSize,version:g.version});return}const T=n.get(g);if(T===void 0)n.set(g,t(g,R));else if(T.version<g.version){if(T.size!==g.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(T.buffer,g,R),T.version=g.version}}return{get:l,remove:o,update:d}}var xo=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,To=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ao=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ro=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bo=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Co=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Po=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Lo=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Uo=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Do=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,wo=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Io=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,No=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,yo=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Fo=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Oo=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Bo=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Go=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ho=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Vo=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Wo=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ko=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,zo=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Xo=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ko=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Yo=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,qo=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Zo=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$o=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Qo=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Jo="gl_FragColor = linearToOutputTexel( gl_FragColor );",jo=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,es=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,ts=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,ns=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,is=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,rs=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,as=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,os=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ss=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ls=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,cs=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,fs=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ds=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,us=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ps=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,hs=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,ms=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,_s=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,gs=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vs=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ss=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Es=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ms=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,xs=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ts=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,As=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Rs=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bs=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cs=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ps=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ls=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Us=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ds=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ws=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Is=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ns=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ys=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Fs=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Os=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bs=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Gs=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Hs=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Vs=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ws=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ks=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zs=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Xs=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ks=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ys=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qs=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Zs=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$s=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Qs=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Js=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,js=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,el=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,tl=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,nl=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,il=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,rl=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,al=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ol=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,sl=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ll=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,cl=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,fl=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,dl=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ul=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pl=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hl=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ml=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,_l=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,gl=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,vl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Sl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,El=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Ml=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const xl=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Tl=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Al=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rl=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cl=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pl=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ll=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Ul=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Dl=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,wl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Il=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Nl=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,yl=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Fl=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Ol=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bl=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gl=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hl=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Vl=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wl=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,kl=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,zl=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xl=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Kl=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Yl=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ql=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zl=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$l=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ql=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Jl=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jl=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ec=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tc=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Pe={alphahash_fragment:xo,alphahash_pars_fragment:To,alphamap_fragment:Ao,alphamap_pars_fragment:Ro,alphatest_fragment:bo,alphatest_pars_fragment:Co,aomap_fragment:Po,aomap_pars_fragment:Lo,batching_pars_vertex:Uo,batching_vertex:Do,begin_vertex:wo,beginnormal_vertex:Io,bsdfs:No,iridescence_fragment:yo,bumpmap_pars_fragment:Fo,clipping_planes_fragment:Oo,clipping_planes_pars_fragment:Bo,clipping_planes_pars_vertex:Go,clipping_planes_vertex:Ho,color_fragment:Vo,color_pars_fragment:Wo,color_pars_vertex:ko,color_vertex:zo,common:Xo,cube_uv_reflection_fragment:Ko,defaultnormal_vertex:Yo,displacementmap_pars_vertex:qo,displacementmap_vertex:Zo,emissivemap_fragment:$o,emissivemap_pars_fragment:Qo,colorspace_fragment:Jo,colorspace_pars_fragment:jo,envmap_fragment:es,envmap_common_pars_fragment:ts,envmap_pars_fragment:ns,envmap_pars_vertex:is,envmap_physical_pars_fragment:hs,envmap_vertex:rs,fog_vertex:as,fog_pars_vertex:os,fog_fragment:ss,fog_pars_fragment:ls,gradientmap_pars_fragment:cs,lightmap_pars_fragment:fs,lights_lambert_fragment:ds,lights_lambert_pars_fragment:us,lights_pars_begin:ps,lights_toon_fragment:ms,lights_toon_pars_fragment:_s,lights_phong_fragment:gs,lights_phong_pars_fragment:vs,lights_physical_fragment:Ss,lights_physical_pars_fragment:Es,lights_fragment_begin:Ms,lights_fragment_maps:xs,lights_fragment_end:Ts,lightprobes_pars_fragment:As,logdepthbuf_fragment:Rs,logdepthbuf_pars_fragment:bs,logdepthbuf_pars_vertex:Cs,logdepthbuf_vertex:Ps,map_fragment:Ls,map_pars_fragment:Us,map_particle_fragment:Ds,map_particle_pars_fragment:ws,metalnessmap_fragment:Is,metalnessmap_pars_fragment:Ns,morphinstance_vertex:ys,morphcolor_vertex:Fs,morphnormal_vertex:Os,morphtarget_pars_vertex:Bs,morphtarget_vertex:Gs,normal_fragment_begin:Hs,normal_fragment_maps:Vs,normal_pars_fragment:Ws,normal_pars_vertex:ks,normal_vertex:zs,normalmap_pars_fragment:Xs,clearcoat_normal_fragment_begin:Ks,clearcoat_normal_fragment_maps:Ys,clearcoat_pars_fragment:qs,iridescence_pars_fragment:Zs,opaque_fragment:$s,packing:Qs,premultiplied_alpha_fragment:Js,project_vertex:js,dithering_fragment:el,dithering_pars_fragment:tl,roughnessmap_fragment:nl,roughnessmap_pars_fragment:il,shadowmap_pars_fragment:rl,shadowmap_pars_vertex:al,shadowmap_vertex:ol,shadowmask_pars_fragment:sl,skinbase_vertex:ll,skinning_pars_vertex:cl,skinning_vertex:fl,skinnormal_vertex:dl,specularmap_fragment:ul,specularmap_pars_fragment:pl,tonemapping_fragment:hl,tonemapping_pars_fragment:ml,transmission_fragment:_l,transmission_pars_fragment:gl,uv_pars_fragment:vl,uv_pars_vertex:Sl,uv_vertex:El,worldpos_vertex:Ml,background_vert:xl,background_frag:Tl,backgroundCube_vert:Al,backgroundCube_frag:Rl,cube_vert:bl,cube_frag:Cl,depth_vert:Pl,depth_frag:Ll,distance_vert:Ul,distance_frag:Dl,equirect_vert:wl,equirect_frag:Il,linedashed_vert:Nl,linedashed_frag:yl,meshbasic_vert:Fl,meshbasic_frag:Ol,meshlambert_vert:Bl,meshlambert_frag:Gl,meshmatcap_vert:Hl,meshmatcap_frag:Vl,meshnormal_vert:Wl,meshnormal_frag:kl,meshphong_vert:zl,meshphong_frag:Xl,meshphysical_vert:Kl,meshphysical_frag:Yl,meshtoon_vert:ql,meshtoon_frag:Zl,points_vert:$l,points_frag:Ql,shadow_vert:Jl,shadow_frag:jl,sprite_vert:ec,sprite_frag:tc},le={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ye},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ye}},envmap:{envMap:{value:null},envMapRotation:{value:new ye},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ye},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Ne},probesMax:{value:new Ne},probesResolution:{value:new Ne}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0},uvTransform:{value:new ye}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ye},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0}}},Rt={basic:{uniforms:gt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Pe.meshbasic_vert,fragmentShader:Pe.meshbasic_frag},lambert:{uniforms:gt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new je(0)},envMapIntensity:{value:1}}]),vertexShader:Pe.meshlambert_vert,fragmentShader:Pe.meshlambert_frag},phong:{uniforms:gt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Pe.meshphong_vert,fragmentShader:Pe.meshphong_frag},standard:{uniforms:gt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Pe.meshphysical_vert,fragmentShader:Pe.meshphysical_frag},toon:{uniforms:gt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new je(0)}}]),vertexShader:Pe.meshtoon_vert,fragmentShader:Pe.meshtoon_frag},matcap:{uniforms:gt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Pe.meshmatcap_vert,fragmentShader:Pe.meshmatcap_frag},points:{uniforms:gt([le.points,le.fog]),vertexShader:Pe.points_vert,fragmentShader:Pe.points_frag},dashed:{uniforms:gt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Pe.linedashed_vert,fragmentShader:Pe.linedashed_frag},depth:{uniforms:gt([le.common,le.displacementmap]),vertexShader:Pe.depth_vert,fragmentShader:Pe.depth_frag},normal:{uniforms:gt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Pe.meshnormal_vert,fragmentShader:Pe.meshnormal_frag},sprite:{uniforms:gt([le.sprite,le.fog]),vertexShader:Pe.sprite_vert,fragmentShader:Pe.sprite_frag},background:{uniforms:{uvTransform:{value:new ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Pe.background_vert,fragmentShader:Pe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ye}},vertexShader:Pe.backgroundCube_vert,fragmentShader:Pe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Pe.cube_vert,fragmentShader:Pe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Pe.equirect_vert,fragmentShader:Pe.equirect_frag},distance:{uniforms:gt([le.common,le.displacementmap,{referencePosition:{value:new Ne},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Pe.distance_vert,fragmentShader:Pe.distance_frag},shadow:{uniforms:gt([le.lights,le.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:Pe.shadow_vert,fragmentShader:Pe.shadow_frag}};Rt.physical={uniforms:gt([Rt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ye},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ye},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ye},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ye},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ye},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ye},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ye}}]),vertexShader:Pe.meshphysical_vert,fragmentShader:Pe.meshphysical_frag};const yn={r:0,b:0,g:0},nc=new Wt,ya=new ye;ya.set(-1,0,0,0,1,0,0,0,1);function ic(e,n,t,i,l,o){const d=new je(0);let g=l===!0?0:1,R,T,H=null,I=0,p=null;function x(L){let z=L.isScene===!0?L.background:null;if(z&&z.isTexture){const h=L.backgroundBlurriness>0;z=n.get(z,h)}return z}function N(L){let z=!1;const h=x(L);h===null?f(d,g):h&&h.isColor&&(f(h,1),z=!0);const S=e.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,o):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,o),(e.autoClear||z)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function W(L,z){const h=x(z);h&&(h.isCubeTexture||h.mapping===sn)?(T===void 0&&(T=new Pt(new En(1,1,1),new Lt({name:"BackgroundCubeMaterial",uniforms:Wn(Rt.backgroundCube.uniforms),vertexShader:Rt.backgroundCube.vertexShader,fragmentShader:Rt.backgroundCube.fragmentShader,side:vt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),T.geometry.deleteAttribute("normal"),T.geometry.deleteAttribute("uv"),T.onBeforeRender=function(S,m,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(T.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(T)),T.material.uniforms.envMap.value=h,T.material.uniforms.backgroundBlurriness.value=z.backgroundBlurriness,T.material.uniforms.backgroundIntensity.value=z.backgroundIntensity,T.material.uniforms.backgroundRotation.value.setFromMatrix4(nc.makeRotationFromEuler(z.backgroundRotation)).transpose(),h.isCubeTexture&&h.isRenderTargetTexture===!1&&T.material.uniforms.backgroundRotation.value.premultiply(ya),T.material.toneMapped=tt.getTransfer(h.colorSpace)!==Ye,(H!==h||I!==h.version||p!==e.toneMapping)&&(T.material.needsUpdate=!0,H=h,I=h.version,p=e.toneMapping),T.layers.enableAll(),L.unshift(T,T.geometry,T.material,0,0,null)):h&&h.isTexture&&(R===void 0&&(R=new Pt(new kn(2,2),new Lt({name:"BackgroundMaterial",uniforms:Wn(Rt.background.uniforms),vertexShader:Rt.background.vertexShader,fragmentShader:Rt.background.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),R.geometry.deleteAttribute("normal"),Object.defineProperty(R.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(R)),R.material.uniforms.t2D.value=h,R.material.uniforms.backgroundIntensity.value=z.backgroundIntensity,R.material.toneMapped=tt.getTransfer(h.colorSpace)!==Ye,h.matrixAutoUpdate===!0&&h.updateMatrix(),R.material.uniforms.uvTransform.value.copy(h.matrix),(H!==h||I!==h.version||p!==e.toneMapping)&&(R.material.needsUpdate=!0,H=h,I=h.version,p=e.toneMapping),R.layers.enableAll(),L.unshift(R,R.geometry,R.material,0,0,null))}function f(L,z){L.getRGB(yn,_r(e)),t.buffers.color.setClear(yn.r,yn.g,yn.b,z,o)}function s(){T!==void 0&&(T.geometry.dispose(),T.material.dispose(),T=void 0),R!==void 0&&(R.geometry.dispose(),R.material.dispose(),R=void 0)}return{getClearColor:function(){return d},setClearColor:function(L,z=1){d.set(L),g=z,f(d,g)},getClearAlpha:function(){return g},setClearAlpha:function(L){g=L,f(d,g)},render:N,addToRenderList:W,dispose:s}}function rc(e,n){const t=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},l=p(null);let o=l,d=!1;function g(F,G,q,P,K){let Q=!1;const Y=I(F,P,q,G);o!==Y&&(o=Y,T(o.object)),Q=x(F,P,q,K),Q&&N(F,P,q,K),K!==null&&n.update(K,e.ELEMENT_ARRAY_BUFFER),(Q||d)&&(d=!1,h(F,G,q,P),K!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(K).buffer))}function R(){return e.createVertexArray()}function T(F){return e.bindVertexArray(F)}function H(F){return e.deleteVertexArray(F)}function I(F,G,q,P){const K=P.wireframe===!0;let Q=i[G.id];Q===void 0&&(Q={},i[G.id]=Q);const Y=F.isInstancedMesh===!0?F.id:0;let ne=Q[Y];ne===void 0&&(ne={},Q[Y]=ne);let Z=ne[q.id];Z===void 0&&(Z={},ne[q.id]=Z);let j=Z[K];return j===void 0&&(j=p(R()),Z[K]=j),j}function p(F){const G=[],q=[],P=[];for(let K=0;K<t;K++)G[K]=0,q[K]=0,P[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:G,enabledAttributes:q,attributeDivisors:P,object:F,attributes:{},index:null}}function x(F,G,q,P){const K=o.attributes,Q=G.attributes;let Y=0;const ne=q.getAttributes();for(const Z in ne)if(ne[Z].location>=0){const ee=K[Z];let be=Q[Z];if(be===void 0&&(Z==="instanceMatrix"&&F.instanceMatrix&&(be=F.instanceMatrix),Z==="instanceColor"&&F.instanceColor&&(be=F.instanceColor)),ee===void 0||ee.attribute!==be||be&&ee.data!==be.data)return!0;Y++}return o.attributesNum!==Y||o.index!==P}function N(F,G,q,P){const K={},Q=G.attributes;let Y=0;const ne=q.getAttributes();for(const Z in ne)if(ne[Z].location>=0){let ee=Q[Z];ee===void 0&&(Z==="instanceMatrix"&&F.instanceMatrix&&(ee=F.instanceMatrix),Z==="instanceColor"&&F.instanceColor&&(ee=F.instanceColor));const be={};be.attribute=ee,ee&&ee.data&&(be.data=ee.data),K[Z]=be,Y++}o.attributes=K,o.attributesNum=Y,o.index=P}function W(){const F=o.newAttributes;for(let G=0,q=F.length;G<q;G++)F[G]=0}function f(F){s(F,0)}function s(F,G){const q=o.newAttributes,P=o.enabledAttributes,K=o.attributeDivisors;q[F]=1,P[F]===0&&(e.enableVertexAttribArray(F),P[F]=1),K[F]!==G&&(e.vertexAttribDivisor(F,G),K[F]=G)}function L(){const F=o.newAttributes,G=o.enabledAttributes;for(let q=0,P=G.length;q<P;q++)G[q]!==F[q]&&(e.disableVertexAttribArray(q),G[q]=0)}function z(F,G,q,P,K,Q,Y){Y===!0?e.vertexAttribIPointer(F,G,q,K,Q):e.vertexAttribPointer(F,G,q,P,K,Q)}function h(F,G,q,P){W();const K=P.attributes,Q=q.getAttributes(),Y=G.defaultAttributeValues;for(const ne in Q){const Z=Q[ne];if(Z.location>=0){let j=K[ne];if(j===void 0&&(ne==="instanceMatrix"&&F.instanceMatrix&&(j=F.instanceMatrix),ne==="instanceColor"&&F.instanceColor&&(j=F.instanceColor)),j!==void 0){const ee=j.normalized,be=j.itemSize,Re=n.get(j);if(Re===void 0)continue;const it=Re.buffer,ke=Re.type,ze=Re.bytesPerElement,V=ke===e.INT||ke===e.UNSIGNED_INT||j.gpuType===zn;if(j.isInterleavedBufferAttribute){const $=j.data,Ee=$.stride,Ue=j.offset;if($.isInstancedInterleavedBuffer){for(let me=0;me<Z.locationSize;me++)s(Z.location+me,$.meshPerAttribute);F.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let me=0;me<Z.locationSize;me++)f(Z.location+me);e.bindBuffer(e.ARRAY_BUFFER,it);for(let me=0;me<Z.locationSize;me++)z(Z.location+me,be/Z.locationSize,ke,ee,Ee*ze,(Ue+be/Z.locationSize*me)*ze,V)}else{if(j.isInstancedBufferAttribute){for(let $=0;$<Z.locationSize;$++)s(Z.location+$,j.meshPerAttribute);F.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let $=0;$<Z.locationSize;$++)f(Z.location+$);e.bindBuffer(e.ARRAY_BUFFER,it);for(let $=0;$<Z.locationSize;$++)z(Z.location+$,be/Z.locationSize,ke,ee,be*ze,be/Z.locationSize*$*ze,V)}}else if(Y!==void 0){const ee=Y[ne];if(ee!==void 0)switch(ee.length){case 2:e.vertexAttrib2fv(Z.location,ee);break;case 3:e.vertexAttrib3fv(Z.location,ee);break;case 4:e.vertexAttrib4fv(Z.location,ee);break;default:e.vertexAttrib1fv(Z.location,ee)}}}}L()}function S(){_();for(const F in i){const G=i[F];for(const q in G){const P=G[q];for(const K in P){const Q=P[K];for(const Y in Q)H(Q[Y].object),delete Q[Y];delete P[K]}}delete i[F]}}function m(F){if(i[F.id]===void 0)return;const G=i[F.id];for(const q in G){const P=G[q];for(const K in P){const Q=P[K];for(const Y in Q)H(Q[Y].object),delete Q[Y];delete P[K]}}delete i[F.id]}function D(F){for(const G in i){const q=i[G];for(const P in q){const K=q[P];if(K[F.id]===void 0)continue;const Q=K[F.id];for(const Y in Q)H(Q[Y].object),delete Q[Y];delete K[F.id]}}}function c(F){for(const G in i){const q=i[G],P=F.isInstancedMesh===!0?F.id:0,K=q[P];if(K!==void 0){for(const Q in K){const Y=K[Q];for(const ne in Y)H(Y[ne].object),delete Y[ne];delete K[Q]}delete q[P],Object.keys(q).length===0&&delete i[G]}}}function _(){w(),d=!0,o!==l&&(o=l,T(o.object))}function w(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:g,reset:_,resetDefaultState:w,dispose:S,releaseStatesOfGeometry:m,releaseStatesOfObject:c,releaseStatesOfProgram:D,initAttributes:W,enableAttribute:f,disableUnusedAttributes:L}}function ac(e,n,t){let i;function l(R){i=R}function o(R,T){e.drawArrays(i,R,T),t.update(T,i,1)}function d(R,T,H){H!==0&&(e.drawArraysInstanced(i,R,T,H),t.update(T,i,H))}function g(R,T,H){if(H===0)return;n.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,R,0,T,0,H);let p=0;for(let x=0;x<H;x++)p+=T[x];t.update(p,i,1)}this.setMode=l,this.render=o,this.renderInstances=d,this.renderMultiDraw=g}function oc(e,n,t,i){let l;function o(){if(l!==void 0)return l;if(n.has("EXT_texture_filter_anisotropic")===!0){const D=n.get("EXT_texture_filter_anisotropic");l=e.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function d(D){return!(D!==Dt&&i.convert(D)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function g(D){const c=D===Ut&&(n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float"));return!(D!==Tt&&D!==yt&&!c&&i.convert(D)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function R(D){if(D==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let T=t.precision!==void 0?t.precision:"highp";const H=R(T);H!==T&&(Ve("WebGLRenderer:",T,"not supported, using",H,"instead."),T=H);const I=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&n.has("EXT_clip_control");t.reversedDepthBuffer===!0&&p===!1&&Ve("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const x=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),N=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),W=e.getParameter(e.MAX_TEXTURE_SIZE),f=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),s=e.getParameter(e.MAX_VERTEX_ATTRIBS),L=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),z=e.getParameter(e.MAX_VARYING_VECTORS),h=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),S=e.getParameter(e.MAX_SAMPLES),m=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:R,textureFormatReadable:d,textureTypeReadable:g,precision:T,logarithmicDepthBuffer:I,reversedDepthBuffer:p,maxTextures:x,maxVertexTextures:N,maxTextureSize:W,maxCubemapSize:f,maxAttributes:s,maxVertexUniforms:L,maxVaryings:z,maxFragmentUniforms:h,maxSamples:S,samples:m}}function sc(e){const n=this;let t=null,i=0,l=!1,o=!1;const d=new gr,g=new ye,R={value:null,needsUpdate:!1};this.uniform=R,this.numPlanes=0,this.numIntersection=0,this.init=function(I,p){const x=I.length!==0||p||i!==0||l;return l=p,i=I.length,x},this.beginShadows=function(){o=!0,H(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(I,p){t=H(I,p,0)},this.setState=function(I,p,x){const N=I.clippingPlanes,W=I.clipIntersection,f=I.clipShadows,s=e.get(I);if(!l||N===null||N.length===0||o&&!f)o?H(null):T();else{const L=o?0:i,z=L*4;let h=s.clippingState||null;R.value=h,h=H(N,p,z,x);for(let S=0;S!==z;++S)h[S]=t[S];s.clippingState=h,this.numIntersection=W?this.numPlanes:0,this.numPlanes+=L}};function T(){R.value!==t&&(R.value=t,R.needsUpdate=i>0),n.numPlanes=i,n.numIntersection=0}function H(I,p,x,N){const W=I!==null?I.length:0;let f=null;if(W!==0){if(f=R.value,N!==!0||f===null){const s=x+W*4,L=p.matrixWorldInverse;g.getNormalMatrix(L),(f===null||f.length<s)&&(f=new Float32Array(s));for(let z=0,h=x;z!==W;++z,h+=4)d.copy(I[z]).applyMatrix4(L,g),d.normal.toArray(f,h),f[h+3]=d.constant}R.value=f,R.needsUpdate=!0}return n.numPlanes=W,n.numIntersection=0,f}}const rn=4,lc=6,cc=20,fc=256,mn=new Xn,Fa=new je;let $i=null,Qi=0,Ji=0,ji=!1;const dc=new Ne,Zt=new Ne;class er{constructor(n){this._renderer=n,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(n,t=0,i=.1,l=100,o={}){const{size:d=256,position:g=dc}=o;$i=this._renderer.getRenderTarget(),Qi=this._renderer.getActiveCubeFace(),Ji=this._renderer.getActiveMipmapLevel(),ji=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(d);const R=this._allocateTargets();return R.depthBuffer=!0,this._sceneToCubeUV(n,i,l,R,g),t>0&&this._blur(R,0,0,t),this._applyPMREM(R),this._cleanup(R),R}fromEquirectangular(n,t=null){return this._fromTexture(n,t)}fromCubemap(n,t=null){return this._fromTexture(n,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ga(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ba(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(n){this._lodMax=Math.floor(Math.log2(n)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let n=0;n<this._lodMeshes.length;n++)this._lodMeshes[n].geometry.dispose()}_cleanup(n){this._renderer.setRenderTarget($i,Qi,Ji),this._renderer.xr.enabled=ji,n.scissorTest=!1,an(n,0,0,n.width,n.height)}_fromTexture(n,t){n.mapping===jt||n.mapping===kt?this._setSize(n.image.length===0?16:n.image[0].width||n.image[0].image.width):this._setSize(n.image.width/4),$i=this._renderer.getRenderTarget(),Qi=this._renderer.getActiveCubeFace(),Ji=this._renderer.getActiveMipmapLevel(),ji=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(n,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const n=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:St,minFilter:St,generateMipmaps:!1,type:Ut,format:Dt,colorSpace:Kn,depthBuffer:!1},l=Oa(n,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==n||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Oa(n,t,i);const{_lodMax:o}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=uc(o)),this._blurMaterial=hc(o,n,t),this._ggxMaterial=pc(o,n,t)}return l}_compileMaterial(n){const t=new Pt(new ln,n);this._renderer.compile(t,mn)}_sceneToCubeUV(n,t,i,l,o){const R=new cn(90,1,t,i),T=[1,-1,1,1,1,1],H=[1,1,1,-1,-1,-1],I=this._renderer,p=I.autoClear,x=I.toneMapping;I.getClearColor(Fa),I.toneMapping=At,I.autoClear=!1,I.state.buffers.depth.getReversed()&&(I.setRenderTarget(l),I.clearDepth(),I.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Pt(new En,new vr({name:"PMREM.Background",side:vt,depthWrite:!1,depthTest:!1})));const W=this._backgroundBox,f=W.material;let s=!1;const L=n.background;L?L.isColor&&(f.color.copy(L),n.background=null,s=!0):(f.color.copy(Fa),s=!0);for(let z=0;z<6;z++){const h=z%3;h===0?(R.up.set(0,T[z],0),R.position.set(o.x,o.y,o.z),R.lookAt(o.x+H[z],o.y,o.z)):h===1?(R.up.set(0,0,T[z]),R.position.set(o.x,o.y,o.z),R.lookAt(o.x,o.y+H[z],o.z)):(R.up.set(0,T[z],0),R.position.set(o.x,o.y,o.z),R.lookAt(o.x,o.y,o.z+H[z]));const S=this._cubeSize;an(l,h*S,z>2?S:0,S,S),I.setRenderTarget(l),s&&I.render(W,R),I.render(n,R)}I.toneMapping=x,I.autoClear=p,n.background=L}_textureToCubeUV(n,t){const i=this._renderer,l=n.mapping===jt||n.mapping===kt;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ga()),this._cubemapMaterial.uniforms.flipEnvMap.value=n.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ba());const o=l?this._cubemapMaterial:this._equirectMaterial,d=this._lodMeshes[0];d.material=o;const g=o.uniforms;g.envMap.value=n;const R=this._cubeSize;an(t,0,0,3*R,2*R),i.setRenderTarget(t),i.render(d,mn)}_applyPMREM(n){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const l=this._lodMeshes.length;for(let o=1;o<l;o++)this._applyGGXFilter(n,o-1,o);t.autoClear=i}_applyGGXFilter(n,t,i){const l=this._renderer,o=this._pingPongRenderTarget,d=this._ggxMaterial,g=this._lodMeshes[i];g.material=d;const R=d.uniforms,T=i/(this._lodMeshes.length-1),H=t/(this._lodMeshes.length-1),I=Math.sqrt(T*T-H*H),p=T*1.25,x=I*p,{_lodMax:N}=this,W=this._sizeLods[i],f=3*W*(i>N-rn?i-N+rn:0),s=4*(this._cubeSize-W);R.envMap.value=n.texture,R.roughness.value=x,R.mipInt.value=N-t,an(o,f,s,3*W,2*W),l.setRenderTarget(o),l.render(g,mn),R.envMap.value=o.texture,R.roughness.value=0,R.mipInt.value=N-i,an(n,f,s,3*W,2*W),l.setRenderTarget(n),l.render(g,mn)}_blur(n,t,i,l){const o=this._pingPongRenderTarget,d=Math.min(l,Math.PI)/Math.SQRT2;this._blurPass(n,o,t,i,d),this._blurPass(o,n,i,i,d)}_blurPass(n,t,i,l,o){const d=this._renderer,g=this._blurMaterial,R=this._lodMeshes[l];R.material=g;const T=g.uniforms;T.envMap.value=n.texture,T.sigma.value=o,T.mipInt.value=this._lodMax-i;const H=this._sizeLods[l],I=3*H*(l>this._lodMax-rn?l-this._lodMax+rn:0),p=4*(this._cubeSize-H);an(t,I,p,3*H,2*H),d.setRenderTarget(t),d.render(R,mn)}}function uc(e){const n=[],t=[];let i=e;const l=e-rn+1+lc;for(let o=0;o<l;o++){const d=Math.pow(2,i);n.push(d);const g=1/(d-2),R=-g,T=1+g,H=[R,R,T,R,T,T,R,R,T,T,R,T],I=6,p=6,x=3,N=new Float32Array(x*p*I),W=new Float32Array(x*p*I);for(let s=0;s<I;s++){const L=s%3*2/3-1,z=s>2?0:-1,h=[L,z,0,L+2/3,z,0,L+2/3,z+1,0,L,z,0,L+2/3,z+1,0,L,z+1,0];N.set(h,x*p*s);for(let S=0;S<p;S++){const m=H[S*2]*2-1,D=H[S*2+1]*2-1;s===0?Zt.set(1,D,m):s===1?Zt.set(-m,1,-D):s===2?Zt.set(-m,D,1):s===3?Zt.set(-1,D,-m):s===4?Zt.set(-m,-1,D):Zt.set(m,D,-1),Zt.toArray(W,(s*p+S)*x)}}const f=new ln;f.setAttribute("position",new Mn(N,x)),f.setAttribute("outputDirection",new Mn(W,x)),t.push(new Pt(f,null)),i>rn&&i--}return{lodMeshes:t,sizeLods:n}}function Oa(e,n,t){const i=new Mt(e,n,t);return i.texture.mapping=sn,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function an(e,n,t,i,l){e.viewport.set(n,t,i,l),e.scissor.set(n,t,i,l)}function pc(e,n,t){return new Lt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:fc,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Fn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:wt,depthTest:!1,depthWrite:!1})}function hc(e,n,t){return new Lt({name:"SphericalGaussianBlur",defines:{SAMPLES:cc,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Fn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:wt,depthTest:!1,depthWrite:!1})}function Ba(){return new Lt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:wt,depthTest:!1,depthWrite:!1})}function Ga(){return new Lt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:wt,depthTest:!1,depthWrite:!1})}function Fn(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class tr extends Mt{constructor(n=1,t={}){super(n,n,t),this.isWebGLCubeRenderTarget=!0;const i={width:n,height:n,depth:1},l=[i,i,i,i,i,i];this.texture=new Yn(l),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(n,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new En(5,5,5),o=new Lt({name:"CubemapFromEquirect",uniforms:Wn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:vt,blending:wt});o.uniforms.tEquirect.value=t;const d=new Pt(l,o),g=t.minFilter;return t.minFilter===zt&&(t.minFilter=St),new Sr(1,10,this).update(n,d),t.minFilter=g,d.geometry.dispose(),d.material.dispose(),this}clear(n,t=!0,i=!0,l=!0){const o=n.getRenderTarget();for(let d=0;d<6;d++)n.setRenderTarget(this,d),n.clear(t,i,l);n.setRenderTarget(o)}}function mc(e){let n=new WeakMap,t=new WeakMap,i=null;function l(p,x=!1){return p==null?null:x?d(p):o(p)}function o(p){if(p&&p.isTexture){const x=p.mapping;if(x===xn||x===Tn)if(n.has(p)){const N=n.get(p).texture;return g(N,p.mapping)}else{const N=p.image;if(N&&N.height>0){const W=new tr(N.height);return W.fromEquirectangularTexture(e,p),n.set(p,W),p.addEventListener("dispose",T),g(W.texture,p.mapping)}else return null}}return p}function d(p){if(p&&p.isTexture){const x=p.mapping,N=x===xn||x===Tn,W=x===jt||x===kt;if(N||W){let f=t.get(p);const s=f!==void 0?f.texture.pmremVersion:0;if(p.isRenderTargetTexture&&p.pmremVersion!==s)return i===null&&(i=new er(e)),f=N?i.fromEquirectangular(p,f):i.fromCubemap(p,f),f.texture.pmremVersion=p.pmremVersion,t.set(p,f),f.texture;if(f!==void 0)return f.texture;{const L=p.image;return N&&L&&L.height>0||W&&L&&R(L)?(i===null&&(i=new er(e)),f=N?i.fromEquirectangular(p):i.fromCubemap(p),f.texture.pmremVersion=p.pmremVersion,t.set(p,f),p.addEventListener("dispose",H),f.texture):null}}}return p}function g(p,x){return x===xn?p.mapping=jt:x===Tn&&(p.mapping=kt),p}function R(p){let x=0;const N=6;for(let W=0;W<N;W++)p[W]!==void 0&&x++;return x===N}function T(p){const x=p.target;x.removeEventListener("dispose",T);const N=n.get(x);N!==void 0&&(n.delete(x),N.dispose())}function H(p){const x=p.target;x.removeEventListener("dispose",H);const N=t.get(x);N!==void 0&&(t.delete(x),N.dispose())}function I(){n=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:l,dispose:I}}function _c(e){const n={};function t(i){if(n[i]!==void 0)return n[i];const l=e.getExtension(i);return n[i]=l,l}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const l=t(i);return l===null&&Er("WebGLRenderer: "+i+" extension not supported."),l}}}function gc(e,n,t,i){const l={},o=new WeakMap;function d(I){const p=I.target;p.index!==null&&n.remove(p.index);for(const N in p.attributes)n.remove(p.attributes[N]);p.removeEventListener("dispose",d),delete l[p.id];const x=o.get(p);x&&(n.remove(x),o.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function g(I,p){return l[p.id]===!0||(p.addEventListener("dispose",d),l[p.id]=!0,t.memory.geometries++),p}function R(I){const p=I.attributes;for(const x in p)n.update(p[x],e.ARRAY_BUFFER)}function T(I){const p=[],x=I.index,N=I.attributes.position;let W=0;if(N===void 0)return;if(x!==null){const L=x.array;W=x.version;for(let z=0,h=L.length;z<h;z+=3){const S=L[z+0],m=L[z+1],D=L[z+2];p.push(S,m,m,D,D,S)}}else{const L=N.array;W=N.version;for(let z=0,h=L.length/3-1;z<h;z+=3){const S=z+0,m=z+1,D=z+2;p.push(S,m,m,D,D,S)}}const f=new(N.count>=65535?Mr:xr)(p,1);f.version=W;const s=o.get(I);s&&n.remove(s),o.set(I,f)}function H(I){const p=o.get(I);if(p){const x=I.index;x!==null&&p.version<x.version&&T(I)}else T(I);return o.get(I)}return{get:g,update:R,getWireframeAttribute:H}}function vc(e,n,t){let i;function l(I){i=I}let o,d;function g(I){o=I.type,d=I.bytesPerElement}function R(I,p){e.drawElements(i,p,o,I*d),t.update(p,i,1)}function T(I,p,x){x!==0&&(e.drawElementsInstanced(i,p,o,I*d,x),t.update(p,i,x))}function H(I,p,x){if(x===0)return;n.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,o,I,0,x);let W=0;for(let f=0;f<x;f++)W+=p[f];t.update(W,i,1)}this.setMode=l,this.setIndex=g,this.render=R,this.renderInstances=T,this.renderMultiDraw=H}function Sc(e){const n={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,d,g){switch(t.calls++,d){case e.TRIANGLES:t.triangles+=g*(o/3);break;case e.LINES:t.lines+=g*(o/2);break;case e.LINE_STRIP:t.lines+=g*(o-1);break;case e.LINE_LOOP:t.lines+=g*o;break;case e.POINTS:t.points+=g*o;break;default:Qe("WebGLInfo: Unknown draw mode:",d);break}}function l(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:n,render:t,programs:null,autoReset:!0,reset:l,update:i}}function Ec(e,n,t){const i=new WeakMap,l=new mt;function o(d,g,R){const T=d.morphTargetInfluences,H=g.morphAttributes.position||g.morphAttributes.normal||g.morphAttributes.color,I=H!==void 0?H.length:0;let p=i.get(g);if(p===void 0||p.count!==I){let _=function(){D.dispose(),i.delete(g),g.removeEventListener("dispose",_)};p!==void 0&&p.texture.dispose();const x=g.morphAttributes.position!==void 0,N=g.morphAttributes.normal!==void 0,W=g.morphAttributes.color!==void 0,f=g.morphAttributes.position||[],s=g.morphAttributes.normal||[],L=g.morphAttributes.color||[];let z=0;x===!0&&(z=1),N===!0&&(z=2),W===!0&&(z=3);let h=g.attributes.position.count*z,S=1;h>n.maxTextureSize&&(S=Math.ceil(h/n.maxTextureSize),h=n.maxTextureSize);const m=new Float32Array(h*S*4*I),D=new qn(m,h,S,I);D.type=yt,D.needsUpdate=!0;const c=z*4;for(let w=0;w<I;w++){const F=f[w],G=s[w],q=L[w],P=h*S*4*w;for(let K=0;K<F.count;K++){const Q=K*c;x===!0&&(l.fromBufferAttribute(F,K),m[P+Q+0]=l.x,m[P+Q+1]=l.y,m[P+Q+2]=l.z,m[P+Q+3]=0),N===!0&&(l.fromBufferAttribute(G,K),m[P+Q+4]=l.x,m[P+Q+5]=l.y,m[P+Q+6]=l.z,m[P+Q+7]=0),W===!0&&(l.fromBufferAttribute(q,K),m[P+Q+8]=l.x,m[P+Q+9]=l.y,m[P+Q+10]=l.z,m[P+Q+11]=q.itemSize===4?l.w:1)}}p={count:I,texture:D,size:new ht(h,S)},i.set(g,p),g.addEventListener("dispose",_)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)R.getUniforms().setValue(e,"morphTexture",d.morphTexture,t);else{let x=0;for(let W=0;W<T.length;W++)x+=T[W];const N=g.morphTargetsRelative?1:1-x;R.getUniforms().setValue(e,"morphTargetBaseInfluence",N),R.getUniforms().setValue(e,"morphTargetInfluences",T)}R.getUniforms().setValue(e,"morphTargetsTexture",p.texture,t),R.getUniforms().setValue(e,"morphTargetsTextureSize",p.size)}return{update:o}}function Mc(e,n,t,i,l){let o=new WeakMap;function d(T){const H=l.render.frame,I=T.geometry,p=n.get(T,I);if(o.get(p)!==H&&(n.update(p),o.set(p,H)),T.isInstancedMesh&&(T.hasEventListener("dispose",R)===!1&&T.addEventListener("dispose",R),o.get(T)!==H&&(t.update(T.instanceMatrix,e.ARRAY_BUFFER),T.instanceColor!==null&&t.update(T.instanceColor,e.ARRAY_BUFFER),o.set(T,H))),T.isSkinnedMesh){const x=T.skeleton;o.get(x)!==H&&(x.update(),o.set(x,H))}return p}function g(){o=new WeakMap}function R(T){const H=T.target;H.removeEventListener("dispose",R),i.releaseStatesOfObject(H),t.remove(H.instanceMatrix),H.instanceColor!==null&&t.remove(H.instanceColor)}return{update:d,dispose:g}}const xc={[ni]:"LINEAR_TONE_MAPPING",[ti]:"REINHARD_TONE_MAPPING",[ei]:"CINEON_TONE_MAPPING",[jn]:"ACES_FILMIC_TONE_MAPPING",[Jn]:"AGX_TONE_MAPPING",[Qn]:"NEUTRAL_TONE_MAPPING",[$n]:"CUSTOM_TONE_MAPPING"};function Tc(e,n,t,i,l,o){const d=new Mt(n,t,{type:e,depthBuffer:l,stencilBuffer:o,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let g=null,R=null;const T=new ln;T.setAttribute("position",new Zn([-1,3,0,-1,-1,0,3,-1,0],3)),T.setAttribute("uv",new Zn([0,2,0,0,2,0],2));const H=new Tr({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),I=new Pt(T,H),p=new Xn(-1,1,1,-1,0,1);let x=null,N=null,W=!1,f,s=null,L=[],z=!1;this.setSize=function(h,S){d.setSize(h,S),g!==null&&g.setSize(h,S),R!==null&&R.setSize(h,S);for(let m=0;m<L.length;m++){const D=L[m];D.setSize&&D.setSize(h,S)}},this.setEffects=function(h){L=h,z=L.length>0&&L[0].isRenderPass===!0;const S=d.width,m=d.height;L.length>0&&g===null&&(g=new Mt(S,m,{type:Ut,depthBuffer:!1,stencilBuffer:!1}),R=new Mt(S,m,{type:Ut,depthBuffer:!1,stencilBuffer:!1}));for(let D=0;D<L.length;D++){const c=L[D];c.setSize&&c.setSize(S,m)}},this.begin=function(h,S){if(W||h.toneMapping===At&&L.length===0)return!1;if(s=S,S!==null){const m=S.width,D=S.height;(d.width!==m||d.height!==D)&&this.setSize(m,D)}return z===!1&&h.setRenderTarget(d),f=h.toneMapping,h.toneMapping=At,!0},this.hasRenderPass=function(){return z},this.end=function(h,S){h.toneMapping=f,W=!0;let m=d,D=g;for(let c=0;c<L.length;c++){const _=L[c];_.enabled!==!1&&(_.render(h,D,m,S),_.needsSwap!==!1&&(m=D,D=D===g?R:g))}if(x!==h.outputColorSpace||N!==h.toneMapping){x=h.outputColorSpace,N=h.toneMapping,H.defines={},tt.getTransfer(x)===Ye&&(H.defines.SRGB_TRANSFER="");const c=xc[N];c&&(H.defines[c]=""),H.needsUpdate=!0}H.uniforms.tDiffuse.value=m.texture,h.setRenderTarget(s),h.render(I,p),s=null,W=!1},this.isCompositing=function(){return W},this.dispose=function(){d.dispose(),g!==null&&g.dispose(),R!==null&&R.dispose(),T.dispose(),H.dispose()}}const Ha=new Rr,nr=new fn(1,1),Va=new qn,Wa=new Ar,ka=new Yn,za=[],Xa=[],Ka=new Float32Array(16),Ya=new Float32Array(9),qa=new Float32Array(4);function on(e,n,t){const i=e[0];if(i<=0||i>0)return e;const l=n*t;let o=za[l];if(o===void 0&&(o=new Float32Array(l),za[l]=o),n!==0){i.toArray(o,0);for(let d=1,g=0;d!==n;++d)g+=t,e[d].toArray(o,g)}return o}function lt(e,n){if(e.length!==n.length)return!1;for(let t=0,i=e.length;t<i;t++)if(e[t]!==n[t])return!1;return!0}function ct(e,n){for(let t=0,i=n.length;t<i;t++)e[t]=n[t]}function On(e,n){let t=Xa[n];t===void 0&&(t=new Int32Array(n),Xa[n]=t);for(let i=0;i!==n;++i)t[i]=e.allocateTextureUnit();return t}function Ac(e,n){const t=this.cache;t[0]!==n&&(e.uniform1f(this.addr,n),t[0]=n)}function Rc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2f(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(lt(t,n))return;e.uniform2fv(this.addr,n),ct(t,n)}}function bc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3f(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else if(n.r!==void 0)(t[0]!==n.r||t[1]!==n.g||t[2]!==n.b)&&(e.uniform3f(this.addr,n.r,n.g,n.b),t[0]=n.r,t[1]=n.g,t[2]=n.b);else{if(lt(t,n))return;e.uniform3fv(this.addr,n),ct(t,n)}}function Cc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4f(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(lt(t,n))return;e.uniform4fv(this.addr,n),ct(t,n)}}function Pc(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(lt(t,n))return;e.uniformMatrix2fv(this.addr,!1,n),ct(t,n)}else{if(lt(t,i))return;qa.set(i),e.uniformMatrix2fv(this.addr,!1,qa),ct(t,i)}}function Lc(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(lt(t,n))return;e.uniformMatrix3fv(this.addr,!1,n),ct(t,n)}else{if(lt(t,i))return;Ya.set(i),e.uniformMatrix3fv(this.addr,!1,Ya),ct(t,i)}}function Uc(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(lt(t,n))return;e.uniformMatrix4fv(this.addr,!1,n),ct(t,n)}else{if(lt(t,i))return;Ka.set(i),e.uniformMatrix4fv(this.addr,!1,Ka),ct(t,i)}}function Dc(e,n){const t=this.cache;t[0]!==n&&(e.uniform1i(this.addr,n),t[0]=n)}function wc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2i(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(lt(t,n))return;e.uniform2iv(this.addr,n),ct(t,n)}}function Ic(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3i(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(lt(t,n))return;e.uniform3iv(this.addr,n),ct(t,n)}}function Nc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4i(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(lt(t,n))return;e.uniform4iv(this.addr,n),ct(t,n)}}function yc(e,n){const t=this.cache;t[0]!==n&&(e.uniform1ui(this.addr,n),t[0]=n)}function Fc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2ui(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(lt(t,n))return;e.uniform2uiv(this.addr,n),ct(t,n)}}function Oc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3ui(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(lt(t,n))return;e.uniform3uiv(this.addr,n),ct(t,n)}}function Bc(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4ui(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(lt(t,n))return;e.uniform4uiv(this.addr,n),ct(t,n)}}function Gc(e,n,t){const i=this.cache,l=t.allocateTextureUnit();i[0]!==l&&(e.uniform1i(this.addr,l),i[0]=l);let o;this.type===e.SAMPLER_2D_SHADOW?(nr.compareFunction=t.isReversedDepthBuffer()?An:Rn,o=nr):o=Ha,t.setTexture2D(n||o,l)}function Hc(e,n,t){const i=this.cache,l=t.allocateTextureUnit();i[0]!==l&&(e.uniform1i(this.addr,l),i[0]=l),t.setTexture3D(n||Wa,l)}function Vc(e,n,t){const i=this.cache,l=t.allocateTextureUnit();i[0]!==l&&(e.uniform1i(this.addr,l),i[0]=l),t.setTextureCube(n||ka,l)}function Wc(e,n,t){const i=this.cache,l=t.allocateTextureUnit();i[0]!==l&&(e.uniform1i(this.addr,l),i[0]=l),t.setTexture2DArray(n||Va,l)}function kc(e){switch(e){case 5126:return Ac;case 35664:return Rc;case 35665:return bc;case 35666:return Cc;case 35674:return Pc;case 35675:return Lc;case 35676:return Uc;case 5124:case 35670:return Dc;case 35667:case 35671:return wc;case 35668:case 35672:return Ic;case 35669:case 35673:return Nc;case 5125:return yc;case 36294:return Fc;case 36295:return Oc;case 36296:return Bc;case 35678:case 36198:case 36298:case 36306:case 35682:return Gc;case 35679:case 36299:case 36307:return Hc;case 35680:case 36300:case 36308:case 36293:return Vc;case 36289:case 36303:case 36311:case 36292:return Wc}}function zc(e,n){e.uniform1fv(this.addr,n)}function Xc(e,n){const t=on(n,this.size,2);e.uniform2fv(this.addr,t)}function Kc(e,n){const t=on(n,this.size,3);e.uniform3fv(this.addr,t)}function Yc(e,n){const t=on(n,this.size,4);e.uniform4fv(this.addr,t)}function qc(e,n){const t=on(n,this.size,4);e.uniformMatrix2fv(this.addr,!1,t)}function Zc(e,n){const t=on(n,this.size,9);e.uniformMatrix3fv(this.addr,!1,t)}function $c(e,n){const t=on(n,this.size,16);e.uniformMatrix4fv(this.addr,!1,t)}function Qc(e,n){e.uniform1iv(this.addr,n)}function Jc(e,n){e.uniform2iv(this.addr,n)}function jc(e,n){e.uniform3iv(this.addr,n)}function ef(e,n){e.uniform4iv(this.addr,n)}function tf(e,n){e.uniform1uiv(this.addr,n)}function nf(e,n){e.uniform2uiv(this.addr,n)}function rf(e,n){e.uniform3uiv(this.addr,n)}function af(e,n){e.uniform4uiv(this.addr,n)}function of(e,n,t){const i=this.cache,l=n.length,o=On(t,l);lt(i,o)||(e.uniform1iv(this.addr,o),ct(i,o));let d;this.type===e.SAMPLER_2D_SHADOW?d=nr:d=Ha;for(let g=0;g!==l;++g)t.setTexture2D(n[g]||d,o[g])}function sf(e,n,t){const i=this.cache,l=n.length,o=On(t,l);lt(i,o)||(e.uniform1iv(this.addr,o),ct(i,o));for(let d=0;d!==l;++d)t.setTexture3D(n[d]||Wa,o[d])}function lf(e,n,t){const i=this.cache,l=n.length,o=On(t,l);lt(i,o)||(e.uniform1iv(this.addr,o),ct(i,o));for(let d=0;d!==l;++d)t.setTextureCube(n[d]||ka,o[d])}function cf(e,n,t){const i=this.cache,l=n.length,o=On(t,l);lt(i,o)||(e.uniform1iv(this.addr,o),ct(i,o));for(let d=0;d!==l;++d)t.setTexture2DArray(n[d]||Va,o[d])}function ff(e){switch(e){case 5126:return zc;case 35664:return Xc;case 35665:return Kc;case 35666:return Yc;case 35674:return qc;case 35675:return Zc;case 35676:return $c;case 5124:case 35670:return Qc;case 35667:case 35671:return Jc;case 35668:case 35672:return jc;case 35669:case 35673:return ef;case 5125:return tf;case 36294:return nf;case 36295:return rf;case 36296:return af;case 35678:case 36198:case 36298:case 36306:case 35682:return of;case 35679:case 36299:case 36307:return sf;case 35680:case 36300:case 36308:case 36293:return lf;case 36289:case 36303:case 36311:case 36292:return cf}}class df{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.setValue=kc(t.type)}}class uf{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ff(t.type)}}class pf{constructor(n){this.id=n,this.seq=[],this.map={}}setValue(n,t,i){const l=this.seq;for(let o=0,d=l.length;o!==d;++o){const g=l[o];g.setValue(n,t[g.id],i)}}}const ir=/(\w+)(\])?(\[|\.)?/g;function Za(e,n){e.seq.push(n),e.map[n.id]=n}function hf(e,n,t){const i=e.name,l=i.length;for(ir.lastIndex=0;;){const o=ir.exec(i),d=ir.lastIndex;let g=o[1];const R=o[2]==="]",T=o[3];if(R&&(g=g|0),T===void 0||T==="["&&d+2===l){Za(t,T===void 0?new df(g,e,n):new uf(g,e,n));break}else{let I=t.map[g];I===void 0&&(I=new pf(g),Za(t,I)),t=I}}}class Bn{constructor(n,t){this.seq=[],this.map={};const i=n.getProgramParameter(t,n.ACTIVE_UNIFORMS);for(let d=0;d<i;++d){const g=n.getActiveUniform(t,d),R=n.getUniformLocation(t,g.name);hf(g,R,this)}const l=[],o=[];for(const d of this.seq)d.type===n.SAMPLER_2D_SHADOW||d.type===n.SAMPLER_CUBE_SHADOW||d.type===n.SAMPLER_2D_ARRAY_SHADOW?l.push(d):o.push(d);l.length>0&&(this.seq=l.concat(o))}setValue(n,t,i,l){const o=this.map[t];o!==void 0&&o.setValue(n,i,l)}setOptional(n,t,i){const l=t[i];l!==void 0&&this.setValue(n,i,l)}static upload(n,t,i,l){for(let o=0,d=t.length;o!==d;++o){const g=t[o],R=i[g.id];R.needsUpdate!==!1&&g.setValue(n,R.value,l)}}static seqWithValue(n,t){const i=[];for(let l=0,o=n.length;l!==o;++l){const d=n[l];d.id in t&&i.push(d)}return i}}function $a(e,n,t){const i=e.createShader(n);return e.shaderSource(i,t),e.compileShader(i),i}const mf=37297;let _f=0;function gf(e,n){const t=e.split(`
`),i=[],l=Math.max(n-6,0),o=Math.min(n+6,t.length);for(let d=l;d<o;d++){const g=d+1;i.push(`${g===n?">":" "} ${g}: ${t[d]}`)}return i.join(`
`)}const Qa=new ye;function vf(e){tt._getMatrix(Qa,tt.workingColorSpace,e);const n=`mat3( ${Qa.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(e)){case ri:return[n,"LinearTransferOETF"];case Ye:return[n,"sRGBTransferOETF"];default:return Ve("WebGLProgram: Unsupported color space: ",e),[n,"LinearTransferOETF"]}}function Ja(e,n,t){const i=e.getShaderParameter(n,e.COMPILE_STATUS),o=(e.getShaderInfoLog(n)||"").trim();if(i&&o==="")return"";const d=/ERROR: 0:(\d+)/.exec(o);if(d){const g=parseInt(d[1]);return t.toUpperCase()+`

`+o+`

`+gf(e.getShaderSource(n),g)}else return o}function Sf(e,n){const t=vf(n);return[`vec4 ${e}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Ef={[ni]:"Linear",[ti]:"Reinhard",[ei]:"Cineon",[jn]:"ACESFilmic",[Jn]:"AgX",[Qn]:"Neutral",[$n]:"Custom"};function Mf(e,n){const t=Ef[n];return t===void 0?(Ve("WebGLProgram: Unsupported toneMapping:",n),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Gn=new Ne;function xf(){tt.getLuminanceCoefficients(Gn);const e=Gn.x.toFixed(4),n=Gn.y.toFixed(4),t=Gn.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${n}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Tf(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(_n).join(`
`)}function Af(e){const n=[];for(const t in e){const i=e[t];i!==!1&&n.push("#define "+t+" "+i)}return n.join(`
`)}function Rf(e,n){const t={},i=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES);for(let l=0;l<i;l++){const o=e.getActiveAttrib(n,l),d=o.name;let g=1;o.type===e.FLOAT_MAT2&&(g=2),o.type===e.FLOAT_MAT3&&(g=3),o.type===e.FLOAT_MAT4&&(g=4),t[d]={type:o.type,location:e.getAttribLocation(n,d),locationSize:g}}return t}function _n(e){return e!==""}function ja(e,n){const t=n.numSpotLightShadows+n.numSpotLightMaps-n.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,n.numSunLights).replace(/NUM_DIR_LIGHTS/g,n.numDirLights).replace(/NUM_SPOT_LIGHTS/g,n.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,n.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,n.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,n.numPointLights).replace(/NUM_HEMI_LIGHTS/g,n.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,n.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,n.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,n.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,n.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,n.numPointLightShadows)}function eo(e,n){return e.replace(/NUM_CLIPPING_PLANES/g,n.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,n.numClippingPlanes-n.numClipIntersection)}const bf=/^[ \t]*#include +<([\w\d./]+)>/gm;function rr(e){return e.replace(bf,Pf)}const Cf=new Map;function Pf(e,n){let t=Pe[n];if(t===void 0){const i=Cf.get(n);if(i!==void 0)t=Pe[i],Ve('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',n,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+n+">")}return rr(t)}const Lf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function to(e){return e.replace(Lf,Uf)}function Uf(e,n,t,i){let l="";for(let o=parseInt(n);o<parseInt(t);o++)l+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return l}function no(e){let n=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?n+=`
#define HIGH_PRECISION`:e.precision==="mediump"?n+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(n+=`
#define LOW_PRECISION`),n}const Df={[dn]:"SHADOWMAP_TYPE_PCF",[en]:"SHADOWMAP_TYPE_VSM"};function wf(e){return Df[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const If={[jt]:"ENVMAP_TYPE_CUBE",[kt]:"ENVMAP_TYPE_CUBE",[sn]:"ENVMAP_TYPE_CUBE_UV"};function Nf(e){return e.envMap===!1?"ENVMAP_TYPE_CUBE":If[e.envMapMode]||"ENVMAP_TYPE_CUBE"}const yf={[kt]:"ENVMAP_MODE_REFRACTION"};function Ff(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":yf[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Of={[Pr]:"ENVMAP_BLENDING_MULTIPLY",[Cr]:"ENVMAP_BLENDING_MIX",[br]:"ENVMAP_BLENDING_ADD"};function Bf(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":Of[e.combine]||"ENVMAP_BLENDING_NONE"}function Gf(e){const n=e.envMapCubeUVHeight;if(n===null)return null;const t=Math.log2(n)-2,i=1/n;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Hf(e,n,t,i){const l=e.getContext(),o=t.defines;let d=t.vertexShader,g=t.fragmentShader;const R=wf(t),T=Nf(t),H=Ff(t),I=Bf(t),p=Gf(t),x=Tf(t),N=Af(o),W=l.createProgram();let f,s,L=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N].filter(_n).join(`
`),f.length>0&&(f+=`
`),s=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N].filter(_n).join(`
`),s.length>0&&(s+=`
`)):(f=[no(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+H:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+R:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_n).join(`
`),s=[no(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,N,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+T:"",t.envMap?"#define "+H:"",t.envMap?"#define "+I:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+R:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==At?"#define TONE_MAPPING":"",t.toneMapping!==At?Pe.tonemapping_pars_fragment:"",t.toneMapping!==At?Mf("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Pe.colorspace_pars_fragment,Sf("linearToOutputTexel",t.outputColorSpace),xf(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(_n).join(`
`)),d=rr(d),d=ja(d,t),d=eo(d,t),g=rr(g),g=ja(g,t),g=eo(g,t),d=to(d),g=to(g),t.isRawShaderMaterial!==!0&&(L=`#version 300 es
`,f=[x,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,s=["#define varying in",t.glslVersion===ii?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ii?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+s);const z=L+f+d,h=L+s+g,S=$a(l,l.VERTEX_SHADER,z),m=$a(l,l.FRAGMENT_SHADER,h);l.attachShader(W,S),l.attachShader(W,m),t.index0AttributeName!==void 0?l.bindAttribLocation(W,0,t.index0AttributeName):t.hasPositionAttribute===!0&&l.bindAttribLocation(W,0,"position"),l.linkProgram(W);function D(F){if(e.debug.checkShaderErrors){const G=l.getProgramInfoLog(W)||"",q=l.getShaderInfoLog(S)||"",P=l.getShaderInfoLog(m)||"",K=G.trim(),Q=q.trim(),Y=P.trim();let ne=!0,Z=!0;if(l.getProgramParameter(W,l.LINK_STATUS)===!1)if(ne=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(l,W,S,m);else{const j=Ja(l,S,"vertex"),ee=Ja(l,m,"fragment");Qe("WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(W,l.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+K+`
`+j+`
`+ee)}else K!==""?Ve("WebGLProgram: Program Info Log:",K):(Q===""||Y==="")&&(Z=!1);Z&&(F.diagnostics={runnable:ne,programLog:K,vertexShader:{log:Q,prefix:f},fragmentShader:{log:Y,prefix:s}})}l.deleteShader(S),l.deleteShader(m),c=new Bn(l,W),_=Rf(l,W)}let c;this.getUniforms=function(){return c===void 0&&D(this),c};let _;this.getAttributes=function(){return _===void 0&&D(this),_};let w=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return w===!1&&(w=l.getProgramParameter(W,mf)),w},this.destroy=function(){i.releaseStatesOfProgram(this),l.deleteProgram(W),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=_f++,this.cacheKey=n,this.usedTimes=1,this.program=W,this.vertexShader=S,this.fragmentShader=m,this}let Vf=0;class Wf{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(n,t,i){const l=this._getShaderCacheForMaterial(n);return l.has(t)===!1&&(l.add(t),t.usedTimes++),l.has(i)===!1&&(l.add(i),i.usedTimes++),this}remove(n){const t=this.materialCache.get(n);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(n),this}getVertexShaderStage(n){return this._getShaderStage(n.vertexShader)}getFragmentShaderStage(n){return this._getShaderStage(n.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(n){const t=this.materialCache;let i=t.get(n);return i===void 0&&(i=new Set,t.set(n,i)),i}_getShaderStage(n){const t=this.shaderCache;let i=t.get(n);return i===void 0&&(i=new kf(n),t.set(n,i)),i}}class kf{constructor(n){this.id=Vf++,this.code=n,this.usedTimes=0}}function zf(e){return e===Xt||e===bn||e===Cn}function Xf(e,n,t,i,l,o){const d=new Dr,g=new Wf,R=new Set,T=[],H=new Map,I=i.logarithmicDepthBuffer;let p=i.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function N(c){return R.add(c),c===0?"uv":`uv${c}`}function W(c,_,w,F,G,q){const P=F.fog,K=G.geometry,Q=c.isMeshStandardMaterial||c.isMeshLambertMaterial||c.isMeshPhongMaterial?F.environment:null,Y=c.isMeshStandardMaterial||c.isMeshLambertMaterial&&!c.envMap||c.isMeshPhongMaterial&&!c.envMap,ne=n.get(c.envMap||Q,Y),Z=ne&&ne.mapping===sn?ne.image.height:null,j=x[c.type];c.precision!==null&&(p=i.getMaxPrecision(c.precision),p!==c.precision&&Ve("WebGLProgram.getParameters:",c.precision,"not supported, using",p,"instead."));const ee=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,be=ee!==void 0?ee.length:0;let Re=0;K.morphAttributes.position!==void 0&&(Re=1),K.morphAttributes.normal!==void 0&&(Re=2),K.morphAttributes.color!==void 0&&(Re=3);let it,ke,ze,V;if(j){const Ze=Rt[j];it=Ze.vertexShader,ke=Ze.fragmentShader}else{it=c.vertexShader,ke=c.fragmentShader;const Ze=g.getVertexShaderStage(c),Ge=g.getFragmentShaderStage(c);g.update(c,Ze,Ge),ze=Ze.id,V=Ge.id}const $=e.getRenderTarget(),Ee=e.state.buffers.depth.getReversed(),Ue=G.isInstancedMesh===!0,me=G.isBatchedMesh===!0,Fe=!!c.map,st=!!c.matcap,De=!!ne,Be=!!c.aoMap,qe=!!c.lightMap,Ie=!!c.bumpMap&&c.wireframe===!1,et=!!c.normalMap,ft=!!c.displacementMap,_t=!!c.emissiveMap,nt=!!c.metalnessMap,at=!!c.roughnessMap,M=c.anisotropy>0,dt=c.clearcoat>0,We=c.dispersion>0,u=c.retroreflectivity>0,r=c.iridescence>0,A=c.sheen>0,U=c.transmission>0,O=M&&!!c.anisotropyMap,te=dt&&!!c.clearcoatMap,ie=dt&&!!c.clearcoatNormalMap,B=dt&&!!c.clearcoatRoughnessMap,X=r&&!!c.iridescenceMap,re=r&&!!c.iridescenceThicknessMap,Me=A&&!!c.sheenColorMap,ce=A&&!!c.sheenRoughnessMap,ae=!!c.specularMap,xe=!!c.specularColorMap,Ae=!!c.specularIntensityMap,Ce=U&&!!c.transmissionMap,E=U&&!!c.thicknessMap,oe=!!c.gradientMap,k=!!c.alphaMap,se=c.alphaTest>0,ue=!!c.alphaHash,J=!!c.extensions;let Te=At;c.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Te=e.toneMapping);const ve={shaderID:j,shaderType:c.type,shaderName:c.name,vertexShader:it,fragmentShader:ke,defines:c.defines,customVertexShaderID:ze,customFragmentShaderID:V,isRawShaderMaterial:c.isRawShaderMaterial===!0,glslVersion:c.glslVersion,precision:p,batching:me,batchingColor:me&&G._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&G.instanceColor!==null,instancingMorph:Ue&&G.morphTexture!==null,outputColorSpace:$===null?e.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:tt.workingColorSpace,alphaToCoverage:!!c.alphaToCoverage,map:Fe,matcap:st,envMap:De,envMapMode:De&&ne.mapping,envMapCubeUVHeight:Z,aoMap:Be,lightMap:qe,bumpMap:Ie,normalMap:et,displacementMap:ft,emissiveMap:_t,normalMapObjectSpace:et&&c.normalMapType===Ur,normalMapTangentSpace:et&&c.normalMapType===ai,packedNormalMap:et&&c.normalMapType===ai&&zf(c.normalMap.format),metalnessMap:nt,roughnessMap:at,anisotropy:M,anisotropyMap:O,clearcoat:dt,clearcoatMap:te,clearcoatNormalMap:ie,clearcoatRoughnessMap:B,dispersion:We,retroreflection:u,iridescence:r,iridescenceMap:X,iridescenceThicknessMap:re,sheen:A,sheenColorMap:Me,sheenRoughnessMap:ce,specularMap:ae,specularColorMap:xe,specularIntensityMap:Ae,transmission:U,transmissionMap:Ce,thicknessMap:E,gradientMap:oe,opaque:c.transparent===!1&&c.blending===un&&c.alphaToCoverage===!1,alphaMap:k,alphaTest:se,alphaHash:ue,combine:c.combine,mapUv:Fe&&N(c.map.channel),aoMapUv:Be&&N(c.aoMap.channel),lightMapUv:qe&&N(c.lightMap.channel),bumpMapUv:Ie&&N(c.bumpMap.channel),normalMapUv:et&&N(c.normalMap.channel),displacementMapUv:ft&&N(c.displacementMap.channel),emissiveMapUv:_t&&N(c.emissiveMap.channel),metalnessMapUv:nt&&N(c.metalnessMap.channel),roughnessMapUv:at&&N(c.roughnessMap.channel),anisotropyMapUv:O&&N(c.anisotropyMap.channel),clearcoatMapUv:te&&N(c.clearcoatMap.channel),clearcoatNormalMapUv:ie&&N(c.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:B&&N(c.clearcoatRoughnessMap.channel),iridescenceMapUv:X&&N(c.iridescenceMap.channel),iridescenceThicknessMapUv:re&&N(c.iridescenceThicknessMap.channel),sheenColorMapUv:Me&&N(c.sheenColorMap.channel),sheenRoughnessMapUv:ce&&N(c.sheenRoughnessMap.channel),specularMapUv:ae&&N(c.specularMap.channel),specularColorMapUv:xe&&N(c.specularColorMap.channel),specularIntensityMapUv:Ae&&N(c.specularIntensityMap.channel),transmissionMapUv:Ce&&N(c.transmissionMap.channel),thicknessMapUv:E&&N(c.thicknessMap.channel),alphaMapUv:k&&N(c.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(et||M),vertexNormals:!!K.attributes.normal,vertexColors:c.vertexColors,vertexAlphas:c.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!K.attributes.uv&&(Fe||k),fog:!!P,useFog:c.fog===!0,fogExp2:!!P&&P.isFogExp2,flatShading:c.wireframe===!1&&(c.flatShading===!0||K.attributes.normal===void 0&&et===!1&&(c.isMeshLambertMaterial||c.isMeshPhongMaterial||c.isMeshStandardMaterial||c.isMeshPhysicalMaterial)),sizeAttenuation:c.sizeAttenuation===!0,logarithmicDepthBuffer:I,reversedDepthBuffer:Ee,skinning:G.isSkinnedMesh===!0,hasPositionAttribute:K.attributes.position!==void 0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:be,morphTextureStride:Re,numSunLights:_.sun.length,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numSunLightShadows:_.sunShadowMap.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numLightProbeGrids:q.length,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:c.dithering,shadowMapEnabled:e.shadowMap.enabled&&w.length>0,shadowMapType:e.shadowMap.type,toneMapping:Te,decodeVideoTexture:Fe&&c.map.isVideoTexture===!0&&tt.getTransfer(c.map.colorSpace)===Ye,decodeVideoTextureEmissive:_t&&c.emissiveMap.isVideoTexture===!0&&tt.getTransfer(c.emissiveMap.colorSpace)===Ye,premultipliedAlpha:c.premultipliedAlpha,doubleSided:c.side===It,flipSided:c.side===vt,useDepthPacking:c.depthPacking>=0,depthPacking:c.depthPacking||0,index0AttributeName:c.index0AttributeName,extensionClipCullDistance:J&&c.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(J&&c.extensions.multiDraw===!0||me)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:c.customProgramCacheKey()};return ve.vertexUv1s=R.has(1),ve.vertexUv2s=R.has(2),ve.vertexUv3s=R.has(3),R.clear(),ve}function f(c){const _=[];if(c.shaderID?_.push(c.shaderID):(_.push(c.customVertexShaderID),_.push(c.customFragmentShaderID)),c.defines!==void 0)for(const w in c.defines)_.push(w),_.push(c.defines[w]);return c.isRawShaderMaterial===!1&&(s(_,c),L(_,c),_.push(e.outputColorSpace)),_.push(c.customProgramCacheKey),_.join()}function s(c,_){c.push(_.precision),c.push(_.outputColorSpace),c.push(_.envMapMode),c.push(_.envMapCubeUVHeight),c.push(_.mapUv),c.push(_.alphaMapUv),c.push(_.lightMapUv),c.push(_.aoMapUv),c.push(_.bumpMapUv),c.push(_.normalMapUv),c.push(_.displacementMapUv),c.push(_.emissiveMapUv),c.push(_.metalnessMapUv),c.push(_.roughnessMapUv),c.push(_.anisotropyMapUv),c.push(_.clearcoatMapUv),c.push(_.clearcoatNormalMapUv),c.push(_.clearcoatRoughnessMapUv),c.push(_.iridescenceMapUv),c.push(_.iridescenceThicknessMapUv),c.push(_.sheenColorMapUv),c.push(_.sheenRoughnessMapUv),c.push(_.specularMapUv),c.push(_.specularColorMapUv),c.push(_.specularIntensityMapUv),c.push(_.transmissionMapUv),c.push(_.thicknessMapUv),c.push(_.combine),c.push(_.fogExp2),c.push(_.sizeAttenuation),c.push(_.morphTargetsCount),c.push(_.morphAttributeCount),c.push(_.numSunLights),c.push(_.numDirLights),c.push(_.numPointLights),c.push(_.numSpotLights),c.push(_.numSpotLightMaps),c.push(_.numHemiLights),c.push(_.numRectAreaLights),c.push(_.numSunLightShadows),c.push(_.numDirLightShadows),c.push(_.numPointLightShadows),c.push(_.numSpotLightShadows),c.push(_.numSpotLightShadowsWithMaps),c.push(_.numLightProbes),c.push(_.shadowMapType),c.push(_.toneMapping),c.push(_.numClippingPlanes),c.push(_.numClipIntersection),c.push(_.depthPacking)}function L(c,_){d.disableAll(),_.instancing&&d.enable(0),_.instancingColor&&d.enable(1),_.instancingMorph&&d.enable(2),_.matcap&&d.enable(3),_.envMap&&d.enable(4),_.normalMapObjectSpace&&d.enable(5),_.normalMapTangentSpace&&d.enable(6),_.clearcoat&&d.enable(7),_.iridescence&&d.enable(8),_.alphaTest&&d.enable(9),_.vertexColors&&d.enable(10),_.vertexAlphas&&d.enable(11),_.vertexUv1s&&d.enable(12),_.vertexUv2s&&d.enable(13),_.vertexUv3s&&d.enable(14),_.vertexTangents&&d.enable(15),_.anisotropy&&d.enable(16),_.alphaHash&&d.enable(17),_.batching&&d.enable(18),_.dispersion&&d.enable(19),_.retroreflection&&d.enable(24),_.batchingColor&&d.enable(20),_.gradientMap&&d.enable(21),_.packedNormalMap&&d.enable(22),_.vertexNormals&&d.enable(23),c.push(d.mask),d.disableAll(),_.fog&&d.enable(0),_.useFog&&d.enable(1),_.flatShading&&d.enable(2),_.logarithmicDepthBuffer&&d.enable(3),_.reversedDepthBuffer&&d.enable(4),_.skinning&&d.enable(5),_.morphTargets&&d.enable(6),_.morphNormals&&d.enable(7),_.morphColors&&d.enable(8),_.premultipliedAlpha&&d.enable(9),_.shadowMapEnabled&&d.enable(10),_.doubleSided&&d.enable(11),_.flipSided&&d.enable(12),_.useDepthPacking&&d.enable(13),_.dithering&&d.enable(14),_.transmission&&d.enable(15),_.sheen&&d.enable(16),_.opaque&&d.enable(17),_.pointsUvs&&d.enable(18),_.decodeVideoTexture&&d.enable(19),_.decodeVideoTextureEmissive&&d.enable(20),_.alphaToCoverage&&d.enable(21),_.numLightProbeGrids>0&&d.enable(22),_.hasPositionAttribute&&d.enable(23),c.push(d.mask)}function z(c){const _=x[c.type];let w;if(_){const F=Rt[_];w=Lr.clone(F.uniforms)}else w=c.uniforms;return w}function h(c,_){let w=H.get(_);return w!==void 0?++w.usedTimes:(w=new Hf(e,_,c,l),T.push(w),H.set(_,w)),w}function S(c){if(--c.usedTimes===0){const _=T.indexOf(c);T[_]=T[T.length-1],T.pop(),H.delete(c.cacheKey),c.destroy()}}function m(c){g.remove(c)}function D(){g.dispose()}return{getParameters:W,getProgramCacheKey:f,getUniforms:z,acquireProgram:h,releaseProgram:S,releaseShaderCache:m,programs:T,dispose:D}}function Kf(){let e=new WeakMap;function n(d){return e.has(d)}function t(d){let g=e.get(d);return g===void 0&&(g={},e.set(d,g)),g}function i(d){e.delete(d)}function l(d,g,R){e.get(d)[g]=R}function o(){e=new WeakMap}return{has:n,get:t,remove:i,update:l,dispose:o}}function Yf(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.material.id!==n.material.id?e.material.id-n.material.id:e.materialVariant!==n.materialVariant?e.materialVariant-n.materialVariant:e.z!==n.z?e.z-n.z:e.id-n.id}function io(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.z!==n.z?n.z-e.z:e.id-n.id}function ro(){const e=[];let n=0;const t=[],i=[],l=[];function o(){n=0,t.length=0,i.length=0,l.length=0}function d(p){let x=0;return p.isInstancedMesh&&(x+=2),p.isSkinnedMesh&&(x+=1),x}function g(p,x,N,W,f,s){let L=e[n];return L===void 0?(L={id:p.id,object:p,geometry:x,material:N,materialVariant:d(p),groupOrder:W,renderOrder:p.renderOrder,z:f,group:s},e[n]=L):(L.id=p.id,L.object=p,L.geometry=x,L.material=N,L.materialVariant=d(p),L.groupOrder=W,L.renderOrder=p.renderOrder,L.z=f,L.group=s),n++,L}function R(p,x,N,W,f,s,L){L.reversedDepth===!0&&(f=-f);const z=g(p,x,N,W,f,s);N.transmission>0?i.push(z):N.transparent===!0?l.push(z):t.push(z)}function T(p,x,N,W,f,s){const L=g(p,x,N,W,f,s);N.transmission>0?i.unshift(L):N.transparent===!0?l.unshift(L):t.unshift(L)}function H(p,x){t.length>1&&t.sort(p||Yf),i.length>1&&i.sort(x||io),l.length>1&&l.sort(x||io)}function I(){for(let p=n,x=e.length;p<x;p++){const N=e[p];if(N.id===null)break;N.id=null,N.object=null,N.geometry=null,N.material=null,N.group=null}}return{opaque:t,transmissive:i,transparent:l,init:o,push:R,unshift:T,finish:I,sort:H}}function qf(){let e=new WeakMap;function n(i,l){const o=e.get(i);let d;return o===void 0?(d=new ro,e.set(i,[d])):l>=o.length?(d=new ro,o.push(d)):d=o[l],d}function t(){e=new WeakMap}return{get:n,dispose:t}}function Zf(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"SunLight":case"DirectionalLight":t={direction:new Ne,color:new je};break;case"SpotLight":t={position:new Ne,direction:new Ne,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Ne,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Ne,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new Ne,halfWidth:new Ne,halfHeight:new Ne};break}return e[n.id]=t,t}}}function $f(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[n.id]=t,t}}}let Qf=0;function Jf(e,n){return(n.castShadow?2:0)-(e.castShadow?2:0)+(n.map?1:0)-(e.map?1:0)}function jf(e){const n=new Zf,t=$f(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let T=0;T<9;T++)i.probe.push(new Ne);const l=new Ne,o=new Wt,d=new Wt;function g(T){let H=0,I=0,p=0;for(let G=0;G<9;G++)i.probe[G].set(0,0,0);let x=0,N=0,W=0,f=0,s=0,L=0,z=0,h=0,S=0,m=0,D=0,c=0,_=0,w=0;T.sort(Jf);for(let G=0,q=T.length;G<q;G++){const P=T[G],K=P.color,Q=P.intensity,Y=P.distance;let ne=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Xt?ne=P.shadow.map.texture:ne=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)H+=K.r*Q,I+=K.g*Q,p+=K.b*Q;else if(P.isLightProbe){for(let Z=0;Z<9;Z++)i.probe[Z].addScaledVector(P.sh.coefficients[Z],Q);w++}else if(P.isSunLight){const Z=n.get(P);if(Z.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const j=P.shadow,ee=t.get(P);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),i.sunShadow[N]=ee,i.sunShadowMap[N]=ne;const be=j.getViewportCount();for(let Re=0;Re<be;Re++)i.sunShadowMatrix[W+Re]=j.getMatrix(Re),i.sunShadowCascade[W+Re]=j._cascadeData[Re];W+=be,N++}i.sun[x]=Z,x++}else if(P.isDirectionalLight){const Z=n.get(P);if(Z.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const j=P.shadow,ee=t.get(P);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,i.directionalShadow[f]=ee,i.directionalShadowMap[f]=ne,i.directionalShadowMatrix[f]=P.shadow.matrix,S++}i.directional[f]=Z,f++}else if(P.isSpotLight){const Z=n.get(P);Z.position.setFromMatrixPosition(P.matrixWorld),Z.color.copy(K).multiplyScalar(Q),Z.distance=Y,Z.coneCos=Math.cos(P.angle),Z.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),Z.decay=P.decay,i.spot[L]=Z;const j=P.shadow;if(P.map&&(i.spotLightMap[c]=P.map,c++,j.updateMatrices(P),P.castShadow&&_++),i.spotLightMatrix[L]=j.matrix,P.castShadow){const ee=t.get(P);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,i.spotShadow[L]=ee,i.spotShadowMap[L]=ne,D++}L++}else if(P.isRectAreaLight){const Z=n.get(P);Z.color.copy(K).multiplyScalar(Q),Z.halfWidth.set(P.width*.5,0,0),Z.halfHeight.set(0,P.height*.5,0),i.rectArea[z]=Z,z++}else if(P.isPointLight){const Z=n.get(P);if(Z.color.copy(P.color).multiplyScalar(P.intensity),Z.distance=P.distance,Z.decay=P.decay,P.castShadow){const j=P.shadow,ee=t.get(P);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,ee.shadowCameraNear=j.camera.near,ee.shadowCameraFar=j.camera.far,i.pointShadow[s]=ee,i.pointShadowMap[s]=ne,i.pointShadowMatrix[s]=P.shadow.matrix,m++}i.point[s]=Z,s++}else if(P.isHemisphereLight){const Z=n.get(P);Z.skyColor.copy(P.color).multiplyScalar(Q),Z.groundColor.copy(P.groundColor).multiplyScalar(Q),i.hemi[h]=Z,h++}}z>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2)),i.ambient[0]=H,i.ambient[1]=I,i.ambient[2]=p;const F=i.hash;(F.sunLength!==x||F.directionalLength!==f||F.pointLength!==s||F.spotLength!==L||F.rectAreaLength!==z||F.hemiLength!==h||F.numSunShadows!==N||F.numDirectionalShadows!==S||F.numPointShadows!==m||F.numSpotShadows!==D||F.numSpotMaps!==c||F.numLightProbes!==w)&&(i.sun.length=x,i.directional.length=f,i.spot.length=L,i.rectArea.length=z,i.point.length=s,i.hemi.length=h,i.sunShadow.length=N,i.sunShadowMap.length=N,i.sunShadowMatrix.length=W,i.sunShadowCascade.length=W,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=m,i.pointShadowMap.length=m,i.pointShadowMatrix.length=m,i.spotShadow.length=D,i.spotShadowMap.length=D,i.spotLightMatrix.length=D+c-_,i.spotLightMap.length=c,i.numSpotLightShadowsWithMaps=_,i.numLightProbes=w,F.sunLength=x,F.directionalLength=f,F.pointLength=s,F.spotLength=L,F.rectAreaLength=z,F.hemiLength=h,F.numSunShadows=N,F.numDirectionalShadows=S,F.numPointShadows=m,F.numSpotShadows=D,F.numSpotMaps=c,F.numLightProbes=w,i.version=Qf++)}function R(T,H){let I=0,p=0,x=0,N=0,W=0,f=0;const s=H.matrixWorldInverse;for(let L=0,z=T.length;L<z;L++){const h=T[L];if(h.isSunLight){const S=i.sun[I];S.direction.setFromMatrixPosition(h.matrixWorld),S.direction.transformDirection(s),I++}else if(h.isDirectionalLight){const S=i.directional[p];S.direction.setFromMatrixPosition(h.matrixWorld),l.setFromMatrixPosition(h.target.matrixWorld),S.direction.sub(l),S.direction.transformDirection(s),p++}else if(h.isSpotLight){const S=i.spot[N];S.position.setFromMatrixPosition(h.matrixWorld),S.position.applyMatrix4(s),S.direction.setFromMatrixPosition(h.matrixWorld),l.setFromMatrixPosition(h.target.matrixWorld),S.direction.sub(l),S.direction.transformDirection(s),N++}else if(h.isRectAreaLight){const S=i.rectArea[W];S.position.setFromMatrixPosition(h.matrixWorld),S.position.applyMatrix4(s),d.identity(),o.copy(h.matrixWorld),o.premultiply(s),d.extractRotation(o),S.halfWidth.set(h.width*.5,0,0),S.halfHeight.set(0,h.height*.5,0),S.halfWidth.applyMatrix4(d),S.halfHeight.applyMatrix4(d),W++}else if(h.isPointLight){const S=i.point[x];S.position.setFromMatrixPosition(h.matrixWorld),S.position.applyMatrix4(s),x++}else if(h.isHemisphereLight){const S=i.hemi[f];S.direction.setFromMatrixPosition(h.matrixWorld),S.direction.transformDirection(s),f++}}}return{setup:g,setupView:R,state:i}}function ao(e){const n=new jf(e),t=[],i=[],l=[];function o(p){I.camera=p,t.length=0,i.length=0,l.length=0}function d(p){t.push(p)}function g(p){i.push(p)}function R(p){l.push(p)}function T(){n.setup(t)}function H(p){n.setupView(t,p)}const I={lightsArray:t,shadowsArray:i,lightProbeGridArray:l,camera:null,lights:n,transmissionRenderTarget:{},textureUnits:0};return{init:o,state:I,setupLights:T,setupLightsView:H,pushLight:d,pushShadow:g,pushLightProbeGrid:R}}function ed(e){let n=new WeakMap;function t(l,o=0){const d=n.get(l);let g;return d===void 0?(g=new ao(e),n.set(l,[g])):o>=d.length?(g=new ao(e),d.push(g)):g=d[o],g}function i(){n=new WeakMap}return{get:t,dispose:i}}const td=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,nd=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,id=[new Ne(1,0,0),new Ne(-1,0,0),new Ne(0,1,0),new Ne(0,-1,0),new Ne(0,0,1),new Ne(0,0,-1)],rd=[new Ne(0,-1,0),new Ne(0,-1,0),new Ne(0,0,1),new Ne(0,0,-1),new Ne(0,-1,0),new Ne(0,-1,0)],oo=new Wt,gn=new Ne,ar=new Ne;function ad(e,n,t){let i=new oi;const l=new ht,o=new ht,d=new mt,g=new wr,R=new Ir,T={},H=t.maxTextureSize,I={[Jt]:vt,[vt]:Jt,[It]:It},p=new Lt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:td,fragmentShader:nd}),x=p.clone();x.defines.HORIZONTAL_PASS=1;const N=new ln;N.setAttribute("position",new Mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const W=new Pt(N,p),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=dn;let s=this.type;this.render=function(m,D,c){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||m.length===0)return;this.type===Nr&&(Ve("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=dn);const _=e.getRenderTarget(),w=e.getActiveCubeFace(),F=e.getActiveMipmapLevel(),G=e.state;G.setBlending(wt),G.buffers.depth.getReversed()===!0?G.buffers.color.setClear(0,0,0,0):G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);const q=s!==this.type;q&&D.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(K=>K.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,K=m.length;P<K;P++){const Q=m[P],Y=Q.shadow;if(Y===void 0){Ve("WebGLShadowMap:",Q,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;l.copy(Y.mapSize);const ne=Y.getFrameExtents();l.multiply(ne),o.copy(Y.mapSize),(l.x>H||l.y>H)&&(l.x>H&&(o.x=Math.floor(H/ne.x),l.x=o.x*ne.x,Y.mapSize.x=o.x),l.y>H&&(o.y=Math.floor(H/ne.y),l.y=o.y*ne.y,Y.mapSize.y=o.y));const Z=e.state.buffers.depth.getReversed();if(Y.camera._reversedDepth=Z,Y.map===null||q===!0){if(Y.map!==null&&(Y.map.depthTexture!==null&&(Y.map.depthTexture.dispose(),Y.map.depthTexture=null),Y.map.dispose()),this.type===en){if(Q.isPointLight){Ve("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}Y.map=new Mt(l.x,l.y,{format:Xt,type:Ut,minFilter:St,magFilter:St,generateMipmaps:!1}),Y.map.texture.name=Q.name+".shadowMap",Y.map.depthTexture=new fn(l.x,l.y,yt),Y.map.depthTexture.name=Q.name+".shadowMapDepth",Y.map.depthTexture.format=Kt,Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Gt,Y.map.depthTexture.magFilter=Gt}else Q.isPointLight?(Y.map=new tr(l.x),Y.map.depthTexture=new yr(l.x,Ht)):(Y.map=new Mt(l.x,l.y),Y.map.depthTexture=new fn(l.x,l.y,Ht)),Y.map.depthTexture.name=Q.name+".shadowMap",Y.map.depthTexture.format=Kt,this.type===dn?(Y.map.depthTexture.compareFunction=Z?An:Rn,Y.map.depthTexture.minFilter=St,Y.map.depthTexture.magFilter=St):(Y.map.depthTexture.compareFunction=null,Y.map.depthTexture.minFilter=Gt,Y.map.depthTexture.magFilter=Gt);Y.camera.updateProjectionMatrix()}Y.map.isWebGLCubeRenderTarget!==!0&&(Y.map.width!==l.x||Y.map.height!==l.y)&&Y.map.setSize(l.x,l.y);const j=Y.map.isWebGLCubeRenderTarget?6:Y.getViewportCount();Q.isPointLight!==!0&&Y.updateMatrices(Q,c);for(let ee=0;ee<j;ee++){const be=Y.getCamera(ee);if(Q.isPointLight){const Re=Y.camera,it=Y.matrix,ke=Q.distance||Re.far;ke!==Re.far&&(Re.far=ke,Re.updateProjectionMatrix()),gn.setFromMatrixPosition(Q.matrixWorld),Re.position.copy(gn),ar.copy(Re.position),ar.add(id[ee]),Re.up.copy(rd[ee]),Re.lookAt(ar),Re.updateMatrixWorld(),it.makeTranslation(-gn.x,-gn.y,-gn.z),oo.multiplyMatrices(Re.projectionMatrix,Re.matrixWorldInverse),Y._frustum.setFromProjectionMatrix(oo,Re.coordinateSystem,Re.reversedDepth)}if(Y.map.isWebGLCubeRenderTarget)e.setRenderTarget(Y.map,ee),e.clear();else{ee===0&&(e.setRenderTarget(Y.map),e.clear());const Re=Y.getViewport(ee);d.set(o.x*Re.x,o.y*Re.y,o.x*Re.z,o.y*Re.w),G.viewport(d)}i=Y.getFrustum(ee),h(D,c,be,Q,this.type)}Y.isPointLightShadow!==!0&&this.type===en&&L(Y,c),Y.needsUpdate=!1}s=this.type,f.needsUpdate=!1,e.setRenderTarget(_,w,F)};function L(m,D){const c=n.update(W);p.defines.VSM_SAMPLES!==m.blurSamples&&(p.defines.VSM_SAMPLES=m.blurSamples,x.defines.VSM_SAMPLES=m.blurSamples,p.needsUpdate=!0,x.needsUpdate=!0),m.mapPass===null?m.mapPass=new Mt(l.x,l.y,{format:Xt,type:Ut}):(m.mapPass.width!==m.map.width||m.mapPass.height!==m.map.height)&&m.mapPass.setSize(m.map.width,m.map.height),p.uniforms.shadow_pass.value=m.map.depthTexture,p.uniforms.resolution.value.set(m.map.width,m.map.height),p.uniforms.radius.value=m.radius,e.setRenderTarget(m.mapPass),e.clear(),e.renderBufferDirect(D,null,c,p,W,null),x.uniforms.shadow_pass.value=m.mapPass.texture,x.uniforms.resolution.value.set(m.map.width,m.map.height),x.uniforms.radius.value=m.radius,e.setRenderTarget(m.map),e.clear(),e.renderBufferDirect(D,null,c,x,W,null)}function z(m,D,c,_){let w=null;const F=c.isPointLight===!0?m.customDistanceMaterial:m.customDepthMaterial;if(F!==void 0)w=F;else if(w=c.isPointLight===!0?R:g,e.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0||D.alphaToCoverage===!0){const G=w.uuid,q=D.uuid;let P=T[G];P===void 0&&(P={},T[G]=P);let K=P[q];K===void 0&&(K=w.clone(),P[q]=K,D.addEventListener("dispose",S)),w=K}if(w.visible=D.visible,w.wireframe=D.wireframe,_===en?w.side=D.shadowSide!==null?D.shadowSide:D.side:w.side=D.shadowSide!==null?D.shadowSide:I[D.side],w.alphaMap=D.alphaMap,w.alphaTest=D.alphaToCoverage===!0?.5:D.alphaTest,w.map=D.map,w.clipShadows=D.clipShadows,w.clippingPlanes=D.clippingPlanes,w.clipIntersection=D.clipIntersection,w.displacementMap=D.displacementMap,w.displacementScale=D.displacementScale,w.displacementBias=D.displacementBias,w.wireframeLinewidth=D.wireframeLinewidth,w.linewidth=D.linewidth,c.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const G=e.properties.get(w);G.light=c}return w}function h(m,D,c,_,w){if(m.visible===!1)return;if(m.layers.test(D.layers)&&(m.isMesh||m.isLine||m.isPoints)&&(m.castShadow||m.receiveShadow&&w===en)&&(!m.frustumCulled||m.intersectsFrustum(i))){m.modelViewMatrix.multiplyMatrices(c.matrixWorldInverse,m.matrixWorld);const q=n.update(m),P=m.material;if(Array.isArray(P)){const K=q.groups;for(let Q=0,Y=K.length;Q<Y;Q++){const ne=K[Q],Z=P[ne.materialIndex];if(Z&&Z.visible){const j=z(m,Z,_,w);m.onBeforeShadow(e,m,D,c,q,j,ne),e.renderBufferDirect(c,null,q,j,m,ne),m.onAfterShadow(e,m,D,c,q,j,ne)}}}else if(P.visible){const K=z(m,P,_,w);m.onBeforeShadow(e,m,D,c,q,K,null),e.renderBufferDirect(c,null,q,K,m,null),m.onAfterShadow(e,m,D,c,q,K,null)}}const G=m.children;for(let q=0,P=G.length;q<P;q++)h(G[q],D,c,_,w)}function S(m){m.target.removeEventListener("dispose",S);for(const c in T){const _=T[c],w=m.target.uuid;w in _&&(_[w].dispose(),delete _[w])}}}function od(e,n){function t(){let E=!1;const oe=new mt;let k=null;const se=new mt(0,0,0,0);return{setMask:function(ue){k!==ue&&!E&&(e.colorMask(ue,ue,ue,ue),k=ue)},setLocked:function(ue){E=ue},setClear:function(ue,J,Te,ve,Ze){Ze===!0&&(ue*=ve,J*=ve,Te*=ve),oe.set(ue,J,Te,ve),se.equals(oe)===!1&&(e.clearColor(ue,J,Te,ve),se.copy(oe))},reset:function(){E=!1,k=null,se.set(-1,0,0,0)}}}function i(){let E=!1,oe=!1,k=null,se=null,ue=null;return{setReversed:function(J){if(oe!==J){const Te=n.get("EXT_clip_control");J?Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.ZERO_TO_ONE_EXT):Te.clipControlEXT(Te.LOWER_LEFT_EXT,Te.NEGATIVE_ONE_TO_ONE_EXT),oe=J;const ve=ue;ue=null,this.setClear(ve)}},getReversed:function(){return oe},setTest:function(J){J?$(e.DEPTH_TEST):Ee(e.DEPTH_TEST)},setMask:function(J){k!==J&&!E&&(e.depthMask(J),k=J)},setFunc:function(J){if(oe&&(J=go[J]),se!==J){switch(J){case aa:e.depthFunc(e.NEVER);break;case ra:e.depthFunc(e.ALWAYS);break;case ia:e.depthFunc(e.LESS);break;case si:e.depthFunc(e.LEQUAL);break;case na:e.depthFunc(e.EQUAL);break;case ta:e.depthFunc(e.GEQUAL);break;case ea:e.depthFunc(e.GREATER);break;case jr:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}se=J}},setLocked:function(J){E=J},setClear:function(J){ue!==J&&(ue=J,oe&&(J=1-J),e.clearDepth(J))},reset:function(){E=!1,k=null,se=null,ue=null,oe=!1}}}function l(){let E=!1,oe=null,k=null,se=null,ue=null,J=null,Te=null,ve=null,Ze=null;return{setTest:function(Ge){E||(Ge?$(e.STENCIL_TEST):Ee(e.STENCIL_TEST))},setMask:function(Ge){oe!==Ge&&!E&&(e.stencilMask(Ge),oe=Ge)},setFunc:function(Ge,xt,bt){(k!==Ge||se!==xt||ue!==bt)&&(e.stencilFunc(Ge,xt,bt),k=Ge,se=xt,ue=bt)},setOp:function(Ge,xt,bt){(J!==Ge||Te!==xt||ve!==bt)&&(e.stencilOp(Ge,xt,bt),J=Ge,Te=xt,ve=bt)},setLocked:function(Ge){E=Ge},setClear:function(Ge){Ze!==Ge&&(e.clearStencil(Ge),Ze=Ge)},reset:function(){E=!1,oe=null,k=null,se=null,ue=null,J=null,Te=null,ve=null,Ze=null}}}const o=new t,d=new i,g=new l,R=new WeakMap,T=new WeakMap;let H={},I={},p={},x=new WeakMap,N=[],W=null,f=!1,s=null,L=null,z=null,h=null,S=null,m=null,D=null,c=new je(0,0,0),_=0,w=!1,F=null,G=null,q=null,P=null,K=null;const Q=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,ne=0;const Z=e.getParameter(e.VERSION);Z.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(Z)[1]),Y=ne>=1):Z.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),Y=ne>=2);let j=null,ee={};const be=e.getParameter(e.SCISSOR_BOX),Re=e.getParameter(e.VIEWPORT),it=new mt().fromArray(be),ke=new mt().fromArray(Re);function ze(E,oe,k,se){const ue=new Uint8Array(4),J=e.createTexture();e.bindTexture(E,J),e.texParameteri(E,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(E,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Te=0;Te<k;Te++)E===e.TEXTURE_3D||E===e.TEXTURE_2D_ARRAY?e.texImage3D(oe,0,e.RGBA,1,1,se,0,e.RGBA,e.UNSIGNED_BYTE,ue):e.texImage2D(oe+Te,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,ue);return J}const V={};V[e.TEXTURE_2D]=ze(e.TEXTURE_2D,e.TEXTURE_2D,1),V[e.TEXTURE_CUBE_MAP]=ze(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),V[e.TEXTURE_2D_ARRAY]=ze(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),V[e.TEXTURE_3D]=ze(e.TEXTURE_3D,e.TEXTURE_3D,1,1),o.setClear(0,0,0,1),d.setClear(1),g.setClear(0),$(e.DEPTH_TEST),d.setFunc(si),Ie(!1),et(li),$(e.CULL_FACE),Be(wt);function $(E){H[E]!==!0&&(e.enable(E),H[E]=!0)}function Ee(E){H[E]!==!1&&(e.disable(E),H[E]=!1)}function Ue(E,oe){return p[E]!==oe?(e.bindFramebuffer(E,oe),p[E]=oe,E===e.DRAW_FRAMEBUFFER&&(p[e.FRAMEBUFFER]=oe),E===e.FRAMEBUFFER&&(p[e.DRAW_FRAMEBUFFER]=oe),!0):!1}function me(E,oe){let k=N,se=!1;if(E){k=x.get(oe),k===void 0&&(k=[],x.set(oe,k));const ue=E.textures;if(k.length!==ue.length||k[0]!==e.COLOR_ATTACHMENT0){for(let J=0,Te=ue.length;J<Te;J++)k[J]=e.COLOR_ATTACHMENT0+J;k.length=ue.length,se=!0}}else k[0]!==e.BACK&&(k[0]=e.BACK,se=!0);se&&e.drawBuffers(k)}function Fe(E){return W!==E?(e.useProgram(E),W=E,!0):!1}const st={[tn]:e.FUNC_ADD,[Or]:e.FUNC_SUBTRACT,[Fr]:e.FUNC_REVERSE_SUBTRACT};st[ca]=e.MIN,st[fa]=e.MAX;const De={[Jr]:e.ZERO,[Qr]:e.ONE,[$r]:e.SRC_COLOR,[Zr]:e.SRC_ALPHA,[qr]:e.SRC_ALPHA_SATURATE,[Yr]:e.DST_COLOR,[Kr]:e.DST_ALPHA,[Xr]:e.ONE_MINUS_SRC_COLOR,[zr]:e.ONE_MINUS_SRC_ALPHA,[kr]:e.ONE_MINUS_DST_COLOR,[Wr]:e.ONE_MINUS_DST_ALPHA,[Vr]:e.CONSTANT_COLOR,[Hr]:e.ONE_MINUS_CONSTANT_COLOR,[Gr]:e.CONSTANT_ALPHA,[Br]:e.ONE_MINUS_CONSTANT_ALPHA};function Be(E,oe,k,se,ue,J,Te,ve,Ze,Ge){if(E===wt){f===!0&&(Ee(e.BLEND),f=!1);return}if(f===!1&&($(e.BLEND),f=!0),E!==la){if(E!==s||Ge!==w){if((L!==tn||S!==tn)&&(e.blendEquation(e.FUNC_ADD),L=tn,S=tn),Ge)switch(E){case un:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case di:e.blendFunc(e.ONE,e.ONE);break;case fi:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case ci:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Qe("WebGLState: Invalid blending: ",E);break}else switch(E){case un:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case di:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case fi:Qe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ci:Qe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Qe("WebGLState: Invalid blending: ",E);break}z=null,h=null,m=null,D=null,c.set(0,0,0),_=0,s=E,w=Ge}return}ue=ue||oe,J=J||k,Te=Te||se,(oe!==L||ue!==S)&&(e.blendEquationSeparate(st[oe],st[ue]),L=oe,S=ue),(k!==z||se!==h||J!==m||Te!==D)&&(e.blendFuncSeparate(De[k],De[se],De[J],De[Te]),z=k,h=se,m=J,D=Te),(ve.equals(c)===!1||Ze!==_)&&(e.blendColor(ve.r,ve.g,ve.b,Ze),c.copy(ve),_=Ze),s=E,w=!1}function qe(E,oe){E.side===It?Ee(e.CULL_FACE):$(e.CULL_FACE);let k=E.side===vt;oe&&(k=!k),Ie(k),E.blending===un&&E.transparent===!1?Be(wt):Be(E.blending,E.blendEquation,E.blendSrc,E.blendDst,E.blendEquationAlpha,E.blendSrcAlpha,E.blendDstAlpha,E.blendColor,E.blendAlpha,E.premultipliedAlpha),d.setFunc(E.depthFunc),d.setTest(E.depthTest),d.setMask(E.depthWrite),o.setMask(E.colorWrite);const se=E.stencilWrite;g.setTest(se),se&&(g.setMask(E.stencilWriteMask),g.setFunc(E.stencilFunc,E.stencilRef,E.stencilFuncMask),g.setOp(E.stencilFail,E.stencilZFail,E.stencilZPass)),_t(E.polygonOffset,E.polygonOffsetFactor,E.polygonOffsetUnits),E.alphaToCoverage===!0?$(e.SAMPLE_ALPHA_TO_COVERAGE):Ee(e.SAMPLE_ALPHA_TO_COVERAGE)}function Ie(E){F!==E&&(E?e.frontFace(e.CW):e.frontFace(e.CCW),F=E)}function et(E){E!==oa?($(e.CULL_FACE),E!==G&&(E===li?e.cullFace(e.BACK):E===sa?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):Ee(e.CULL_FACE),G=E}function ft(E){E!==q&&(Y&&e.lineWidth(E),q=E)}function _t(E,oe,k){E?($(e.POLYGON_OFFSET_FILL),(P!==oe||K!==k)&&(P=oe,K=k,d.getReversed()&&(oe=-oe),e.polygonOffset(oe,k))):Ee(e.POLYGON_OFFSET_FILL)}function nt(E){E?$(e.SCISSOR_TEST):Ee(e.SCISSOR_TEST)}function at(E){E===void 0&&(E=e.TEXTURE0+Q-1),j!==E&&(e.activeTexture(E),j=E)}function M(E,oe,k){k===void 0&&(j===null?k=e.TEXTURE0+Q-1:k=j);let se=ee[k];se===void 0&&(se={type:void 0,texture:void 0},ee[k]=se),(se.type!==E||se.texture!==oe)&&(j!==k&&(e.activeTexture(k),j=k),e.bindTexture(E,oe||V[E]),se.type=E,se.texture=oe)}function dt(){const E=ee[j];E!==void 0&&E.type!==void 0&&(e.bindTexture(E.type,null),E.type=void 0,E.texture=void 0)}function We(){try{e.compressedTexImage2D(...arguments)}catch(E){Qe("WebGLState:",E)}}function u(){try{e.compressedTexImage3D(...arguments)}catch(E){Qe("WebGLState:",E)}}function r(){try{e.texSubImage2D(...arguments)}catch(E){Qe("WebGLState:",E)}}function A(){try{e.texSubImage3D(...arguments)}catch(E){Qe("WebGLState:",E)}}function U(){try{e.compressedTexSubImage2D(...arguments)}catch(E){Qe("WebGLState:",E)}}function O(){try{e.compressedTexSubImage3D(...arguments)}catch(E){Qe("WebGLState:",E)}}function te(){try{e.texStorage2D(...arguments)}catch(E){Qe("WebGLState:",E)}}function ie(){try{e.texStorage3D(...arguments)}catch(E){Qe("WebGLState:",E)}}function B(){try{e.texImage2D(...arguments)}catch(E){Qe("WebGLState:",E)}}function X(){try{e.texImage3D(...arguments)}catch(E){Qe("WebGLState:",E)}}function re(E){return I[E]!==void 0?I[E]:e.getParameter(E)}function Me(E,oe){I[E]!==oe&&(e.pixelStorei(E,oe),I[E]=oe)}function ce(E){it.equals(E)===!1&&(e.scissor(E.x,E.y,E.z,E.w),it.copy(E))}function ae(E){ke.equals(E)===!1&&(e.viewport(E.x,E.y,E.z,E.w),ke.copy(E))}function xe(E,oe){let k=T.get(oe);k===void 0&&(k=new WeakMap,T.set(oe,k));let se=k.get(E);se===void 0&&(se=e.getUniformBlockIndex(oe,E.name),k.set(E,se))}function Ae(E,oe){const se=T.get(oe).get(E);R.get(oe)!==se&&(e.uniformBlockBinding(oe,se,E.__bindingPointIndex),R.set(oe,se))}function Ce(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),d.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),H={},I={},j=null,ee={},p={},x=new WeakMap,N=[],W=null,f=!1,s=null,L=null,z=null,h=null,S=null,m=null,D=null,c=new je(0,0,0),_=0,w=!1,F=null,G=null,q=null,P=null,K=null,it.set(0,0,e.canvas.width,e.canvas.height),ke.set(0,0,e.canvas.width,e.canvas.height),o.reset(),d.reset(),g.reset()}return{buffers:{color:o,depth:d,stencil:g},enable:$,disable:Ee,bindFramebuffer:Ue,drawBuffers:me,useProgram:Fe,setBlending:Be,setMaterial:qe,setFlipSided:Ie,setCullFace:et,setLineWidth:ft,setPolygonOffset:_t,setScissorTest:nt,activeTexture:at,bindTexture:M,unbindTexture:dt,compressedTexImage2D:We,compressedTexImage3D:u,texImage2D:B,texImage3D:X,pixelStorei:Me,getParameter:re,updateUBOMapping:xe,uniformBlockBinding:Ae,texStorage2D:te,texStorage3D:ie,texSubImage2D:r,texSubImage3D:A,compressedTexSubImage2D:U,compressedTexSubImage3D:O,scissor:ce,viewport:ae,reset:Ce}}function sd(e,n,t,i,l,o,d){const g=n.has("WEBGL_multisampled_render_to_texture")?n.get("WEBGL_multisampled_render_to_texture"):null,R=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),T=new ht,H=new WeakMap,I=new Set;let p;const x=new WeakMap;let N=!1;try{N=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function W(u,r){return N?new OffscreenCanvas(u,r):vo("canvas")}function f(u,r,A){let U=1;const O=We(u);if((O.width>A||O.height>A)&&(U=A/Math.max(O.width,O.height)),U<1)if(typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&u instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&u instanceof ImageBitmap||typeof VideoFrame<"u"&&u instanceof VideoFrame){const te=Math.floor(U*O.width),ie=Math.floor(U*O.height);p===void 0&&(p=W(te,ie));const B=r?W(te,ie):p;return B.width=te,B.height=ie,B.getContext("2d").drawImage(u,0,0,te,ie),Ve("WebGLRenderer: Texture has been resized from ("+O.width+"x"+O.height+") to ("+te+"x"+ie+")."),B}else return"data"in u&&Ve("WebGLRenderer: Image in DataTexture is too big ("+O.width+"x"+O.height+")."),u;return u}function s(u){return u.generateMipmaps}function L(u){e.generateMipmap(u)}function z(u){return u.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:u.isWebGL3DRenderTarget?e.TEXTURE_3D:u.isWebGLArrayRenderTarget||u.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function h(u,r,A,U,O,te=!1){if(u!==null){if(e[u]!==void 0)return e[u];Ve("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+u+"'")}let ie;U&&(ie=n.get("EXT_texture_norm16"),ie||Ve("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let B=r;if(r===e.RED&&(A===e.FLOAT&&(B=e.R32F),A===e.HALF_FLOAT&&(B=e.R16F),A===e.UNSIGNED_BYTE&&(B=e.R8),A===e.UNSIGNED_SHORT&&ie&&(B=ie.R16_EXT),A===e.SHORT&&ie&&(B=ie.R16_SNORM_EXT)),r===e.RED_INTEGER&&(A===e.UNSIGNED_BYTE&&(B=e.R8UI),A===e.UNSIGNED_SHORT&&(B=e.R16UI),A===e.UNSIGNED_INT&&(B=e.R32UI),A===e.BYTE&&(B=e.R8I),A===e.SHORT&&(B=e.R16I),A===e.INT&&(B=e.R32I)),r===e.RG&&(A===e.FLOAT&&(B=e.RG32F),A===e.HALF_FLOAT&&(B=e.RG16F),A===e.UNSIGNED_BYTE&&(B=e.RG8),A===e.UNSIGNED_SHORT&&ie&&(B=ie.RG16_EXT),A===e.SHORT&&ie&&(B=ie.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(A===e.UNSIGNED_BYTE&&(B=e.RG8UI),A===e.UNSIGNED_SHORT&&(B=e.RG16UI),A===e.UNSIGNED_INT&&(B=e.RG32UI),A===e.BYTE&&(B=e.RG8I),A===e.SHORT&&(B=e.RG16I),A===e.INT&&(B=e.RG32I)),r===e.RGB_INTEGER&&(A===e.UNSIGNED_BYTE&&(B=e.RGB8UI),A===e.UNSIGNED_SHORT&&(B=e.RGB16UI),A===e.UNSIGNED_INT&&(B=e.RGB32UI),A===e.BYTE&&(B=e.RGB8I),A===e.SHORT&&(B=e.RGB16I),A===e.INT&&(B=e.RGB32I)),r===e.RGBA_INTEGER&&(A===e.UNSIGNED_BYTE&&(B=e.RGBA8UI),A===e.UNSIGNED_SHORT&&(B=e.RGBA16UI),A===e.UNSIGNED_INT&&(B=e.RGBA32UI),A===e.BYTE&&(B=e.RGBA8I),A===e.SHORT&&(B=e.RGBA16I),A===e.INT&&(B=e.RGBA32I)),r===e.RGB&&(A===e.UNSIGNED_SHORT&&ie&&(B=ie.RGB16_EXT),A===e.SHORT&&ie&&(B=ie.RGB16_SNORM_EXT),A===e.UNSIGNED_INT_5_9_9_9_REV&&(B=e.RGB9_E5),A===e.UNSIGNED_INT_10F_11F_11F_REV&&(B=e.R11F_G11F_B10F)),r===e.RGBA){const X=te?ri:tt.getTransfer(O);A===e.FLOAT&&(B=e.RGBA32F),A===e.HALF_FLOAT&&(B=e.RGBA16F),A===e.UNSIGNED_BYTE&&(B=X===Ye?e.SRGB8_ALPHA8:e.RGBA8),A===e.UNSIGNED_SHORT&&ie&&(B=ie.RGBA16_EXT),A===e.SHORT&&ie&&(B=ie.RGBA16_SNORM_EXT),A===e.UNSIGNED_SHORT_4_4_4_4&&(B=e.RGBA4),A===e.UNSIGNED_SHORT_5_5_5_1&&(B=e.RGB5_A1)}return(B===e.R16F||B===e.R32F||B===e.RG16F||B===e.RG32F||B===e.RGBA16F||B===e.RGBA32F)&&n.get("EXT_color_buffer_float"),B}function S(u,r){let A;return u?r===null||r===Ht||r===nn?A=e.DEPTH24_STENCIL8:r===yt?A=e.DEPTH32F_STENCIL8:r===hn&&(A=e.DEPTH24_STENCIL8,Ve("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):r===null||r===Ht||r===nn?A=e.DEPTH_COMPONENT24:r===yt?A=e.DEPTH_COMPONENT32F:r===hn&&(A=e.DEPTH_COMPONENT16),A}function m(u,r){return s(u)===!0||u.isFramebufferTexture&&u.minFilter!==Gt&&u.minFilter!==St?Math.log2(Math.max(r.width,r.height))+1:u.mipmaps!==void 0&&u.mipmaps.length>0?u.mipmaps.length:u.isCompressedTexture&&Array.isArray(u.image)?r.mipmaps.length:1}function D(u){const r=u.target;r.removeEventListener("dispose",D),_(r),r.isVideoTexture&&H.delete(r),r.isHTMLTexture&&I.delete(r)}function c(u){const r=u.target;r.removeEventListener("dispose",c),F(r)}function _(u){const r=i.get(u);if(r.__webglInit===void 0)return;const A=u.source,U=x.get(A);if(U){const O=U[r.__cacheKey];O.usedTimes--,O.usedTimes===0&&w(u),Object.keys(U).length===0&&x.delete(A)}i.remove(u)}function w(u){const r=i.get(u);e.deleteTexture(r.__webglTexture);const A=u.source,U=x.get(A);delete U[r.__cacheKey],d.memory.textures--}function F(u){const r=i.get(u);if(u.depthTexture&&(u.depthTexture.dispose(),i.remove(u.depthTexture)),u.isWebGLCubeRenderTarget)for(let U=0;U<6;U++){if(Array.isArray(r.__webglFramebuffer[U]))for(let O=0;O<r.__webglFramebuffer[U].length;O++)e.deleteFramebuffer(r.__webglFramebuffer[U][O]);else e.deleteFramebuffer(r.__webglFramebuffer[U]);r.__webglDepthbuffer&&e.deleteRenderbuffer(r.__webglDepthbuffer[U])}else{if(Array.isArray(r.__webglFramebuffer))for(let U=0;U<r.__webglFramebuffer.length;U++)e.deleteFramebuffer(r.__webglFramebuffer[U]);else e.deleteFramebuffer(r.__webglFramebuffer);if(r.__webglDepthbuffer&&e.deleteRenderbuffer(r.__webglDepthbuffer),r.__webglMultisampledFramebuffer&&e.deleteFramebuffer(r.__webglMultisampledFramebuffer),r.__webglColorRenderbuffer)for(let U=0;U<r.__webglColorRenderbuffer.length;U++)r.__webglColorRenderbuffer[U]&&e.deleteRenderbuffer(r.__webglColorRenderbuffer[U]);r.__webglDepthRenderbuffer&&e.deleteRenderbuffer(r.__webglDepthRenderbuffer)}const A=u.textures;for(let U=0,O=A.length;U<O;U++){const te=i.get(A[U]);te.__webglTexture&&(e.deleteTexture(te.__webglTexture),d.memory.textures--),i.remove(A[U])}i.remove(u)}let G=0;function q(){G=0}function P(){return G}function K(u){G=u}function Q(){const u=G;return u>=l.maxTextures&&Ve("WebGLTextures: Trying to use "+(u+1)+" texture units while this GPU supports only "+l.maxTextures),G+=1,u}function Y(u){const r=[];return r.push(u.wrapS),r.push(u.wrapT),r.push(u.wrapR||0),r.push(u.magFilter),r.push(u.minFilter),r.push(u.anisotropy),r.push(u.internalFormat),r.push(u.format),r.push(u.type),r.push(u.generateMipmaps),r.push(u.premultiplyAlpha),r.push(u.flipY),r.push(u.unpackAlignment),r.push(u.colorSpace),r.join()}function ne(u,r){const A=i.get(u);if(u.isVideoTexture&&M(u),u.isRenderTargetTexture===!1&&u.isExternalTexture!==!0&&u.version>0&&A.__version!==u.version){const U=u.image;if(U===null)Ve("WebGLRenderer: Texture marked for update but no image data found.");else if(U.complete===!1)Ve("WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(A,u,r);return}}else u.isExternalTexture&&(A.__webglTexture=u.sourceTexture?u.sourceTexture:null);t.bindTexture(e.TEXTURE_2D,A.__webglTexture,e.TEXTURE0+r)}function Z(u,r){const A=i.get(u);if(u.isRenderTargetTexture===!1&&u.version>0&&A.__version!==u.version){Ee(A,u,r);return}else u.isExternalTexture&&(A.__webglTexture=u.sourceTexture?u.sourceTexture:null);t.bindTexture(e.TEXTURE_2D_ARRAY,A.__webglTexture,e.TEXTURE0+r)}function j(u,r){const A=i.get(u);if(u.isRenderTargetTexture===!1&&u.version>0&&A.__version!==u.version){Ee(A,u,r);return}t.bindTexture(e.TEXTURE_3D,A.__webglTexture,e.TEXTURE0+r)}function ee(u,r){const A=i.get(u);if(u.isCubeDepthTexture!==!0&&u.version>0&&A.__version!==u.version){Ue(A,u,r);return}t.bindTexture(e.TEXTURE_CUBE_MAP,A.__webglTexture,e.TEXTURE0+r)}const be={[ua]:e.REPEAT,[Pn]:e.CLAMP_TO_EDGE,[da]:e.MIRRORED_REPEAT},Re={[Gt]:e.NEAREST,[pa]:e.NEAREST_MIPMAP_NEAREST,[pn]:e.NEAREST_MIPMAP_LINEAR,[St]:e.LINEAR,[Ln]:e.LINEAR_MIPMAP_NEAREST,[zt]:e.LINEAR_MIPMAP_LINEAR},it={[Sa]:e.NEVER,[va]:e.ALWAYS,[ga]:e.LESS,[Rn]:e.LEQUAL,[_a]:e.EQUAL,[An]:e.GEQUAL,[ma]:e.GREATER,[ha]:e.NOTEQUAL};function ke(u,r){if(r.type===yt&&n.has("OES_texture_float_linear")===!1&&(r.magFilter===St||r.magFilter===Ln||r.magFilter===pn||r.magFilter===zt||r.minFilter===St||r.minFilter===Ln||r.minFilter===pn||r.minFilter===zt)&&Ve("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(u,e.TEXTURE_WRAP_S,be[r.wrapS]),e.texParameteri(u,e.TEXTURE_WRAP_T,be[r.wrapT]),(u===e.TEXTURE_3D||u===e.TEXTURE_2D_ARRAY)&&e.texParameteri(u,e.TEXTURE_WRAP_R,be[r.wrapR]),e.texParameteri(u,e.TEXTURE_MAG_FILTER,Re[r.magFilter]),e.texParameteri(u,e.TEXTURE_MIN_FILTER,Re[r.minFilter]),r.compareFunction&&(e.texParameteri(u,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(u,e.TEXTURE_COMPARE_FUNC,it[r.compareFunction])),n.has("EXT_texture_filter_anisotropic")===!0){if(r.magFilter===Gt||r.minFilter!==pn&&r.minFilter!==zt||r.type===yt&&n.has("OES_texture_float_linear")===!1)return;if(r.anisotropy>1||i.get(r).__currentAnisotropy){const A=n.get("EXT_texture_filter_anisotropic");e.texParameterf(u,A.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(r.anisotropy,l.getMaxAnisotropy())),i.get(r).__currentAnisotropy=r.anisotropy}}}function ze(u,r){let A=!1;u.__webglInit===void 0&&(u.__webglInit=!0,r.addEventListener("dispose",D));const U=r.source;let O=x.get(U);O===void 0&&(O={},x.set(U,O));const te=Y(r);if(te!==u.__cacheKey){O[te]===void 0&&(O[te]={texture:e.createTexture(),usedTimes:0},d.memory.textures++,A=!0),O[te].usedTimes++;const ie=O[u.__cacheKey];ie!==void 0&&(O[u.__cacheKey].usedTimes--,ie.usedTimes===0&&w(r)),u.__cacheKey=te,u.__webglTexture=O[te].texture}return A}function V(u,r,A){return Math.floor(Math.floor(u/A)/r)}function $(u,r,A,U){const te=u.updateRanges;if(te.length===0)t.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,A,U,r.data);else{te.sort((Me,ce)=>Me.start-ce.start);let ie=0;for(let Me=1;Me<te.length;Me++){const ce=te[ie],ae=te[Me],xe=ce.start+ce.count,Ae=V(ae.start,r.width,4),Ce=V(ce.start,r.width,4);ae.start<=xe+1&&Ae===Ce&&V(ae.start+ae.count-1,r.width,4)===Ae?ce.count=Math.max(ce.count,ae.start+ae.count-ce.start):(++ie,te[ie]=ae)}te.length=ie+1;const B=t.getParameter(e.UNPACK_ROW_LENGTH),X=t.getParameter(e.UNPACK_SKIP_PIXELS),re=t.getParameter(e.UNPACK_SKIP_ROWS);t.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let Me=0,ce=te.length;Me<ce;Me++){const ae=te[Me],xe=Math.floor(ae.start/4),Ae=Math.ceil(ae.count/4),Ce=xe%r.width,E=Math.floor(xe/r.width),oe=Ae,k=1;t.pixelStorei(e.UNPACK_SKIP_PIXELS,Ce),t.pixelStorei(e.UNPACK_SKIP_ROWS,E),t.texSubImage2D(e.TEXTURE_2D,0,Ce,E,oe,k,A,U,r.data)}u.clearUpdateRanges(),t.pixelStorei(e.UNPACK_ROW_LENGTH,B),t.pixelStorei(e.UNPACK_SKIP_PIXELS,X),t.pixelStorei(e.UNPACK_SKIP_ROWS,re)}}function Ee(u,r,A){let U=e.TEXTURE_2D;(r.isDataArrayTexture||r.isCompressedArrayTexture)&&(U=e.TEXTURE_2D_ARRAY),r.isData3DTexture&&(U=e.TEXTURE_3D);const O=ze(u,r),te=r.source;t.bindTexture(U,u.__webglTexture,e.TEXTURE0+A);const ie=i.get(te);if(te.version!==ie.__version||O===!0){if(t.activeTexture(e.TEXTURE0+A),(typeof ImageBitmap<"u"&&r.image instanceof ImageBitmap)===!1){const k=tt.getPrimaries(tt.workingColorSpace),se=r.colorSpace===Yt?null:tt.getPrimaries(r.colorSpace),ue=r.colorSpace===Yt||k===se?e.NONE:e.BROWSER_DEFAULT_WEBGL;t.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),t.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),t.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,ue)}t.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment);let X=f(r.image,!1,l.maxTextureSize);X=dt(r,X);const re=o.convert(r.format,r.colorSpace),Me=o.convert(r.type);let ce=h(r.internalFormat,re,Me,r.normalized,r.colorSpace,r.isVideoTexture);ke(U,r);let ae;const xe=r.mipmaps,Ae=r.isVideoTexture!==!0,Ce=ie.__version===void 0||O===!0,E=te.dataReady,oe=m(r,X);if(r.isDepthTexture)ce=S(r.format===qt,r.type),Ce&&(Ae?t.texStorage2D(e.TEXTURE_2D,1,ce,X.width,X.height):t.texImage2D(e.TEXTURE_2D,0,ce,X.width,X.height,0,re,Me,null));else if(r.isDataTexture)if(xe.length>0){Ae&&Ce&&t.texStorage2D(e.TEXTURE_2D,oe,ce,xe[0].width,xe[0].height);for(let k=0,se=xe.length;k<se;k++)ae=xe[k],Ae?E&&t.texSubImage2D(e.TEXTURE_2D,k,0,0,ae.width,ae.height,re,Me,ae.data):t.texImage2D(e.TEXTURE_2D,k,ce,ae.width,ae.height,0,re,Me,ae.data);r.generateMipmaps=!1}else Ae?(Ce&&t.texStorage2D(e.TEXTURE_2D,oe,ce,X.width,X.height),E&&$(r,X,re,Me)):t.texImage2D(e.TEXTURE_2D,0,ce,X.width,X.height,0,re,Me,X.data);else if(r.isCompressedTexture)if(r.isCompressedArrayTexture){Ae&&Ce&&t.texStorage3D(e.TEXTURE_2D_ARRAY,oe,ce,xe[0].width,xe[0].height,X.depth);for(let k=0,se=xe.length;k<se;k++)if(ae=xe[k],r.format!==Dt)if(re!==null)if(Ae){if(E)if(r.layerUpdates.size>0){const ue=Ea(ae.width,ae.height,r.format,r.type);for(const J of r.layerUpdates){const Te=ae.data.subarray(J*ue/ae.data.BYTES_PER_ELEMENT,(J+1)*ue/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,k,0,0,J,ae.width,ae.height,1,re,Te)}}else t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,k,0,0,0,ae.width,ae.height,X.depth,re,ae.data)}else t.compressedTexImage3D(e.TEXTURE_2D_ARRAY,k,ce,ae.width,ae.height,X.depth,0,ae.data,0,0);else Ve("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ae?E&&t.texSubImage3D(e.TEXTURE_2D_ARRAY,k,0,0,0,ae.width,ae.height,X.depth,re,Me,ae.data):t.texImage3D(e.TEXTURE_2D_ARRAY,k,ce,ae.width,ae.height,X.depth,0,re,Me,ae.data);r.layerUpdates.size>0&&r.clearLayerUpdates()}else{Ae&&Ce&&t.texStorage2D(e.TEXTURE_2D,oe,ce,xe[0].width,xe[0].height);for(let k=0,se=xe.length;k<se;k++)ae=xe[k],r.format!==Dt?re!==null?Ae?E&&t.compressedTexSubImage2D(e.TEXTURE_2D,k,0,0,ae.width,ae.height,re,ae.data):t.compressedTexImage2D(e.TEXTURE_2D,k,ce,ae.width,ae.height,0,ae.data):Ve("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ae?E&&t.texSubImage2D(e.TEXTURE_2D,k,0,0,ae.width,ae.height,re,Me,ae.data):t.texImage2D(e.TEXTURE_2D,k,ce,ae.width,ae.height,0,re,Me,ae.data)}else if(r.isDataArrayTexture)if(Ae){if(Ce&&t.texStorage3D(e.TEXTURE_2D_ARRAY,oe,ce,X.width,X.height,X.depth),E)if(r.layerUpdates.size>0){const k=Ea(X.width,X.height,r.format,r.type);for(const se of r.layerUpdates){const ue=X.data.subarray(se*k/X.data.BYTES_PER_ELEMENT,(se+1)*k/X.data.BYTES_PER_ELEMENT);t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,se,X.width,X.height,1,re,Me,ue)}r.clearLayerUpdates()}else t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,X.width,X.height,X.depth,re,Me,X.data)}else t.texImage3D(e.TEXTURE_2D_ARRAY,0,ce,X.width,X.height,X.depth,0,re,Me,X.data);else if(r.isData3DTexture)Ae?(Ce&&t.texStorage3D(e.TEXTURE_3D,oe,ce,X.width,X.height,X.depth),E&&t.texSubImage3D(e.TEXTURE_3D,0,0,0,0,X.width,X.height,X.depth,re,Me,X.data)):t.texImage3D(e.TEXTURE_3D,0,ce,X.width,X.height,X.depth,0,re,Me,X.data);else if(r.isFramebufferTexture){if(Ce)if(Ae)t.texStorage2D(e.TEXTURE_2D,oe,ce,X.width,X.height);else{let k=X.width,se=X.height;for(let ue=0;ue<oe;ue++)t.texImage2D(e.TEXTURE_2D,ue,ce,k,se,0,re,Me,null),k>>=1,se>>=1}}else if(r.isHTMLTexture){if("texElementImage2D"in e){const k=e.canvas;if(k.hasAttribute("layoutsubtree")||k.setAttribute("layoutsubtree","true"),X.parentNode!==k){k.appendChild(X),I.add(r),k.onpaint=se=>{const ue=se.changedElements;for(const J of I)ue.includes(J.image)&&(J.needsUpdate=!0)},k.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,X);else{const ue=e.RGBA,J=e.RGBA,Te=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,ue,J,Te,X)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(xe.length>0){if(Ae&&Ce){const k=We(xe[0]);t.texStorage2D(e.TEXTURE_2D,oe,ce,k.width,k.height)}for(let k=0,se=xe.length;k<se;k++)ae=xe[k],Ae?E&&t.texSubImage2D(e.TEXTURE_2D,k,0,0,re,Me,ae):t.texImage2D(e.TEXTURE_2D,k,ce,re,Me,ae);r.generateMipmaps=!1}else if(Ae){if(Ce){const k=We(X);t.texStorage2D(e.TEXTURE_2D,oe,ce,k.width,k.height)}E&&t.texSubImage2D(e.TEXTURE_2D,0,0,0,re,Me,X)}else t.texImage2D(e.TEXTURE_2D,0,ce,re,Me,X);s(r)&&L(U),ie.__version=te.version,r.onUpdate&&r.onUpdate(r)}u.__version=r.version}function Ue(u,r,A){if(r.image.length!==6)return;const U=ze(u,r),O=r.source;t.bindTexture(e.TEXTURE_CUBE_MAP,u.__webglTexture,e.TEXTURE0+A);const te=i.get(O);if(O.version!==te.__version||U===!0){t.activeTexture(e.TEXTURE0+A);const ie=tt.getPrimaries(tt.workingColorSpace),B=r.colorSpace===Yt?null:tt.getPrimaries(r.colorSpace),X=r.colorSpace===Yt||ie===B?e.NONE:e.BROWSER_DEFAULT_WEBGL;t.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),t.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),t.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment),t.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,X);const re=r.isCompressedTexture||r.image[0].isCompressedTexture,Me=r.image[0]&&r.image[0].isDataTexture,ce=[];for(let J=0;J<6;J++)!re&&!Me?ce[J]=f(r.image[J],!0,l.maxCubemapSize):ce[J]=Me?r.image[J].image:r.image[J],ce[J]=dt(r,ce[J]);const ae=ce[0],xe=o.convert(r.format,r.colorSpace),Ae=o.convert(r.type),Ce=h(r.internalFormat,xe,Ae,r.normalized,r.colorSpace),E=r.isVideoTexture!==!0,oe=te.__version===void 0||U===!0,k=O.dataReady;let se=m(r,ae);ke(e.TEXTURE_CUBE_MAP,r);let ue;if(re){E&&oe&&t.texStorage2D(e.TEXTURE_CUBE_MAP,se,Ce,ae.width,ae.height);for(let J=0;J<6;J++){ue=ce[J].mipmaps;for(let Te=0;Te<ue.length;Te++){const ve=ue[Te];r.format!==Dt?xe!==null?E?k&&t.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,Te,0,0,ve.width,ve.height,xe,ve.data):t.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,Te,Ce,ve.width,ve.height,0,ve.data):Ve("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):E?k&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,Te,0,0,ve.width,ve.height,xe,Ae,ve.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,Te,Ce,ve.width,ve.height,0,xe,Ae,ve.data)}}}else{if(ue=r.mipmaps,E&&oe){ue.length>0&&se++;const J=We(ce[0]);t.texStorage2D(e.TEXTURE_CUBE_MAP,se,Ce,J.width,J.height)}for(let J=0;J<6;J++)if(Me){E?k&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,ce[J].width,ce[J].height,xe,Ae,ce[J].data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ce,ce[J].width,ce[J].height,0,xe,Ae,ce[J].data);for(let Te=0;Te<ue.length;Te++){const Ze=ue[Te].image[J].image;E?k&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,Te+1,0,0,Ze.width,Ze.height,xe,Ae,Ze.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,Te+1,Ce,Ze.width,Ze.height,0,xe,Ae,Ze.data)}}else{E?k&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,xe,Ae,ce[J]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ce,xe,Ae,ce[J]);for(let Te=0;Te<ue.length;Te++){const ve=ue[Te];E?k&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,Te+1,0,0,xe,Ae,ve.image[J]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+J,Te+1,Ce,xe,Ae,ve.image[J])}}}s(r)&&L(e.TEXTURE_CUBE_MAP),te.__version=O.version,r.onUpdate&&r.onUpdate(r)}u.__version=r.version}function me(u,r,A,U,O,te){const ie=o.convert(A.format,A.colorSpace),B=o.convert(A.type),X=h(A.internalFormat,ie,B,A.normalized,A.colorSpace),re=i.get(r),Me=i.get(A);if(Me.__renderTarget=r,!re.__hasExternalTextures){const ce=Math.max(1,r.width>>te),ae=Math.max(1,r.height>>te);O===e.TEXTURE_3D||O===e.TEXTURE_2D_ARRAY?t.texImage3D(O,te,X,ce,ae,r.depth,0,ie,B,null):t.texImage2D(O,te,X,ce,ae,0,ie,B,null)}t.bindFramebuffer(e.FRAMEBUFFER,u),at(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,U,O,Me.__webglTexture,0,nt(r)):(O===e.TEXTURE_2D||O>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&O<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,U,O,Me.__webglTexture,te),t.bindFramebuffer(e.FRAMEBUFFER,null)}function Fe(u,r,A){if(e.bindRenderbuffer(e.RENDERBUFFER,u),r.depthBuffer){const U=r.depthTexture,O=U&&U.isDepthTexture?U.type:null,te=S(r.stencilBuffer,O),ie=r.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;at(r)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,nt(r),te,r.width,r.height):A?e.renderbufferStorageMultisample(e.RENDERBUFFER,nt(r),te,r.width,r.height):e.renderbufferStorage(e.RENDERBUFFER,te,r.width,r.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,ie,e.RENDERBUFFER,u)}else{const U=r.textures;for(let O=0;O<U.length;O++){const te=U[O],ie=o.convert(te.format,te.colorSpace),B=o.convert(te.type),X=h(te.internalFormat,ie,B,te.normalized,te.colorSpace);at(r)?g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,nt(r),X,r.width,r.height):A?e.renderbufferStorageMultisample(e.RENDERBUFFER,nt(r),X,r.width,r.height):e.renderbufferStorage(e.RENDERBUFFER,X,r.width,r.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function st(u,r,A){const U=r.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(e.FRAMEBUFFER,u),!(r.depthTexture&&r.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const O=i.get(r.depthTexture);if(O.__renderTarget=r,(!O.__webglTexture||r.depthTexture.image.width!==r.width||r.depthTexture.image.height!==r.height)&&(r.depthTexture.image.width=r.width,r.depthTexture.image.height=r.height,r.depthTexture.needsUpdate=!0),U){if(O.__webglInit===void 0&&(O.__webglInit=!0,r.depthTexture.addEventListener("dispose",D)),O.__webglTexture===void 0){O.__webglTexture=e.createTexture(),t.bindTexture(e.TEXTURE_CUBE_MAP,O.__webglTexture),ke(e.TEXTURE_CUBE_MAP,r.depthTexture);const re=o.convert(r.depthTexture.format),Me=o.convert(r.depthTexture.type);let ce;r.depthTexture.format===Kt?ce=e.DEPTH_COMPONENT24:r.depthTexture.format===qt&&(ce=e.DEPTH24_STENCIL8);for(let ae=0;ae<6;ae++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,ce,r.width,r.height,0,re,Me,null)}}else ne(r.depthTexture,0);const te=O.__webglTexture,ie=nt(r),B=U?e.TEXTURE_CUBE_MAP_POSITIVE_X+A:e.TEXTURE_2D,X=r.depthTexture.format===qt?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(r.depthTexture.format===Kt)at(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,X,B,te,0,ie):e.framebufferTexture2D(e.FRAMEBUFFER,X,B,te,0);else if(r.depthTexture.format===qt)at(r)?g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,X,B,te,0,ie):e.framebufferTexture2D(e.FRAMEBUFFER,X,B,te,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function De(u){const r=i.get(u),A=u.isWebGLCubeRenderTarget===!0;if(r.__boundDepthTexture!==u.depthTexture){const U=u.depthTexture;if(r.__depthDisposeCallback&&r.__depthDisposeCallback(),U){const O=()=>{delete r.__boundDepthTexture,delete r.__depthDisposeCallback,U.removeEventListener("dispose",O)};U.addEventListener("dispose",O),r.__depthDisposeCallback=O}r.__boundDepthTexture=U}if(u.depthTexture&&!r.__autoAllocateDepthBuffer)if(A)for(let U=0;U<6;U++)st(r.__webglFramebuffer[U],u,U);else{const U=u.texture.mipmaps;U&&U.length>0?st(r.__webglFramebuffer[0],u,0):st(r.__webglFramebuffer,u,0)}else if(A){r.__webglDepthbuffer=[];for(let U=0;U<6;U++)if(t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[U]),r.__webglDepthbuffer[U]===void 0)r.__webglDepthbuffer[U]=e.createRenderbuffer(),Fe(r.__webglDepthbuffer[U],u,!1);else{const O=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,te=r.__webglDepthbuffer[U];e.bindRenderbuffer(e.RENDERBUFFER,te),e.framebufferRenderbuffer(e.FRAMEBUFFER,O,e.RENDERBUFFER,te)}}else{const U=u.texture.mipmaps;if(U&&U.length>0?t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[0]):t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer),r.__webglDepthbuffer===void 0)r.__webglDepthbuffer=e.createRenderbuffer(),Fe(r.__webglDepthbuffer,u,!1);else{const O=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,te=r.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,te),e.framebufferRenderbuffer(e.FRAMEBUFFER,O,e.RENDERBUFFER,te)}}t.bindFramebuffer(e.FRAMEBUFFER,null)}function Be(u,r,A){const U=i.get(u);r!==void 0&&me(U.__webglFramebuffer,u,u.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),A!==void 0&&De(u)}function qe(u){const r=u.texture,A=i.get(u),U=i.get(r);u.addEventListener("dispose",c);const O=u.textures,te=u.isWebGLCubeRenderTarget===!0,ie=O.length>1;if(ie||(U.__webglTexture===void 0&&(U.__webglTexture=e.createTexture()),U.__version=r.version,d.memory.textures++),te){A.__webglFramebuffer=[];for(let B=0;B<6;B++)if(r.mipmaps&&r.mipmaps.length>0){A.__webglFramebuffer[B]=[];for(let X=0;X<r.mipmaps.length;X++)A.__webglFramebuffer[B][X]=e.createFramebuffer()}else A.__webglFramebuffer[B]=e.createFramebuffer()}else{if(r.mipmaps&&r.mipmaps.length>0){A.__webglFramebuffer=[];for(let B=0;B<r.mipmaps.length;B++)A.__webglFramebuffer[B]=e.createFramebuffer()}else A.__webglFramebuffer=e.createFramebuffer();if(ie)for(let B=0,X=O.length;B<X;B++){const re=i.get(O[B]);re.__webglTexture===void 0&&(re.__webglTexture=e.createTexture(),d.memory.textures++)}if(u.samples>0&&at(u)===!1){A.__webglMultisampledFramebuffer=e.createFramebuffer(),A.__webglColorRenderbuffer=[],t.bindFramebuffer(e.FRAMEBUFFER,A.__webglMultisampledFramebuffer);for(let B=0;B<O.length;B++){const X=O[B];A.__webglColorRenderbuffer[B]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,A.__webglColorRenderbuffer[B]);const re=o.convert(X.format,X.colorSpace),Me=o.convert(X.type),ce=h(X.internalFormat,re,Me,X.normalized,X.colorSpace,u.isXRRenderTarget===!0),ae=nt(u);e.renderbufferStorageMultisample(e.RENDERBUFFER,ae,ce,u.width,u.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+B,e.RENDERBUFFER,A.__webglColorRenderbuffer[B])}e.bindRenderbuffer(e.RENDERBUFFER,null),u.depthBuffer&&(A.__webglDepthRenderbuffer=e.createRenderbuffer(),Fe(A.__webglDepthRenderbuffer,u,!0)),t.bindFramebuffer(e.FRAMEBUFFER,null)}}if(te){t.bindTexture(e.TEXTURE_CUBE_MAP,U.__webglTexture),ke(e.TEXTURE_CUBE_MAP,r);for(let B=0;B<6;B++)if(r.mipmaps&&r.mipmaps.length>0)for(let X=0;X<r.mipmaps.length;X++)me(A.__webglFramebuffer[B][X],u,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+B,X);else me(A.__webglFramebuffer[B],u,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+B,0);s(r)&&L(e.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ie){for(let B=0,X=O.length;B<X;B++){const re=O[B],Me=i.get(re);let ce=e.TEXTURE_2D;(u.isWebGL3DRenderTarget||u.isWebGLArrayRenderTarget)&&(ce=u.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(ce,Me.__webglTexture),ke(ce,re),me(A.__webglFramebuffer,u,re,e.COLOR_ATTACHMENT0+B,ce,0),s(re)&&L(ce)}t.unbindTexture()}else{let B=e.TEXTURE_2D;if((u.isWebGL3DRenderTarget||u.isWebGLArrayRenderTarget)&&(B=u.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(B,U.__webglTexture),ke(B,r),r.mipmaps&&r.mipmaps.length>0)for(let X=0;X<r.mipmaps.length;X++)me(A.__webglFramebuffer[X],u,r,e.COLOR_ATTACHMENT0,B,X);else me(A.__webglFramebuffer,u,r,e.COLOR_ATTACHMENT0,B,0);s(r)&&L(B),t.unbindTexture()}u.depthBuffer&&De(u)}function Ie(u){const r=u.textures;for(let A=0,U=r.length;A<U;A++){const O=r[A];if(s(O)){const te=z(u),ie=i.get(O).__webglTexture;t.bindTexture(te,ie),L(te),t.unbindTexture()}}}const et=[],ft=[];function _t(u){if(u.samples>0){if(at(u)===!1){const r=u.textures,A=u.width,U=u.height;let O=e.COLOR_BUFFER_BIT;const te=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ie=i.get(u),B=r.length>1;if(B)for(let re=0;re<r.length;re++)t.bindFramebuffer(e.FRAMEBUFFER,ie.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+re,e.RENDERBUFFER,null),t.bindFramebuffer(e.FRAMEBUFFER,ie.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+re,e.TEXTURE_2D,null,0);t.bindFramebuffer(e.READ_FRAMEBUFFER,ie.__webglMultisampledFramebuffer);const X=u.texture.mipmaps;X&&X.length>0?t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ie.__webglFramebuffer[0]):t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ie.__webglFramebuffer);for(let re=0;re<r.length;re++){if(u.resolveDepthBuffer&&(u.depthBuffer&&(O|=e.DEPTH_BUFFER_BIT),u.stencilBuffer&&u.resolveStencilBuffer&&(O|=e.STENCIL_BUFFER_BIT)),B){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,ie.__webglColorRenderbuffer[re]);const Me=i.get(r[re]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,Me,0)}e.blitFramebuffer(0,0,A,U,0,0,A,U,O,e.NEAREST),R===!0&&(et.length=0,ft.length=0,et.push(e.COLOR_ATTACHMENT0+re),u.depthBuffer&&u.storeMultisampledDepthBuffer===!1&&(et.push(te),ft.push(te),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,ft)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,et))}if(t.bindFramebuffer(e.READ_FRAMEBUFFER,null),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),B)for(let re=0;re<r.length;re++){t.bindFramebuffer(e.FRAMEBUFFER,ie.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+re,e.RENDERBUFFER,ie.__webglColorRenderbuffer[re]);const Me=i.get(r[re]).__webglTexture;t.bindFramebuffer(e.FRAMEBUFFER,ie.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+re,e.TEXTURE_2D,Me,0)}t.bindFramebuffer(e.DRAW_FRAMEBUFFER,ie.__webglMultisampledFramebuffer)}else if(u.depthBuffer&&u.storeMultisampledDepthBuffer===!1&&R){const r=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[r])}}}function nt(u){return Math.min(l.maxSamples,u.samples)}function at(u){const r=i.get(u);return u.samples>0&&n.has("WEBGL_multisampled_render_to_texture")===!0&&r.__useRenderToTexture!==!1}function M(u){const r=d.render.frame;H.get(u)!==r&&(H.set(u,r),u.update())}function dt(u,r){const A=u.colorSpace,U=u.format,O=u.type;return u.isCompressedTexture===!0||u.isVideoTexture===!0||A!==Kn&&A!==Yt&&(tt.getTransfer(A)===Ye?(U!==Dt||O!==Tt)&&Ve("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Qe("WebGLTextures: Unsupported texture color space:",A)),r}function We(u){return typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement?(T.width=u.naturalWidth||u.width,T.height=u.naturalHeight||u.height):typeof VideoFrame<"u"&&u instanceof VideoFrame?(T.width=u.displayWidth,T.height=u.displayHeight):(T.width=u.width,T.height=u.height),T}this.allocateTextureUnit=Q,this.resetTextureUnits=q,this.getTextureUnits=P,this.setTextureUnits=K,this.setTexture2D=ne,this.setTexture2DArray=Z,this.setTexture3D=j,this.setTextureCube=ee,this.rebindTextures=Be,this.setupRenderTarget=qe,this.updateRenderTargetMipmap=Ie,this.updateMultisampleRenderTarget=_t,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=me,this.useMultisampledRTT=at,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function so(e,n){function t(i,l=Yt){let o;const d=tt.getTransfer(l);if(i===Tt)return e.UNSIGNED_BYTE;if(i===ui)return e.UNSIGNED_SHORT_4_4_4_4;if(i===pi)return e.UNSIGNED_SHORT_5_5_5_1;if(i===Ma)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===xa)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ta)return e.BYTE;if(i===Aa)return e.SHORT;if(i===hn)return e.UNSIGNED_SHORT;if(i===zn)return e.INT;if(i===Ht)return e.UNSIGNED_INT;if(i===yt)return e.FLOAT;if(i===Ut)return e.HALF_FLOAT;if(i===Ra)return e.ALPHA;if(i===ba)return e.RGB;if(i===Dt)return e.RGBA;if(i===Kt)return e.DEPTH_COMPONENT;if(i===qt)return e.DEPTH_STENCIL;if(i===Ca)return e.RED;if(i===hi)return e.RED_INTEGER;if(i===Xt)return e.RG;if(i===mi)return e.RG_INTEGER;if(i===_i)return e.RGBA_INTEGER;if(i===Un||i===Dn||i===wn||i===In)if(d===Ye)if(o=n.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===Un)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Dn)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===wn)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===In)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=n.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===Un)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Dn)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===wn)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===In)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===gi||i===vi||i===Si||i===Ei)if(o=n.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===gi)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===vi)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Si)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ei)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Mi||i===xi||i===Ti||i===Ai||i===Ri||i===bn||i===bi)if(o=n.get("WEBGL_compressed_texture_etc"),o!==null){if(i===Mi||i===xi)return d===Ye?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===Ti)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ai)return o.COMPRESSED_R11_EAC;if(i===Ri)return o.COMPRESSED_SIGNED_R11_EAC;if(i===bn)return o.COMPRESSED_RG11_EAC;if(i===bi)return o.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ci||i===Pi||i===Li||i===Ui||i===Di||i===wi||i===Ii||i===Ni||i===yi||i===Fi||i===Oi||i===Bi||i===Gi||i===Hi)if(o=n.get("WEBGL_compressed_texture_astc"),o!==null){if(i===Ci)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Pi)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Li)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ui)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Di)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===wi)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ii)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ni)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===yi)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Fi)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Oi)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Bi)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Gi)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Hi)return d===Ye?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Vi||i===Wi||i===ki)if(o=n.get("EXT_texture_compression_bptc"),o!==null){if(i===Vi)return d===Ye?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Wi)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ki)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===zi||i===Xi||i===Cn||i===Ki)if(o=n.get("EXT_texture_compression_rgtc"),o!==null){if(i===zi)return o.COMPRESSED_RED_RGTC1_EXT;if(i===Xi)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Cn)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ki)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===nn?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:t}}const ld=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,cd=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class fd{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(n,t){if(this.texture===null){const i=new Yi(n.texture);(n.depthNear!==t.depthNear||n.depthFar!==t.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=i}}getMesh(n){if(this.texture!==null&&this.mesh===null){const t=n.cameras[0].viewport,i=new Lt({vertexShader:ld,fragmentShader:cd,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Pt(new kn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class dd extends Pa{constructor(n,t){super();const i=this;let l=null,o=1,d=null,g="local-floor",R=1,T=null,H=null,I=null,p=null,x=null,N=null;const W=typeof XRWebGLBinding<"u",f=new fd,s={},L=t.getContextAttributes();let z=null,h=null;const S=[],m=[],D=new ht;let c=null,_=null;const w=new cn;w.viewport=new mt;const F=new cn;F.viewport=new mt;const G=[w,F],q=new La;let P=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let $=S[V];return $===void 0&&($=new Nn,S[V]=$),$.getTargetRaySpace()},this.getControllerGrip=function(V){let $=S[V];return $===void 0&&($=new Nn,S[V]=$),$.getGripSpace()},this.getHand=function(V){let $=S[V];return $===void 0&&($=new Nn,S[V]=$),$.getHandSpace()};function Q(V){const $=m.indexOf(V.inputSource);if($===-1)return;const Ee=S[$];Ee!==void 0&&(Ee.update(V.inputSource,V.frame,T||d),Ee.dispatchEvent({type:V.type,data:V.inputSource}))}function Y(){l.removeEventListener("select",Q),l.removeEventListener("selectstart",Q),l.removeEventListener("selectend",Q),l.removeEventListener("squeeze",Q),l.removeEventListener("squeezestart",Q),l.removeEventListener("squeezeend",Q),l.removeEventListener("end",Y),l.removeEventListener("inputsourceschange",ne);for(let V=0;V<S.length;V++){const $=m[V];$!==null&&(m[V]=null,S[V].disconnect($))}P=null,K=null,f.reset();for(const V in s)delete s[V];if(n.setRenderTarget(z),x=null,p=null,I=null,l=null,h=null,ze.stop(),i.isPresenting=!1,n.setPixelRatio(c),n.setSize(D.width,D.height,!1),_!==null){const V=_.camera;V.fov=_.fov,V.zoom=_.zoom,V.updateProjectionMatrix(),_=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){o=V,i.isPresenting===!0&&Ve("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){g=V,i.isPresenting===!0&&Ve("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return T||d},this.setReferenceSpace=function(V){T=V},this.getBaseLayer=function(){return p!==null?p:x},this.getBinding=function(){return I===null&&W&&(I=new XRWebGLBinding(l,t)),I},this.getFrame=function(){return N},this.getSession=function(){return l},this.setSession=async function(V){if(l=V,l!==null){if(z=n.getRenderTarget(),l.addEventListener("select",Q),l.addEventListener("selectstart",Q),l.addEventListener("selectend",Q),l.addEventListener("squeeze",Q),l.addEventListener("squeezestart",Q),l.addEventListener("squeezeend",Q),l.addEventListener("end",Y),l.addEventListener("inputsourceschange",ne),L.xrCompatible!==!0&&await t.makeXRCompatible(),c=n.getPixelRatio(),n.getSize(D),W&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,Ue=null,me=null;L.depth&&(me=L.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ee=L.stencil?qt:Kt,Ue=L.stencil?nn:Ht);const Fe={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:o};I=this.getBinding(),p=I.createProjectionLayer(Fe),l.updateRenderState({layers:[p]}),n.setPixelRatio(1),n.setSize(p.textureWidth,p.textureHeight,!1),h=new Mt(p.textureWidth,p.textureHeight,{format:Dt,type:Tt,depthTexture:new fn(p.textureWidth,p.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:L.stencil,colorSpace:n.outputColorSpace,samples:L.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}else{const Ee={antialias:L.antialias,alpha:!0,depth:L.depth,stencil:L.stencil,framebufferScaleFactor:o};x=new XRWebGLLayer(l,t,Ee),l.updateRenderState({baseLayer:x}),n.setPixelRatio(1),n.setSize(x.framebufferWidth,x.framebufferHeight,!1),h=new Mt(x.framebufferWidth,x.framebufferHeight,{format:Dt,type:Tt,colorSpace:n.outputColorSpace,stencilBuffer:L.stencil,resolveDepthBuffer:x.ignoreDepthValues===!1,resolveStencilBuffer:x.ignoreDepthValues===!1,storeMultisampledDepthBuffer:x.ignoreDepthValues===!1,storeMultisampledStencilBuffer:x.ignoreDepthValues===!1})}h.isXRRenderTarget=!0,this.setFoveation(R),T=null,d=await l.requestReferenceSpace(g),ze.setContext(l),ze.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function ne(V){for(let $=0;$<V.removed.length;$++){const Ee=V.removed[$],Ue=m.indexOf(Ee);Ue>=0&&(m[Ue]=null,S[Ue].disconnect(Ee))}for(let $=0;$<V.added.length;$++){const Ee=V.added[$];let Ue=m.indexOf(Ee);if(Ue===-1){for(let Fe=0;Fe<S.length;Fe++)if(Fe>=m.length){m.push(Ee),Ue=Fe;break}else if(m[Fe]===null){m[Fe]=Ee,Ue=Fe;break}if(Ue===-1)break}const me=S[Ue];me&&me.connect(Ee)}}const Z=new Ne,j=new Ne;function ee(V,$,Ee){Z.setFromMatrixPosition($.matrixWorld),j.setFromMatrixPosition(Ee.matrixWorld);const Ue=Z.distanceTo(j),me=$.projectionMatrix.elements,Fe=Ee.projectionMatrix.elements,st=me[14]/(me[10]-1),De=me[14]/(me[10]+1),Be=(me[9]+1)/me[5],qe=(me[9]-1)/me[5],Ie=(me[8]-1)/me[0],et=(Fe[8]+1)/Fe[0],ft=st*Ie,_t=st*et,nt=Ue/(-Ie+et),at=nt*-Ie;if($.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(at),V.translateZ(nt),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),me[10]===-1)V.projectionMatrix.copy($.projectionMatrix),V.projectionMatrixInverse.copy($.projectionMatrixInverse);else{const M=st+nt,dt=De+nt,We=ft-at,u=_t+(Ue-at),r=Be*De/dt*M,A=qe*De/dt*M;V.projectionMatrix.makePerspective(We,u,r,A,M,dt),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function be(V,$){$===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices($.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(l===null)return;let $=V.near,Ee=V.far;f.texture!==null&&(f.depthNear>0&&($=f.depthNear),f.depthFar>0&&(Ee=f.depthFar)),q.near=F.near=w.near=$,q.far=F.far=w.far=Ee,(P!==q.near||K!==q.far)&&(l.updateRenderState({depthNear:q.near,depthFar:q.far}),P=q.near,K=q.far),q.layers.mask=V.layers.mask|6,w.layers.mask=q.layers.mask&-5,F.layers.mask=q.layers.mask&-3;const Ue=V.parent,me=q.cameras;be(q,Ue);for(let Fe=0;Fe<me.length;Fe++)be(me[Fe],Ue);me.length===2?ee(q,w,F):q.projectionMatrix.copy(w.projectionMatrix),_===null&&V.isPerspectiveCamera&&(_={camera:V,fov:V.fov,zoom:V.zoom}),Re(V,q,Ue)};function Re(V,$,Ee){Ee===null?V.matrix.copy($.matrixWorld):(V.matrix.copy(Ee.matrixWorld),V.matrix.invert(),V.matrix.multiply($.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy($.projectionMatrix),V.projectionMatrixInverse.copy($.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=So*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return q},this.getFoveation=function(){if(!(p===null&&x===null))return R},this.setFoveation=function(V){R=V,p!==null&&(p.fixedFoveation=V),x!==null&&x.fixedFoveation!==void 0&&(x.fixedFoveation=V)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(q)},this.getCameraTexture=function(V){return s[V]};let it=null;function ke(V,$){if(H=$.getViewerPose(T||d),N=$,H!==null){const Ee=H.views;x!==null&&(n.setRenderTargetFramebuffer(h,x.framebuffer),n.setRenderTarget(h));let Ue=!1;Ee.length!==q.cameras.length&&(q.cameras.length=0,Ue=!0);for(let De=0;De<Ee.length;De++){const Be=Ee[De];let qe=null;if(x!==null)qe=x.getViewport(Be);else{const et=I.getViewSubImage(p,Be);qe=et.viewport,De===0&&(n.setRenderTargetTextures(h,et.colorTexture,et.depthStencilTexture),n.setRenderTarget(h))}let Ie=G[De];Ie===void 0&&(Ie=new cn,Ie.layers.enable(De),Ie.viewport=new mt,G[De]=Ie),Ie.matrix.fromArray(Be.transform.matrix),Ie.matrix.decompose(Ie.position,Ie.quaternion,Ie.scale),Ie.projectionMatrix.fromArray(Be.projectionMatrix),Ie.projectionMatrixInverse.copy(Ie.projectionMatrix).invert(),Ie.viewport.set(qe.x,qe.y,qe.width,qe.height),De===0&&(q.matrix.copy(Ie.matrix),q.matrix.decompose(q.position,q.quaternion,q.scale)),Ue===!0&&q.cameras.push(Ie)}const me=l.enabledFeatures;if(me&&me.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&W){I=i.getBinding();const De=I.getDepthInformation(Ee[0]);De&&De.isValid&&De.texture&&f.init(De,l.renderState)}if(me&&me.includes("camera-access")&&W){n.state.unbindTexture(),I=i.getBinding();for(let De=0;De<Ee.length;De++){const Be=Ee[De].camera;if(Be){let qe=s[Be];qe||(qe=new Yi,s[Be]=qe);const Ie=I.getCameraImage(Be);qe.sourceTexture=Ie}}}}for(let Ee=0;Ee<S.length;Ee++){const Ue=m[Ee],me=S[Ee];Ue!==null&&me!==void 0&&me.update(Ue,$,T||d)}it&&it(V,$),$.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:$}),N=null}const ze=new Na;ze.setAnimationLoop(ke),this.setAnimationLoop=function(V){it=V},this.dispose=function(){}}}const ud=new Wt,lo=new ye;lo.set(-1,0,0,0,1,0,0,0,1);function pd(e,n){function t(f,s){f.matrixAutoUpdate===!0&&f.updateMatrix(),s.value.copy(f.matrix)}function i(f,s){s.color.getRGB(f.fogColor.value,_r(e)),s.isFog?(f.fogNear.value=s.near,f.fogFar.value=s.far):s.isFogExp2&&(f.fogDensity.value=s.density)}function l(f,s,L,z,h){s.isNodeMaterial?s.uniformsNeedUpdate=!1:s.isMeshBasicMaterial?o(f,s):s.isMeshLambertMaterial?(o(f,s),s.envMap&&(f.envMapIntensity.value=s.envMapIntensity)):s.isMeshToonMaterial?(o(f,s),I(f,s)):s.isMeshPhongMaterial?(o(f,s),H(f,s),s.envMap&&(f.envMapIntensity.value=s.envMapIntensity)):s.isMeshStandardMaterial?(o(f,s),p(f,s),s.isMeshPhysicalMaterial&&x(f,s,h)):s.isMeshMatcapMaterial?(o(f,s),N(f,s)):s.isMeshDepthMaterial?o(f,s):s.isMeshDistanceMaterial?(o(f,s),W(f,s)):s.isMeshNormalMaterial?o(f,s):s.isLineBasicMaterial?(d(f,s),s.isLineDashedMaterial&&g(f,s)):s.isPointsMaterial?R(f,s,L,z):s.isSpriteMaterial?T(f,s):s.isShadowMaterial?(f.color.value.copy(s.color),f.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}function o(f,s){f.opacity.value=s.opacity,s.color&&f.diffuse.value.copy(s.color),s.emissive&&f.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(f.map.value=s.map,t(s.map,f.mapTransform)),s.alphaMap&&(f.alphaMap.value=s.alphaMap,t(s.alphaMap,f.alphaMapTransform)),s.bumpMap&&(f.bumpMap.value=s.bumpMap,t(s.bumpMap,f.bumpMapTransform),f.bumpScale.value=s.bumpScale,s.side===vt&&(f.bumpScale.value*=-1)),s.normalMap&&(f.normalMap.value=s.normalMap,t(s.normalMap,f.normalMapTransform),f.normalScale.value.copy(s.normalScale),s.side===vt&&f.normalScale.value.negate()),s.displacementMap&&(f.displacementMap.value=s.displacementMap,t(s.displacementMap,f.displacementMapTransform),f.displacementScale.value=s.displacementScale,f.displacementBias.value=s.displacementBias),s.emissiveMap&&(f.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,f.emissiveMapTransform)),s.specularMap&&(f.specularMap.value=s.specularMap,t(s.specularMap,f.specularMapTransform)),s.alphaTest>0&&(f.alphaTest.value=s.alphaTest);const L=n.get(s),z=L.envMap,h=L.envMapRotation;z&&(f.envMap.value=z,f.envMapRotation.value.setFromMatrix4(ud.makeRotationFromEuler(h)).transpose(),z.isCubeTexture&&z.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply(lo),f.reflectivity.value=s.reflectivity,f.ior.value=s.ior,f.refractionRatio.value=s.refractionRatio),s.lightMap&&(f.lightMap.value=s.lightMap,f.lightMapIntensity.value=s.lightMapIntensity,t(s.lightMap,f.lightMapTransform)),s.aoMap&&(f.aoMap.value=s.aoMap,f.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,f.aoMapTransform))}function d(f,s){f.diffuse.value.copy(s.color),f.opacity.value=s.opacity,s.map&&(f.map.value=s.map,t(s.map,f.mapTransform))}function g(f,s){f.dashSize.value=s.dashSize,f.totalSize.value=s.dashSize+s.gapSize,f.scale.value=s.scale}function R(f,s,L,z){f.diffuse.value.copy(s.color),f.opacity.value=s.opacity,f.size.value=s.size*L,f.scale.value=z*.5,s.map&&(f.map.value=s.map,t(s.map,f.uvTransform)),s.alphaMap&&(f.alphaMap.value=s.alphaMap,t(s.alphaMap,f.alphaMapTransform)),s.alphaTest>0&&(f.alphaTest.value=s.alphaTest)}function T(f,s){f.diffuse.value.copy(s.color),f.opacity.value=s.opacity,f.rotation.value=s.rotation,s.map&&(f.map.value=s.map,t(s.map,f.mapTransform)),s.alphaMap&&(f.alphaMap.value=s.alphaMap,t(s.alphaMap,f.alphaMapTransform)),s.alphaTest>0&&(f.alphaTest.value=s.alphaTest)}function H(f,s){f.specular.value.copy(s.specular),f.shininess.value=Math.max(s.shininess,1e-4)}function I(f,s){s.gradientMap&&(f.gradientMap.value=s.gradientMap)}function p(f,s){f.metalness.value=s.metalness,s.metalnessMap&&(f.metalnessMap.value=s.metalnessMap,t(s.metalnessMap,f.metalnessMapTransform)),f.roughness.value=s.roughness,s.roughnessMap&&(f.roughnessMap.value=s.roughnessMap,t(s.roughnessMap,f.roughnessMapTransform)),s.envMap&&(f.envMapIntensity.value=s.envMapIntensity)}function x(f,s,L){f.ior.value=s.ior,s.sheen>0&&(f.sheenColor.value.copy(s.sheenColor).multiplyScalar(s.sheen),f.sheenRoughness.value=s.sheenRoughness,s.sheenColorMap&&(f.sheenColorMap.value=s.sheenColorMap,t(s.sheenColorMap,f.sheenColorMapTransform)),s.sheenRoughnessMap&&(f.sheenRoughnessMap.value=s.sheenRoughnessMap,t(s.sheenRoughnessMap,f.sheenRoughnessMapTransform))),s.clearcoat>0&&(f.clearcoat.value=s.clearcoat,f.clearcoatRoughness.value=s.clearcoatRoughness,s.clearcoatMap&&(f.clearcoatMap.value=s.clearcoatMap,t(s.clearcoatMap,f.clearcoatMapTransform)),s.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=s.clearcoatRoughnessMap,t(s.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),s.clearcoatNormalMap&&(f.clearcoatNormalMap.value=s.clearcoatNormalMap,t(s.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(s.clearcoatNormalScale),s.side===vt&&f.clearcoatNormalScale.value.negate())),s.dispersion>0&&(f.dispersion.value=s.dispersion),s.retroreflectivity>0&&(f.retroreflectivity.value=s.retroreflectivity),s.iridescence>0&&(f.iridescence.value=s.iridescence,f.iridescenceIOR.value=s.iridescenceIOR,f.iridescenceThicknessMinimum.value=s.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=s.iridescenceThicknessRange[1],s.iridescenceMap&&(f.iridescenceMap.value=s.iridescenceMap,t(s.iridescenceMap,f.iridescenceMapTransform)),s.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=s.iridescenceThicknessMap,t(s.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),s.transmission>0&&(f.transmission.value=s.transmission,f.transmissionSamplerMap.value=L.texture,f.transmissionSamplerSize.value.set(L.width,L.height),s.transmissionMap&&(f.transmissionMap.value=s.transmissionMap,t(s.transmissionMap,f.transmissionMapTransform)),f.thickness.value=s.thickness,s.thicknessMap&&(f.thicknessMap.value=s.thicknessMap,t(s.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=s.attenuationDistance,f.attenuationColor.value.copy(s.attenuationColor)),s.anisotropy>0&&(f.anisotropyVector.value.set(s.anisotropy*Math.cos(s.anisotropyRotation),s.anisotropy*Math.sin(s.anisotropyRotation)),s.anisotropyMap&&(f.anisotropyMap.value=s.anisotropyMap,t(s.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=s.specularIntensity,f.specularColor.value.copy(s.specularColor),s.specularColorMap&&(f.specularColorMap.value=s.specularColorMap,t(s.specularColorMap,f.specularColorMapTransform)),s.specularIntensityMap&&(f.specularIntensityMap.value=s.specularIntensityMap,t(s.specularIntensityMap,f.specularIntensityMapTransform))}function N(f,s){s.matcap&&(f.matcap.value=s.matcap)}function W(f,s){const L=n.get(s).light;f.referencePosition.value.setFromMatrixPosition(L.matrixWorld),f.nearDistance.value=L.shadow.camera.near,f.farDistance.value=L.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:l}}function hd(e,n,t,i){let l={},o={},d=[];const g=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function R(h,S){const m=S.program;i.uniformBlockBinding(h,m)}function T(h,S){let m=l[h.id];m===void 0&&(f(h),m=H(h),l[h.id]=m,h.addEventListener("dispose",L));const D=S.program;i.updateUBOMapping(h,D);const c=n.render.frame;o[h.id]!==c&&(p(h),o[h.id]=c)}function H(h){const S=I();h.__bindingPointIndex=S;const m=e.createBuffer(),D=h.__size,c=h.usage;return e.bindBuffer(e.UNIFORM_BUFFER,m),e.bufferData(e.UNIFORM_BUFFER,D,c),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,S,m),m}function I(){for(let h=0;h<g;h++)if(d.indexOf(h)===-1)return d.push(h),h;return Qe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(h){const S=l[h.id],m=h.uniforms,D=h.__cache;e.bindBuffer(e.UNIFORM_BUFFER,S);for(let c=0,_=m.length;c<_;c++){const w=m[c];if(Array.isArray(w))for(let F=0,G=w.length;F<G;F++)x(w[F],c,F,D);else x(w,c,0,D)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function x(h,S,m,D){if(W(h,S,m,D)===!0){const c=h.__offset,_=h.value;if(Array.isArray(_)){let w=0;for(let F=0;F<_.length;F++){const G=_[F],q=s(G);N(G,h.__data,w),typeof G!="number"&&typeof G!="boolean"&&!G.isMatrix3&&!ArrayBuffer.isView(G)&&(w+=q.storage/Float32Array.BYTES_PER_ELEMENT)}}else N(_,h.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,c,h.__data)}}function N(h,S,m){typeof h=="number"||typeof h=="boolean"?S[0]=h:h.isMatrix3?(S[0]=h.elements[0],S[1]=h.elements[1],S[2]=h.elements[2],S[3]=0,S[4]=h.elements[3],S[5]=h.elements[4],S[6]=h.elements[5],S[7]=0,S[8]=h.elements[6],S[9]=h.elements[7],S[10]=h.elements[8],S[11]=0):ArrayBuffer.isView(h)?S.set(new h.constructor(h.buffer,h.byteOffset,S.length)):h.toArray(S,m)}function W(h,S,m,D){const c=h.value,_=S+"_"+m;if(D[_]===void 0)return typeof c=="number"||typeof c=="boolean"?D[_]=c:ArrayBuffer.isView(c)?D[_]=c.slice():D[_]=c.clone(),!0;{const w=D[_];if(typeof c=="number"||typeof c=="boolean"){if(w!==c)return D[_]=c,!0}else{if(ArrayBuffer.isView(c))return!0;if(w.equals(c)===!1)return w.copy(c),!0}}return!1}function f(h){const S=h.uniforms;let m=0;const D=16;for(let _=0,w=S.length;_<w;_++){const F=Array.isArray(S[_])?S[_]:[S[_]];for(let G=0,q=F.length;G<q;G++){const P=F[G],K=Array.isArray(P.value)?P.value:[P.value];for(let Q=0,Y=K.length;Q<Y;Q++){const ne=K[Q],Z=s(ne),j=m%D,ee=j%Z.boundary,be=j+ee;m+=ee,be!==0&&D-be<Z.storage&&(m+=D-be),P.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=m,m+=Z.storage}}}const c=m%D;return c>0&&(m+=D-c),h.__size=m,h.__cache={},this}function s(h){const S={boundary:0,storage:0};return typeof h=="number"||typeof h=="boolean"?(S.boundary=4,S.storage=4):h.isVector2?(S.boundary=8,S.storage=8):h.isVector3||h.isColor?(S.boundary=16,S.storage=12):h.isVector4?(S.boundary=16,S.storage=16):h.isMatrix3?(S.boundary=48,S.storage=48):h.isMatrix4?(S.boundary=64,S.storage=64):h.isTexture?Ve("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(h)?(S.boundary=16,S.storage=h.byteLength):Ve("WebGLRenderer: Unsupported uniform value type.",h),S}function L(h){const S=h.target;S.removeEventListener("dispose",L);const m=d.indexOf(S.__bindingPointIndex);d.splice(m,1),e.deleteBuffer(l[S.id]),delete l[S.id],delete o[S.id]}function z(){for(const h in l)e.deleteBuffer(l[h]);d=[],l={},o={}}return{bind:R,update:T,dispose:z}}const md=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Nt=null;function _d(){return Nt===null&&(Nt=new Ua(md,16,16,Xt,Ut),Nt.name="DFG_LUT",Nt.minFilter=St,Nt.magFilter=St,Nt.wrapS=Pn,Nt.wrapT=Pn,Nt.generateMipmaps=!1,Nt.needsUpdate=!0),Nt}class gd{constructor(n={}){const{canvas:t=Da(),context:i=null,depth:l=!0,stencil:o=!1,alpha:d=!1,antialias:g=!1,premultipliedAlpha:R=!0,preserveDrawingBuffer:T=!1,powerPreference:H="default",failIfMajorPerformanceCaveat:I=!1,reversedDepthBuffer:p=!1,outputBufferType:x=Tt}=n;this.isWebGLRenderer=!0;let N;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");N=i.getContextAttributes().alpha}else N=d;const W=x,f=new Set([_i,mi,hi]),s=new Set([Tt,Ht,hn,nn,ui,pi]),L=new Uint32Array(4),z=new Int32Array(4),h=new Ne;let S=null,m=null;const D=[],c=[];let _=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=At,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const w=this;let F=!1,G=null,q=null,P=null,K=null;this._outputColorSpace=wa;let Q=0,Y=0,ne=null,Z=-1,j=null;const ee=new mt,be=new mt;let Re=null;const it=new je(0);let ke=0,ze=t.width,V=t.height,$=1,Ee=null,Ue=null;const me=new mt(0,0,ze,V),Fe=new mt(0,0,ze,V);let st=!1;const De=new oi;let Be=!1,qe=!1;const Ie=new Wt,et=new Ne,ft=new mt,_t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function at(){return ne===null?$:1}let M=i;function dt(a,v){return t.getContext(a,v)}let We,u,r,A,U,O,te,ie,B,X,re,Me,ce,ae,xe,Ae,Ce,E,oe,k,se,ue,J;try{const a={alpha:!0,depth:l,stencil:o,antialias:g,premultipliedAlpha:R,preserveDrawingBuffer:T,powerPreference:H,failIfMajorPerformanceCaveat:I};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ia}`),t.addEventListener("webglcontextlost",Ze,!1),t.addEventListener("webglcontextrestored",Ge,!1),t.addEventListener("webglcontextcreationerror",xt,!1),M===null){const v="webgl2";if(M=dt(v,a),M===null)throw dt(v)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Te()}catch(a){throw t.removeEventListener("webglcontextlost",Ze,!1),t.removeEventListener("webglcontextrestored",Ge,!1),t.removeEventListener("webglcontextcreationerror",xt,!1),Qe("WebGLRenderer: "+a.message),a}function Te(){We=new _c(M),We.init(),se=new so(M,We),u=new oc(M,We,n,se),r=new od(M,We),u.reversedDepthBuffer&&p&&r.buffers.depth.setReversed(!0),q=M.createFramebuffer(),P=M.createFramebuffer(),K=M.createFramebuffer(),A=new Sc(M),U=new Kf,O=new sd(M,We,r,U,u,se,A),te=new mc(w),ie=new Mo(M),ue=new rc(M,ie),B=new gc(M,ie,A,ue),X=new Mc(M,B,ie,ue,A),E=new Ec(M,u,O),xe=new sc(U),re=new Xf(w,te,We,u,ue,xe),Me=new pd(w,U),ce=new qf,ae=new ed(We),Ce=new ic(w,te,r,X,N,R),Ae=new ad(w,X,u),J=new hd(M,A,u,r),oe=new ac(M,We,A),k=new vc(M,We,A),A.programs=re.programs,w.capabilities=u,w.extensions=We,w.properties=U,w.renderLists=ce,w.shadowMap=Ae,w.state=r,w.info=A}W!==Tt&&(_=new Tc(W,t.width,t.height,g,l,o));const ve=new dd(w,M);this.xr=ve,this.getContext=function(){return M},this.getContextAttributes=function(){return M.getContextAttributes()},this.forceContextLoss=function(){const a=We.get("WEBGL_lose_context");a&&a.loseContext()},this.forceContextRestore=function(){const a=We.get("WEBGL_lose_context");a&&a.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(a){a!==void 0&&($=a,this.setSize(ze,V,!1))},this.getSize=function(a){return a.set(ze,V)},this.setSize=function(a,v,y=!0){if(ve.isPresenting){Ve("WebGLRenderer: Can't change size while VR device is presenting.");return}ze=a,V=v,t.width=Math.floor(a*$),t.height=Math.floor(v*$),y===!0&&(t.style.width=a+"px",t.style.height=v+"px"),_!==null&&_.setSize(t.width,t.height),this.setViewport(0,0,a,v)},this.getDrawingBufferSize=function(a){return a.set(ze*$,V*$).floor()},this.setDrawingBufferSize=function(a,v,y){ze=a,V=v,$=y,t.width=Math.floor(a*y),t.height=Math.floor(v*y),this.setViewport(0,0,a,v)},this.setEffects=function(a){if(W===Tt){Qe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(a){for(let v=0;v<a.length;v++)if(a[v].isOutputPass===!0){Ve("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}_.setEffects(a||[])},this.getCurrentViewport=function(a){return a.copy(ee)},this.getViewport=function(a){return a.copy(me)},this.setViewport=function(a,v,y,b){a.isVector4?me.set(a.x,a.y,a.z,a.w):me.set(a,v,y,b),r.viewport(ee.copy(me).multiplyScalar($).round())},this.getScissor=function(a){return a.copy(Fe)},this.setScissor=function(a,v,y,b){a.isVector4?Fe.set(a.x,a.y,a.z,a.w):Fe.set(a,v,y,b),r.scissor(be.copy(Fe).multiplyScalar($).round())},this.getScissorTest=function(){return st},this.setScissorTest=function(a){r.setScissorTest(st=a)},this.setOpaqueSort=function(a){Ee=a},this.setTransparentSort=function(a){Ue=a},this.getClearColor=function(a){return a.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor(...arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha(...arguments)},this.clear=function(a=!0,v=!0,y=!0){let b=0;if(a){let C=!1;if(ne!==null){const de=ne.texture.format;C=f.has(de)}if(C){const de=ne.texture.type,he=s.has(de),fe=Ce.getClearColor(),_e=Ce.getClearAlpha(),Se=fe.r,Le=fe.g,we=fe.b;he?(L[0]=Se,L[1]=Le,L[2]=we,L[3]=_e,M.clearBufferuiv(M.COLOR,0,L)):(z[0]=Se,z[1]=Le,z[2]=we,z[3]=_e,M.clearBufferiv(M.COLOR,0,z))}else b|=M.COLOR_BUFFER_BIT}v&&(b|=M.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),y&&(b|=M.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),b!==0&&M.clear(b)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(a){a.setRenderer(this),G=a},this.dispose=function(){t.removeEventListener("webglcontextlost",Ze,!1),t.removeEventListener("webglcontextrestored",Ge,!1),t.removeEventListener("webglcontextcreationerror",xt,!1),Ce.dispose(),ce.dispose(),ae.dispose(),U.dispose(),te.dispose(),X.dispose(),ue.dispose(),J.dispose(),re.dispose(),ve.dispose(),ve.removeEventListener("sessionstart",sr),ve.removeEventListener("sessionend",lr),Vt.stop()};function Ze(a){a.preventDefault(),qi("WebGLRenderer: Context Lost."),F=!0}function Ge(){qi("WebGLRenderer: Context Restored."),F=!1;const a=A.autoReset,v=Ae.enabled,y=Ae.autoUpdate,b=Ae.needsUpdate,C=Ae.type;Te(),A.autoReset=a,Ae.enabled=v,Ae.autoUpdate=y,Ae.needsUpdate=b,Ae.type=C}function xt(a){Qe("WebGLRenderer: A WebGL context could not be created. Reason: ",a.statusMessage)}function bt(a){const v=a.target;v.removeEventListener("dispose",bt),co(v)}function co(a){fo(a),U.remove(a)}function fo(a){const v=U.get(a).programs;v!==void 0&&(v.forEach(function(y){re.releaseProgram(y)}),a.isShaderMaterial&&re.releaseShaderCache(a))}this.renderBufferDirect=function(a,v,y,b,C,de){v===null&&(v=_t);const he=C.isMesh&&C.matrixWorld.determinantAffine()<0,fe=ho(a,v,y,b,C);r.setMaterial(b,he);let _e=y.index,Se=1;if(b.wireframe===!0){if(_e=B.getWireframeAttribute(y),_e===void 0)return;Se=2}const Le=y.drawRange,we=y.attributes.position;let ge=Le.start*Se,He=(Le.start+Le.count)*Se;de!==null&&(ge=Math.max(ge,de.start*Se),He=Math.min(He,(de.start+de.count)*Se)),_e!==null?(ge=Math.max(ge,0),He=Math.min(He,_e.count)):we!=null&&(ge=Math.max(ge,0),He=Math.min(He,we.count));const ot=He-ge;if(ot<0||ot===1/0)return;ue.setup(C,b,fe,y,_e);let Je,Ke=oe;if(_e!==null&&(Je=ie.get(_e),Ke=k,Ke.setIndex(Je)),C.isMesh)b.wireframe===!0?(r.setLineWidth(b.wireframeLinewidth*at()),Ke.setMode(M.LINES)):Ke.setMode(M.TRIANGLES);else if(C.isLine){let ut=b.linewidth;ut===void 0&&(ut=1),r.setLineWidth(ut*at()),C.isLineSegments?Ke.setMode(M.LINES):C.isLineLoop?Ke.setMode(M.LINE_LOOP):Ke.setMode(M.LINE_STRIP)}else C.isPoints?Ke.setMode(M.POINTS):C.isSprite&&Ke.setMode(M.TRIANGLES);if(C.isBatchedMesh)if(We.get("WEBGL_multi_draw"))Ke.renderMultiDraw(C._multiDrawStarts,C._multiDrawCounts,C._multiDrawCount);else{const ut=C._multiDrawStarts,pe=C._multiDrawCounts,pt=C._multiDrawCount,Oe=_e?ie.get(_e).bytesPerElement:1,Et=U.get(b).currentProgram.getUniforms();for(let Ct=0;Ct<pt;Ct++)Et.setValue(M,"_gl_DrawID",Ct),Ke.render(ut[Ct]/Oe,pe[Ct])}else if(C.isInstancedMesh)Ke.renderInstances(ge,ot,C.count);else if(y.isInstancedBufferGeometry){const ut=y._maxInstanceCount!==void 0?y._maxInstanceCount:1/0,pe=Math.min(y.instanceCount,ut);Ke.renderInstances(ge,ot,pe)}else Ke.render(ge,ot)};function or(a,v,y,b){G!==null&&a.isNodeMaterial&&G.setObject(b,a),Be===!0&&xe.setState(a,y,!1),a.transparent===!0&&a.side===It&&a.forceSinglePass===!1?(a.side=vt,a.needsUpdate=!0,Sn(a,v,b),a.side=Jt,a.needsUpdate=!0,Sn(a,v,b),a.side=It):Sn(a,v,b)}this.compile=function(a,v,y=null){y===null&&(y=a),G!==null&&G.renderStart(a,v,y),m=ae.get(y),m.init(v),c.push(m),y.traverseVisible(function(C){C.isLight&&C.layers.test(v.layers)&&(m.pushLight(C),C.castShadow&&m.pushShadow(C))}),a!==y&&a.traverseVisible(function(C){C.isLight&&C.layers.test(v.layers)&&(m.pushLight(C),C.castShadow&&m.pushShadow(C))}),m.setupLights(),G!==null&&G.updateLights(m.state.lightsArray),qe=this.localClippingEnabled,Be=xe.init(this.clippingPlanes,qe),Be===!0&&xe.setGlobalState(this.clippingPlanes,v),G!==null&&Ae.render(m.state.shadowsArray,y,v);const b=new Set;return a.traverse(function(C){if(!(C.isMesh||C.isPoints||C.isLine||C.isSprite))return;const de=C.material;if(de)if(Array.isArray(de))for(let he=0;he<de.length;he++){const fe=de[he];or(fe,y,v,C),b.add(fe)}else or(de,y,v,C),b.add(de)}),m=c.pop(),G!==null&&G.renderEnd(),b},this.compileAsync=function(a,v,y=null){const b=this.compile(a,v,y);return new Promise(C=>{function de(){if(b.forEach(function(he){const _e=U.get(he).currentProgram;(_e===void 0||_e.isReady())&&b.delete(he)}),b.size===0){C(a);return}setTimeout(de,10)}We.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let Hn=null;function uo(a){Hn&&Hn(a)}function sr(){Vt.stop()}function lr(){Vt.start()}const Vt=new Na;Vt.setAnimationLoop(uo),typeof self<"u"&&Vt.setContext(self),this.setAnimationLoop=function(a){Hn=a,ve.setAnimationLoop(a),a===null?Vt.stop():Vt.start()},ve.addEventListener("sessionstart",sr),ve.addEventListener("sessionend",lr),this.render=function(a,v){if(v!==void 0&&v.isCamera!==!0){Qe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;G!==null&&G.renderStart(a,v);const y=ve.enabled===!0&&ve.isPresenting===!0,b=_!==null&&(ne===null||y)&&_.begin(w,ne);if(a.matrixWorldAutoUpdate===!0&&a.updateMatrixWorld(),v.parent===null&&v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),ve.enabled===!0&&ve.isPresenting===!0&&(_===null||_.isCompositing()===!1)&&(ve.cameraAutoUpdate===!0&&ve.updateCamera(v),v=ve.getCamera()),a.isScene===!0&&a.onBeforeRender(w,a,v,ne),m=ae.get(a,c.length),m.init(v),m.state.textureUnits=O.getTextureUnits(),c.push(m),Ie.multiplyMatrices(v.projectionMatrix,v.matrixWorldInverse),De.setFromProjectionMatrix(Ie,Zi,v.reversedDepth),qe=this.localClippingEnabled,Be=xe.init(this.clippingPlanes,qe),S=ce.get(a,D.length),S.init(),D.push(S),ve.enabled===!0&&ve.isPresenting===!0){const he=w.xr.getDepthSensingMesh();he!==null&&Vn(he,v,-1/0,w.sortObjects)}Vn(a,v,0,w.sortObjects),S.finish(),G!==null&&G.updateLights(m.state.lightsArray),w.sortObjects===!0&&S.sort(Ee,Ue),nt=ve.enabled===!1||ve.isPresenting===!1||ve.hasDepthSensing()===!1,nt&&Ce.addToRenderList(S,a),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Be===!0&&xe.beginShadows();const C=m.state.shadowsArray;if(Ae.render(C,a,v),Be===!0&&xe.endShadows(),(b&&_.hasRenderPass())===!1){const he=S.opaque,fe=S.transmissive;if(m.setupLights(),v.isArrayCamera){const _e=v.cameras;if(fe.length>0)for(let Se=0,Le=_e.length;Se<Le;Se++){const we=_e[Se];fr(he,fe,a,we)}nt&&Ce.render(a);for(let Se=0,Le=_e.length;Se<Le;Se++){const we=_e[Se];cr(S,a,we,we.viewport)}}else fe.length>0&&fr(he,fe,a,v),nt&&Ce.render(a),cr(S,a,v)}ne!==null&&Y===0&&(O.updateMultisampleRenderTarget(ne),O.updateRenderTargetMipmap(ne)),b&&_.end(w),a.isScene===!0&&a.onAfterRender(w,a,v),ue.resetDefaultState(),Z=-1,j=null,c.pop(),c.length>0?(m=c[c.length-1],O.setTextureUnits(m.state.textureUnits),Be===!0&&xe.setGlobalState(w.clippingPlanes,m.state.camera)):m=null,D.pop(),D.length>0?S=D[D.length-1]:S=null,G!==null&&G.renderEnd()};function Vn(a,v,y,b){if(a.visible===!1)return;if(a.layers.test(v.layers)){if(a.isGroup)y=a.renderOrder;else if(a.isLOD)a.autoUpdate===!0&&a.update(v);else if(a.isLightProbeGrid)m.pushLightProbeGrid(a);else if(a.isLight)m.pushLight(a),a.castShadow&&m.pushShadow(a);else if(a.isSprite){if(!a.frustumCulled||a.intersectsFrustum(De)){b&&ft.setFromMatrixPosition(a.matrixWorld).applyMatrix4(Ie);const he=X.update(a),fe=a.material;fe.visible&&S.push(a,he,fe,y,ft.z,null,v)}}else if((a.isMesh||a.isLine||a.isPoints)&&(!a.frustumCulled||a.intersectsFrustum(De))){const he=X.update(a),fe=a.material;if(b&&(a.boundingSphere!==void 0?(a.boundingSphere===null&&a.computeBoundingSphere(),ft.copy(a.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),ft.copy(he.boundingSphere.center)),ft.applyMatrix4(a.matrixWorld).applyMatrix4(Ie)),Array.isArray(fe)){const _e=he.groups;for(let Se=0,Le=_e.length;Se<Le;Se++){const we=_e[Se],ge=fe[we.materialIndex];ge&&ge.visible&&S.push(a,he,ge,y,ft.z,we,v)}}else fe.visible&&S.push(a,he,fe,y,ft.z,null,v)}}const de=a.children;for(let he=0,fe=de.length;he<fe;he++)Vn(de[he],v,y,b)}function cr(a,v,y,b){const{opaque:C,transmissive:de,transparent:he}=a;m.setupLightsView(y),Be===!0&&xe.setGlobalState(w.clippingPlanes,y),b&&r.viewport(ee.copy(b)),C.length>0&&vn(C,v,y),de.length>0&&vn(de,v,y),he.length>0&&vn(he,v,y),r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),r.setPolygonOffset(!1)}function fr(a,v,y,b){if((y.isScene===!0?y.overrideMaterial:null)!==null)return;if(m.state.transmissionRenderTarget[b.id]===void 0){const ge=We.has("EXT_color_buffer_half_float")||We.has("EXT_color_buffer_float");m.state.transmissionRenderTarget[b.id]=new Mt(1,1,{generateMipmaps:!0,type:ge?Ut:Tt,minFilter:zt,samples:Math.max(4,u.samples),stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:tt.workingColorSpace})}const de=m.state.transmissionRenderTarget[b.id],he=b.viewport||ee;de.setSize(he.z*w.transmissionResolutionScale,he.w*w.transmissionResolutionScale);const fe=w.getRenderTarget(),_e=w.getActiveCubeFace(),Se=w.getActiveMipmapLevel();w.setRenderTarget(de),w.getClearColor(it),ke=w.getClearAlpha(),ke<1&&w.setClearColor(16777215,.5),w.clear(),nt&&Ce.render(y);const Le=w.toneMapping;w.toneMapping=At;const we=b.viewport;if(b.viewport!==void 0&&(b.viewport=void 0),m.setupLightsView(b),Be===!0&&xe.setGlobalState(w.clippingPlanes,b),vn(a,y,b),O.updateMultisampleRenderTarget(de),O.updateRenderTargetMipmap(de),We.has("WEBGL_multisampled_render_to_texture")===!1){let ge=!1;for(let He=0,ot=v.length;He<ot;He++){const Je=v[He],{object:Ke,geometry:ut,material:pe,group:pt}=Je;if(pe.side===It&&Ke.layers.test(b.layers)){const Oe=pe.side;pe.side=vt,pe.needsUpdate=!0,dr(Ke,y,b,ut,pe,pt),pe.side=Oe,pe.needsUpdate=!0,ge=!0}}ge===!0&&(O.updateMultisampleRenderTarget(de),O.updateRenderTargetMipmap(de))}w.setRenderTarget(fe,_e,Se),w.setClearColor(it,ke),we!==void 0&&(b.viewport=we),w.toneMapping=Le}function vn(a,v,y){const b=v.isScene===!0?v.overrideMaterial:null;for(let C=0,de=a.length;C<de;C++){const he=a[C],{object:fe,geometry:_e,group:Se}=he;let Le=he.material;Le.allowOverride===!0&&b!==null&&(Le=b),fe.layers.test(y.layers)&&dr(fe,v,y,_e,Le,Se)}}function dr(a,v,y,b,C,de){G!==null&&C.isNodeMaterial&&G.setObject(a,C),a.onBeforeRender(w,v,y,b,C,de),a.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,a.matrixWorld),a.normalMatrix.getNormalMatrix(a.modelViewMatrix),C.onBeforeRender(w,v,y,b,a,de),C.transparent===!0&&C.side===It&&C.forceSinglePass===!1?(C.side=vt,C.needsUpdate=!0,w.renderBufferDirect(y,v,b,C,a,de),C.side=Jt,C.needsUpdate=!0,w.renderBufferDirect(y,v,b,C,a,de),C.side=It):w.renderBufferDirect(y,v,b,C,a,de),a.onAfterRender(w,v,y,b,C,de)}function Sn(a,v,y){v.isScene!==!0&&(v=_t);const b=U.get(a),C=m.state.lights,de=m.state.shadowsArray,he=C.state.version,fe=re.getParameters(a,C.state,de,v,y,m.state.lightProbeGridArray),_e=re.getProgramCacheKey(fe);let Se=b.programs;b.environment=a.isMeshStandardMaterial||a.isMeshLambertMaterial||a.isMeshPhongMaterial?v.environment:null,b.fog=v.fog;const Le=a.isMeshStandardMaterial||a.isMeshLambertMaterial&&!a.envMap||a.isMeshPhongMaterial&&!a.envMap;b.envMap=te.get(a.envMap||b.environment,Le),b.envMapRotation=b.environment!==null&&a.envMap===null?v.environmentRotation:a.envMapRotation,Se===void 0&&(a.addEventListener("dispose",bt),Se=new Map,b.programs=Se);let we=Se.get(_e);if(we!==void 0){if(b.currentProgram===we&&b.lightsStateVersion===he)return pr(a,fe),we}else fe.uniforms=re.getUniforms(a),G!==null&&a.isNodeMaterial&&G.build(a,y,fe),a.onBeforeCompile(fe,w),we=re.acquireProgram(fe,_e),Se.set(_e,we),b.uniforms=fe.uniforms;const ge=b.uniforms;return(!a.isShaderMaterial&&!a.isRawShaderMaterial||a.clipping===!0)&&(ge.clippingPlanes=xe.uniform),pr(a,fe),b.needsLights=_o(a),b.lightsStateVersion=he,b.needsLights&&(ge.ambientLightColor.value=C.state.ambient,ge.lightProbe.value=C.state.probe,ge.sunLights.value=C.state.sun,ge.sunLightShadows.value=C.state.sunShadow,ge.directionalLights.value=C.state.directional,ge.directionalLightShadows.value=C.state.directionalShadow,ge.spotLights.value=C.state.spot,ge.spotLightShadows.value=C.state.spotShadow,ge.rectAreaLights.value=C.state.rectArea,ge.ltc_1.value=C.state.rectAreaLTC1,ge.ltc_2.value=C.state.rectAreaLTC2,ge.pointLights.value=C.state.point,ge.pointLightShadows.value=C.state.pointShadow,ge.hemisphereLights.value=C.state.hemi,ge.sunShadowMatrix.value=C.state.sunShadowMatrix,ge.sunShadowCascade.value=C.state.sunShadowCascade,ge.directionalShadowMatrix.value=C.state.directionalShadowMatrix,ge.spotLightMatrix.value=C.state.spotLightMatrix,ge.spotLightMap.value=C.state.spotLightMap,ge.pointShadowMatrix.value=C.state.pointShadowMatrix),b.lightProbeGrid=m.state.lightProbeGridArray.length>0,b.currentProgram=we,b.uniformsList=null,we}function ur(a){if(a.uniformsList===null){const v=a.currentProgram.getUniforms();a.uniformsList=Bn.seqWithValue(v.seq,a.uniforms)}return a.uniformsList}function pr(a,v){const y=U.get(a);y.outputColorSpace=v.outputColorSpace,y.batching=v.batching,y.batchingColor=v.batchingColor,y.instancing=v.instancing,y.instancingColor=v.instancingColor,y.instancingMorph=v.instancingMorph,y.skinning=v.skinning,y.morphTargets=v.morphTargets,y.morphNormals=v.morphNormals,y.morphColors=v.morphColors,y.morphTargetsCount=v.morphTargetsCount,y.numClippingPlanes=v.numClippingPlanes,y.numIntersection=v.numClipIntersection,y.vertexAlphas=v.vertexAlphas,y.vertexTangents=v.vertexTangents,y.toneMapping=v.toneMapping}function po(a,v){if(a.length===0)return null;if(a.length===1)return a[0].texture!==null?a[0]:null;h.setFromMatrixPosition(v.matrixWorld);for(let y=0,b=a.length;y<b;y++){const C=a[y];if(C.texture!==null&&C.boundingBox.containsPoint(h))return C}return null}function ho(a,v,y,b,C){v.isScene!==!0&&(v=_t),O.resetTextureUnits();const de=v.fog,he=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?v.environment:null,fe=ne===null?w.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:tt.workingColorSpace,_e=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap,Se=te.get(b.envMap||he,_e),Le=b.vertexColors===!0&&!!y.attributes.color&&y.attributes.color.itemSize===4,we=!!y.attributes.tangent&&(!!b.normalMap||b.anisotropy>0),ge=!!y.morphAttributes.position,He=!!y.morphAttributes.normal,ot=!!y.morphAttributes.color;let Je=At;b.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Je=w.toneMapping);const Ke=y.morphAttributes.position||y.morphAttributes.normal||y.morphAttributes.color,ut=Ke!==void 0?Ke.length:0,pe=U.get(b),pt=m.state.lights;if(Be===!0&&(qe===!0||a!==j)){const $e=a===j&&b.id===Z;xe.setState(b,a,$e)}let Oe=!1;b.version===pe.__version?(pe.needsLights&&pe.lightsStateVersion!==pt.state.version||pe.outputColorSpace!==fe||C.isBatchedMesh&&pe.batching===!1||!C.isBatchedMesh&&pe.batching===!0||C.isBatchedMesh&&pe.batchingColor===!0&&C._colorsTexture===null||C.isBatchedMesh&&pe.batchingColor===!1&&C._colorsTexture!==null||C.isInstancedMesh&&pe.instancing===!1||!C.isInstancedMesh&&pe.instancing===!0||C.isSkinnedMesh&&pe.skinning===!1||!C.isSkinnedMesh&&pe.skinning===!0||C.isInstancedMesh&&pe.instancingColor===!0&&C.instanceColor===null||C.isInstancedMesh&&pe.instancingColor===!1&&C.instanceColor!==null||C.isInstancedMesh&&pe.instancingMorph===!0&&C.morphTexture===null||C.isInstancedMesh&&pe.instancingMorph===!1&&C.morphTexture!==null||pe.envMap!==Se||b.fog===!0&&pe.fog!==de||pe.numClippingPlanes!==void 0&&(pe.numClippingPlanes!==xe.numPlanes||pe.numIntersection!==xe.numIntersection)||pe.vertexAlphas!==Le||pe.vertexTangents!==we||pe.morphTargets!==ge||pe.morphNormals!==He||pe.morphColors!==ot||pe.toneMapping!==Je||pe.morphTargetsCount!==ut||!!pe.lightProbeGrid!=m.state.lightProbeGridArray.length>0)&&(Oe=!0):(Oe=!0,pe.__version=b.version);let Et=pe.currentProgram;Oe===!0&&(Et=Sn(b,v,C),G&&b.isNodeMaterial&&G.onUpdateProgram(b,Et,pe));let Ct=!1,Ft=!1,$t=!1;const Xe=Et.getUniforms(),rt=pe.uniforms;if(r.useProgram(Et.program)&&(Ct=!0,Ft=!0,$t=!0),b.id!==Z&&(Z=b.id,Ft=!0),pe.needsLights){const $e=po(m.state.lightProbeGridArray,C);pe.lightProbeGrid!==$e&&(pe.lightProbeGrid=$e,Ft=!0)}if(Ct||j!==a){r.buffers.depth.getReversed()&&a.reversedDepth!==!0&&(a._reversedDepth=!0,a.updateProjectionMatrix()),Xe.setValue(M,"projectionMatrix",a.projectionMatrix),Xe.setValue(M,"viewMatrix",a.matrixWorldInverse);const Bt=Xe.map.cameraPosition;Bt!==void 0&&Bt.setValue(M,et.setFromMatrixPosition(a.matrixWorld)),u.logarithmicDepthBuffer&&Xe.setValue(M,"logDepthBufFC",2/(Math.log(a.far+1)/Math.LN2)),(b.isMeshPhongMaterial||b.isMeshToonMaterial||b.isMeshLambertMaterial||b.isMeshBasicMaterial||b.isMeshStandardMaterial||b.isShaderMaterial)&&Xe.setValue(M,"isOrthographic",a.isOrthographicCamera===!0),j!==a&&(j=a,Ft=!0,$t=!0)}if(pe.needsLights&&(pt.state.sunShadowMap.length>0&&Xe.setValue(M,"sunShadowMap",pt.state.sunShadowMap,O),pt.state.directionalShadowMap.length>0&&Xe.setValue(M,"directionalShadowMap",pt.state.directionalShadowMap,O),pt.state.spotShadowMap.length>0&&Xe.setValue(M,"spotShadowMap",pt.state.spotShadowMap,O),pt.state.pointShadowMap.length>0&&Xe.setValue(M,"pointShadowMap",pt.state.pointShadowMap,O)),C.isSkinnedMesh){Xe.setOptional(M,C,"bindMatrix"),Xe.setOptional(M,C,"bindMatrixInverse");const $e=C.skeleton;$e&&($e.boneTexture===null&&$e.computeBoneTexture(),Xe.setValue(M,"boneTexture",$e.boneTexture,O))}C.isBatchedMesh&&(Xe.setOptional(M,C,"batchingTexture"),Xe.setValue(M,"batchingTexture",C._matricesTexture,O),Xe.setOptional(M,C,"batchingIdTexture"),Xe.setValue(M,"batchingIdTexture",C._indirectTexture,O),Xe.setOptional(M,C,"batchingColorTexture"),C._colorsTexture!==null&&Xe.setValue(M,"batchingColorTexture",C._colorsTexture,O));const Ot=y.morphAttributes;if((Ot.position!==void 0||Ot.normal!==void 0||Ot.color!==void 0)&&E.update(C,y,Et),(Ft||pe.receiveShadow!==C.receiveShadow)&&(pe.receiveShadow=C.receiveShadow,Xe.setValue(M,"receiveShadow",C.receiveShadow)),(b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial)&&b.envMap===null&&v.environment!==null&&(rt.envMapIntensity.value=v.environmentIntensity),rt.dfgLUT!==void 0&&(rt.dfgLUT.value=_d()),Ft){if(Xe.setValue(M,"toneMappingExposure",w.toneMappingExposure),pe.needsLights&&mo(rt,$t),de&&b.fog===!0&&Me.refreshFogUniforms(rt,de),Me.refreshMaterialUniforms(rt,b,$,V,m.state.transmissionRenderTarget[a.id]),pe.needsLights&&pe.lightProbeGrid){const $e=pe.lightProbeGrid;rt.probesSH.value=$e.texture,rt.probesMin.value.copy($e.boundingBox.min),rt.probesMax.value.copy($e.boundingBox.max),rt.probesResolution.value.copy($e.resolution)}Bn.upload(M,ur(pe),rt,O)}if(b.isShaderMaterial&&b.uniformsNeedUpdate===!0&&(Bn.upload(M,ur(pe),rt,O),b.uniformsNeedUpdate=!1),b.isSpriteMaterial&&Xe.setValue(M,"center",C.center),Xe.setValue(M,"modelViewMatrix",C.modelViewMatrix),Xe.setValue(M,"normalMatrix",C.normalMatrix),Xe.setValue(M,"modelMatrix",C.matrixWorld),b.uniformsGroups!==void 0){const $e=b.uniformsGroups;for(let Bt=0,Qt=$e.length;Bt<Qt;Bt++){const mr=$e[Bt];J.update(mr,Et),J.bind(mr,Et)}}return Et}function mo(a,v){a.ambientLightColor.needsUpdate=v,a.lightProbe.needsUpdate=v,a.sunLights.needsUpdate=v,a.sunLightShadows.needsUpdate=v,a.directionalLights.needsUpdate=v,a.directionalLightShadows.needsUpdate=v,a.pointLights.needsUpdate=v,a.pointLightShadows.needsUpdate=v,a.spotLights.needsUpdate=v,a.spotLightShadows.needsUpdate=v,a.rectAreaLights.needsUpdate=v,a.hemisphereLights.needsUpdate=v}function _o(a){return a.isMeshLambertMaterial||a.isMeshToonMaterial||a.isMeshPhongMaterial||a.isMeshStandardMaterial||a.isShadowMaterial||a.isShaderMaterial&&a.lights===!0}this.getActiveCubeFace=function(){return Q},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(a,v,y){const b=U.get(a);b.__autoAllocateDepthBuffer=a.resolveDepthBuffer===!1,b.__autoAllocateDepthBuffer===!1&&(b.__useRenderToTexture=!1),U.get(a.texture).__webglTexture=v,U.get(a.depthTexture).__webglTexture=b.__autoAllocateDepthBuffer?void 0:y,b.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(a,v){const y=U.get(a);y.__webglFramebuffer=v,y.__useDefaultFramebuffer=v===void 0},this.setRenderTarget=function(a,v=0,y=0){ne=a,Q=v,Y=y;let b=null,C=!1,de=!1;if(a){const fe=U.get(a);if(fe.__useDefaultFramebuffer!==void 0){r.bindFramebuffer(M.FRAMEBUFFER,fe.__webglFramebuffer),ee.copy(a.viewport),be.copy(a.scissor),Re=a.scissorTest,r.viewport(ee),r.scissor(be),r.setScissorTest(Re),Z=-1;return}else if(fe.__webglFramebuffer===void 0)O.setupRenderTarget(a);else if(fe.__hasExternalTextures)O.rebindTextures(a,U.get(a.texture).__webglTexture,U.get(a.depthTexture).__webglTexture);else if(a.depthBuffer){const Le=a.depthTexture;if(fe.__boundDepthTexture!==Le){if(Le!==null&&U.has(Le)&&(a.width!==Le.image.width||a.height!==Le.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");O.setupDepthRenderbuffer(a)}}const _e=a.texture;(_e.isData3DTexture||_e.isDataArrayTexture||_e.isCompressedArrayTexture)&&(de=!0);const Se=U.get(a).__webglFramebuffer;a.isWebGLCubeRenderTarget?(Array.isArray(Se[v])?b=Se[v][y]:b=Se[v],C=!0):a.samples>0&&O.useMultisampledRTT(a)===!1?b=U.get(a).__webglMultisampledFramebuffer:Array.isArray(Se)?b=Se[y]:b=Se,ee.copy(a.viewport),be.copy(a.scissor),Re=a.scissorTest}else ee.copy(me).multiplyScalar($).floor(),be.copy(Fe).multiplyScalar($).floor(),Re=st;if(y!==0&&(b=q),r.bindFramebuffer(M.FRAMEBUFFER,b)&&r.drawBuffers(a,b),r.viewport(ee),r.scissor(be),r.setScissorTest(Re),C){const fe=U.get(a.texture);M.framebufferTexture2D(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_CUBE_MAP_POSITIVE_X+v,fe.__webglTexture,y)}else if(de){const fe=v;for(let _e=0;_e<a.textures.length;_e++){const Se=U.get(a.textures[_e]);M.framebufferTextureLayer(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0+_e,Se.__webglTexture,y,fe)}}else if(a!==null&&y!==0){const fe=U.get(a.texture);M.framebufferTexture2D(M.FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_2D,fe.__webglTexture,y)}Z=-1};function hr(a){const v=U.get(a);return(v.__readFormat!==a.format||v.__readType!==a.type)&&(v.__readFormat=a.format,v.__readType=a.type,v.__formatReadable=u.textureFormatReadable(a.format),v.__typeReadable=u.textureTypeReadable(a.type)),v}this.readRenderTargetPixels=function(a,v,y,b,C,de,he,fe=0){if(!(a&&a.isWebGLRenderTarget)){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=U.get(a).__webglFramebuffer;if(a.isWebGLCubeRenderTarget&&he!==void 0&&(_e=_e[he]),_e){r.bindFramebuffer(M.FRAMEBUFFER,_e);try{const Se=a.textures[fe],Le=Se.format,we=Se.type;a.textures.length>1&&M.readBuffer(M.COLOR_ATTACHMENT0+fe);const ge=hr(Se);if(ge.__formatReadable===!1){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ge.__typeReadable===!1){Qe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}v>=0&&v<=a.width-b&&y>=0&&y<=a.height-C&&M.readPixels(v,y,b,C,se.convert(Le),se.convert(we),de)}finally{const Se=ne!==null?U.get(ne).__webglFramebuffer:null;r.bindFramebuffer(M.FRAMEBUFFER,Se)}}},this.readRenderTargetPixelsAsync=async function(a,v,y,b,C,de,he,fe=0){if(!(a&&a.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=U.get(a).__webglFramebuffer;if(a.isWebGLCubeRenderTarget&&he!==void 0&&(_e=_e[he]),_e)if(v>=0&&v<=a.width-b&&y>=0&&y<=a.height-C){r.bindFramebuffer(M.FRAMEBUFFER,_e);const Se=a.textures[fe],Le=Se.format,we=Se.type;a.textures.length>1&&M.readBuffer(M.COLOR_ATTACHMENT0+fe);const ge=hr(Se);if(ge.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ge.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const He=M.createBuffer();M.bindBuffer(M.PIXEL_PACK_BUFFER,He),M.bufferData(M.PIXEL_PACK_BUFFER,de.byteLength,M.STREAM_READ),M.readPixels(v,y,b,C,se.convert(Le),se.convert(we),0),M.bindBuffer(M.PIXEL_PACK_BUFFER,null);const ot=ne!==null?U.get(ne).__webglFramebuffer:null;r.bindFramebuffer(M.FRAMEBUFFER,ot);const Je=M.fenceSync(M.SYNC_GPU_COMMANDS_COMPLETE,0);return M.flush(),await Eo(M,Je,4),M.bindBuffer(M.PIXEL_PACK_BUFFER,He),M.getBufferSubData(M.PIXEL_PACK_BUFFER,0,de),M.bindBuffer(M.PIXEL_PACK_BUFFER,null),M.deleteBuffer(He),M.deleteSync(Je),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(a,v=null,y=0){const b=Math.pow(2,-y),C=Math.floor(a.image.width*b),de=Math.floor(a.image.height*b),he=v!==null?v.x:0,fe=v!==null?v.y:0;O.setTexture2D(a,0),M.copyTexSubImage2D(M.TEXTURE_2D,y,0,0,he,fe,C,de),r.unbindTexture()},this.copyTextureToTexture=function(a,v,y=null,b=null,C=0,de=0){let he,fe,_e,Se,Le,we,ge,He,ot;const Je=a.isCompressedTexture?a.mipmaps[de]:a.image;if(y!==null)he=y.max.x-y.min.x,fe=y.max.y-y.min.y,_e=y.isBox3?y.max.z-y.min.z:1,Se=y.min.x,Le=y.min.y,we=y.isBox3?y.min.z:0;else{const rt=Math.pow(2,-C);he=Math.floor(Je.width*rt),fe=Math.floor(Je.height*rt),a.isDataArrayTexture?_e=Je.depth:a.isData3DTexture?_e=Math.floor(Je.depth*rt):_e=1,Se=0,Le=0,we=0}b!==null?(ge=b.x,He=b.y,ot=b.z):(ge=0,He=0,ot=0);const Ke=se.convert(v.format),ut=se.convert(v.type);let pe;v.isData3DTexture?(O.setTexture3D(v,0),pe=M.TEXTURE_3D):v.isDataArrayTexture||v.isCompressedArrayTexture?(O.setTexture2DArray(v,0),pe=M.TEXTURE_2D_ARRAY):(O.setTexture2D(v,0),pe=M.TEXTURE_2D),r.activeTexture(M.TEXTURE0),r.pixelStorei(M.UNPACK_FLIP_Y_WEBGL,v.flipY),r.pixelStorei(M.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),r.pixelStorei(M.UNPACK_ALIGNMENT,v.unpackAlignment);const pt=r.getParameter(M.UNPACK_ROW_LENGTH),Oe=r.getParameter(M.UNPACK_IMAGE_HEIGHT),Et=r.getParameter(M.UNPACK_SKIP_PIXELS),Ct=r.getParameter(M.UNPACK_SKIP_ROWS),Ft=r.getParameter(M.UNPACK_SKIP_IMAGES);r.pixelStorei(M.UNPACK_ROW_LENGTH,Je.width),r.pixelStorei(M.UNPACK_IMAGE_HEIGHT,Je.height),r.pixelStorei(M.UNPACK_SKIP_PIXELS,Se),r.pixelStorei(M.UNPACK_SKIP_ROWS,Le),r.pixelStorei(M.UNPACK_SKIP_IMAGES,we);const $t=a.isDataArrayTexture||a.isData3DTexture,Xe=v.isDataArrayTexture||v.isData3DTexture;if(a.isDepthTexture){const rt=U.get(a),Ot=U.get(v),$e=U.get(rt.__renderTarget),Bt=U.get(Ot.__renderTarget);r.bindFramebuffer(M.READ_FRAMEBUFFER,$e.__webglFramebuffer),r.bindFramebuffer(M.DRAW_FRAMEBUFFER,Bt.__webglFramebuffer);for(let Qt=0;Qt<_e;Qt++)$t&&(M.framebufferTextureLayer(M.READ_FRAMEBUFFER,M.COLOR_ATTACHMENT0,U.get(a).__webglTexture,C,we+Qt),M.framebufferTextureLayer(M.DRAW_FRAMEBUFFER,M.COLOR_ATTACHMENT0,U.get(v).__webglTexture,de,ot+Qt)),M.blitFramebuffer(Se,Le,he,fe,ge,He,he,fe,M.DEPTH_BUFFER_BIT,M.NEAREST);r.bindFramebuffer(M.READ_FRAMEBUFFER,null),r.bindFramebuffer(M.DRAW_FRAMEBUFFER,null)}else if(C!==0||a.isRenderTargetTexture||U.has(a)){const rt=U.get(a),Ot=U.get(v);r.bindFramebuffer(M.READ_FRAMEBUFFER,P),r.bindFramebuffer(M.DRAW_FRAMEBUFFER,K);for(let $e=0;$e<_e;$e++)$t?M.framebufferTextureLayer(M.READ_FRAMEBUFFER,M.COLOR_ATTACHMENT0,rt.__webglTexture,C,we+$e):M.framebufferTexture2D(M.READ_FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_2D,rt.__webglTexture,C),Xe?M.framebufferTextureLayer(M.DRAW_FRAMEBUFFER,M.COLOR_ATTACHMENT0,Ot.__webglTexture,de,ot+$e):M.framebufferTexture2D(M.DRAW_FRAMEBUFFER,M.COLOR_ATTACHMENT0,M.TEXTURE_2D,Ot.__webglTexture,de),C!==0?M.blitFramebuffer(Se,Le,he,fe,ge,He,he,fe,M.COLOR_BUFFER_BIT,M.NEAREST):Xe?M.copyTexSubImage3D(pe,de,ge,He,ot+$e,Se,Le,he,fe):M.copyTexSubImage2D(pe,de,ge,He,Se,Le,he,fe);r.bindFramebuffer(M.READ_FRAMEBUFFER,null),r.bindFramebuffer(M.DRAW_FRAMEBUFFER,null)}else Xe?a.isDataTexture||a.isData3DTexture?M.texSubImage3D(pe,de,ge,He,ot,he,fe,_e,Ke,ut,Je.data):v.isCompressedArrayTexture?M.compressedTexSubImage3D(pe,de,ge,He,ot,he,fe,_e,Ke,Je.data):M.texSubImage3D(pe,de,ge,He,ot,he,fe,_e,Ke,ut,Je):a.isDataTexture?M.texSubImage2D(M.TEXTURE_2D,de,ge,He,he,fe,Ke,ut,Je.data):a.isCompressedTexture?M.compressedTexSubImage2D(M.TEXTURE_2D,de,ge,He,Je.width,Je.height,Ke,Je.data):M.texSubImage2D(M.TEXTURE_2D,de,ge,He,he,fe,Ke,ut,Je);r.pixelStorei(M.UNPACK_ROW_LENGTH,pt),r.pixelStorei(M.UNPACK_IMAGE_HEIGHT,Oe),r.pixelStorei(M.UNPACK_SKIP_PIXELS,Et),r.pixelStorei(M.UNPACK_SKIP_ROWS,Ct),r.pixelStorei(M.UNPACK_SKIP_IMAGES,Ft),de===0&&v.generateMipmaps&&M.generateMipmap(pe),r.unbindTexture()},this.initRenderTarget=function(a){U.get(a).__webglFramebuffer===void 0&&O.setupRenderTarget(a)},this.initTexture=function(a){a.isCubeTexture?O.setTextureCube(a,0):a.isData3DTexture?O.setTexture3D(a,0):a.isDataArrayTexture||a.isCompressedArrayTexture?O.setTexture2DArray(a,0):O.setTexture2D(a,0),r.unbindTexture()},this.resetState=function(){Q=0,Y=0,ne=null,r.reset(),ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Zi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n;const t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(n),t.unpackColorSpace=tt._getUnpackColorSpace()}}export{jn as ACESFilmicToneMapping,tn as AddEquation,br as AddOperation,Md as AdditiveAnimationBlendMode,di as AdditiveBlending,Jn as AgXToneMapping,Ra as AlphaFormat,va as AlwaysCompare,ra as AlwaysDepth,xd as AlwaysStencilFunc,Td as AmbientLight,Ad as AnimationAction,Rd as AnimationClip,bd as AnimationLoader,Cd as AnimationMixer,Pd as AnimationObjectGroup,Ld as AnimationUtils,Ud as ArcCurve,La as ArrayCamera,Dd as ArrowHelper,wd as AttachedBindMode,Id as Audio,Nd as AudioAnalyser,yd as AudioContext,Fd as AudioListener,Od as AudioLoader,Bd as AxesHelper,vt as BackSide,Gd as BasicDepthPacking,Hd as BasicShadowMap,Vd as BatchedMesh,Wd as BezierInterpolant,kd as Bone,zd as BooleanKeyframeTrack,Xd as Box2,Kd as Box3,Yd as Box3Helper,En as BoxGeometry,qd as BoxHelper,Mn as BufferAttribute,ln as BufferGeometry,Zd as BufferGeometryLoader,Ta as ByteType,$d as Cache,Qd as Camera,Jd as CameraHelper,jd as CanvasTexture,eu as CapsuleGeometry,tu as CatmullRomCurve3,ei as CineonToneMapping,nu as CircleGeometry,Pn as ClampToEdgeWrapping,iu as Clock,je as Color,ru as ColorKeyframeTrack,tt as ColorManagement,au as Compatibility,ou as CompressedArrayTexture,su as CompressedCubeTexture,lu as CompressedTexture,cu as CompressedTextureLoader,fu as ConeGeometry,Gr as ConstantAlphaFactor,Vr as ConstantColorFactor,du as Controls,Sr as CubeCamera,yr as CubeDepthTexture,jt as CubeReflectionMapping,kt as CubeRefractionMapping,Yn as CubeTexture,uu as CubeTextureLoader,sn as CubeUVReflectionMapping,pu as CubicBezierCurve,hu as CubicBezierCurve3,mu as CubicInterpolant,li as CullFaceBack,sa as CullFaceFront,_u as CullFaceFrontBack,oa as CullFaceNone,gu as Curve,vu as CurvePath,la as CustomBlending,$n as CustomToneMapping,Su as CylinderGeometry,Eu as Cylindrical,Ar as Data3DTexture,qn as DataArrayTexture,Ua as DataTexture,Mu as DataTextureLoader,xu as DataUtils,Tu as DecrementStencilOp,Au as DecrementWrapStencilOp,Ru as DefaultLoadingManager,Kt as DepthFormat,qt as DepthStencilFormat,fn as DepthTexture,bu as DetachedBindMode,Cu as DirectionalLight,Pu as DirectionalLightHelper,Lu as DiscreteInterpolant,Uu as DodecahedronGeometry,It as DoubleSide,Kr as DstAlphaFactor,Yr as DstColorFactor,Du as DynamicCopyUsage,wu as DynamicDrawUsage,Iu as DynamicReadUsage,Nu as EdgesGeometry,yu as EllipseCurve,_a as EqualCompare,na as EqualDepth,Fu as EqualStencilFunc,xn as EquirectangularReflectionMapping,Tn as EquirectangularRefractionMapping,Ou as Euler,Pa as EventDispatcher,Yi as ExternalTexture,Bu as ExtrudeGeometry,Gu as FileLoader,Hu as Float16BufferAttribute,Zn as Float32BufferAttribute,yt as FloatType,Vu as Fog,Wu as FogExp2,ku as FramebufferTexture,Jt as FrontSide,oi as Frustum,zu as FrustumArray,Xu as GLBufferAttribute,Ku as GLSL1,ii as GLSL3,ma as GreaterCompare,ea as GreaterDepth,An as GreaterEqualCompare,ta as GreaterEqualDepth,Yu as GreaterEqualStencilFunc,qu as GreaterStencilFunc,Zu as GridHelper,$u as Group,Qu as HTMLTexture,Ut as HalfFloatType,Ju as HemisphereLight,ju as HemisphereLightHelper,ep as IcosahedronGeometry,tp as ImageBitmapLoader,np as ImageLoader,ip as ImageUtils,rp as IncrementStencilOp,ap as IncrementWrapStencilOp,op as InstancedBufferAttribute,sp as InstancedBufferGeometry,lp as InstancedInterleavedBuffer,cp as InstancedMesh,fp as Int16BufferAttribute,dp as Int32BufferAttribute,up as Int8BufferAttribute,zn as IntType,pp as InterleavedBuffer,hp as InterleavedBufferAttribute,mp as Interpolant,_p as InterpolateBezier,gp as InterpolateDiscrete,vp as InterpolateLinear,Sp as InterpolateSmooth,Ep as InterpolationSamplingMode,Mp as InterpolationSamplingType,xp as InvertStencilOp,Tp as KeepStencilOp,Ap as KeyframeTrack,Rp as LOD,bp as LatheGeometry,Dr as Layers,ga as LessCompare,ia as LessDepth,Rn as LessEqualCompare,si as LessEqualDepth,Cp as LessEqualStencilFunc,Pp as LessStencilFunc,Lp as Light,Up as LightProbe,Dp as LightShadow,wp as Line,Ip as Line3,Np as LineBasicMaterial,yp as LineCurve,Fp as LineCurve3,Op as LineDashedMaterial,Bp as LineLoop,Gp as LineSegments,St as LinearFilter,Hp as LinearInterpolant,Vp as LinearMipMapLinearFilter,Wp as LinearMipMapNearestFilter,zt as LinearMipmapLinearFilter,Ln as LinearMipmapNearestFilter,Kn as LinearSRGBColorSpace,ni as LinearToneMapping,ri as LinearTransfer,kp as Loader,zp as LoaderUtils,Xp as LoadingManager,Kp as LoopOnce,Yp as LoopPingPong,qp as LoopRepeat,Zp as MOUSE,$p as Material,Qp as MaterialBlending,Jp as MaterialLoader,jp as MathUtils,eh as Matrix2,ye as Matrix3,Wt as Matrix4,fa as MaxEquation,Pt as Mesh,vr as MeshBasicMaterial,wr as MeshDepthMaterial,Ir as MeshDistanceMaterial,th as MeshLambertMaterial,nh as MeshMatcapMaterial,ih as MeshNormalMaterial,rh as MeshPhongMaterial,ah as MeshPhysicalMaterial,oh as MeshStandardMaterial,sh as MeshToonMaterial,ca as MinEquation,da as MirroredRepeatWrapping,Cr as MixOperation,ci as MultiplyBlending,Pr as MultiplyOperation,Gt as NearestFilter,lh as NearestMipMapLinearFilter,ch as NearestMipMapNearestFilter,pn as NearestMipmapLinearFilter,pa as NearestMipmapNearestFilter,Qn as NeutralToneMapping,Sa as NeverCompare,aa as NeverDepth,fh as NeverStencilFunc,wt as NoBlending,Yt as NoColorSpace,dh as NoNormalPacking,At as NoToneMapping,uh as NormalAnimationBlendMode,un as NormalBlending,ph as NormalGAPacking,hh as NormalRGPacking,ha as NotEqualCompare,jr as NotEqualDepth,mh as NotEqualStencilFunc,_h as NumberKeyframeTrack,gh as Object3D,vh as ObjectLoader,Ur as ObjectSpaceNormalMap,Sh as OctahedronGeometry,Qr as OneFactor,Br as OneMinusConstantAlphaFactor,Hr as OneMinusConstantColorFactor,Wr as OneMinusDstAlphaFactor,kr as OneMinusDstColorFactor,zr as OneMinusSrcAlphaFactor,Xr as OneMinusSrcColorFactor,Xn as OrthographicCamera,dn as PCFShadowMap,Nr as PCFSoftShadowMap,er as PMREMGenerator,Eh as Path,cn as PerspectiveCamera,gr as Plane,kn as PlaneGeometry,Mh as PlaneHelper,xh as PointLight,Th as PointLightHelper,Ah as Points,Rh as PointsMaterial,bh as PolarGridHelper,Ch as PolyhedronGeometry,Ph as PositionalAudio,Lh as PropertyBinding,Uh as PropertyMixer,Dh as QuadraticBezierCurve,wh as QuadraticBezierCurve3,Ih as Quaternion,Nh as QuaternionKeyframeTrack,yh as QuaternionLinearInterpolant,Ai as R11_EAC_Format,Cn as RED_GREEN_RGTC2_Format,zi as RED_RGTC1_Format,Ia as REVISION,bn as RG11_EAC_Format,Fh as RGBADepthPacking,Dt as RGBAFormat,_i as RGBAIntegerFormat,Bi as RGBA_ASTC_10x10_Format,yi as RGBA_ASTC_10x5_Format,Fi as RGBA_ASTC_10x6_Format,Oi as RGBA_ASTC_10x8_Format,Gi as RGBA_ASTC_12x10_Format,Hi as RGBA_ASTC_12x12_Format,Ci as RGBA_ASTC_4x4_Format,Pi as RGBA_ASTC_5x4_Format,Li as RGBA_ASTC_5x5_Format,Ui as RGBA_ASTC_6x5_Format,Di as RGBA_ASTC_6x6_Format,wi as RGBA_ASTC_8x5_Format,Ii as RGBA_ASTC_8x6_Format,Ni as RGBA_ASTC_8x8_Format,Vi as RGBA_BPTC_Format,Ti as RGBA_ETC2_EAC_Format,Ei as RGBA_PVRTC_2BPPV1_Format,Si as RGBA_PVRTC_4BPPV1_Format,Dn as RGBA_S3TC_DXT1_Format,wn as RGBA_S3TC_DXT3_Format,In as RGBA_S3TC_DXT5_Format,Oh as RGBDepthPacking,ba as RGBFormat,Bh as RGBIntegerFormat,Wi as RGB_BPTC_SIGNED_Format,ki as RGB_BPTC_UNSIGNED_Format,Mi as RGB_ETC1_Format,xi as RGB_ETC2_Format,vi as RGB_PVRTC_2BPPV1_Format,gi as RGB_PVRTC_4BPPV1_Format,Un as RGB_S3TC_DXT1_Format,Gh as RGDepthPacking,Xt as RGFormat,mi as RGIntegerFormat,Tr as RawShaderMaterial,Hh as Ray,Vh as Raycaster,Wh as RectAreaLight,Ca as RedFormat,hi as RedIntegerFormat,ti as ReinhardToneMapping,kh as RenderObjectRefreshType,zh as RenderTarget,Xh as RenderTarget3D,ua as RepeatWrapping,Kh as ReplaceStencilOp,Fr as ReverseSubtractEquation,Yh as RingGeometry,Ri as SIGNED_R11_EAC_Format,Ki as SIGNED_RED_GREEN_RGTC2_Format,Xi as SIGNED_RED_RGTC1_Format,bi as SIGNED_RG11_EAC_Format,wa as SRGBColorSpace,Ye as SRGBTransfer,qh as Scene,Pe as ShaderChunk,Rt as ShaderLib,Lt as ShaderMaterial,Zh as ShadowMaterial,$h as Shape,Qh as ShapeGeometry,Jh as ShapePath,jh as ShapeUtils,Aa as ShortType,em as Skeleton,tm as SkeletonHelper,nm as SkinnedMesh,im as Source,rm as Sphere,am as SphereGeometry,om as Spherical,sm as SphericalHarmonics3,lm as SplineCurve,cm as SpotLight,fm as SpotLightHelper,dm as Sprite,um as SpriteMaterial,Zr as SrcAlphaFactor,qr as SrcAlphaSaturateFactor,$r as SrcColorFactor,pm as StaticCopyUsage,hm as StaticDrawUsage,mm as StaticReadUsage,_m as StereoCamera,gm as StreamCopyUsage,vm as StreamDrawUsage,Sm as StreamReadUsage,Em as StringKeyframeTrack,Or as SubtractEquation,fi as SubtractiveBlending,Mm as TOUCH,ai as TangentSpaceNormalMap,xm as TetrahedronGeometry,Rr as Texture,Tm as TextureLoader,Am as TextureSource,Rm as TextureUtils,bm as Timer,Cm as TimestampQuery,Pm as TorusGeometry,Lm as TorusKnotGeometry,Um as Triangle,Dm as TriangleFanDrawMode,wm as TriangleStripDrawMode,Im as TrianglesDrawMode,Nm as TubeGeometry,ym as UVMapping,xr as Uint16BufferAttribute,Mr as Uint32BufferAttribute,Fm as Uint8BufferAttribute,Om as Uint8ClampedBufferAttribute,Bm as Uniform,Gm as UniformsGroup,le as UniformsLib,Lr as UniformsUtils,Tt as UnsignedByteType,xa as UnsignedInt101111Type,nn as UnsignedInt248Type,Ma as UnsignedInt5999Type,Ht as UnsignedIntType,ui as UnsignedShort4444Type,pi as UnsignedShort5551Type,hn as UnsignedShortType,en as VSMShadowMap,ht as Vector2,Ne as Vector3,mt as Vector4,Hm as VectorKeyframeTrack,Vm as VideoFrameTexture,Wm as VideoTexture,km as WebGL3DRenderTarget,zm as WebGLArrayRenderTarget,Zi as WebGLCoordinateSystem,tr as WebGLCubeRenderTarget,Mt as WebGLRenderTarget,gd as WebGLRenderer,so as WebGLUtils,Xm as WebGPUCoordinateSystem,Nn as WebXRController,Km as WireframeGeometry,Ym as WrapAroundEnding,qm as ZeroCurvatureEnding,Jr as ZeroFactor,Zm as ZeroSlopeEnding,$m as ZeroStencilOp,Da as createCanvasElement,Qe as error,Qm as getConsoleFunction,qi as log,Jm as setConsoleFunction,Ve as warn,Er as warnOnce};
