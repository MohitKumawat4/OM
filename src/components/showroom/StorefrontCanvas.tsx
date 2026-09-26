'use client';
/* eslint-disable react-hooks/immutability -- Three.js materials, camera and shared frame state are intentionally mutable renderer objects. */
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { storefrontConfig as config } from '@/config/site';
import { createCameraSampler, smooth } from '@/lib/showroom/timeline';
import { drawingRatio, needsSceneFrame, type Quality } from '@/lib/showroom/performance';

export interface StorefrontState { progress:number; visible:boolean; ready:boolean; quality:Quality; pointer:{x:number;y:number} }
const decoder=new DRACOLoader().setDecoderPath(config.decoder).setWorkerLimit(1);
export function clearStorefrontCache(){useLoader.clear(GLTFLoader,config.model);}

function Model(){
  const source=useLoader(GLTFLoader,config.model,loader=>loader.setDRACOLoader(decoder));
  const model=useMemo(()=>{
    const scene=source.scene.clone(true);
    scene.traverse(object=>{
      if(!(object instanceof THREE.Mesh))return;
      object.castShadow=false;
      object.receiveShadow=false;
      const originals=Array.isArray(object.material)?object.material:[object.material];
      const materials=originals.map(original=>{
        const material=original.clone() as THREE.MeshPhysicalMaterial;
        material.envMapIntensity=.3;
        if(material.name==='Brushed champagne bronze'){
          material.emissive.copy(material.color);
          material.emissiveIntensity=.12;
        }
        // The light atlas supplies diffuse light. Keep only restrained physical
        // specular response on top, without any realtime shadow-map passes.
        if(material.userData.bakedDiffuse)material.envMapIntensity=.12;
        if(material.transmission>0){
          material.transmission=0;
          material.transparent=true;
          material.opacity=.085;
          material.depthWrite=false;
          material.roughness=.12;
          material.envMapIntensity=.15;
        }
        return material;
      });
      object.material=Array.isArray(object.material)?materials:materials[0];
    });
    return scene;
  },[source]);
  useEffect(()=>()=>model.traverse(object=>{if(object instanceof THREE.Mesh){const materials=Array.isArray(object.material)?object.material:[object.material];materials.forEach(material=>material.dispose());}}),[model]);
  return <primitive object={model} dispose={null}/>;
}

