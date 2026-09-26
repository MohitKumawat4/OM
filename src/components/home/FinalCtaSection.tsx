'use client';
import { useState } from 'react';
import { ArrowUpRight, Phone, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';
import QuickQuoteModal from '@/components/ui/QuickQuoteModal';
import Reveal from './Reveal';

/**
 * Chapter 08: Architectural Transformation Stage
 * Premium closing section with OM's signature deep charcoal canvas (#0B0B0C),
 * warm ambient LED backlighting, architectural ACP facade blueprint drafting lines,
 * and high-impact workshop estimation actions.
 */
export default function FinalCtaSection() {
  const [open, setOpen] = useState(false);

  return (
    <section id="invitation" className="om-cta-stage" aria-label="Brand Transformation Invitation">
      {/* Ambient warm gold illumination glow */}
      <div className="om-cta-glow" aria-hidden="true" />

      {/* Architectural Signage Fabrication & ACP Facade Drafting Motif */}
      <svg
        className="om-cta-craft-grid"
        viewBox="0 0 640 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="omGoldBeam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E7C77A" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D6A84F" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Facade Cladding Modular Panel Grid Lines */}
        <line x1="80" y1="70" x2="640" y2="70" stroke="#D6A84F" strokeWidth="1" opacity="0.14" strokeDasharray="4 4" />
        <line x1="80" y1="190" x2="640" y2="190" stroke="#D6A84F" strokeWidth="1" opacity="0.18" />
        <line x1="80" y1="310" x2="640" y2="310" stroke="#D6A84F" strokeWidth="1" opacity="0.14" strokeDasharray="4 4" />
        <line x1="240" y1="0" x2="240" y2="420" stroke="#D6A84F" strokeWidth="1" opacity="0.14" strokeDasharray="4 4" />
        <line x1="430" y1="0" x2="430" y2="420" stroke="#D6A84F" strokeWidth="1" opacity="0.18" />
        <line x1="590" y1="0" x2="590" y2="420" stroke="#D6A84F" strokeWidth="1" opacity="0.12" />

        {/* Structural Panel Dimension Spec Callout */}
        <line x1="240" y1="182" x2="430" y2="182" stroke="#E7C77A" strokeWidth="1.2" opacity="0.4" />
        <line x1="240" y1="176" x2="240" y2="188" stroke="#E7C77A" strokeWidth="1.2" opacity="0.4" />
        <line x1="430" y1="176" x2="430" y2="188" stroke="#E7C77A" strokeWidth="1.2" opacity="0.4" />
        <text x="335" y="173" textAnchor="middle" fill="#E7C77A" fontSize="9.5" letterSpacing="0.18em" opacity="0.7" fontFamily="monospace">
          ACP MODULE · 2440 × 1220 MM
        </text>

        {/* CNC Fabrication Corner Registration Crosshairs */}
        <g stroke="#D6A84F" strokeWidth="1.2" opacity="0.5">
          <path d="M 235 190 H 245 M 240 185 V 195" />
          <path d="M 425 190 H 435 M 430 185 V 195" />
          <path d="M 425 310 H 435 M 430 305 V 315" />
          <path d="M 235 310 H 245 M 240 305 V 315" />
        </g>

        {/* Illuminated Signage Contour Arc with warm radiant anchor node */}
        <path d="M 240 310 C 330 310 430 270 430 190" stroke="url(#omGoldBeam)" strokeWidth="2" strokeDasharray="6 3" />
        <circle cx="430" cy="190" r="5" fill="#E7C77A" filter="drop-shadow(0 0 10px #E7C77A)" />
        <circle cx="430" cy="190" r="9" stroke="#E7C77A" strokeWidth="1" opacity="0.4" />
        <text x="448" y="194" fill="#E7C77A" fontSize="10" letterSpacing="0.14em" opacity="0.8" fontFamily="sans-serif">
          LED 3000K WARM GLOW
        </text>
      </svg>

      {/* Massive background typographic watermark clipping at bottom */}
      <div className="om-cta-watermark" aria-hidden="true">
        OM ADVERTISING
      </div>

      {/* Foreground Content Inner */}
      <div className="om-cta-inner">
        <Reveal className="om-cta-copy">
          <span className="om-cta-eyebrow">PHYSICAL BRANDING · STOREFRONT TRANSFORMATIONS</span>
          <h2 className="om-cta-title">
            <span>Make your brand</span>
            <span className="om-cta-gold">impossible to miss.</span>
          </h2>
          <p className="om-cta-desc">
            Whether you need 3D acrylic illuminated letters, architectural ACP facade cladding,
            or large-format flex printing — engineered, fabricated, and installed under one roof in Chomu, Jaipur.
          </p>
        </Reveal>

        {/* Conversion Action Block */}
        <div className="om-cta-actions">
          <button
            type="button"
            className="om-cta-btn"
            onClick={() => setOpen(true)}
            aria-label="Request a quote with OM Advertising"
          >
            <span>Request Workshop Estimate</span>
            <ArrowUpRight size={17} />
          </button>

          {/* Quick Direct Contacts */}
          <div className="om-cta-contacts">
            <a href={'tel:' + siteConfig.contact.phone1.raw}>
              <Phone size={13} />
              <span>Call: {siteConfig.contact.phone1.display}</span>
            </a>
            <span>·</span>
            <a
              href={siteConfig.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={13} />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Quick Quote Modal */}
      <QuickQuoteModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
}


