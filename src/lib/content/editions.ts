// The Free vs Pro comparison rows on /desktop/pricing (EditionsTable).
export interface EditionRow {
	/** Short label, kept to a few words so the row stays readable on a phone. */
	feature: string;
	/** Optional second line in smaller type. */
	detail?: string;
	community: boolean;
	pro: boolean;
}

export interface EditionGroup {
	title: string;
	rows: EditionRow[];
}

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
		title: 'GIMP',
		rows: [
			both('Adjustments and effects'),
			both('Text'),
			both('Layers and composites'),
			both('Masks'),
			both('Crop, resize and rotate'),
			both('Checkpoints', 'Save and restore points in place of undo'),
			both('Previews and histograms'),
			both('.xcf save and export')
		]
	}
];
