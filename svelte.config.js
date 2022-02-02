/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [preprocess({ postcss: true })],
	adapter: adapter(),
	kit: {
		target: '#svelte'
	}
};

export default config;
