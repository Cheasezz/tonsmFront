import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import mkcert from 'vite-plugin-mkcert'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), nodePolyfills(), process.env.HTTPS ? mkcert() : undefined],
  base: '/tonsmFront/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Exposes your dev server and makes it accessible for the devices in the same network.
    host: true,
  },
  publicDir: './public',
})
