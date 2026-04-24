import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// Site URL and base path are configurable via env so the same build
// works for a user-site (cyrilletabe.github.io), a custom domain,
// or a project-site path (/repo-name/).
const SITE = process.env.SITE_URL || 'https://cyrilletabe.com';
const BASE = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
    // React is scoped — only the home hero hydrates a React island. No
    // global runtime, no hydration on other routes. `client:visible`
    // keeps the bundle out of the critical path.
    react(),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  compressHTML: true,
});
