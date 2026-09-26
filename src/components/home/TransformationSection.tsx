'use client';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig, storefrontConfig } from '@/config/site';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import QuickQuoteModal from '@/components/ui/QuickQuoteModal';
import Reveal from './Reveal';

export default function TransformationSection(){
  const [open,setOpen]=useState(false);
  const copy=storefrontConfig.later.transformation;
  return <section id="transformation" className="home-section home-transformation">
    <Reveal className="home-intro"><div><p className="eyebrow">{copy.eyebrow}</p><h2>{copy.title.split('\n').map(line=><span key={line}>{line}</span>)}</h2></div><p>{copy.description}</p></Reveal>
    <Reveal className="home-transformation-media"><BeforeAfterSlider beforeImage={siteConfig.transformation.beforeImage} afterImage={siteConfig.transformation.afterImage} beforeLabel={siteConfig.transformation.beforeLabel} afterLabel={siteConfig.transformation.afterLabel} instructionLabel={copy.hint} className="home-comparison"/></Reveal>
    <div className="home-comparison-caption"><span>{copy.note}</span><button className="text-action" onClick={()=>setOpen(true)}>{copy.cta}<ArrowUpRight size={17}/></button></div>
    <Reveal className="home-materials">{siteConfig.transformation.metrics.map((item,i)=><div key={item.label}><span>{'0'+(i+1)}</span><h3>{item.label}</h3><p>{item.desc}</p></div>)}</Reveal>
    <QuickQuoteModal isOpen={open} onClose={()=>setOpen(false)} initialService="acp-cladding"/>
  </section>;
}
