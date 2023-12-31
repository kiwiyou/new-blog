import { GET as rss } from './rss.xml';

export const prerender = false;

export async function GET() {
  const xml = await rss().then((r) => r.text());
  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
    },
  });
}
