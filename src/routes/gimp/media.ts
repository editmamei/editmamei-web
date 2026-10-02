// Optional before/after for the /gimp hero. The page renders a single text
// column while this is null and switches to a two-column hero with the
// slider once a pair is set. Only use images from an actual Editmamei run in
// GIMP; put them under static/demos/gimp-<subject>/.
export interface GimpHeroMedia {
	beforeSrc: string;
	afterSrc: string;
	beforeAlt: string;
	afterAlt: string;
	/** One line under the slider: what was asked for and what GIMP applied. */
	caption: string;
}

export const gimpHeroMedia: GimpHeroMedia | null = null;
