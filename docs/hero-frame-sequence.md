# Hero frame sequence handoff

The supplied `public/final-ezgif.com-video-to-webp-converter.webp` is active in
the hero. It contains 281 frames at 1280 × 720, approximately 18.9 FPS and 14.9
seconds. Its composited frames are stored in `public/frames/hero/desktop/` and
mapped to scroll progress rather than played on a timer.

## Attach the exported frames

1. Copy the frame folder into `public/frames/hero/desktop/`.
2. In `src/config/site.ts`, update `storefrontConfig.frameSequence.desktop` to
   match the actual files. The current sequence uses:

   ```text
   public/frames/hero/desktop/frame_0001.webp
   public/frames/hero/desktop/frame_0002.webp
   ...
   public/frames/hero/desktop/frame_0281.webp
   ```

   `directory` is the URL path without `public`. `prefix`, `extension`,
   `firstFrame`, `frameCount`, and `padding` control the naming. Set the **actual**
   count. Numbering must be consecutive. Zero-based
   names work with `firstFrame: 0`.

3. Set `poster` to the URL of the opening frame (or a separate optimized still).
   Set `portraitPoster` if there is a separate mobile composition. These remain
   visible during loading, on failure, with JavaScript disabled, and with reduced
   motion enabled. Until configured, the current storefront posters are used.
4. Optionally set `mobile` to another source object with smaller images of the
   same sequence; otherwise desktop frames are used at all sizes. Mobile uses
   its own frame count and switches at 767px, including on viewport resize.
5. Keep `enabled: true` after verifying the files exist, then build/deploy normally.

The entire sequence maps to the existing hero scroll range: 0% is the first
frame, 100% is the last, and scrolling backward reverses the sequence. Video
duration is not a playback timer. Existing chapter buttons, text, links, and the
progress bar use the same trigger. Scroll length remains controlled by
`.sf-journey` in `src/app/storefront.css`.

## Implementation and limits

- `src/components/showroom/FrameSequenceCanvas.tsx` is the separate canvas player.
- `src/lib/showroom/frame-sequence.ts` handles filenames, frame mapping, and crop.
- The player prioritizes the current route, then progressively fetches the full
  compressed sequence with at most four concurrent requests. Once loaded, those
  compressed frames remain in browser memory for the lifetime of the page, so
  later forward and reverse scrolling does not request them again.
- The canvas samples the latest scroll position on every display refresh. A
  large input jump never creates a queue of skipped frames: the visible frame is
  immediately constrained to within two source frames of the current scroll
  target. That small remainder eases to rest after input stops, avoiding both a
  long catch-up animation and an abrupt hard stop. Direction changes use the
  same bounded response.
- The decoded image cache is limited to 18 frames and approximately 72 MiB on
  desktop / 40 MiB on mobile. Keeping all 281 frames decoded would require about
  988 MiB, so decoded frames use a rolling window and evicted bitmaps are closed.
  In-flight decoding, the compressed cache, the browser HTTP cache, and the canvas
  need additional memory; these settings are not a limit on total browser memory.
- The compressed in-memory cache lasts until the page is reloaded or closed.
  The browser may also retain files in its HTTP cache across reloads, depending
  on the production host's cache headers; the player does not rely on that.
- Canvas drawing is capped at 2,073,600 pixels and 1.5 DPR. Frames use a centered
  cover crop; a portrait export can preserve more of the storefront on phones.
- No continuous render loop runs while idle, offscreen, or in a hidden tab.
  Existing requests may finish, but new work waits until the hero is visible.
- Missing target frames or a 12-second load timeout restore the still layout.
  Reduced motion uses the existing static chapters without loading the sequence.
- Frame mode does not initialize the WebGL scene.

## Check when the folder arrives

Confirm consecutive names, actual count, image dimensions and total transfer
size. Check first, close-up and final compositions on mobile, tablet, desktop and
ultrawide screens. Test slow and fast forward/reverse scrolling, chapter buttons,
resize, reduced motion, tab return, and a missing frame. Verify memory and network
behavior on a phone before claiming smooth performance. A frame rate by itself
does not guarantee lag-free scrubbing.
