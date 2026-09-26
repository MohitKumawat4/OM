# OM Advertising — Exterior hero and animated editorial homepage

Approved direction: keep eight chapters, with one continuous exterior Three.js journey spanning chapters 1–3. Chapters 4–8 return to normal document flow and reuse the existing section components. The customer storefront reads **YOUR BRAND** and is explicitly illustrative. OM is the physical branding partner.

## Current implementation

- `StorefrontExperience.tsx` owns a three-chapter sticky stage, native scroll progress, navigation, service/category controls, and complete still mode. The old eight-chapter components remain available in the source tree.
- `StorefrontCanvas.tsx` loads an authored exterior asset. The camera approaches the fascia, inspects lettering and panel detail, then pulls away. It never enters the showroom. Camera travel remains continuous across chapter boundaries; there is no wheel interception or vertical snapping.
- `TransformationSection`, `WhyUsSection`, `PortfolioPreviewSection`, `ProcessSection`, and `FinalCtaSection` are redesigned in place. They provide a before/after comparison, material-focused accordion, large horizontal gallery/lightbox, selectable scroll-responsive process, and direct quote/contact actions.
- All eight original `src/components/home` section files are preserved. The old first three are currently unmounted; sections 4–8 are active. Old `ShowroomExperience`, `ShowroomCanvas`, and chapter implementation files are also retained.
- Content, verified business facts, media paths, camera landmarks, and rendering limits live in `src/config/site.ts`.

## Art direction and acceptance

The supplied photographic exterior remains the quality benchmark: dark architectural cladding, fine joints, dimensional illuminated lettering with metallic returns, warm depth behind glazing, detailed planting, and convincing road/paving materials. More primitive shapes alone do not establish realism.

The new asset pipeline starts from one authored Blender scene, joins compatible geometry, and bakes static diffuse illumination for browser use. Letters and trim retain physical materials. Source `.blend` files and offline light rigs are not shipped to visitors. The initial poster must use the same geometry and framing as the loaded asset; changing to an unrelated photographic concept at load would repeat the rejected mismatch.

Visual quality is not established by a successful build. Inspect the actual exported model and the final browser output at wide, near-board, and pulled-back poses. Compare them to the supplied benchmark. Do not call an architectural prototype photorealistic or production-ready until those checks support it.

## Responsive motion and performance

| Composition | Behavior |
| --- | --- |
| Mobile / touch | Taller exterior framing, readable lower copy, swipeable service tabs and gallery; compact pixel budget. |
| Tablet | Intermediate framing and typography, touch-friendly controls. |
| Desktop | Wide storefront composition with editorial copy and three chapter markers. |
| Large / ultrawide / high DPI | Bounded text widths and render pixel count; the drawing surface does not grow unchecked with device pixel ratio. |
| Reduced motion / failed WebGL / still mode | Static hero plus all service content in ordinary flow; chapters 4–8 remain usable. |

The canvas uses demand rendering, stops scheduling frames after camera movement settles, and skips drawing while its hero is offscreen or the tab is hidden. Static lighting is prepared offline; runtime rendering has no shadow maps, bloom passes, or glass-refraction render pass. Sustained slow moving frames can reduce resolution. Later content uses intersection-triggered reveals and short interaction transitions.

Configured drawing limits are 1.05 million pixels / DPR 1 for compact mode, 2.3 million pixels / DPR 1.35 for desktop, and 650,000 pixels / DPR 0.8 for the lower tier. These are limits, **not measured frame rates or a promise of zero lag**. A shorter three-chapter animation limits its active duration; asset complexity, fill rate, memory and device capability still determine each frame's cost.

## Validation and delivery

1. Validate camera clearance, continuity and reversible sampling; test drawing budgets and frame-stop conditions.
2. Run TypeScript, ESLint, tests and the Next.js static production build.
3. Record actual exported triangles, surface groups, texture dimensions and transfer size.
4. Inspect the exported exterior asset and a matching poster. Review browser motion, controls, keyboard focus, touch gestures, reduced motion, live resizing and failure recovery when computer access is available.
5. Measure frame rates, loading and memory on a named lower-end phone and laptop before promising performance. See `VALIDATION.md` for completed checks and current access limits.

## Historical implementation brief — superseded

The record below describes the previous eight-chapter interior walkthrough and its rejected visual quality. It is retained for history and reuse; the approved exterior-only scope above takes precedence wherever they differ.

# OM Advertising — Customer Showroom Experience

Status: **Visual acceptance failed.** The supplied screenshots show a photorealistic loading image being replaced by a visibly simplified WebGL blockout. The existing interaction code is implemented, but the intended showroom is not complete. Build and numerical camera checks do not establish visual quality. See `VALIDATION.md`.

