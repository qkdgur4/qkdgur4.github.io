// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://qkdgur4.github.io',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap(), mdx()],

  markdown: {
    shikiConfig: {
      theme: 'github-dark', // 다크모드 기반 가독성 높은 코드 하이라이팅
      wrap: true,
    },
  },
});