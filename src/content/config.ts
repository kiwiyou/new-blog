import { SITE } from '@config'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(['others']),
      ogImage: image()
        .refine((img) => img.width >= 1200 && img.height >= 630, {
          message: 'OpenGraph image must be at least 1200 X 630 pixels!',
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      comment: z.boolean().optional(),
      math: z.boolean().optional(),
    }),
})

const lyrics = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      author: z.string(),
      pubDatetime: z.date(),
      modDatetime: z.date().optional(),
      title: z.string(),
      ogImage: image()
        .refine((img) => img.width >= 1200 && img.height >= 630, {
          message: 'OpenGraph image must be at least 1200 X 630 pixels!',
        })
        .or(z.string())
        .optional(),
      comment: z.boolean().optional(),
      youtube: z.string().optional(),
      lang: z
        .enum(['ko', 'ja', 'yomigana', 'ko-transliteration'])
        .array()
        .optional(),
    }),
})

export const collections = { blog, lyrics }
