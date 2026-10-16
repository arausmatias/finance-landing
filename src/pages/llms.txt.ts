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
    `${SITE.name} es una app para iPhone y Android que todavía no está publicada en las tiendas. Funciones: carga de gastos, ingresos y transferencias con un teclado numérico propio; cuentas en 154 monedas (efectivo, banco, billetera virtual); tarjetas de crédito con resumen, cuotas y aviso antes del vencimiento; búsqueda y filtros de movimientos; categorías y etiquetas; reportes del mes; grupos para dividir gastos en partes iguales, por partes, por porcentaje o por importe, sin que los demás necesiten la app; gastos fijos compartidos con código de invitación; rachas, meta diaria y niveles. Disponible en español, inglés, portugués, francés, alemán e italiano. El total en una moneda y la proyección son parte de Pro. Los datos personales quedan en el teléfono; solo se sincroniza lo que compartís con otros.`,
    '',
    '## Páginas',
    '',
    `- [Inicio](${absoluteUrl()}): qué hace la app, con ejemplos animados.`,
    `- [Novedades](${absoluteUrl('changelog/')}): todo lo que entró a la app, día por día.`,
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
