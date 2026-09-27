import { component$ } from "@qwik.dev/core";
import {
	useLocation,
	type RequestHandler,
	type StaticGenerateHandler,
} from "@qwik.dev/router";
import { slugifyTag } from "../../../../lib/content";
import PagedList, {
	pageCount,
	validPage,
} from "../../../../components/PagedList";
import { taggedPosts, tags } from "../index";

export const onStaticGenerate: StaticGenerateHandler = () => ({
	params: tags.flatMap((tag) =>
		Array.from(
			{ length: pageCount(taggedPosts(slugifyTag(tag))) - 1 },
			(_, index) => ({ tag: slugifyTag(tag), page: String(index + 2) }),
		),
	),
});
export const onGet: RequestHandler = ({ params, status }) => {
	if (!validPage(params.page, taggedPosts(params.tag.toLowerCase())))
		status(404);
};

export default component$(() => {
	const { tag: rawTag, page } = useLocation().params;
	const routeTag = rawTag.toLowerCase();
	const tag = tags.find((value) => slugifyTag(value) === routeTag) || rawTag;
	return validPage(page, taggedPosts(routeTag)) ? (
		<PagedList
			title={`#${tag}`}
			description={`"${tag}" 태그가 붙은 글 목록입니다.`}
			entries={taggedPosts(routeTag)}
			base={`/tags/${routeTag}/`}
			page={Number(page)}
		/>
	) : (
		<main id="main-content" class="page-main">
			<h1>페이지를 찾을 수 없습니다.</h1>
		</main>
	);
});
