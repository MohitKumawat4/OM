import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { showroomConfig } from '../../src/config/site';

// Copy and media provenance remain owned by site.ts. The JSON is generated input.
const destination = resolve(process.argv[2] || 'assets/showroom/brief.json');
const study = showroomConfig.renderStudy;
mkdirSync(dirname(destination), { recursive: true });
writeFileSync(destination, JSON.stringify({
  ...showroomConfig.scene,
  plant: resolve(study.plant.path),
  environment: resolve(study.environment.path),
  fontFile: process.env.OM_RENDER_FONT || undefined,
  shots: study.shots,
}, null, 2));
console.log(destination);