## Visual correction — 14 September 2026

The first supplied screenshot is the rendering benchmark: charcoal architectural cladding, fine panel joints, warm illuminated lettering with visible returns, convincing glazing, a fully furnished interior, detailed foliage, and reflected light on stone and wet paving. These qualities must persist beyond loading and through the entrance. The second screenshot is a rejected prototype, not an acceptable lower quality preset.

Rebuild the environment as an architectural asset with physically meaningful materials and authored illumination. Produce and inspect actual exterior, entrance, interior, and portrait renders before treating it as a website-ready replacement. Retain one coherent building and the existing reversible camera journey. Model service details, interior displays, framed print work, lighting fixtures, handles, reveals, skirting, and material junctions at the distances the camera actually visits. Use licensed detailed context assets where suitable.

The loading poster must ultimately come from the same finished scene and camera as the live experience. Do not resolve the mismatch by lowering the poster's quality, hiding the model behind an image, delaying the downgrade, or assembling unrelated images into a supposed continuous 3D tour. A pre-rendered, scroll-scrubbed architectural sequence is an acceptable production alternative if it preserves this same continuous camera path and achieves the reference quality; ordinary image crossfades are not.

Acceptance requires a side-by-side visual check of the final render against the supplied benchmark, followed by responsive and motion verification. Until that passes, describe the environment as unfinished and keep deployment pending.

An offline replacement study now exists in `scripts/showroom/build_scene.py`, with repeatable inputs from `src/config/site.ts`. Its four actual Cycles inspection views are stored in `assets/showroom/review/`. They show improved physical depth, foliage and interior detail, but still fail the reference-quality requirement. The website's renderer has **not** been replaced by this study. `scripts/showroom/README.md` records the inspected defects and the remaining asset and integration work.

## 1. The experience we are building

Build a guided, scroll-controlled journey through a finished customer showroom whose facade, signage, graphics, cladding, and selected interior finishes demonstrate OM Advertising's services.

The visitor begins on the street, approaches the illuminated facade, examines the branded entrance, sees how the exterior was transformed, enters the showroom, and discovers the branding details inside. The journey ends with a clear invitation to transform their own business.

**Creative thesis: One finished space. Every OM service visible in context.**

The customer's showroom is the environment. OM Advertising is the company explaining its contribution through the website's navigation, captions, and enquiry actions. OM's logo must not appear as the tenant's storefront identity. Use the literal placeholder identity “YOUR BRAND” in the concept scene, with a discreet, readable “Concept visualization” label. Do not invent a customer name or imply that this concept is an actual commission.

The initial setting will be a contemporary retail showroom: a charcoal and bronze facade, warm illuminated lettering, glass entrance, restrained interior displays, a branded feature wall, and a consultation counter. Furniture and merchandise establish scale and context; service explanations attribute only the work within OM's documented scope. Architectural shell and furnishings are illustrative.

This is one uninterrupted camera journey controlled by normal scrolling. The eight chapters organize the story internally; crossing a chapter boundary must never stop the camera, restart an animation, or advance to a separate slide. Visitors control pauses by stopping their scroll or deliberately opening an inspection. They can reverse, skip to a chapter, or contact OM at any point. No introductory click is required to begin. Mobile, tablet, desktop, large, and ultrawide screens are first-class compositions of the same journey.

## 2. Existing project and changes required

The repository currently uses Next.js App Router, TypeScript, React 19, Tailwind, and Lucide, with an npm lockfile. Preserve that foundation and the existing five routes.

The current homepage mounts eight separate components in a vertical flex layout. Its hero uses a light split layout, and services use photo cards. There is no implemented 3D scene, camera path, or shared scroll timeline. The asset inventory contains photographs and reference creatives; no GLB, glTF, Blender scene, HDR environment, or walkthrough video was found in the project asset search.

Implementation must introduce a spatial rendering layer and an authored environment. Adding animation classes to the current sections cannot satisfy the intended camera journey.

Preserve the eight-chapter sequence in `AGENTS.md`, but interpret each chapter as a beat within the same customer space. Keep the original business facts, static showcase scope, route structure, accessibility requirements, and centralized content rule. The user's clarification that this is a customer showroom governs the setting.

During implementation, add that clarification and the spatial acceptance criteria to `AGENTS.md` so future changes retain the direction. Preserve its generated Next.js instruction block.

## 3. Art direction

