import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortPosts, SITE, absoluteUrl, withBase } from '../site';

export async function GET() {
  const posts = sortPosts(await getCollection('blog'));
  return rss({
    title: `${SITE.blogName} · ${SITE.name}`,
    description: SITE.blogDescription,
    site: absoluteUrl('blog/'),
    customData: `<language>${SITE.locale}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: withBase(`blog/${post.id}/`),
      categories: post.data.keywords,
    })),
  });
}
