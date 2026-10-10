// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// GitHub Pages with the custom domain loneto.app (DNS on Cloudflare).
export default defineConfig({
  site: 'https://loneto.app',
  trailingSlash: 'always',
  // Landing variants are comparison pages (noindex), so they stay out of the sitemap.
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/variants/') })],
});
