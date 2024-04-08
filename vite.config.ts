import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { isoImport } from 'vite-plugin-iso-import'

export default defineConfig({
	plugins: [sveltekit(), isoImport()],

	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *; @use "src/navigator.scss" as *;'
			}
		}
	}
})
