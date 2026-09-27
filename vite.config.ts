import { qwikVite } from "@qwik.dev/core/optimizer";
import { qwikRouter } from "@qwik.dev/router/vite";
import rehypeShiki from "@shikijs/rehype";
import { defineConfig } from "vite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
	plugins: [
		{
			name: "wasm-modules-for-node-dev",
			apply: "serve",
			enforce: "pre",
			load(id, options) {
				if (
					options?.ssr &&
					(id.endsWith("@resvg/resvg-wasm/index_bg.wasm") ||
						id.endsWith("satori/yoga.wasm"))
				) {
					return `import { readFileSync } from "node:fs"; export default new WebAssembly.Module(readFileSync(${JSON.stringify(id)}));`;
				}
			},
		},
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
