import { copyFileSync, readdirSync } from 'node:fs'

for (const section of ['posts', 'lyrics']) {
  for (const slug of readdirSync(`dist/og/${section}`)) {
    copyFileSync(`dist/og/${section}/${slug}/image.png`, `dist/${section}/${slug}.png`)
  }
}
