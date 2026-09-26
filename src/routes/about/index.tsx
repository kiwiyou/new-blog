import { component$ } from '@qwik.dev/core'
import { type DocumentHead } from '@qwik.dev/router'
import { PageHeader } from '../../components/Site'

export const head: DocumentHead = { title: '소개' }

export default component$(() => <main id="main-content" class="page-main">
  <PageHeader title="소개" />
  <article class="prose">
    <p>저는 CJKV 한자, Rust 프로그래밍 언어, 프로그램 최적화, 보안을 공부하고 있는 대학생입니다.</p>
  </article>
</main>)
