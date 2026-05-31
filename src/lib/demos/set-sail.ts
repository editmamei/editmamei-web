import type { Demo, DemoPrompt } from '$lib/types';

export const setSail: Demo = {
	slug: 'set-sail',
	title: 'Set Sail',
	summary:
		'A full editorial workup for a wide-angle iPhone sailing shot. Deepens sky and ocean toward cobalt, paints golden-hour warmth at the horizon, recovers blown highlights, sharpens the rigging, and finishes on a soft focus vignette.',
	before: '/demos/set-sail/before.jpg',
	after: '/demos/set-sail/after.jpg',
	beforeAlt:
		'Original iPhone photo of a sailboat on open water — flat contrast, slightly hazy sky, muted blues',
	afterAlt:
		'The same sailing photo after the Set Sail template — deep cobalt sky and ocean, warm golden glow at the horizon, crisp rigging, gentle focus vignette',
	layers: [
		{
			name: 'Tone Foundation',
			kind: 'levels',
			summary:
				'Black point lifted, midtones gently opened, white point pulled in. Sets the contrast bed every layer above sits on top of.'
		},
		{
			name: 'Dehaze + Punch',
			kind: 'brightness-contrast',
			summary:
				'A small contrast push that cuts atmospheric haze and gives the flat iPhone source immediate bite without losing shadow detail.'
		},
		{
			name: 'Vibrancy Boost',
			kind: 'hue-saturation',
			summary:
				'Master saturation lift, plus a targeted push on Blues and Cyans — the sky deepens toward cobalt, the ocean reads as richer teal. Warm tones are left alone so skin and rigging stay natural.'
		},
		{
			name: 'Golden Hour Warmth',
			kind: 'hue-saturation',
			summary:
				'Yellows shifted toward orange and intensified, Reds nudged warm. Paints in the late-afternoon glow at the horizon without warming the cool half of the frame.'
		},
		{
			name: 'Warm Tint Wash',
			kind: 'pixel',
			summary:
				'A muted amber solid-color layer set to Soft Light at 20%. A barely-there global temperature lift that ties the cool blues and the warm horizon together.'
		},
		{
			name: 'Shadow Lift',
			kind: 'brightness-contrast',
			summary:
				'A gentle open-up on the deep tones so the hull, rigging, and waterline retain detail under the global contrast boost. Dialed back to taste after the first pass came in too hot.'
		},
		{
			name: 'Sky Highlight Recovery',
			kind: 'levels',
			summary:
				'Pulls the upper sky’s white point in and darkens its midtones through a feathered rectangular mask. Blown highlights recover; the subject below is untouched.',
			masked: true
		},
		{
			name: 'High-Pass Sharpening',
			kind: 'pixel',
			summary:
				'Capture sharpening done the editorial way — a duplicate of the original run through High Pass at 1.2px radius, blended on Overlay at 65%. Crisp rigging, no halos.'
		},
		{
			name: 'Focus Vignette',
			kind: 'pixel',
			summary:
				'Black layer at Multiply 40% with a heavily-feathered ellipse cleared from the center. Draws the eye toward the boat without a visible ring.',
			masked: true
		}
	]
};

export const setSailPrompt: DemoPrompt = {
	voice: 'novice',
	label: 'Casual',
	text: 'give this shot a full work-up. analyze what could be improved, research the expert processes if you need to, then implement'
};
