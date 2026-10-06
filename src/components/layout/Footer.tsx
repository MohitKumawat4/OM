'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

/**
 * Global Site Footer Bar
 * High-contrast responsive bar inspired by the Ultima showroom design:
 * - Adapts to dark showroom canvas on homepage (`is-home-footer`)
 * - Retains warm light atelier styling on content pages (/services, /work, etc.)
 * - Brand badge & typography on the left
 * - Workshop / brand visibility positioning statement in the center
 * - Clean navigation links, direct contact, and copyright on the right
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <footer className={`om-bottom-bar ${isHome ? 'is-home-footer' : ''}`} role="contentinfo">
      <div className="om-bottom-inner">
        {/* Left: Brand Monogram Badge & Name */}
        <Link href="/" className="om-bottom-brand" aria-label="OM Advertising Home">
          <Image src={siteConfig.brand.logo} alt="" width={26} height={26} className="om-footer-logo" />
          <span className="om-brand-name">OM ADVERTISING</span>
        </Link>

        {/* Center: Brand Positioning Statement & Workshop Location */}
        <p className="om-bottom-tagline">
          Signage. Printing. Complete Brand Visibility. · Chomu, Jaipur
        </p>

        {/* Right: Site Navigation, Direct Contact Link & Copyright */}
        <div className="om-bottom-links">
          <Link href="/services">Services</Link>
          <Link href="/work">Our Work</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact" className="om-contact-link">
            <span>Contact</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
          <span className="om-bottom-copy">© {currentYear} OM Advertising</span>
        </div>
      </div>
    </footer>
  );
}

