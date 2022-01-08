/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess({})],

	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		ssr: false,

		vite: {
			server: {
				proxy: {
					'/api': {
						target: process.env.VITE_API_URL,
						rewrite: (path) => path.replace(/^\/api/, ''),
						secure: false,
						changeOrigin: true,
						followRedirects: true
					}
				}
			}
		}
	}
};

export default config;
