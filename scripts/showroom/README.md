# Exterior scene asset pipeline

The homepage now loads `public/models/showroom/storefront.glb` through `StorefrontCanvas.tsx`. The original procedural renderer and all eight original homepage section files remain preserved. The camera stays outside for three chapters; sections 4–8 are HTML/CSS sections.

## Reproduce

Use Blender 4.5 or newer and the existing Node dependencies. Business copy, scene identity and camera positions come from `src/config/site.ts`.

```sh
node --import tsx scripts/showroom/prepare_brief.ts
blender --background --factory-startup --python scripts/showroom/build_scene.py -- --brief assets/showroom/brief.json --output assets/showroom/review --no-render
blender --background --factory-startup --python scripts/showroom/export_exterior.py -- --source assets/showroom/review/customer-showroom.blend --output assets/showroom/runtime
blender --background --factory-startup --python scripts/showroom/finish_exterior.py -- --directory assets/showroom/runtime
node scripts/showroom/package_asset.mjs
node --import tsx scripts/showroom/prepare_exterior.ts
blender --background --factory-startup --python scripts/showroom/review_exterior.py -- --model public/models/showroom/storefront.glb --cameras assets/showroom/runtime/cameras.json --output assets/showroom/runtime/review
node scripts/showroom/package_posters.mjs
```

The optional `OM_RENDER_FONT` variable can identify a local font when preparing the brief. The authored scene used Arial on macOS. Text is converted to geometry; system font files are not distributed. Without that option Blender uses its built-in font.

## What each stage does

1. **Author:** one illustrative customer building, dimensional lettering, cladding, glazing, furnishings, printing and detailed foliage.
2. **Bake:** join compatible surfaces, unwrap and globally pack their UVs, prepare static diffuse illumination in a 2048-pixel atlas. Light sources stay in the offline source scene.
3. **Finish:** denoise computed illumination, reduce distant foliage/interior detail while retaining the main sign geometry, add streetlight fixtures, bake a road normal map, and compress geometry with Draco.
4. **Package:** JPEG-encode illumination, resize the road normal map to 512 pixels, retain leaf alpha, deduplicate sampler/texture records so lighting uses one shared GPU texture, and copy the local decoder. `asset-report.json` records measured sizes and counts.
5. **Inspect:** import the actual packaged GLB into Blender and render wide, near-board, pulled-back and portrait poses. EEVEE has no ray-traced reflections enabled for these views. These are offline inspections, **not browser screenshots**; tone mapping and environment reflections can differ from Three.js.
6. **Poster:** convert the wide and portrait scene renders to WebP. The original photographic concept image remains preserved and is used separately in the closing section.

Only files in `public/` are shipped. Large source `.blend` files, raw textures, the HDR and original light rig are not browser downloads.

## Asset provenance

- Detailed foliage and maps: [Potted Plant 01, Poly Haven](https://polyhaven.com/a/potted_plant_01), CC0. The vessel is replaced with authored architectural planters.
- The source lighting study uses [Blue Photo Studio, Poly Haven](https://polyhaven.com/a/blue_photo_studio), CC0. This HDR is not sent to the browser; the live scene uses a restrained generated environment.
- [Poly Haven license](https://polyhaven.com/license).
- Draco decoder: the glTF version bundled with Three.js, Apache 2.0. The license is copied to `public/draco/LICENSE`.
- The building, furniture, fixtures, printed concept graphics and service details are illustrative authored geometry, not a claimed OM customer project.

## Visual review

The exported scene is substantially more detailed than the rejected blockout. Offline inspection caught noisy lighting; global UV packing and offline denoising reduced the blotching. Main signage retains its authored lettering geometry and visible returns. Remaining limitations include a simplified street/context, residual softness in some baked surfaces, and a less photographic material/light treatment than the user's first image. The current result is an architectural visualization, not an accepted replica of that reference.

Browser visual inspection, continuous-scroll recordings and real-device performance measurements remain necessary. A matching geometry/camera poster does not establish pixel-identical rendering between Blender and Three.js. Do not treat asset compression, automated tests or a production build as visual acceptance. See `VALIDATION.md`.
