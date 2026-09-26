'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import QuickQuoteModal from '@/components/ui/QuickQuoteModal';

export default function CoreServicesShowcase() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [activeServiceTitle, setActiveServiceTitle] = useState('');

  // 4 Featured Tall Cinematic Feature Cards
  const featuredShowcase = [
    {
      id: 'acp-cladding',
      title: 'ACP Facade Cladding',
      subtitle: 'Modern architectural composite panel elevations that transform commercial building exteriors.',
      image: '/images/products/sunshine-city-arch.png',
      tag: 'Building Elevation',
      href: '/services#space-branding',
    },
    {
      id: 'led-boards',
      title: 'Storefront 3D Sign Boards',
      subtitle: 'Ultra-bright illuminated back-lit signs with flawless acrylic logos for 24/7 roadside visibility.',
      image: '/images/products/mor-mukut-storefront.jpg',
      tag: 'Glow Signage',
      href: '/services#signage',
    },
    {
      id: 'large-format',
      title: 'Commercial Gate Portals',
      subtitle: 'Architectural entrance gateways engineered with composite panels, laser-cut typography, and spotlights.',
      image: '/images/products/ashoka-enclave-arch.png',
      tag: 'Entrance Gateway',
      href: '/services#space-branding',
    },
    {
      id: 'acrylic-3d',
      title: 'Acrylic 3D Letters',
      subtitle: 'Laser-cut titanium gold acrylic channel lettering with Samsung IP67 LED edge illumination.',
      image: '/images/products/acrylic-3d-ampersand.jpg',
      tag: 'Illuminated Letters',
      href: '/services#signage',
    },
  ];

  const handleOpenQuote = (title: string) => {
    setActiveServiceTitle(title);
    setQuoteModalOpen(true);
  };

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-[#ffffff] text-[#111113] overflow-hidden">
      {/* Subtle, alive background blobs for SaaS feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#B88628]/5 blur-[80px] sm:blur-[120px] pointer-events-none animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-blue-600/5 blur-[80px] sm:blur-[120px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite_alternate]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern SaaS Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16 pb-6 sm:pb-8 border-b border-black/5">
          <div className="lg:max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-[#FAF8F5] border border-[#DDD9D0] text-[10px] font-bold uppercase tracking-widest text-[#B88628] mb-4 shadow-sm">
              Core Production
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#111113] leading-[1.1]">
              Everything you need for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B88628] to-yellow-600">complete brand visibility.</span>
            </h2>
          </div>

          <div className="lg:max-w-md">
            <p className="text-sm sm:text-base text-[#5A5854] leading-relaxed">
              From precision laser routing and high-glow LED modules to architectural facade elevations, all fabricated in-house at our workshop.
            </p>
          </div>
        </div>

        {/* Mobile Swipe Cue */}
        <div className="flex sm:hidden items-center justify-between text-xs text-[#5A5854] font-medium mb-4 px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B88628]">Capabilities</span>
          <span className="text-[10px] uppercase tracking-wider text-[#736E65] flex items-center gap-1 animate-pulse">
            Swipe <span className="text-sm">→</span>
          </span>
        </div>

        {/* Professional SaaS Feature Cards */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-6 pt-2 px-1 -mx-1">
          {featuredShowcase.map((card) => (
            <div
              key={card.id}
              onClick={() => handleOpenQuote(card.title)}
              className="group relative rounded-[2rem] overflow-hidden bg-white border border-black/5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.08)] hover:border-[#B88628]/20 transition-all duration-500 cursor-pointer flex flex-col justify-between hover:-translate-y-2 w-[82vw] max-w-[320px] sm:w-auto shrink-0 snap-center"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#B88628]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

              {/* Clean Photo Header */}
              <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-gray-50 z-10">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                />
                {/* Light gradient overlay for a polished look */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Refined Metadata Container */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 gap-4 bg-white z-10">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88628]">
                    {card.tag}
                  </span>
                  <h3 className="text-lg sm:text-xl font-semibold text-[#111113] group-hover:text-[#B88628] transition-colors leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#5A5854] leading-relaxed line-clamp-2">
                    {card.subtitle}
                  </p>
                </div>

                <div className="pt-5 border-t border-black/5 flex items-center justify-between text-sm font-semibold text-[#111113] mt-2">
                  <span className="text-[#5A5854] group-hover:text-[#111113] transition-colors">
                    Request Quote
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-black/5 text-[#111113] flex items-center justify-center group-hover:bg-[#111113] group-hover:text-white transition-all duration-300 shadow-sm">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SaaS Primary Action Button */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <Link
            href="/services"
            className="group relative inline-flex items-center justify-center px-8 py-4 sm:px-10 sm:py-4 rounded-full bg-white border border-black/10 text-sm font-semibold text-[#111113] shadow-sm hover:shadow-lg hover:border-black/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden w-full sm:w-auto"
          >
            {/* Button Hover effect */}
            <div className="absolute inset-0 w-full h-full bg-[#111113] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
              Explore Complete Catalog
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            </span>
          </Link>
        </div>
      </div>

      <QuickQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialService={activeServiceTitle}
      />
    </section>
  );
}
