import { component$ } from "@qwik.dev/core";
import type { Entry } from "../lib/content";
import { PageHeader, PostCard } from "./Site";
import Icon from "./Icon";
import previousSvg from "lucide-static/icons/arrow-left.svg?raw";
import nextSvg from "lucide-static/icons/arrow-right.svg?raw";

export const pageSize = 5;
export const pageCount = (entries: Entry[]) =>
	Math.ceil(entries.length / pageSize);
export const validPage = (value: string, entries: Entry[]) =>
	/^(?:[2-9]|[1-9]\d+)$/.test(value) && Number(value) <= pageCount(entries);

export default component$(
	({
		title,
		description,
		entries,
		base,
		page = 1,
		lyrics = false,
	}: {
		title: string;
		description: string;
		entries: Entry[];
		base: string;
		page?: number;
		lyrics?: boolean;
	}) => {
		const count = pageCount(entries);
		const href = (number: number) =>
			number === 1 ? base : `${base}${number}/`;
		return (
			<main id="main-content" class="page-main">
				<PageHeader title={title} description={description} />
				<ul class="post-list">
					{entries
						.slice((page - 1) * pageSize, page * pageSize)
						.map((entry) => (
							<PostCard
								key={entry.slug}
								href={`/${lyrics ? "lyrics" : "posts"}/${entry.slug}/`}
								title={entry.title}
								description={lyrics ? entry.author : entry.description}
								published={entry.pubDatetime}
								modified={entry.modDatetime}
							/>
						))}
				</ul>
				{count > 1 && (
					<nav class="pagination" aria-label="페이지 탐색">
						{page > 1 && (
							<a href={href(page - 1)} rel="prev">
								<Icon svg={previousSvg} /> 이전
							</a>
						)}
						{Array.from({ length: count }, (_, index) => index + 1).map(
							(number) => (
								<a
									key={number}
									href={href(number)}
									aria-label={`${number}페이지`}
									aria-current={number === page ? "page" : undefined}
								>
									{number}
								</a>
							),
						)}
						{page < count && (
							<a href={href(page + 1)} rel="next">
								다음 <Icon svg={nextSvg} />
							</a>
						)}
					</nav>
				)}
			</main>
		);
	},
);
