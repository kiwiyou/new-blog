import { component$ } from '@qwik.dev/core'
import { useLocation, type RequestHandler, type StaticGenerateHandler } from '@qwik.dev/router'
import { lyrics } from '../../../lib/content'
import PagedList, { pageCount, validPage } from '../../../components/PagedList'

export const onStaticGenerate: StaticGenerateHandler = () => ({ params: Array.from({ length: pageCount(lyrics) - 1 }, (_, index) => ({ page: String(index + 2) })) })
export const onGet: RequestHandler = ({ params, status }) => { if (!validPage(params.page, lyrics)) status(404) }

export default component$(() => {
  const page = useLocation().params.page
  return validPage(page, lyrics)
    ? <PagedList title="가사" description="제가 번역한 가사들입니다." entries={lyrics} base="/lyrics/" page={Number(page)} lyrics />
    : <main id="main-content" class="page-main"><h1>페이지를 찾을 수 없습니다.</h1></main>
})
