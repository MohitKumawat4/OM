'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowDownRight, ArrowUpRight, Layers } from 'lucide-react';
import { mobilePortfolioCopy as copy, portfolioSpotlights as items } from '@/config/site';
import './mobile-portfolio.css';

const number = (index: number) => String(index + 1).padStart(2, '0');

/** A rotating deck of real project prints, animated only in response to a tap. */
export default function MobilePortfolioShowcase() {
  const [deck, setDeck] = useState(() => items.map((_, index) => index));
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const selected = deck[0];
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const photos = useRef<(HTMLImageElement | null)[]>([]);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const busy = useRef(false);
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusFront = useRef(false);

  // Gesture tracking for left/right sliding (swipe)
  const gestureStartX = useRef<number | null>(null);
  const gestureStartY = useRef<number | null>(null);
  const swiped = useRef(false);

  useEffect(() => () => {
    generation.current++;
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (focusFront.current) {
      buttons.current[selected]?.focus({ preventScroll: true });
      focusFront.current = false;
    }
  }, [selected]);

  const finishShuffle = (run: number) => {
    if (run !== generation.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    busy.current = false;
    setOutgoing(null);
  };

  const shuffle = async () => {
    // Extra taps or slides never build up a queue of animations.
    if (busy.current || deck.length < 2) return;
    busy.current = true;
    const run = ++generation.current;
    const nextImage = photos.current[deck[1]];
    // Back cards lazy-load alongside the front. Await a slow incoming image
    // before revealing it; direct project selection can cancel this wait.
    if (nextImage && !nextImage.complete) {
      try { await nextImage.decode(); } catch { /* Keep navigation available on an image error. */ }
    }
    if (run !== generation.current) return;
    focusFront.current = document.activeElement === buttons.current[selected];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setOutgoing(reducedMotion ? null : selected);
    setDeck([...deck.slice(1), selected]);
    if (reducedMotion) busy.current = false;
    else timer.current = setTimeout(() => finishShuffle(run), 950);
  };

  // Touch handlers for mobile swipe (left or right slide)
  const handleTouchStart = (event: React.TouchEvent) => {
    gestureStartX.current = event.touches[0].clientX;
    gestureStartY.current = event.touches[0].clientY;
    swiped.current = false;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (gestureStartX.current === null || gestureStartY.current === null) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - gestureStartX.current;
    const deltaY = touch.clientY - gestureStartY.current;

    // Minimum horizontal swipe distance of 35px, ensuring horizontal movement dominates vertical scroll
    if (Math.abs(deltaX) >= 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      swiped.current = true;
      shuffle();
      // Reset swipe flag after click event window passes
      setTimeout(() => {
        swiped.current = false;
      }, 120);
    }
    gestureStartX.current = null;
    gestureStartY.current = null;
  };

  // Mouse handlers for desktop/DevTools drag emulation
  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button !== 0) return;
    gestureStartX.current = event.clientX;
    gestureStartY.current = event.clientY;
    swiped.current = false;
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    if (gestureStartX.current === null || gestureStartY.current === null) return;
    const deltaX = event.clientX - gestureStartX.current;
    const deltaY = event.clientY - gestureStartY.current;

    if (Math.abs(deltaX) >= 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      swiped.current = true;
      shuffle();
      setTimeout(() => {
        swiped.current = false;
      }, 120);
    }
    gestureStartX.current = null;
    gestureStartY.current = null;
  };

  // Ignore synthetic click event that was already handled as a swipe gesture
  const handlePhotoClick = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    shuffle();
  };

  const selectProject = (index: number) => {
    generation.current++;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    busy.current = false;
    focusFront.current = false;
    setOutgoing(null);
    setDeck(current => {
      const position = current.indexOf(index);
      return [...current.slice(position), ...current.slice(0, position)];
    });
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? (index + 1) % items.length
      : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? (index + items.length - 1) % items.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    selectProject(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mp-showcase">
      <div className="mp-collection-line"><span>{copy.collection}</span><span aria-hidden="true">{number(selected)} / {String(items.length).padStart(2, '0')}</span></div>
      <div
        className="mp-print-stack"
        role="tabpanel"
        id="mp-project-panel"
        aria-labelledby={`mp-project-${selected}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onDragStart={event => event.preventDefault()}
      >
        {items.map((item, index) => {
          const depth = deck.indexOf(index);
          const front = depth === 0;
          const note = index === items.length - 1 ? copy.facilityNote : copy.note;
          return <article key={item.id} className={`mp-print${outgoing === index ? ' mp-print-outgoing' : outgoing !== null && front ? ' mp-print-incoming' : ''}`} data-depth={depth} aria-hidden={!front} inert={!front}
            onAnimationEnd={event => {
              if (event.target === event.currentTarget && event.animationName === 'mp-send-to-back' && outgoing === index) finishShuffle(generation.current);
            }}>
            <button
              ref={element => { buttons.current[index] = element; }}
              className="mp-photo"
              type="button"
              onClick={handlePhotoClick}
              tabIndex={front ? 0 : -1}
              aria-disabled={outgoing !== null}
              aria-label={`${copy.shuffle}: ${items[deck[1]].shortTitle}`}
            >
              <Image
                ref={element => { photos.current[index] = element; }}
                src={copy.images[index]}
                alt={item.title}
                fill
                unoptimized
                sizes="(max-width: 767px) 85vw, 1px"
                className={`mp-photo-image${item.id === 'p-1' ? ' mp-photo-crop' : ''}`}
                draggable={false}
              />
              <span className="mp-photo-action" aria-hidden="true"><Layers size={20} strokeWidth={1.5} /></span>
            </button>
            <div className="mp-print-caption">
              <span className="mp-print-number" aria-hidden="true">{number(index)}</span>
              <div><span className="mp-category">{item.shortCategory}</span><h3>{item.shortTitle}</h3><p>{note}</p></div>
            </div>
          </article>;
        })}
      </div>
      <span className="mp-announcement" aria-live="polite" aria-atomic="true">{items[selected].shortTitle}, {number(selected)} / {String(items.length).padStart(2, '0')}</span>
      <div className="mp-index-heading"><p>{copy.prompt}</p><ArrowDownRight size={18} aria-hidden="true" /></div>
      <div className="mp-index" role="tablist" aria-label={copy.indexLabel}>
        {items.map((project, index) => <button
          key={project.id}
          ref={element => { tabs.current[index] = element; }}
          type="button"
          role="tab"
          id={`mp-project-${index}`}
          aria-controls="mp-project-panel"
          aria-selected={selected === index}
          tabIndex={selected === index ? 0 : -1}
          onClick={() => selectProject(index)}
          onKeyDown={event => onTabKeyDown(event, index)}
        ><span className="mp-tab-number">{number(index)}</span><span>{project.shortTitle}</span><ArrowUpRight size={13} aria-hidden="true" /></button>)}
      </div>

    </div>
  );
}
