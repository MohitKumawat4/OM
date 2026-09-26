'use client';
/* eslint-disable react-hooks/immutability -- Three.js owns mutable camera/material objects; R3F's frame loop intentionally updates those and a shared ref without React renders. */

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { showroomConfig } from '@/config/site';
import { createCameraSampler, smooth, comparisonAt } from '@/lib/showroom/timeline';

export interface SceneState { progress: number; renderedProgress?: number; comparison: number | null; service: number; ready: boolean; paused?: boolean }
type V3 = [number, number, number];

function Block({ position, size, color = '#343434', metal = 0, rough = .55, emissive, rotation, ...props }: { position: V3; size: V3; color?: string; metal?: number; rough?: number; emissive?: string; rotation?: V3; visible?: boolean }) {
  return <mesh position={position} rotation={rotation} castShadow receiveShadow {...props}><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={emissive || '#000000'} emissiveIntensity={emissive ? 2.4 : 0}/></mesh>;
}

function Lettering({ text, position, size = .45, color = '#e9c98a', glow = false, rotation = [0,0,0], depth = .065 }: { text: string; position: V3; size?: number; color?: string; glow?: boolean; rotation?: V3; depth?: number }) {
  const font = useLoader(FontLoader, showroomConfig.scene.font);
  const geometry = useMemo(() => {
    const g = new TextGeometry(text, { font, size, depth, curveSegments: 6, bevelEnabled: true, bevelThickness: .005, bevelSize: .004, bevelSegments: 2 });
    g.computeBoundingBox();
    const box = g.boundingBox!;
    g.translate(-(box.max.x-box.min.x)/2, 0, 0);
    return g;
  }, [font, text, size, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} position={position} rotation={rotation} castShadow><meshStandardMaterial attach="material-0" color={color} metalness={glow ? .12 : .25} roughness={.32} emissive={glow ? color : '#000'} emissiveIntensity={glow ? 1.2 : 0}/><meshStandardMaterial attach="material-1" color={glow?'#9d793c':color} metalness={.85} roughness={.25}/></mesh>;
}

function Plant({ position, scale = 1 }: {position: V3; scale?: number}) {
  return <group position={position} scale={scale}>
    <mesh position={[0,.28,0]} castShadow><cylinderGeometry args={[.28,.22,.56,12]}/><meshStandardMaterial color="#393a35" roughness={.9}/></mesh>
    {Array.from({length:9}, (_, i) => <group key={i} scale={[.2, .46, .13]} position={[Math.sin(i*2.4)*.18, .72+(i%3)*.14, Math.cos(i*2.4)*.18]}><mesh rotation={[Math.sin(i)*.5, i*2.4, Math.cos(i)*.7]} castShadow><sphereGeometry args={[1,8,6]}/><meshStandardMaterial color={i%2 ? '#41543c' : '#69764a'}/></mesh></group>)}
  </group>;
}

function Downlight({x}:{x:number}) {
  const target=useMemo(()=>{const t=new THREE.Object3D();t.position.set(x,.1,.8);return t;},[x]);
  return <><primitive object={target}/><spotLight position={[x,3.61,.58]} angle={.62} penumbra={.7} intensity={18} color="#ffddae" distance={7} target={target}/></>;
}

function Fins({position,count,step,size,color}:{position:V3;count:number;step:number;size:V3;color:string}){
  const ref=useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(()=>{if(!ref.current)return;const matrix=new THREE.Matrix4();for(let i=0;i<count;i++){matrix.makeTranslation(i*step,0,0);ref.current.setMatrixAt(i,matrix);}ref.current.instanceMatrix.needsUpdate=true;},[count,step]);
  return <instancedMesh ref={ref} args={[undefined,undefined,count]} position={position} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={.6}/></instancedMesh>;
}

function Space({ state }: {state: React.RefObject<SceneState>}) {
  const facade = useRef<THREE.Group>(null);
  const letterGroup = useRef<THREE.Group>(null);
  const signLight = useRef<THREE.PointLight>(null);
  useFrame(() => {
    const progress = state.current.renderedProgress ?? state.current.progress;
    const amount = comparisonAt(progress,state.current.comparison);
    if (facade.current) facade.current.traverse(object=>{if(object instanceof THREE.Mesh){const material=object.material as THREE.MeshStandardMaterial;if(!material.transparent){material.transparent=true;material.needsUpdate=true;}material.opacity=amount;material.depthWrite=amount>.5;object.castShadow=amount>.75;}});
    if (letterGroup.current) letterGroup.current.traverse(object=>{if(object instanceof THREE.Mesh){const materials=Array.isArray(object.material)?object.material:[object.material];for(const material of materials){if(!material.transparent){material.transparent=true;material.needsUpdate=true;}material.opacity=Math.max(0,(amount-.4)/.6);material.depthWrite=amount>.7;}object.castShadow=amount>.8;}});
    if (signLight.current) signLight.current.intensity = 12 * amount;
  });
  return <group>
    {/* Permanent shell: the camera passes through the open central portal. */}
    <Block position={[0,-.24,-3]} size={[16,.4,16]} color="#797b74" rough={.9}/>
    <Block position={[0,-.035,-5]} size={[14,.12,10]} color="#a99d89" rough={.32} metal={.15}/>
    <Block position={[-7,2.8,-5]} size={[.24,5.6,10]} color="#58574f"/>
    <Block position={[7,2.8,-5]} size={[.24,5.6,10]} color="#58574f"/>
    <Block position={[0,2.8,-10]} size={[14,5.6,.24]} color="#b0a28a"/>
    <Block position={[0,5.65,-5]} size={[14,.25,10]} color="#272927"/>
    <Block position={[0,4.65,0]} size={[14,2.1,.32]} color="#686960" rough={1}/>
    <Block position={[-6.65,1.8,0]} size={[.7,3.6,.45]} color="#686960"/>
    <Block position={[6.65,1.8,0]} size={[.7,3.6,.45]} color="#686960"/>

    <group ref={facade}>
      {/* Individual ACP panels retain visible seams. */}
      {Array.from({length:8},(_,i) => <Block key={i} position={[-6.12+i*1.75,4.7,.23]} size={[1.72,1.83,.16]} color={i%3 === 0 ? '#343934' : '#292e2c'} metal={.62} rough={.35}/>)}
      <Block position={[0,5.69,.28]} size={[14.24,.095,.55]} color="#b59861" metal={.8}/>
      <Block position={[0,3.74,.37]} size={[14.1,.075,.65]} color="#b59861" metal={.8}/>
      {[-6.7,6.7].map(x => <group key={x}>
        <Block position={[x,1.85,.2]} size={[.62,3.65,.3]} color="#463f34" metal={.6}/>
        <Fins position={[x-.25,1.85,.39]} count={7} step={.084} size={[.025,3.62,.025]} color="#c3a66e"/>
      </group>)}
    </group>
    <group ref={letterGroup} position={[0,4.45,.39]}>
      <Lettering text={showroomConfig.scene.brand} position={[0,0,0]} size={.69} glow depth={.13}/>
      <Lettering text={showroomConfig.scene.subline} position={[0,-.37,.01]} size={.105} color="#b6b4a5" depth={.008}/>
    </group>
    <pointLight ref={signLight} position={[0,4.65,1.1]} color="#ffcc7b" intensity={12} distance={8} decay={2}/>
    {/* Front glazing leaves a 3.2m entrance open at the centre. */}
    {[-4,4].map(x => <group key={x}>
      <mesh position={[x,1.85,.03]}><boxGeometry args={[4.55,3.65,.035]}/><meshPhysicalMaterial color="#bed4d0" transparent opacity={.13} roughness={.07} metalness={.25} depthWrite={false}/></mesh>
      <Block position={[x,3.6,.08]} size={[4.7,.065,.11]} color="#a99164" metal={.9}/>
      <Block position={[x,.08,.08]} size={[4.7,.09,.11]} color="#a99164" metal={.9}/>
      <Block position={[x,1.23,.07]} size={[4.5,.38,.018]} color="#a2a599" rough={.6}/>
    </group>)}
    {[-6.35,-1.65,1.65,6.35].map(x => <Block key={x} position={[x,1.85,.13]} size={[.065,3.7,.14]} color="#b29a6b" metal={.85}/>)}
    <Lettering text={showroomConfig.scene.windowLeft} position={[-4,1.16,.115]} size={.12} color="#252f2d" depth={.004}/>
    <Lettering text={showroomConfig.scene.windowRight} position={[4,1.16,.115]} size={.12} color="#252f2d" depth={.004}/>
    {[-5,-2.5,0,2.5,5].map(x => <group key={x}>
      <Block position={[x,3.64,.47]} size={[.21,.025,.21]} color="#fff0cb" emissive="#ffe2a5"/>
      <Downlight x={x}/>
    </group>)}
    {/* Interior PVC wall: timber-coloured fins with real spacing and depth. */}
    <Block position={[4.5,2.6,-9.82]} size={[4.6,5.2,.14]} color="#3f3c32"/>
    <Fins position={[2.32,2.6,-9.69]} count={27} step={.165} size={[.105,5.15,.13]} color="#957a54"/>
    <Lettering text={showroomConfig.scene.interiorTitle} position={[-2.8,3.35,-9.72]} size={.56} color="#3b4038" depth={.04}/>
    <Lettering text={showroomConfig.scene.interiorSubtitle} position={[-2.8,2.93,-9.71]} size={.115} color="#535447" depth={.008}/>
    <Lettering text={showroomConfig.scene.brand} position={[4.4,2.6,-9.52]} size={.29} color="#eacb94" glow depth={.065}/>
    {/* Retail context: plinths, shelving, a counter and printed collateral. */}
    {[-4.7,-2.8].map((x,i) => <group key={x}>
      <Block position={[x,.45,-4.8-i*.8]} size={[1.1,.9,1.1]} color="#958f7f"/>
      <mesh position={[x,1.16,-4.8-i*.8]} castShadow><cylinderGeometry args={[.15,.25,.55,24]}/><meshStandardMaterial color={i?'#a8673f':'#cec0a0'} roughness={.65}/></mesh>
    </group>)}
    {[1.1,2.1,3.1].map(y => <group key={y}>
      <Block position={[6.55,y,-5.1]} size={[.85,.045,5.4]} color="#9e875e" metal={.5}/>
      {[-3.1,-4.6,-6.2].map((z,i) => <mesh key={z} position={[6.45,y+.22,z]} castShadow><cylinderGeometry args={[.16,.2,.4+i*.06,16]}/><meshStandardMaterial color={i%2?'#7c634a':'#d9cbb1'}/></mesh>)}
    </group>)}
    <Block position={[-3.3,.57,-7.8]} size={[3.4,1.14,1.15]} color="#6e725e" rough={.4}/>
    <Block position={[-3.3,1.17,-7.8]} size={[3.5,.075,1.25]} color="#d0bfa0" rough={.28}/>
    <Fins position={[-4.88,.56,-7.19]} count={24} step={.139} size={[.07,1.06,.08]} color="#91917a"/>
    <Lettering text={showroomConfig.scene.brand} position={[-3.3,.55,-7.09]} size={.19} color="#e9d3a4" depth={.012}/>
    {[0,1,2].map(i => <Block key={i} position={[-4+i*.42,1.23,-7.55]} size={[.31,.035,.43]} color={i===1?'#c2a276':'#e4dbc4'} rotation={[0,-.15+i*.12,0]}/>)}
    <Lettering text={showroomConfig.scene.brand} position={[-4,1.251,-7.48]} size={.026} color="#263b30" rotation={[-Math.PI/2,0,-.15]} depth={.001}/>
    <Block position={[3,1.3,-2]} size={[1.3,2.6,.08]} color="#a59e84" rotation={[0,-.2,0]}/>
    <group position={[3,0,-1.92]} rotation={[0,-.2,0]}>
      <Lettering text={showroomConfig.scene.posterTop} position={[0,2.09,.09]} size={.145} color="#333e35" depth={.004}/>
      <Lettering text={showroomConfig.scene.posterMiddle} position={[0,1.58,.09]} size={.29} color="#333e35" depth={.004}/>
      <Lettering text={showroomConfig.scene.posterBottom} position={[0,.76,.09]} size={.1} color="#333e35" depth={.004}/>
      <Block position={[0,1.24,.09]} size={[.9,.012,.01]} color="#424b3f"/>
      <Block position={[0,.05,0]} size={[1.45,.1,.5]} color="#8e8c7e" metal={.5}/>
    </group>
    {[-4,0,4].map(x => <group key={x}>
      <Block position={[x,5.4,-5]} size={[.055,.035,8.5]} color="#ffeac6" emissive="#ffe4b1"/>
      <pointLight position={[x,4,-5]} intensity={40} distance={11} color="#ffe3b4" decay={2}/>
    </group>)}
    <Plant position={[-5.7,0,1.2]} scale={1.5}/><Plant position={[5.7,0,1.2]} scale={1.5}/><Plant position={[5.8,0,-8.9]} scale={1.9}/>
    <Block position={[-7.6,.8,1.8]} size={[.045,1.6,.045]} color="#6b7068" metal={.7}/>
    <Block position={[-7.6,1.55,1.8]} size={[1.35,.5,.065]} color="#273e34" metal={.45} rough={.25}/>
    <Lettering text={showroomConfig.scene.direction} position={[-7.6,1.56,1.85]} size={.105} color="#e3e8d9" depth={.002}/>
    <Block position={[-7.6,1.41,1.84]} size={[.38,.027,.01]} color="#e3e8d9"/>
    <Block position={[-7.42,1.44,1.84]} size={[.11,.027,.01]} rotation={[0,0,-.65]} color="#e3e8d9"/>
    {/* Approach paving, curb and peripheral architectural context. */}
    <Block position={[0,-.37,6]} size={[70,.12,60]} color="#383d3c" rough={.78}/>
    <Block position={[0,-.17,2.8]} size={[20,.2,4]} color="#76786e" rough={.75}/>
    {Array.from({length:11},(_,i) => <Block key={i} position={[-10+i*2,-.055,2.8]} size={[.017,.006,4]} color="#464a43"/>)}
    <Block position={[0,-.05,3]} size={[20,.005,.016]} color="#464a43"/>
    <Block position={[-11,4,-5]} size={[6,8,11]} color="#252c2b" rough={.9}/>
    <Block position={[11,4.5,-5]} size={[6,9,11]} color="#242b2a" rough={.9}/>
    {[-10.9,10.9].map(x=>[1.5,3.9,6.3].map(y=><Block key={`${x}-${y}`} position={[x,y,.56]} size={[3.7,1.2,.02]} color="#34413e" metal={.4}/>))}
  </group>;
}

function Director({ state, onReady }: {state: React.RefObject<SceneState>; onReady: () => void}) {
  const { camera, gl, scene, size, invalidate } = useThree();
  const target = useMemo(()=>new THREE.Vector3(),[]);
  const markerPoint = useMemo(()=>new THREE.Vector3(),[]);
  const sample = useMemo(()=>createCameraSampler(showroomConfig.camera),[]);
  const progress = useRef(-1);
  const portraitFraming = useRef(-1);
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = generator.fromScene(room, .03);
    scene.environment = env.texture;
    scene.environmentIntensity = .65;
    room.dispose(); generator.dispose();
    return () => {scene.environment=null;env.dispose();};
  }, [gl, scene]);
  useEffect(()=>{ const update=()=>invalidate(); window.addEventListener('scroll',update,{passive:true}); window.addEventListener('showroom-change',update); document.addEventListener('visibilitychange',update); return()=>{window.removeEventListener('scroll',update);window.removeEventListener('showroom-change',update);document.removeEventListener('visibilitychange',update);}; },[invalidate]);
  useEffect(()=>{const pixels=Math.max(1,size.width*size.height);gl.setPixelRatio(Math.min(window.devicePixelRatio,1.5,Math.sqrt(3500000/pixels)));invalidate();},[gl,size.width,size.height,invalidate]);
  useFrame((_,delta)=>{
    if(document.hidden || state.current.paused) return;
    const desired = state.current.progress;
    if(progress.current<0) progress.current=desired;
    progress.current += (desired-progress.current)*(1-Math.exp(-Math.min(delta,.05)*14));
    if(Math.abs(desired-progress.current)>.00001) invalidate();
    const p=progress.current;
    state.current.renderedProgress=p;
    sample(p,camera.position,target);
    const desiredFraming = Math.max(0,Math.min(1,(1.2-size.width/size.height)/.7));
    if(portraitFraming.current<0)portraitFraming.current=desiredFraming;
    portraitFraming.current+=(desiredFraming-portraitFraming.current)*(1-Math.exp(-Math.min(delta,.05)*12));
    if(Math.abs(desiredFraming-portraitFraming.current)>.001)invalidate();
    const portrait=portraitFraming.current;
    const exterior=1-smooth(p/.5);
    camera.position.z += portrait*3*exterior;target.y += portrait*.8*exterior;
    (camera as THREE.PerspectiveCamera).fov = 43+portrait*18;
    camera.lookAt(target);
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    camera.updateMatrixWorld();
    const marker=document.getElementById('scene-service-marker');
    if(marker){const anchor=showroomConfig.services[state.current.service].anchor;markerPoint.set(anchor[0],anchor[1],anchor[2]).project(camera);const visible=p>=.23&&p<.4&&state.current.service!==3&&Math.abs(markerPoint.x)<.88&&Math.abs(markerPoint.y)<.7&&markerPoint.z<1;marker.style.display=visible?'block':'none';marker.style.left=`${(markerPoint.x*.5+.5)*100}%`;marker.style.top=`${(-markerPoint.y*.5+.5)*100}%`;}
    if(!state.current.ready){state.current.ready=true; onReady();}
  },-1);
  return null;
}

export default function ShowroomCanvas({state,onReady,onFailure}:{state:React.RefObject<SceneState>;onReady:()=>void;onFailure:()=>void}) {
  return <Canvas shadows dpr={[1,1.5]} frameloop="demand" camera={{position:[10,5.1,20],fov:43,near:.08,far:120}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.setClearColor('#202d30');gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.05;gl.domElement.addEventListener('webglcontextlost',onFailure);}} fallback={null}>
    <fog attach="fog" args={['#202d30',30,85]}/>
    <hemisphereLight args={['#a7c6e0','#524738',1.1]}/>
    <directionalLight position={[6,12,10]} intensity={1.6} color="#d8e5f2" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={14} shadow-camera-bottom={-10} shadow-bias={-.0006}/>
    <Suspense fallback={null}><Space state={state}/><Director state={state} onReady={onReady}/></Suspense>
  </Canvas>;
}
