
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Injects the API_KEY from the environment into the application
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  // Set the base path to your repository name for GitHub Pages deployment
  base: '/YOUR_REPO_NAME/'
});
