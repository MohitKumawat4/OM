'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { experienceCopy, siteConfig } from '@/config/site';
import PageHeading from '@/components/content/PageHeading';

export default function ServicesClient() {
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const id = window.location.hash.slice(1);
    const frame = requestAnimationFrame(() => {
      if (siteConfig.categories.some(c => c.id === id)) setCategory(id);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const services = siteConfig.coreServices.filter(
    s => category === 'all' || s.category === category
  );

  return (
    <div className="content-page services-page">
      {/* Background Animated SVG Drafting Halo */}
      <div className="warm-bg-ornament" aria-hidden="true">
        <svg width="420" height="420" viewBox="0 0 420 420" fill="none" className="warm-spin-slow">
          <circle cx="210" cy="210" r="190" stroke="#D6A84F" strokeWidth="1" strokeOpacity="0.18" strokeDasharray="6 8" />
          <circle cx="210" cy="210" r="150" stroke="#8C7A6B" strokeWidth="1.5" strokeOpacity="0.15" strokeDasharray="3 14" />
          <circle cx="210" cy="210" r="110" stroke="#C4A87C" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="210" y1="10" x2="210" y2="30" stroke="#D6A84F" strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" />
          <line x1="210" y1="390" x2="210" y2="410" stroke="#D6A84F" strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" />
          <line x1="10" y1="210" x2="30" y2="210" stroke="#D6A84F" strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" />
          <line x1="390" y1="210" x2="410" y2="210" stroke="#D6A84F" strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" />
        </svg>
      </div>

      <PageHeading {...experienceCopy.pages.services} />

      {/* Category Filter Pills */}
      <div className="filter-row" role="group" aria-label={experienceCopy.chooseService}>
        <button
          aria-pressed={category === 'all'}
          onClick={() => setCategory('all')}
        >
          {experienceCopy.all}
          <span className="filter-count">{siteConfig.coreServices.length}</span>
        </button>
        {siteConfig.categories.map(cat => (
          <button
            key={cat.id}
            aria-pressed={category === cat.id}
            onClick={() => setCategory(cat.id)}
          >
            {cat.shortName}
            <span className="filter-count">
              {siteConfig.coreServices.filter(s => s.category === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="service-grid">
        {services.map((item, i) => (
          <article className="service-entry" key={item.id}>
            <div className="service-entry-image">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1500px) 50vw, 600px"
                className="object-cover"
              />
              <span>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="service-entry-body">
              <p className="eyebrow">
                {siteConfig.categories.find(c => c.id === item.category)?.shortName}
              </p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <ul>
                {item.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link href={`/contact?service=${item.id}`} className="text-action">
                {experienceCopy.serviceQuote}
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Closing CTA */}
      <div className="page-closing">
        <h2>{experienceCopy.fullService}</h2>
        <Link href="/contact" className="primary-action">
          {experienceCopy.pages.about.cta}
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </div>
  );
}
