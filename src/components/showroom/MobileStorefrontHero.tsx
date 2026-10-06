import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Plus } from 'lucide-react';
import { experienceCopy, showroomConfig, storefrontConfig } from '@/config/site';
import './mobile-storefront.css';

const copy = storefrontConfig.mobileHero;

/** A server-rendered, single-image mobile composition with native document scrolling. */
export default function MobileStorefrontHero() {
  return (
    <div className="mobile-storefront">
      <section className="mobile-storefront-hero" id="arrival" aria-labelledby="mobile-storefront-title">
        <picture className="mobile-storefront-picture">
          <source media={copy.media} srcSet={copy.image} />
          <Image
            src={copy.emptyImage}
            alt={copy.imageAlt}
            width={copy.imageWidth}
            height={copy.imageHeight}
            loading="eager"
            fetchPriority="high"
            unoptimized
          />
        </picture>
        <div className="mobile-storefront-shade" aria-hidden="true" />
        <p className="mobile-storefront-eyebrow">{copy.eyebrow}</p>

        <div className="mobile-storefront-copy">
          <h1 id="mobile-storefront-title">
            {copy.headline.map((line, index) => <span key={line} className={index === 0 ? 'mobile-storefront-lead' : undefined}>{line}{index < copy.headline.length - 1 ? ' ' : ''}</span>)}
          </h1>
          <p className="mobile-storefront-description">
            {copy.supporting.map(line => <span key={line}>{line}{' '}</span>)}
          </p>
          <div className="mobile-storefront-actions">
            <Link className="mobile-storefront-quote" href={copy.primary.href}>
              {copy.primary.label}<ArrowUpRight size={19} aria-hidden="true" />
            </Link>
            <Link className="mobile-storefront-work" href={copy.secondary.href}>
              {copy.secondary.label}<ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="mobile-storefront-footnote">
            <span>{copy.caption}</span>
            <a href="#possibilities" aria-label={copy.discover}><ArrowDown size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section id="possibilities" className="mobile-storefront-overview" aria-labelledby="mobile-storefront-possibilities">
        <p className="mobile-storefront-section-label">{showroomConfig.chapters[1].eyebrow}</p>
        <h2 id="mobile-storefront-possibilities">{copy.categoriesTitle.split('\n').map(line => <span key={line}>{line}{' '}</span>)}</h2>
        <p className="mobile-storefront-overview-description">{copy.categoriesDescription}</p>
        <ul className="mobile-storefront-categories">
          {experienceCopy.categories.map(category => <li key={category}>{category}</li>)}
        </ul>
        <details id="details" className="mobile-storefront-services">
          <summary>
            <span><span className="mobile-storefront-section-label">{showroomConfig.chapters[2].eyebrow}</span><strong>{copy.servicesTitle}</strong></span>
            <Plus size={20} aria-hidden="true" />
          </summary>
          <ul>{showroomConfig.services.map(service => <li key={service.id}>
            <Link href={`${copy.primary.href}?service=${service.id}`}>{service.title}<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </li>)}</ul>
          <Link className="mobile-storefront-all-services" href={copy.servicesLink.href}>{copy.servicesLink.label}<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </details>
      </section>
    </div>
  );
}
