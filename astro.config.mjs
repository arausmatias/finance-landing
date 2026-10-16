// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// GitHub Pages with the custom domain loneto.app (DNS on Cloudflare).
export default defineConfig({
  site: 'https://loneto.app',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
});
