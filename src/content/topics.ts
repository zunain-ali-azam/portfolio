// The groups posts are filed under on /blog, in the order the filter shows them.
// Infrastructure: hosting, cloud, deployments. Guides: step-by-step setup.
// Errors & fixes: one error and how it was solved. Startups: decisions for an early-stage product.
// AI & automation: tools built on LLMs and pipelines that take manual work off people.
export const TOPICS = ['Infrastructure', 'Guides', 'Errors & fixes', 'Startups', 'AI & automation'] as const;
export type Topic = (typeof TOPICS)[number];
