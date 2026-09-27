import { qwikVite } from "@qwik.dev/core/optimizer";
import { qwikRouter } from "@qwik.dev/router/vite";
import rehypeShiki from "@shikijs/rehype";
import { defineConfig } from "vite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
	plugins: [
		qwikRouter({
			mdxPlugins: {
				remarkGfm: true,
				rehypeAutolinkHeadings: true,
				rehypeSyntaxHighlight: false,
			},
			mdx: {
				remarkPlugins: [remarkMath],
				rehypePlugins: [
					rehypeKatex,
					[
						rehypeShiki,
						{
							themes: { dark: "ayu-dark", light: "ayu-light" },
							defaultColor: false,
						},
					],
				],
			},
		}),
		qwikVite(),
	],
});
