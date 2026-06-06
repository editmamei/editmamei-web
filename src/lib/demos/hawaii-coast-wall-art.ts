import type { Demo, DemoPrompt } from '$lib/types';

export const hawaiiCoastWallArt: Demo = {
	slug: 'hawaii-coast-wall-art',
	title: 'Hawaii Coast Wall Art',
	headline: 'Print the coast.',
	summary:
		'A print-ready wall-art treatment for a handheld iPhone coastal shot. Deepens the sky toward saturated Hawaiian blue, pulls the ocean to rich turquoise, lifts the wave spray as the visual focal point, pulls the cyan glow out of the volcanic rock so it reads warm-dark instead of blue, and finishes on a gentle multiply vignette over a level 16:9 crop.',
	before: '/demos/hawaii-coast-wall-art/before.jpg',
	after: '/demos/hawaii-coast-wall-art/after.jpg',
	beforeAlt:
		'Original iPhone photo of a Hawaiian coastline — slightly hazy sky, flat blues, dark volcanic rocks with a cool blue tinge',
	afterAlt:
		'The same coastal scene after the Hawaii Coast Wall Art template — deep tropical sky, brilliant wave spray, rich turquoise water, warm dark lava rock, lush emerald vegetation, level horizon, 16:9 print framing',
	layers: [
		{
			name: 'Tonal Base',
			kind: 'levels',
			summary:
				'Slight midtone lift with compressed highlights. Sets the contrast bed every layer above sits on top of — protects cloud detail so the later sky-deepening pass doesn’t blow them out.'
		},
		{
			name: 'S-Punch',
			kind: 'curves',
			summary:
				'Medium S-curve for global midtone contrast. Adds the depth and drama a flat handheld iPhone source needs before any color work lands.'
		},
		{
			name: 'Vibrance Lift',
			kind: 'hue-saturation',
			summary:
				'Vibrance-weighted saturation push. Lifts blues and greens without pumping already-saturated tones — keeps rocks and skin from going neon.'
		},
		{
			name: 'Selective Color — Ocean + Sky',
			kind: 'selective-color',
			summary:
				'Cyans and Blues channels pushed cooler and deeper. Pulls the ocean to rich tropical turquoise and the sky toward deep sapphire blue.'
		},
		{
			name: 'Selective Color — Coastal Greens',
			kind: 'selective-color',
			summary:
				'Greens channel pulled toward cool emerald, away from yellow-green. Vegetation reads as lush coastal jungle instead of summer grass.'
		},
		{
			name: 'Selective Color — Lava Rock Fix',
			kind: 'selective-color',
			summary:
				'Cyan pulled aggressively out of Blacks and Neutrals. Keeps volcanic rock neutral-to-warm instead of blue-tinted — the fix for the common over-toned-shadows artifact.'
		},
		{
			name: 'Sky Unify',
			kind: 'photo-filter',
			summary:
				'Cooling photo filter at 12% density, luminosity preserved. A subtle atmospheric tie between the sky color and the ocean color.'
		},
		{
			name: 'Sky Blues',
			kind: 'hue-saturation',
			summary:
				'Sky-only saturation lift with a small hue shift cooler. Maximum vertical color travel from a deep sky down to the rich sea.'
		},
		{
			name: 'Texture Finish',
			kind: 'brightness-contrast',
			summary:
				'Micro-contrast kick that adds tactile bite for print output. Screens forgive flatness; the physical print needs this extra texture.'
		},
		{
			name: 'Wave Focal Lift',
			kind: 'curves',
			summary:
				'Masked S-curve over the wave-impact zone with a generous feather. Lifts the spray and crash as the primary focal point — no visible mask edge.',
			masked: true
		},
		{
			name: 'Rock Texture',
			kind: 'brightness-contrast',
			summary:
				'Masked contrast push and a small darken on the foreground lava. Extra surface texture without touching the sky above.',
			masked: true
		},
		{
			name: 'Vignette',
			kind: 'pixel',
			summary:
				'Black pixel layer at Multiply 25%, with a feathered ellipse cleared from the center. Pulls the eye inward toward the wave — strong enough to guide, subtle enough not to feel like a filter.'
		},
		{
			name: 'Shadow Warmth',
			kind: 'color-balance',
			summary:
				'Shadows nudged warm at 35% opacity. Keeps rock shadows neutral-warm rather than cold blue; reserves cool tones for water and sky only.'
		},
		{
			name: 'Horizon Stamp',
			kind: 'pixel',
			summary:
				'Visible stamped to a new pixel layer, then rotated -1.5° to level the waterline against a horizontal guide. The 16:9 crop after this lands a print-ready frame.'
		}
	]
};

export const hawaiiCoastWallArtProPrompt: DemoPrompt = {
	voice: 'pro',
	label: 'Pro',
	text: 'print-ready 16:9 coastal wall-art grade. upsample to 5400, then stack: levels base + s-curve, vibrance lift, selective color trifecta (ocean / greens / lava-fix), cooling photo filter 12 on sky, sky-only sat. masked focal lift on the wave, masked rock-texture contrast, multiply vignette ~25, color balance warm shadows ~35. stamp + de-rotate to level, 16:9 crop, sRGB out.'
};
