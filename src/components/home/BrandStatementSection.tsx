'use client';

import React from 'react';

// Brand highlights, core services & craftsmanship pillars
const marqueeItems = [
  'Make Your Brand Impossible to Miss',
  'Acrylic 3D Letters & Glow Signs',
  'Architectural ACP Facade Cladding',
  'LED Sign Boards & Dimensional Letters',
  'Commercial Space Branding',
  'High-Resolution Large Format Printing',
  'Storefront Transformations & Portals',
  'Precision In-House Fabrication',
  'Chomu · Jaipur',
];

/**
 * BrandStatementSection (Marquee Separation Ribbon)
 * Provides a refined, architectural horizontal ribbon separating the 3D Hero from the Work gallery.
 * - Compact height (~42px) with subtle vertical breathing room
 * - Obsidian backdrop (#0C0D0F) with refined border accents
 * - Soft edge fade gradients (mask-image) so text appears and disappears smoothly
 * - Continuous 42s gentle infinite loop with pause-on-hover
 */
export default function BrandStatementSection() {
  return (
    <aside
      aria-label="Brand Highlights Marquee"
      className="relative w-full overflow-hidden bg-[#0C0D0F] text-[#EAE6DC] border-t border-white/[0.08] border-b border-[#8C7A6B]/25 py-2.5 sm:py-3 select-none z-10"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
      }}
    >
      <div className="animate-brand-marquee">
        {/* Track 1 */}
        <div className="flex items-center gap-7 sm:gap-9 shrink-0 pr-7 sm:pr-9">
          {marqueeItems.map((item, index) => (
            <React.Fragment key={`track1-${index}`}>
              <span className="text-[10.5px] sm:text-[11.5px] font-outfit uppercase tracking-[0.22em] font-medium text-[#DCD8CE] hover:text-white transition-colors duration-200">
                {item}
              </span>
              <span className="text-[#D6A84F] text-[9px] sm:text-[10px] select-none opacity-85" aria-hidden="true">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Track 2: Duplicate for seamless gapless loop */}
        <div className="flex items-center gap-7 sm:gap-9 shrink-0 pr-7 sm:pr-9" aria-hidden="true">
          {marqueeItems.map((item, index) => (
            <React.Fragment key={`track2-${index}`}>
              <span className="text-[10.5px] sm:text-[11.5px] font-outfit uppercase tracking-[0.22em] font-medium text-[#DCD8CE] hover:text-white transition-colors duration-200">
                {item}
              </span>
              <span className="text-[#D6A84F] text-[9px] sm:text-[10px] select-none opacity-85">
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </aside>
  );
}
