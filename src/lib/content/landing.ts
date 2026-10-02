import type { Capability, EditionRow, Pillar, WorkflowExample } from '$lib/types';

export const pillars: Pillar[] = [
	{
		title: 'Desktop Photoshop, driven by language',
		body: 'Editmamei drives desktop Photoshop, where your files already are, using the same tools you would reach for.'
	},
	{
		title: 'Non-destructive by default',
		body: 'Editmamei builds the kind of layer stack a working editor builds: adjustment layers, masks and groups. Pixel work such as a filter lands on a duplicate layer, so the original is always there to go back to.'
	},
	{
		title: 'It checks its own work',
		body: 'Each step gets checked with a preview, a histogram or a region compare, so the AI judges the result from the photo itself before it moves on.'
	}
];

const CITY = '/product/city-street';

export const capabilities: Capability[] = [
	{
		title: 'Documents',
		body: 'Open PSD, JPEG, PNG, TIFF, DNG, HEIC and the standard raw formats, with raw files able to open straight to 16 bit. Save layered PSDs and export JPEG or PNG. Camera details (make, model, lens, ISO, focal length, GPS) and Camera Raw settings reach the AI before it edits.',
		demo: { kind: 'documents', image: `${CITY}/original.jpg` }
	},
	{
		title: 'Layers',
		body: 'Create, duplicate, delete, rename, reorder, group, merge and flatten. Set opacity, blend mode, visibility and locking, and move, scale or rotate a layer. The AI can read the whole layer stack at any point, so it works from what is in the file.',
		demo: { kind: 'layers', image: `${CITY}/original.jpg` }
	},
	{
		title: 'Smart selections',
		body: 'Magic Wand, rectangle, color and luminance range, feather and refine edge, plus Select Subject and Select Sky. A selection reports how much of the image it covers and how complex its edge is, so the AI can check it before building a mask or adjustment on it.',
		demo: { kind: 'selection', image: `${CITY}/selection-subject.jpg`, tool: 'Select Subject' }
	},
	{
		title: 'Non-destructive adjustments',
		body: 'Curves, Levels, Hue/Saturation, Color Balance and more, each as its own adjustment layer. An active selection becomes the new layer’s mask.',
		demo: {
			kind: 'beforeAfter',
			before: `${CITY}/original.jpg`,
			after: `${CITY}/adjust-after.jpg`,
			tool: 'Hue / Saturation'
		}
	},
	{
		title: 'Filters and styles',
		body: 'Gaussian Blur, Motion Blur, Sharpen, Smart Sharpen, Reduce Noise, High Pass, Shadows/Highlights and Add Noise, plus drop shadow, stroke and outer glow as layer styles. Filters land on a duplicate of the layer by default, or as a re-editable Smart Filter on a Smart Object.',
		demo: {
			kind: 'beforeAfter',
			before: `${CITY}/original.jpg`,
			after: `${CITY}/filter-after.jpg`,
			tool: 'Gaussian Blur'
		}
	},
	{
		title: 'Masks',
		body: 'Layer masks from the active selection or reveal-all, applied or deleted on request, plus vector masks and clipping masks.',
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
		body: 'Save a finished edit as a recipe, then apply it to new photos. The AI fits each value to the photo in front of it and checks the result against what the recipe was meant to achieve.',
		demo: {
			kind: 'beforeAfter',
			before: `${CITY}/original.jpg`,
			after: `${CITY}/template-after.jpg`,
			tool: 'Saved recipe'
		}
	},
	{
		title: 'Visual verification',
		body: 'A downscaled preview when the AI asks for one, so it sees the document instead of trusting a success message. Per-channel histograms let it check with numbers that an edit changed what it meant to change.',
		demo: { kind: 'histogram' }
	}
];

export const workflowExamples: WorkflowExample[] = [
	{
		title: 'Landscape grade in one sentence',
		prompt:
			"Open E:\\Photos\\beach.jpg. Build a non-destructive editing stack with Curves and Hue/Saturation adjustment layers, group them as 'grade', and warm the midtones slightly. Save the layered PSD next to the original and export a 2400px sRGB JPEG.",
		outcome: 'Roughly ten tool calls, each one verifiable and each one undoable.'
	},
	{
		title: 'Portrait warm-up with feedback',
		prompt:
			'Open this portrait. Use Select Subject to isolate the person, feather the selection 2 pixels, and add a Curves adjustment layer masked to that selection that gently warms the skin tones. Show me the before and after.',
		outcome:
			'The AI can look at a preview at any step to see what the document looks like and adjust. Selection feedback tells it whether Select Subject took in the whole person or needs refining.'
	},
	{
		title: 'Fix the geometry before the photo opens',
		prompt:
			'Develop this raw file before opening it: level the horizon with Upright, correct the lens, and open it at 16-bit.',
		outcome:
			'Camera Raw’s settings file is written next to the photo and Photoshop opens the developed file, so the leveling and lens correction that a filter can’t reach are already applied.'
	},
	{
		title: 'Develop in Camera Raw, then change your mind',
		prompt:
			'Open this beach shot and develop it in Camera Raw: warm the white balance slightly, lift the shadows, add a touch of dehaze and fine grain. Actually, bring the dehaze down a notch.',
		outcome:
			'The Camera Raw Filter lands as a re-editable Smart Filter. For the follow-up, the AI reads the applied settings, changes one value, and reapplies. The other sliders never move.'
	},
	{
		title: 'Placement you can trust',
		prompt:
			'Place the logo halfway between the two surfboards, and bend the banner to follow the shoreline.',
		outcome:
			'The AI names the places. Local vision finds the boards and the shoreline, Editmamei works out the exact pixels and checks the geometry before anything is applied, then shows the AI a zoomed crop to review.'
	},
	{
		title: 'One look across a folder',
		prompt:
			"Apply my 'warm coastal' template to every image in E:\\Photos\\shells-raw\\, exporting flattened JPEGs to E:\\Photos\\shells-web\\ at 2000px square.",
		outcome:
			'The template carries the look: the AI applies it photo by photo, fitting each value to the frame in front of it. The square crop, resize and export then run as one batch, which Editmamei hands to Photoshop as an Action so Photoshop works through the folder itself.'
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
	},
	{
		feature:
			'GIMP 3.2, in beta (adjustments, masks, crop, resize, rotate, .xcf save, export, previews)',
		community: true,
		pro: true
	}
];
