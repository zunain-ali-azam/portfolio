import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    category: z.array(z.string()),
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    yearCompleted: z.union([z.number(), z.string()]),
    highlights: z.array(z.string()).default([]),
    employer: z.string().optional(),
    role: z.string().optional(),
    // One line on my own part, for projects built with a team at an employer
    myPart: z.string().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

export const collections = { projects, blog };
