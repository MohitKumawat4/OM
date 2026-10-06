'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { siteConfig, storefrontConfig, experienceCopy, portfolioSpotlights as spotlightItems } from '@/config/site';
import Lightbox from '@/components/ui/Lightbox';
import Reveal from './Reveal';
import MobilePortfolioShowcase from './MobilePortfolioShowcase';

/**
 * PortfolioPreviewSection (Chapter 06: Work & Inspiration)
 * Faithfully mirrors the Wooden Leaf "Spotlight Gallery" design:
 * - Soft and light Fraunces serif font with Outfit sans.
 * - Minimal text footprint: compact badge, single-line title, 1-line description, small button.
 * - Gradient covers only the lower ~38%, leaving >62% of the photo completely clear and visible.
 * - Watermark on Card 01 eliminated via scale origin-top cropping.
 * - Full Lightbox modal integration on active card click.
 */
export default function PortfolioPreviewSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const copy = storefrontConfig.later.work;

  // Prepare images formatted for the Lightbox modal
  const lightboxImages = siteConfig.portfolio.map((item, i) => ({
    src: item.image,
    alt: item.title,
    title: item.title,
    category: item.category,
    description:
      i === 5
        ? experienceCopy.pages.about.facilityCaption
        : item.description || experienceCopy.reference,
  }));

  return (
    <section id="work" className="portfolio-preview home-section home-work pt-14 md:pt-18 pb-10 md:pb-14 bg-[#FAF8F5] text-[#2C2C2C] overflow-hidden">
      {/* Centered Editorial Header with soft Fraunces serif */}
      <Reveal className="portfolio-preview-heading text-center mb-8 md:mb-10 max-w-2xl mx-auto px-4">
        <span className="text-[#8C7A6B] font-outfit font-medium uppercase tracking-[0.22em] text-[10px] mb-2.5 block">
          {copy.eyebrow}
        </span>
        <h2 className="text-3xl md:text-5xl font-fraunces font-light text-[#22201D] tracking-normal mb-3 leading-tight">
          {copy.title.replace('\n', ' ')}
        </h2>
        <div className="w-14 h-0.5 bg-[#D6A84F]/40 mx-auto rounded-full mb-3" />
        <p className="text-xs sm:text-sm text-[#736E67] font-outfit font-light max-w-md mx-auto leading-relaxed">
          {copy.description}
        </p>
      </Reveal>

      {/* Desktop & Tablet Horizontal Accordion Deck */}
      <Reveal className="w-full">
        <div className="relative hidden md:flex flex-row justify-center items-stretch gap-3 md:gap-3.5 h-[450px] max-w-7xl mx-auto px-4 select-none">
          {spotlightItems.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={item.id}
                onMouseEnter={() => {
                  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                    setActiveIndex(index);
                  }
                }}
                onClick={() => {
                  if (!isActive) {
                    setActiveIndex(index);
                  } else {
                    setIsOpen(true);
                  }
                }}
                className={`
                  relative cursor-pointer rounded-2xl overflow-hidden shadow-md group
                  transition-all duration-500 ease-in-out
                  ${
                    isActive
                      ? 'w-full lg:w-[450px] ring-1 ring-black/10 shadow-2xl'
                      : 'w-full lg:w-[95px] xl:w-[102px] opacity-85 hover:opacity-100 hover:shadow-xl'
                  }
                  h-full bg-white border border-[#E6E1D6]/80
                `}
              >
                {/* Background Signage Photo — watermark cropped on card 1 via scale origin-top */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={isActive ? '(max-width: 1024px) 60vw, 450px' : '110px'}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      item.id === 'p-1' ? 'scale-[1.2] origin-top' : ''
                    } ${
                      isActive ? 'scale-105' : 'scale-110 group-hover:scale-105'
                    }`}
                  />
                  {/* Subtle scrim that lightens on hover */}
                  <div
                    className={`absolute inset-0 transition-colors duration-500 ${
                      isActive
                        ? 'bg-black/10 group-hover:bg-black/5'
                        : 'bg-black/15 group-hover:bg-black/5'
                    }`}
                  />
                </div>

                {/* Expanded Active Card Content Overlay — covers ONLY the lower 38% */}
                <div
                  className={`absolute inset-x-0 bottom-0 h-[38%] flex flex-col justify-end p-5 md:p-6 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-all duration-500 ${
                    isActive
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="space-y-1.5">
                    {/* Single subtle pill badge */}
                    <span className="inline-block bg-white/95 text-[#2C2C2C] font-outfit font-medium text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                      {item.shortCategory}
                    </span>

                    {/* Soft, light display title in Fraunces */}
                    <h3 className="text-xl sm:text-2xl text-white font-fraunces font-light tracking-wide leading-snug">
                      {item.shortTitle}
                    </h3>

                    {/* Soft, light, brief description */}
                    <p className="text-white/75 text-[11.5px] sm:text-xs font-outfit font-light line-clamp-2 max-w-xs leading-relaxed">
                      {item.shortDesc}
                    </p>

                    {/* Compact button tucked neatly at bottom */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex(index);
                          setIsOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 bg-[#2E2A25]/90 hover:bg-[#1D1B18] text-white px-3.5 py-1.5 rounded-xl font-outfit font-normal text-xs shadow-md transition-all transform hover:translate-x-0.5"
                      >
                        <span>Explore Details</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inactive Slat Subtle Hover Title (hidden by default) */}
                {!isActive && (
                  <div className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none">
                    <span className="rotate-90 text-white/80 font-outfit font-light whitespace-nowrap text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow">
                      {item.shortTitle}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Reveal>

      <MobilePortfolioShowcase />

      {/* Centered Bottom Link */}
      <div className="portfolio-preview-footer mt-8 md:mt-10 text-center">
        <Link
          href="/work"
          className="inline-flex items-center gap-2.5 text-[#2C2C2C] font-outfit font-medium hover:text-[#A87B2E] transition-all duration-300 group text-xs sm:text-sm"
        >
          <span className="border-b border-transparent group-hover:border-[#A87B2E] pb-0.5">
            Browse Full Portfolio Showcase
          </span>
          <div className="bg-black/5 p-1.5 rounded-full group-hover:bg-[#2C2C2C] group-hover:text-white transition-all">
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <Lightbox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        images={lightboxImages}
        currentIndex={activeIndex}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}


