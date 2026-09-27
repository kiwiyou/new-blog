import { component$ } from "@qwik.dev/core";
import {
	useLocation,
	type RequestHandler,
	type StaticGenerateHandler,
} from "@qwik.dev/router";
import { posts } from "../../../lib/content";
import PagedList, { pageCount, validPage } from "../../../components/PagedList";

export const onStaticGenerate: StaticGenerateHandler = () => ({
	params: Array.from({ length: pageCount(posts) - 1 }, (_, index) => ({
		page: String(index + 2),
	})),
});
export const onGet: RequestHandler = ({ params, status }) => {
	if (!validPage(params.page, posts)) status(404);
};

export default component$(() => {
	const page = useLocation().params.page;
	return validPage(page, posts) ? (
		<PagedList
			title="글 목록"
			description="제가 쓴 글들입니다."
			entries={posts}
			base="/posts/"
			page={Number(page)}
		/>
	) : (
		<main id="main-content" class="page-main">
			<h1>페이지를 찾을 수 없습니다.</h1>
		</main>
	);
});
