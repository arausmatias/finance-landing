/**
 * What shipped in the app, newest first. Every entry maps to a real commit; the home shows the
 * newest featured ones and the changelog page shows all of them, grouped by day.
 */
export type NewsKind = 'cards' | 'currencies' | 'langs' | 'worth' | 'reports' | 'rates' | 'groups' | 'recurring' | 'upcoming' | 'alerts';
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
  { date: '2026-11-11', icon: 'i-clock-outline', title: 'Cada cotización automática muestra cuándo se actualizó' },
  { date: '2026-11-11', icon: 'i-credit-card', title: 'Las tarjetas se ordenan por vencimiento, la más urgente primero' },
  { date: '2026-11-10', kind: 'upcoming', wide: true, soft: '#D6F4DE', ink: '#1A7A45', title: 'Lo que se repite, se anota solo', body: 'Alquiler, suscripciones o tu sueldo: lo cargás una vez y se registra solo el día que toca, cada mes. En Movimientos, Próximos te muestra qué viene y qué te está esperando.' },
  { date: '2026-11-10', icon: 'i-calendar-blank', title: 'Movimientos se recorre mes a mes, y la búsqueda abarca todos' },
  { date: '2026-11-10', icon: 'i-swap-horizontal', title: 'Las cotizaciones de hoy tienen su página, y la que cargás a mano dice hasta cuándo vale' },
  { date: '2026-11-10', icon: 'i-bell-outline', title: 'Silenciá cada grupo o gasto compartido desde su pantalla' },
  { date: '2026-11-07', icon: 'i-credit-card', title: 'Cargá en la tarjeta en cualquier moneda, sin configurar nada' },
  { date: '2026-11-07', icon: 'i-cellphone-lock', title: 'Al cerrar sesión podés borrar el teléfono, con una copia antes' },
  { date: '2026-11-03', icon: 'i-cash-refund', title: 'Si pagás de más la tarjeta, queda como saldo a favor' },
  { date: '2026-11-03', icon: 'i-swap-horizontal', title: 'La cotización del mes se actualiza cada vez que abrís la app' },
  { date: '2026-10-30', icon: 'i-apple', title: 'Entrá con Apple en iPhone para lo que compartís' },
  { date: '2026-10-25', icon: 'i-calendar-refresh', title: 'Desde el mismo gasto lo repetís cada mes o lo dividís' },
  { date: '2026-10-19', kind: 'alerts', soft: '#FFE5D7', ink: '#A75000', title: 'Avisos de lo que compartís', body: 'Un gasto nuevo en tu grupo, alguien que se suma o se va, o tu parte por vencer: te llega un aviso y queda en tu bandeja.' },
  { date: '2026-10-16', kind: 'cards', wide: true, soft: '#EBE8FF', ink: '#6F3AD3', title: 'Tarjetas de crédito, con cuotas y resumen', body: 'Pagás con la tarjeta y cada cuota cae en el resumen que le toca. Ves lo del último cierre, lo que va del mes y la deuda total con las cuotas por venir. Pagás el total, el mínimo u otro monto, y te avisamos antes del vencimiento.' },
  { date: '2026-10-16', kind: 'currencies', soft: '#F9EACA', ink: '#846300', title: '154 monedas', body: 'Cada una con su bandera. Buscalas por nombre o por código y marcá tus favoritas para tenerlas siempre arriba.' },
  { date: '2026-10-16', kind: 'langs', wide: true, soft: '#E1ECFF', ink: '#0E4FC2', title: 'Ahora en seis idiomas', body: 'Español, inglés, portugués, francés, alemán e italiano, con los formatos de cada lugar para la plata, los números y las fechas.' },
  { date: '2026-10-16', icon: 'i-cash-refund', title: 'Al pagar la tarjeta podés sumar intereses y cargos del banco' },
  { date: '2026-10-15', icon: 'i-tune-variant', title: 'Al cargar, la cuenta, el medio y las etiquetas aparecen solo si los usás' },
  { date: '2026-10-15', icon: 'i-credit-card', title: 'Cada tarjeta con el logo de su red y sus últimos cuatro números' },
  { date: '2026-10-12', kind: 'worth', soft: '#C8F5EE', ink: '#0B3440', title: 'Todo lo que tenés, en una moneda', body: 'Tus pesos, tus dólares y lo que uses, sumados a la cotización de hoy. Y cuánto ganaste o perdiste solo porque se movió el cambio.' },
  { date: '2026-10-12', icon: 'i-swap-horizontal', title: 'Cada movimiento guarda la cotización de su día y no cambia más' },
  { date: '2026-10-12', icon: 'i-wallet', title: 'Varias cuentas y transferencias entre ellas, ahora gratis' },
  { date: '2026-10-12', icon: 'i-chart-bar', title: 'La proyección de los reportes suma las cuotas que vienen' },
  { date: '2026-10-11', icon: 'i-magnify', title: 'Buscar y filtrar movimientos' },
  { date: '2026-10-11', icon: 'i-archive-outline', title: 'Los grupos ya saldados se archivan' },
  { date: '2026-10-09', kind: 'reports', wide: true, soft: '#E1ECFF', ink: '#0E4FC2', title: 'Reportes del mes', body: 'Gastos, ingresos y neto en un gráfico que se corre con el mes que elegís, más el detalle por categoría. Y la proyección de lo que viene, cuotas incluidas.' },
  { date: '2026-10-09', kind: 'rates', soft: '#D3F2F6', ink: '#00747E', title: 'Cotización de cierre', body: 'Cada mes guarda su cotización, con el dólar oficial para el peso. Si la cargás a mano, manda la tuya. Se queda en tu teléfono.' },
  { date: '2026-10-09', icon: 'i-delete-outline', title: 'Borrar tu cuenta sin perder lo que compartiste con otros' },
  { date: '2026-10-07', kind: 'groups', soft: '#EBE8FF', ink: '#6F3AD3', title: 'Grupos compartidos', body: 'Compartí un grupo con un código que vale 7 días. Cada uno carga lo suyo y todo cambio queda en la actividad.' },
  { date: '2026-10-07', icon: 'i-pencil', title: 'El que administra un grupo le puede cambiar el nombre' },
  { date: '2026-10-06', kind: 'recurring', wide: true, soft: '#FFE5D7', ink: '#A75000', title: 'Gastos fijos compartidos', body: 'Alquiler, streaming o la luz: lo cargás una vez y cada uno ve su parte de cada mes y avisa cuando pagó. Para esto, y solo para esto, entrás con Google.' },
];

/** The newest day with a featured entry; its cards get the "Nuevo" dot */
export const LATEST = CHANGELOG.find(isFeatured)!.date;

/** Featured entries on the home, in rows of one wide card plus one normal card */
const byKind = (kind: NewsKind) => CHANGELOG.filter(isFeatured).find((e) => e.kind === kind)!;
export const HOME_NEWS: Featured[] = (['upcoming', 'alerts', 'cards', 'worth', 'currencies', 'langs'] as const).map(byKind);

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
