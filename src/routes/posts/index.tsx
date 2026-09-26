import { component$ } from '@qwik.dev/core'
import { posts } from '../../lib/content'
import { PageHeader, PostCard } from '../../components/Site'

export default component$(() => <main id="main-content" class="page-main"><PageHeader title="글 목록" description="제가 쓴 글들입니다." /><ul class="post-list">{posts.filter(post => !post.draft).map(post => <PostCard key={post.slug} href={`/posts/${post.slug}/`} title={post.title} description={post.description} published={post.pubDatetime} modified={post.modDatetime} />)}</ul></main>)
