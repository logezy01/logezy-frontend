import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
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
    // Code splitting automatique
rollupOptions: {
  output: {
    manualChunks: (id) => {
      if (id.includes('node_modules')) {
        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
          return 'vendor-react';
        }
        if (id.includes('framer-motion') || id.includes('lucide-react')) {
          return 'vendor-ui';
        }
        if (id.includes('leaflet') || id.includes('react-leaflet')) {
          return 'vendor-map';
        }
        if (id.includes('@supabase')) {
          return 'vendor-supabase';
        }
        if (id.includes('socket.io')) {
          return 'vendor-socket';
        }
        return 'vendor';
      }
    },
  },
},
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