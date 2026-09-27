import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /** Shorter headline for cards and breadcrumbs */
    shortTitle: z.string(),
    description: z.string().max(170),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Tie-breaker for posts published the same day (lower first) */
    order: z.number().default(0),
    keywords: z.array(z.string()),
    /** Key takeaways shown at the top of the article ("En resumen") */
    summary: z.array(z.string()).min(3),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(3),
    icon: z.string(),
    tone: z.enum(['green', 'blue', 'red', 'orange', 'yellow', 'purple', 'pink', 'teal']),
  }),
});

export const collections = { blog };
