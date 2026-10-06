'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { siteConfig, experienceCopy } from '@/config/site';

export default function Navbar(){
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);

  // Close mobile navigation drawer on route change
  const [prevPath, setPrevPath] = useState(path);
  if (prevPath !== path) {
    setPrevPath(path);
    setOpen(false);
  }

  // Persistent header tracking:
  // 1. Detect scroll position for compact frosted-glass treatment (> 24px)
  // 2. On homepage, dynamically track if viewport has entered light continuation sections
  //    (between .home-continuation and .om-cta-stage) and adapt header theme accordingly
  // 3. On content pages (/services, /work, /about, /contact), always stay light theme
  useEffect(() => {
    let ticking = false;

    const updateHeaderState = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 24);

      if (path !== '/') {
        // Content pages are always warm light theme
        setIsLightSection(true);
        ticking = false;
        return;
      }

      // Homepage dynamic theme detection:
      // Hero (0 -> continuationTop): Dark theme
      // Continuation (continuationTop -> ctaTop): Light theme
      // Final CTA (ctaTop -> bottom): Dark theme
      const continuation = document.querySelector('.home-continuation') as HTMLElement | null;
      const cta = document.querySelector('.om-cta-stage') as HTMLElement | null;

      if (!continuation) {
        setIsLightSection(false);
        ticking = false;
        return;
      }

      const continuationTop = continuation.offsetTop;
      const ctaTop = cta ? cta.offsetTop : Infinity;
      const headerFocusY = scrollY + 45;

      const overLightSection = headerFocusY >= continuationTop && headerFocusY < ctaTop;
      setIsLightSection(overLightSection);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateHeaderState();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [path]);

  const showLightTheme = path !== '/' || isLightSection;

  return (
    <header
      className={`site-header ${isScrolled ? 'is-scrolled' : ''} ${showLightTheme ? 'is-light-theme' : ''}`}
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
