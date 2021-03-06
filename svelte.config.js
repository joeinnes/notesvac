/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [preprocess({ postcss: true })],
	kit: {
		target: '#svelte',
		adapter: adapter()
	}
};

export default config;
