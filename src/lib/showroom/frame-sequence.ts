export interface FrameSequenceSource {
  directory: string;
  prefix: string;
  extension: 'webp' | 'jpg' | 'png';
  firstFrame: number;
  frameCount: number;
  padding: number;
}

export interface FrameSequenceConfig {
  enabled: boolean;
  desktop: FrameSequenceSource;
  mobile: FrameSequenceSource | null;
  poster: string | null;
  portraitPoster: string | null;
  preloadRadius: number;
  concurrency: number;
  maxCachedFrames: number;
  desktopCacheBytes: number;
  mobileCacheBytes: number;
  maxCanvasPixels: number;
  maxDpr: number;
}

export function frameAtProgress(progress: number, count: number) {
  const bounded = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
  return Math.round(bounded * Math.max(0, count - 1));
}

export function boundedFrameTowards(current: number, target: number, deltaSeconds: number, maxLag = 2, response = 28) {
  if (current < 0 || current === target) return target;
  
  // Use a soft, exponential dampening to avoid abrupt snapping
  const alpha = 1 - Math.exp(-Math.max(0, deltaSeconds) * response);
  let next = current + (target - current) * alpha;
  
  const diff = target - next;
  // If we are lagging behind more than maxLag, accelerate the frame catch-up exponentially
  // rather than hitting a rigid brick wall which creates visual stutter.
  if (Math.abs(diff) > maxLag) {
    const direction = diff > 0 ? 1 : -1;
    const excess = Math.abs(diff) - maxLag;
    // Add a rubber-band acceleration based on excess lag
    next += direction * excess * 0.5; 
  }
  
  return Math.abs(target - next) < .1 ? target : next;
}

export function frameUrl(source: FrameSequenceSource, index: number) {
  const number = String(source.firstFrame + index).padStart(source.padding, '0');
  return `${source.directory.replace(/\/$/, '')}/${source.prefix}${number}.${source.extension}?v=zooming_reverted`;
}

// Target first, then neighbors in both directions so reversing scroll stays responsive.
export function nearbyFrames(target: number, count: number, radius: number) {
  const frames = [target];
  for (let distance = 1; distance <= radius; distance++) {
    if (target + distance < count) frames.push(target + distance);
    if (target - distance >= 0) frames.push(target - distance);
  }
  return frames;
}

export function coverRect(imageWidth: number, imageHeight: number, width: number, height: number) {
  const scale = Math.max(width / imageWidth, height / imageHeight);
  const drawWidth = imageWidth * scale, drawHeight = imageHeight * scale;
  return { x: (width - drawWidth) / 2, y: (height - drawHeight) / 2, width: drawWidth, height: drawHeight };
}
