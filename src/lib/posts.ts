import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

// A post goes live once it isn't a draft and its date has passed. A future date schedules it:
// production builds leave it out until the first build after that moment (the daily
// "Publish scheduled posts" workflow triggers one), while `astro dev` shows it so it can be previewed.
export function isPublished(post: Post, now = Date.now()): boolean {
  if (post.data.draft) return false;
  return import.meta.env.DEV || post.data.date.getTime() <= now;
}

// Published posts, newest first
export async function getPublishedPosts(): Promise<Post[]> {
  const now = Date.now();
  return (await getCollection('blog', (post) => isPublished(post, now))).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}
