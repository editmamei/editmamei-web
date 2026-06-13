export type LayerKind =
	| 'brightness-contrast'
	| 'hue-saturation'
	| 'curves'
	| 'levels'
	| 'color-balance'
	| 'selective-color'
	| 'photo-filter'
	| 'pixel'
	| 'smart-object'
	| 'group'
	| 'text'
	| 'shape'
	| 'fill'
	| 'other';

export interface Layer {
	name: string;
	kind: LayerKind;
	summary: string;
	masked?: boolean;
}

export interface Demo {
	slug: string;
	title: string;
	headline: string;
	summary: string;
	before: string;
	after: string;
	beforeAlt: string;
	afterAlt: string;
	layers: Layer[];
}

export type PromptVoice = 'novice' | 'pro';

export interface DemoPrompt {
	voice: PromptVoice;
	label: string;
	text: string;
}

export interface Pillar {
	title: string;
	body: string;
}

/**
 * Per-card mini-demo descriptor for the product-page capability cards. Each
 * card shows ONE real Photoshop tool applied to the clean City-Street original
 * (assets under `static/product/city-street/`). Utility tools show their own
 * authentic output (selection wash, B/W mask, histogram) rather than a result.
 */
export type CapabilityDemo =
	| { kind: 'documents'; image: string }
	| { kind: 'layers'; image: string }
	| { kind: 'selection'; image: string; tool: string }
	| { kind: 'beforeAfter'; before: string; after: string; tool: string }
	| { kind: 'mask'; before: string; after: string; maskThumb: string; tool: string }
	| { kind: 'histogram' };

export interface Capability {
	title: string;
	body: string;
	demo: CapabilityDemo;
}

export interface WorkflowExample {
	title: string;
	prompt: string;
	outcome: string;
}

export interface EditionRow {
	feature: string;
	community: boolean;
	pro: boolean;
}

export interface DemoExample {
	demo: Demo;
	prompt: DemoPrompt;
}
