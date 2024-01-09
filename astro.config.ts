import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import remarkCollapse from 'remark-collapse';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config';
import mdx from '@astrojs/mdx';
import codeblocks from '@thewebforge/astro-code-blocks';
import gruvboxLight from './src/gruvbox-light-soft.json';
import gruvboxDark from './src/gruvbox-dark-hard.json';

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
    codeblocks({
      copyButtonTitle: '복사',
      copyButtonTooltip: '코드가 클립보드에 복사되었습니다!',
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      [
        remarkCollapse,
        {
          test: 'Table of contents',
        },
      ],
      remarkMath,
    ],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      experimentalThemes: {
        light: gruvboxLight as any,
        dark: gruvboxDark as any,
      },
      wrap: false,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
  scopedStyleStrategy: 'where',
  output: 'static',
});
