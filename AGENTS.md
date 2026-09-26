<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# OM Advertising — Agent Operating Guidelines & Specification (v1.3)

## Execution rules — scope, efficiency, and completion

- Execute the user's requested change directly. For small tasks, inspect only relevant files and required guidance, then make the smallest complete change. Keep planning and investigation proportional to the task.
- Do not expand the task into redesigns, refactors, audits, unrelated fixes, or multiple alternatives unless requested or necessary to complete the requested outcome.
- Apply the project specifications to the affected work. A minor edit does not require reworking or revalidating the entire website.
- Do not delegate or spawn sub-agents unless the user requests it.
- Ask questions only when missing information blocks correct execution. Use reasonable judgment for routine implementation choices and continue work already authorized.
- Use relevant skills when required or helpful; avoid loading unrelated skills or repeating guidance already read during the task.
- Run proportionate verification and any required checks. For documentation-only edits, inspect the diff; do not run application builds or tests. Repeat or broaden checks only when changes, failures, or unresolved concerns justify doing so.
- For visual changes, follow the supplied reference and explicit requirements closely, verify the affected rendered result against them, and do not substitute an unsolicited design direction.
- Stop when the requested outcome is complete and verified. Do not add speculative polish or extra work after completion.
- Keep progress updates and the final response brief. State what changed, how it was verified, and any actual blocker or material limitation.

## Customer showroom direction (user clarification)

The homepage presents a finished **customer** storefront incorporating OM's signage, boards, printing, lighting, cladding, and interior branding. OM's own shop is not the setting. The concept scene uses “YOUR BRAND” and is identified as illustrative. The user approved a revised approach: only chapters 1–3 share a continuous exterior 3D camera path (wide view → detailed sign approach → pullback). The camera never enters the showroom. Chapters 4–8 use ordinary document flow with restrained CSS/scroll effects. No mandatory stops, snapping or scene resets within the 3D sequence. Preserve mobile, tablet, desktop, large-screen and ultrawide compositions and a complete reduced-motion fallback. Preserve all eight original files in `src/components/home/`; the user explicitly forbids deleting them and permits redesigning/reusing chapters 4–8. Stop WebGL rendering when settled, offscreen or in a hidden tab, and verify budgets rather than promising frame rates.

This document is the authoritative project specification and operational rulebook for the **OM Advertising** marketing/showcase website. Any agent working on this codebase must strictly adhere to these rules.

---

## 1. Project Overview & Core Positioning

- **Brand**: OM Advertising (Chomu, Jaipur)
- **Positioning Statement**: *"Make Your Brand Impossible to Miss."*
- **Supporting Concept**: *"Signage. Printing. Complete Brand Visibility."*
- **Mission**: Position OM Advertising as an all-in-one physical branding partner (storefront transformations, illuminated signage, space branding, high-end printing, promotional collateral)—not just a local print shop.
- **Architecture**: Next.js App Router (TypeScript, Tailwind CSS). Strictly frontend/static showcase.
- **Out of Scope**: No authentication, no database, no e-commerce checkout/cart, no admin CMS.

---

## 2. Mandatory Design Benchmark: Squarespace Reference Rule

