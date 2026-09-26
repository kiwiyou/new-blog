import { component$ } from '@qwik.dev/core'

export default component$(({ svg }: { svg: string }) => <span class="icon" aria-hidden="true" dangerouslySetInnerHTML={svg} />)
