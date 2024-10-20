import type { APIRoute } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'
import { generateOgImageForLyrics } from '@utils/generateOgImages'
import { slugifyStr } from '@utils/slugify'

export async function getStaticPaths() {
  const posts = await getCollection('lyrics').then((p) =>
    p.filter(({ data }) => !data.ogImage),
  )

  return posts.map((post) => ({
    params: { slug: slugifyStr(post.data.title) },
    props: post,
  }))
}

export const GET: APIRoute = async ({ props }) =>
  new Response(
    await generateOgImageForLyrics(props as CollectionEntry<'lyrics'>),
    {
      headers: { 'Content-Type': 'image/png' },
    },
  )
