import type { DemoExample } from '$lib/types';
import { setSail, setSailPrompt } from './set-sail';
import { vividRose, vividRoseProPrompt } from './vivid-rose';

export const demoExamples: DemoExample[] = [
	{ demo: setSail, prompt: setSailPrompt },
	{ demo: vividRose, prompt: vividRoseProPrompt }
];
