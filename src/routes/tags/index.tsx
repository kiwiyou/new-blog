import { component$ } from '@qwik.dev/core'
import { posts } from '../../lib/content'
import { PageHeader, TagLink } from '../../components/Site'

const tags = [...new Set(posts.filter(post => !post.draft).flatMap(post => post.tags || []))].sort((a, b) => a.localeCompare(b))

export default component$(() => <main id="main-content" class="page-main"><PageHeader title="태그" description="글에 쓰인 태그 목록" /><ul class="tag-list">{tags.map(tag => <TagLink key={tag} tag={tag} />)}</ul></main>)
