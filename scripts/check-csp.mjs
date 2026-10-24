// Fails the build when an inline <script> in the built pages isn't allowed by the CSP in vercel.json.
// The CSP allows inline scripts by hash, so editing one changes its hash and the browser would block it.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = '.vercel/output/static';
const csp = JSON.parse(readFileSync('vercel.json', 'utf8'))
  .headers.flatMap((rule) => rule.headers)
  .find((h) => h.key === 'Content-Security-Policy').value;

const htmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [],
  );

const missing = new Map();
for (const file of htmlFiles(OUT)) {
  for (const [, attrs, body] of readFileSync(file, 'utf8').matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    // External scripts and JSON-LD data blocks aren't covered by script hashes
    if (/\ssrc=/.test(attrs) || /application\/ld\+json/.test(attrs)) continue;
    const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
    if (!csp.includes(hash)) missing.set(hash, file);
  }
}

if (missing.size) {
  console.error('CSP check failed: these inline scripts are not allowed by vercel.json. Replace the old hashes with:');
  for (const [hash, file] of missing) console.error(`  ${hash}  (first seen in ${file})`);
  process.exit(1);
}
console.log('CSP check passed: every inline script is allowed.');
