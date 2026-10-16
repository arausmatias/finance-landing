/**
 * What shipped in the app, newest first. Every entry maps to a real commit; the home shows the
 * newest featured ones and the changelog page shows all of them, grouped by day.
 */
export type NewsKind = 'cards' | 'currencies' | 'langs' | 'worth' | 'reports' | 'rates' | 'groups' | 'recurring';
/** Every animated scene: the changelog's plus the ones that only live in tiles and articles */
export type SceneKind = NewsKind | 'search';

interface Base {
  /** ISO day, e.g. "2026-10-16" */
  date: string;
  title: string;
  /** Pro feature: the date pill says so */
  pro?: boolean;
}
/** An entry with its own animated card */
export interface Featured extends Base {
  kind: NewsKind;
  body: string;
  soft: string;
  ink: string;
  /** Takes the wide slot on the home grid */
  wide?: boolean;
}
/** A one-line entry */
export interface Minor extends Base {
  icon: string;
}
export type Entry = Featured | Minor;

export const isFeatured = (e: Entry): e is Featured => 'kind' in e;

export const CHANGELOG: Entry[] = [
  { date: '2026-10-16', kind: 'cards', wide: true, soft: '#EBE2FA', ink: '#6B42B0', title: 'Tarjetas de crédito, con cuotas y resumen', body: 'Pagás con la tarjeta y cada cuota cae en el resumen que le toca. Ves lo del último cierre, lo que va del mes y la deuda total con las cuotas por venir. Pagás el total, el mínimo u otro monto, y te avisamos antes del vencimiento.' },
  { date: '2026-10-16', kind: 'currencies', soft: '#FBF1D0', ink: '#85680A', title: '154 monedas', body: 'Cada una con su bandera. Buscalas por nombre o por código y marcá tus favoritas para tenerlas siempre arriba.' },
  { date: '2026-10-16', kind: 'langs', wide: true, soft: '#DCEAF7', ink: '#1F5F9A', title: 'Ahora en seis idiomas', body: 'Español, inglés, portugués, francés, alemán e italiano, con los formatos de cada lugar para la plata, los números y las fechas.' },
  { date: '2026-10-16', icon: 'i-cash-refund', title: 'Al pagar la tarjeta podés sumar intereses y cargos del banco' },
  { date: '2026-10-15', icon: 'i-tune-variant', title: 'Al cargar, la cuenta, el medio y las etiquetas aparecen solo si los usás' },
  { date: '2026-10-15', icon: 'i-credit-card', title: 'Cada tarjeta con el logo de su red y sus últimos cuatro números' },
  { date: '2026-10-12', kind: 'worth', pro: true, soft: '#DCEBE3', ink: '#0E4A34', title: 'Todo lo que tenés, en una moneda', body: 'Tus pesos, tus dólares y lo que uses, sumados a la cotización de hoy. Y cuánto ganaste o perdiste solo porque se movió el cambio.' },
  { date: '2026-10-12', icon: 'i-swap-horizontal', title: 'Cada movimiento guarda la cotización de su día y no cambia más' },
  { date: '2026-10-12', icon: 'i-wallet', title: 'Varias cuentas y transferencias entre ellas, ahora gratis' },
  { date: '2026-10-12', icon: 'i-chart-bar', pro: true, title: 'La proyección de los reportes suma las cuotas que vienen' },
  { date: '2026-10-11', icon: 'i-magnify', title: 'Buscar y filtrar movimientos' },
  { date: '2026-10-11', icon: 'i-archive-outline', title: 'Los grupos ya saldados se archivan' },
  { date: '2026-10-09', kind: 'reports', wide: true, soft: '#DCEAF7', ink: '#1F5F9A', title: 'Reportes del mes', body: 'Gastos, ingresos y neto en un gráfico que se corre con el mes que elegís, más el detalle por categoría. La proyección de lo que viene es parte de Pro.' },
  { date: '2026-10-09', kind: 'rates', soft: '#D5F1EE', ink: '#147369', title: 'Cotización de cierre', body: 'Cada mes guarda su cotización: oficial, MEP o blue para el peso. Si la cargás a mano, manda la tuya. Se queda en tu teléfono.' },
  { date: '2026-10-09', icon: 'i-delete-outline', title: 'Borrar tu cuenta sin perder lo que compartiste con otros' },
  { date: '2026-10-09', icon: 'moni', title: 'Moni te recibe cada vez que abrís la app' },
  { date: '2026-10-07', kind: 'groups', soft: '#EBE2FA', ink: '#6B42B0', title: 'Grupos compartidos', body: 'Compartí un grupo con un código que vale 7 días. Cada uno carga lo suyo y todo cambio queda en la actividad.' },
  { date: '2026-10-07', icon: 'i-pencil', title: 'El que administra un grupo le puede cambiar el nombre' },
  { date: '2026-10-06', kind: 'recurring', wide: true, soft: '#FCE8D6', ink: '#9E561A', title: 'Gastos fijos compartidos', body: 'Alquiler, streaming o la luz: lo cargás una vez y cada uno ve su parte de cada mes y avisa cuando pagó. Para esto, y solo para esto, entrás con Google.' },
];

/** The newest day with changes; its entries get the "Nuevo" dot */
export const LATEST = CHANGELOG[0].date;

/** Featured entries on the home: the newest of each kind, up to four */
export const HOME_NEWS: Featured[] = [
  ...CHANGELOG.filter(isFeatured).filter((e) => e.kind === 'cards' || e.kind === 'worth'),
  ...CHANGELOG.filter(isFeatured).filter((e) => e.kind === 'currencies' || e.kind === 'langs'),
];

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const parts = (iso: string) => iso.split('-').map(Number) as [number, number, number];

/** "16 oct" */
export function dayLabel(iso: string): string {
  const [, m, d] = parts(iso);
  return `${d} ${MONTHS[m - 1]}`;
}
/** "Viernes" */
export function weekday(iso: string): string {
  const [y, m, d] = parts(iso);
  return WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}
/** Entries grouped by day, newest first */
export function byDay(entries: Entry[] = CHANGELOG): { date: string; entries: Entry[] }[] {
  const days = new Map<string, Entry[]>();
  for (const e of entries) days.set(e.date, [...(days.get(e.date) ?? []), e]);
  return [...days].map(([date, list]) => ({ date, entries: list }));
}
