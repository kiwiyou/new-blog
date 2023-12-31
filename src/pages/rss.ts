import { GET as rss } from './rss.xml';
export async function GET() {
  const response = await rss();
  response.headers.set('content-type', 'text/xml; charset=utf-8');
  return response;
}
