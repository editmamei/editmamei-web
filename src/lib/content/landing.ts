import type { Capability, EditionGroup, EditionRow, Pillar, WorkflowExample } from '$lib/types';

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

const both = (feature: string, detail?: string): EditionRow => ({
	feature,
	detail,
	community: true,
	pro: true
});

const proOnly = (feature: string, detail?: string): EditionRow => ({
	feature,
	detail,
	community: false,
	pro: true
});

export const editionGroups: EditionGroup[] = [
	{
		title: 'Both editions',
		rows: [
			both(
				'Documents',
				'Open PSD, JPEG, PNG, TIFF, DNG, HEIC and raw; save PSD; export JPEG and PNG'
			),
			both('Layers and groups', 'Create, duplicate, group, merge, reorder, set properties'),
			both('Adjustment layers', 'Curves, Levels, Hue/Saturation, Brightness/Contrast'),
			both('Filters', 'Blur, sharpen, noise reduction, High Pass and more'),
			both('Selections', 'Magic Wand, rectangle, color and luminance range, feather, refine edge'),
			both('Select Subject and Select Sky', "Photoshop's own AI selections"),
			both('Sky replacement', 'From a Photoshop preset or your own file'),
			both('Masks', 'Layer, vector and clipping masks'),
			both('Channel tools', 'Saved selections, Apply Image, Calculations'),
			both('Content-aware retouch', 'Content-Aware Fill, Patch, Content-Aware Move'),
			both('Text and layer styles', 'Font, color, alignment; drop shadow, stroke, glow'),
			both(
				'Transforms and straightening',
				'Move, scale, rotate, skew; rotate and flip the canvas; guides'
			),
			both('Shapes and pen paths', 'Shape layers, editable paths, path to selection'),
			both('Scene awareness', 'Finds faces and objects on your computer and selects named things'),
			both('Visual checks', 'Previews, region comparison, per-channel histograms'),
			both('History', 'Undo, redo, inspect history states'),
			both(
				'Multi-step runs in one call, with rollback',
				'If a step fails, the earlier steps can be undone'
			)
		]
	},
	{
		title: 'Pro adds',
		rows: [
			proOnly(
				'Camera Raw, re-editable',
				'The Camera Raw Filter as a Smart Filter you can change later'
			),
			proOnly(
				'Raw develop before opening',
				'Upright, perspective and lens correction, your saved presets, 16-bit'
			),
			proOnly('Folder batch', 'Crop, resize, rotate and export a whole folder in one pass'),
			proOnly('Templates', 'Save a finished look and apply it to new photos'),
			proOnly('Precise placement', 'Name a spot and Editmamei measures it before placing'),
			proOnly('Warp', 'Warp styles, pinned-edge mesh, bend along a curve, bulge or pinch'),
			proOnly(
				'Edits and text aimed at an object',
				'Remove a named object, blur or darken around it, or fit text to it'
			),
			proOnly('Named-object selections', '"The surfboard", from 80 object categories'),
			proOnly('Face features', 'A face mesh with eye, lip, skin and teeth selections'),
			proOnly('One subject among several', 'Aim Select Subject at the subject you name'),
			proOnly('Actions and scripting', 'Play recorded Actions; run a script when no tool fits')
		]
	},
	{
		title: 'GIMP (beta)',
		rows: [
			both('Adjustments and effects'),
			both('Layers and composites'),
			both('Masks'),
			both('Crop, resize and rotate'),
			both('Checkpoints', 'Save and restore points in place of undo'),
			both('Previews and histograms'),
			both('.xcf save and export')
		]
	}
];
