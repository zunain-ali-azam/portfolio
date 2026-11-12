import { defineCollection, z } from 'astro:content';
import { TOPICS } from './topics';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Search result title and snippet; the card description runs longer than search engines show
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    tech: z.array(z.string()),
    category: z.array(z.string()),
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    image: z.string().optional(),
    // JPEG for link previews (social sites don't all accept WebP). Blog covers are 16:9 at
    // 2800x1576 so the same file works as a Medium cover
    ogImage: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    yearCompleted: z.union([z.number(), z.string()]),
    highlights: z.array(z.string()).default([]),
    employer: z.string().optional(),
    role: z.string().optional(),
    // One line on my own part, for projects built with a team at an employer
    myPart: z.string().optional(),
    // Built with a team outside an employer, where I was involved from the first idea to launch
    team: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    // Fine-grained keywords for search engines, shown on the post
    tags: z.array(z.string()).default([]),
    // Broad groups for the filter on /blog; a post can sit in more than one
    topics: z.array(z.enum(TOPICS)).default([]),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    // Slugs of posts to suggest at the end of this one, such as the other half of a pair
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, blog };
