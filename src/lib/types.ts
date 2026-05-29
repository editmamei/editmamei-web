export type LayerKind =
	| 'brightness-contrast'
	| 'hue-saturation'
	| 'curves'
	| 'levels'
	| 'color-balance'
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

export interface Capability {
	title: string;
	body: string;
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
