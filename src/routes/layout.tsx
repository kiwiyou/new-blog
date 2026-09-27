import { component$, Slot, useSignal, useVisibleTask$ } from "@qwik.dev/core";
import { useDocumentHead, useLocation } from "@qwik.dev/router";
import Site, { DateStamp, SiteFooter, TagLink } from "../components/Site";
import Icon from "../components/Icon";
import backSvg from "lucide-static/icons/arrow-left.svg?raw";
import upSvg from "lucide-static/icons/arrow-up.svg?raw";

type ArticleFrontmatter = {
	title?: string;
	author?: string;
	pubDatetime?: string;
	modDatetime?: string;
	tags?: string[];
	lang?: string[];
	youtube?: string;
	comment?: boolean;
};

const Giscus = component$(() => {
	const container = useSignal<HTMLDivElement>();
	useVisibleTask$(
		() => {
			const script = document.createElement("script");
			Object.assign(script.dataset, {
				repo: "kiwiyou/new-blog",
				repoId: "R_kgDOGoQLHw",
				category: "댓글",
				categoryId: "DIC_kwDOGoQLH84CcGYV",
				mapping: "og:title",
				strict: "1",
				reactionsEnabled: "1",
				emitMetadata: "0",
				inputPosition: "top",
				theme: document.documentElement.dataset.theme || "dark",
				lang: "ko",
			});
			script.src = "https://giscus.app/client.js";
			script.crossOrigin = "anonymous";
			script.async = true;
			container.value?.append(script);
		},
		{ strategy: "document-ready" },
	);
	return <div class="comments" ref={container} />;
});

export default component$(() => {
	const { url } = useLocation();
	const parts = url.pathname.split("/").filter(Boolean);
	const isPost =
		parts[0] === "posts" && parts.length === 2 && !/^\d+$/.test(parts[1]);
	const isLyric =
		parts[0] === "lyrics" && parts.length === 2 && !/^\d+$/.test(parts[1]);
	const head = useDocumentHead();
	const meta = (head.frontmatter || {}) as ArticleFrontmatter;
	const author =
		meta.author || head.meta?.find((item) => item.name === "author")?.content;
	const title = isLyric && author ? `${author} - ${head.title}` : head.title;

	return (
		<>
			<Site />
			{isPost || isLyric ? (
				<>
					<div class="back-link container">
						<a href={isLyric ? "/lyrics/" : "/posts/"}>
							<Icon svg={backSvg} /> 뒤로 가기
						</a>
					</div>
					<main id="main-content" class="article-main">
						<h1 class="article-title">{title}</h1>
						{meta.pubDatetime && (
							<DateStamp
								published={meta.pubDatetime}
								modified={meta.modDatetime}
							/>
						)}
						<article
							id="article"
							class={isLyric ? "article-body lyric-body" : "article-body prose"}
						>
							{isLyric && (
								<>
									{meta.lang?.length ? (
										<div class="lyric-controls" aria-label="가사 언어 표시">
											{(["ja", "yomigana", "ko-transliteration", "ko"] as const)
												.filter((value) => meta.lang?.includes(value))
												.map((value) => (
													<label key={value}>
														<input type="checkbox" checked name={value} />
														<span>
															{
																{
																	ja: "あ",
																	yomigana: "読み",
																	"ko-transliteration": "발음",
																	ko: "가",
																}[value]
															}
														</span>
													</label>
												))}
										</div>
									) : null}
									{meta.youtube && (
										<p class="lyric-video">
											<a
												href={meta.youtube}
												target="_blank"
												rel="noopener noreferrer"
											>
												youtube
											</a>
										</p>
									)}
								</>
							)}
							<div
								id={isLyric ? "lyrics" : undefined}
								class={isLyric ? "lyric-lines prose" : undefined}
							>
								<Slot />
							</div>
						</article>
						{isPost && meta.tags?.length ? (
							<ul class="tag-list article-tags">
								{meta.tags.map((tag) => (
									<TagLink key={tag} tag={tag} />
								))}
							</ul>
						) : null}
						<div class="back-to-top">
							<a href="#main-content">
								맨 위로 <Icon svg={upSvg} />
							</a>
						</div>
						{meta.comment && <Giscus key={url.pathname} />}
					</main>
				</>
			) : (
				<Slot />
			)}
			<SiteFooter />
		</>
	);
});
