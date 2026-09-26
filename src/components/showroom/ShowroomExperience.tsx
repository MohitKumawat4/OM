'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Component, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import { experienceCopy as copy, showroomConfig as tour, siteConfig } from '@/config/site';
import { chapterAt, clamp, transformationAt } from '@/lib/showroom/timeline';
import type { SceneState } from './ShowroomCanvas';
import ChapterContent from './ChapterContent';
import Lightbox from '@/components/ui/Lightbox';
import Modal from '@/components/ui/Modal';
const Scene=dynamic(()=>import('./ShowroomCanvas'),{ssr:false});
class SceneBoundary extends Component<{children:React.ReactNode;onFailure:()=>void},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(){this.props.onFailure();}render(){return this.state.failed?null:this.props.children;}
}
const notify=()=>window.dispatchEvent(new Event('showroom-change'));
export default function ShowroomExperience(){
 const wrapper=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null),bar=useRef<HTMLDivElement>(null);
 const state=useRef<SceneState>({progress:0,comparison:null,service:0,ready:false});
 const [active,setActive]=useState(0),[ready,setReady]=useState(false),[mode,setMode]=useState<'boot'|'live'|'still'>('boot');
 const [service,setService]=useState(0),[category,setCategory]=useState(0),[comparison,setComparison]=useState(100),[step,setStep]=useState(0),[project,setProject]=useState(0),[lightbox,setLightbox]=useState(false);
 const [inspection,setInspection]=useState(false);
 const onReady=useCallback(()=>setReady(true),[]),onFailure=useCallback(()=>setMode('still'),[]);
 useEffect(()=>{
   const media=window.matchMedia('(prefers-reduced-motion: reduce)');
   const frame=requestAnimationFrame(()=>{if(media.matches){setMode('still');return;}const probe=document.createElement('canvas');const context=probe.getContext('webgl2');if(context){context.getExtension('WEBGL_lose_context')?.loseContext();setMode('live');}else setMode('still');});
   const change=()=>setMode(media.matches?'still':'live');media.addEventListener('change',change);
   return()=>{cancelAnimationFrame(frame);media.removeEventListener('change',change);};
 },[]);
 useEffect(()=>{
   if(mode==='still')return;
   let previousIndex=-1;
   let lastWidth=window.innerWidth,lastHeight=stage.current?.offsetHeight||window.innerHeight,resizeFrame=0;
   const scroll=()=>{const el=wrapper.current;if(!el)return;const height=stage.current?.offsetHeight||window.innerHeight;const progress=clamp(-el.getBoundingClientRect().top/Math.max(1,el.offsetHeight-height));state.current.progress=progress;const index=chapterAt(progress,tour.chapters);setActive(index);
     if(bar.current)bar.current.style.transform=`scaleX(${progress})`;
     if(index!==previousIndex){previousIndex=index;}
     if((state.current.renderedProgress??progress)>.59||(state.current.renderedProgress??progress)<.37)state.current.comparison=null;
     if(state.current.comparison===null)setComparison(Math.round(transformationAt(progress)*100));
     if(index===6)setStep(Math.min(3,Math.floor((progress-.8)/.11*4)));
     notify();
   };
   const restoreHash=()=>{const index=tour.chapters.findIndex(chapter=>`#${chapter.id}`===window.location.hash);const el=wrapper.current;if(index>=0&&el){const start=el.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:start+tour.chapters[index].start*(el.offsetHeight-(stage.current?.offsetHeight||window.innerHeight)),behavior:'instant'});}scroll();};
   const resize=()=>{const height=stage.current?.offsetHeight||window.innerHeight;if(window.innerWidth!==lastWidth||Math.abs(height-lastHeight)>100){const progress=state.current.progress;cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{const el=wrapper.current;if(el&&el.getBoundingClientRect().top<=0&&el.getBoundingClientRect().bottom>=height){window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY+progress*(el.offsetHeight-height),behavior:'instant'});}scroll();});lastWidth=window.innerWidth;lastHeight=height;}else scroll();};
   const frame=requestAnimationFrame(restoreHash);scroll();window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize);window.addEventListener('hashchange',restoreHash);
   return()=>{cancelAnimationFrame(frame);cancelAnimationFrame(resizeFrame);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',resize);window.removeEventListener('hashchange',restoreHash);};
 },[mode]);
 const selectService=(value:number)=>{setService(value);state.current.service=value;notify();};
 const selectCategory=(value:number)=>{setCategory(value);if(value!==3)selectService([0,2,4][value]);};
 const compare=(value:number)=>{setComparison(value);state.current.comparison=value/100;notify();};
 const gallery=(open:boolean)=>{state.current.paused=open;setLightbox(open);notify();};
 const inspect=(open:boolean)=>{state.current.paused=open;setInspection(open);notify();};
 const go=(index:number)=>{const el=wrapper.current;if(!el)return;const top=el.getBoundingClientRect().top+window.scrollY+tour.chapters[index].start*(el.offsetHeight-(stage.current?.offsetHeight||window.innerHeight));history.replaceState(null,'',`#${tour.chapters[index].id}`);window.scrollTo({top,behavior:mode==='still'?'instant':'smooth'});};
 const toggleMode=()=>{if(mode==='still'){state.current.ready=false;setReady(false);setMode('live');window.scrollTo({top:0,behavior:'instant'});}else{setMode('still');window.scrollTo({top:0,behavior:'instant'});}};
 const content=(index:number)=><ChapterContent index={index} service={service} setService={selectService} category={category} setCategory={selectCategory} comparison={comparison} setComparison={compare} step={step} setStep={setStep} project={project} setProject={setProject} openGallery={()=>gallery(true)} openService={()=>inspect(true)}/>;
 const serviceModal=<Modal open={inspection} onClose={()=>inspect(false)} title={tour.services[service].title} wide><div className="inspection-layout"><div className="inspection-image"><Image src={copy.inspectionMedia[service]} alt={tour.services[service].title} fill sizes="(max-width:767px) 90vw, 600px" className="object-contain"/></div><div className="inspection-copy"><p className="eyebrow">{tour.services[service].tag}</p><h2>{tour.services[service].title}</h2><p>{tour.services[service].detail}</p><p className="reference-label">{copy.materialReference}</p><Link href={`/contact?service=${tour.services[service].id}`} className="primary-action">{tour.serviceCta}<ArrowUpRight size={17}/></Link></div></div></Modal>;
 const images=siteConfig.portfolio.map((item,i)=>({src:item.image,alt:item.title,title:item.title,category:item.category,description:i===5?copy.pages.about.facilityCaption:copy.reference}));
 if(mode==='still')return <div className="static-experience"><section className="static-hero"><Image src={tour.scene.fallback} alt={copy.fallbackNote} fill priority sizes="100vw"/><div className="showroom-shade"/><div className="static-hero-copy"><p className="eyebrow">{tour.eyebrow}</p><h1>{siteConfig.brand.tagline}</h1><p>{siteConfig.brand.subTagline}</p>{content(0)}<button className="mode-control" onClick={toggleMode}><Play size={14}/>{tour.motionLabel}</button></div></section><div className="static-chapters">{tour.chapters.slice(1).map((chapter,i)=><section id={chapter.id} key={chapter.id} className="static-chapter"><p className="eyebrow">{chapter.eyebrow}</p><h2>{chapter.title.replace('\n',' ')}</h2><p>{chapter.description}</p>{i===2&&<div className="static-comparison"><Image src={siteConfig.transformation.beforeImage} alt={copy.before} width={900} height={650}/><div style={{clipPath:`inset(0 ${100-comparison}% 0 0)`}}><Image src={siteConfig.transformation.afterImage} alt={copy.after} fill sizes="90vw"/></div></div>}{content(i+1)}</section>)}</div>{serviceModal}<Lightbox isOpen={lightbox} onClose={()=>gallery(false)} images={images} currentIndex={project} onNavigate={setProject}/></div>;
 return <div className="showroom-journey" ref={wrapper}>
   <div className="showroom-stage" ref={stage}>
     <div className="showroom-visual" aria-hidden="true"><Image src={tour.scene.fallback} alt="" fill priority sizes="100vw" className={`showroom-poster ${ready?'is-loaded':''}`}/>{mode==='live'&&<SceneBoundary onFailure={onFailure}><Scene state={state} onReady={onReady} onFailure={onFailure}/></SceneBoundary>}</div>
     <div className={`showroom-shade chapter-shade-${active}`}/>
     <div className="scene-caption"><span>{tour.eyebrow}</span><span>{tour.concept}</span></div>
     {tour.chapters.map((chapter,index)=><section key={chapter.id} className={`story-card story-card-${index} ${active===index?'is-active':''}`} aria-hidden={active!==index} inert={active!==index} aria-label={chapter.label}><div className="story-overlay"><p className="eyebrow">{chapter.eyebrow}</p>{index===0?<h1>{chapter.title.split('\n').map((line,i)=><span key={line} className={i?'gold-line':''}>{line}</span>)}</h1>:<h2>{chapter.title.split('\n').map((line,i)=><span key={line} className={i?'gold-line':''}>{line}</span>)}</h2>}<p className="story-description">{chapter.description}</p>{content(index)}</div></section>)}
     <button id="scene-service-marker" className="scene-marker" tabIndex={-1} aria-hidden="true" onClick={()=>go(2)}>{tour.services[service].title}</button>
     <nav className="chapter-nav" aria-label={tour.chapterLabel}>{tour.chapters.map((chapter,index)=><button key={chapter.id} aria-label={chapter.label} aria-current={active===index?'step':undefined} onClick={()=>go(index)}><span className="chapter-name">{chapter.label}</span><i/></button>)}</nav>
     <div className="journey-bottom"><span className="scroll-cue"><ArrowDown size={16}/>{active===0?tour.scroll:tour.chapters[active].label}</span><div className="journey-tools"><button className="mode-control" onClick={toggleMode}><Pause size={13}/>{tour.staticLabel}</button><Link href="/services" className="skip-tour">{tour.skip}<ArrowUpRight size={13}/></Link><span className="chapter-count">{String(active+1).padStart(2,'0')}<i/>08</span></div></div>
     <div className="journey-progress" ref={bar}/>
   </div>
   <noscript><style>{'.showroom-journey{height:auto!important}.showroom-stage{position:relative;height:100svh}.journey-tools,.chapter-nav,.scene-marker{display:none!important}'}</style><div className="nojs-content">{tour.chapters.map(chapter=><section key={chapter.id}><h2>{chapter.title}</h2><p>{chapter.description}</p></section>)}<Link href="/services">{tour.skip}</Link><Link href="/contact">{tour.quote}</Link></div></noscript>
   {serviceModal}<Lightbox isOpen={lightbox} onClose={()=>gallery(false)} images={images} currentIndex={project} onNavigate={setProject}/>
 </div>;
}
