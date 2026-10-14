// Editmamei share kit: draws a shared edit as a short 9:16 video, 4:5 carousel slides and a before/after
// picture, all on a canvas in the visitor's browser. Nothing leaves the browser. The same file is used by
// Connect's share details page (the downloads) and by editmamei.com/gallery/<id> (the player only); keep the
// two copies identical (editmamei-remote assets/kit/share-kit.js, editmamei-web src/lib/gallery/share-kit.js).
//
// A share is the page data Connect serves at /g/<id>.json: { title, before, after, frames, steps, chapters,
// aligned }. Pictures are loaded by the caller (loadPictures) and passed in by name.
//
// Plain browser JavaScript, not type-checked (its tests: editmamei-remote tests/share-kit.test.ts).
// @ts-nocheck

export const REEL_W = 1080;
export const REEL_H = 1920;
export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
export const FPS = 30;
/** Instagram's overlays cover the top and bottom of a reel: the photo and text stay inside this band (measured). */
export const SAFE_TOP = 260;
export const SAFE_BOTTOM = 1680;
const SIDE = 90;
const BEAT = 1.9;
const FADE = 0.45;
const WIPE = 1.3;
const REVEAL_HOLD = 1.1;
const END = 2.2;
/** Instagram takes at most this many slides. */
export const MAX_SLIDES = 10;

const DEEP = '#0f2922';
const ACCENT = '#ceff8c';
const TITLE_FONT = '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif';
const BODY_FONT = '"Geist", "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif';

/**
 * The beats of a share: the before, one per chapter (its frame, or the after for a chapter with no frame),
 * the reveal (the before wiped into the after), then the end card. A share made before chapters has a beat per
 * step picture instead; one with no before picture shows its chapters over the after.
 * @param {{ title: string, before: string|null, after: string, frames: string[], steps: Array<{title:string, detail:string, frame:number|null}>, chapters: Array<{title:string, text:string, frame:number|null}> }} share
 * @returns {Array<{ kind: 'still'|'reveal'|'end', image?: string, from?: string, counter?: string, title?: string, text?: string, duration: number }>}
 */
export function timeline(share) {
  const beats = [];
  // A chapter with no frame (a removal or a crop is not a filter) holds the picture before it, so the after is not given away early.
  let shown = share.before || share.after;
  const frameOf = (i) => (shown = i === null || i === undefined || !share.frames[i] ? shown : share.frames[i]);
  const chapters = share.chapters && share.chapters.length
    ? share.chapters.map((c) => ({ image: frameOf(c.frame), title: c.title, text: c.text || '' }))
    : share.frames.map((f, i) => {
        const last = [...share.steps].reverse().find((s) => s.frame === i);
        return { image: f, title: last ? last.title : `Step ${i + 1}`, text: last ? last.detail : '' };
      });
  if (share.before) beats.push({ kind: 'still', image: share.before, title: 'Before', text: share.title, duration: BEAT });
  chapters.forEach((c, i) => beats.push({ kind: 'still', image: c.image, counter: `${i + 1}/${chapters.length}`, title: c.title, text: c.text, duration: BEAT }));
  // Pictures of different shapes cannot be wiped one into the other: they cross-fade.
  if (share.before) beats.push({ kind: 'reveal', from: share.before, image: share.after, aligned: share.aligned !== false, title: 'After', text: share.title, duration: WIPE + REVEAL_HOLD });
  else beats.push({ kind: 'still', image: share.after, title: 'After', text: share.title, duration: BEAT });
  beats.push({ kind: 'end', duration: END });
  return beats;
}

export const durationOf = (beats) => beats.reduce((sum, b) => sum + b.duration, 0);

/** Load the pictures a share names, by address. Same-origin or CORS-served pictures keep the canvas exportable. */
export async function loadPictures(urls) {
  const unique = [...new Set(urls.filter(Boolean))];
  const pairs = await Promise.all(
    unique.map(
      (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.decoding = 'async';
          img.onload = () => resolve([url, img]);
          img.onerror = () => reject(new Error(`A picture could not be loaded.`));
          img.src = url;
        })
    )
  );
  return Object.fromEntries(pairs);
}

