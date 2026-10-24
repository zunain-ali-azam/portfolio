import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://zunainaliazam.vercel.app',
  // Links, canonicals and the sitemap all use /about, never /about/, so each page has one URL
  trailingSlash: 'never',
  // Pages stay prerendered; only routes with `prerender = false` (the contact endpoint) run as functions
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    // Confirmation pages aren't worth indexing
    sitemap({ filter: (page) => !/\/(sent|not-sent)\/?$/.test(page) }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
    },
  },
  server: {
    host: true,
  },
  vite: {
    server: {
      allowedHosts: 'all'
    }
  }
});
