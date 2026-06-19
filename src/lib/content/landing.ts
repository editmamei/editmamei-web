import type { Capability, EditionRow, Pillar, WorkflowExample } from '$lib/types';

export const pillars: Pillar[] = [
	{
		title: 'The Photoshop you have, driven by language',
		body: 'Editmamei drives the real Adobe Photoshop you already installed: the full program, not a hosted web app or a cloud copy. Your AI talks to the desktop, and your project files live there.'
	},
	{
		title: 'Non-destructive by default',
		body: 'Adjustment layers, masks, groups. Editmamei builds the kind of layer stack a working editor builds. Everything stays editable, maskable, removable. Nothing bakes into pixels unless you ask.'
	},
	{
		title: 'Recipes that reproduce',
		body: 'A template is a reproducible aesthetic recipe. Apply it later to a different image and the AI reads the recipe’s reasoning to recreate the look on the new file. Editing decisions stop being one-shots. Applying, verifying, and recalling saved templates is free in every edition; authoring your own is a Pro feature.'
	}
];

const CITY = '/product/city-street';

export const capabilities: Capability[] = [
	{
		title: 'Documents',
		body: 'Open PSD, JPEG, PNG, TIFF, DNG, HEIC, and the standard raw formats; save layered PSDs; export JPEG and PNG. Camera metadata (make, model, lens, ISO, focal length, GPS) and ACR develop settings surface to the AI before it edits.',
		demo: { kind: 'documents', image: `${CITY}/original.jpg` }
	},
	{
		title: 'Layers',
		body: 'Create, duplicate, delete, rename, reorder, group, merge, flatten. Set opacity, blend mode, visibility, locking. The complete layer tree returns as JSON, so the AI always knows the document structure. Move, scale, rotate, and fit-to-document transforms are included too.',
		demo: { kind: 'layers', image: `${CITY}/original.jpg` }
	},
	{
		title: 'Smart selections',
		body: 'Magic Wand, plus rectangle and feather. Every selection returns area, edge complexity, and pixel counts, so the AI can verify before committing to a mask or adjustment. Pro adds Sensei-backed Select Subject and Select Sky.',
		demo: { kind: 'selection', image: `${CITY}/selection-subject.jpg`, tool: 'Select Subject' }
	},
	{
		title: 'Non-destructive adjustments',
		body: 'Curves, Levels, Hue/Saturation, Brightness/Contrast as adjustment layers: editable, maskable, removable. An active selection at call time becomes the new layer’s mask automatically.',
		demo: {
			kind: 'beforeAfter',
			before: `${CITY}/original.jpg`,
			after: `${CITY}/adjust-after.jpg`,
			tool: 'Hue / Saturation'
		}
	},
	{
		title: 'Filters & styles',
		body: 'Gaussian Blur, Motion Blur, Sharpen, Smart Sharpen, Reduce Noise, High Pass, Shadows/Highlights, Add Noise. Drop shadow, stroke, outer glow as full layer styles. Auto-rasterization handles text and Smart Object inputs cleanly.',
		demo: {
			kind: 'beforeAfter',
			before: `${CITY}/original.jpg`,
			after: `${CITY}/filter-after.jpg`,
			tool: 'Gaussian Blur'
		}
	},
	{
		title: 'Masks',
		body: 'Layer masks across the lifecycle: create from the active selection (or reveal-all), apply, delete. Discrete tools, predictable behavior.',
		demo: {
			kind: 'mask',
			before: `${CITY}/original.jpg`,
			after: `${CITY}/mask-effect.jpg`,
			maskThumb: `${CITY}/mask-thumb.jpg`,
			tool: 'Select Sky → mask'
		}
	},
	{
		title: 'Templates',
		body: 'A reproducible aesthetic recipe. Every edition applies, verifies, and recalls saved templates. Pro adds the authoring side: capture session evidence, render before/after previews, and save a Claude-authored description of intent and pipeline that survives between sessions.',
		demo: {
			kind: 'beforeAfter',
			before: `${CITY}/original.jpg`,
			after: `${CITY}/template-after.jpg`,
			tool: 'Saved recipe'
		}
	},
	{
		title: 'Visual verification',
		body: 'Downscaled JPEG previews return inline so the AI sees what the document actually looks like and confirms operations actually changed pixels instead of trusting a success message. 256-bin per-channel histograms with mean / stdev / median back that up quantitatively.',
		demo: { kind: 'histogram' }
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
		title: 'Portrait retouch with feedback (Pro)',
		prompt:
			'Open this portrait. Use Select Subject to isolate the person, feather the selection 2 pixels, and add a Curves adjustment layer clipped to that selection that gently warms the skin tones. Show me the before and after.',
		outcome:
			'The AI can call photoshop_get_preview at any step to see what the document looks like and adjust. Selection feedback tells it whether Select Subject actually worked or needs refinement. Select Subject is a Pro tool; Community covers Magic Wand, rectangle, and feather selections.'
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
		feature: 'Documents (open PSD, JPEG, PNG, TIFF, DNG, HEIC, raw; save PSD; export JPEG/PNG)',
		community: true,
		pro: true
	},
	{
		feature: 'Layers (create, duplicate, group, merge, reorder, properties)',
		community: true,
		pro: true
	},
	{
		feature: 'Non-destructive adjustments (Curves, Levels, Hue/Saturation, Brightness/Contrast)',
		community: true,
		pro: true
	},
	{
		feature:
			'Filters (Gaussian Blur, Motion Blur, Sharpen, Smart Sharpen, Reduce Noise, High Pass)',
		community: true,
		pro: true
	},
	{
		feature: 'Smart selections (Magic Wand, rectangle, feather, with rich feedback)',
		community: true,
		pro: true
	},
	{ feature: 'Masks (create from selection, apply, delete)', community: true, pro: true },
	{
		feature: 'Layer styles + text (drop shadow, stroke, glow; font, color, alignment)',
		community: true,
		pro: true
	},
	{ feature: 'History (undo, redo, inspect history states)', community: true, pro: true },
	{
		feature: 'Visual verification (inline previews + per-channel histograms)',
		community: true,
		pro: true
	},
	{
		feature: 'Layer transforms + straightening (move, scale, rotate, fit to document)',
		community: true,
		pro: true
	},
	{
		feature: 'Content-aware retouch (Content-Aware Fill, Patch, Content-Aware Move)',
		community: true,
		pro: true
	},
	{
		feature: 'Templates (create, save, apply, verify, recall reproducible recipes)',
		community: false,
		pro: true
	},
	{ feature: 'Sensei-backed selections (Select Subject, Select Sky)', community: false, pro: true },
	{
		feature: 'Photoshop Actions + scripting (play recorded Actions, ExtendScript escape hatch)',
		community: false,
		pro: true
	}
];
