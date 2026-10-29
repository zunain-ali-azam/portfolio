import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Read by the GitHub profile README's blog-post workflow, and by feed readers
export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  const items = posts
    .map((post) => {
      const link = new URL(`blog/${post.slug}`, site).href;
      return `    <item>
      <title>${escape(post.data.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description>${escape(post.data.description)}</description>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Zunain Ali Azam: Writing</title>
    <link>${new URL('blog', site).href}</link>
    <description>Notes from shipping production software: frontend architecture, framework migrations, testing and performance.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
