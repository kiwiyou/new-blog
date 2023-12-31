import { SITE } from '@config';

export const prerender = false;

export async function GET() {
  return fetch(`${SITE.website}/rss.xml`).then((r) => {
    return new Response(r.body, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Content-Language': 'en',
      },
    });
  });
}
