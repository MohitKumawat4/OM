'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig, storefrontConfig } from '@/config/site';
import './craft.css';

export default function WhyUsSection() {
  const copy = storefrontConfig.later.craft;
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll listener: updates continuous progress (0.0 to 1.0) and active step
  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!trackRef.current) return;
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (isReduced) return;

        const rect = trackRef.current.getBoundingClientRect();
        const maxScroll = trackRef.current.offsetHeight - window.innerHeight;
        if (maxScroll <= 0) return;

        // Calculate smooth continuous progress from 0.0 to 1.0
        const scrolled = -rect.top;
        const rawProgress = Math.max(0, Math.min(1, scrolled / maxScroll));

        // Update CSS variable directly on track element for 60/120fps GPU performance
        trackRef.current.style.setProperty('--smooth-progress', rawProgress.toFixed(4));

        // Calculate current step (0, 1, 2, 3)
        let step = Math.min(3, Math.floor(rawProgress * 4));
        if (rect.top > 0) step = 0;
        if (rect.bottom < window.innerHeight) step = 3;

        setActive(prev => (prev !== step ? step : prev));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Smoothly scroll window to target step when a pointer is clicked
  const scrollToStep = (index: number) => {
    setActive(index);
    if (!trackRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const rect = trackRef.current.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const maxScroll = trackRef.current.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    // Center of step's bucket: 0.125, 0.375, 0.625, 0.875
    const stepProgress = (index + 0.5) / 4;
    const targetScroll = trackTop + (maxScroll * stepProgress);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <section id="craft" ref={trackRef} className="craft-track" aria-labelledby="craft-heading">
      <div className="craft-sticky-stage">
        {/* TOP HEADER: Spanning across full width */}
        <header className="craft-header">
          <div className="craft-header-left">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="craft-heading" className="craft-main-title">
              Seen from a distance. <span className="craft-title-italic">Considered up close.</span>
            </h2>
          </div>
          <div className="craft-header-right">
            <Link className="craft-about" href="/about">
              <span>{siteConfig.navigation.find(link => link.href === '/about')?.label}</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </header>

        {/* TWO SECTIONS: Left (Narrative Story) | Right (Media Showcase Exhibit) */}
        <div className="craft-body">
          {/* SECTION 1: Narrative Story Stack */}
          <div className="craft-narrative-section">
            <div className="craft-story-stack">
              {siteConfig.whyUs.map((principle, index) => {
                const meta = copy.principles[index];
                const isActive = active === index;
                return (
                  <article
                    key={principle.number}
                    className="craft-story-card"
                    data-active={isActive}
                    aria-hidden={!isActive}
                  >
                    <div className="craft-story-counter">
                      <span className="craft-num-current">{principle.number}</span>
                      <span className="craft-num-divider">/</span>
                      <span className="craft-num-total">04</span>
                      {meta?.note && <span className="craft-story-tag">{meta.note}</span>}
                    </div>

                    <h3 className="craft-story-title">{principle.title}</h3>
                    <p className="craft-story-description">{principle.description}</p>

                    <div className="craft-story-detail">
                      <span className="craft-detail-dot" />
                      <span className="craft-detail-meta">{meta?.label} · Architectural Craft</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Media Showcase Exhibit */}
          <div className="craft-exhibit-section">
            <figure className="craft-media-frame">
              <div className="craft-image-stage">
                {copy.principles.map((item, index) => (
                  <div
                    key={item.image}
                    className="craft-photo"
                    data-active={active === index}
                    aria-hidden={active !== index}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 767px) 90vw, 48vw"
                      priority={index === 0}
                      style={{ objectPosition: index === 2 ? 'center 18%' : 'center' }}
                    />
                  </div>
                ))}
              </div>
              <figcaption className="craft-media-caption">
                <span className="craft-caption-pulse" />
                <span className="craft-caption-text">{copy.principles[active]?.alt || copy.referenceLabel}</span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* BOTTOM: Smooth Continuous Progress Bar & Pointers */}
        <div className="craft-timeline" role="tablist" aria-label={copy.indexLabel}>
          {/* Continuous smooth progress track line */}
          <div className="craft-timeline-track">
            <div className="craft-timeline-fill" />
            <div className="craft-timeline-thumb" />
          </div>

          {/* 4 Interactive Pointer Buttons */}
          <div className="craft-timeline-pointers">
            {copy.principles.map((item, index) => {
              const isActive = active === index;
              return (
                <button
                  key={item.label}
                  role="tab"
                  id={`craft-tab-${index}`}
                  aria-selected={isActive}
                  aria-controls={`craft-panel-${index}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => scrollToStep(index)}
                  onKeyDown={event => {
                    let next = index;
                    if (event.key === 'ArrowRight') next = (index + 1) % 4;
                    else if (event.key === 'ArrowLeft') next = (index + 3) % 4;
                    else if (event.key === 'Home') next = 0;
                    else if (event.key === 'End') next = 3;
                    else return;
                    event.preventDefault();
                    scrollToStep(next);
                    document.getElementById(`craft-tab-${next}`)?.focus();
                  }}
                  className="craft-pointer-btn"
                >
                  <span className="craft-pointer-num">{siteConfig.whyUs[index].number}</span>
                  <span className="craft-pointer-label">{item.label}</span>
                  <ArrowUpRight size={14} className="craft-pointer-arrow" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


