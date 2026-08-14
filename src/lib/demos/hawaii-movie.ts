import type { LayerKind } from '$lib/types';

/**
 * Script data for the Hero "movie" demo (Category 1 of the 2026-06-13 demo
 * system plan). A scripted, cinematic playback of the real Editmamei co-work
 * loop on a Hawaii bay photo (Hanauma-style vista, IMG_1057): prompt → AI works
 * → checks in with you → finishes. Consumed by `HeroMovie.svelte`.
 *
 * FRAMES ARE REAL PHOTOSHOP EXPORTS (2026-06-13).
 * Each `frame-NN` is one cumulative export from a genuine non-destructive layer
 * stack built in Photoshop 27.2 (Brightness/Contrast → Vibrance → sky-masked
 * Hue/Sat → headland-masked warming Photo Filter → micro-contrast →
 * surf-masked lift → multiply vignette → 16:9 crop). Exported at 1400px WebP.
 * The layered master is `Hawaii-Movie-IMG_1057.psd` in PhotosInbox. The check-in
 * "cool" thumbnail reuses frame-04 (the pre-warm state); the decision warms the
 * headland (frame-05). No CSS `filter` stand-ins remain — `MovieFrame.filter`
 * stays optional only because the component reads it defensively.
 */

const DIR = '/demos/hawaii-movie';

export interface MovieFrame {
	/** Cumulative image after this beat (real `frame-NN` Photoshop export). */
	src: string;
	/** Optional CSS filter overlay. Unused now; component reads it defensively. */
	filter?: string;
}

export interface MovieLayerStep {
	/** Rail label shown in the layer side-rail. */
	name: string;
	/** PS layer kind (drives the rail's kind chip / icon). */
	kind: LayerKind;
	/** Canvas state after this layer lands. */
	frame: MovieFrame;
}

export interface ChatMessage {
	role: 'user' | 'ai';
	text: string;
}

export interface HeroMovieScript {
	/** Beat 1 — the request the user types into the prompt box. */
	prompt: string;
	/** Beat 2 — the AI's acknowledgement bubble. */
	aiAck: string;
	/** Beat 3 — the untouched source revealed full-frame. */
	original: MovieFrame;
	/** Beat 4 — layers that land before the check-in, in narrative order. */
	buildSteps: MovieLayerStep[];
	/** Beats 5–6 — the co-work check-in: AI surfaces a preview and asks. */
	checkin: {
		question: string;
		/** The "too cool" headland state shown in the preview thumbnail. */
		coolFrame: MovieFrame;
		userReply: string;
	};
	/** Beat 7 — the decision payoff: the headland warms in response to the reply. */
	resumeStep: MovieLayerStep;
	/** Beat 8 — remaining layers after the decision. */
	finishSteps: MovieLayerStep[];
	/** Beat 8 finish — the 16:9 crop / final wall-art result. */
	cropStep: MovieLayerStep;
	/** Closing caption held on the finished result. */
	caption: string;
}

export const hawaiiMovie: HeroMovieScript = {
	prompt:
		'Make this Hawaii bay shot print-ready wall art: deepen the sky, richer water, warm the headland, 16:9 crop.',
	aiAck: 'On it. Opening it in your Photoshop and starting the layers.',
	original: { src: `${DIR}/frame-00-original.webp` },
	buildSteps: [
		{ name: 'Tonal Base', kind: 'levels', frame: { src: `${DIR}/frame-01.webp` } },
		{ name: 'S-Punch', kind: 'curves', frame: { src: `${DIR}/frame-02.webp` } },
		{ name: 'Vibrance Lift', kind: 'hue-saturation', frame: { src: `${DIR}/frame-03.webp` } },
		{ name: 'Sky Blues', kind: 'hue-saturation', frame: { src: `${DIR}/frame-04.webp` } }
	],
	checkin: {
		question: 'Quick check on the headland: too cool, or just right?',
		// frame-04 is the pre-warm state — deliberately cool, motivating "a touch warmer".
		coolFrame: { src: `${DIR}/frame-04.webp` },
		userReply: 'A touch warmer.'
	},
	resumeStep: {
		name: 'Warm the Headland',
		kind: 'photo-filter',
		frame: { src: `${DIR}/frame-05.webp` }
	},
	finishSteps: [
		{ name: 'Texture Finish', kind: 'brightness-contrast', frame: { src: `${DIR}/frame-06.webp` } },
		{
			name: 'Wave Focal Lift',
			kind: 'brightness-contrast',
			frame: { src: `${DIR}/frame-07.webp` }
		},
		{ name: 'Vignette', kind: 'pixel', frame: { src: `${DIR}/frame-08.webp` } }
	],
	cropStep: {
		name: 'Stamp · 16:9 Crop',
		kind: 'pixel',
		frame: { src: `${DIR}/frame-09-final.webp` }
	},
	caption: 'Done. Fully layered, every step yours to adjust.'
};

/**
 * Every frame the movie paints, in play order, for preloading. The check-in
 * thumbnail reuses frame-04, so it needs no entry of its own.
 *
 * These are ~330 KB each and nothing else on the page requests them, so
 * `HeroMovie.svelte` warms them before playback rather than letting each one be
 * fetched at the instant its wipe starts.
 */
export const hawaiiMovieFrames: string[] = [
	hawaiiMovie.original.src,
	...hawaiiMovie.buildSteps.map((s) => s.frame.src),
	hawaiiMovie.resumeStep.frame.src,
	...hawaiiMovie.finishSteps.map((s) => s.frame.src),
	hawaiiMovie.cropStep.frame.src
];

/**
 * Flattened rail order (narrative order, lights top-to-bottom as the movie
 * plays). The "Warm the Headland" step sits between the pre-check-in build and the
 * finish so the decision payoff reads as the rail's turning point.
 */
export const hawaiiMovieRail: { name: string; kind: LayerKind }[] = [
	...hawaiiMovie.buildSteps.map(({ name, kind }) => ({ name, kind })),
	{ name: hawaiiMovie.resumeStep.name, kind: hawaiiMovie.resumeStep.kind },
	...hawaiiMovie.finishSteps.map(({ name, kind }) => ({ name, kind })),
	{ name: hawaiiMovie.cropStep.name, kind: hawaiiMovie.cropStep.kind }
];
