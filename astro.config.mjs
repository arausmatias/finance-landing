// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Project site on GitHub Pages: https://arausmatias.github.io/finance-landing/
// With a custom domain, set `site` to it and drop `base`.
export default defineConfig({
  site: 'https://arausmatias.github.io',
  base: '/finance-landing',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
});
