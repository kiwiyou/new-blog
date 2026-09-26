import { component$ } from '@qwik.dev/core'
import { DocumentHeadTags, RouterOutlet, useDocumentHead, useLocation, useQwikRouter } from '@qwik.dev/router'
import './global.css'
import 'katex/dist/katex.min.css'

export default component$(() => {
  useQwikRouter()
  const { url } = useLocation()
  const head = useDocumentHead()
  const parts = url.pathname.split('/').filter(Boolean)
  const article = (parts[0] === 'posts' || parts[0] === 'lyrics') && parts.length === 2 && !/^\d+$/.test(parts[1])
  const author = (head.frontmatter as { author?: string })?.author || head.meta.find(item => item.name === 'author')?.content
  const title = head.title || '키위밭'
  const image = article ? `/og/${parts[0]}/${parts[1]}/image.png` : '/og.png'
  return <>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <script dangerouslySetInnerHTML="document.documentElement.dataset.theme = localStorage.getItem('theme') || 'dark'" />
      <DocumentHeadTags title={title} meta={[
        ...head.meta,
        { property: 'og:type', content: article ? 'article' : 'website' },
        { property: 'og:title', content: parts[0] === 'lyrics' && author ? `${author} - ${title}` : title },
        { property: 'og:description', content: head.meta.find(item => item.name === 'description')?.content || 'kiwiyou의 블로그' },
        { property: 'og:url', content: url.href },
        { property: 'og:image', content: new URL(image, url.origin).href },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ]} />
    </head>
    <body><RouterOutlet /></body>
  </>
})
