import { ssgAdapter } from '@qwik.dev/router/adapters/ssg/vite'
import { extendConfig } from '@qwik.dev/router/vite'
import baseConfig from './vite.config'

export default extendConfig(baseConfig, () => ({
  build: { ssr: true, rolldownOptions: { input: ['@qwik-router-config'] } },
  plugins: [ssgAdapter({ origin: 'https://blog.kiwiyou.dev' })],
}))
