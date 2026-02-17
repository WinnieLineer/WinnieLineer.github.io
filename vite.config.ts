import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use '/' as the base to generate absolute paths from the domain root.
  // This ensures assets load correctly regardless of the URL path.
  base: '/',
});
