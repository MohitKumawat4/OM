'use client';
// Lightbox — Minimal light theme fullscreen image viewer
// Centers the image and opens it up to full view with a clean cream/white backdrop

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxItem {
  src: string;
  alt: string;
  title?: string;
  category?: string;
  description?: string;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: LightboxItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}: LightboxProps) {
  const item = images[currentIndex];

  const handlePrev = useCallback(() => {
    if (images.length > 1) {
      onNavigate((currentIndex - 1 + images.length) % images.length);
    }
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (images.length > 1) {
      onNavigate((currentIndex + 1) % images.length);
    }
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || !item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title || item.alt || 'Full image view'}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10 select-none bg-[#FAF8F5]/92 backdrop-blur-2xl transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      {/* Top right minimal close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close full view"
        className="fixed top-5 right-5 sm:top-7 sm:right-7 z-[130] w-11 h-11 rounded-full bg-white/90 hover:bg-white active:scale-95 text-[#2C2C2C] flex items-center justify-center backdrop-blur-md shadow-md border border-black/5 transition-all duration-200 hover:shadow-lg cursor-pointer"
      >
        <X size={20} strokeWidth={2} />
      </button>

      {/* Navigation arrows (if multiple images) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            className="fixed left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-[130] w-12 h-12 rounded-full bg-white/90 hover:bg-white active:scale-95 text-[#2C2C2C] flex items-center justify-center backdrop-blur-md shadow-md border border-black/5 transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            className="fixed right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-[130] w-12 h-12 rounded-full bg-white/90 hover:bg-white active:scale-95 text-[#2C2C2C] flex items-center justify-center backdrop-blur-md shadow-md border border-black/5 transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>
        </>
      )}

      {/* Centered full image — clean, unobstructed, perfectly proportioned */}
      <div
        className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={item.src}
          alt={item.title || item.alt || 'Full size view'}
          fill
          sizes="(max-width: 1280px) 95vw, 1200px"
          className="object-contain rounded-2xl drop-shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
          priority
        />
      </div>

      {/* Minimal bottom caption pill */}
      {item.title && (
        <div className="fixed bottom-5 sm:bottom-7 inset-x-0 flex justify-center pointer-events-none z-[130]">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#2C2C2C] border border-black/5 shadow-sm text-xs font-outfit">
            <span className="font-medium">{item.title}</span>
            {images.length > 1 && (
              <>
                <span className="text-black/25">•</span>
                <span className="text-[#8C7A6B] font-medium">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