function Director({state,onReady,onFailure,onCapture}:{state:React.RefObject<StorefrontState>;onReady:()=>void;onFailure:()=>void;onCapture?:(dataUrl:string)=>Promise<void>|void}){
  const {camera,gl,scene,size,invalidate}=useThree();
  const sample=useMemo(()=>createCameraSampler(config.camera),[]);
  const target=useMemo(()=>new THREE.Vector3(),[]);
  const pointer=useRef({x:0,y:0}),captured=useRef(false);
  const progress=useRef(-1),portrait=useRef(-1),warmup=useRef(0),slow=useRef(0);

  useEffect(()=>{
    const generator=new THREE.PMREMGenerator(gl),room=new RoomEnvironment();
    const env=generator.fromScene(room,.04);
    scene.environment=env.texture;
    scene.environmentIntensity=.4;
    room.dispose();
    generator.dispose();
    return()=>{scene.environment=null;env.dispose();};
  },[gl,scene]);

  // Non-blocking background shader pre-warm (never blocks initial render)
  useEffect(()=>{
    let cancelled=false;
    const warmUp=async()=>{
      try{
        if('compileAsync' in gl){
          await gl.compileAsync(scene,camera);
        }
      }catch{
        // Safe to ignore; Three.js native pipeline compiles on first draw call
      }
      if(!cancelled)invalidate();
    };
    void warmUp();
    return()=>{cancelled=true;};
  },[gl,scene,camera,invalidate]);

  // Resilient WebGL context loss recovery and tab wake
  useEffect(()=>{
    const wake=()=>{if(!document.hidden)invalidate();};
    let restoreTimeout:NodeJS.Timeout|null=null;
    const onContextLost=(event:Event)=>{
      event.preventDefault();
      // Allow WebGL context to attempt restoration. If not restored within 2.5s, fall back to still poster.
      restoreTimeout=setTimeout(()=>{
        onFailure();
      },2500);
    };
    const onContextRestored=()=>{
      if(restoreTimeout){clearTimeout(restoreTimeout);restoreTimeout=null;}
      invalidate();
    };
    window.addEventListener('storefront-change',wake);
    window.addEventListener('focus',wake);
    document.addEventListener('visibilitychange',wake);
    const canvasEl=gl.domElement;
    canvasEl.addEventListener('webglcontextlost',onContextLost);
    canvasEl.addEventListener('webglcontextrestored',onContextRestored);
    return()=>{
      if(restoreTimeout)clearTimeout(restoreTimeout);
      window.removeEventListener('storefront-change',wake);
      window.removeEventListener('focus',wake);
      document.removeEventListener('visibilitychange',wake);
      canvasEl.removeEventListener('webglcontextlost',onContextLost);
      canvasEl.removeEventListener('webglcontextrestored',onContextRestored);
    };
  },[gl,invalidate,onFailure]);

  useEffect(()=>{
    gl.setPixelRatio(drawingRatio(size.width,size.height,window.devicePixelRatio,state.current.quality));
    invalidate();
  },[gl,invalidate,size.width,size.height,state]);

  useFrame((_,delta)=>{
    if(document.hidden){warmup.current=0;return;}

    // Clamp delta to prevent erratic jumps after returning from a background tab (e.g. YouTube)
    const safeDelta=Math.min(Math.max(0,delta),0.05);

    const rawDesired=state.current.progress;
    const desired=Number.isFinite(rawDesired)?THREE.MathUtils.clamp(rawDesired,0,1):0;
    const isInitialFrame=progress.current<0||!Number.isFinite(progress.current);

    if(isInitialFrame){
      progress.current=desired;
      pointer.current.x=Number.isFinite(state.current.pointer.x)?state.current.pointer.x:0;
      pointer.current.y=Number.isFinite(state.current.pointer.y)?state.current.pointer.y:0;
    }

    const moving=needsSceneFrame(true,false,progress.current,desired);
    if(isInitialFrame){
      progress.current=desired;
    }else{
      progress.current+=(desired-progress.current)*(1-Math.exp(-safeDelta*13));
      if(!moving)progress.current=desired;
    }

    sample(progress.current,camera.position,target);

    // Guard width and height against 0 or NaN on tab restoration
    const width=size.width>0?size.width:(typeof window!=='undefined'?window.innerWidth:1440);
    const height=size.height>0?size.height:(typeof window!=='undefined'?window.innerHeight:900);
    const aspect=width/height;
    const nextPortrait=Number.isFinite(aspect)?THREE.MathUtils.clamp((1.15-aspect)/.7,0,1):0;

    if(portrait.current<0||!Number.isFinite(portrait.current))portrait.current=nextPortrait;
    else portrait.current+=(nextPortrait-portrait.current)*(1-Math.exp(-safeDelta*12));

    const close=1-Math.abs(progress.current-.5)*2;
    camera.position.z+=portrait.current*(11+4*smooth(close));
    target.y-=portrait.current*2.3;

    // Dynamically adapt vertical FOV and target framing for shorter displays
    const heightCompression=Number.isFinite(height)?THREE.MathUtils.clamp((760-height)/280,0,1):0;
    if(heightCompression>0){
      target.y+=heightCompression*0.42;
      camera.position.y+=heightCompression*0.32;
    }

    const perspective=camera as THREE.PerspectiveCamera;
    const calculatedFov=43+portrait.current*9+heightCompression*4.5;
    if(Number.isFinite(calculatedFov)&&calculatedFov>10&&calculatedFov<120){
      perspective.fov=calculatedFov;
      perspective.updateProjectionMatrix();
    }

    if(!isInitialFrame){
      const targetPx=Number.isFinite(state.current.pointer.x)?state.current.pointer.x:0;
      const targetPy=Number.isFinite(state.current.pointer.y)?state.current.pointer.y:0;
      pointer.current.x+=(targetPx-pointer.current.x)*(1-Math.exp(-safeDelta*10));
      pointer.current.y+=(targetPy-pointer.current.y)*(1-Math.exp(-safeDelta*10));
    }
    camera.position.x+=pointer.current.x*.12;
    camera.position.y-=pointer.current.y*.06;

    if(Number.isFinite(camera.position.x)&&Number.isFinite(target.x)){
      camera.lookAt(target);
      gl.render(scene,camera);
    }

    // Synchronize preview poster on initial load
    if(!captured.current&&onCapture&&Math.abs(progress.current)<0.001){
      captured.current=true;
      try{
        const dataUrl=gl.domElement.toDataURL('image/webp',0.95);
        if(dataUrl&&dataUrl.length>1000){
          void onCapture(dataUrl);
        }
      }catch(err){
        console.error('[Storefront] Canvas capture error:',err);
      }
    }

    if(!state.current.ready){state.current.ready=true;onReady();}

    if(moving||Math.abs(portrait.current-nextPortrait)>.001||Math.abs(pointer.current.x-state.current.pointer.x)>.001||Math.abs(pointer.current.y-state.current.pointer.y)>.001)invalidate();

    if(!moving||safeDelta>.12){warmup.current=0;slow.current=0;return;}
    if(++warmup.current<15)return;
    slow.current=safeDelta>.038?slow.current+1:Math.max(0,slow.current-2);
    if(slow.current>=18&&state.current.quality!=='low'){
      state.current.quality='low';slow.current=0;warmup.current=0;
      gl.setPixelRatio(drawingRatio(width,height,window.devicePixelRatio,'low'));
      invalidate();
    }
  },1);
  return null;
}

export default function StorefrontCanvas(props:{state:React.RefObject<StorefrontState>;onReady:()=>void;onFailure:()=>void;onCapture?:(dataUrl:string)=>Promise<void>|void}){
  return <Canvas frameloop="demand" dpr={1} camera={{position:config.camera[0].position,fov:43,near:.15,far:90}} gl={{antialias:true,alpha:true,preserveDrawingBuffer:false,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.setClearColor('#10213a',1);gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.05;}}>
    <fog attach="fog" args={['#10213a',38,90]}/>
    <hemisphereLight args={['#adbfda','#6f604c',.55]}/>
    <directionalLight position={[5,10,8]} intensity={.4} color="#ffe2b2"/>
    <Suspense fallback={null}><Model/><Director {...props}/></Suspense>
  </Canvas>;
}
