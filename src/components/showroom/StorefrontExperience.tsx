'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, startTransition } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { experienceCopy as copy, showroomConfig as tour, storefrontConfig as config } from '@/config/site';
import type { StorefrontState } from './StorefrontCanvas';
import MobileStorefrontHero from './MobileStorefrontHero';

const Scene=dynamic(()=>import('./StorefrontCanvas'),{ssr:false});
const FrameSequence=dynamic(()=>import('./FrameSequenceCanvas'),{ssr:false});
const useFrames=config.frameSequence.enabled;
const wake=()=>window.dispatchEvent(new Event('storefront-change'));
class SceneBoundary extends Component<{children:React.ReactNode;onFailure:()=>void},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onFailure();}
  render(){return this.state.failed?null:this.props.children;}
}

interface StorefrontExperienceProps {
  // Optional callback to synchronize live WebGL frame back to static preview poster
  onCapturePoster?: (dataUrl: string) => Promise<void> | void;
}

export default function StorefrontExperience({ onCapturePoster }: StorefrontExperienceProps = {}){
  const isMobile = useSyncExternalStore(subscribeViewport, getMobileViewport, getServerViewport);
  return <>
    {isMobile !== false && <MobileStorefrontHero />}
    {isMobile !== true && <div className="desktop-storefront"><DesktopStorefrontExperience onCapturePoster={onCapturePoster} enabled={isMobile === false} /></div>}
  </>;
}

