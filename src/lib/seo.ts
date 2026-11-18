export type LyricSeoSource = {
	title?: string;
	author?: string;
	/** Alternate title forms: Korean, English, romanized. */
	keywords?: string[];
	/** Author, featured artists and their alternate names. */
	artists?: string[];
};

/** Original title without a trailing "(ft. ...)" credit. */
export const bareTitle = (title = "") => title.replace(/\s*\(.*\)\s*$/, "");

/**
 * Search metadata kept out of the visible page: title variants, artist
 * names and lyrics keywords go to JSON-LD `keywords`.
 */
export const lyricSeo = (meta: LyricSeoSource, url: string) => {
	const original = bareTitle(meta.title);
	const titles = [original, ...(meta.keywords ?? [])];
	const keywords = [
		...titles.flatMap((value) => [
			`${value} 가사`,
			`${value} 歌詞`,
			`${value} lyrics`,
		]),
		`${original} 가사 해석`,
		`${original} 가사 번역`,
		`${original} 한글 발음`,
		...(meta.artists ?? [meta.author ?? ""]),
	];
	return {
		jsonLd: {
			"@context": "https://schema.org",
			"@type": "MusicComposition",
			name: original,
			inLanguage: "ja",
			keywords: keywords.join(", "),
			url,
		},
	};
};