- **Environment:** Believable architectural proportions, deep facade reveals, panel seams, letter thickness, grounded objects, and a continuous floor plane. The entrance and interior must agree spatially across every shot.
- **Lighting:** A blue-hour exterior with warm signage and interior light. Use restrained reflections and localized glow so lettering remains sharp. Interior lighting demonstrates branding integration without claiming full electrical or architectural design services.
- **Materials:** Charcoal ACP, controlled bronze accents, acrylic faces, metal letter returns, glass, printed graphics, and warm PVC panels. Distinguish them through roughness, depth, edge treatment, and lighting.
- **Interface:** Restore `#0B0B0C`, `#151517`, `#F5F2EA`, `#A8A5A0`, and the specified gold accents. Keep interface surfaces quiet and use contrast scrims only where needed for legibility.
- **Typography:** Retain the installed geometric sans-serif initially. Use the exact hero statement with deliberate line breaks, responsive display sizing, body text of at least 16px, and short service captions. Do not cover the product currently being examined.
- **Composition:** Full-viewport scene with asymmetrical text placement and changing camera distance. Avoid repeated boxed sections, ambient UI blobs, or decorative motion unrelated to the space.
- **Sound:** No automatic audio. The experience must communicate completely through image, motion, and text.

The supplied Squarespace screenshots inform visual scale, restrained typography, and media occupying the environment. Camera choreography must be specified independently because still screenshots do not document motion.

## 4. Eight-chapter storyboard

Percentages are initial allocations of the homepage journey's scroll distance, not timed playback or slide boundaries. They will be tuned using the working scene. Reading intervals use slower, continuing camera movement while the visitor scrolls, with captions staying readable long enough to understand. There are no mandatory holds, repeated ease-to-zero stops, or click-to-continue gates between chapters. Scrolling backward reconstructs the same continuous path.

| Chapter | Range | View and camera movement | OM contribution and interaction |
| --- | --- | --- | --- |
| H01 — Cinematic hero | 0–12% | Start across the street at a three-quarter angle. The complete customer facade and lit interior are visible. Move slowly toward the entrance, retaining foreground, midground, and background depth. | Exact headline: “Make Your Brand Impossible to Miss.” Supporting line: “Signage. Printing. Complete Brand Visibility.” `Get a Quote` links to `/contact`; `Explore Our Work` links to `/work`. A still of this same view appears immediately while 3D loads. |
| H02 — Complete branding | 12–23% | Continue the approach in a slow glide where the fascia, glazing, entrance promotion, and interior feature wall are visible together. Carry the incoming movement through the chapter boundary. | “Your Brand Deserves to Be Seen.” Four accessible category selectors identify Signage, Space Branding, Printing, and Business & Promotional. Selecting one highlights its contribution in the scene without starting a separate tour. |
| H03 — What we create | 23–40% | Track beside the entrance and tilt gently toward the main sign. Move through a short sequence of facade, letter-edge, window-graphic, and entrance-display details. | Show Acrylic 3D Letters, LED Sign Boards, ACP Cladding, PVC Panels, Eco-Solvent/Flex Printing, and Retro Signs through a single active service selector. PVC details can use a close-up inset from the interior. Selecting a service reveals its scene anchor, concise explanation, and contextual quote link. |
| H04 — From space to brand | 40–54% | Follow a shallow continuous arc away from the sign detail to widen the facade view, then curve toward the entrance. Compare the same building with one shared moving camera; before and after states remain aligned at every scroll position. | Scroll reveals the concept build-up: bare shell → cladding → graphics and lettering → illumination. A keyboard-operable before/after range control allows optional independent inspection without blocking progression. Label the sequence illustrative; a real photo pair is additional evidence only if verified. CTA: “Transform My Space.” |
| H05 — Trust and craftsmanship | 54–67% | Carry the incoming curve through the open entrance and glide beside a branded interior wall. Reveal letter edges, panel joints, and printed surfaces along the path without cutting to disconnected close-ups. | Present the four required principles one at a time: Designed to Stand Out, Quality Materials, Complete Branding Under One Roof, and Timely Delivery. Pair each with an appropriate detail or factual explanation. Material close-ups demonstrate a finish without inventing ratings or guarantees. |
| H06 — Our work | 67–80% | Continue laterally through the customer interior, showing PVC finishes, wall graphics, and directional branding, gradually widening the composition. | Introduce a large photographic portfolio rail over part of the scene through a soft overlay transition, retaining the spatial background and onward scroll. Include category tags, an actual item counter, and a user-opened accessible lightbox. These images are website evidence, not fictitious OM project displays mounted in the customer's shop. Clearly separate verified work from references. |
| H07 — How it works | 80–91% | Continue toward a consultation counter where printed collateral and a branded surface complete the service story. Use a gentle moving composition as process explanations change. | Show the exact four-step journey: Tell Us What You Need → We Design → We Make It → We Deliver & Install. Clicking a step updates the active explanation; scrolling advances the indicator. Printing and promotional collateral remain visibly connected to the same customer identity. |
| H08 — Final invitation | 91–100% | Settle into a final interior-wide composition facing the branded entrance, connecting the interior experience back to the facade. End with a still, legible composition and release the stage into the footer. | “Imagine this for your business.” Keep the final wording in configuration. Present Get a Quote, Call Now, and WhatsApp Chat with verified contact details. Do not make visitors replay the journey to enquire. |

