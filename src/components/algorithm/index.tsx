import { component$, Slot } from '@qwik.dev/core';

export const Function = component$(() => <div class="algorithm-function"><Slot /></div>);
export const Scope = component$(() => <ol class="algorithm-scope"><Slot /></ol>);
export const Line = component$(() => <li class="algorithm-line"><Slot /></li>);
export const Keyword = component$(() => <em class="algorithm-keyword"><Slot /></em>);
export const Comment = component$(() => <span class="algorithm-comment"><Slot /></span>);
