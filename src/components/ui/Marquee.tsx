'use client';

import React from 'react';

interface MarqueeProps {
  items?: string[];
  speed?: 'normal' | 'slow';
  className?: string;
}

const defaultItems = [
  'ACRYLIC 3D LETTERS',
  'LED SIGN BOARDS',
  'ACP CLADDING',
  'PVC LOUVER PANELS',
  'ECO-SOLVENT PRINTING',
  'RETRO REFLECTIVE BOARDS',
  'ONE-WAY VISION FILM',
  '12×18 DIGITAL COLOR',
  'STOREFRONT ELEVATIONS',
  'CORPORATE STATIONERY',
];

export default function Marquee({
  items = defaultItems,
  className = '',
}: MarqueeProps) {
  return (
    <div
      className={`relative w-full overflow-hidden py-4 border-y border-[#2A2A2E] bg-[#111113] select-none ${className}`}
    >
      {/* Subtle fade edges for cinematic polish */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#0B0B0C] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#0B0B0C] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-8">
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-8 whitespace-nowrap text-xs sm:text-sm font-bold tracking-[0.2em] text-[#A8A5A0] hover:text-[#E7C77A] transition-colors"
          >
            <span>{item}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6A84F]/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
