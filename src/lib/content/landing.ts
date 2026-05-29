import type { Capability, EditionRow, Pillar, WorkflowExample } from '$lib/types';

export const pillars: Pillar[] = [
	{
		title: 'The Photoshop you have, driven by language',
		body: 'Editmamei drives the real Adobe Photoshop you already installed — the full program, not a hosted web app or a cloud copy. Your AI talks to the desktop. Your files stay on your machine.'
	},
	{
		title: 'Non-destructive by default',
		body: 'Adjustment layers, masks, groups — Editmamei builds the kind of layer stack a working editor builds. Everything stays editable, maskable, removable. Nothing bakes into pixels unless you ask.'
	},
	{
		title: 'Recipes that reproduce',
		body: 'Save the edit you just made as a named template. Apply it later — to a different image, on a different day — and the AI reads its own previous reasoning to recreate the look. Editing decisions stop being one-shots.'
	}
];

export const capabilities: Capability[] = [
	{
		title: 'Documents',
		body: 'Open, save, export, close — PSD, JPEG, PNG, TIFF, DNG, HEIC, and the standard raw formats. Camera metadata (make, model, lens, ISO, focal length, GPS) and ACR develop settings surface to the AI before it edits.'
	},
	{
		title: 'Layers',
		body: 'Create, duplicate, delete, rename, reorder, group, merge, flatten. Set opacity, blend mode, visibility, locking. The complete layer tree returns as JSON, so the AI always knows the document structure.'
	},
	{
		title: 'Smart selections',
		body: 'Select Subject, Select Sky, Color Range, Magic Wand — plus rectangle and feather. Every selection returns area, edge complexity, and pixel counts, so the AI can verify before committing to a mask or adjustment.'
	},
	{
		title: 'Non-destructive adjustments',
		body: 'Curves, Levels, Hue/Saturation, Brightness/Contrast as adjustment layers — editable, maskable, removable. An active selection at call time becomes the new layer’s mask automatically.'
	},
	{
		title: 'Filters & styles',
		body: 'Gaussian Blur, Motion Blur, Sharpen, Add Noise. Drop shadow, stroke, outer glow as full layer styles. Auto-rasterization handles text and Smart Object inputs cleanly.'
	},
	{
		title: 'Masks',
		body: 'Layer masks and selection masks across the full lifecycle: create from selection, apply, invert, refine, delete. Discrete tools, predictable behavior.'
	},
	{
		title: 'Templates',
		body: 'A reproducible aesthetic recipe — the headline Pro feature. Editmamei captures the session evidence, renders before/after previews, and writes a Claude-authored description of intent and pipeline that survives between sessions.'
	},
	{
		title: 'Visual verification',
		body: 'Downscaled JPEG previews and 256-bin per-channel histograms return inline, so the AI sees what the document actually looks like — and confirms an operation actually changed pixels instead of trusting a success message.'
	}
];

export const workflowExamples: WorkflowExample[] = [
	{
		title: 'Landscape grade in one sentence',
		prompt:
			"Open E:\\Photos\\beach.jpg. Build a non-destructive editing stack with Curves and Hue/Saturation adjustment layers, group them as 'grade', and warm the midtones slightly. Save the layered PSD next to the original and export a 2400px sRGB JPEG.",
		outcome:
			'Roughly ten distinct tool calls. Each verifiable, each undoable. The AI reasons about intent; Editmamei handles the Photoshop choreography.'
	},
	{
		title: 'Portrait retouch with feedback',
		prompt:
			'Open this portrait. Use Select Subject to isolate the person, feather the selection 2 pixels, and add a Curves adjustment layer clipped to that selection that gently warms the skin tones. Show me the before and after.',
		outcome:
			'The AI can call photoshop_get_preview at any step to see what the document looks like and adjust. Selection feedback tells it whether Select Subject actually worked or needs refinement.'
	},
	{
		title: 'Batch processing with a template',
		prompt:
			"Apply my 'warm coastal' template to every image in E:\\Photos\\shells-raw\\, exporting flattened JPEGs to E:\\Photos\\shells-web\\ at 2000px square.",
		outcome:
			'The template captures a complete editing recipe; the AI applies it across an arbitrary set of files. Templates are how editing decisions become repeatable instead of one-shots.'
	}
];

export const editionRows: EditionRow[] = [
	{
		feature:
			'Core editing surface (documents, layers, basic adjustments, filters, selections, masks)',
		community: true,
		pro: true
	},
	{ feature: 'Templates system', community: false, pro: true },
	{ feature: 'Full non-destructive workflow surface', community: false, pro: true },
	{ feature: 'Smart Object lifecycle tools', community: false, pro: true },
	{ feature: 'Expanded adjustment-layer types', community: false, pro: true },
	{ feature: 'Advanced selection refinement', community: false, pro: true },
	{ feature: 'Channels, paths, vector masks', community: false, pro: true },
	{ feature: 'Priority support', community: false, pro: true }
];
