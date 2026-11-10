import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5174,
    strictPort: false,
    hmr: {
      host: 'localhost',
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Logezy',
        short_name: 'Logezy',
        description: 'N°1 de l\'immobilier au Bénin',
        theme_color: '#3A7D44',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  build: {
    // Compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // Supprime tous les console.log en prod
        drop_debugger: true,   // Supprime les debugger
      },
    },
    // Taille max des chunks avant avertissement
    chunkSizeWarningLimit: 1000,
  },
  // Optimisation des imports
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'zustand',
    ],
  },
});