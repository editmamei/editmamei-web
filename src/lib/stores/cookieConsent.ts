import { writable } from 'svelte/store';

const STORAGE_KEY = 'editmamei-cookie-consent';
type ConsentValue = 'granted' | 'denied' | null;

function createConsentStore() {
	const { subscribe, set } = writable<ConsentValue>(null);

	return {
		subscribe,
		init() {
			if (typeof localStorage === 'undefined') return;
			const stored = localStorage.getItem(STORAGE_KEY);
			set(stored === 'granted' || stored === 'denied' ? stored : null);
		},
		grant() {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, 'granted');
			}
			set('granted');
		},
		deny() {
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, 'denied');
			}
			set('denied');
		},
		reopen() {
			set(null);
		}
	};
}

export const cookieConsent = createConsentStore();
