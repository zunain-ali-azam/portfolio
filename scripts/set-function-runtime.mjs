// @astrojs/vercel 7 (Astro 4) only knows Node 18 and 20, and falls back to nodejs18.x, which Vercel
// no longer accepts. Run the functions on the Node version that built them, which Vercel supports.
// Remove this once the site is on an adapter that knows current Node versions.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const FUNCTIONS = '.vercel/output/functions';
const runtime = `nodejs${process.versions.node.split('.')[0]}.x`;

for (const dir of existsSync(FUNCTIONS) ? readdirSync(FUNCTIONS) : []) {
  const file = join(FUNCTIONS, dir, '.vc-config.json');
  if (!existsSync(file)) continue;
  const config = JSON.parse(readFileSync(file, 'utf8'));
  if (config.runtime === runtime) continue;
  console.log(`${dir}: runtime ${config.runtime} → ${runtime}`);
  writeFileSync(file, JSON.stringify({ ...config, runtime }, null, '\t'));
}
