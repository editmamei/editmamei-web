/**
 * Runs a CSS entrance the first time the element scrolls into view. The
 * element starts visible; only when this runs, and only if the element is
 * still below the fold, is it armed (`lp-armed`, the hidden start) until it
 * enters (`is-in`). With no script, nothing is ever hidden.
 */
export function reveal(node: HTMLElement, threshold = 0.2) {
	if (typeof IntersectionObserver === 'undefined') return;
	const r = node.getBoundingClientRect();
	if (r.top < window.innerHeight && r.bottom > 0) return;
	// Arm without animating: transitions are off for the frame the hidden start
	// is applied, so the element never visibly fades out.
	node.classList.add('lp-arming', 'lp-armed');
	requestAnimationFrame(() => requestAnimationFrame(() => node.classList.remove('lp-arming')));
	const io = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				node.classList.add('is-in');
				io.disconnect();
			}
		},
		{ threshold }
	);
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
		}
	};
}

/** Calls `onChange(true|false)` as the element enters and leaves the viewport. */
export function inView(node: HTMLElement, onChange: (visible: boolean) => void) {
	if (typeof IntersectionObserver === 'undefined') {
		onChange(true);
		return;
	}
	const io = new IntersectionObserver((entries) => {
		for (const e of entries) onChange(e.isIntersecting);
	});
	io.observe(node);
	return {
		destroy() {
			io.disconnect();
		}
	};
}
