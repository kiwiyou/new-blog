import { component$ } from '@qwik.dev/core'
import { lyrics } from '../../lib/content'
import PagedList from '../../components/PagedList'

export default component$(() => <PagedList title="가사" description="제가 번역한 가사들입니다." entries={lyrics} base="/lyrics/" lyrics />)
