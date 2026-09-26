import type { RequestHandler } from '@qwik.dev/router'
import { ogImage } from '../../lib/og'

export const onGet: RequestHandler = async ({ headers, send }) => {
  headers.set('Content-Type', 'image/png')
  send(200, await ogImage('키위밭', 'CJKV 한자와 Rust와 프로그램 최적화에 관한 이야기'))
}
