import { cloudflarePagesAdapter as cloudflareWorkersAdapter } from "@qwik.dev/router/adapters/cloudflare-pages/vite";
import { extendConfig } from "@qwik.dev/router/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
	return {
		build: {
			ssr: true,
			rolldownOptions: {
				external: ["@resvg/resvg-wasm/index_bg.wasm", "satori/yoga.wasm"],
				input: ["src/entry.cloudflare-pages.tsx"],
			},
		},
		plugins: [cloudflareWorkersAdapter({ functionRoutes: false, ssg: null })],
	};
});