/** Wait for the faces the canvas text uses, so the first frame is not drawn in a fallback font. */
export async function loadFonts() {
  if (!document.fonts || !document.fonts.load) return;
  await Promise.all(['800 52px "Bricolage Grotesque"', '600 34px "Bricolage Grotesque"'].map((f) => document.fonts.load(f).catch(() => undefined)));
}

const ease = (p) => p * p * (3 - 2 * p);
const clamp01 = (p) => Math.max(0, Math.min(1, p));

/** The photo's box: as large as fits inside the band, centred. */
function photoBox(img, x, y, w, h) {
  const s = Math.min(w / img.naturalWidth, h / img.naturalHeight);
  const pw = img.naturalWidth * s;
  const ph = img.naturalHeight * s;
  return { x: x + (w - pw) / 2, y: y + (h - ph) / 2, w: pw, h: ph };
}

/** A blurred, darkened copy of each picture, made once at a small size: the backdrop that fills the frame around the photo. */
const backdrops = new WeakMap();
function backdropOf(img) {
  let c = backdrops.get(img);
  if (!c) {
    c = document.createElement('canvas');
    c.width = 270;
    c.height = 480;
    const x = c.getContext('2d');
    const s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    x.filter = 'blur(14px) saturate(1.2)';
    x.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
    x.filter = 'none';
    x.fillStyle = 'rgba(8, 20, 16, 0.55)';
    x.fillRect(0, 0, c.width, c.height);
    backdrops.set(img, c);
  }
  return c;
}

function paintBackdrop(ctx, img, w, h, alpha) {
  if (!img || alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(backdropOf(img), 0, 0, w, h);
  ctx.restore();
}

/** The small wordmark at the top of the band. */
function wordmark(ctx, w, k) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.font = `800 ${40 * k}px ${TITLE_FONT}`;
  ctx.fillText('Editmamei', SIDE * k, (SAFE_TOP + 4) * k);
  ctx.restore();
}

function rounded(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Draw `img` into `box`, pushed in by `zoom` (1 = fitted) about its centre, clipped to the box; `reveal` < 1 shows the left part only. */
function paintPhoto(ctx, img, box, zoom, alpha, reveal, radius) {
  ctx.save();
  rounded(ctx, box.x, box.y, box.w, box.h, radius);
  ctx.clip();
  if (reveal < 1) {
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.w * reveal, box.h);
    ctx.clip();
  }
  ctx.globalAlpha = alpha;
  const w = box.w * zoom;
  const h = box.h * zoom;
  ctx.drawImage(img, box.x - (w - box.w) / 2, box.y - (h - box.h) / 2, w, h);
  ctx.restore();
}

/** Words wrapped to `maxWidth`, at most `lines` lines (the last one shortened with an ellipsis). */
function wrap(ctx, text, maxWidth, lines) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const out = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) line = next;
    else {
      if (line) out.push(line);
      line = word;
    }
  }
  if (line) out.push(line);
  if (out.length > lines) {
    out.length = lines;
    let last = out[lines - 1];
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    out[lines - 1] = `${last}…`;
  }
  return out;
}

/**
 * The caption chip in the photo's lower-left corner: a small counter, the title in the brand face and up to two
 * lines of text. `k` scales a 1080-wide design; `alpha` fades it.
 */
