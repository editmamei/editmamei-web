// What Pro adds, as one list. /pricing, /faq and /activate all render from this.

export interface ProFeature {
	title: string;
	detail: string;
}

export const PRO_FEATURES: ProFeature[] = [
	{
		title: 'Camera Raw, re-editable',
		detail:
			'Camera Raw applied as a Smart Filter. The AI reads back what is already set, so "a touch less dehaze" changes that one value.'
	},
	{
		title: 'Raw files, developed before they open',
		detail:
			'Upright leveling, perspective and lens correction, crop with straighten, and your saved Camera Raw presets, applied to the raw file, with the option to open at 16 bit.'
	},
	{
		title: 'A whole folder in one pass',
		detail:
			'One recipe runs across a folder as a single Photoshop batch, and you can ask what it would touch before anything opens.'
	},
	{
		title: 'Templates',
		detail:
			'Save a finished edit as a template, apply it to new photos with the values fitted to each one, and check the result against it.'
	},
	{
		title: 'Precise placement and warp',
		detail:
			'Name a spot ("halfway between the two boats", "along the roofline") and Editmamei measures it before anything is placed. Warps bend a layer to follow a curve, reach a target, or bulge around a point.'
	},
	{
		title: 'Edits and text aimed at an object',
		detail:
			'Name an object, such as "the dog" or "the car", and Editmamei finds it, then removes it with Content-Aware Fill, or keeps it and blurs or darkens everything around it. It can also fit editable text to the object, flat or arced.'
	},
	{
		title: 'Named objects, faces and subjects',
		detail:
			'Select "the surfboard" from 80 object categories, a named feature of a face (eyes, lips, skin, teeth), or one subject among several. All of it runs on your computer.'
	},
	{
		title: 'Actions and scripting',
		detail: 'Play your recorded Photoshop Actions, or run a script when no specific tool fits.'
	}
];

export const PRO_FEATURES_SENTENCE =
	'Pro adds Camera Raw as a re-editable filter, raw files developed before they open, folder batch, templates, precise placement and warp, edits and text aimed at a named object, selections of a named object, a face feature or one subject among several, and Photoshop Actions and scripting.';
