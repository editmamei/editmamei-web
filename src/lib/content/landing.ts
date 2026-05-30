import type { Capability, EditionRow, Pillar, WorkflowExample } from '$lib/types';

export const pillars: Pillar[] = [
	{
		title: 'The Photoshop you have, driven by language',
		body: 'Editmamei drives the real Adobe Photoshop you already installed — the full program, not a hosted web app or a cloud copy. Your AI talks to the desktop, and your project files live there.'
	},
	{
		title: 'Non-destructive by default',
		body: 'Adjustment layers, masks, groups — Editmamei builds the kind of layer stack a working editor builds. Everything stays editable, maskable, removable. Nothing bakes into pixels unless you ask.'
	},
	{
		title: 'Recipes that reproduce',
		body: 'A template is a reproducible aesthetic recipe — apply it later to a different image and the AI reads the recipe’s reasoning to recreate the look on the new file. Editing decisions stop being one-shots. Editmamei ships with a small built-in starter set; creating and saving your own is a Pro feature.'
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
		body: 'Color Range, Magic Wand, plus rectangle and feather. Every selection returns area, edge complexity, and pixel counts, so the AI can verify before committing to a mask or adjustment. Pro adds Sensei-backed Select Subject and Select Sky.'
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
		body: 'A reproducible aesthetic recipe. Every edition ships with a small built-in set to apply. Pro adds the authoring side — capture session evidence, render before/after previews, and save a Claude-authored description of intent and pipeline that survives between sessions.'
	},
	{
		title: 'Visual verification',
		body: 'Downscaled JPEG previews return inline so the AI sees what the document actually looks like and confirms operations actually changed pixels instead of trusting a success message. Pro adds 256-bin per-channel histograms with mean / stdev / median.'
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
		feature: 'Documents (open, save, export; PSD, JPEG, PNG, TIFF, DNG, HEIC, raw)',
		community: true,
		pro: true
	},
	{
		feature: 'Layers (create, duplicate, group, merge, transform, reorder, properties)',
		community: true,
		pro: true
	},
	{
		feature: 'Non-destructive adjustments (Curves, Levels, Hue/Saturation, Brightness/Contrast)',
		community: true,
		pro: true
	},
	{
		feature: 'Filters (Gaussian Blur, Motion Blur, Sharpen, Add Noise)',
		community: true,
		pro: true
	},
	{
		feature: 'Smart selections (Color Range, Magic Wand, rectangle, feather, with rich feedback)',
		community: true,
		pro: true
	},
	{ feature: 'Masks (create from selection, apply, delete)', community: true, pro: true },
	{
		feature: 'Layer styles + text (drop shadow, stroke, glow; font, color, alignment)',
		community: true,
		pro: true
	},
	{
		feature: 'History + Actions (undo, redo, jump to state, play recorded Photoshop Actions)',
		community: true,
		pro: true
	},
	{
		feature: 'Visual preview (inline JPEGs so the AI can see what just changed)',
		community: true,
		pro: true
	},
	{ feature: 'Apply built-in templates', community: true, pro: true },
	{ feature: 'Create / save / delete custom templates', community: false, pro: true },
	{ feature: 'Sensei-backed selections (Select Subject, Select Sky)', community: false, pro: true },
	{ feature: 'Per-channel histograms', community: false, pro: true }
];
