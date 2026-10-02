// Written copy for the /tools directory: one entry per shipped tool in
// tools.generated.json, keyed by tool id. The build fails if a generated
// tool has no entry here, or if an entry has no generated tool
// (src/lib/content/tools/index.ts). Within a category, rows appear in the
// order they are listed here.
//
// task      What the reader wants to do, in plain English. Shown first.
// summary   One sentence, about 120 characters at most.
// keywords  Extra search terms that are not already in the task or summary.
// category  Overrides the category the tool's code group maps to.
// media     Optional short demo clip (see ToolMedia).

import type { CategoryId } from './categories';

export interface ToolMediaClip {
	/** Root-relative URL of a short, muted, looping MP4 or WebM. */
	src: string;
	/** Root-relative URL of the still shown before playback and under reduced motion. */
	poster: string;
	/** What the clip shows, for screen readers. */
	alt: string;
}

export interface ToolMedia extends ToolMediaClip {
	/** Extra clips for individual modes of the same tool. */
	modes?: (ToolMediaClip & { mode: string })[];
}

export interface ToolCopy {
	task: string;
	summary: string;
	keywords?: string[];
	category?: CategoryId;
	media?: ToolMedia;
}

export const TOOL_COPY: Record<string, ToolCopy> = {
	// Files and canvas
	ps_open_document: {
		task: 'Open a photo or PSD',
		summary:
			'Opens an image from disk without stopping for dialogs. Raw and HEIC files open with your last Camera Raw settings.',
		keywords: ['load', 'import', 'raw', 'heic']
	},
	ps_create_document: {
		task: 'Create a new document',
		summary: 'Starts an empty document at a chosen size, resolution and color mode.',
		keywords: ['new', 'blank']
	},
	ps_document: {
		task: 'List open documents and switch between them',
		summary:
			'Shows which documents are open, which one is active and which have unsaved changes, and switches between them.',
		keywords: ['activate', 'tabs']
	},
	ps_save_psd: {
		task: 'Save a layered PSD',
		summary: 'Saves the document as a layered PSD copy and leaves the working document as it is.',
		keywords: ['psd', 'save as']
	},
	ps_export: {
		task: 'Export a JPEG or PNG',
		summary:
			'Writes a flattened JPEG or PNG from a copy, with optional downscaling, sRGB conversion or transparency.',
		keywords: ['jpg', 'save for web', 'output']
	},
	ps_close_document: {
		task: 'Close a document',
		summary: 'Closes the active document or a named one, saving it first if asked.'
	},
	ps_crop_document: {
		task: 'Crop the image',
		summary:
			'Crops to exact pixel bounds, or to a region described by what is around it, checked before the cut.',
		keywords: ['trim', 'aspect ratio']
	},
	ps_resize_image: {
		task: 'Resize the image',
		summary: 'Resizes the whole document, every layer included, to exact pixel dimensions.',
		keywords: ['scale', 'dimensions', 'downscale']
	},
	ps_transform_canvas: {
		task: 'Rotate or flip the canvas',
		summary: 'Rotates the whole document by any angle, or flips it, with all layers together.',
		keywords: ['mirror', 'turn']
	},
	ps_convert_image_mode: {
		task: 'Convert the color mode',
		summary:
			'Converts the document to grayscale, RGB, CMYK or Lab. The image is flattened on the way.',
		keywords: ['monochrome', 'black and white']
	},
	ps_guides: {
		task: 'Add guides and guide layouts',
		summary:
			'Adds single guides or an even grid, such as rule of thirds, for whoever opens the PSD. Guides never print.',
		keywords: ['grid', 'thirds', 'layout']
	},
	gimp_open_document: {
		task: 'Open an image',
		summary:
			'Opens JPEG, PNG, TIFF, WebP, HEIC, XCF and more. An .xcf opens with its live filters still editable.',
		keywords: ['load', 'import']
	},
	gimp_create_document: {
		task: 'Create a new image',
		summary:
			'Starts an empty image at a chosen size, in color or grayscale, on white, black or transparent.',
		keywords: ['new', 'blank']
	},
	gimp_save_xcf: {
		task: 'Save an editable .xcf',
		summary: 'Saves the working file with every filter still live, ready to open in GIMP.',
		keywords: ['xcf', 'save']
	},
	gimp_export: {
		task: 'Export a flattened copy (JPEG, PNG, WebP, TIFF)',
		summary:
			'Writes a flattened JPEG, PNG, WebP or TIFF with filters baked in and all metadata, GPS included, removed.',
		keywords: ['jpg', 'output', 'save']
	},
	gimp_close_document: {
		task: 'Close an image',
		summary: 'Closes an image without saving it.'
	},
	gimp_crop_document: {
		task: 'Crop the image',
		summary: 'Crops to an exact rectangle. Live filters and masks survive the crop.',
		keywords: ['trim']
	},
	gimp_resize_image: {
		task: 'Resize the image',
		summary: 'Scales the whole image to exact dimensions, to one side, or by its long edge.',
		keywords: ['scale', 'dimensions', 'downscale']
	},
	gimp_transform_canvas: {
		task: 'Rotate, straighten or flip the image',
		summary: 'Rotates the image by any angle, for example to level a horizon, or flips it.',
		keywords: ['level', 'mirror', 'horizon']
	},
	gimp_canvas: {
		task: 'Extend the canvas for borders and frames',
		summary:
			'Grows the canvas around the image over a white, black, colored or transparent backdrop.',
		keywords: ['border', 'frame', 'padding']
	},
	gimp_convert_image_mode: {
		task: 'Convert between color and grayscale',
		summary: 'Switches the image between RGB and grayscale.',
		keywords: ['monochrome', 'black and white']
	},

	// Layers and composition
	ps_create_layer: {
		task: 'Add a new layer',
		summary: 'Adds an empty pixel layer above the active one.'
	},
	ps_select_layer: {
		task: 'Choose the layer to work on',
		summary: 'Makes a layer active by name, searching inside groups.',
		keywords: ['activate']
	},
	ps_duplicate_layer: {
		task: 'Duplicate a layer',
		summary: 'Copies the active layer and makes the copy active.',
		keywords: ['copy']
	},
	ps_copy_to_new_layer: {
		task: 'Copy a selection to a new layer',
		summary:
			"Photoshop's Layer via Copy: lifts the selected pixels onto a layer of their own and leaves the source alone.",
		keywords: ['layer via copy', 'ctrl+j']
	},
	ps_delete_layer: {
		task: 'Delete a layer',
		summary: 'Deletes the active layer, or one found by name anywhere in the stack.',
		keywords: ['remove']
	},
	ps_move_layer_to_position: {
		task: 'Reorder layers',
		summary: 'Moves a layer to the top or bottom, or directly above or below another layer.',
		keywords: ['stack', 'order', 'arrange']
	},
	ps_group: {
		task: 'Group layers',
		summary: 'Creates, ungroups or deletes layer groups, and moves layers into them.',
		keywords: ['folder']
	},
	ps_set_layer: {
		task: 'Set opacity, blend mode, visibility and name',
		summary:
			'Sets one property of the active layer: opacity or fill, blend mode, visibility, lock or name.',
		keywords: ['rename', 'hide', 'show', 'lock', 'multiply', 'screen', 'overlay']
	},
	ps_fill_layer: {
		task: 'Fill a layer with a color',
		summary: 'Fills the active layer, or the selection on it, with a solid color.'
	},
	ps_add_fill_layer: {
		task: 'Add a color or gradient fill layer',
		summary:
			'Adds an editable solid color or gradient layer, useful for sky fades, color washes and vignettes.',
		keywords: ['gradient', 'vignette']
	},
	ps_place_image: {
		task: 'Place another image in the document',
		summary: 'Brings in a JPEG, PNG, PSD or other file as a Smart Object layer.',
		keywords: ['composite', 'import', 'overlay'],
		category: 'layers'
	},
	ps_transform_layer: {
		task: 'Move, scale, rotate or straighten a layer',
		summary: 'Moves, scales, rotates, flips or skews the active layer, or fits it to the canvas.',
		keywords: ['free transform', 'position', 'resize layer']
	},
	ps_warp_layer: {
		task: 'Warp a layer (styles, mesh, along a curve, to a target)',
		summary:
			'Warp styles, a mesh with one edge pinned, bending along a named curve, bulging around a point, or reaching a target.',
		keywords: ['bend', 'distort', 'arc']
	},
	ps_add_layer_style: {
		task: 'Add a layer style (shadow, stroke, glow)',
		summary:
			'Adds an editable drop shadow, stroke, outer or inner glow, inner shadow or color overlay.',
		keywords: ['drop shadow', 'border', 'effects']
	},
	ps_convert_to_smart_object: {
		task: 'Convert a layer to a Smart Object',
		summary: 'Wraps a layer so filters applied to it later stay editable as Smart Filters.',
		keywords: ['smart filter', 'non-destructive']
	},
	ps_rasterize_layer: {
		task: 'Rasterize a layer',
		summary: 'Turns a text or Smart Object layer into plain pixels.'
	},
	ps_merge: {
		task: 'Merge, stamp or flatten layers',
		summary:
			'Merges the visible layers, stamps them onto a new layer on top, or flattens the document.',
		keywords: ['stamp visible', 'flatten']
	},
	ps_bake_layer: {
		task: "Bake a layer's look into a new layer",
		summary:
			"Copies a layer's appearance, with its clipped adjustments and styles, onto a new pixel layer. The original stays.",
		keywords: ['flatten', 'pixels']
	},
	gimp_layer: {
		task: 'Manage layers and groups',
		summary:
			'Creates, duplicates, moves, reorders, merges and deletes layers and groups, and sets their properties.',
		keywords: ['opacity', 'blend mode', 'flatten', 'merge down']
	},
	gimp_place_image: {
		task: 'Place another photo as a layer',
		summary: 'Adds another image file as a new layer in an open image, at a chosen position.',
		keywords: ['composite', 'import', 'overlay']
	},
	gimp_bake: {
		task: 'Bake live filters into a layer',
		summary: "Fixes a layer's live filters into its pixels without merging it into anything else.",
		keywords: ['flatten', 'apply filters']
	},

	// Selections and masks
	ps_select: {
		task: 'Select by shape, color, tone or focus',
		summary:
			'A new selection by rectangle, ellipse, color range, highlights or shadows, Magic Wand, focus area, all or inverse.',
		keywords: ['marquee', 'luminosity', 'skin tones', 'deselect', 'invert']
	},
	ps_select_subject: {
		task: 'Select the main subject',
		summary:
			"Photoshop's Select Subject, with area and edge feedback the AI checks before moving on.",
		keywords: ['person', 'cutout', 'mask']
	},
	ps_select_sky: {
		task: 'Select the sky',
		summary:
			"Photoshop's Select Sky, with edge feedback that flags tricky horizons for a closer look.",
		keywords: ['mask']
	},
	ps_select_by_reference: {
		task: 'Select something by name',
		summary:
			'Turns a name like sky, ground, shadows or skin into a selection, and selects nothing when it is not confident.',
		keywords: ['foliage', 'face', 'highlights'],
		category: 'selections'
	},
	ps_select_object: {
		task: 'Select a named object',
		summary:
			'Turns a name like "the surfboard" into a traced selection, from 80 object categories, on your computer.',
		keywords: ['cutout', 'mask']
	},
	ps_select_subject_instance: {
		task: 'Select one subject among several',
		summary:
			'Aims Select Subject at one subject when there are several, using on-device detection to pick it.',
		keywords: ['person', 'which one']
	},
	ps_select_face_feature: {
		task: 'Select eyes, lips, teeth or skin',
		summary:
			'A Photoshop selection of a named facial feature, traced from a face mesh made on your computer.',
		keywords: ['portrait', 'face'],
		category: 'selections'
	},
	ps_modify_selection: {
		task: 'Feather or refine a selection',
		summary:
			'Feathers, refines edges around hair and halos, expands, contracts, smooths or grows the current selection.',
		keywords: ['select and mask', 'refine edge', 'soften']
	},
	ps_selection_channel: {
		task: 'Save and load selections as channels',
		summary:
			'Saves a selection to a named channel and loads it back later, alone or combined with another.',
		keywords: ['alpha channel']
	},
	ps_layer_mask: {
		task: 'Add, apply or remove a layer mask',
		summary:
			'Masks a layer to the selection, paints a gradient fade into the mask, applies it or removes it.',
		keywords: ['fade', 'hide', 'reveal']
	},
	ps_clipping_mask: {
		task: 'Clip a layer to the one below',
		summary: 'Shows a layer only where the layer below has pixels, or releases the clip.',
		keywords: ['clip']
	},
	ps_path: {
		task: 'Draw pen paths and turn them into selections',
		summary:
			'Makes editable paths from selections, saves and loads them, strokes or fills them, and turns them back into selections.',
		keywords: ['pen tool', 'vector', 'outline']
	},
	ps_vector_mask: {
		task: 'Mask a layer with a vector shape',
		summary:
			'Adds a crisp, resolution-independent mask from a path, and links, disables or removes it.',
		keywords: ['path']
	},
	ps_apply_image: {
		task: 'Blend channels with Apply Image',
		summary:
			"Photoshop's Apply Image, for luminosity blends, texture overlays and frequency separation, on a copy by default.",
		keywords: ['channel']
	},
	ps_calculations: {
		task: 'Build a mask with Calculations',
		summary:
			"Photoshop's Calculations: combines two channels into a new one to build a precise mask.",
		keywords: ['channel', 'luminosity mask']
	},
	gimp_create_mask: {
		task: 'Limit an adjustment to a shape or gradient',
		summary:
			'Builds a rectangle, ellipse or gradient mask that a new adjustment can be confined to.',
		keywords: ['selection', 'graduated', 'radial']
	},

	// Tone and color
	ps_add_adjustment_layer: {
		task: 'Add an adjustment layer (Curves, Levels and more)',
		summary:
			'Curves, Levels, Hue/Saturation, Color Balance, Black & White, Exposure, Color Lookup and more, on editable layers.',
		keywords: [
			'vibrance',
			'brightness',
			'contrast',
			'gradient map',
			'lut',
			'grade',
			'channel mixer'
		]
	},
	ps_apply_adjustment: {
		task: 'Apply a tonal fix that has no adjustment layer',
		summary:
			'Shadows/Highlights, Equalize and other fixes Photoshop only offers as direct edits, run on a copy of the layer.',
		keywords: ['recover highlights', 'lut']
	},
	ps_apply_camera_raw: {
		task: 'Develop with Camera Raw, re-editable',
		summary:
			'Camera Raw as an editable Smart Filter. The AI reads the current settings, so it can change just one value.',
		keywords: ['acr', 'white balance', 'dehaze', 'clarity', 'texture', 'grain'],
		category: 'tone'
	},
	ps_develop_raw: {
		task: 'Develop a raw file before it opens',
		summary:
			'Upright, lens correction, crop with straighten and your saved presets, applied to the raw file, with 16-bit open.',
		keywords: ['camera raw', 'perspective', 'lens profile', 'preset'],
		category: 'tone'
	},
	gimp_add_adjustment: {
		task: 'Add a live adjustment (curves, levels, exposure and more)',
		summary:
			'Curves, levels, exposure, color balance, temperature, shadows and highlights, sharpening and more, all re-editable.',
		keywords: ['hue', 'saturation', 'vibrance', 'brightness', 'contrast', 'noise reduction']
	},

	// Filters and effects
	ps_filter: {
		task: 'Apply a filter (blur, sharpen, noise and more)',
		summary:
			'Blur, sharpen, noise, High Pass, distort, oil paint and more, on a copy or as an editable Smart Filter.',
		keywords: ['gaussian', 'smart sharpen', 'pixelate', 'smart filter']
	},
	gimp_add_effect: {
		task: 'Add an effect (vignette, black and white, blur, noise, shadow)',
		summary:
			'Vignette, black and white, motion or lens blur, noise and drop shadow, as live filters.',
		keywords: ['monochrome', 'grain']
	},
	gimp_filter: {
		task: 'List, hide or remove live filters',
		summary: 'Shows the live filter stack, hides or shows a filter, or deletes one.',
		keywords: ['filter stack']
	},

	// Retouch
	ps_retouch: {
		task: 'Remove or move things with Content-Aware Fill, Patch or Move',
		summary:
			'Fills, patches or moves a selected area using its surroundings, on a copy of the layer.',
		keywords: ['remove', 'erase', 'blemish', 'clean up', 'heal']
	},
	ps_edit_object: {
		task: 'Remove an object, or blur or darken around it',
		summary:
			'Finds an object by name, then removes it with Content-Aware Fill, blurs the background around it, or darkens the rest.',
		keywords: ['photobomb', 'depth of field', 'spotlight'],
		category: 'retouch'
	},
	ps_replace_sky: {
		task: 'Replace the sky',
		summary:
			"Photoshop's Sky Replacement, with any image as the new sky, kept as an editable group.",
		keywords: ['sky swap'],
		category: 'retouch'
	},

	// Text and shapes
	ps_text: {
		task: 'Add and style text',
		summary: 'Creates a text layer and sets its words, font, size, color and alignment.',
		keywords: ['type', 'caption', 'title']
	},
	ps_add_text_to_object: {
		task: 'Fit text onto an object',
		summary: 'Places editable text sized to a detected object, flat or arced.',
		keywords: ['type', 'label'],
		category: 'text'
	},
	ps_shape: {
		task: 'Draw a rectangle, ellipse or line',
		summary:
			'Draws a vector rectangle, rounded rectangle, ellipse or line, filled and optionally stroked.',
		keywords: ['circle', 'box', 'vector'],
		category: 'text'
	},

	// Scene awareness
	ps_detect: {
		task: 'Find faces and objects',
		summary:
			'Finds faces and 80 kinds of everyday objects on your computer and returns where they are.',
		keywords: ['detection', 'bounding box', 'person']
	},
	ps_read_scene: {
		task: 'Read the scene: subjects, sky and horizon',
		summary:
			'Maps subjects, faces, sky and ground, the horizon, tonal zones and composition, on your computer.',
		keywords: ['thirds', 'composition']
	},
	ps_detect_landmarks: {
		task: 'Map the face (468-point mesh)',
		summary:
			'A 468-point face mesh, computed on your computer and returned as named regions and points.',
		keywords: ['portrait', 'landmarks']
	},
	ps_resolve_placement: {
		task: 'Find an exact spot from a description',
		summary:
			'Turns a phrase like "halfway between the two boats" into exact pixel positions, checked before use.',
		keywords: ['position', 'coordinates', 'aim']
	},

	// Check the result
	ps_inspect: {
		task: 'Read the document, layers and history',
		summary:
			"Reads metadata, the layer tree, history, the selection or a Smart Object's contents, without changing anything.",
		keywords: ['exif', 'metadata', 'layer tree']
	},
	ps_get_preview: {
		task: 'Render a preview',
		summary:
			'A downscaled image of the document as it is now, with optional overlays such as a thirds grid or marked areas.',
		keywords: ['look', 'screenshot']
	},
	ps_get_histogram: {
		task: 'Measure tone with a histogram',
		summary:
			'Per-channel histogram with mean, median and spread, for catching clipping that a preview can hide.',
		keywords: ['clipping', 'exposure', 'levels']
	},
	ps_compare_regions: {
		task: 'Compare two regions',
		summary:
			'Measures color and tone in two areas side by side, for example to match a placed image to its scene.',
		keywords: ['match', 'white balance']
	},
	ps_get_layer_bounds_diff: {
		task: "Check a layer's size and position against a target",
		summary:
			'Reports how far each edge of a layer is from its target, with a verdict such as aligned or shifted right.',
		keywords: ['alignment']
	},
	ps_get_selection_preview: {
		task: 'Preview the active selection',
		summary:
			'Shows what is selected as a red overlay or a black-and-white mask, before an edit is committed.',
		keywords: ['quick mask']
	},
	gimp_inspect: {
		task: 'Read the image, layers and filters',
		summary: "Lists open images and reads one image's size, layers, channels and live filters.",
		keywords: ['metadata', 'layer tree']
	},
	gimp_get_preview: {
		task: 'Render a preview',
		summary:
			'Renders the image with its live filters, whole or as a full-size crop, and keeps a preview file you can open.',
		keywords: ['look', 'screenshot']
	},
	gimp_get_histogram: {
		task: 'Measure tone with a histogram',
		summary:
			'Mean, median, percentiles and a histogram per channel, with an exact mode for a final clipping check.',
		keywords: ['clipping', 'exposure', 'levels']
	},
	gimp_compare: {
		task: 'Compare before and after',
		summary:
			'Measures how the filters changed the image, whole or in one area, or compares two areas.',
		keywords: ['difference', 'regions']
	},

	// Templates and automation
	ps_sequence: {
		task: 'Run several steps in one go',
		summary: 'Runs up to 25 tool calls in order, and stops, carries on or rolls back if one fails.',
		keywords: ['batch', 'chain', 'rollback']
	},
	ps_batch: {
		task: 'Apply one recipe to a whole folder',
		summary:
			'Runs one recipe over a folder as a single Photoshop batch, and can show what it would touch first.',
		keywords: ['bulk', 'many photos', 'export']
	},
	ps_template_create_evidence: {
		task: "Gather an edit's evidence for a template",
		summary:
			'Collects the steps, history and settings behind a finished edit, with before and after previews.'
	},
	ps_template_save: {
		task: 'Save an edit as a template',
		summary:
			'Saves a finished look as a named template, optionally with a measurable style signature.',
		keywords: ['preset', 'recipe', 'look']
	},
	ps_template_list: {
		task: 'List saved templates',
		summary: 'Lists the templates saved on this computer.',
		keywords: ['preset', 'recipe']
	},
	ps_template_apply: {
		task: 'Apply a template to a new photo',
		summary:
			'Applies a saved look to the current photo, fitting each value to that image, then checks the result.',
		keywords: ['preset', 'recipe', 'look']
	},
	ps_template_verify: {
		task: 'Check a photo against a template',
		summary:
			"Measures the current photo against a template's style signature and suggests a fix for each miss.",
		keywords: ['consistency', 'match']
	},
	ps_template_recall: {
		task: 'Recall part of a template',
		summary:
			'Brings back one part of a template, such as its goals or tuning notes, late in a long session.'
	},
	ps_template_delete: {
		task: 'Delete a template',
		summary: 'Removes a saved template.'
	},
	ps_list_actions: {
		task: 'List your recorded Actions',
		summary: "Lists the Action sets and Actions loaded in Photoshop's Actions panel.",
		keywords: ['macro']
	},
	ps_play_action: {
		task: 'Play a recorded Action',
		summary: 'Plays one of your recorded Photoshop Actions.',
		keywords: ['macro', 'run action']
	},
	ps_execute_script: {
		task: 'Run a custom script',
		summary: 'Runs a Photoshop script for the rare job no specific tool covers.',
		keywords: ['extendscript', 'jsx', 'code']
	},

	// Session and setup
	ps_ping: {
		task: 'Check Photoshop is connected',
		summary:
			'Confirms Photoshop is reachable and reports its version, which documents are open, and whether an update is out.',
		keywords: ['status', 'connection']
	},
	ps_overview: {
		task: 'Get the working method and tool map',
		summary:
			'A short brief the AI reads first on an open-ended edit: how to work and how to check results.',
		keywords: ['help', 'guide']
	},
	ps_list_capabilities: {
		task: 'List what the tools can do',
		summary:
			'A live map of every available tool, grouped by purpose, so the AI can reorient mid-session.',
		keywords: ['help', 'tools']
	},
	ps_undo: {
		task: 'Undo a step',
		summary: 'Steps back through the document history, like Ctrl+Z or Cmd+Z.',
		keywords: ['revert', 'history']
	},
	ps_redo: {
		task: 'Redo a step',
		summary: 'Steps forward again after an undo, as long as no new edit has been made.',
		keywords: ['history']
	},
	ps_report_problem: {
		task: 'Write an anonymous bug report',
		summary:
			'Saves an anonymized diagnostic file to Downloads to attach to a bug report. It holds no image content.',
		keywords: ['diagnostics', 'support', 'logs']
	},
	gimp_ping: {
		task: 'Check GIMP is ready',
		summary:
			'Starts the background GIMP session if needed and confirms it is ready. The very first launch can take minutes.',
		keywords: ['status', 'connection']
	},
	gimp_overview: {
		task: 'Get the working method for GIMP',
		summary:
			'A short brief the AI reads first on an open-ended GIMP edit: how the background session works.',
		keywords: ['help', 'guide', 'headless']
	},
	gimp_checkpoint: {
		task: 'Save and restore checkpoints',
		summary:
			"Saves the image's current state to disk and restores it later. GIMP's stand-in for undo here.",
		keywords: ['undo', 'snapshot', 'revert'],
		category: 'session'
	}
};
