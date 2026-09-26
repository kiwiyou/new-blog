import { component$, useSignal } from '@qwik.dev/core'
import { useLocation } from '@qwik.dev/router'
import { posts, lyrics } from '../../lib/content'
import { PageHeader, PostCard } from '../../components/Site'

const items = [
  ...posts.filter(post => !post.draft).map(post => ({ ...post, href: `/posts/${post.slug}/` })),
  ...lyrics.map(song => ({ ...song, description: song.author, href: `/lyrics/${song.slug}/` })),
]

export default component$(() => {
  const { url } = useLocation()
  const query = useSignal(url.searchParams.get('q') || '')
  const term = query.value.trim().toLocaleLowerCase()
  const results = term.length < 2 ? [] : items.filter(item => `${item.title} ${item.description || ''}`.toLocaleLowerCase().includes(term))
  return <main id="main-content" class="page-main"><PageHeader title="검색" description="글 내용을 검색합니다." />
    <label class="search-label"><span class="sr-only">검색어</span><input type="search" name="q" placeholder="검색할 내용..." value={query.value} onInput$={(_, input) => { query.value = input.value; const next = new URL(location.href); if (input.value) next.searchParams.set('q', input.value); else next.searchParams.delete('q'); history.replaceState(null, '', next) }} autoComplete="off" /></label>
    {term.length > 1 && <p class="search-count">{results.length}개 결과: “{query.value}”</p>}
    <ul class="post-list">{results.map(item => <PostCard key={item.href} href={item.href} title={item.title} description={item.description} published={item.pubDatetime} modified={item.modDatetime} />)}</ul>
  </main>
})
