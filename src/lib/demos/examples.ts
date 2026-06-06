import type { DemoExample } from '$lib/types';
import { setSail, setSailPrompt } from './set-sail';
import { hawaiiCoastWallArt, hawaiiCoastWallArtProPrompt } from './hawaii-coast-wall-art';

export const demoExamples: DemoExample[] = [
	{ demo: setSail, prompt: setSailPrompt },
	{ demo: hawaiiCoastWallArt, prompt: hawaiiCoastWallArtProPrompt }
];
