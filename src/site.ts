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

export type Lang = 'es' | 'en';

/**
 * Legal facts shared by the legal pages in both languages. `null` renders a visible "pending"
 * marker, so a page never ships with made-up data. Fill these in before publishing to the stores.
 * docs/legal/README.md lists the infrastructure facts these texts depend on.
 */
export const LEGAL = {
  /** Owner of the app, exactly as listed in App Store Connect and Play Console. */
  ownerName: 'Matias Fernando Araus',
  ownerTaxId: '23-36074172-9',
  ownerAddress: 'La Primavera 154, Carlos Keen (6701), Buenos Aires, Argentina',
  /** Mailbox that answers privacy, deletion and support requests. */
  contactEmail: 'hola@loneto.app' as string | null,
  /** Where Supabase stores the data. Update both languages if the project region moves. */
  dataRegion: { es: 'Brasil (São Paulo)', en: 'Brazil (São Paulo)' },
  minimumAge: '13',
  /** Days until soft-deleted shared data is purged for good (pg_cron job). */
  purgeDays: '30',
  /** Business days to answer a deletion request by email; Ley 25.326 art. 16 caps it at 5. */
  deletionDays: '5',
  /** Days Supabase keeps daily backups (7 on Free and Pro, 14 on Team). */
  serverBackupDays: '7',
  /** ISO date the current version of the documents takes effect: set it on the day they are deployed. */
  effectiveDate: null as string | null,
  /** Whether "Eliminar cuenta" exists inside the app. */
  inAppDeletion: true,
};

/** Site path of each legal page per language; the key is shared so pages can link to their translation. */
export const LEGAL_PATHS = {
  privacy: { es: 'privacy/', en: 'en/privacy/' },
  terms: { es: 'terms/', en: 'en/terms/' },
  deleteAccount: { es: 'delete-account/', en: 'en/delete-account/' },
  support: { es: 'support/', en: 'en/support/' },
} as const;

export type LegalPage = keyof typeof LEGAL_PATHS;

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

export function formatDate(date: Date, lang: Lang = 'es'): string {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
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