function caption(ctx, beat, box, k, alpha) {
  if (!beat.title || alpha <= 0) return;
  const pad = 26 * k;
  const maxW = Math.min(box.w - 2 * pad, 820 * k);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `800 ${50 * k}px ${TITLE_FONT}`;
  const title = wrap(ctx, beat.title, maxW - 2 * pad, 1)[0] || '';
  ctx.font = `500 ${32 * k}px ${BODY_FONT}`;
  const text = beat.text ? wrap(ctx, beat.text, maxW - 2 * pad, 2) : [];
  const counterH = beat.counter ? 40 * k : 0;
  const h = pad * 2 + counterH + 58 * k + text.length * 42 * k;
  ctx.font = `800 ${50 * k}px ${TITLE_FONT}`;
  let w = ctx.measureText(title).width;
  ctx.font = `500 ${32 * k}px ${BODY_FONT}`;
  for (const t of text) w = Math.max(w, ctx.measureText(t).width);
  w = Math.min(maxW, w + 2 * pad);
  const x = box.x + pad;
  const y = box.y + box.h - pad - h;
  ctx.fillStyle = 'rgba(10, 22, 18, 0.72)';
  rounded(ctx, x, y, w, h, 22 * k);
  ctx.fill();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  let ty = y + pad;
  if (beat.counter) {
    ctx.fillStyle = ACCENT;
    ctx.font = `700 ${28 * k}px ${TITLE_FONT}`;
    ctx.fillText(beat.counter, x + pad, ty);
    ty += counterH;
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${50 * k}px ${TITLE_FONT}`;
  ctx.fillText(title, x + pad, ty);
  ty += 58 * k;
  ctx.fillStyle = 'rgba(255,255,255,0.86)';
  ctx.font = `500 ${32 * k}px ${BODY_FONT}`;
  for (const t of text) {
    ctx.fillText(t, x + pad, ty + 4 * k);
    ty += 42 * k;
  }
  ctx.restore();
}

function endCard(ctx, w, h, k) {
  ctx.fillStyle = DEEP;
  ctx.fillRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${110 * k}px ${TITLE_FONT}`;
  ctx.fillText('Editmamei', w / 2, h / 2 - 40 * k);
  ctx.fillStyle = ACCENT;
  ctx.font = `700 ${42 * k}px ${TITLE_FONT}`;
  ctx.fillText('Made with Editmamei Connect', w / 2, h / 2 + 60 * k);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = `500 ${36 * k}px ${BODY_FONT}`;
  ctx.fillText('editmamei.com/gallery', w / 2, h / 2 + 125 * k);
}

/**
 * The video at time `t` (seconds) on a canvas of w x h (9:16): the photo fills the safe band, pushed in slowly;
 * beats cross-fade; the reveal wipes the before into the after with a bright edge; the end card closes it.
 */
export function drawReel(ctx, w, h, beats, pictures, t) {
  const k = w / REEL_W;
  ctx.fillStyle = DEEP;
  ctx.fillRect(0, 0, w, h);
  let at = 0;
  let i = 0;
  while (i < beats.length - 1 && t >= at + beats[i].duration) at += beats[i++].duration;
  const beat = beats[i];
  const local = t - at;
  const band = { x: SIDE * k, y: (SAFE_TOP + 70) * k, w: w - 2 * SIDE * k, h: (SAFE_BOTTOM - SAFE_TOP - 70) * k };
  const radius = 26 * k;
  const zoomAt = (p) => 1 + 0.04 * ease(clamp01(p));
  const still = (b, alpha, progress) => {
    const img = pictures[b.image];
    if (!img) return null;
    const box = photoBox(img, band.x, band.y, band.w, band.h);
    paintPhoto(ctx, img, box, zoomAt(progress), alpha, 1, radius);
    return box;
  };

  if (beat.kind === 'end') {
    const prev = beats[i - 1];
    if (prev && prev.image) still(prev, 1, 1);
    ctx.save();
    ctx.globalAlpha = ease(clamp01(local / 0.4));
    endCard(ctx, w, h, k);
    ctx.restore();
    return;
  }
  const prev = i > 0 ? beats[i - 1] : null;
  const fadeIn = prev && prev.kind !== 'end' && beat.kind === 'still' ? ease(clamp01(local / FADE)) : 1;
  // The backdrop: the beat's own picture, cross-faded with the one before it.
  if (prev && prev.image) paintBackdrop(ctx, pictures[prev.image], w, h, 1);
  paintBackdrop(ctx, pictures[beat.kind === 'reveal' ? beat.from : beat.image], w, h, prev && prev.image ? fadeIn : 1);
  if (beat.kind === 'reveal') paintBackdrop(ctx, pictures[beat.image], w, h, ease(clamp01(local / WIPE)));
  wordmark(ctx, w, k);
  if (prev && fadeIn < 1) still(prev, 1, 1);
  let box;
  if (beat.kind === 'reveal') {
    const from = pictures[beat.from];
    const to = pictures[beat.image];
    if (!from || !to) return;
    box = photoBox(to, band.x, band.y, band.w, band.h);
    const p = ease(clamp01(local / WIPE));
    paintPhoto(ctx, from, photoBox(from, band.x, band.y, band.w, band.h), 1, 1, 1, radius);
    if (!beat.aligned) paintPhoto(ctx, to, box, 1, p, 1, radius);
    else paintPhoto(ctx, to, box, 1, 1, p, radius);
    if (beat.aligned && p > 0 && p < 1) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(box.x + box.w * p - 3 * k, box.y, 6 * k, box.h);
    }
  } else {
    box = still(beat, fadeIn, local / beat.duration);
  }
  if (box) caption(ctx, beat, box, k, beat.kind === 'reveal' ? ease(clamp01((local - WIPE * 0.6) / 0.4)) : fadeIn);
}

