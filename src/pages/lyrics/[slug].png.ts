import type { APIRoute } from 'astro'
import { getCollection, type CollectionEntry } from 'astro:content'
import { generateOgImageForLyrics } from '@utils/generateOgImages'

export async function getStaticPaths() {
  const posts = await getCollection('lyrics').then((p) =>
    p.filter(({ data }) => !data.ogImage),
  )

  return posts.map((post) => ({
    params: { slug: post.slug },
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
