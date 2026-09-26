import type { RequestHandler } from '@qwik.dev/router'

export const onGet: RequestHandler = ({ text }) => text(200, 'User-agent: *\nAllow: /\nSitemap: https://blog.kiwiyou.dev/sitemap.xml\n')
