import type { RequestHandler, StaticGenerateHandler } from "@qwik.dev/router";
import { lyrics, posts } from "../../../../../lib/content";
import { ogImage } from "../../../../../lib/og";

export const onStaticGenerate: StaticGenerateHandler = () => ({
	params: [
		...posts.map(({ slug }) => ({ type: "posts", slug })),
		...lyrics.map(({ slug }) => ({ type: "lyrics", slug })),
	],
});

export const onGet: RequestHandler = async ({
	params,
	headers,
	send,
	error,
}) => {
	const entry = (
		params.type === "posts" ? posts : params.type === "lyrics" ? lyrics : []
	).find(({ slug }) => slug === params.slug);
	if (!entry) throw error(404, "Article not found");
	headers.set("Content-Type", "image/png");
	send(
		200,
		await ogImage(
			entry.title,
			params.type === "posts"
				? `by ${entry.author || "kiwiyou"}`
				: entry.author || "가사 번역",
		),
	);
};
