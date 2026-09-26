'use client';

import React, { useState } from 'react';
import {
  Check,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  Phone,
} from 'lucide-react';
import QuickQuoteModal from '@/components/ui/QuickQuoteModal';
import Reveal from './Reveal';

/**
 * Technical specification data for the 4-step OM physical branding workflow.
 * Tailored to in-house signage fabrication, CNC routing, ACP cladding, and large-format printing.
 */
interface ProcessStageDetail {
  step: string;
  name: string;
  shortNav: string;
  timeframe: string;
  headline: string;
  description: string;
  checklist: string[];
  specs: {
    focus: string;
    materials: string;
    turnaround: string;
    qualityGate: string;
  };
  craftsmanQuote: string;
}

const WORKFLOW_STAGES: ProcessStageDetail[] = [
  {
    step: '01',
    name: 'Site Analysis & Brief',
    shortNav: 'Site Analysis',
    timeframe: 'Day 01',
    headline: 'We inspect, measure, and plan.',
    description:
      'Share your business type, storefront photos, approximate dimensions, and branding goals over a quick call or WhatsApp message. We immediately audit wall structural integrity, wind exposure, and sightlines.',
    checklist: [
      'Storefront dimension audit & structural wall inspection',
      'Day and evening pedestrian viewing angle feasibility check',
      'Same-day transparent material recommendation & itemized estimate',
    ],
    specs: {
      focus: 'Architectural Scope & Facade Dimensions',
      materials: 'Site Photos, Vector Logo, Rough Measurements',
      turnaround: 'Same-Day Initial Consultation',
      qualityGate: 'Initial Elevation Viability Pass',
    },
    craftsmanQuote:
      'We start with the building’s real geometry — ensuring every millimeter of your ACP sheet and lettering fits the facade with zero on-site gaps.',
  },
  {
    step: '02',
    name: 'CAD & Visual Elevation',
    shortNav: 'CAD & 3D Mockup',
    timeframe: 'Days 02–03',
    headline: 'We model your storefront in 3D.',
    description:
      'We create architectural 2D and 3D storefront elevations showing letter scale, day vs. night illumination simulations, and ACP sheet nesting joints before cutting a single panel.',
    checklist: [
      'Exact 2D architectural scale & 3D daylight storefront mockups',
      '3000K warm vs. 6500K crisp cool white LED illumination simulation',
      'Physical material swatches: ACP gauge, acrylic finish & LED specs',
    ],
    specs: {
      focus: 'CAD Drafting & Elevation Scale Simulation',
      materials: 'Modular Sheet Nesting & Color Coding',
      turnaround: '24 to 48 Hours',
      qualityGate: 'Digital PDF Elevation Sign-off',
    },
    craftsmanQuote:
      'Nothing is left to guesswork. You see exactly how your signage glows at dusk and stands out in full daylight before production begins.',
  },
  {
    step: '03',
    name: 'In-House CNC Fabrication',
    shortNav: 'Workshop Fabrication',
    timeframe: 'Days 04–06',
    headline: 'We shape, route, and illuminate.',
    description:
      'Every acrylic letter is routed on our heavy-duty CNC machinery, composite panels are grooved, waterproof Samsung IP67 LED modules are wired, and high-resolution flex graphics are printed under one roof in Chomu.',
    checklist: [
      'Heavy-duty CNC router profiling with ±0.5mm precision cutting',
      'IP67 waterproof Samsung LED modules & Mean Well power drivers',
      'Continuous 24-hour illuminated burn-in testing before dispatch',
    ],
    specs: {
      focus: 'CNC Routing, Laser Cutting & Electronics',
      materials: 'Virgin Cast Acrylic & Exterior Grade ACP',
      turnaround: '3 to 5 Business Days',
      qualityGate: '24-Hour Continuous LED Burn-In',
    },
    craftsmanQuote:
      'Fabricated entirely in-house at our Chomu facility — zero middlemen, ensuring razor-sharp letter edges, uniform light dispersion, and genuine local accountability.',
  },
  {
    step: '04',
    name: 'Delivery & Professional Installation',
    shortNav: 'Fitting & Handover',
    timeframe: 'Day 07',
    headline: 'We anchor, wire, and power up.',
    description:
      'Our experienced fitting team handles transport, heavy structural anchoring, wind load bracing, concealed internal electrical connections, and final evening illumination handoff.',
    checklist: [
      'Galvanized structural anchoring & wind-load bracing',
      'Concealed internal electrical conduit & surge protection',
      'Complete night-time illumination sign-off & warranty handover',
    ],
    specs: {
      focus: 'On-Site Rigging & Illumination Commissioning',
      materials: 'Galvanized Anchors & Weatherproof Fasteners',
      turnaround: 'Scheduled 1-Day On-Site Installation',
      qualityGate: 'Full Power & Weatherproof Audit',
    },
    craftsmanQuote:
      'We don’t leave the site until every LED module lights up perfectly, joints are clean, and you have complete peace of mind.',
  },
];

/**
 * Chapter 07: Process Section — Warm Architectural Atelier
 * Warm Alabaster (#FAF8F5), Porcelain White (#FFFFFF), and Sand Linen (#F5F1E9).
 * Seamlessly continuous with Chapter 05 and Chapter 06.
 */
