// Browser-side rendering for the gallery replay, the reel download (WebCodecs
// plus mp4-muxer) and the before/after PNG. Everything is drawn on a canvas;
// the on-page player and the encoded video share drawFrame, so what people
// watch is what they download. Nothing leaves the browser.

export const REEL_W = 1080;
export const REEL_H = 1920;
const FPS = 30;
/** Seconds each frame is on screen, including the transition into it. */
export const HOLD = 1.6;
const FADE = 0.5;
const END_CARD = 2.2;

const BRAND_DEEP = '#0f2922';
const ACCENT = '#ceff8c';
const FONT = '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif';

export interface Scene {
	images: HTMLImageElement[];
	labels: string[];
	/** 'wipe' sweeps left to right (aligned before/after); otherwise a crossfade. */
	mode: 'fade' | 'wipe';
}

export interface LoadedImages {
	images: HTMLImageElement[];
	/** False when an image had to be loaded without CORS: it can be shown but not exported. */
	exportable: boolean;
}

function loadOne(src: string, cors: boolean): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		if (cors) img.crossOrigin = 'anonymous';
		img.decoding = 'async';
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error(`could not load ${src}`));
		img.src = src;
	});
}

/**
 * Load images for drawing. Tries CORS-enabled first, because a canvas that has
 * drawn a cross-origin image without CORS is tainted and cannot be encoded or
 * saved. Falls back to a plain load so the player still works.
 */
export async function loadImages(urls: string[]): Promise<LoadedImages> {
	let exportable = true;
	const images = await Promise.all(
		urls.map(async (u) => {
			try {
				return await loadOne(u, true);
			} catch {
				exportable = false;
				return await loadOne(u, false);
			}
		})
	);
	return { images, exportable };
}

export const sceneDuration = (scene: Scene, endCard: boolean) =>
	scene.images.length * HOLD + (endCard ? END_CARD : 0);

const ease = (p: number) => p * p * (3 - 2 * p);

function containRect(img: HTMLImageElement, x: number, y: number, w: number, h: number) {
	const s = Math.min(w / img.naturalWidth, h / img.naturalHeight);
	const dw = img.naturalWidth * s;
	const dh = img.naturalHeight * s;
	return { x: x + (w - dw) / 2, y: y + (h - dh) / 2, w: dw, h: dh };
}

function roundRectPath(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number
) {
	ctx.beginPath();
	ctx.roundRect(x, y, w, h, r);
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
	if (ctx.measureText(text).width <= maxWidth) return text;
	let t = text;
	while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) t = t.slice(0, -1);
	return `${t}…`;
}

function pill(
	ctx: CanvasRenderingContext2D,
	text: string,
	cx: number,
	cy: number,
	k: number,
	maxW: number
) {
	ctx.font = `600 ${40 * k}px ${FONT}`;
	const label = fitText(ctx, text, maxW - 72 * k);
	const w = ctx.measureText(label).width + 56 * k;
	const h = 76 * k;
	ctx.fillStyle = 'rgba(0,0,0,0.55)';
	roundRectPath(ctx, cx - w / 2, cy - h / 2, w, h, h / 2);
	ctx.fill();
	ctx.fillStyle = '#fff';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(label, cx, cy + 2 * k);
}

function endCard(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	k: number,
	icon: HTMLImageElement | null
) {
	ctx.fillStyle = BRAND_DEEP;
	ctx.fillRect(0, 0, w, h);
	const cy = h / 2;
	if (icon) ctx.drawImage(icon, w / 2 - 110 * k, cy - 300 * k, 220 * k, 220 * k);
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#fff';
	ctx.font = `800 ${104 * k}px ${FONT}`;
	ctx.fillText('Editmamei', w / 2, cy + 30 * k);
	ctx.fillStyle = ACCENT;
	ctx.font = `600 ${44 * k}px ${FONT}`;
	ctx.fillText('Made with Editmamei Connect', w / 2, cy + 130 * k);
	ctx.fillStyle = 'rgba(255,255,255,0.7)';
	ctx.font = `500 ${40 * k}px ${FONT}`;
	ctx.fillText('connect.editmamei.com', w / 2, cy + 200 * k);
}

/**
 * Draw the scene at time `t` (seconds). With `endCard`, the timeline continues
 * past the last frame into the Editmamei end card.
 */
export function drawFrame(
	ctx: CanvasRenderingContext2D,
	w: number,
	h: number,
	scene: Scene,
	t: number,
	withEndCard: boolean,
	icon: HTMLImageElement | null
) {
	const k = w / REEL_W;
	const n = scene.images.length;
	ctx.fillStyle = BRAND_DEEP;
	ctx.fillRect(0, 0, w, h);

	const main = n * HOLD;
	const tt = Math.min(Math.max(t, 0), main - 1e-6);
	const cur = Math.min(n - 1, Math.floor(tt / HOLD));
	const p = cur === 0 ? 1 : ease(Math.min(1, (tt - cur * HOLD) / FADE));

	const bx = 48 * k;
	const by = 170 * k;
	const bw = w - 96 * k;
	const bh = h - 170 * k - 330 * k;
	const radius = 28 * k;

	const paint = (img: HTMLImageElement, alpha: number, reveal: number) => {
		const r = containRect(img, bx, by, bw, bh);
		ctx.save();
		roundRectPath(ctx, r.x, r.y, r.w, r.h, radius);
		ctx.clip();
		if (reveal < 1) {
			ctx.beginPath();
			ctx.rect(r.x, r.y, r.w * reveal, r.h);
			ctx.clip();
		}
		ctx.globalAlpha = alpha;
		ctx.drawImage(img, r.x, r.y, r.w, r.h);
		ctx.restore();
	};

	if (cur === 0 || p >= 1) {
		paint(scene.images[cur], 1, 1);
	} else {
		paint(scene.images[cur - 1], 1, 1);
		if (scene.mode === 'wipe') paint(scene.images[cur], 1, p);
		else paint(scene.images[cur], p, 1);
	}

	const label = scene.labels[p > 0.5 ? cur : Math.max(0, cur - 1)];
	if (label) pill(ctx, label, w / 2, h - 190 * k, k, w - 96 * k);

	if (withEndCard && t > main) {
		const q = ease(Math.min(1, (t - main) / 0.4));
		ctx.save();
		ctx.globalAlpha = q;
		endCard(ctx, w, h, k, icon);
		ctx.restore();
	}
}

