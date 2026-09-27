import { getCollection } from 'astro:content';
import { sortPosts, SITE, absoluteUrl } from '../site';

/** Full article text as Markdown, without MDX imports or component tags. */
function toPlainMarkdown(body: string): string {
  return body
    .replace(/^import .*$/gm, '')
    .replace(/<([A-Z][A-Za-z]*)[^>]*\/>/g, '')
    .replace(/<\/?[A-Za-z][^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function GET() {
  const posts = sortPosts(await getCollection('blog'));
  const parts = posts.map((p) =>
    [
      `# ${p.data.title}`,
      '',
      `URL: ${absoluteUrl(`blog/${p.id}/`)}`,
      `Publicado: ${p.data.pubDate.toISOString().slice(0, 10)}`,
      '',
      '## En resumen',
      '',
      ...p.data.summary.map((s) => `- ${s}`),
      '',
      toPlainMarkdown(p.body ?? ''),
      '',
      '## Preguntas frecuentes',
      '',
      ...p.data.faq.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
    ].join('\n'),
  );
  const text = [`# ${SITE.name}: ${SITE.blogName}`, '', `> ${SITE.description}`, '', ...parts].join('\n\n');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
