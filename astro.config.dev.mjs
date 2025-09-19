import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import node from '@astrojs/node'

// Development-specific Astro configuration
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    port: 4321,
    host: true, // Allow external connections in development
  },
  devToolbar: {
    enabled: true, // Enable Astro dev toolbar
  },
  vite: {
    define: {
      'process.env.NODE_ENV': '"development"',
    },
    server: {
      watch: {
        usePolling: false, // Better for performance in development
      },
    },
    build: {
      sourcemap: true, // Enable source maps for debugging
      minify: false, // Don't minify in development for easier debugging
    },
    optimizeDeps: {
      include: ['react', 'react-dom'], // Pre-bundle for faster dev server startup
    },
  },
  experimental: {
    contentCollectionCache: true, // Enable content collection caching
  },
})