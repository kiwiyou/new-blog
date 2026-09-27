import { initWasm, Resvg } from "@resvg/resvg-wasm";
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";
import satori, { init } from "satori/standalone";
import yogaWasm from "satori/yoga.wasm";

const wasmReady = initWasm(resvgWasm);
const satoriReady = init(yogaWasm);
let fontPromise: Promise<[ArrayBuffer, ArrayBuffer]> | undefined;
const loadFont = async (font: string) => {
	const response = await fetch(
		`https://kiwiyou.github.io/new-blog/fonts/${font}`,
	);
	if (!response.ok)
		throw new Error(`OG font fetch failed: ${font} ${response.status}`);
	return response.arrayBuffer();
};
const loadFonts = () =>
	(fontPromise ??= Promise.all([
		loadFont("Pretendard-Regular.otf"),
		loadFont("NotoSansCJKkr-Regular.otf"),
	]).catch((error) => {
		fontPromise = undefined;
		throw error;
	}));

export async function ogImage(title: string, subtitle = "") {
	await satoriReady;
	const [pretendard, notoSans] = await loadFonts();
	const node = {
		type: "div",
		props: {
			style: {
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: "72px 84px",
				background: "#302e2a",
				color: "#f1eff0",
				fontFamily: "Pretendard, Noto Sans CJK",
				borderTop: "20px solid #93de58",
			},
			children: [
				{
					type: "div",
					props: {
						style: { fontSize: 32, color: "#93de58" },
						children: "키위밭  /  kiwifarm",
					},
				},
				{
					type: "div",
					props: {
						style: { display: "flex", flexDirection: "column", gap: 24 },
						children: [
							{
								type: "div",
								props: {
									style: {
										fontSize: title.length > 28 ? 58 : 76,
										fontWeight: 400,
										lineHeight: 1.25,
										wordBreak: "keep-all",
									},
									children: title,
								},
							},
							subtitle
								? {
										type: "div",
										props: {
											style: { fontSize: 34, color: "#c7c5c4" },
											children: subtitle,
										},
									}
								: null,
						].filter(Boolean),
					},
				},
				{
					type: "div",
					props: {
						style: { fontSize: 26, color: "#93de58" },
						children: "blog.kiwiyou.dev",
					},
				},
			],
		},
	};
	const svg = await satori(node as Parameters<typeof satori>[0], {
		width: 1200,
		height: 630,
		fonts: [
			{ name: "Pretendard", data: pretendard, weight: 400, style: "normal" },
			{ name: "Noto Sans CJK", data: notoSans, weight: 400, style: "normal" },
		],
	});
	await wasmReady;
	return new Resvg(svg).render().asPng();
}
