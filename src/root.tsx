import { component$ } from '@qwik.dev/core'
import { DocumentHeadTags, RouterOutlet, useQwikRouter } from '@qwik.dev/router'
import './global.css'
import 'katex/dist/katex.min.css'

export default component$(() => {
  useQwikRouter()
  return <>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <script dangerouslySetInnerHTML="document.documentElement.dataset.theme = localStorage.getItem('theme') || 'dark'" />
      <DocumentHeadTags />
    </head>
    <body><RouterOutlet /></body>
  </>
})
