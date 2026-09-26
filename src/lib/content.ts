export type Entry = {
  slug: string
  title: string
  pubDatetime: string
  modDatetime?: string
  description?: string
  author?: string
  featured?: boolean
  draft?: boolean
  tags?: string[]
  lang?: string[]
  youtube?: string
  comment?: boolean
}

const fromRoutes = (modules: Record<string, unknown>): Entry[] =>
  Object.entries(modules).map(([path, value]) => ({
    ...(value as Omit<Entry, 'slug'>),
    slug: path.split('/').at(-2)!,
  })).filter((entry) => !entry.draft).sort((a, b) =>
    new Date(b.modDatetime ?? b.pubDatetime).getTime() - new Date(a.modDatetime ?? a.pubDatetime).getTime(),
  )

export const posts = fromRoutes(import.meta.glob('../routes/posts/*/index.{md,mdx}', { eager: true, import: 'frontmatter' }))
export const lyrics = fromRoutes(import.meta.glob('../routes/lyrics/[a-z]*/index.tsx', { eager: true, import: 'metadata' }))

export const slugifyTag = (tag: string) => tag.toLowerCase().replace(/\s+/g, '-')
