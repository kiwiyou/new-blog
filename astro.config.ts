import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import remarkCollapse from 'remark-collapse';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config';
import mdx from '@astrojs/mdx';
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
    rehypePlugins: [
      rehypeKatex,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: gruvboxDark,
            light: gruvboxLight,
          },
        },
      ],
    ],
    syntaxHighlight: false,
  },
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
  scopedStyleStrategy: 'where',
  output: 'static',
});
