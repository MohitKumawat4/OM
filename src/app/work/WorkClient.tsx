'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { siteConfig, experienceCopy } from '@/config/site';

/**
 * Our Work — Interactive Bento Grid
 * Each cell has a deliberate fixed size (span pattern), hover expansion,
 * and a smooth reveal overlay. Clicking opens an immersive lightbox.
 *
 * Bento pattern (6 items, 4-column grid):
 *   Row 1: [Hero 2×2] [Tall 1×2] [Normal 1×1]
 *   Row 2: [hero cont] [hero cont] [Wide 2×1]
 *   (repeats with different spans if more items)
 */

// Fixed bento span config per slot index (cycles for >6 items)
const BENTO_SPANS: { col: number; row: number }[] = [
  { col: 2, row: 2 }, // slot 0 — hero
  { col: 1, row: 1 }, // slot 1 — top-right small
  { col: 1, row: 1 }, // slot 2 — second row right-top
  { col: 2, row: 1 }, // slot 3 — wide bottom-left
  { col: 1, row: 1 }, // slot 4 — bottom right
  { col: 1, row: 1 }, // slot 5 — bottom right-2
];

export default function WorkClient() {
  const [category, setCategory] = useState('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = Array.from(new Set(siteConfig.portfolio.map(p => p.category)));
  const items = siteConfig.portfolio.filter(p => category === 'all' || p.category === category);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex(i => (i! - 1 + items.length) % items.length);
  const next = () => setLightboxIndex(i => (i! + 1) % items.length);

  return (
    <div className="wk-page">
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

      {/* ── Page Header ──────────────────────────────── */}
      <header className="wk-header">
        <svg
          className="page-corner-mark"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 24 L4 4 L24 4"
            stroke="#C4A87C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />
          <circle cx="4" cy="4" r="2.5" fill="#D6A84F" opacity="0.65" />
        </svg>
        <p className="wk-eyebrow">
          <span className="wk-eyebrow-line" />
          Work &amp; Inspiration
        </p>
        <div className="wk-header-row">
          <div className="wk-header-copy">
            <h1 className="wk-title">
              See the <span className="wk-title-gold">possibilities.</span>
            </h1>
            <p className="wk-subtitle">
              Signage, facade elevations, and space branding. Illustrative
              references are clearly labelled.
            </p>
          </div>
          <Link href="/contact" className="wk-header-cta">
            Start a Project <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Category filter */}
        <div className="wk-filters" role="group" aria-label="Filter by category">
          <button
            className={`wk-filter-btn ${category === 'all' ? 'is-active' : ''}`}
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            All
            <span className="wk-filter-count">{siteConfig.portfolio.length}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`wk-filter-btn ${category === cat ? 'is-active' : ''}`}
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
              <span className="wk-filter-count">
                {siteConfig.portfolio.filter(p => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* ── Bento Grid ───────────────────────────────── */}
      <section className="wk-bento-section" aria-label="Portfolio bento grid">
        <div className="wk-bento">
          {items.map((item, index) => {
            const span = BENTO_SPANS[index % BENTO_SPANS.length];
            const isHero = span.col === 2 && span.row === 2;
            const isWide = span.col === 2 && span.row === 1;
            const isHovered = hoveredIndex === index;

            return (
              <button
                key={item.id}
                className={`wk-cell ${isHero ? 'wk-cell-hero' : ''} ${isWide ? 'wk-cell-wide' : ''} ${isHovered ? 'wk-cell-hovered' : ''}`}
                style={{
                  /* Explicit grid placement for predictable layout */
                  gridColumn: `span ${span.col}`,
                  gridRow: `span ${span.row}`,
                }}
                onClick={() => openLightbox(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-label={`View ${item.title}`}
              >
                {/* Background image */}
                <div className="wk-cell-img">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={
                      isHero
                        ? '(max-width: 767px) 100vw, 50vw'
                        : '(max-width: 767px) 100vw, 25vw'
                    }
                    className="object-cover"
                  />
                </div>

                {/* Persistent dark scrim at bottom for readability */}
                <div className="wk-cell-scrim" />

                {/* Hover overlay — expands on hover */}
                <div className="wk-cell-overlay" aria-hidden="true" />

                {/* Caption block — slides up on hover */}
                <div className="wk-cell-caption">
                  <span className="wk-cell-cat">{item.category}</span>
                  <h2 className="wk-cell-title">{item.title}</h2>
                  {/* Description only visible on hover for hero/wide cells */}
                  {(isHero || isWide) && (
                    <p className="wk-cell-desc">{item.description}</p>
                  )}
                  <span className="wk-cell-action">
                    View project <ArrowUpRight size={13} />
                  </span>
                </div>

                {/* Index chip — always visible, top-left */}
                <span className="wk-cell-num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Badge chip — top-right if available */}
                {item.badge && (
                  <span className="wk-cell-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Summary bar below grid */}
        <div className="wk-bento-bar">
          <span className="wk-bento-count">
            {String(items.length).padStart(2, '0')} &nbsp;Projects
          </span>
          <span className="wk-bento-note">
            Hover a tile to preview · Click to expand
          </span>
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────── */}
      <div className="wk-cta-strip">
        <div className="wk-cta-strip-inner">
          <p className="wk-cta-label">Ready to make your brand impossible to miss?</p>
          <Link href="/contact" className="primary-action">
            Get a Quote <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────── */}
      {lightboxIndex !== null && (
        <div
          className="wk-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Project: ${items[lightboxIndex].title}`}
          onClick={e => { if (e.target === e.currentTarget) closeLightbox(); }}
        >
          {/* Close */}
          <button className="wk-lb-close" onClick={closeLightbox} aria-label="Close lightbox">
            <X size={18} />
          </button>

          {/* Content panel */}
          <div className="wk-lb-content">
            {/* Large image */}
            <div className="wk-lb-image">
              <Image
                src={items[lightboxIndex].image}
                alt={items[lightboxIndex].title}
                fill
                sizes="(max-width: 767px) 100vw, 70vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Sidebar caption */}
            <div className="wk-lb-caption">
              <div className="wk-lb-top">
                <p className="wk-lb-index">
                  {String(lightboxIndex + 1).padStart(2, '0')}
                  <span> / {String(items.length).padStart(2, '0')}</span>
                </p>
                {items[lightboxIndex].badge && (
                  <span className="wk-cell-badge">{items[lightboxIndex].badge}</span>
                )}
              </div>
              <span className="wk-cell-cat">{items[lightboxIndex].category}</span>
              <h2 className="wk-lb-title">{items[lightboxIndex].title}</h2>
              <p className="wk-lb-desc">{items[lightboxIndex].description}</p>
              {items[lightboxIndex].id !== 'p-6' && (
                <p className="wk-lb-ref">{experienceCopy.reference}</p>
              )}
              <Link
                href={`/contact?ref=${items[lightboxIndex].id}`}
                className="wk-lb-cta"
                onClick={closeLightbox}
              >
                Request Similar Work <ArrowUpRight size={14} />
              </Link>

              {/* Thumbnail strip */}
              <div className="wk-lb-thumbs">
                {items.map((t, i) => (
                  <button
                    key={t.id}
                    className={`wk-lb-thumb ${i === lightboxIndex ? 'is-active' : ''}`}
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`View ${t.title}`}
                  >
                    <Image src={t.image} alt="" fill className="object-cover" sizes="72px" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Arrow navigation */}
          <button className="wk-lb-nav wk-lb-prev" onClick={prev} aria-label="Previous project">
            <ChevronLeft size={22} />
          </button>
          <button className="wk-lb-nav wk-lb-next" onClick={next} aria-label="Next project">
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
