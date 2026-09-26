import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlightedText?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  badge,
  title,
  highlightedText,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={twMerge(
        'max-w-3xl mb-12 sm:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D1D20] border border-[#343438] text-xs font-semibold uppercase tracking-widest text-[#E7C77A] mb-4 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D6A84F] animate-pulse" />
          {badge}
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F5F2EA] leading-[1.15]">
        {title}{' '}
        {highlightedText && (
          <span className="gold-text-gradient">{highlightedText}</span>
        )}
      </h2>

      {description && (
        <p className="mt-4 text-base sm:text-lg text-[#A8A5A0] leading-relaxed font-normal">
          {description}
        </p>
      )}
    </div>
  );
}
