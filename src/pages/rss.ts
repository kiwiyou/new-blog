import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import getSortedPosts from '@utils/getSortedPosts';
import { SITE } from '@config';

export const prerender = false;

export async function GET() {
  const posts = await getCollection('blog');
  const sortedPosts = getSortedPosts(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    customData: `<language>ko</language><generator>astro</generator><ttl>100</ttl>`,
    items: sortedPosts.map(({ data, slug }) => ({
      link: `posts/${slug}`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.pubDatetime),
    })),
  }).then((r) => {
    r.headers.set('Content-Type', 'text/xml; charset=utf-8');
    return r;
  });
}
