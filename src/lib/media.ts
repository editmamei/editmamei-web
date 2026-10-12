import manifest from './content/media.generated.json';

// Videos are served from R2 at media.editmamei.com, not from static/: the
// site's host ignores byte-range requests, and Safari on iPhone needs them to
// play an MP4. scripts/upload-media.mjs uploads each file under media/ and
// writes the map; a path missing from it is a type error.
export type MediaPath = keyof typeof manifest;

export function mediaUrl(path: MediaPath): string {
	return manifest[path];
}
