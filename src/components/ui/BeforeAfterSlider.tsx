'use client';

import React, { useState, useRef, useCallback, useEffect, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  instructionLabel?: string;
}

// Duration for a complete right-to-left-to-right cycle in milliseconds
const CYCLE_DURATION_MS = 6500; // 3.25s right-to-left, 3.25s left-to-right

// Subscribe to browser prefers-reduced-motion preference using React recommended external store pattern
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * BeforeAfterSlider:
 * Interactive storefront before/after comparison component.
 * Features:
 * - Automatic right-to-left then left-to-right continuous sweep loop.
 * - Runs strictly when visible in the viewing area (IntersectionObserver).
 * - Pauses automatically when scrolled offscreen or when page tab is hidden.
 * - Seamless pointer drag and touch support with jump-free auto-sweep resumption.
 * - Apple Liquid Glass aesthetic with soft-cornered rectangular handle.
 * - Keyboard accessible with full ARIA support.
 */
export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = '',
  instructionLabel,
}: BeforeAfterSliderProps) {
  // Start slider at 100% so the sweep starts from right to left
  const [sliderPosition, setSliderPosition] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Time tracking refs for smooth requestAnimationFrame animation
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const lastInteractionTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Monitor visibility of the page tab (Page Visibility API)
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Monitor element visibility in the viewport (IntersectionObserver)
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.15, // Trigger when 15% or more is within the viewport
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Synchronize elapsed time with a given percentage so auto-sweep resumes without a visual jump
  const syncElapsedToPosition = useCallback((percentage: number) => {
    lastInteractionTimeRef.current = performance.now();
    // In our cosine wave: pos = 50 + 50 * cos(2 * PI * elapsed / CYCLE_DURATION)
    // Therefore cos(angle) = (percentage - 50) / 50
    const wasMovingLeftToRight = elapsedRef.current > CYCLE_DURATION_MS / 2;
    const clampedRatio = Math.min(1, Math.max(-1, (percentage - 50) / 50));
    const baseAngle = Math.acos(clampedRatio); // Returns angle in [0, PI]
    const angle = wasMovingLeftToRight ? 2 * Math.PI - baseAngle : baseAngle;
    elapsedRef.current = (angle / (2 * Math.PI)) * CYCLE_DURATION_MS;
  }, []);

  // Automated sweeping animation loop: sweeps right-to-left, then left-to-right in a loop
  useEffect(() => {
    // Only animate when visible on screen, tab is active, and reduced motion is off
    if (!isInView || !isTabVisible || reducedMotion) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const tick = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }
      const delta = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const now = performance.now();
      const timeSinceInteraction = now - lastInteractionTimeRef.current;

      // Only advance automatic sweep if not currently dragging and 1.5s idle after user touch
      if (!isDragging && timeSinceInteraction > 1500) {
        elapsedRef.current = (elapsedRef.current + delta) % CYCLE_DURATION_MS;

        // Cosine wave:
        // elapsed = 0 -> cos(0) = 1 -> position = 100% (right edge)
        // elapsed = CYCLE_DURATION_MS / 2 -> cos(PI) = -1 -> position = 0% (left edge)
        // elapsed = CYCLE_DURATION_MS -> cos(2PI) = 1 -> position = 100% (right edge)
        const progress = elapsedRef.current / CYCLE_DURATION_MS;
        const newPosition = 50 + 50 * Math.cos(progress * 2 * Math.PI);
        setSliderPosition(newPosition);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [isInView, isTabVisible, reducedMotion, isDragging]);

  // Calculate percentage from clientX coordinate
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
    syncElapsedToPosition(percentage);
  }, [syncElapsedToPosition]);

  // Pointer Down: Lock pointer capture to this element so browser native image drag NEVER triggers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  // Pointer Move: Update position continuously while dragging
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  // Pointer Up / Cancel: Release pointer capture
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture may have already been released
      }
      setIsDragging(false);
      lastInteractionTimeRef.current = performance.now();
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
    }
    let newPosition = sliderPosition;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      newPosition = Math.max(0, sliderPosition - 5);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      newPosition = Math.min(100, sliderPosition + 5);
    } else if (e.key === 'Home') {
      newPosition = 0;
    } else if (e.key === 'End') {
      newPosition = 100;
    }
    setSliderPosition(newPosition);
    syncElapsedToPosition(newPosition);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${beforeLabel} / ${afterLabel}`}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDragStart={(e) => e.preventDefault()}
      className={`relative w-full h-[220px] sm:h-[360px] md:h-[560px] rounded-2xl overflow-hidden select-none touch-pan-y cursor-ew-resize border border-white/10 bg-[#151517] shadow-xl focus:outline-none focus:ring-2 focus:ring-white/40 ${className}`}
    >
      {/* AFTER image (Full background layer, pointer events disabled to prevent ghost drag) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
        <Image
          src={afterImage}
          alt={afterLabel}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover object-center pointer-events-none select-none"
          draggable={false}
        />
      </div>

      {/* BEFORE image (Clipped top layer with polygon, pointer events disabled) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          WebkitClipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <Image
          src={beforeImage}
          alt={beforeLabel}
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover object-center pointer-events-none select-none"
          draggable={false}
        />
      </div>

      {/* Vertical luminous white slider divider line */}
      <div
        className="absolute top-0 bottom-0 z-20 w-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.7),0_0_2px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Soft-cornered rectangle grab handle with Apple Liquid Glass effect */}
        <div
          className="absolute top-1/2"
          style={{
            transform: `translate(-${sliderPosition}%, -50%)`,
          }}
        >
          <div
            className={`w-10 h-10 rounded-xl bg-white/90 backdrop-blur-xl border border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.08)] flex items-center justify-center text-neutral-800 transition-transform duration-150 ${
              isDragging ? 'scale-110 shadow-2xl bg-white' : 'hover:scale-105'
            }`}
          >
            <MoveHorizontal className="w-4 h-4 text-neutral-800" />
          </div>
        </div>
      </div>

      {/* Subtle instructional hint at the bottom (Apple Liquid Glass pill) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3.5 py-1.5 rounded-lg bg-neutral-950/70 backdrop-blur-md border border-white/15 text-[11px] font-medium tracking-wide text-white/90 pointer-events-none select-none shadow-md">
        {instructionLabel || `${beforeLabel} / ${afterLabel}`}
      </div>
    </div>
  );
}

