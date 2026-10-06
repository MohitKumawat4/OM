'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { experienceCopy, siteConfig } from '@/config/site';
import PageHeading from '@/components/content/PageHeading';
import QuoteForm from '@/components/ui/QuoteForm';

export default function ContactClient() {
  const [service, setService] = useState('');

  useEffect(() => {
    const frame = requestAnimationFrame(
      () => setService(new URLSearchParams(window.location.search).get('service') || '')
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  const c = siteConfig.contact;

  return (
    <div className="content-page contact-page">
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

      <PageHeading {...experienceCopy.pages.contact} />

      <div className="contact-layout">
        {/* Left Column: Direct Communication Channels */}
        <div className="contact-details">
          <a href={`tel:+91${c.phone1.raw}`}>
            <span className="contact-icon-wrap"><Phone size={20} /></span>
            <div>
              <span>{c.phone1.name} · {c.phone1.role}</span>
              <strong>{c.phone1.display}</strong>
            </div>
            <ArrowUpRight size={18} />
          </a>

          <a href={`tel:+91${c.phone2.raw}`}>
            <span className="contact-icon-wrap"><Phone size={20} /></span>
            <div>
              <span>{c.phone2.name}</span>
              <strong>{c.phone2.display}</strong>
            </div>
            <ArrowUpRight size={18} />
          </a>

          <a href={`mailto:${c.email}`}>
            <span className="contact-icon-wrap"><Mail size={20} /></span>
            <div>
              <span>{experienceCopy.email}</span>
              <strong>{c.email}</strong>
            </div>
            <ArrowUpRight size={18} />
          </a>

          <a href={c.googleMapsSearchUrl} target="_blank" rel="noopener noreferrer">
            <span className="contact-icon-wrap"><MapPin size={20} /></span>
            <div>
              <span>{experienceCopy.location}</span>
              <strong>{c.address}</strong>
            </div>
            <ArrowUpRight size={18} />
          </a>

          <a href={c.whatsappLink} target="_blank" rel="noopener noreferrer">
            <span className="contact-icon-wrap"><MessageCircle size={20} /></span>
            <div>
              <span>{experienceCopy.whatsapp}</span>
              <strong>{experienceCopy.form.description}</strong>
            </div>
            <ArrowUpRight size={18} />
          </a>
        </div>

        {/* Right Column: Fast Quote Form */}
        <div className="contact-form-panel">
          <p className="eyebrow">{experienceCopy.pages.contact.eyebrow}</p>
          <h2>{experienceCopy.form.title}</h2>
          <QuoteForm key={service} initialService={service} />
        </div>
      </div>
    </div>
  );
}
