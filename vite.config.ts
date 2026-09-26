import { qwikVite } from '@qwik.dev/core/optimizer'
import { qwikRouter } from '@qwik.dev/router/vite'
import { defineConfig } from 'vite'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export default defineConfig({
  optimizeDeps: { exclude: ['@resvg/resvg-js'] },
  ssr: { external: ['@resvg/resvg-js'] },
  plugins: [qwikRouter({ mdx: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] } }), qwikVite()],
})
