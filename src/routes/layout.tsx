import { component$, Slot } from '@qwik.dev/core'
import { useDocumentHead, useLocation } from '@qwik.dev/router'
import Site, { DateStamp, SiteFooter, TagLink } from '../components/Site'

type ArticleFrontmatter = {
  title?: string
  author?: string
  pubDatetime?: string
  modDatetime?: string
  tags?: string[]
  lang?: string[]
  youtube?: string
  comment?: boolean
}

export default component$(() => {
  const { url } = useLocation()
  const parts = url.pathname.split('/').filter(Boolean)
  const isPost = parts[0] === 'posts' && parts.length === 2 && !/^\d+$/.test(parts[1])
  const isLyric = parts[0] === 'lyrics' && parts.length === 2 && !/^\d+$/.test(parts[1])
  const head = useDocumentHead()
  const meta = (head.frontmatter || {}) as ArticleFrontmatter
  const author = meta.author || head.meta?.find(item => item.name === 'author')?.content
  const title = isLyric && author ? `${author} - ${head.title}` : head.title

  return <>
    <Site />
    {isPost || isLyric ? <>
      <div class="back-link container"><a href={isLyric ? '/lyrics/' : '/posts/'}>‹ 뒤로 가기</a></div>
      <main id="main-content" class="article-main">
        <h1 class="article-title">{title}</h1>
        {meta.pubDatetime && <DateStamp published={meta.pubDatetime} modified={meta.modDatetime} />}
        <article id="article" class={isLyric ? 'article-body lyric-body' : 'article-body prose'}>
          {isLyric && <>
            {meta.lang?.length ? <div class="lyric-controls" aria-label="가사 언어 표시">
              {(['ja', 'yomigana', 'ko-transliteration', 'ko'] as const).filter(value => meta.lang?.includes(value)).map(value => <label key={value}><input type="checkbox" checked name={value} /><span>{({ ja: 'あ', yomigana: '読み', 'ko-transliteration': '발음', ko: '가' })[value]}</span></label>)}
            </div> : null}
            {meta.youtube && <p class="lyric-video"><a href={meta.youtube} target="_blank" rel="noopener noreferrer">youtube</a></p>}
          </>}
          <div id={isLyric ? 'lyrics' : undefined} class={isLyric ? 'lyric-lines prose' : undefined}><Slot /></div>
        </article>
        {isPost && meta.tags?.length ? <ul class="tag-list article-tags">{meta.tags.map(tag => <TagLink key={tag} tag={tag} />)}</ul> : null}
        <div class="back-to-top"><a href="#main-content">맨 위로 ↑</a></div>
        {meta.comment && <div class="comments"><script src="https://giscus.app/client.js" data-repo="kiwiyou/new-blog" data-repo-id="R_kgDOGoQLHw" data-category="댓글" data-category-id="DIC_kwDOGoQLH84CcGYV" data-mapping="og:title" data-strict="1" data-reactions-enabled="1" data-emit-metadata="0" data-input-position="top" data-theme="preferred_color_scheme" data-lang="ko" crossOrigin="anonymous" async /></div>}
      </main>
    </> : <Slot />}
    <SiteFooter />
  </>
})