Camera planning must explicitly prevent wall intersections, travel through glass, abrupt direction changes, disorienting spins, and clipping of the featured service. Place an open entrance in the model rather than relying on passing through a closed door. Only the natural endpoint of H08 settles to a final pose; its transition into the footer must preserve the background and layout without a visible pin-release jump.

## 5. Interaction contract

### Scrolling and navigation

- Use the document's native vertical scroll. A shared sticky stage remains in view while semantic chapter content defines the journey length.
- Drive a single continuous camera path with normalized global journey progress. Derive chapter-local progress from it for text, service emphasis, materials, and lighting; entering a chapter never resets the path or renderer.
- Scrolling must reverse predictably, tolerate rapid flings, and resolve the correct pose after refresh, resizing, deep linking, or browser back navigation.
- Provide a compact chapter navigator with meaningful labels and the active chapter. Anchor navigation scrolls to the target and updates the scene from that position.
- Keep `Services`, `Our Work`, and `Get a Quote` reachable. Add `Skip tour` linking to an accessible services/contact summary.
- Do not intercept wheel gestures, disable normal touch scrolling, or force chapter snapping. No pointer-lock or free-roaming controls are needed.

### Seamless transition requirements

- Keep one mounted canvas, one coherent customer environment, and one scroll controller throughout H01–H08. Do not replace canvases, swap full-screen backgrounds, flash black, or remount the scene between chapters.
- Join camera position and orientation curves with continuous direction and speed relative to scroll progress. Use a continuous spline and smooth look-target/orientation interpolation; normalize distance along the path to avoid accidental speed spikes. Do not apply separate start/stop easing to every chapter.
- Blend adjacent caption and service-emphasis windows over a short overlap interval. Fade outgoing text while introducing the next caption without obscuring the featured object or displaying two competing full text blocks.
- Carry exposure, reflections, light intensity, and material changes continuously through the entrance and transformation. Avoid abrupt light presets at chapter boundaries.
- Stopping the user's scroll naturally stops travel after minimal smoothing; continuing scroll immediately advances the same path. Do not introduce automatic timed pauses, loading gates, “Next” requirements, or independent autoplay that moves the visitor away from their chosen position.
- Readability comes from slower travel and stable caption placement, not dead scroll ranges. Optional lightboxes/modals may pause only after an explicit user action. Normal traversal never opens a blocking panel automatically.
- Keep the complete lightweight shell and essential service geometry available with the first usable scene. Preload additional detail ahead of travel; if delayed, continue through the base scene and add detail unobtrusively. Missing detail must not freeze movement at the next chapter.
- User-selected service emphasis and manual comparison state blend back into the global timeline when leaving their chapter. They must not cause a camera snap or a one-frame reset.
- Chapter links may intentionally skip content, but must not create slide behavior during ordinary scrolling. Reduced-motion/static mode uses ordinary document flow without introducing scroll gates.

### Service inspection

- Expose at most two or three scene labels simultaneously. Labels are real HTML buttons associated with scene anchors; hide anchors occluded by geometry or outside the view.
- Provide a corresponding DOM service selector so information never depends on clicking a tiny 3D target.
- An inspection opens a concise panel with the service name, its purpose in this space, related imagery where useful, and `Get a Quote` carrying the service context.
- Keep optional service selections local to the current chapter. On chapter exit, resolve to the main camera path. Avoid competing camera controllers.
- Opening a modal holds the current pose and preserves scroll position. Closing returns focus to its trigger and resumes from the same position.

### Transformation control

- Separate scroll-driven transformation progress from the user's manual comparison value.
- Once the user adjusts the range control, retain their comparison value while they remain in the comparison chapter. Camera travel continues to follow document scroll independently. Blend the comparison value back into the global transformation state on exit without resetting the camera; initialize deterministically on re-entry.
- Keep before and after labels visible. The static mode uses matching rendered stills of the same concept camera pose.

## 6. Asset production

The main asset is one coherent customer environment with reusable facade and interior components. Do not assemble unrelated generated views into a supposed continuous walkthrough.

