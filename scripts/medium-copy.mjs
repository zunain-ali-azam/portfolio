// Makes a copy of each blog post that pastes cleanly into Medium's editor, in medium/<slug>.html.
// Medium's URL import drops tables and code blocks, so instead: tables become lists, code blocks become
// plain <pre>, links become absolute, images become markers saying which file to upload, and links to
// posts that aren't out yet on this post's publish date become plain text with "(coming <date>)".
//
// Usage: run `pnpm dev` (it shows scheduled posts too), then in another terminal
//   pnpm medium-copy                 every post
//   pnpm medium-copy <slug> [...]    only these
// Open the file in a browser, click "Copy article" and paste into a new Medium story.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseHTML } from 'linkedom';

const SITE = 'https://zunainaliazam.vercel.app';
const DEV = process.env.DEV_URL ?? 'http://localhost:4321';
const BLOG = 'src/content/blog';
const OUT = 'medium';

const posts = Object.fromEntries(
  readdirSync(BLOG)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const fm = readFileSync(join(BLOG, f), 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      const date = fm.match(/^date:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1];
      return [f.replace(/\.mdx?$/, ''), { date: new Date(date), draft: /^draft:\s*true\b/m.test(fm) }];
    })
);
const shortDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Karachi' });
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const slugs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(posts).filter((s) => !posts[s].draft);
mkdirSync(OUT, { recursive: true });

