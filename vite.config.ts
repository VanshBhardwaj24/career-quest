import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  plugins: [react()],
  appType: 'spa',
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 5173,
    strictPort: false,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    entries: ['index.html'],
  },
});
