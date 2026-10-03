import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { storefrontConfig } from '../src/config/site';
import { boundedFrameTowards, coverRect, frameAtProgress, frameUrl, nearbyFrames } from '../src/lib/showroom/frame-sequence';

test('the enabled hero sequence ships every configured frame and its still poster', () => {
  const config = storefrontConfig.frameSequence;
  assert.equal(config.enabled, true);
  const directory = `public${config.desktop.directory}`;
  const frames = readdirSync(directory).filter(file => file.endsWith(`.${config.desktop.extension}`)).sort();
  assert.equal(frames.length, config.desktop.frameCount);
  assert.equal(`/frames/hero/desktop/${frames[0]}`, frameUrl(config.desktop, 0));
  assert.equal(`/frames/hero/desktop/${frames.at(-1)}`, frameUrl(config.desktop, config.desktop.frameCount - 1));
  assert.ok(config.poster && existsSync(`public${config.poster}`));
  for (const path of [`${directory}/${frames[0]}`, `${directory}/${frames.at(-1)}`, `public${config.poster}`]) {
    assert.equal(readFileSync(path, { encoding: 'ascii', flag: 'r' }).slice(0, 4), 'RIFF');
  }
});

test('scroll reaches exact endpoints and reverses without skipping the last frame', () => {
  assert.equal(frameAtProgress(0, 450), 0);
  assert.equal(frameAtProgress(1, 450), 449);
  const forward = Array.from({ length: 450 }, (_, i) => frameAtProgress(i / 449, 450));
  assert.deepEqual(forward, Array.from({ length: 450 }, (_, i) => i));
  assert.deepEqual(forward.toReversed(), Array.from({ length: 450 }, (_, i) => frameAtProgress(1 - i / 449, 450)));
  for (const p of [-1, NaN, Infinity]) assert.equal(frameAtProgress(p, 450), 0);
  assert.equal(frameAtProgress(2, 450), 449);
  assert.equal(frameAtProgress(0.5, 1), 0);
});

test('large scroll jumps stay within two frames and leave no playback backlog', () => {
  const forward = boundedFrameTowards(0, 80, 1 / 60);
  const reverse = boundedFrameTowards(80, 0, 1 / 60);
  assert.ok(forward >= 78 && forward <= 80);
  assert.ok(reverse >= 0 && reverse <= 2);
  let settled = forward;
  for (let i = 0; i < 12; i++) settled = boundedFrameTowards(settled, 80, 1 / 60);
  assert.equal(settled, 80);
  assert.equal(boundedFrameTowards(-1, 140, 1 / 60), 140);
});

test('frame paths support zero-based and one-based exports and custom naming', () => {
  const source = { directory: '/frames/hero/desktop/', prefix: 'frame_', extension: 'webp' as const, firstFrame: 1, frameCount: 450, padding: 4 };
  assert.equal(frameUrl(source, 0), '/frames/hero/desktop/frame_0001.webp');
  assert.equal(frameUrl(source, 449), '/frames/hero/desktop/frame_0450.webp');
  assert.equal(frameUrl({ ...source, prefix: '', firstFrame: 0, padding: 5 }, 0), '/frames/hero/desktop/00000.webp');
});

test('preload window prioritizes the target, bounds requests, and supports both directions', () => {
  assert.deepEqual(nearbyFrames(0, 450, 3), [0, 1, 2, 3]);
  assert.deepEqual(nearbyFrames(449, 450, 3), [449, 448, 447, 446]);
  assert.deepEqual(nearbyFrames(225, 450, 2), [225, 226, 224, 227, 223]);
});

test('cover crop fills portrait and ultrawide canvases without stretching', () => {
  for (const [width, height] of [[390, 844], [1440, 900], [3440, 1440]]) {
    const rect = coverRect(1920, 1080, width, height);
    assert.ok(rect.width >= width && rect.height >= height);
    assert.ok(Math.abs(rect.width / rect.height - 1920 / 1080) < 1e-10);
    assert.equal(rect.x * 2 + rect.width, width);
    assert.equal(rect.y * 2 + rect.height, height);
  }
});
