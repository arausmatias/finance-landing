import { getCollection } from 'astro:content';
import { sortPosts, SITE, absoluteUrl } from '../site';

/** llms.txt (https://llmstxt.org): a plain-text map of the site for language models. */
export async function GET() {
  const posts = sortPosts(await getCollection('blog'));
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.name} es una app para iPhone y Android que todavía no está publicada en las tiendas. Funciones: carga de gastos, ingresos y transferencias con un teclado numérico propio; cuentas en distintas monedas (efectivo, banco, tarjeta, billetera virtual); categorías y etiquetas; grupos para dividir gastos en partes iguales, por partes, por porcentaje o por importe, sin que los demás necesiten la app; gastos recurrentes compartidos con código de invitación; rachas, meta diaria y niveles. Los datos personales quedan en el teléfono; solo los gastos recurrentes compartidos se sincronizan.`,
    '',
    '## Páginas',
    '',
    `- [Inicio](${absoluteUrl()}): qué hace la app, con ejemplos animados.`,
    `- [Blog: ${SITE.blogName}](${absoluteUrl('blog/')}): ${SITE.blogDescription}`,
    '',
    '## Artículos',
    '',
    ...posts.map((p) => `- [${p.data.title}](${absoluteUrl(`blog/${p.id}/`)}): ${p.data.description}`),
    '',
    '## Opcional',
    '',
    `- [Texto completo de los artículos](${absoluteUrl('llms-full.txt')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
