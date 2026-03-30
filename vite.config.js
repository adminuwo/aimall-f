import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base public path when served in production
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        aseries: resolve(__dirname, 'a-series.html'),
        partner: resolve(__dirname, 'partner.html'),
        contact: resolve(__dirname, 'contact.html'),
        admin: resolve(__dirname, 'admin.html'),
        'rag-admin': resolve(__dirname, 'rag-admin.html'),
        chatbot: resolve(__dirname, 'chatbot.html'),
      },
    },
  },
});
