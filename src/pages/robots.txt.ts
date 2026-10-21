import type { APIRoute } from 'astro';

// Generated from `site` in astro.config.mjs, so a domain change is a one-line edit there
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