| Asset | Production plan | Completion evidence |
| --- | --- | --- |
| Customer shell | Author a compact real 3D model: storefront, open entrance, floor, ceiling, rear/side walls, feature wall, and simple retail context. Use Three.js geometry for architectural elements or authored GLB assets where suitable. | Exterior and interior align; all planned camera paths are navigable. |
| OM service elements | Separate meshes for ACP panels, extruded lettering, sign backing, window vinyl, flex display, PVC panels, wayfinding, and printed collateral. | Each featured service has an identifiable object and scene anchor. |
| Materials and light | Create a small reusable material set; use licensed texture/environment assets, procedural material parameters, and baked illumination where appropriate. | Acrylic, metal, glass, print, and panels read differently at target viewing distances. |
| Concept branding | Use consistent “YOUR BRAND” identity across the storefront, graphics, and collateral. Treat in-scene lettering separately from readable HTML content. | No invented client attribution; fonts and texture assets have recorded usage rights. |
| Actual imagery | Review `/images`, `/images/placers`, and `/public/images`; preserve originals and create optimized derivatives. Examine the supplied `OM.docx` before adopting any additional business claims. | Each used image has a source, purpose, alt text, and attribution status. |
| Fallback views | Capture chapter stills directly from the finished 3D scene, including desktop and portrait compositions and matching before/after images. | Static and animated modes depict the same building and branding. |

Preserve the supplied ampersand photograph as material/craft reference and possible supporting imagery. It does not provide unseen geometry for an exact product reconstruction. Similarly, use gateway and storefront references for design cues until completed-work attribution is confirmed. The OM facility image belongs in business/about context, not as the customer's showroom.

Generated images may assist with texture or concept exploration if needed, but they are not a substitute for navigable geometry. Prototype geometry is an intermediate milestone; do not present an untextured blockout as the completed design.

Track public asset paths and provenance in `src/config/site.ts`. Record whether each asset is `verified-project`, `provided-reference`, or `concept`. Unverified material may remain useful as a clearly labeled reference, but cannot silently become portfolio proof.

## 7. Technical architecture

### Rendering and dependencies

Retain Next.js App Router and use a client-only Three.js scene through React Three Fiber. Plan for `three`, a React-19-compatible `@react-three/fiber` release, and `gsap`; add `@react-three/drei` only for helpers actually used. Resolve exact mutually compatible versions during installation and update the existing npm lockfile. React Three Fiber documents the React 19/Fiber 9 major-version pairing; verify compatibility with the project's exact React 19.2 release before adoption. [React Three Fiber documentation](https://r3f.docs.pmnd.rs/)

