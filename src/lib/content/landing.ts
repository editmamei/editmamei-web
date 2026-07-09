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
		body: 'A template is a reproducible aesthetic recipe. Apply it later to a different image and the AI reads the recipe’s reasoning to recreate the look on the new file. Editing decisions stop being one-shots. The whole template system, authoring and applying alike, is a Pro feature.'
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
		body: 'Magic Wand, rectangle, color and luminance range, feather, refine edge, plus Select Subject and Select Sky. Every selection returns area, edge complexity, and pixel counts, so the AI verifies before committing to a mask or adjustment. Pro adds named-object masks and face-feature selections.',
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
		body: "A reproducible aesthetic recipe: capture a finished edit, then apply it to new images later, where the AI re-derives each value for the new photo and self-judges against the recipe's exit criteria. The whole template system (create, save, apply, verify, recall) is a Pro feature.",
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
		title: 'Portrait retouch with feedback',
		prompt:
			'Open this portrait. Use Select Subject to isolate the person, feather the selection 2 pixels, and add a Curves adjustment layer clipped to that selection that gently warms the skin tones. Show me the before and after.',
		outcome:
			'The AI can look at a preview at any step to see what the document looks like and adjust. Selection feedback tells it whether Select Subject actually grabbed the person or needs refinement. Select Subject and Select Sky are free in Community; Pro adds face-feature selections and named-object masks for finer work.'
	},
	{
		title: 'Develop in Camera Raw, then change your mind (Pro)',
		prompt:
			'Open this beach shot and develop it in Camera Raw: warm the white balance slightly, lift the shadows, add a touch of dehaze and fine grain. Actually, bring the dehaze down a notch.',
		outcome:
			'The Camera Raw Filter lands as a re-editable Smart Filter. For the follow-up, the AI reads the applied settings, changes one value, and reapplies. The other sliders never move.'
	},
	{
		title: 'Placement you can trust (Pro)',
		prompt:
			'Place the logo halfway between the two surfboards, and bend the banner to follow the shoreline.',
		outcome:
			'The AI names the locations; local vision finds the boards and the shoreline edge; a deterministic resolver computes exact pixels and an objective check verifies the geometry before anything is applied. The AI reviews a zoomed crop, not the full frame.'
	},
	{
		title: 'Batch processing with a template (Pro)',
		prompt:
			"Apply my 'warm coastal' template to every image in E:\\Photos\\shells-raw\\, exporting flattened JPEGs to E:\\Photos\\shells-web\\ at 2000px square.",
		outcome:
			'Templates are a Pro feature. The recipe captures a complete editing approach, and the AI works through the folder image by image, re-deriving each value for the photo in front of it. Templates are how editing decisions become repeatable instead of one-shots.'
	}
];

export const editionRows: EditionRow[] = [
	{
		feature:
			'Scene awareness (on-device object + face detection, scene reading, select named things)',
		community: true,
		pro: true
	},
	{
		feature:
			'Face-mesh perception (468-point facial geometry, feature-precise selections of eyes, teeth, skin)',
		community: false,
		pro: true
	},
	{
		feature: 'Named-object masks (local segmentation: name an object, get an organic selection)',
		community: false,
		pro: true
	},
	{
		feature:
			'Precision placement (name a location; placements computed from real geometry and checked before applying)',
		community: false,
		pro: true
	},
	{
		feature:
			'Selections (Magic Wand, rectangle, color + luminance range, feather, refine edge, rich feedback)',
		community: true,
		pro: true
	},
	{
		feature: "Select Subject + Select Sky (Photoshop's AI selections)",
		community: true,
		pro: true
	},
	{
		feature: 'Subject instance targeting (aim Select Subject at one named subject among several)',
		community: false,
		pro: true
	},
	{ feature: 'Masks (layer masks, vector masks, clipping masks)', community: true, pro: true },
	{
		feature: 'Channel tools (save/load selections, Apply Image, Calculations)',
		community: true,
		pro: true
	},
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
		feature: 'Layer styles + text (drop shadow, stroke, glow; font, color, alignment)',
		community: true,
		pro: true
	},
	{
		feature:
			'Layer transforms + straightening (move, scale, rotate, skew, fit; canvas rotate + flip; guides)',
		community: true,
		pro: true
	},
	{
		feature: 'Vector shapes + pen paths (shape layers, editable paths, path-to-selection)',
		community: true,
		pro: true
	},
	{
		feature: 'Content-aware retouch (Content-Aware Fill, Patch, Content-Aware Move)',
		community: true,
		pro: true
	},
	{
		feature: 'Camera Raw develop (the Camera Raw panel as a re-editable Smart Filter)',
		community: false,
		pro: true
	},
	{
		feature:
			'Warp (mesh warp with a pinned edge, bend along a named edge, radial reshape, warp to a target)',
		community: false,
		pro: true
	},
	{
		feature: 'Visual verification (inline previews, zoomed review crops, per-channel histograms)',
		community: true,
		pro: true
	},
	{ feature: 'History (undo, redo, inspect history states)', community: true, pro: true },
	{
		feature: 'Templates (create, save, apply, verify, recall reproducible recipes)',
		community: false,
		pro: true
	},
	{
		feature: 'Photoshop Actions + scripting (play recorded Actions, ExtendScript escape hatch)',
		community: false,
		pro: true
	}
];
