// The Photoshop features Editmamei's free edition can use, by Photoshop's own
// names. This is what copy should count, not Editmamei's MCP tools: one MCP
// tool reaches many Photoshop features (a single filter tool reaches 42
// filters). Checked against the public repo's tool schemas at 1.11.0; tools
// still at the dev tier are left out. Update this list when a release adds a
// feature, and every count on the site follows.

export interface FeatureGroup {
	title: string;
	/** Photoshop's names for the features, as they appear in its menus. */
	items: string[];
	/** Shown instead of the full list when it would be too long to read. */
	summary?: string;
}

const BLEND_MODES = [
	'Normal',
	'Dissolve',
	'Darken',
	'Multiply',
	'Color Burn',
	'Linear Burn',
	'Darker Color',
	'Lighten',
	'Screen',
	'Color Dodge',
	'Linear Dodge (Add)',
	'Lighter Color',
	'Overlay',
	'Soft Light',
	'Hard Light',
	'Vivid Light',
	'Linear Light',
	'Pin Light',
	'Hard Mix',
	'Difference',
	'Exclusion',
	'Subtract',
	'Divide',
	'Hue',
	'Saturation',
	'Color',
	'Luminosity'
];

export const photoshopFeatureGroups: FeatureGroup[] = [
	{
		title: 'Tone and color',
		items: [
			'Curves',
			'Levels',
			'Hue/Saturation',
			'Brightness/Contrast',
			'Black & White',
			'Color Balance',
			'Photo Filter',
			'Vibrance',
			'Channel Mixer',
			'Selective Color',
			'Gradient Map',
			'Exposure',
			'Color Lookup',
			'Invert',
			'Posterize',
			'Threshold',
			'Clarity and Dehaze',
			'Grain',
			'Shadows/Highlights',
			'Equalize',
			'Solid Color fill',
			'Gradient fill'
		]
	},
	{
		title: 'Filters',
		items: [
			'Gaussian Blur',
			'Motion Blur',
			'Lens Blur',
			'Radial Blur',
			'Surface Blur',
			'Box Blur',
			'Average',
			'Unsharp Mask',
			'Smart Sharpen',
			'High Pass',
			'Add Noise',
			'Reduce Noise',
			'Median',
			'Dust & Scratches',
			'Despeckle',
			'Twirl',
			'Ripple',
			'Polar Coordinates',
			'Wave',
			'Pinch',
			'Spherize',
			'ZigZag',
			'Displace',
			'Color Halftone',
			'Mosaic',
			'Crystallize',
			'Pointillize',
			'Facet',
			'Fragment',
			'Emboss',
			'Find Edges',
			'Solarize',
			'Wind',
			'Trace Contour',
			'Tiles',
			'Oil Paint',
			'Clouds',
			'Difference Clouds',
			'Fibers',
			'Maximum',
			'Minimum',
			'Offset'
		]
	},
	{
		title: 'Selections',
		items: [
			'Select Subject',
			'Select Sky',
			'Color Range',
			'Focus Area',
			'Magic Wand',
			'Rectangular Marquee',
			'Elliptical Marquee',
			'Polygonal Lasso',
			'Grow',
			'Similar',
			'Inverse',
			'Select All',
			'Deselect',
			'Select and Mask',
			'Feather',
			'Expand',
			'Contract',
			'Border',
			'Smooth',
			'Transform Selection',
			'Save Selection',
			'Load Selection'
		]
	},
	{
		title: 'Retouching',
		items: ['Content-Aware Fill', 'Content-Aware Move', 'Patch', 'Sky Replacement']
	},
	{
		title: 'Masks and channels',
		items: ['Layer Mask', 'Vector Mask', 'Clipping Mask', 'Apply Image', 'Calculations']
	},
	{
		title: 'Layer styles and blend modes',
		items: [
			'Drop Shadow',
			'Inner Shadow',
			'Outer Glow',
			'Inner Glow',
			'Stroke',
			'Color Overlay',
			...BLEND_MODES
		],
		summary: `Drop Shadow, Inner Shadow, Outer Glow, Inner Glow, Stroke, Color Overlay, and all ${BLEND_MODES.length} blend modes, from Multiply to Luminosity`
	},
	{
		title: 'Layers and transforms',
		items: [
			'Smart Objects',
			'Smart Filters',
			'Layer Groups',
			'Layer via Copy',
			'Rasterize',
			'Merge Down',
			'Merge Visible',
			'Stamp Visible',
			'Flatten Image',
			'Free Transform',
			'Scale',
			'Rotate',
			'Skew',
			'Flip'
		]
	},
	{
		title: 'Image and canvas',
		items: [
			'Crop',
			'Image Size',
			'Image Rotation',
			'Flip Canvas',
			'Grayscale mode',
			'RGB mode',
			'CMYK mode',
			'Lab mode',
			'Bitmap mode'
		]
	},
	{
		title: 'Type, shapes and paths',
		items: [
			'Type layers',
			'Rectangle',
			'Ellipse',
			'Line',
			'Work Path from selection',
			'Stroke Path',
			'Fill Path',
			'Clipping Path'
		]
	},
	{
		title: 'Files and checking',
		items: [
			'Open',
			'New Document',
			'Place Embedded',
			'Save as PSD',
			'Export as JPEG',
			'Export as PNG',
			'Guides',
			'Histogram',
			'History (undo and redo)'
		]
	}
];

/** How many Photoshop features the free edition uses. */
export const photoshopFeatureCount = photoshopFeatureGroups.reduce((n, g) => n + g.items.length, 0);

/** The count rounded down to a ten, for "more than N" copy. */
export const photoshopFeatureFloor = Math.floor(photoshopFeatureCount / 10) * 10;
