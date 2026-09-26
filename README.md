# kiwifarm

A Korean blog and lyric translations built with Qwik v2. Articles live as Markdown or MDX routes in `src/routes/posts` and `src/routes/lyrics`.

```sh
mise install
mise exec -- npm install
mise exec -- npm run dev
mise exec -- npm run check
mise exec -- npm run build
```

The static site is written to `dist/`. The production origin is set in `vite.ssg.config.ts`.
