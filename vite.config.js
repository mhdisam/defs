import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/defs/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
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
