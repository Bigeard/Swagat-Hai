import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa'

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig(async () => ({
  base: "/Swagat-Hai/",
  plugins: [tailwindcss(), react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
    manifest: {
      name: 'Swagat Hai',
      short_name: 'Swa',
      description: 'Swagat Hai',
      theme_color: '#261b25',
      background_color: '#c59f61',
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      // Cache everything needed for offline use
      navigateFallback: '/index.html',
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // Precache app shell
      runtimeCaching: [
        {
          urlPattern: ({ request }) =>
            request.destination === 'document' ||
            request.destination === 'script' ||
            request.destination === 'style' ||
            request.destination === 'image' ||
            request.destination === 'font',
          handler: 'CacheFirst',
          options: {
            cacheName: 'assets-cache',
            expiration: { maxEntries: 200 }
          }
        }
      ]
    }
  })
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    allowedHosts: true,
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