for (const slug of slugs) {
  if (!posts[slug]) throw new Error(`No post "${slug}" in ${BLOG}`);
  const res = await fetch(`${DEV}/blog/${slug}`).catch(() => null);
  if (!res?.ok) throw new Error(`Couldn't load ${DEV}/blog/${slug}. Is \`pnpm dev\` running?`);
  const { document } = parseHTML(await res.text());

  const h1 = document.querySelector('article h1');
  const title = h1.textContent.trim();
  const subtitle = h1.nextElementSibling.textContent.trim();
  const body = document.querySelector('#article-body');
  body.querySelectorAll('aside, script, style').forEach((e) => e.remove());

  // Code blocks: plain text only
  body.querySelectorAll('pre').forEach((pre) => {
    const n = document.createElement('pre');
    n.textContent = pre.textContent.replace(/\n$/, '');
    pre.replaceWith(n);
  });

  // Tables: one list item per row, labelled with the column headings
  body.querySelectorAll('table').forEach((t) => {
    const heads = [...t.querySelectorAll('thead th')].map((th) => th.textContent.trim());
    const items = [...t.querySelectorAll('tbody tr')].map((tr) => {
      const cells = [...tr.children].map((c) => c.innerHTML);
      if (cells.length === 2) return `<li><strong>${cells[0]}</strong>: ${cells[1]}</li>`;
      const rest = cells.slice(1).map((c, i) => `<br>${heads[i + 1] ? heads[i + 1] + ': ' : ''}${c}`);
      return `<li><strong>${cells[0]}</strong>${rest.join('')}</li>`;
    });
    const ul = document.createElement('ul');
    ul.innerHTML = items.join('');
    t.replaceWith(ul);
  });

  // Checklists: a box character instead of the checkbox
  body.querySelectorAll('input[type=checkbox]').forEach((i) => i.replaceWith(document.createTextNode('☐ ')));

  // Images: a marker to upload the file in Medium
  body.querySelectorAll('img').forEach((img) => {
    const url = new URL(img.getAttribute('src'), SITE).toString();
    const m = document.createElement('p');
    m.setAttribute('class', 'marker');
    m.innerHTML = `[ Upload image here: <a href="${url}">${url.split('/').pop()}</a>. Use this as its alt text: "${escape(img.getAttribute('alt') ?? '')}" ]`;
    const p = img.closest('p');
    (p && p.textContent.trim() === '' ? p : img).replaceWith(m);
  });

  // Links: absolute. A link to a post that isn't out yet on this post's date becomes text plus a note
  const later = new Map();
  body.querySelectorAll('a[href]').forEach((a) => {
    const href = new URL(a.getAttribute('href'), `${SITE}/blog/${slug}`);
    const target = href.origin === SITE ? href.pathname.match(/^\/blog\/([^/]+)/)?.[1] : undefined;
    if (target && posts[target] && posts[target].date > posts[slug].date) {
      const d = shortDate(posts[target].date);
      later.set(href.toString(), d);
      a.replaceWith(document.createTextNode(`${a.textContent} (coming ${d})`));
      return;
    }
    a.setAttribute('href', href.toString());
  });

  // "(coming …)" notes PostLink printed for posts that aren't live: drop them, the links above handle it
  body.querySelectorAll('span').forEach((s) => {
    if (/^\s*\(coming /.test(s.textContent)) s.remove();
  });

  // Strip classes, styles and ids
  body.querySelectorAll('*').forEach((e) => {
    if (e.getAttribute('class') !== 'marker') e.removeAttribute('class');
    ['style', 'id', 'tabindex', 'data-language'].forEach((a) => e.removeAttribute(a));
  });

  const url = `${SITE}/blog/${slug}`;
  const laterSteps = [...later].map(
    ([u, d]) => `<li>On ${d}, when it's live, find each “(coming ${d})” and turn the text before it into a link to <a href="${u}">${u}</a>.</li>`
  );
  const page = `<!doctype html><html><head><meta charset="utf-8"><title>Medium copy: ${escape(title)}</title><style>
body { font: 18px/1.6 Georgia, serif; max-width: 720px; margin: 0 auto; padding: 24px 16px 80px; color: #222; }
.help { font: 15px/1.5 system-ui, sans-serif; background: #fff8e1; border: 1px solid #f0d98a; border-radius: 10px; padding: 14px 18px; margin-bottom: 28px; }
.help ol { margin: 8px 0 0; padding-left: 20px; }
.help button { margin-top: 10px; font: 600 15px system-ui; padding: 8px 14px; border-radius: 8px; border: 0; background: #1a8917; color: #fff; cursor: pointer; }
pre { background: #f4f4f4; padding: 12px; overflow-x: auto; font-size: 14px; }
code { background: #f4f4f4; padding: 0 3px; font-size: 15px; }
.marker { background: #e8f0fe; border: 1px dashed #4a72d9; padding: 10px; font: 14px system-ui; }
</style></head><body>
<div class="help">
  <b>Medium copy of “${escape(title)}”</b> · goes live on the site ${shortDate(posts[slug].date)}
  <ol>
    <li>In Medium, start a new story. Type the title: <b>${escape(title)}</b></li>
    <li>On the next line, type the subtitle: ${escape(subtitle)}</li>
    <li>Click <b>Copy article</b>, then paste under the subtitle.</li>
    <li>Upload each image where a blue box is, then delete the box. Put the cover (<a href="${SITE}/og/blog/${slug}.jpg">${slug}.jpg</a>) at the very top, and pick it as the featured image when you publish.</li>
    <li>Story settings → Advanced settings → set the canonical link to <b>${url}</b>.</li>
    ${laterSteps.join('\n    ')}
  </ol>
  <button id="copy">Copy article</button> <span id="done"></span>
</div>
<article id="article">
${body.innerHTML}
<p><em>Originally published on <a href="${url}">zunainaliazam.vercel.app</a>.</em></p>
</article>
<script>
document.getElementById('copy').onclick = () => {
  const r = document.createRange(); r.selectNodeContents(document.getElementById('article'));
  const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  document.execCommand('copy'); s.removeAllRanges();
  document.getElementById('done').textContent = 'Copied. Paste it into Medium.';
};
</script>
</body></html>
`;
  writeFileSync(join(OUT, `${slug}.html`), page);
  console.log(`${OUT}/${slug}.html${later.size ? ` (links to ${later.size} later post${later.size > 1 ? 's' : ''})` : ''}`);
}
