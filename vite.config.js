import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Logezy — Immobilier Bénin',
        short_name: 'Logezy',
        description: 'Trouvez votre maison au Bénin',
        theme_color: '#1A6B3C',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'fr',
       icons: [
  {
    src: 'icon.svg',
    sizes: 'any',
    type: 'image/svg+xml'
  }
]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/logezy-backend\.onrender\.com\/api/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          }
        ]
      }
    })
  ],
})