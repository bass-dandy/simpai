import {sveltekit} from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg'
import {defineConfig} from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		svg(),
		{
			// Temporary workaround since server.watch.ignored config is broken
			// see https://github.com/vitejs/vite/issues/8619
			name: 'watch-node-modules',
			configureServer: (server) => {
				server.watcher.options = {
					...server.watcher.options,
					ignored: [
						/node_modules\/(?!dbpf-transform).*/,
						'**/.git/**',
					],
				};
			},
		},
	],
	resolve: {
		preserveSymlinks: true,
	},
	optimizeDeps: {
		exclude: ['dbpf-transform'],
		// should be 'dbpf-transform > qfs-compression', but there's some issue with optimizing cjs sub deps
		// for now, this is re-declared in simpai as a dev dep
		// see https://github.com/vitejs/vite/issues/9710#issuecomment-1448516591
		include: ['qfs-compression'],
	},
});
