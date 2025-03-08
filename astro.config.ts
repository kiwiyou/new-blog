import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkCollapse from 'remark-collapse'
import remarkMath from 'remark-math'
import { SITE } from './src/config'
import gruvboxDark from './src/gruvbox-dark-hard.json'
import gruvboxLight from './src/gruvbox-light-soft.json'
import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [sitemap(), mdx(), react()],
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
    plugins: [tailwindcss()],
  },
  scopedStyleStrategy: 'where',
  output: 'static',
})
