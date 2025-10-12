import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // This is the crucial part for GitHub Pages deployment.
    // It tells Vite that all assets should be loaded relative to this path.
    base: command === 'build' ? '/winnie-lin.space/' : '/',
  };
});
