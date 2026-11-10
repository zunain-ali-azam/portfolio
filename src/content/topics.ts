// The groups posts are filed under on /blog, in the order the filter shows them.
// Infrastructure: hosting, cloud, deployments. Guides: step-by-step setup.
// Errors & fixes: one error and how it was solved. Startups: decisions for an early-stage product.
export const TOPICS = ['Infrastructure', 'Guides', 'Errors & fixes', 'Startups'] as const;
export type Topic = (typeof TOPICS)[number];