Use GSAP ScrollTrigger to measure chapter progress and coordinate the sequence. Use a single CSS sticky owner for the stage; do not add a second pinning system or an independent smooth-scroll library. ScrollTrigger supports scroll-linked progress and timelines. [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

Keep `src/app/page.tsx` a Server Component that renders the narrative content and a narrowly scoped client experience boundary. Put `dynamic(..., { ssr: false })` inside that Client Component, following the installed Next.js guide at `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`. The installed server/client-components guide also governs the boundary. Re-read relevant installed guides before implementation changes; retain the project's Next.js version.

### Proposed file responsibilities

| File or directory | Responsibility |
| --- | --- |
| `src/app/page.tsx` | Compose server-rendered chapters, the scene boundary, accessible fallback content, and final enquiry actions. |
| `src/config/site.ts` | All business facts, copy, routes, services, asset paths/provenance, chapters, camera keyframes, service anchors, and quality presets. |
| `src/components/showroom/ShowroomExperience.tsx` | Client loading, mode selection, error handling, and lifecycle ownership. |
| `src/components/showroom/ShowroomCanvas.tsx` | One canvas, lighting, scene groups, rendering quality, and resource lifecycle. |
| `src/components/showroom/CustomerSpace.tsx` | Customer shell and named facade/interior/service meshes. Split submodels only when complexity justifies it. |
| `src/components/showroom/CameraRig.tsx` | One continuous camera curve, responsive framing, and slower reading intervals from global progress; no separate content data. |
| `src/components/showroom/ChapterOverlay.tsx` | Accessible chapter text, navigation, service selection, and contextual actions. |
| `src/components/showroom/ShowroomFallback.tsx` | Responsive chapter stills and the complete HTML experience when animation is unavailable or disabled. |
| `src/lib/showroom/timeline.ts` | Pure chapter/progress evaluation and pose interpolation. |
| `src/lib/showroom/types.ts` | Typed chapter, camera, asset, quality, and interaction contracts. |
| `src/hooks/useShowroomScroll.ts` | Native-scroll measurements, resize refresh, hash navigation synchronization, and cleanup. |
| `public/models/`, `public/textures/`, `public/images/showroom/` | Optimized runtime assets and stills. |

Keep per-frame camera and object changes in refs/render updates rather than React state. React state handles discrete UI changes: active chapter, open panel, selected service, and rendering mode. Dispose of canvas resources and remove timeline listeners on route exit.

Use demand rendering when the camera and effects are settled; invalidate during scroll, camera easing, or interaction. React Three Fiber documents this rendering strategy and resource reuse. [Performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)

### Loading and resilience

1. Server-render useful content and the first scene poster with reserved dimensions.
2. Detect reduced motion and renderer support on the client without changing the initial server markup.
3. Load the renderer and first-scene assets; keep the poster visible until a complete frame is ready.
4. Initialize the scene at the current scroll position, including when loading completes mid-journey.
5. Load interior detail and portfolio media progressively before needed. Continue camera movement through the already available base environment if detail is delayed; retain a stable placeholder only for that optional asset, never freeze the whole view.
6. On a renderer error, context loss, or asset failure, retain chapter/contact functionality and switch to matching static views. A visitor must never be trapped behind a loading screen.

## 8. Responsive composition, accessibility, and performance

Every screen size retains the same customer-space journey and seamless chapter transitions. Adapt camera composition, caption placement, navigation, and rendering cost together. Do not simply crop the desktop canvas, stretch a mobile layout, or replace the experience with a long card stack.

### Viewport composition matrix

Widths below are CSS pixels and initial layout bands. Account for aspect ratio, viewport height, touch capability, and text enlargement as well as width; 4K physical resolution alone does not determine the layout band.

| Screen class | Initial width band | Camera and scene | Interface composition |
| --- | --- | --- | --- |
| Mobile | 320–767px | Portrait framing brings the relevant service closer while preserving the entrance and spatial continuity. Use the same path landmarks with smoothly adjusted camera offsets and look targets. | Compact navigation; thumb-reachable enquiry action; short captions in reserved safe areas. At most one primary service label at a time. Optional panels fit the viewport and scroll internally when necessary. |
| Tablet / small laptop | 768–1023px | Balance facade breadth and product scale in portrait and landscape. Short landscape viewports require their own framing checks. | Adapt between compact navigation and expanded controls according to available space; use side captions only when the scene remains clear. |
| Desktop | 1024–1919px | Full architectural approach with foreground depth, visible lettering, and a readable interior. Preserve product size as width increases. | Asymmetrical side captions, accessible chapter navigation, and persistent quote access, with comfortable reading widths. |
| Large display | 1920–2559px | Reveal more architectural context while keeping the featured service visually dominant. Fit to scene bounds and a minimum subject size rather than moving the camera indefinitely backward. | Constrain text/controls to an intentional content region, initially around 1600px maximum width; keep the 3D environment full bleed. Cap headline growth and body line length. |
| Ultrawide / very large display | 2560px+ or very wide aspect ratio | Author wider context and camera framing for 21:9/32:9 without fisheye distortion, exposed unfinished geometry, or tiny central products. Keep captions near their subjects. | Preserve readable type scale and bounded line lengths; do not stretch buttons, paragraphs, galleries, or forms across the entire display. |

### Fluid layout and resize behavior

- Use fluid type/spacing with bounded scaling and readable body measures around 45–70 characters. Test headings, navigation, captions, gallery, quote form, and footer across all five routes.
- Define subject-safe and text-safe areas per chapter and aspect ratio in configuration. Keep important letters, cladding details, and the entrance outside caption/control occlusion zones.
- Compose portrait and landscape camera variants from common spatial landmarks. Interpolate framing across aspect ratios without abrupt breakpoint camera changes; maintain the active chapter and normalized progress during rotation or window resizing.
- Recalculate stage and scroll measurements after layout settles, preserving the current story position instead of resetting to the beginning. Mobile browser chrome changes must not repeatedly rebuild the path or jump the viewport.
- Base rendering quality on measured cost and capability, not screen width alone. Cap device pixel ratio and drawing-buffer pixel count so large high-density displays do not render an unnecessarily expensive full-resolution canvas. Keep DOM text sharp independently of 3D resolution.
- Prepare fallback stills with suitable portrait, landscape, and wide framing. Reserve intrinsic dimensions for all media so loading and switching modes do not shift surrounding content.

### Accessibility and journey length

- Target roughly 10–12 screenfuls for the full desktop journey and 8–10 on mobile, excluding optional portfolio inspection and secondary routes. Keep each mobile chapter's core content within 1–2 viewports.
- Use stable stage sizing that tolerates mobile browser chrome, rotation, and safe-area insets. Separate text and camera framing to prevent overlap at narrow widths and 200% text zoom.
- Reduce texture resolution, device pixel ratio, real-time shadows, reflection cost, and nonessential objects on constrained devices. Keep a visible static-view option.
- Reduced motion uses the same eight chapter stills and accessible content with ordinary scrolling. Disable camera travel, smoothing, auto-advancing motion, and animated lighting. All services and conversion actions remain available.
- Include keyboard chapter navigation, visible focus, accessible tabs/selectors, 44px interaction targets, labeled range input, Escape-to-close behavior, modal focus management, and focus restoration.
- Decorative canvas output is not the sole source of information. Keep one coherent semantic heading/content sequence; inactive overlay controls must not remain focusable, and duplicated fallback content must not be announced twice.
- Preserve normal scrolling keys when a range control, form, or other interactive element has focus. Do not broadcast continuous scroll updates through live regions.

Initial engineering budgets below are targets to measure and tune, not results already achieved:

| Measure | Initial budget |
| --- | --- |
| First poster | Up to about 250 KB mobile / 400 KB desktop, with reserved dimensions. |
| First usable 3D view | Aim for at most 3 MB compressed geometry and textures, plus separately measured deferred JS. |
| Initial canvas complexity | Aim below 150 visible draw calls and 200k visible triangles on the mobile preset. |
| Rendering | Aim for 60 fps on representative desktop/large-display setups and at least 30 fps on a representative midrange phone while scrolling. Cap drawing-buffer cost on 4K/high-DPI and ultrawide displays. Record hardware, CSS viewport, pixel ratio, rendering resolution, and browser used. |
| Layout and responsiveness | No visible layout jumps or horizontal overflow; target CLS ≤ 0.05, LCP ≤ 2.5s, and INP ≤ 200ms under documented measurement conditions. Field performance remains unverified until real traffic exists. |

If a scene exceeds budget, simplify assets, lighting, and effects before reducing the visibility of OM's services. Prefer baked lighting and material reflections over costly real-time simulation. Pause rendering when offscreen or the tab is hidden.

## 9. Supporting routes and content integrity

The homepage is the immersive entrance to one cohesive website; existing direct-access pages remain useful for visitors who want specifics immediately.

- `/services`: Complete categorized catalog, clear descriptions, related imagery, and quote links with service context. Make every configured core service reachable, including retro signs.
- `/work`: Category filtering, large images, actual item counters, and accessible lightbox. Separate confirmed work from illustrative/reference material.
- `/about`: Verified OM story and the Chomu facility, with clear separation from the concept customer showroom.
- `/contact`: Phone, WhatsApp, email, map search link, and the existing quick quote journey. Prefill a selected service from a validated query parameter. User submission opens WhatsApp/email; do not display a false “sent” confirmation.

Reuse and improve the existing quote modal, lightbox, before/after control, navigation, and footer where suitable. Consolidate duplicated hard-coded copy into `siteConfig` during migration.

Audit the existing copy before reuse. Items currently present such as Samsung/Osram components, IP67 ratings, fade-resistance periods, “zero maintenance,” GSM specifications, working hours, and expanded staff roles are not established by the verified facts in `AGENTS.md`. Remove or qualify unsupported specificity; do not carry it forward merely because it is already in code.

Preserve these verified facts exactly in substance:

- OM Advertising.
- Near Power House, Renwal Road, Chomu, Jaipur.
- Banti Kumawat — Owner — `9799852206`.
- Mukesh Kumawat — `9829537889`.
- `omadvertisingchomu@gmail.com`.

No fabricated testimonials, customers, awards, years of experience, guarantees, certifications, or project outcomes. Retain static showcase scope: no authentication, database, cart, checkout, or CMS.

## 10. Implementation sequence and completion gates

| Phase | Work | Required result before continuing |
| --- | --- | --- |
| 1 — Align content and spatial brief | Record the corrected customer-showroom concept, inspect remaining supplied references/document, classify assets and factual claims, sketch a simple floor plan, define a continuous camera curve and responsive framing landmarks, and define typed configuration. Read relevant installed Next.js guides. | Every chapter has a location, camera destination, OM service connection, and source/asset requirement; all boundaries preserve continuous movement. |
| 2 — Prove the central experience | Add the renderer boundary and dependencies; model the facade, lettering, entrance, and visible interior. Implement H01–H03 movement with one convincing material/light treatment, DOM captions, native scrolling, portrait framing, and a matching poster. | A recognizable customer showroom with real perspective change, visible letter depth, coherent approach movement, reversible scrolling, and a usable quote action. This is the first meaningful preview milestone. |
| 3 — Complete the spatial journey | Finish interior service elements and H04–H08; implement the transformation, inspection states, service anchors, chapter navigation, and terminal scene. | All eight beats operate on one coherent space; every promised service is demonstrable or explicitly described in context. |
| 4 — Integrate business evidence | Connect verified portfolio/reference material, process copy, existing controls, all supporting routes, and contextual enquiries. | The concept explains capability; the portfolio accurately represents available evidence; all existing user journeys remain reachable. |
| 5 — Finish resilience and quality | Render final stills, implement reduced-motion/static mode, optimize assets, finish the mobile/tablet/desktop/large/ultrawide compositions, and complete accessibility behavior. | Every screen class retains legible content, the complete journey, and uninterrupted boundary transitions. First load, asset failure, renderer failure, slow loading, and keyboard use each retain a complete usable website. |
| 6 — Validate and deliver | Run production build, lint, focused behavior checks, and the authorized visual/browser validation process. Package and publish only as part of the implementation delivery workflow, preserving the existing framework and deployment configuration until the target is established. | Report working features, measured budgets, validation performed, and any remaining limitation. Do not describe an untested or incomplete journey as complete. |

These are engineering completion gates, not mandatory user approval pauses. The current requested deliverable is this plan; no dependency installation, application rewrite, site registration, or deployment is included in this planning step.

## 11. Verification plan

- Run `npm run build`, `npm run lint`, and TypeScript validation appropriate to the final build configuration.
- Add focused tests for chapter boundaries, reverse progress, interpolation endpoints, service query validation, and manual transformation state. Check position/orientation and finite-difference speed on either side of every chapter boundary to catch resets and unintended stops. Avoid tests that merely snapshot the component structure.
- Check all five routes, navigation, portfolio filters, lightbox controls, comparison input, service links, and quote validation. Inspect generated phone/WhatsApp/email destinations without sending messages.
- For implementation visual QA, follow the applicable tool workflow and browser-testing authorization. Review the first frame, each reading interval, and each transition in both directions; include continuous scroll recordings on mobile, desktop, and a large/ultrawide viewport because still screenshots cannot establish camera continuity. Constant scroll input must produce travel across all seven chapter boundaries without pauses, blank frames, slide snapping, canvas resets, or repeated deceleration to zero.
- Cover representative CSS viewports at 320×568, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080, 2560×1440, and 3440×1440, plus short mobile landscape and a 4K/high-DPI rendering check. Include intermediate widths and live resizing across layout bands. These are planned checks, not completed measurements.
- Cover touch scrolling, browser back/refresh at a later chapter, keyboard-only use, 200% text zoom, reduced motion, JavaScript unavailable, WebGL unavailable/context loss, slow network, and failed model/texture requests. Verify that delayed nonessential assets do not freeze traversal.
- Check text contrast against the actual scene at all caption poses, modal focus restoration, fixed controls, and mobile safe areas.
- Measure first-view transfer size, draw calls, frame behavior, layout shift, and loading/interaction performance on named test conditions. Document rather than assume results.

## 12. What counts as success

- The first view clearly depicts a finished customer business that has benefited from OM's services.
- Within the opening scroll, perspective and object relationships change visibly as the camera approaches the space.
- The sign has visible thickness, the facade has depth and joints, and the entrance leads into the same interior seen through its windows.
- Visitors can connect signage, boards, printing, lighting, and cladding to their uses in the finished space.
- The eight chapters remain in the required order within one uninterrupted camera journey. Continuing to scroll across a boundary never requires a restart, pause, next-slide action, or loading intermission.
- The customer space carries a concept identity; OM's own facility and actual project evidence are labeled correctly.
- Mobile, tablet, desktop, large, and ultrawide layouts preserve the main spatial experience with intentional camera framing and readable controls. Static/reduced-motion mode communicates the full story.
- Quote and contact actions work throughout the experience.
- Final evaluation covers motion, material quality, spatial continuity, factual accuracy, and usability. Merely assembling all sections or passing a build is insufficient.

The first implementation milestone is the finished-looking facade approach and entrance/service inspection sequence. It establishes the environment, uninterrupted camera travel across H01–H03, material quality, and mobile/desktop/large-screen framing that the remaining chapters will extend.


## Implementation record

The current source implements the continuous R3F/Three.js customer space, eight connected narrative chapters, service selection and optional inspection, aligned in-scene transformation, project reference gallery/lightbox, process control, responsive layouts, still/reduced-motion fallback, and all five direct-access routes. Enquiries carry validated service context into WhatsApp/email drafts.

The scroll controller uses native document measurements and a distance-remapped Hermite camera path; GSAP and Drei proved unnecessary and were removed from the newly added dependencies. Repeated architectural fins use instancing, and camera/transform state shares rendered progress.

The initial/still poster is an original generated architectural concept. It follows the model's brief but is not an exact captured frame. Actual browser screenshots, continuous-motion recordings, device performance measurements, and matching scene-frame exports could not be completed because computer-use access was unavailable. These are recorded explicitly in `VALIDATION.md`; no visual or device pass is claimed.
