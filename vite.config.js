import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // relative asset paths so the build also loads correctly via file:// in Electron
  server: {
    port: 5173,
  },
})
