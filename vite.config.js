import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'img/*.png', 'audios/*.{mp3,m4a}'],
      manifest: {
        name: 'VozAtiva Pro - CAA',
        short_name: 'VozAtiva',
        description: 'Comunicação Alternativa e Aumentativa Offline',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: '/img/eu.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/img/eu.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Limite expandido para 20 MB para armazenar com folga todos os áudios .m4a e .mp3
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,m4a}']
      }
    })
  ]
})