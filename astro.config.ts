import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkCollapse from 'remark-collapse'
import remarkMath from 'remark-math'
import { SITE } from './src/config'
import gruvboxDark from './src/gruvbox-dark-hard.json'
import gruvboxLight from './src/gruvbox-light-soft.json'

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
})
