// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/en/guides/configuring-astro/
export default defineConfig({
  site: 'https://salema.dev',

  compressHTML: true,

  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-ES',
        },
      },
    }),
  ],

  build: {
    inlineStylesheets: 'auto',
  },
});
