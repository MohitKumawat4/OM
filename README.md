# OM Advertising

A continuous exterior Three.js hero across the first three homepage chapters, followed by five animated editorial sections. The illustrative customer storefront reads **YOUR BRAND**; OM is the signage, printing and physical branding partner.

## Run and validate

```sh
npm install
npm run dev
npm run lint
npm test
npm run build
npm start
```

Next.js statically exports `/`, `/services`, `/work`, `/about`, and `/contact` to `out/`. No database, account system or form server is required. Enquiries open a brief in the visitor's WhatsApp or email app for review and sending.

If this environment blocks Turbopack's local CSS worker port, use the supported `npm run dev -- --webpack` or `npm run build -- --webpack` option. The project retains its original default bundler configuration.

## Main files

- `src/config/site.ts`: verified business data, copy, assets, camera landmarks and rendering limits.
- `src/components/showroom/StorefrontExperience.tsx`: three-chapter native scroll controller, HTML controls and full still-mode content.
- `src/components/showroom/StorefrontCanvas.tsx`: demand-rendered Three.js scene, exterior camera and adaptive pixel limits.
- `src/components/home/`: original eight section files, all preserved. Sections 4–8 are redesigned in place and mounted on the homepage. The original first three are currently unused.
- `src/lib/showroom/`: continuous camera sampling and rendering-budget helpers.
- `scripts/showroom/`: repeatable architectural authoring, lighting bake, asset optimization and inspection pipeline.
- `IMPLEMENTATION_PLAN.md`: approved exterior-only scope, with the old interior-walkthrough brief retained as history.
- `VALIDATION.md`: completed checks, measured asset budgets and remaining visual/device verification.

The previous `ShowroomExperience.tsx`, `ShowroomCanvas.tsx` and chapter components remain in the source tree for reference and reuse. They are not mounted by the new homepage.

## Assets

The current exterior is authored geometry with baked diffuse illumination, physical sign lettering, glazed frontage, detailed foliage, street fixtures and a road normal map. Only the packaged GLB, decoder and web images are served; Blender source files and offline light rigs stay outside `public/`.

Plant geometry and maps come from Poly Haven Potted Plant 01 (CC0). The original architectural concept image remains preserved. Project photographs and references remain labeled according to their verified provenance. See `scripts/showroom/README.md` for asset sources and generation steps. The bundled Draco decoder is Apache 2.0; its license is in `public/draco/LICENSE`.

Reduced motion, unavailable WebGL and renderer errors use the complete still experience. The visible Still view control provides the same option. A successful build and a small model do not establish photorealism or real-device frame rates; see the validation record.
