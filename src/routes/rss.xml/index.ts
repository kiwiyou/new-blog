import type { RequestHandler } from "@qwik.dev/router";
import { posts } from "../../lib/content";

const xml = (value: string) =>
	value.replace(
		/[<>&"']/g,
		(char) =>
			(
				({
					"<": "&lt;",
					">": "&gt;",
					"&": "&amp;",
					'"': "&quot;",
					"'": "&apos;",
				}) as Record<string, string>
			)[char],
	);

export const onGet: RequestHandler = ({ headers, send }) => {
	headers.set("Content-Type", "application/rss+xml; charset=utf-8");
	send(
		200,
		`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>kiwifarm</title><link>https://blog.kiwiyou.dev/</link><description>A journey of problem solver.</description><language>ko</language>${posts.map((post) => `<item><title>${xml(post.title)}</title><link>https://blog.kiwiyou.dev/posts/${post.slug}/</link><description>${xml(post.description ?? "")}</description><pubDate>${new Date(post.pubDatetime).toUTCString()}</pubDate></item>`).join("")}</channel></rss>`,
	);
};