export const canEncodeVideo = () =>
	typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined';

/** Encode the scene plus the end card as a 1080x1920 H.264 MP4. */
export async function encodeReel(
	scene: Scene,
	icon: HTMLImageElement | null,
	onProgress: (done: number) => void
): Promise<Blob> {
	const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');

	let config: VideoEncoderConfig | undefined;
	for (const codec of ['avc1.640028', 'avc1.4d0028', 'avc1.42002a']) {
		const candidate: VideoEncoderConfig = {
			codec,
			width: REEL_W,
			height: REEL_H,
			bitrate: 6_000_000,
			framerate: FPS
		};
		if ((await VideoEncoder.isConfigSupported(candidate)).supported) {
			config = candidate;
			break;
		}
	}
	if (!config) throw new Error('This browser has no H.264 encoder.');

	const target = new ArrayBufferTarget();
	const muxer = new Muxer({
		target,
		video: { codec: 'avc', width: REEL_W, height: REEL_H },
		fastStart: 'in-memory'
	});

	let failure: unknown;
	const encoder = new VideoEncoder({
		output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
		error: (e) => (failure = e)
	});
	encoder.configure(config);

	const canvas = document.createElement('canvas');
	canvas.width = REEL_W;
	canvas.height = REEL_H;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas is not available.');

	const total = Math.ceil(sceneDuration(scene, true) * FPS);
	for (let i = 0; i < total; i++) {
		if (failure) throw failure;
		drawFrame(ctx, REEL_W, REEL_H, scene, i / FPS, true, icon);
		const frame = new VideoFrame(canvas, {
			timestamp: Math.round((i * 1_000_000) / FPS),
			duration: Math.round(1_000_000 / FPS)
		});
		encoder.encode(frame, { keyFrame: i % (FPS * 2) === 0 });
		frame.close();
		while (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 0));
		if (i % 6 === 0) {
			onProgress(i / total);
			await new Promise((r) => setTimeout(r, 0));
		}
	}
	await encoder.flush();
	encoder.close();
	if (failure) throw failure;
	muxer.finalize();
	onProgress(1);
	return new Blob([target.buffer], { type: 'video/mp4' });
}

/** Before and after side by side, with an Editmamei strip underneath, as a PNG. */
export async function beforeAfterPng(
	before: HTMLImageElement,
	after: HTMLImageElement,
	icon: HTMLImageElement | null
): Promise<Blob> {
	const pad = 48;
	const gap = 24;
	const strip = 170;
	let cellH = 1200;
	const widthAt = (ch: number) =>
		(before.naturalWidth / before.naturalHeight) * ch +
		(after.naturalWidth / after.naturalHeight) * ch;
	const maxW = 4096 - pad * 2 - gap;
	if (widthAt(cellH) > maxW) cellH = Math.floor((cellH * maxW) / widthAt(cellH));
	const wB = Math.round((before.naturalWidth / before.naturalHeight) * cellH);
	const wA = Math.round((after.naturalWidth / after.naturalHeight) * cellH);

	const W = pad * 2 + gap + wB + wA;
	const H = pad + cellH + pad + strip;
	const canvas = document.createElement('canvas');
	canvas.width = W;
	canvas.height = H;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas is not available.');

	ctx.fillStyle = BRAND_DEEP;
	ctx.fillRect(0, 0, W, H);
	const cells: [HTMLImageElement, number, string][] = [
		[before, pad, 'Before'],
		[after, pad + wB + gap, 'After']
	];
	for (const [img, x, name] of cells) {
		const cw = img === before ? wB : wA;
		ctx.save();
		roundRectPath(ctx, x, pad, cw, cellH, 20);
		ctx.clip();
		ctx.drawImage(img, x, pad, cw, cellH);
		ctx.restore();
		ctx.font = `600 34px ${FONT}`;
		const tw = ctx.measureText(name).width + 40;
		ctx.fillStyle = 'rgba(0,0,0,0.55)';
		roundRectPath(ctx, x + 20, pad + 20, tw, 58, 29);
		ctx.fill();
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'middle';
		ctx.fillText(name, x + 40, pad + 50);
	}

	const sy = pad + cellH + pad;
	if (icon) ctx.drawImage(icon, pad, sy + 25, 120, 120);
	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#fff';
	ctx.font = `800 64px ${FONT}`;
	ctx.fillText('Editmamei', pad + 150, sy + 62);
	ctx.fillStyle = ACCENT;
	ctx.font = `600 34px ${FONT}`;
	ctx.fillText('Made with Editmamei Connect · connect.editmamei.com', pad + 150, sy + 118);

	return new Promise((resolve, reject) =>
		canvas.toBlob(
			(b) => (b ? resolve(b) : reject(new Error('Could not make the image.'))),
			'image/png'
		)
	);
}

/** Save a blob through a temporary link. */
export function saveBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.append(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
