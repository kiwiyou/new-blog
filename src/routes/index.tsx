import { component$ } from '@qwik.dev/core'
import { posts } from '../lib/content'
import { PostCard } from '../components/Site'

export default component$(() => {
  const published = posts.filter(post => !post.draft)
  const featured = published.filter(post => post.featured)
  const recent = published.filter(post => !post.featured).slice(0, 4)
  return <main id="main-content" class="home-main">
    <section id="hero">
      <h1>키위밭 <a class="rss-link" href="/rss.xml" aria-label="RSS 피드" title="RSS 피드"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 20.001C19 11.729 12.271 5 4 5v2c7.168 0 13 5.832 13 13.001h2zM12 20.001h2C14 14.486 9.514 10 4 10v2c4.411 0 8 3.589 8 8.001z"/><circle cx="6" cy="18" r="2"/></svg></a></h1>
      <p>CJKV 한자와 Rust와 프로그램 최적화에 관심이 있는 대학생 kiwiyou의 블로그입니다. 제 지식의 대부분은 인터넷에서 왔습니다. 제가 받은 만큼 나누고자 글을 씁니다.</p>
      <div class="social-intro">여기서도 저를 만나보세요! <a href="https://github.com/kiwiyou">GitHub</a> · <a href="https://x.com/giwiyou">X</a> · <a href="https://discordapp.com/users/kiwiyou">Discord</a> · <a href="https://t.me/kiwiyou">Telegram</a></div>
    </section>
    {featured.length > 0 && <section id="featured"><h2>추천</h2><ul class="post-list">{featured.map(post => <PostCard key={post.slug} href={`/posts/${post.slug}/`} title={post.title} description={post.description} published={post.pubDatetime} modified={post.modDatetime} />)}</ul></section>}
    <section id="recent-posts"><h2>최근 글</h2><ul class="post-list">{recent.map(post => <PostCard key={post.slug} href={`/posts/${post.slug}/`} title={post.title} description={post.description} published={post.pubDatetime} modified={post.modDatetime} />)}</ul><p class="all-posts-link"><a href="/posts/">전체 보기 →</a></p></section>
  </main>
})
