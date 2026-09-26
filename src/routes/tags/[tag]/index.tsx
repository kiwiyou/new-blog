import { component$ } from '@qwik.dev/core'
import { useLocation, type StaticGenerateHandler } from '@qwik.dev/router'
import { posts, slugifyTag } from '../../../lib/content'
import { PageHeader, PostCard } from '../../../components/Site'

const tags = [...new Set(posts.filter(post => !post.draft).flatMap(post => post.tags || []))]

export const onStaticGenerate: StaticGenerateHandler = () => ({ params: tags.map(tag => ({ tag: slugifyTag(tag) })) })

export default component$(() => {
  const { params } = useLocation()
  const routeTag = params.tag.toLowerCase()
  const tag = tags.find(value => slugifyTag(value) === routeTag) || params.tag
  const matching = posts.filter(post => !post.draft && post.tags?.some(value => slugifyTag(value) === routeTag))
  return <main id="main-content" class="page-main"><PageHeader title={`#${tag}`} description={`"${tag}" 태그가 붙은 글 목록입니다.`} /><ul class="post-list">{matching.map(post => <PostCard key={post.slug} href={`/posts/${post.slug}/`} title={post.title} description={post.description} published={post.pubDatetime} modified={post.modDatetime} />)}</ul></main>
})
