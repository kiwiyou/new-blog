import { component$ } from "@qwik.dev/core";
import { posts } from "../../lib/content";
import PagedList from "../../components/PagedList";

export default component$(() => (
	<PagedList
		title="글 목록"
		description="제가 쓴 글들입니다."
		entries={posts}
		base="/posts/"
	/>
));
