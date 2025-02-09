import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: '/', 
  plugins: [
    react(),
    visualizer({
      open: true, 
    }),
  ],
  build: {
    sourcemap: true, // Enable sourcemaps for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          reactRouter: ['react-router-dom'],
          tanstackQuery: ['@tanstack/react-query'],
        },
      },
    },
  },
});