import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Phone, MapPin } from 'lucide-react';
import { siteConfig, experienceCopy } from '@/config/site';
import PageHeading from '@/components/content/PageHeading';

export const metadata: Metadata = {
  title: 'About OM Advertising | Brand Visibility Workshop',
  description: experienceCopy.pages.about.description,
};

export default function AboutPage() {
  const copy = experienceCopy.pages.about;
  const c = siteConfig.contact;

  return (
    <div className="content-page about-page">
      {/* Background Animated SVG Drafting Halo */}
      <div className="warm-bg-ornament" aria-hidden="true">
        <svg width="420" height="420" viewBox="0 0 420 420" fill="none" className="warm-spin-slow">
          <circle cx="210" cy="210" r="190" stroke="#D6A84F" strokeWidth="1" strokeOpacity="0.18" strokeDasharray="6 8" />
          <circle cx="210" cy="210" r="150" stroke="#8C7A6B" strokeWidth="1.5" strokeOpacity="0.15" strokeDasharray="3 14" />
          <circle cx="210" cy="210" r="110" stroke="#C4A87C" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="210" y1="10" x2="210" y2="30" stroke="#D6A84F" strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" />
          <line x1="210" y1="390" x2="210" y2="410" stroke="#D6A84F" strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" />
          <line x1="10" y1="210" x2="30" y2="210" stroke="#D6A84F" strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" />
          <line x1="390" y1="210" x2="410" y2="210" stroke="#D6A84F" strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" />
        </svg>
      </div>

      <PageHeading {...copy} />

      {/* Facility & Story Showcase */}
      <div className="about-layout">
        <div className="about-image">
          <Image
            src={siteConfig.brand.facilityImage}
            alt={copy.facilityCaption}
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
            className="object-cover"
            priority
          />
          <span>{copy.facilityCaption}</span>
        </div>
        <div className="about-story">
          <p className="eyebrow">{siteConfig.brand.name}</p>
          <h2>{copy.facility}</h2>
          <p>{copy.story}</p>
          <div className="about-facility-meta">
            <span className="about-meta-item">
              <MapPin size={16} />
              {siteConfig.contact.address}
            </span>
          </div>
          <div className="about-action-row">
            <Link href="/contact" className="primary-action">
              {copy.cta}
              <ArrowUpRight size={17} />
            </Link>
            <a href={`tel:+91${c.phone1.raw}`} className="about-phone-action">
              <Phone size={15} />
              <span>{c.phone1.name}: {c.phone1.display}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Principles Section */}
      <div className="about-principles">
        {siteConfig.whyUs.map(item => (
          <article key={item.number}>
            <svg
              className="principle-corner"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 18 L4 4 L18 4" stroke="#C4A87C" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.35" />
            </svg>
            <span className="eyebrow">{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
