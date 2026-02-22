import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@models': resolve(__dirname, './src/models'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@pages': resolve(__dirname, './src/pages'),
      '@context': resolve(__dirname, '/src/context'),
    }
  },
  build: {
    outDir: 'dist'
  }
})
