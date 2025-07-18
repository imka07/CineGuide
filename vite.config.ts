import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'


export default defineConfig({
  base: './',
  plugins: [react()],
   build: {
    outDir: 'dist', 
    assetsDir: 'assets',
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '~', replacement: path.resolve(__dirname, 'src') },
    ],
  },
})
