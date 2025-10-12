import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // Set the base path for GitHub Pages deployment
    base: command === 'build' ? '/winnie-lin.space/' : '/',
  };
});
