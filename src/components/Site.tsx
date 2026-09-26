import { component$, useSignal } from '@qwik.dev/core'
import { useLocation } from '@qwik.dev/router'
import { slugifyTag } from '../lib/content'

export const DateStamp = component$(({ published, modified }: { published: string; modified?: string }) => {
  const date = modified || published
  return <div class="post-date"><span aria-hidden="true">▦</span> {modified && <span>수정 </span>}<time dateTime={date}>{new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}</time></div>
})

export const PostCard = component$(({ href, title, description, published, modified }: { href: string; title: string; description?: string; published: string; modified?: string }) => <li class="post-card">
  <a href={href}><h3>{title}</h3></a>
  <DateStamp published={published} modified={modified} />
  {description && <p>{description}</p>}
</li>)

export const TagLink = component$(({ tag }: { tag: string }) => <li><a href={`/tags/${slugifyTag(tag)}/`}><span aria-hidden="true">#</span>{tag}</a></li>)

export const PageHeader = component$(({ title, description }: { title: string; description?: string }) => {
  const { url } = useLocation()
  const path = url.pathname.split('/').filter(Boolean)
  return <>
    <nav class="breadcrumb" aria-label="breadcrumb"><a href="/">첫 화면</a><span aria-hidden="true"> &gt; </span>{path.length > 1 ? <><a href={`/${path[0]}/`}>{path[0] === 'tags' ? '태그' : path[0]}</a><span aria-hidden="true"> &gt; </span></> : null}<span aria-current="page">{title}</span></nav>
    <h1>{title}</h1>{description && <p class="page-description">{description}</p>}
  </>
})

export default component$(() => {
  const { url } = useLocation()
  const menu = useSignal(false)
  const nav = [
    ['/posts/', '글 목록'], ['/lyrics/', '가사 번역'], ['/tags/', '태그'], ['/about/', '소개'], ['/search/', '검색'],
  ]
  return <>
    <header class="site-header">
      <a class="skip-link" href="#main-content">본문 바로가기</a>
      <div class="header-inner">
        <a class="site-logo" href="/">kiwifarm</a>
        <button class="menu-button" type="button" aria-label="메뉴 열기" aria-controls="site-nav" aria-expanded={menu.value} onClick$={() => menu.value = !menu.value}>☰</button>
        <nav id="site-nav" class={menu.value ? 'site-nav open' : 'site-nav'} aria-label="주 메뉴">
          {nav.map(([href, label]) => <a key={href} href={href} class={url.pathname.startsWith(href) ? 'active' : undefined}>{label}</a>)}
          <button class="theme-button" type="button" aria-label="화면 색상 전환" onClick$={() => { const root = document.documentElement; const next = root.dataset.theme === 'dark' ? 'light' : 'dark'; root.dataset.theme = next; localStorage.setItem('theme', next) }}>☀︎/☾</button>
        </nav>
      </div>
    </header>
  </>
})

export const SiteFooter = component$(() => <footer class="site-footer">
  <div class="footer-inner">
    <div class="social-links"><a href="https://github.com/kiwiyou" aria-label="GitHub">GitHub</a><a href="https://x.com/giwiyou" aria-label="X">X</a><a href="https://discordapp.com/users/kiwiyou" aria-label="Discord">Discord</a><a href="https://t.me/kiwiyou" aria-label="Telegram">Telegram</a></div>
    <small>Copyright © kiwiyou {new Date().getFullYear()} <span aria-hidden="true">|</span> All rights reserved.</small>
  </div>
</footer>)
