import type { Demo, DemoPrompt } from '$lib/types';

export const vividRose: Demo = {
	slug: 'vivid-rose',
	title: 'Vivid Rose',
	summary:
		'A refined, dimensional grade for a close-up garden bloom. Cuts the haze, recovers crispness on the hero flower, deepens local contrast, mutes the background so the rose steps forward, and finishes on a monochromatic film grain.',
	before: '/demos/vivid-rose/before.jpg',
	after: '/demos/vivid-rose/after.jpg',
	beforeAlt: 'Original close-up photo of a rose bush — slightly hazy, flat contrast',
	afterAlt:
		'The same rose photo after the Vivid Rose template — crisper hero bloom, deeper foliage, distance receded, tactile film grain',
	layers: [
		{
			name: 'Sharpened Detail',
			kind: 'pixel',
			summary:
				'Capture sharpening on a duplicate of the original. Restores fine detail across the whole frame without ever touching the source photo underneath.'
		},
		{
			name: 'Rose Sharpen',
			kind: 'pixel',
			summary:
				'A focus-recovery pass concentrated on just the hero bloom — Select Subject isolates the flower so the sharpening only lands there. Rescues a slight focus miss without crisping up the background.',
			masked: true
		},
		{
			name: 'Clarity',
			kind: 'pixel',
			summary:
				'Wide-radius local contrast in the midtones. Adds three-dimensional presence and naturally favors the detailed foreground over the smoother background bokeh.'
		},
		{
			name: 'Contrast',
			kind: 'brightness-contrast',
			summary: 'A gentle global contrast lift to cut the haze and restore depth.'
		},
		{
			name: 'Vibrance Boost',
			kind: 'hue-saturation',
			summary:
				'A single restrained saturation pass — richer greens and warmer petals without going neon. (Stacking a second one is what tipped the v1 into over-saturated.)'
		},
		{
			name: 'Atmospheric Depth',
			kind: 'hue-saturation',
			summary:
				'Mutes and lifts the distant top of the frame through a feathered mask, with the hero bloom subtracted out. Mimics how distance softens color in real air — the rose steps forward, the background recedes.',
			masked: true
		},
		{
			name: 'Focus Vignette',
			kind: 'brightness-contrast',
			summary:
				'Soft edge darkening with a wide feathered border biased toward the bloom. Pulls the eye inward without a visible ring.',
			masked: true
		},
		{
			name: 'Rose Color Correct',
			kind: 'hue-saturation',
			summary:
				'The safeguard. Masked to the bloom, pulls warm petals back from orange toward natural peach. Layer opacity is the live strength dial — mandatory whenever the hero flower is warm.',
			masked: true
		},
		{
			name: 'Film Grain',
			kind: 'pixel',
			summary:
				'Monochromatic noise on a 50% gray layer set to Soft Light. Adds tactile, filmic texture and ties the whole grade together — any residual softness now reads as intentional.'
		}
	]
};

export const vividRosePrompts: DemoPrompt[] = [
	{
		voice: 'novice',
		label: 'Casual',
		text: 'can you make this rose look way prettier? the flower should really pop and feel kind of dreamy — but keep it natural, not one of those over-edited filter looks'
	},
	{
		voice: 'pro',
		label: 'Pro',
		text: 'refined warm-toned dimensional grade. capture sharpen, isolated USM pass on the bloom, midtone clarity for foreground presence, single saturation, atmospheric desat on the upper background with the subject masked out, soft focus vignette toward the rose, finish on monochrome film grain at ~90 on soft light. color-guard the petals.'
	}
];
