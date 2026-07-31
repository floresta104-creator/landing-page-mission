import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: true,
    host: true,
    watch: {
      ignored: ['**/public/ref/**', '**/_ref/**'],
    },
  },
  preview: {
    port: 5180,
    strictPort: true,
  },
  publicDir: 'public',
})
