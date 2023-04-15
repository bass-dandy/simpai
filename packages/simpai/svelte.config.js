import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'$components': 'src/components',
			'$svg': 'src/svg',
		},
		files: {
			lib: 'src/lib',
		},
	},
};

export default config;
