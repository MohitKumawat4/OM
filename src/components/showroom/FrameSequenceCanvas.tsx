'use client';

import { useEffect, useRef, useSyncExternalStore, type RefObject } from 'react';
import { storefrontConfig } from '@/config/site';
import { boundedFrameTowards, coverRect, frameAtProgress, frameUrl, nearbyFrames } from '@/lib/showroom/frame-sequence';

const config = storefrontConfig.frameSequence;
const mobileQuery = '(max-width: 767px)';

// Compressed frames survive component remounts for the lifetime of the page.
// The complete supplied sequence is about 16 MiB; decoded bitmaps remain bounded below.
const compressedFrames = new Map<string, Blob>();

const subscribe = (callback: () => void) => {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const getSnapshot = () => window.matchMedia(mobileQuery).matches;
const getServerSnapshot = () => false;

interface Props {
  state: RefObject<{ progress: number; visible: boolean }>;
  onReady: () => void;
  onFailure: () => void;
}

/** Uses the existing hero scroll trigger; owns no scroll listeners or page layout. */
export default function FrameSequenceCanvas({ state, onReady, onFailure }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const compact = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const source = compact && config.mobile ? config.mobile : config.desktop;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !context || source.frameCount < 1 || !window.createImageBitmap) {
      onFailure();
      return;
    }

    const bitmaps = new Map<number, ImageBitmap>();
    const pendingFetches = new Map<number, AbortController>();
    const pendingDecodes = new Set<number>();
    const failed = new Set<number>();
    const urgentFetches: number[] = [];
    const normalFetches: number[] = [];
    const decodeQueue: number[] = [];
    const queuedFetches = new Set<number>();
    const queuedDecodes = new Set<number>();
    const byteLimit = compact ? config.mobileCacheBytes : config.desktopCacheBytes;
    let backgroundCursor = 0, disposed = false, ready = false, animation = 0, bytes = 0;
    let drawn = -1, visualFrame = -1, target = frameAtProgress(state.current.progress, source.frameCount), resized = true;
    let lastTick = performance.now();

    const active = () => !disposed && !document.hidden && state.current.visible;
    const virtualFrameCount = source.frameCount;
    
    // Normal linear mapping
    const urlFor = (index: number) => {
      return frameUrl(source, index);
    };

    const release = (index: number) => {
      const bitmap = bitmaps.get(index);
      if (!bitmap) return;
      bytes -= bitmap.width * bitmap.height * 4;
      bitmap.close();
      bitmaps.delete(index);
    };

    const trim = () => {
      const visualTarget = Math.round(visualFrame < 0 ? target : visualFrame);
      const protectedFrames = new Set([drawn, visualTarget, target]);
      for (const index of bitmaps.keys()) {
        if (bitmaps.size <= config.maxCachedFrames && bytes <= byteLimit) break;
        if (!protectedFrames.has(index)) release(index);
      }
    };

    const schedule = () => {
      if (active() && !animation) animation = requestAnimationFrame(update);
    };

    const queueFetch = (index: number, urgent = false) => {
      if (index < 0 || index >= virtualFrameCount || compressedFrames.has(urlFor(index))
        || pendingFetches.has(index) || queuedFetches.has(index) || failed.has(index)) return;
      queuedFetches.add(index);
      if (urgent) urgentFetches.unshift(index);
      else normalFetches.push(index);
    };

    const queueDecode = (index: number, urgent = false) => {
      if (index < 0 || index >= virtualFrameCount || bitmaps.has(index)
        || pendingDecodes.has(index) || queuedDecodes.has(index) || failed.has(index)) return;
      if (!compressedFrames.has(urlFor(index))) {
        queueFetch(index, urgent);
        return;
      }
      queuedDecodes.add(index);
      if (urgent) decodeQueue.unshift(index);
      else decodeQueue.push(index);
    };

    const pumpDecodes = () => {
      if (!active()) return;
      while (pendingDecodes.size < config.concurrency && decodeQueue.length) {
        const index = decodeQueue.shift()!;
        queuedDecodes.delete(index);
        const blob = compressedFrames.get(urlFor(index));
        if (!blob || bitmaps.has(index) || pendingDecodes.has(index)) continue;
        pendingDecodes.add(index);
        void createImageBitmap(blob).then(bitmap => {
          if (disposed) { bitmap.close(); return; }
          bitmaps.set(index, bitmap);
          bytes += bitmap.width * bitmap.height * 4;
          trim();
        }).catch(() => {
          if (!disposed) failed.add(index);
        }).finally(() => {
          pendingDecodes.delete(index);
          pumpDecodes();
          schedule();
        });
      }
    };

    const nextBackgroundFrame = () => {
      while (backgroundCursor < source.frameCount) {
        const index = backgroundCursor++;
        if (!compressedFrames.has(urlFor(index)) && !pendingFetches.has(index)
          && !queuedFetches.has(index) && !failed.has(index)) return index;
      }
      return null;
    };

    const shouldDecode = (index: number) => {
      const visualTarget = Math.round(visualFrame < 0 ? target : visualFrame);
      return index === visualTarget || Math.abs(index - target) <= config.preloadRadius;
    };

    const pumpFetches = () => {
      if (!active()) return;
      while (pendingFetches.size < config.concurrency) {
        let index: number | null = null;
        while (urgentFetches.length && index === null) {
          const candidate = urgentFetches.shift()!;
          queuedFetches.delete(candidate);
          if (!compressedFrames.has(urlFor(candidate)) && !pendingFetches.has(candidate)
            && !failed.has(candidate)) index = candidate;
        }
        while (normalFetches.length && index === null) {
          const candidate = normalFetches.shift()!;
          queuedFetches.delete(candidate);
          if (!compressedFrames.has(urlFor(candidate)) && !pendingFetches.has(candidate)
            && !failed.has(candidate)) index = candidate;
        }
        if (index === null) index = nextBackgroundFrame();
        if (index === null) break;

        const requestedIndex = index;
        const controller = new AbortController();
        pendingFetches.set(requestedIndex, controller);
        const timeout = window.setTimeout(() => controller.abort(), 12000);
        void fetch(urlFor(requestedIndex), { signal: controller.signal }).then(response => {
          if (!response.ok) throw new Error(`Frame response: ${response.status}`);
          return response.blob();
        }).then(blob => {
          if (!disposed && !controller.signal.aborted) {
            compressedFrames.set(urlFor(requestedIndex), blob);
            if (shouldDecode(requestedIndex)) queueDecode(requestedIndex,
              requestedIndex === Math.round(visualFrame < 0 ? target : visualFrame));
          }
        }).catch(() => {
          if (!disposed) failed.add(requestedIndex);
        }).finally(() => {
          window.clearTimeout(timeout);
          pendingFetches.delete(requestedIndex);
          pumpFetches();
          pumpDecodes();
          schedule();
        });
      }
    };

    const prepareFrames = () => {
      const visualTarget = Math.round(visualFrame < 0 ? target : visualFrame);
      queueFetch(visualTarget, true);
      queueDecode(visualTarget, true);
      queueFetch(target, true);
      queueDecode(target);
      for (const index of nearbyFrames(target, virtualFrameCount, config.preloadRadius)) {
        queueFetch(index);
        queueDecode(index);
      }
      pumpFetches();
      pumpDecodes();
    };

    const draw = (index: number) => {
      const bitmap = bitmaps.get(index);
      if (!bitmap) return false;
      if (resized) {
        const { width, height } = canvas.getBoundingClientRect();
        if (width <= 0 || height <= 0) return false;
        const ratio = Math.min(window.devicePixelRatio || 1, config.maxDpr,
          Math.sqrt(config.maxCanvasPixels / (width * height)));
        canvas.width = Math.max(1, Math.floor(width * ratio));
        canvas.height = Math.max(1, Math.floor(height * ratio));
        resized = false;
      }
      const rect = coverRect(bitmap.width, bitmap.height, canvas.width, canvas.height);
      context.drawImage(bitmap, rect.x, rect.y, rect.width, rect.height);
      drawn = index;
      canvas.dataset.frame = String(index);
      bitmaps.delete(index);
      bitmaps.set(index, bitmap);
      if (!ready) { ready = true; onReady(); }
      trim();
      return true;
    };

    function update() {
      animation = 0;
      if (!active()) return;
      const now = performance.now();
      const delta = Math.min(.05, Math.max(0, (now - lastTick) / 1000));
      lastTick = now;
      target = frameAtProgress(state.current.progress, virtualFrameCount);
      
      // Allow a wider lag window and a softer response so fast scrolls feel cinematic 
      // instead of instantly snapping or stuttering across frames.
      const dynamicLag = Math.max(4, Math.round(virtualFrameCount * 0.025)); 
      visualFrame = boundedFrameTowards(visualFrame, target, delta, dynamicLag, 22);
      const visualTarget = Math.round(visualFrame);

      if (failed.has(visualTarget)) { onFailure(); return; }
      if (visualTarget !== drawn || resized) draw(visualTarget);

      prepareFrames();
      // Ease any small remainder towards target when the next frame is ready in bitmap cache
      if (visualFrame !== target && bitmaps.has(Math.round(boundedFrameTowards(visualFrame, target, 1 / 60, dynamicLag)))) schedule();
    }

    const resize = new ResizeObserver(() => { resized = true; schedule(); });
    resize.observe(canvas);
    window.addEventListener('storefront-change', schedule);
    document.addEventListener('visibilitychange', schedule);
    prepareFrames();
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(animation);
      resize.disconnect();
      window.removeEventListener('storefront-change', schedule);
      document.removeEventListener('visibilitychange', schedule);
      for (const controller of pendingFetches.values()) controller.abort();
      for (const index of bitmaps.keys()) release(index);
    };
  }, [compact, source, state, onReady, onFailure]);

  return <canvas ref={canvasRef} aria-hidden="true" style={{ width: '100%', height: '100%' }} />;
}
