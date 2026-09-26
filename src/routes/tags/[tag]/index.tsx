import { component$ } from '@qwik.dev/core'
import { useLocation, type StaticGenerateHandler } from '@qwik.dev/router'
import { posts, slugifyTag } from '../../../lib/content'
import PagedList from '../../../components/PagedList'

export const tags = [...new Set(posts.flatMap(post => post.tags || []))]
export const taggedPosts = (tag: string) => posts.filter(post => post.tags?.some(value => slugifyTag(value) === tag))

export const onStaticGenerate: StaticGenerateHandler = () => ({ params: tags.map(tag => ({ tag: slugifyTag(tag) })) })

export default component$(() => {
  const { params } = useLocation()
  const routeTag = params.tag.toLowerCase()
  const tag = tags.find(value => slugifyTag(value) === routeTag) || params.tag
  return <PagedList title={`#${tag}`} description={`"${tag}" 태그가 붙은 글 목록입니다.`} entries={taggedPosts(routeTag)} base={`/tags/${routeTag}/`} />
})
