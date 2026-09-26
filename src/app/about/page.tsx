import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig,experienceCopy } from '@/config/site';
import PageHeading from '@/components/content/PageHeading';
export const metadata:Metadata={title:'About OM Advertising',description:experienceCopy.pages.about.description};
export default function AboutPage(){const copy=experienceCopy.pages.about;return <div className="content-page"><PageHeading {...copy}/><div className="about-layout"><div className="about-image"><Image src={siteConfig.brand.facilityImage} alt={copy.facilityCaption} fill sizes="(max-width: 767px) 100vw, 55vw" className="object-cover"/><span>{copy.facilityCaption}</span></div><div className="about-story"><p className="eyebrow">{siteConfig.brand.name}</p><h2>{copy.facility}</h2><p>{copy.story}</p><p>{siteConfig.contact.address}</p><Link href="/contact" className="text-action">{copy.cta}<ArrowUpRight size={17}/></Link></div></div><div className="about-principles">{siteConfig.whyUs.map(item=><article key={item.number}><span className="eyebrow">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></div>}
