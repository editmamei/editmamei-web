import type { Capability, EditionGroup, EditionRow, Pillar, WorkflowExample } from '$lib/types';

export const pillars: Pillar[] = [
	{
		title: 'Desktop Photoshop, driven by language',
		body: 'Editmamei drives desktop Adobe Photoshop: the full program, not a hosted web app or a cloud copy. Your AI talks to the desktop, and your project files live there.'
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
