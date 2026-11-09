// Prints the blog posts whose publish time fell within the last WINDOW_HOURS (default 25), and
// exits 0 if there are any, 1 if not. The "Publish scheduled posts" workflow runs this once a day
// and only triggers a Vercel rebuild when something is due; the build itself leaves out posts
// dated in the future (src/lib/posts.ts).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'src/content/blog';
const windowMs = Number(process.env.WINDOW_HOURS ?? 25) * 3600_000;
const now = Date.now();

const due = readdirSync(dir)
  .filter((f) => /\.mdx?$/.test(f))
  .flatMap((file) => {
    const frontmatter = readFileSync(join(dir, file), 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    const date = frontmatter.match(/^date:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1];
    const draft = /^draft:\s*true\b/m.test(frontmatter);
    const at = date ? new Date(date).getTime() : NaN;
    return !draft && at <= now && at > now - windowMs ? [`${file} (${new Date(at).toISOString()})`] : [];
  });

if (due.length) {
  console.log(`Due for publishing:\n  ${due.join('\n  ')}`);
} else {
  console.log('Nothing due.');
}
process.exit(due.length ? 0 : 1);
