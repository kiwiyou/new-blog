import type { RequestHandler } from "@qwik.dev/router";
import { pageCount } from "../../components/PagedList";
import { lyrics, posts, slugifyTag } from "../../lib/content";
import { taggedPosts, tags } from "../tags/[tag]/index";

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
	const url = (path: string, lastmod?: string) =>
		`<url><loc>${xml(`https://blog.kiwiyou.dev${encodeURI(path)}`)}</loc>${lastmod ? `<lastmod>${xml(lastmod)}</lastmod>` : ""}</url>`;
	const pages = (base: string, count: number) =>
		Array.from({ length: Math.max(0, count - 1) }, (_, index) =>
			url(`${base}${index + 2}/`),
		).join("");

	headers.set("Content-Type", "application/xml; charset=utf-8");
	send(
		200,
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["/", "/about/", "/posts/", "/lyrics/"].map((path) => url(path)).join("")}${posts.map((post) => url(`/posts/${post.slug}/`, new Date(post.modDatetime ?? post.pubDatetime).toISOString().slice(0, 10))).join("")}${lyrics.map((lyric) => url(`/lyrics/${lyric.slug}/`, new Date(lyric.modDatetime ?? lyric.pubDatetime).toISOString().slice(0, 10))).join("")}${pages("/posts/", pageCount(posts))}${pages("/lyrics/", pageCount(lyrics))}${tags.map((tag) => { const slug = slugifyTag(tag); return url(`/tags/${slug}/`) + pages(`/tags/${slug}/`, pageCount(taggedPosts(slug))); }).join("")}</urlset>`,
	);
};