- **Primary Quality Benchmark**: [Squarespace.com](https://www.squarespace.com/)
- **Visual Goal**: The website must feel like a **cinematic digital showroom** exhibiting signage, lighting, materials, and storefront transformations.
- **Key Principles**:
  - **Media as Environment**: Use full-bleed imagery and atmospheric background video rather than small card thumbnails.
  - **Visual Chapters**: Each homepage section is a distinct visual chapter with its own scale, rhythm, and layout.
  - **Narrative Flow**: Claim → Visual Proof → Explanation → Contextual CTA.
  - **Editorial Typography**: Large display typography with intentional line breaks and generous whitespace.
  - **Horizontal Storytelling**: Prefer interactive category switchers, horizontal rails, or swipeable collections over repetitive vertical card grids.
  - **Visual Restraint**: Keep the UI quiet and elegant so the physical branding work is the hero. Never copy Squarespace branding/copy/layouts directly; adapt its design principles to OM Advertising.

---

## 3. Visual Design System & Tokens

### Color Palette
- **Background**: `#0B0B0C` (Deep Charcoal / Primary Dark Canvas)
- **Surfaces**: `#151517` (Cards, panels, navbars) & `#1D1D20` (Elevated / hover surfaces)
- **Borders**: `#343438` (Subtle, refined borders)
- **Primary Text**: `#F5F2EA` (Warm editorial white for display and headings)
- **Secondary Text**: `#A8A5A0` (Muted warm gray for descriptions)
- **Brand Accent (Gold)**: `#D6A84F` & `#E7C77A` (Highlights, icons, active borders, key CTA accents)
- **Logo Spectrum**: Controlled accent only (derived from the OM logo mark for subtle light glows or reflections). **NEVER use rainbow UI backgrounds or neon gradient panels.**

### Typography & UI Styling
- Modern, geometric sans-serif with high contrast between oversized display headings (weights 600–800) and readable body copy (1–3 concise sentences per block).
- Moderate border radiuses (`rounded-xl` / `rounded-2xl`), subtle glassmorphism (`backdrop-blur-md`), and restrained depth shadows.

---

## 4. Homepage Narrative Architecture (8 Visual Chapters)

The homepage must be built in this exact narrative sequence:

1. **Chapter 01 (H01 — Cinematic Hero)**:
   - Full-bleed atmospheric background video or high-resolution illuminated signage visual.
   - Dark gradient overlay ensuring contrast.
   - Headline: *"Make Your Brand Impossible to Miss."*
   - Supporting copy: *"Signage. Printing. Complete Brand Visibility."*
   - Primary CTA (`Get a Quote` → `/contact`) + Secondary CTA (`Explore Our Work` → `/work` or `#services`).
   - Mandatory poster/still fallback for slow networks and reduced-motion.

2. **Chapter 02 (H02 — Complete Branding Solutions)**:
   - Editorial typography statement: *"Your Brand Deserves to Be Seen."*
   - 4 High-Level Categories: **Signage**, **Space Branding**, **Printing**, **Business & Promotional**.

3. **Chapter 03 (H03 — What We Create / Core Services)**:
   - Interactive category showcase with large dynamic media panel rather than a static 8-card grid.
   - Highlight core offerings: Acrylic 3D Letters, LED Sign Boards, ACP Cladding, PVC Panel Interior/Exterior, Eco-Solvent/Flex Printing, Retro Signs.

4. **Chapter 04 (H04 — From Space to Brand / Transformation)**:
   - Interactive Before/After slider (raw unfinished building vs. modern branded storefront with ACP cladding and illuminated signage from reference creatives).
   - Contextual CTA: *"Transform My Space"*.

5. **Chapter 05 (H05 — Why OM Advertising / Trust & Craftsmanship)**:
   - 4 Core Principles: *Designed to Stand Out*, *Quality Materials*, *Complete Branding Under One Roof*, *Timely Delivery*.
   - Minimalist, trust-oriented layout with subtle micro-interactions.

6. **Chapter 06 (H06 — Our Work / Digital Gallery)**:
   - Immersive portfolio gallery / horizontal rail with large visuals, category tags, counter (`01 / 06`), and lightbox support.

7. **Chapter 07 (H07 — How It Works / Process Journey)**:
   - 4-Step Journey: `01 Tell Us What You Need` → `02 We Design` → `03 We Make It` → `04 We Deliver & Install`.
   - Active-step progress indicator on scroll or click.

8. **Chapter 08 (H08 — Final CTA)**:
   - Cinematic closing section with direct conversion actions: `Get a Quote`, `Call Now`, `WhatsApp Chat`.
   - Verified contact details repeated cleanly.

---

## 5. Information Architecture & Sitemap

- `/` — Primary conversion landing page (8 narrative chapters)
- `/services` — Full categorized service catalog with detailed descriptions and direct quote actions
- `/work` — Full visual gallery / portfolio with category filtering and lightbox
- `/about` — Brand story, craftsmanship principles, and Chomu facility overview
- `/contact` — Direct contact cards (Phone, WhatsApp, Email, Map location, Quick Quote Form opening WhatsApp/Email)

---

## 6. Centralized Content & Configuration Architecture

- All content, business details, navigation links, services, copy, and media paths must reside in a centralized configuration layer (`src/config/site.ts`).
- **Verified Business Facts (Never change or hallucinate)**:
  - **Business**: OM Advertising
  - **Location**: Near Power House, Renwal Road, Chomu, Jaipur
  - **Phone 1**: `9799852206` (Banti Kumawat - Owner)
  - **Phone 2**: `9829537889` (Mukesh Kumawat)
  - **Email**: `omadvertisingchomu@gmail.com`
- **Factual Integrity Rule**:
  - **NEVER** fabricate years of experience, fake client counts, awards, certifications, or fictional client names.
  - Treat all mockup signs from posters as illustrative examples unless confirmed.

---

## 7. Responsive Mobile Composition & Motion Rules

- **Mobile First-Class Composition**:
  - **Never blindly stack 6–8+ cards vertically on mobile.**
  - Use touch-friendly horizontal swipe carousels (`snap-x snap-mandatory`), tabs, progressive reveals, or single-active card selectors.
  - Maintain a strict mobile vertical page-length budget (each section communicates its core idea within 1–2 viewports).
- **Motion & Accessibility**:
  - Use smooth, purposeful scroll reveals (`IntersectionObserver`) and subtle dimensional hover effects (`translate`, `scale`, `opacity`).
  - Strict compliance with `prefers-reduced-motion` (disable non-essential parallax, auto-rotation, and heavy animations).
  - All carousels and tabs must remain keyboard-navigable with visible focus indicators.
  - Zero cumulative layout shift (CLS) and zero horizontal overflow.

---

## 8. Asset Management & Reference Creatives

- Product reference creatives in `/images` provide real assets:
  - OM Logo & brand mark
  - Actual OM Advertising facility in Chomu (ACP cladding & signage)
  - Before/After storefront transformation photos
  - High-resolution machinery and sample signage shots
- Crop and extract clean product/project visuals rather than embedding full text-heavy posters as raw backgrounds.
