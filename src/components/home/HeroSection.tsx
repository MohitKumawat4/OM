'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/config/site';
import QuickQuoteModal from '@/components/ui/QuickQuoteModal';

export default function HeroSection() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] text-[#111113] pt-6 sm:pt-10 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-[#DDD9D0]">
      {/* Subtle Architectural Blueprint Grid Cosmetic (Vector SVG) */}
      <div className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none -z-10" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-architectural-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#111113" strokeWidth="1" />
              <circle cx="48" cy="48" r="1.5" fill="#B88628" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-architectural-grid)" />
        </svg>
      </div>

      {/* Ambient warm champagne radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1200px] h-[550px] sm:h-[650px] bg-gradient-to-b from-[#D6A84F]/10 via-[#F7F5F0]/60 to-transparent pointer-events-none blur-3xl -z-10 animate-pulse duration-[8000ms]" />

      {/* Main Hero Showroom Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column (Desktop: 7 cols | Mobile: Full immersive vertical sequence) */}
          <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-6 lg:space-y-8 text-left">
            {/* Top Quality Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#DDD9D0] text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#5A5854] shadow-xs w-fit">
              <span className="w-2 h-2 rounded-full bg-[#B88628] animate-ping" />
              <span>In-House Fabrication • Chomu, Jaipur</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#111113] leading-[1.03] editorial-display">
              Make your brand <br />
              <span className="font-extrabold italic font-serif text-[#B88628]">
                impossible
              </span>{' '}
              to miss.
            </h1>

            {/* Mobile Hero Image: Expanded, immersive, and sleekly filling space */}
            <div className="block lg:hidden space-y-2 my-1">
              <div className="relative w-full h-[280px] sm:h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#DDD9D0] shadow-lg group">
                <Image
                  src="/images/products/sunshine-city-arch.png"
                  alt="Sunshine City Gated Archway with Architectural ACP Cladding fabricated by OM Advertising"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover object-center group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="flex items-center justify-between px-1.5 pt-0.5 text-xs text-[#5A5854]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B88628]" />
                  <span className="font-semibold text-[#111113] text-xs">Sunshine City Gated Archway</span>
                </div>
                <Link href="/work" className="font-semibold text-[#B88628] hover:text-[#111113] flex items-center gap-1 transition-colors">
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Editorial Subtitle Description */}
            <p className="max-w-xl text-sm sm:text-base lg:text-lg text-[#5A5854] leading-relaxed font-normal">
              Turn ordinary commercial spaces into iconic retail landmarks. Precision-routed 3D illuminated letters, architectural ACP facades, and high-definition large-format printing.
            </p>

            {/* Core Product Capabilities Strip (Symmetrical 2x2 on mobile, flex row on desktop) */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[#FFFFFF] border border-[#DDD9D0] shadow-xs grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:justify-between text-xs text-[#111113] font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B88628] shrink-0" />
                <span>3D Sign Boards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B88628] shrink-0" />
                <span>Lighting Boards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B88628] shrink-0" />
                <span>Billboards</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B88628] shrink-0" />
                <span>Flex Boards</span>
              </div>
            </div>

            {/* Action Buttons Group */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#111113] text-white text-xs sm:text-sm font-bold tracking-wide hover:bg-[#B88628] hover:shadow-xl transition-all active:scale-95 shadow-md cursor-pointer text-center"
              >
                Request a Free Quote
              </button>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3">
                <a
                  href={`tel:${siteConfig.contact.phone1.raw}`}
                  className="px-4 sm:px-6 py-3.5 sm:py-4 rounded-full bg-white text-[#111113] border border-[#DDD9D0] text-xs sm:text-sm font-semibold hover:bg-[#EFECE6] transition-all flex items-center justify-center gap-2 shadow-xs truncate"
                >
                  <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#B88628] shrink-0" />
                  <span className="truncate">Call Workshop</span>
                </a>

                <a
                  href={siteConfig.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 sm:px-5 py-3.5 sm:py-4 rounded-full bg-[#EFECE6] text-[#111113] border border-[#DDD9D0] text-xs sm:text-sm font-semibold hover:bg-white hover:text-[#25D366] transition-all flex items-center justify-center gap-2 shadow-xs truncate"
                  title="Open WhatsApp Brief"
                >
                  <MessageSquare className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#25D366] shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Desktop Showcase Stage (Visible on Desktop only, 5 cols) */}
          <div className="hidden lg:block lg:col-span-5 space-y-3.5">
            <div className="relative w-full h-[490px] rounded-3xl overflow-hidden bg-white border border-[#DDD9D0] shadow-xl group">
              <Image
                src="/images/products/sunshine-city-arch.png"
                alt="Sunshine City Gated Archway with Architectural ACP Cladding fabricated by OM Advertising Chomu"
                fill
                priority
                sizes="45vw"
                className="object-cover object-center group-hover:scale-103 transition-transform duration-700"
              />
            </div>

            <div className="flex items-center justify-between px-2 text-xs text-[#5A5854]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B88628]" />
                <span className="font-semibold text-[#111113] text-xs">Sunshine City Gated Archway</span>
              </div>
              <Link
                href="/work"
                className="font-semibold text-[#B88628] hover:text-[#111113] transition-colors flex items-center gap-1"
              >
                <span>View Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      <QuickQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </section>
  );
}