// CSS selects the correct server-rendered composition before hydration. The
// animated renderer is only allowed to mount after a desktop viewport is known.
const getMobileViewport = () => window.matchMedia(config.mobileHero.media).matches;
const getServerViewport = (): boolean | null => null;
function subscribeViewport(callback: () => void) {
  const media = window.matchMedia(config.mobileHero.media);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function DesktopStorefrontExperience({ onCapturePoster, enabled }: StorefrontExperienceProps & { enabled: boolean }){
  const wrapper=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null),bar=useRef<HTMLDivElement>(null);
  const scene=useRef<StorefrontState>({progress:0,visible:true,ready:false,quality:'balanced',pointer:{x:0,y:0}});
  const [mode,setMode]=useState<'boot'|'live'|'still'>('boot');
  const [ready,setReady]=useState(false),[active,setActive]=useState(0),[category,setCategory]=useState(0),[service,setService]=useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const onReady=useCallback(()=>{
    setLoadProgress(100);
    setReady(true);
    try { sessionStorage.setItem('om_visited', '1'); } catch {}
  },[]);

  // Fail-safe loader lifecycle: guarantees the loader never gets stuck at 100% on refresh
  useEffect(() => {
    if (mode === 'still' || ready) return;

    let isRevisit = false;
    try {
      isRevisit = sessionStorage.getItem('om_visited') === '1';
    } catch {}

    const safetyLimit = isRevisit ? 400 : 1800;
    const safetyTimer = setTimeout(() => {
      setLoadProgress(100);
      setReady(true);
    }, safetyLimit);

    const interval = setInterval(() => {
      setLoadProgress(prev => {
        const step = (99 - prev) * 0.12;
        return prev + Math.max(0.4, step);
      });
    }, 40);

    return () => {
      clearTimeout(safetyTimer);
      clearInterval(interval);
    };
  }, [mode, ready]);
  const onFailure=useCallback(()=>{
    setMode('still');
    // A rejected loader promise is cached too. Clear it so a later explicit
    // retry can recover after a temporary network or asset-loading failure.
    if(!useFrames)void import('./StorefrontCanvas').then(module=>module.clearStorefrontCache()).catch(()=>undefined);
  },[]);
  const enable=useCallback(()=>{
    if(!useFrames)try{
      // Safe WebGL2 capability detection without losing context
      const probe=document.createElement('canvas');
      const supported=!!(window.WebGL2RenderingContext && probe.getContext('webgl2'));
      if(!supported){setMode('still');return;}
    }catch{
      setMode('still');
      return;
    }
    scene.current.ready=false;
    scene.current.quality=window.matchMedia('(max-width: 767px), (pointer: coarse)').matches?'compact':'balanced';
    setReady(false);
    startTransition(()=>setMode('live'));
  },[]);
  useEffect(()=>{
    if(!enabled)return;
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const select=()=>media.matches?setMode('still'):enable();
    // Run immediately on client mount without artificial 180ms delay to eliminate start lag
    select();
    media.addEventListener('change',select);
    return()=>media.removeEventListener('change',select);
  },[enable,enabled]);
  useEffect(()=>{
    if(mode!=='live')return;
    const element=wrapper.current;if(!element)return;
    let frame=0;
    const update=()=>{
      frame=0;
      const bounds=element.getBoundingClientRect(),height=stage.current?.offsetHeight||window.innerHeight;
      const p=Math.min(1,Math.max(0,-bounds.top/Math.max(1,element.offsetHeight-height)));
      scene.current.progress=p;
      // Synchronously verify if element is in viewport to prevent stale visibility from throttled background observers
      const isVisible=bounds.bottom>0 && bounds.top<window.innerHeight;
      scene.current.visible=isVisible;
      // If user refreshed while already scrolled down past the hero, dismiss loader immediately
      if(!isVisible && !ready){
        onReady();
      }
      setActive(p>=config.chapterStarts[2]?2:p>=config.chapterStarts[1]?1:0);
      if(bar.current)bar.current.style.transform=`scaleX(${p})`;
      if(isVisible)wake();
    };
    // Always schedule on scroll so state stays in sync reliably
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const resize=()=>{
      // Simply schedule a recalculation without forcing window.scrollTo
      schedule();
    };
    const restore=()=>{
      const index=tour.chapters.slice(0,3).findIndex(chapter=>`#${chapter.id}`===location.hash);
      if(index>=0){const height=stage.current?.offsetHeight||window.innerHeight;window.scrollTo({top:window.scrollY+element.getBoundingClientRect().top+config.chapterStarts[index]*(element.offsetHeight-height),behavior:'instant'});}
      update();
    };
    // Coalesce tab return events so focus and visibilitychange do not double-trigger or cause scroll lag
    let tabReturnPending=false;
    const onTabReturn=()=>{
      if(document.hidden||tabReturnPending)return;
      tabReturnPending=true;
      requestAnimationFrame(()=>{
        tabReturnPending=false;
        if(frame){cancelAnimationFrame(frame);frame=0;}
        update();
        wake();
      });
    };
    const observer=new IntersectionObserver(entries=>{
      scene.current.visible=entries[0].isIntersecting;
      if(scene.current.visible)wake();
    },{threshold:0});
    observer.observe(element);
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',resize);
    window.addEventListener('hashchange',restore);
    window.addEventListener('focus',onTabReturn);
    document.addEventListener('visibilitychange',onTabReturn);
    frame=requestAnimationFrame(restore);
    return()=>{
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll',schedule);
      window.removeEventListener('resize',resize);
      window.removeEventListener('hashchange',restore);
      window.removeEventListener('focus',onTabReturn);
      document.removeEventListener('visibilitychange',onTabReturn);
    };
  },[mode]);
  const go=(index:number)=>{
    const element=wrapper.current;if(!element)return;
    history.replaceState(null,'',`#${tour.chapters[index].id}`);
    window.scrollTo({top:window.scrollY+element.getBoundingClientRect().top+config.chapterStarts[index]*(element.offsetHeight-(stage.current?.offsetHeight||window.innerHeight)),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  useEffect(()=>{
    const element=stage.current;
    if(!element||mode==='still'||useFrames||!window.matchMedia('(hover: hover) and (pointer: fine)').matches)return;
    let frame=0,x=0,y=0;
    const update=()=>{
      frame=0;
      scene.current.pointer={x,y};
      element.style.setProperty('--sf-pointer-x',`${x*5}px`);
      element.style.setProperty('--sf-pointer-y',`${y*3}px`);
      if(scene.current.visible)wake();
    };
    const move=(event:PointerEvent)=>{
      x=(event.clientX/window.innerWidth-.5)*2;y=(event.clientY/window.innerHeight-.5)*2;
      if(!frame)frame=requestAnimationFrame(update);
    };
    const leave=()=>{x=0;y=0;if(!frame)frame=requestAnimationFrame(update);};
    element.addEventListener('pointermove',move,{passive:true});element.addEventListener('pointerleave',leave);
    return()=>{cancelAnimationFrame(frame);element.removeEventListener('pointermove',move);element.removeEventListener('pointerleave',leave);};
  },[mode]);
  const controls=(index:number)=>{
    if(index===0)return <div className="action-row"><Link href="/contact" className="primary-action">{tour.quote}<ArrowUpRight size={17}/></Link><Link href="/work" className="text-action">{tour.explore}<ArrowUpRight size={16}/></Link></div>;
    if(index===1)return <div className="sf-categories"><div role="group" aria-label={tour.chapters[1].label}>{copy.categories.map((label,i)=><button key={label} aria-pressed={i===category} onClick={()=>setCategory(i)}>{label}</button>)}</div><p>{copy.categoryDescriptions[category]}</p></div>;
    const selected=tour.services[service];
    return <div className="sf-services"><div role="tablist" aria-label={tour.chapters[2].label}>{tour.services.map((item,i)=><button key={item.id} id={`sf-tab-${i}`} role="tab" aria-selected={i===service} aria-controls="sf-service-detail" tabIndex={i===service?0:-1} onClick={()=>setService(i)} onKeyDown={event=>{
      const next=event.key==='ArrowRight'?(i+1)%tour.services.length:event.key==='ArrowLeft'?(i+tour.services.length-1)%tour.services.length:event.key==='Home'?0:event.key==='End'?tour.services.length-1:null;
      if(next!==null){event.preventDefault();setService(next);document.getElementById(`sf-tab-${next}`)?.focus();}
    }}>{item.title}</button>)}</div><div role="tabpanel" id="sf-service-detail" aria-labelledby={`sf-tab-${service}`}><details key={selected.id}><summary>{config.serviceDetails}</summary><p>{selected.detail}</p></details><Link className="text-action" href={`/contact?service=${selected.id}`}>{tour.serviceCta}<ArrowUpRight size={15}/></Link></div></div>;
  };
  return <div ref={wrapper} className={`sf-journey ${mode==='still'?'sf-still':''}`}>
    {/* Global Loader Overlay */}
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0B0C] transition-all duration-700 ease-in-out
        ${(!ready && mode !== 'still') ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="flex flex-col items-center gap-8 w-64">
        {/* Animated Rings/Circle */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle className="text-[#1D1D20] stroke-current" strokeWidth="2.5" cx="50" cy="50" r="46" fill="transparent" />
            <circle
              className="text-[#D6A84F] stroke-current transition-all duration-200 ease-out"
              strokeWidth="2.5"
              strokeLinecap="round"
              cx="50" cy="50" r="46"
              fill="transparent"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * Math.min(100, Math.round(loadProgress))) / 100}
            />
          </svg>
          <div className="absolute text-[#F5F2EA] text-[10px] font-medium tracking-wider">
            {Math.min(100, Math.round(loadProgress))}%
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-[#F5F2EA]/70 tracking-[0.3em] uppercase text-[9px] font-medium animate-pulse">
          OM Advertising
        </div>
      </div>
    </div>

    <div ref={stage} className="sf-stage" data-ready={ready&&mode==='live'}>
      <div className="sf-visual" aria-hidden="true">
        <picture><source media={config.mobileHero.media} srcSet={config.mobileHero.image}/><Image src={useFrames?(config.frameSequence.poster??config.poster):config.poster} alt="" fill loading="eager" fetchPriority="high" sizes="100vw" className={`sf-poster ${ready&&mode==='live'?'sf-loaded':''}`}/></picture>
        {mode==='live'&&<SceneBoundary onFailure={onFailure}>{useFrames?<FrameSequence state={scene} onReady={onReady} onFailure={onFailure}/>:<Scene state={scene} onReady={onReady} onFailure={onFailure} onCapture={onCapturePoster}/>}</SceneBoundary>}
      </div>
      <div className={`sf-shade sf-shade-${active}`}/>
      <div className="sf-caption"><span>{tour.eyebrow}</span><span>{config.label}</span></div>

      <div className="sf-chapters">{tour.chapters.slice(0,3).map((chapter,index)=><section key={chapter.id} id={mode==='still'?chapter.id:undefined} className={`sf-chapter sf-chapter-${index} ${active===index?'sf-active':''}`} aria-hidden={mode==='still'?undefined:active!==index} inert={mode==='still'?undefined:active!==index}>
        <div className="sf-copy"><div className="sf-heading"><p className="eyebrow">{chapter.eyebrow}</p>{index===0?<h1>{config.headings[index].split('\n').map(line=><span key={line}>{line}</span>)}</h1>:<h2>{config.headings[index].split('\n').map(line=><span key={line}>{line}</span>)}</h2>}<p className="sf-description">{config.descriptions[index]}</p></div><div className="sf-interaction">{controls(index)}</div></div>
      </section>)}</div>
      <nav className="sf-nav" aria-label={config.navigation}>{tour.chapters.slice(0,3).map((chapter,i)=><button key={chapter.id} aria-label={chapter.label} aria-current={i===active?'step':undefined} onClick={()=>go(i)}><span>{String(i+1).padStart(2,'0')}</span><i/></button>)}</nav>
      <div ref={bar} className="sf-progress"/>
    </div>
    <noscript><style>{'.sf-journey{height:auto!important}.sf-stage{height:100svh}.sf-nav{display:none!important}.sf-nojs{display:block!important}'}</style><div className="sf-nojs"><h2>{tour.chapters[1].title}</h2><p>{tour.chapters[1].description}</p><h2>{tour.chapters[2].title}</h2><p>{tour.chapters[2].description}</p><Link href="/services">{tour.skip}</Link></div></noscript>
  </div>;
}
