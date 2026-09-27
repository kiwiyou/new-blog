# kiwifarm

```sh
pnpm install
pnpm dev
pnpm fmt.check
pnpm build
pnpm serve # local Cloudflare Worker
```

The production build renders pages and OG images in Cloudflare Workers; `pnpm deploy` publishes it. The OG font is served by [GitHub Pages](https://kiwiyou.github.io/new-blog/fonts/NotoSansCJKkr-Regular.otf) from the `og-font` branch.
