import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), tsconfigPaths(), mkcert()],
  base: './',
  build: {
    target: 'esnext',
    outDir: './server/static/svelte-lab',
  },
})