export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const stage = WORKFLOW_STAGES[activeStep];

  // Keyboard navigation between tabs
  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (idx + 1) % 4;
    else if (e.key === 'ArrowLeft') next = (idx + 3) % 4;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 3;

    if (next !== null) {
      e.preventDefault();
      setActiveStep(next);
      document.getElementById(`proc-stage-tab-${next}`)?.focus();
    }
  };

  return (
    <section id="process" className="home-section om-process-warm" aria-label="Our Transformation Process">
      {/* Editorial Header */}
      <Reveal className="om-proc-header">
        <span className="om-proc-eyebrow">07 / HOW YOUR STOREFRONT TAKES SHAPE</span>
        <div className="om-proc-title-row">
          <h2 className="om-proc-heading">
            From raw dimension <br />
            <span className="om-proc-heading-serif">to illuminated landmark.</span>
          </h2>
          <p className="om-proc-sub">
            Four transparent stages from your first WhatsApp photo to precision CNC fabrication
            and on-site illuminated fitting in Chomu and Jaipur.
          </p>
        </div>
      </Reveal>

      {/* Tactile Stepper Runway */}
      <div className="om-proc-stepper-wrap">
        <div className="om-proc-track-bar" aria-hidden="true">
          <div
            className="om-proc-track-fill"
            style={{
              width: '100%',
              transform: `scaleX(${(activeStep + 1) / 4})`,
            }}
          />
        </div>

        {/* Step Buttons */}
        <div className="om-proc-step-nav" role="tablist" aria-label="Storefront transformation stages">
          {WORKFLOW_STAGES.map((item, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={item.step}
                id={`proc-stage-tab-${idx}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="proc-showcase-panel"
                tabIndex={isActive ? 0 : -1}
                className={`om-proc-step-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveStep(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              >
                <span className="om-proc-step-badge">{item.step}</span>
                <div className="om-proc-step-texts">
                  <span className="om-proc-step-label">{item.shortNav}</span>
                  <span className="om-proc-step-time">{item.timeframe}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Showcase Stage: Dual-Wing Architectural Atelier */}
      <div
        id="proc-showcase-panel"
        role="tabpanel"
        aria-labelledby={`proc-stage-tab-${activeStep}`}
        className="om-proc-showcase-grid"
      >
        {/* Left Wing: Porcelain White Narrative Card with Claymorphic Depth */}
        <div key={`narrative-${stage.step}`} className="om-proc-narrative-card">
          {/* Subtle Numeric Watermark */}
          <div className="om-proc-watermark-num" aria-hidden="true">
            {stage.step}
          </div>

          <div>
            <span className="om-proc-phase-pill">
              STAGE {stage.step} OF 04 · {stage.name}
            </span>
            <h3 className="om-proc-card-heading">{stage.headline}</h3>
            <p className="om-proc-card-description">{stage.description}</p>

            {/* Checklist */}
            <ul className="om-proc-checklist">
              {stage.checklist.map((point) => (
                <li key={point} className="om-proc-check-row">
                  <span className="om-proc-check-icon">
                    <Check size={13} strokeWidth={2.6} />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Row */}
          <div className="om-proc-actions-row">
            <button
              type="button"
              className="om-proc-cta-btn"
              onClick={() => setQuoteModalOpen(true)}
              aria-label={`Discuss stage ${stage.step} with OM Advertising`}
            >
              <span>Discuss Stage {stage.step} With Us</span>
              <ArrowUpRight size={16} />
            </button>

            <a
              href="tel:9799852206"
              className="om-proc-contact-callout"
              aria-label="Call Banti Kumawat directly"
            >
              <Phone size={14} color="#8C6D46" />
              <span>Direct Call: 9799852206</span>
            </a>
          </div>
        </div>

        {/* Right Wing: Technical Workshop Spec Blueprint */}
        <div key={`blueprint-${stage.step}`} className="om-proc-blueprint-card">
          <div>
            <div className="om-proc-spec-top">
              <span className="om-proc-spec-tag">
                <Compass size={14} color="#8C6D46" />
                Workshop Specification
              </span>
              <span className="om-proc-live-node">CHOMU WORKSHOP</span>
            </div>

            {/* 2x2 Technical Metrics Grid */}
            <div className="om-proc-metrics-grid" style={{ marginTop: '20px' }}>
              <div className="om-proc-metric-box">
                <span className="om-proc-metric-label">Execution Focus</span>
                <span className="om-proc-metric-val">{stage.specs.focus}</span>
              </div>
              <div className="om-proc-metric-box">
                <span className="om-proc-metric-label">Materials & Inputs</span>
                <span className="om-proc-metric-val">{stage.specs.materials}</span>
              </div>
              <div className="om-proc-metric-box">
                <span className="om-proc-metric-label">Turnaround Window</span>
                <span className="om-proc-metric-val is-highlight">{stage.specs.turnaround}</span>
              </div>
              <div className="om-proc-metric-box">
                <span className="om-proc-metric-label">Quality Gate</span>
                <span className="om-proc-metric-val">{stage.specs.qualityGate}</span>
              </div>
            </div>
          </div>

          {/* Craftsman Guarantee Quote */}
          <div className="om-proc-quote-box">
            <p className="om-proc-quote-text">“{stage.craftsmanQuote}”</p>
            <div className="om-proc-signature-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={13} color="#8C6D46" />
                In-House Standard
              </span>
              <span>CHOMU, JAIPUR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Quote Modal */}
      <QuickQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialService={`Process: Stage ${stage.step} - ${stage.name}`}
      />
    </section>
  );
}