/**
 * Play the video on a canvas, looping. A tap or click pauses and resumes it. With reduced motion asked for, it starts paused
 * on the finished edit. Returns a function that stops it for good.
 */
export function play(canvas, beats, pictures) {
  const ctx = canvas.getContext('2d');
  const total = durationOf(beats);
  const still = Math.max(0, total - END - 0.05);
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  let offset = reduced ? still : 0;
  let started = 0;
  const tick = (now) => {
    drawReel(ctx, canvas.width, canvas.height, beats, pictures, (offset + (now - started) / 1000) % total);
    raf = requestAnimationFrame(tick);
  };
  const start = () => {
    started = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const pause = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    offset = (offset + (performance.now() - started) / 1000) % total;
  };
  const toggle = () => (raf ? pause() : start());
  canvas.style.cursor = 'pointer';
  canvas.addEventListener('click', toggle);
  if (reduced) drawReel(ctx, canvas.width, canvas.height, beats, pictures, still);
  else start();
  return () => {
    cancelAnimationFrame(raf);
    canvas.removeEventListener('click', toggle);
  };
}

export const canEncodeVideo = () => typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined';

/**
 * The video as a 1080x1920 H.264 MP4. `mp4` is the mp4-muxer module (the caller loads it: the website from its
 * package, Connect from its own copy). `onProgress` gets 0..1.
 */
export async function encodeReel(beats, pictures, mp4, onProgress = () => undefined) {
  const { Muxer, ArrayBufferTarget } = mp4;
  let config;
  for (const codec of ['avc1.640028', 'avc1.4d0028', 'avc1.42002a']) {
    const candidate = { codec, width: REEL_W, height: REEL_H, bitrate: 6_000_000, framerate: FPS };
    if ((await VideoEncoder.isConfigSupported(candidate)).supported) {
      config = candidate;
      break;
    }
  }
  if (!config) throw new Error('This browser cannot make a video. Try a recent Chrome, Edge or Safari.');
  const target = new ArrayBufferTarget();
  const muxer = new Muxer({ target, video: { codec: 'avc', width: REEL_W, height: REEL_H }, fastStart: 'in-memory' });
  let failure;
  const encoder = new VideoEncoder({
    output: (chunk, meta) => {
      try {
        muxer.addVideoChunk(chunk, meta);
      } catch (e) {
        failure = failure || e;
      }
    },
    error: (e) => (failure = failure || e),
  });
  try {
    encoder.configure(config);
    const canvas = document.createElement('canvas');
    canvas.width = REEL_W;
    canvas.height = REEL_H;
    const ctx = canvas.getContext('2d');
    const total = Math.ceil(durationOf(beats) * FPS);
    for (let i = 0; i < total; i++) {
      if (failure) throw failure;
      drawReel(ctx, REEL_W, REEL_H, beats, pictures, i / FPS);
      const frame = new VideoFrame(canvas, { timestamp: Math.round((i * 1_000_000) / FPS), duration: Math.round(1_000_000 / FPS) });
      encoder.encode(frame, { keyFrame: i % (FPS * 2) === 0 });
      frame.close();
      while (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 0));
      if (i % 6 === 0) {
        onProgress(i / total);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
    await encoder.flush();
    if (failure) throw failure;
  } finally {
    if (encoder.state !== 'closed') encoder.close();
  }
  muxer.finalize();
  onProgress(1);
  return new Blob([target.buffer], { type: 'video/mp4' });
}

const toBlob = (canvas, type, quality) =>
  new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('The picture could not be made.'))), type, quality));

