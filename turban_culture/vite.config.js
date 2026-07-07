import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: 'https://turbanculture.com',
    }),
  ],

  server: {
    port: 5173,
    open: true,
  },

  build: {
    chunkSizeWarningLimit: 1000,
  },
})