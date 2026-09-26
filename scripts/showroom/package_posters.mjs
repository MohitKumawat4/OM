import sharp from 'sharp';
import { stat } from 'node:fs/promises';

// Format conversion only. Both images are renders of the packaged scene at the
// website's opening camera poses; the photographic concept stays preserved.
for(const [source,target] of [['wide','storefront-poster'],['portrait','storefront-portrait']]){
  const output=`public/images/showroom/${target}.webp`;
  await sharp(`assets/showroom/runtime/review/${source}.png`).webp({quality:88}).toFile(output);
  console.log(output,(await stat(output)).size,'bytes');
}
