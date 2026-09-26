## September 15 — responsiveness and composition pass

- Hero now occupies 300svh with three equally spaced copy chapters. Existing exterior camera route remains intact.
- Loading poster follows scroll and fine-pointer movement; native page scrolling and DOM controls do not wait for model readiness. The live camera has restrained pointer movement and still settles into demand rendering.
- Renderer uploads each unique texture with an event-loop yield between uploads, then calls Three.js `compileAsync` before revealing its first frame. The 3D mount uses a React transition after the initial page paint.
- Hero copy uses a shallow lower band, reduced headline sizes, horizontal text tabs, and optional service detail disclosures. Portrait and short landscape rules are included.
- Sections 4–8 retain their components and functionality, with a contrasting transformation study, revised typography, material details, craft image treatment, gallery, and process styling.
- Validation: production webpack build passed; lint passed; all 12 existing tests passed; localhost:3000 returned HTTP 200.
- These checks do not measure input latency, cold-load duration, or device FPS. Browser interaction and visual composition have not been inspected in this pass; the reported ten-second stall is not claimed to be quantitatively eliminated.

# Validation — revised exterior homepage

Updated 15 September 2026. The new **three-chapter exterior hero + five editorial sections** is implemented for local review. This is not a claim of photographic-reference acceptance or measured mobile performance.

## Engineering checks

- All eight original homepage section files are present. Sections 4–8 are redesigned in place and mounted; the original first three and previous eight-chapter WebGL implementation remain preserved and unused by the current homepage.
- ESLint passes. The unmodified bundled Draco decoder is excluded from application lint rules; its Apache license is included.
- TypeScript passes. The production static export succeeds for `/`, `/services`, `/work`, `/about`, and `/contact` using `npm run build -- --webpack`.
- Default Turbopack builds were blocked by this environment's CSS-worker port restriction. The supported Webpack option passed; the project default was not changed.
- All 12 automated tests pass. New checks cover exterior camera clearance/approach/pullback, continuous velocity across its two chapter boundaries, high-DPI drawing limits, frame-stop conditions, GLB buffer/resource validity, shared illumination texture use, and transfer/geometry budgets. The seven previous tests remain for retained camera code, enquiries and media integrity.
- All five local routes, the GLB, both decoder files and both opening posters return HTTP 200. Their expected media types are served.
- Python scene scripts compile successfully. The packaged Draco asset imports successfully into Blender for inspection.
- Development logs exposed a poster-wrapper positioning warning and a deprecated decoder option; both were corrected. Model failure handling now clears a rejected asset-cache entry before a later retry. Earlier preparation-time 404s are present in the historical log; the packaged asset now returns HTTP 200.
- The test runner reports a Three.js CommonJS deprecation warning from the current test-loader setup; it does not fail the tests.

## Measured asset data

| Item | Current result |
| --- | --- |
| Browser GLB | 5,842,680 bytes (about 5.84 MB) |
| Geometry | 431,519 triangles |
| Mesh/material groups | 37 |
| Texture records | 8, including one shared illumination texture |
| Lighting atlas | 2048 × 2048, computed and denoised offline |
| Packaged road normal | 512 × 512 |
| Desktop opening poster | 72,080 bytes, 1600 × 1000 |
| Portrait opening poster | 40,514 bytes, 780 × 1688 |
| Draco decoder | About 245 KiB across JavaScript wrapper and WebAssembly |

The first unoptimized export was 69,462,392 bytes and 1,655,809 triangles. Background foliage/interior geometry was reduced; the main exterior lettering geometry was retained. File-size and triangle counts do not measure frame rate, GPU memory, browser draw calls or startup latency.

## Implemented runtime controls

- Demand rendering; the director stops requesting frames after camera motion settles and skips drawing while offscreen or when the document is hidden.
- Hero scroll updates are not scheduled while the hero is offscreen. Later sections use native page flow, intersection-triggered reveals and short interaction transitions.
- Compact mode caps DPR at 1 and drawing pixels at 1.05 million. Desktop caps are DPR 1.35 / 2.3 million pixels. Sustained slow moving frames can lower this to DPR 0.8 / 650,000 pixels.
- No runtime shadow maps, bloom pipeline or glass refraction render pass. Light baking and denoising happen during asset preparation, not on visitors' devices.
- Reduced-motion preference, unavailable WebGL and renderer errors select the complete still experience. Visitors can also select Still view.

These are verified code paths and configuration limits. Actual browser scheduling, sustained frame rate, memory and battery use remain unmeasured on real devices.

## Visual inspection and remaining limits

Four actual views of the packaged asset were inspected in Blender: wide exterior, near-board, pulled-back exterior and portrait. The review caught blotchy baked lighting; global UV packing and offline denoising substantially reduced it. Main letters retain depth and metallic returns. The current WebP posters use that same geometry and the configured opening camera poses.

The images are **EEVEE inspection renders, not Three.js screenshots**. Their tone mapping and reflection environment can differ from the browser. They do not prove a pixel-identical poster transition. The original photographic concept remains preserved, and changing the poster does not itself satisfy the user's visual benchmark.

The scene still falls short of the photographic reference: street/context remains simplified, some baked surfaces have residual softness, and the lighting/reflections do not yet match the richer reference treatment. Treat the current result as an architectural visualization available for review, not a completed photorealistic replica.

Browser control was unavailable in this session (`CUA_REPL_ENABLED_SURFACES is required`; earlier native computer-use permission was also unavailable). No browser screenshots, continuous-scroll recordings, keyboard/touch interaction run-through or real-device CPU/GPU measurements are claimed. HTTP checks do not substitute for these.

The existing development server is available at `http://localhost:3000`. Refresh a long-running preview before reviewing, since it may retain an earlier failed model request or the old rendering state. The R3F dependency also emits a Three.js Clock deprecation notice in development; this is distinct from the corrected decoder call.

Review the actual website at 320×568, 390×844, 768×1024, 844×390, 1440×900, 1920×1080, 2560×1440 and 3440×1440. Include reverse scrolling, resize/orientation changes, 200% text zoom, keyboard navigation, comparison dragging, gallery/lightbox, quote forms, reduced motion and context loss. Measure a named lower-end phone and laptop before promising smoothness. Deployment remains pending visual and device validation.
