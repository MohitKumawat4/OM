'use client';
// ServicesStackSection — scroll-stacked service category cards
// Inspired by wooden-leaf ProductCategories.jsx
// Uses native JS scroll tracking (no framer-motion) with CSS sticky + scale transforms

import { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// ── Card data ────────────────────────────────────────────────────────────────
const SERVICE_CARDS = [
  {
    id: 'signage',
    label: 'Chapter 01',
    title: 'Illuminated & 3D Signage',
    body: 'Dimensional acrylic letters, backlit LED boards, and high-contrast retro-reflective signs that give your storefront an unmistakable identity from any distance.',
    cta: 'Explore Signage',
    href: '/services#signage',
    image: '/images/products/acrylic-3d-ampersand.jpg',
  },
  {
    id: 'space-branding',
    label: 'Chapter 02',
    title: 'Space & Facade Branding',
    body: 'Full-facade ACP cladding, archways, and interior PVC panel branding that transform raw concrete into a cohesive, premium commercial identity.',
    cta: 'Explore Cladding',
    href: '/services#space-branding',
    image: '/images/products/sunshine-city-arch.png',
  },
  {
    id: 'printing',
    label: 'Chapter 03',
    title: 'High-Definition Printing',
    body: 'Eco-solvent flex printing, vinyl wraps, and precision-cut stickers produced with wide-format digital presses for vivid, weather-resistant output.',
    cta: 'Explore Printing',
    href: '/services#printing',
    image: '/images/products/shri-ji-nivas.jpg',
  },
  {
    id: 'promotional',
    label: 'Chapter 04',
    title: 'Business & Promotional',
    body: 'Business cards, letterheads, banners, and branded collateral — every touchpoint that carries your identity beyond the storefront.',
    cta: 'Explore Collateral',
    href: '/services#promotional',
    image: '/images/products/ashoka-enclave-arch.png',
  },
];

const CARD_COUNT = SERVICE_CARDS.length;
const SCALE_STEP = 0.04;

// ── Single sticky card ───────────────────────────────────────────────────────
function ServiceCard({
  card,
  index,
  containerRef,
}: {
  card: (typeof SERVICE_CARDS)[0];
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const { top, height } = container.getBoundingClientRect();
    // Overall scroll progress 0→1 across the sticky stack container
    const scrollDistance = height - window.innerHeight;
    const progress = scrollDistance > 0 ? Math.min(1, Math.max(0, -top / scrollDistance)) : 0;

    // Earlier cards shrink slightly to create depth in the stack; topmost card stays at 1.0
    const targetScale = index === CARD_COUNT - 1 ? 1 : 1 - (CARD_COUNT - 1 - index) * SCALE_STEP;
    const startRange = (index / (CARD_COUNT - 1)) * 0.75;

    let scale = 1;
    if (index < CARD_COUNT - 1 && progress > startRange) {
      const t = Math.min(1, (progress - startRange) / (1 - startRange));
      scale = 1 - t * (1 - targetScale);
    }

    // Image parallax: zoom out as the card enters view
    const card = cardRef.current;
    const imgEl = card?.querySelector('.svc-img-inner') as HTMLElement | null;
    if (imgEl && card) {
      const cardRect = card.getBoundingClientRect();
      const cardFrac = Math.min(1, Math.max(0, 1 - cardRect.top / window.innerHeight));
      const imgScale = 1.3 - cardFrac * 0.3;
      imgEl.style.transform = `scale(${imgScale})`;
    }

    inner.style.transform = `scale(${scale})`;
  }, [containerRef, index]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const stickyTop = 76 + index * 20;

  return (
    <div
      ref={cardRef}
      className="svc-card-outer"
      style={{ top: `${stickyTop}px` } as React.CSSProperties}
    >
      <div
        ref={innerRef}
        className="svc-card-inner"
      >
        <div className="svc-card-content">
          {/* Left: Text */}
          <div className="svc-card-text">
            <span className="svc-label">{card.label}</span>
            <h2 className="svc-title font-fraunces">{card.title}</h2>
            <p className="svc-body font-outfit">{card.body}</p>
            <Link href={card.href} className="svc-cta font-outfit">
              {card.cta}
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
          </div>

          {/* Right: Image */}
          <div className="svc-card-image">
            <div className="svc-img-inner">
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width:767px) 100vw, 55vw"
                className="svc-img-el"
              />
            </div>
            <div className="svc-img-overlay" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Animated SVG & Sticker Cosmetics Layer ──────────────────────────────────
// Pinned sticky backdrop matching Wooden Leaf's central orbital framing & peripheral stickers
// Thematically customized for OM Advertising (Illuminated 3D Signage, ACP Cladding, CMYK Printing)
function SvgCosmetics() {
  return (
    <div className="svc-backdrop-sticky" aria-hidden="true">
      {/* 1. Ambient Warm Radial Glow Orbs */}
      <div className="svc-ambient-orb svc-orb-tl" />
      <div className="svc-ambient-orb svc-orb-br" />

      {/* 2. Central Architectural Orbital Halo (Centered behind card stack) */}
      <div className="svc-halo-wrapper">
        <svg
          className="svc-halo-svg"
          viewBox="0 0 960 960"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer hairline orbit */}
          <circle
            cx="480"
            cy="480"
            r="440"
            stroke="#D6A84F"
            strokeWidth="1"
            strokeOpacity="0.18"
            strokeDasharray="6 8"
          />

          {/* Major segmented CNC toolpath arc ring — clockwise slow rotation */}
          <circle
            cx="480"
            cy="480"
            r="395"
            stroke="#C4A87C"
            strokeWidth="16"
            strokeOpacity="0.22"
            strokeDasharray="140 45 100 50 190 60 90 45"
            strokeLinecap="round"
            className="svc-spin-slow"
          />

          {/* Outer compass tick marks — counter-clockwise */}
          <circle
            cx="480"
            cy="480"
            r="360"
            stroke="#8C7A6B"
            strokeWidth="1.5"
            strokeOpacity="0.18"
            strokeDasharray="3 14"
            className="svc-spin-reverse-slow"
          />

          {/* Concentric guide hairline */}
          <circle
            cx="480"
            cy="480"
            r="325"
            stroke="#C4A87C"
            strokeWidth="1"
            strokeOpacity="0.15"
          />

          {/* Inner dashed dial ring — counter-clockwise */}
          <circle
            cx="480"
            cy="480"
            r="290"
            stroke="#8C7A6B"
            strokeWidth="1.8"
            strokeOpacity="0.2"
            strokeDasharray="6 14"
            className="svc-spin-reverse"
          />

          {/* Cardinal drafting registration crosshairs (0°, 90°, 180°, 270°) */}
          <line x1="480" y1="24" x2="480" y2="52" stroke="#D6A84F" strokeWidth="2" strokeOpacity="0.32" strokeLinecap="round" />
          <line x1="480" y1="908" x2="480" y2="936" stroke="#D6A84F" strokeWidth="2" strokeOpacity="0.32" strokeLinecap="round" />
          <line x1="24" y1="480" x2="52" y2="480" stroke="#D6A84F" strokeWidth="2" strokeOpacity="0.32" strokeLinecap="round" />
          <line x1="908" y1="480" x2="936" y2="480" stroke="#D6A84F" strokeWidth="2" strokeOpacity="0.32" strokeLinecap="round" />

          {/* Orbiting luminous golden satellite node */}
          <g className="svc-spin-slow">
            <circle cx="480" cy="85" r="4.5" fill="#D6A84F" opacity="0.65" />
            <circle cx="480" cy="85" r="10" fill="#D6A84F" opacity="0.18" />
          </g>
        </svg>
      </div>

      {/* 3. Left Flank Floating Themed Cosmetics & Stickers */}
      <div className="svc-flank svc-flank-left">
        {/* Top-Left: 4-Point Illuminated LED Brilliance Star & Badge */}
        <div className="svc-flank-item svc-flank-tl">
          <svg width="74" height="74" viewBox="0 0 74 74" fill="none" className="svc-star-pulse">
            <circle cx="37" cy="37" r="28" fill="url(#star-glow-tl)" opacity="0.5" />
            <path
              d="M37 4 C37 24 24 37 4 37 C24 37 37 50 37 70 C37 50 50 37 70 37 C50 37 37 24 37 4 Z"
              fill="url(#star-grad-tl)"
            />
            <path
              d="M37 18 C37 28 31 37 21 37 C31 37 37 46 37 56 C37 46 43 37 53 37 C43 37 37 28 37 18 Z"
              fill="#FFFDF8"
              opacity="0.85"
            />
            <defs>
              <radialGradient id="star-glow-tl" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D6A84F" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#D6A84F" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="star-grad-tl" x1="4" y1="4" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E7C77A" />
                <stop offset="1" stopColor="#B38938" />
              </linearGradient>
            </defs>
          </svg>

          {/* Twinkling companion micro-star */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="svc-star-twinkle">
            <path
              d="M14 2 C14 9 9 14 2 14 C9 14 14 19 14 26 C14 19 19 14 26 14 C19 14 14 9 14 2 Z"
              fill="#D6A84F"
              opacity="0.45"
            />
          </svg>

          {/* Tactile 3D Signage Pill Sticker */}
          <div className="svc-sticker svc-sticker-pill">
            <span className="svc-sticker-dot" />
            <span className="svc-sticker-text">3D ACRYLIC &amp; LED</span>
          </div>
        </div>

        {/* Mid-Left: Concentric Alignment Target & Architectural Dimension */}
        <div className="svc-flank-item svc-flank-ml">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="svc-float-subtle">
            <circle cx="45" cy="45" r="40" stroke="#C4A87C" strokeWidth="1" strokeOpacity="0.25" />
            <circle cx="45" cy="45" r="28" stroke="#8C7A6B" strokeWidth="1.2" strokeOpacity="0.2" strokeDasharray="4 6" className="svc-spin-slow" />
            <circle cx="45" cy="45" r="16" stroke="#D6A84F" strokeWidth="1.5" strokeOpacity="0.35" />
            <circle cx="45" cy="45" r="3.5" fill="#D6A84F" opacity="0.65" />
            <line x1="45" y1="5" x2="45" y2="85" stroke="#C4A87C" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 4" />
            <line x1="5" y1="45" x2="85" y2="45" stroke="#C4A87C" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 4" />
          </svg>

          {/* Architectural Dimension Callout */}
          <svg width="124" height="26" viewBox="0 0 124 26" fill="none" className="svc-dim-line">
            <line x1="10" y1="13" x2="114" y2="13" stroke="#8C7A6B" strokeWidth="1" strokeOpacity="0.28" />
            <line x1="10" y1="7" x2="10" y2="19" stroke="#8C7A6B" strokeWidth="1.2" strokeOpacity="0.38" />
            <line x1="114" y1="7" x2="114" y2="19" stroke="#8C7A6B" strokeWidth="1.2" strokeOpacity="0.38" />
            <text x="62" y="10" textAnchor="middle" fill="#8C7A6B" fontSize="8.5" letterSpacing="0.12em" opacity="0.55" fontFamily="monospace">
              900 × 2400 MM
            </text>
          </svg>
        </div>

        {/* Bottom-Left: HD Print Dot Matrix & Toolpath Arc */}
        <div className="svc-flank-item svc-flank-bl">
          <svg width="84" height="84" viewBox="0 0 84 84" fill="none" className="svc-drift-dots">
            {/* 4x4 halftone matrix of subtle warm dots */}
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <circle
                  key={`dot-${row}-${col}`}
                  cx={12 + col * 20}
                  cy={12 + row * 20}
                  r={2.2 + ((row + col) % 3) * 0.7}
                  fill="#D6A84F"
                  opacity={0.14 + ((row * 2 + col) % 5) * 0.05}
                />
              ))
            )}
          </svg>
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none" className="svc-spin-reverse-slow">
            <path d="M12 34 A22 22 0 0 1 56 34" stroke="#C4A87C" strokeWidth="1.5" strokeOpacity="0.28" strokeDasharray="3 5" />
            <circle cx="56" cy="34" r="3" fill="#D6A84F" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* 4. Right Flank Floating Themed Cosmetics & Stickers */}
      <div className="svc-flank svc-flank-right">
        {/* Top-Right: Neon Contour Wave & Geometric Prism */}
        <div className="svc-flank-item svc-flank-tr">
          <svg width="140" height="110" viewBox="0 0 140 110" fill="none" className="svc-wave-sway">
            <path
              d="M10 20 C 45 5, 80 80, 130 40 C 150 20, 110 95, 70 85 C 40 75, 20 95, 5 105"
              stroke="url(#neon-wave-grad)"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.32"
            />
            <path
              d="M25 35 C 55 20, 85 90, 125 55"
              stroke="url(#neon-wave-grad)"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              strokeLinecap="round"
              opacity="0.22"
            />
            <defs>
              <linearGradient id="neon-wave-grad" x1="0" y1="0" x2="140" y2="110" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D6A84F" />
                <stop offset="0.5" stopColor="#E7C77A" />
                <stop offset="1" stopColor="#8C7A6B" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Acrylic Facet Diamond */}
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="svc-spin-diamond">
            <polygon points="22,4 40,22 22,40 4,22" stroke="#D6A84F" strokeWidth="1.4" strokeOpacity="0.32" fill="#D6A84F" fillOpacity="0.04" />
            <polygon points="22,12 32,22 22,32 12,22" stroke="#C4A87C" strokeWidth="1" strokeOpacity="0.2" />
          </svg>
        </div>

        {/* Mid-Right: Brand Craft Seal Sticker & Amber Sine Flourish */}
        <div className="svc-flank-item svc-flank-mr">
          {/* Animated Sine Wave Flourish (matching reference) */}
          <svg width="92" height="54" viewBox="0 0 92 54" fill="none" className="svc-wave-amber">
            <path d="M5 40 Q 25 8, 50 30 T 88 12" stroke="#D6A84F" strokeWidth="1.8" strokeLinecap="round" opacity="0.36" />
            <circle cx="88" cy="12" r="3" fill="#D6A84F" opacity="0.55" />
          </svg>

          {/* Tactile Circular Craft Seal Sticker */}
          <div className="svc-sticker svc-sticker-seal">
            <svg width="86" height="86" viewBox="0 0 86 86" className="svc-seal-svg">
              <defs>
                <path id="seal-circle-path" d="M 43, 43 m -29, 0 a 29,29 0 1,1 58,0 a 29,29 0 1,1 -58,0" />
              </defs>
              <circle cx="43" cy="43" r="40" stroke="#D6A84F" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />
              <circle cx="43" cy="43" r="35" stroke="#8C7A6B" strokeWidth="0.8" strokeOpacity="0.2" />
              <path d="M43 28 L45 38 L55 40 L45 42 L43 52 L41 42 L31 40 L41 38 Z" fill="#D6A84F" opacity="0.45" />
              <text fill="#6E6A64" fontSize="6" letterSpacing="0.18em" fontWeight="600" opacity="0.65">
                <textPath href="#seal-circle-path" startOffset="0%">
                  OM ADVERTISING • SIGN &amp; PRINT • CHOMU •
                </textPath>
              </text>
            </svg>
          </div>
        </div>

        {/* Bottom-Right: CMYK Calibration Target & ACP Cladding Bracket */}
        <div className="svc-flank-item svc-flank-br">
          {/* CMYK Press Calibration Bar */}
          <svg width="102" height="44" viewBox="0 0 102 44" fill="none" className="svc-float-subtle">
            <circle cx="18" cy="22" r="14" stroke="#8C7A6B" strokeWidth="1" strokeOpacity="0.28" />
            <line x1="18" y1="4" x2="18" y2="40" stroke="#8C7A6B" strokeWidth="1" strokeOpacity="0.32" />
            <line x1="0" y1="22" x2="36" y2="22" stroke="#8C7A6B" strokeWidth="1" strokeOpacity="0.32" />
            <circle cx="18" cy="22" r="2.8" fill="#D6A84F" opacity="0.6" />
            {/* 4 CMYK Calibration Dots */}
            <circle cx="46" cy="22" r="4.2" fill="#00A3E0" opacity="0.35" />
            <circle cx="60" cy="22" r="4.2" fill="#EC008C" opacity="0.35" />
            <circle cx="74" cy="22" r="4.2" fill="#FFD100" opacity="0.4" />
            <circle cx="88" cy="22" r="4.2" fill="#2C2C2C" opacity="0.32" />
          </svg>

          {/* Architectural ACP Corner Alignment Bracket */}
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" className="svc-corner-cross">
            <path d="M8 28 L8 8 L28 8" stroke="#C4A87C" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
            <circle cx="8" cy="8" r="2.5" fill="#D6A84F" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function ServicesStackSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="svc-section" aria-label="Our Services">

      {/* Section header */}
      <div className="svc-header">
        <span className="eyebrow svc-eyebrow">What We Create</span>
        <h2 className="svc-heading font-fraunces">
          Four Ways We Make
          <span className="svc-heading-accent"> Your Brand Visible</span>
        </h2>
        <p className="svc-subhead font-outfit">
          Scroll through each category to discover the full range of OM Advertising&apos;s capabilities.
        </p>
      </div>

      {/* Scroll & sticky container */}
      <div ref={containerRef} className="svc-scroll-container">
        <SvgCosmetics />
        {SERVICE_CARDS.map((card, i) => (
          <ServiceCard
            key={card.id}
            card={card}
            index={i}
            containerRef={containerRef}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="svc-footer">
        <Link href="/services" className="svc-all-link font-outfit">
          View All Services
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
        <Link href="/contact" className="svc-quote-link font-outfit">
          Get a Quote
        </Link>
      </div>
    </section>
  );
}
