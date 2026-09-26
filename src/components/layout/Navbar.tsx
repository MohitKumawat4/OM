'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { siteConfig, experienceCopy } from '@/config/site';

/**
 * Calculates the scroll position threshold where the lower sections begin.
 * - On the homepage: activates when the viewport reaches .home-continuation (Transformation Section and below).
 * - On content pages: activates after scrolling past the top hero banner (>80px).
 */
function getLowerSectionsThreshold(): number {
  if (typeof window === 'undefined') return 80;
  const continuation = document.querySelector('.home-continuation');
  if (continuation) {
    const rect = continuation.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    // Activate retraction once the continuation section approaches the viewport
    return Math.max(80, absoluteTop - window.innerHeight * 0.35);
  }
  return 80;
}

export default function Navbar(){
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [isRetracted, setIsRetracted] = useState(false);
  const lastScrollYRef = useRef(0);

  // Adjust state during render when route changes (React 19 pattern to avoid cascading renders)
  const [prevPath, setPrevPath] = useState(path);
  if (prevPath !== path) {
    setPrevPath(path);
    setIsRetracted(false);
    setOpen(false);
  }

  // Handle scroll-based retraction over lower sections with reverse-scroll reveal
  useEffect(() => {
    let ticking = false;
    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const lastScrollY = lastScrollYRef.current;
          const delta = currentScrollY - lastScrollY;

          // Guard against iOS rubber-band overscroll at the top
          if (currentScrollY <= 0) {
            setIsRetracted(false);
            lastScrollYRef.current = 0;
            ticking = false;
            return;
          }

          const threshold = getLowerSectionsThreshold();

          // Above lower sections (e.g. inside the 3D storefront hero), always keep navbar visible
          if (currentScrollY < threshold) {
            setIsRetracted(false);
          } else if (Math.abs(delta) >= 8) {
            // Over lower sections:
            // - Scrolling down: retract navbar to maximize viewable canvas
            // - Reverse scroll (scrolling up): reveal navbar immediately
            if (delta > 0) {
              setIsRetracted(true);
            } else {
              setIsRetracted(false);
            }
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [path]);

  // Ensure header is never retracted when the mobile menu is open
  const isHeaderRetracted = isRetracted && !open;

  return (
    <header
      className={`site-header ${isHeaderRetracted ? 'is-retracted' : ''}`}
      onFocusCapture={() => setIsRetracted(false)}
    >
      <a className="skip-link" href="#main-content">
        {experienceCopy.navigation.skip}
      </a>
      <Link href="/" className="brand-lockup" aria-label={experienceCopy.navigation.home}>
        <Image src={siteConfig.brand.logo} alt="" width={36} height={36} priority />
        <span>
          OM <b>ADVERTISING</b>
          <small>CHOMU · JAIPUR</small>
        </span>
      </Link>
      <nav className={open ? 'site-nav is-open' : 'site-nav'} aria-label={experienceCopy.navigation.main}>
        {siteConfig.navigation.map(item => {
          const isActive = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="nav-link-text">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <Link href="/contact" className="header-quote" onClick={() => setOpen(false)}>
        <span>{experienceCopy.navigation.talk}</span>
        <span className="header-quote-icon" aria-hidden="true">
          <ArrowUpRight size={14} />
        </span>
      </Link>
      <button
        className="menu-toggle"
        aria-label={open ? experienceCopy.navigation.close : experienceCopy.navigation.open}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  );
}
