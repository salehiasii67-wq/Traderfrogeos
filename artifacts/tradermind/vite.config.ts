import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// تنظیم پورت به‌صورت اختیاری با مقدار پیش‌فرض ۵۱۷۳ برای الکترون
const port = process.env.PORT ? Number(process.env.PORT) : 5173;

// برای الکترون مسیر باید حتماً relative (./) باشه
const basePath = process.env.BASE_PATH || './';

export default defineConfig({
  base: basePath, // تنظیم مسیر نسبی برای لود صحیح فایل‌ها در الکترون
  plugins: [
    react(),
    tailwindcss(),
    ...(process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-runtime-error-modal').then((m) =>
            m.default(),
          ),
        ]
      : []),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/icon.svg', 'favicon.svg', 'robots.txt'],
      manifest: {
        name: 'TraderMind — ژورنال معامله‌گر',
        short_name: 'تریدرمایند',
        description: 'ابزار حرفه‌ای برای ثبت معاملات، تحلیل استراتژی و ژورنال روزانه معامله‌گر',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: './',
        id: 'com.tradermind.app',
        lang: 'fa',
        dir: 'rtl',
        categories: ['finance', 'productivity'],
        icons: [
          {
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
        screenshots: [],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webp}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tradermind-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
        type: 'module',
      },
    }),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  esbuild: {
    drop: ['debugger'],
    ...(process.env.NODE_ENV === 'production'
      ? { pure: ['console.log', 'console.debug', 'console.info'] }
      : {}),
  },
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'), // خروجی مستقیم روی dist
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-switch'],
          'vendor-db': ['dexie'],
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
