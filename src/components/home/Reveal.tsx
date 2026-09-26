'use client';
import { useEffect, useRef } from 'react';

export default function Reveal({children,className=''}:{children:React.ReactNode;className?:string}){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const node=ref.current;
    if(!node||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const bounds=node.getBoundingClientRect();
    // Content is visible without JS and above the initial fold. Only offscreen
    // content opts into a reveal, so a failed observer cannot blank the page.
    if(bounds.top>window.innerHeight)node.dataset.reveal='pending';
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){node.dataset.reveal='shown';observer.disconnect();}
    },{threshold:.08,rootMargin:'0px 0px -30px 0px'});
    observer.observe(node);
    return()=>observer.disconnect();
  },[]);
  return <div ref={ref} className={`home-reveal ${className}`}>{children}</div>;
}