/**
 * The carousel: 4:5 slides (1080x1350 JPEGs) of the before, each chapter, the after and the end card, at most
 * MAX_SLIDES (chapters past what fits are left out, never the before, the after or the end card).
 */
export async function carouselSlides(beats, pictures) {
  const stills = beats.filter((b) => b.kind !== 'end');
  const room = MAX_SLIDES - 1;
  let chosen = stills;
  if (stills.length > room) {
    const first = stills[0];
    const last = stills[stills.length - 1];
    chosen = [first, ...stills.slice(1, -1).slice(0, room - 2), last];
  }
  const slides = [];
  const k = SLIDE_W / REEL_W;
  for (const beat of chosen) {
    const canvas = document.createElement('canvas');
    canvas.width = SLIDE_W;
    canvas.height = SLIDE_H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = DEEP;
    ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);
    const img = pictures[beat.image];
    if (img) {
      const box = photoBox(img, 48, 48, SLIDE_W - 96, SLIDE_H - 96);
      paintPhoto(ctx, img, box, 1, 1, 1, 24);
      caption(ctx, beat, box, k, 1);
    }
    slides.push(await toBlob(canvas, 'image/jpeg', 0.92));
  }
  const end = document.createElement('canvas');
  end.width = SLIDE_W;
  end.height = SLIDE_H;
  endCard(end.getContext('2d'), SLIDE_W, SLIDE_H, k);
  slides.push(await toBlob(end, 'image/jpeg', 0.92));
  return slides;
}

/** Before and after side by side on one picture, with a small Editmamei line underneath, as a PNG. */
export async function beforeAfter(before, after) {
  const pad = 48;
  const gap = 24;
  const strip = 120;
  let cellH = 1200;
  const widthAt = (ch) => (before.naturalWidth / before.naturalHeight) * ch + (after.naturalWidth / after.naturalHeight) * ch;
  const maxW = 4096 - pad * 2 - gap;
  if (widthAt(cellH) > maxW) cellH = Math.floor((cellH * maxW) / widthAt(cellH));
  const wB = Math.round((before.naturalWidth / before.naturalHeight) * cellH);
  const wA = Math.round((after.naturalWidth / after.naturalHeight) * cellH);
  const canvas = document.createElement('canvas');
  canvas.width = pad * 2 + gap + wB + wA;
  canvas.height = pad + cellH + strip;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = DEEP;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const [img, x, cw, name] of [[before, pad, wB, 'Before'], [after, pad + wB + gap, wA, 'After']]) {
    paintPhoto(ctx, img, { x, y: pad, w: cw, h: cellH }, 1, 1, 1, 20);
    ctx.font = `700 34px ${TITLE_FONT}`;
    const tw = ctx.measureText(name).width + 40;
    ctx.fillStyle = 'rgba(10, 22, 18, 0.72)';
    rounded(ctx, x + 20, pad + 20, tw, 58, 29);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, x + 40, pad + 50);
  }
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 52px ${TITLE_FONT}`;
  ctx.fillText('Editmamei', pad, pad + cellH + strip / 2);
  ctx.fillStyle = ACCENT;
  ctx.font = `600 30px ${BODY_FONT}`;
  ctx.fillText('Made with Editmamei Connect', pad + 300, pad + cellH + strip / 2 + 4);
  return toBlob(canvas, 'image/png');
}

/** Save a file through a temporary link. */
export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/** Hand files to the phone's share sheet (where "Save to Photos" is); false when this browser cannot. */
export async function shareFiles(files, title) {
  if (!navigator.canShare || !navigator.canShare({ files })) return false;
  try {
    await navigator.share({ files, title });
    return true;
  } catch (error) {
    // The person closed the sheet: that is an answer, not a failure.
    if (error && error.name === 'AbortError') return true;
    return false;
  }
}
