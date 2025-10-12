import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use an empty string for the base to generate relative asset paths.
  // This is the most robust solution for deploying to a subdirectory.
  base: '',
});
