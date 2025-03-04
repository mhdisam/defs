import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/defs/",
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://bandbooster.liara.run',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
