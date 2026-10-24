# Zunain Ali Azam — Portfolio

Personal portfolio and blog built with [Astro](https://astro.build), Tailwind CSS, and MDX. Live at **[zunainaliazam.vercel.app](https://zunainaliazam.vercel.app)**.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Astro 4 |
| Styling | Tailwind CSS 3 + `@tailwindcss/typography` |
| Content | MDX via `@astrojs/mdx` |
| Hosting | Vercel (`@astrojs/vercel`, hybrid output) |
| Contact form | Vercel function + Resend + Cloudflare Turnstile |
| Language | TypeScript |
| Package Manager | pnpm |

---

## Project Structure

```
src/
├── content/
│   ├── blog/          # MDX blog posts
│   ├── projects/      # Markdown project entries
│   └── config.ts      # Content collection schemas
├── layouts/
│   ├── BaseLayout.astro   # Root layout — SEO, fonts, theme
│   └── BlogLayout.astro   # Article layout extends BaseLayout
├── pages/
│   ├── index.astro        # Homepage
│   ├── about.astro
│   ├── experience.astro
│   ├── resume.astro
│   ├── contact.astro      # Contact form (enhanced by its own script)
│   ├── api/contact.ts     # Form endpoint, the only on-demand route
│   ├── sent.astro         # No-JS confirmation
│   ├── not-sent.astro     # No-JS failure
│   ├── 404.astro
│   ├── blog/[slug].astro
│   └── projects/[slug].astro
├── components/        # Reusable Astro components
├── lib/
│   └── contact.ts     # Contact validation shared by form and endpoint
└── styles/
    └── global.css
public/
├── og-image.png       # Default Open Graph image
└── favicon.svg
```

---

## Getting Started

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # Production build → dist/
pnpm preview    # Preview production build locally
```

---

## Adding Content

**New blog post** — create `src/content/blog/my-post.mdx`:

```mdx
---
title: "Post Title"
description: "One-line summary for SEO and card previews."
date: 2026-05-10
tags: ["astro", "typescript"]
image: "/images/my-post.png"   # optional OG image override
draft: false
---

Post body here...
```

**New project** — create `src/content/projects/my-project.md`:

```md
---
title: "Project Name"
description: "What it does."
tech: ["React", "TypeScript"]
category: "Web App"
github: "https://github.com/..."
live: "https://..."
image: "/images/my-project.png"
featured: true
order: 1
yearCompleted: 2026
highlights: ["Key achievement", "Another one"]
---

Project details here...
```

---

## SEO

### How it works end-to-end

Every page on this site goes through `BaseLayout.astro`, which injects all SEO metadata into `<head>` automatically. You never write meta tags by hand in individual pages — you just pass `title`, `description`, and optionally `image` as props.

```astro
<!-- Any page: -->
<BaseLayout
  title="Experience"
  description="My work history as a Software Engineer."
>
  <!-- page content -->
</BaseLayout>
```

That single prop-pass produces all of the following in `<head>`:

```html
<title>Experience | Zunain Ali Azam</title>
<meta name="description" content="My work history as a Software Engineer." />
<link rel="canonical" href="https://muhammadamas.dev/experience" />

<meta property="og:type" content="website" />
<meta property="og:url" content="https://muhammadamas.dev/experience" />
<meta property="og:title" content="Experience | Zunain Ali Azam" />
<meta property="og:description" content="My work history as a Software Engineer." />
<meta property="og:image" content="https://muhammadamas.dev/og-image.png" />
<meta property="og:site_name" content="Zunain Ali Azam" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Experience | Zunain Ali Azam" />
<meta name="twitter:description" content="My work history as a Software Engineer." />
<meta name="twitter:image" content="https://zunainaliazam.vercel.app/og-image.png" />
```

### SEO layer by layer

**1. Title tag**
The title is constructed in `BaseLayout.astro`:
- Homepage (`title === 'Zunain Ali Azam'`) → `Zunain Ali Azam`
- All other pages → `{Page Title} | Zunain Ali Azam`

This ensures every page has a unique, descriptive title with consistent branding.

**2. Meta description**
Each page passes its own `description` prop. There is a default fallback (`"Zunain Ali Azam — Software Engineer specializing in React, Angular, Next.js, and TypeScript."`) for pages that omit it, but every meaningful page should supply its own.

**3. Canonical URL**
Generated dynamically from `Astro.site` + the current page path:
```ts
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
// → https://zunainaliazam.vercel.app/experience
```
This prevents duplicate-content penalties if the site is ever mirrored or accessed via multiple domains.

**4. Open Graph (social sharing)**
Controls how links appear when shared on LinkedIn, Facebook, Slack, Discord, etc. The `image` prop (defaults to `/og-image.png`) is the preview thumbnail. Blog posts pass `type="article"` via `BlogLayout.astro` for richer article previews.

**5. Twitter Card**
Uses `summary_large_image` — produces a large image card when a URL is shared on X/Twitter. Same title, description, and image as Open Graph.

**6. Sitemap**
`@astrojs/sitemap` automatically generates `sitemap-index.xml` at build time, listing every public page and content collection entry. Astro discovers pages by crawling the `pages/` directory and content collections. `robots.txt` points crawlers to the sitemap:

```
User-agent: *
Allow: /
Sitemap: https://zunainaliazam.vercel.app/sitemap-index.xml
```

**7. Blog posts and projects (content collections)**
`BlogLayout.astro` extends `BaseLayout` and sets `type="article"`, which signals to social platforms and search engines that the page is a long-form article. The `date` frontmatter field is rendered as a `<time datetime="...">` element, which search engines use for freshness signals.

### What to keep in mind when adding pages

- Always pass a unique, specific `description` prop (120–160 characters) — this is what appears as the snippet in Google results.
- Provide a custom `image` prop for blog posts and project pages — custom OG images dramatically increase click-through rate from social shares.
- `sent`, `not-sent` and `404` are kept out of the sitemap (the filter is in `astro.config.mjs`) — no action needed.
- Page titles are automatically de-duped: only the homepage renders without the `| Zunain Ali Azam` suffix.

---

## Deployment

The site deploys to Vercel. Every page is prerendered at build time; the only code that runs on request is the contact endpoint, `src/pages/api/contact.ts`, which the Vercel adapter bundles as a function. Make sure the site is served at `https://zunainaliazam.vercel.app` so canonical URLs and the sitemap resolve correctly.

The site address lives in one place: `site` in `astro.config.mjs`. Canonical URLs, the sitemap, `robots.txt` and structured data all read from it, so moving to a new domain is a one-line change there (plus updating this README and the Turnstile widget's hostnames).

### Content Security Policy

`vercel.json` sends a Content-Security-Policy header on every response. It allows scripts from the site itself, Cal.com (the booking embed on `/contact`) and Cloudflare Turnstile, and allows the three inline scripts in `BaseLayout.astro` by their SHA-256 hashes. Editing one of those scripts changes its hash, so `pnpm build` runs `scripts/check-csp.mjs`, which fails the build and prints the new hash to paste into `vercel.json`. A new third-party script, font or embed needs its origin added to the matching directive.

### Contact form setup

The form posts to `/api/contact`, which validates the message (rules in `src/lib/contact.ts`, shared with the form's script), checks it with Cloudflare Turnstile and emails it through Resend with Reply-To set to the visitor. Set these in Vercel → Project → Settings → Environment Variables (see `.env.example`), then redeploy:

| Variable | Where it comes from |
|---|---|
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys. Sending from `onboarding@resend.dev` only delivers to the Resend account's own email, so `CONTACT_TO_EMAIL` must be that address (or verify a domain). |
| `CONTACT_TO_EMAIL` | The inbox that receives messages. |
| `TURNSTILE_SECRET_KEY`, `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare dashboard → Turnstile → add a widget for `zunainaliazam.vercel.app` and `localhost`. |

In `pnpm dev` without `RESEND_API_KEY`, messages are printed to the terminal instead of sent, and the Turnstile check is skipped when its keys are unset. Cloudflare's test keys (site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`) always pass. The spam check needs JavaScript, so visitors with it turned off are sent to `/not-sent`, which points them to email.
