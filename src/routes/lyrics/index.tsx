import { component$ } from '@qwik.dev/core'
import { lyrics } from '../../lib/content'
import { PageHeader, PostCard } from '../../components/Site'

export default component$(() => <main id="main-content" class="page-main"><PageHeader title="가사" description="제가 번역한 가사들입니다." /><ul class="post-list">{lyrics.map(song => <PostCard key={song.slug} href={`/lyrics/${song.slug}/`} title={song.title} description={song.author} published={song.pubDatetime} modified={song.modDatetime} />)}</ul></main>)
