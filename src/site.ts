/** Site-wide facts. */
export const SITE = {
  name: 'Loneto',
  origin: 'https://loneto.app',
  locale: 'es-AR',
  ogLocale: 'es_AR',
  tagline: 'Tu plata, anotada en segundos.',
  description:
    'App de finanzas personales para anotar ingresos y gastos en segundos, dividir cuentas con amigos y compartir gastos de todos los meses. Tus datos quedan en tu teléfono.',
  blogName: 'Cuentas claras',
  blogDescription:
    'Plata de todos los días: gastos hormiga, cuentas compartidas y gastos fijos, contados sin vueltas y con ejemplos.',
};

/** Prefixes a site path with the deploy base, e.g. "blog/" -> "/blog/". */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}

export function absoluteUrl(path = ''): string {
  return new URL(withBase(path), SITE.origin).href;
}

export function readingMinutes(text: string): number {
  const words = text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export const ORGANIZATION = {
  '@type': 'Organization',
  name: SITE.name,
  url: absoluteUrl(),
  logo: absoluteUrl('favicon.svg'),
};

type Sortable = { data: { pubDate: Date; order: number } };
/** Newest first; same-day posts by their `order`. */
export function sortPosts<T extends Sortable>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.data.order - b.data.order);
}
