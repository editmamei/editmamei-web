// Reader-facing categories for the /tools directory, in page order.
// Every capability group in tools.generated.json maps to one category below;
// a tool whose group sits in the wrong place for a photographer sets its own
// `category` in tool-copy.ts instead.

export type CategoryId =
	| 'files'
	| 'layers'
	| 'selections'
	| 'tone'
	| 'filters'
	| 'retouch'
	| 'text'
	| 'scene'
	| 'check'
	| 'automation'
	| 'session';

export interface Category {
	id: CategoryId;
	label: string;
	blurb: string;
}

export const CATEGORIES: Category[] = [
	{
		id: 'files',
		label: 'Files and canvas',
		blurb: 'Open, create, save and export, then crop, resize, rotate and convert the whole image.'
	},
	{
		id: 'layers',
		label: 'Layers and composition',
		blurb: 'Build and arrange the layer stack, bring in other images, and move or reshape layers.'
	},
	{
		id: 'selections',
		label: 'Selections and masks',
		blurb:
			'Choose which pixels an edit touches: by shape, tone or color, by name, or with masks, paths and channels.'
	},
	{
		id: 'tone',
		label: 'Tone and color',
		blurb:
			'Curves, levels, exposure, color and raw development, kept editable wherever the editor allows.'
	},
	{
		id: 'filters',
		label: 'Filters and effects',
		blurb: 'Blur, sharpen, noise and stylized effects, applied so the original layer is kept.'
	},
	{
		id: 'retouch',
		label: 'Retouch',
		blurb: 'Remove distractions, move things around, and replace the sky.'
	},
	{
		id: 'text',
		label: 'Text and shapes',
		blurb: 'Editable text and vector shapes.'
	},
	{
		id: 'scene',
		label: 'Scene awareness',
		blurb:
			'On-device vision that finds faces, objects, sky and horizon, so edits are aimed at measured positions.'
	},
	{
		id: 'check',
		label: 'Check the result',
		blurb: 'Previews, histograms and measurements the AI uses to check each step.'
	},
	{
		id: 'automation',
		label: 'Templates and automation',
		blurb:
			'Run several steps at once, reuse saved looks and recorded Actions, or process a whole folder.'
	},
	{
		id: 'session',
		label: 'Session and setup',
		blurb: 'Connection checks, orientation for the AI, undo and redo, checkpoints and bug reports.'
	}
];

/** Code capability group (from tool-groups.ts) to reader-facing category. */
export const GROUP_TO_CATEGORY: Record<string, CategoryId> = {
	core: 'session',
	inspect: 'check',
	verify: 'check',
	document: 'files',
	select: 'selections',
	select_ai: 'selections',
	masks: 'selections',
	adjust: 'tone',
	filter: 'filters',
	retouch: 'retouch',
	layers: 'layers',
	type: 'text',
	perception: 'scene',
	face: 'scene',
	templates: 'automation',
	automation: 'automation'
};
