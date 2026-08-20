import type { FunnelStep, Tone } from "./ui";

export type CoPyRow = { label: string; co: string; py: string; flag?: Tone };
export type ModeShare = { mode: string; co: string; py: string; coPct: number; pyPct: number };

export type WeekId = "linea-base" | "s1" | "s2" | "s3" | "s4";

export const WEEK_CHIPS: { id: WeekId; label: string }[] = [
  { id: "linea-base", label: "Línea base" },
  { id: "s1", label: "S1 · 26 jun–3 jul" },
  { id: "s2", label: "S2 · 3–10 jul" },
  { id: "s3", label: "S3 · 10–17 jul" },
  { id: "s4", label: "S4 · 17–24 jul" },
];

export const TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "semanas", label: "Semanas" },
  { id: "comparativo", label: "Comparativo" },
  { id: "voces", label: "Voces" },
  { id: "hallazgos", label: "Hallazgos" },
  { id: "sigue", label: "Qué sigue" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export const GLOSSARY = [
  {
    term: "Usuarios (personas)",
    def: "Cuenta cada persona una sola vez, aunque haya repetido la acción esa semana. Es la métrica de adopción, retención y funnel. Ejemplo: «16.925 usuarios buscaron escribiendo».",
  },
  {
    term: "Eventos / clics (acciones)",
    def: "Cuenta cada clic, aunque sea de la misma persona. Siempre es mayor o igual que usuarios. En Colombia S1, la búsqueda por imagen tuvo 7.703 clics de 2.686 personas (~2,9 veces cada una). Si un número no aclara cuál es, mira Eventos vs. usuarios en Comparativo.",
  },
  {
    term: "Retención < mes 1",
    def: "De las personas que hicieron la acción esa semana (la base N), el % que la volvió a hacer dentro del primer mes. Ejemplo: «77,5% (16.925 usuarios)» = de 16.925 que buscaron, el 77,5% buscó de nuevo antes de un mes.",
  },
  {
    term: "Qué es una acción",
    def: "Después de abrir el detalle de un producto, la persona genera una orden, le escribe al cliente o guarda favorito. El tablero llama a eso «acción».",
  },
  {
    term: "Los 5 pasos del funnel",
    def: "1) Catálogo → buscó: de quienes vieron el catálogo, cuántos usaron la barra. 2) Vio resultados. 3) Abrió el detalle de un producto. 4) Hizo algo: favorito, mensaje al cliente o una orden. Ojo: el paso 4 no mide lo mismo en cada país (Colombia = primer pedido; Paraguay = escribir al cliente). 5) Llegó al final de ese camino (Colombia = entrega; Paraguay = pedido manual).",
  },
  {
    term: "Modo por defecto vs. elección activa",
    def: "El modo que aparece al abrir el buscador no genera un clic propio. En Colombia el default es Clásica; en Paraguay, desde el 17 jun 2026, es IA. Los otros modos sí se cuentan cuando la persona los elige a propósito.",
  },
  {
    term: "Reversión a Clásica",
    def: "En Paraguay: el % de quienes buscan y, teniendo IA por defecto, vuelven a mano al buscador Clásico. Nadie cambia de modo por accidente. La alarma del experimento está en 30%. Hoy estamos en 0,9% (12 personas de 1.291).",
  },
];

export const HOW_IT_WORKS = [
  {
    mode: "IA",
    body: "Escribe en lenguaje natural. Detecta filtros (precio, stock, categoría, ciudad, favoritos). Tolera errores de tipeo. Las primeras 3 veces aparece un tooltip; se cierra con la X. Tab completa la sugerencia del placeholder.",
  },
  {
    mode: "Clásica",
    body: "Busca por coincidencia de nombre. Si no hay resultados, invita a repetir la misma consulta en modo IA.",
  },
  {
    mode: "ID",
    body: "Solo acepta números del identificador del producto. Pensado para quien ya tiene el ID (proveedor, WhatsApp, grupos).",
  },
];

export const TANGO_URL =
  "https://app.tango.us/app/workflow/c6656d53-3785-4168-90be-357502e5f742";

export const BUGS = [
  {
    tone: "amber" as Tone,
    title: "Error 505 al hacer scroll en búsqueda IA (Paraguay) — sin confirmar en S4",
    body: "Reportado en QA desde S1, seguía abierto en S3. En S4 no vino en las capturas de QA: no se puede dar por resuelto.",
  },
  {
    tone: "muted" as Tone,
    title: "Sin notificación de optimización del motor de búsqueda",
    body: "Pendiente desde S1. Sin esta señal, catálogo prioriza a ciegas qué términos corregir primero.",
  },
  {
    tone: "red" as Tone,
    title: "Campo «es_consulta_final» roto en la base cruda de Clásica (Colombia)",
    body: "Marca 100% verdadero en todos los casos. En búsqueda semántica sí varía (66% CO, 79,5% PY). No se usó del lado Clásica; solo el largo de la ráfaga.",
  },
  {
    tone: "red" as Tone,
    title: "La base cruda de Clásica llegó cortada, sin Paraguay",
    body: "El archivo tocó el límite de Excel (1.048.576 filas) y se cortó antes de incluir Paraguay. Pedir CSV filtrado por país.",
  },
];

export const FUNNEL_S4 = {
  coBase: "15.517 usuarios",
  pyBase: "1.188 usuarios",
  co: [
    { label: "Catálogo → Buscó", n: "15.517", pct: "100%", width: 100 },
    { label: "Búsqueda → Resultados", n: "7.824", pct: "50,42%", width: 50.4 },
    { label: "Resultados → Detalle", n: "2.851", pct: "18,37%", width: 18.4 },
    { label: "Hizo algo (pedido)", n: "322", pct: "2,08%", width: 7 },
    { label: "Llegó al final", n: "221", pct: "1,42%", width: 5 },
  ] as FunnelStep[],
  py: [
    { label: "Catálogo → Buscó", n: "1.188", pct: "100%", width: 100 },
    { label: "Búsqueda → Resultados", n: "744", pct: "62,63%", width: 63 },
    { label: "Resultados → Detalle", n: "356", pct: "29,97%", width: 30 },
    { label: "Hizo algo (mensaje)", n: "68", pct: "5,72%", width: 6 },
    { label: "Llegó al final", n: "52", pct: "4,38%", width: 5 },
  ] as FunnelStep[],
};

export const TIMELINE: { date: string; tone: Tone; text: string }[] = [
  {
    date: "5–12 jun · Línea base",
    tone: "muted",
    text: "Paraguay 100% con Clásica, todavía sin IA. Retención escrita 48,4%, por imagen 21,4%. Solo 6,4% de quienes entraban al catálogo usaban el buscador. Favoritos (213) y mensajes a cliente (134) sí se registraban.",
  },
  {
    date: "26 jun–3 jul · Semana 1",
    tone: "blue",
    text: "Primer corte del MVP: IA por defecto en PY, Clásica por defecto en CO. Adopción invertida por diseño (Clásica 79,8% CO, IA 98,8% PY). Reversión a Clásica en PY: 1,0%. CSAT/CES aún no habilitado.",
  },
  {
    date: "3–10 jul · Semana 2",
    tone: "blue",
    text: "Patrón estable (IA 99,3% PY). Reversión a Clásica baja a 0,4%. PY crece más rápido en catálogo/búsqueda (+7–10%) que CO (+2–3%), pero su activación cae (−3,1%).",
  },
  {
    date: "10–17 jul · Semana 3",
    tone: "red",
    text: "PY pega un salto atípico (+27,9% catálogo). Su funnel se debilita por primera vez y la reversión a Clásica sube (0,4%→0,7%) — lejos aún del 30% de alarma.",
  },
  {
    date: "17–24 jul · Semana 4",
    tone: "green",
    text: "Se resuelve el bug de tracking de favoritos/escribir al cliente en PY (0 → cifras reales). Primera semana sin crecimiento en ningún país. Reversión a Clásica en PY sube 2ª semana seguida (0,7%→0,9%). Se suma el análisis de consultas individuales.",
  },
];

export type WeekData = {
  id: WeekId;
  label: string;
  alert?: { tone: Tone; title: string; body: string };
  defaultOpen: boolean;
  base: CoPyRow[];
  baseNote?: string;
  modo: ModeShare[];
  modoNote: string;
  conclusionTone: Tone;
  conclusionLabel: string;
  conclusion: string;
  imagen: CoPyRow[];
  imagenNote?: string;
  activacion: {
    rows: CoPyRow[];
    note?: string;
    banner?: { tone: Tone; title: string; body: string };
    conclusion?: { tone: Tone; label: string; body: string };
  };
  limpieza: { rows?: CoPyRow[]; note: string };
  funnel: {
    coBase: string;
    pyBase: string;
    co: FunnelStep[];
    py: FunnelStep[];
    detail?: CoPyRow[];
    note?: string;
    conclusion?: { tone: Tone; body: string };
  };
  retencion: { rows: CoPyRow[]; conclusion: string; conclusionTone: Tone };
};

export const WEEKS: Record<"s1" | "s2" | "s3" | "s4", WeekData> = {
  s1: {
    id: "s1",
    label: "Semana 1 · 26 jun – 3 jul 2026",
    defaultOpen: false,
    base: [
      { label: "Usuarios en catálogo", co: "24.045", py: "1.696" },
      { label: "Usuarios en búsqueda escrita", co: "16.490", py: "962" },
      { label: "Quién busca, de los que entran", co: "68,6%", py: "56,7%" },
    ],
    modo: [
      { mode: "Clásica", co: "13.151 (79,8%) — default", py: "10 (1,0%) — activo", coPct: 79.8, pyPct: 1.0 },
      { mode: "IA", co: "1.739 (10,5%) — activo", py: "950 (98,8%) — default", coPct: 10.5, pyPct: 98.8 },
      { mode: "ID", co: "1.600 (9,7%) — activo", py: "2 (0,2%) — activo", coPct: 9.7, pyPct: 0.2 },
    ],
    modoNote:
      "En Colombia, 1 de cada 5 búsquedas activas fuera del default (20,2%) termina en IA o ID. En Paraguay, la reversión activa hacia Clásica es marginal (1,0% + 0,2% ID) — muy por debajo del 30% de alarma.",
    conclusionTone: "blue",
    conclusionLabel: "Qué significa",
    conclusion:
      "Clásica en Colombia retiene mejor (79,2%) que IA (44,7%) o ID (42,3%) — esperable: es el modo más maduro y con la base más grande. En Paraguay, IA (950 usuarios, el default) retiene 57,9%, casi igual a la retención general de búsqueda escrita (57,3%). Clásica (10u) e ID (2u) en Paraguay tienen base demasiado chica para leer su 0%/50% como señal.",
    imagen: [
      { label: "Usuarios", co: "2.686", py: "87" },
      { label: "% de quienes ya buscan escribiendo", co: "16,3%", py: "9,0%" },
      { label: "% de quienes vieron el catálogo", co: "11,2%", py: "5,1%" },
      { label: "Catálogo → imagen", co: "15,62%", py: "6,84%" },
    ],
    activacion: {
      note: "Las filas coinciden con usuarios únicos que activaron el filtro, no con el total de clics. Ver Eventos vs. usuarios en Comparativo.",
      rows: [
        { label: "Total activación (semana)", co: "8.500", py: "98" },
        { label: "Guardó como favorito (reportado esa semana)", co: "2.100", py: "0 (bug, ver nota)", flag: "muted" },
        { label: "Escribió al cliente", co: "1.600", py: "—" },
        { label: "Cambió a filtro IA", co: "1.739", py: "1" },
        { label: "Usó filtro imagen", co: "2.686", py: "87" },
        { label: "Cambió a filtro Clásica", co: "355", py: "10" },
      ],
      banner: {
        tone: "green",
        title: "Esto era un bug de tracking, ya resuelto",
        body: "Favoritos y escribir al cliente en Paraguay estuvieron subcontados (en cero) durante S1–S3. Corregido en S4. Cifras reales: S3 1.016 favoritos / 1.278 mensajes; S4 1.023 / 1.244.",
      },
    },
    limpieza: {
      rows: [
        { label: "Eventos (clics en X)", co: "0 — gap de tracking", py: "166", flag: "red" },
        { label: "Usuarios únicos", co: "0 — gap de tracking", py: "124", flag: "red" },
        { label: "Tasa sobre búsqueda escrita", co: "0% eventos / 0% usuarios", py: "4,0% eventos / 12,9% usuarios" },
      ],
      note: "Paraguay ya tiene el evento activo (124 personas limpiaron al menos una vez, 166 clics). Colombia en cero es el mismo gap de tracking que se repite en S2.",
    },
    funnel: {
      coBase: "14.808 usuarios",
      pyBase: "882 usuarios",
      co: [
        { label: "Catálogo → Buscó", n: "14.808", pct: "100%", width: 100 },
        { label: "Búsqueda → Resultados", n: "7.361", pct: "49,71%", width: 49.7 },
        { label: "Resultados → Detalle", n: "2.660", pct: "17,96%", width: 18 },
        { label: "Hizo algo (pedido)", n: "324", pct: "2,19%", width: 8 },
        { label: "Llegó al final", n: "248", pct: "1,67%", width: 6 },
      ],
      py: [
        { label: "Catálogo → Buscó", n: "882", pct: "100%", width: 100 },
        { label: "Búsqueda → Resultados", n: "586", pct: "66,44%", width: 66.4 },
        { label: "Resultados → Detalle", n: "307", pct: "34,81%", width: 35 },
        { label: "Hizo algo (mensaje)", n: "64", pct: "7,26%", width: 12 },
        { label: "Llegó al final", n: "44", pct: "4,99%", width: 9 },
      ],
    },
    retencion: {
      rows: [
        { label: "Búsqueda escrita (general)", co: "72,0% (16.490u)", py: "57,3% (962u)" },
        { label: "Búsqueda por imagen", co: "47,6% (2.686u)", py: "34,5% (87u)" },
        { label: "Clásica", co: "79,2% (13.151u)", py: "0% (10u)" },
        { label: "IA", co: "44,7% (1.739u)", py: "57,9% (950u)" },
        { label: "ID", co: "42,3% (1.600u)", py: "50% (2u)" },
      ],
      conclusionTone: "blue",
      conclusion:
        "Clásica en Colombia retiene mejor (79,2%) que IA (44,7%) o ID (42,3%). En Paraguay, IA (950u, el default) retiene 57,9%, casi idéntica a la general (57,3%). Clásica (10u) e ID (2u) son ruido de muestra.",
    },
  },
  s2: {
    id: "s2",
    label: "Semana 2 · 3 – 10 jul 2026",
    defaultOpen: false,
    base: [
      { label: "Usuarios en catálogo", co: "24.547", py: "1.822" },
      { label: "Usuarios en búsqueda escrita", co: "16.925", py: "1.055" },
      { label: "Quién busca, de los que entran", co: "68,9%", py: "57,9%" },
    ],
    modo: [
      { mode: "Clásica", co: "13.432 (79,4%) — default", py: "4 (0,4%) — activo", coPct: 79.4, pyPct: 0.4 },
      { mode: "IA", co: "1.840 (10,9%) — activo", py: "1.048 (99,3%) — default", coPct: 10.9, pyPct: 99.3 },
      { mode: "ID", co: "1.653 (9,8%) — activo", py: "3 (0,3%) — activo", coPct: 9.8, pyPct: 0.3 },
    ],
    modoNote:
      "Se mantiene el patrón: Clásica domina CO, IA domina PY. La reversión a Clásica en Paraguay bajó a 0,4% (4 personas) — sigue muy por debajo del 30%.",
    conclusionTone: "blue",
    conclusionLabel: "Qué significa",
    conclusion:
      "En Colombia, Clásica retiene mejor (84,3%) que IA (52,2%) o ID (50,2%). En Paraguay, IA (1.048u) retiene 64,7%, mejor que Colombia. Clásica (4u) e ID (3u) en Paraguay siguen sin base suficiente.",
    imagen: [
      { label: "Usuarios", co: "2.819", py: "90" },
      { label: "% de quienes ya buscan escribiendo", co: "16,7%", py: "8,5%" },
      { label: "% de quienes vieron el catálogo", co: "11,5%", py: "4,9%" },
      { label: "Catálogo → imagen", co: "12,86%", py: "5,82%" },
    ],
    imagenNote:
      "Mismo patrón de S1. La conversión baja un poco en ambos (CO 15,62%→12,86%, PY 6,84%→5,82%) porque catálogo y búsqueda escrita crecieron más rápido que la imagen — no es alarma.",
    activacion: {
      note: "Usuarios únicos que activaron el filtro. Ver Eventos vs. usuarios en Comparativo.",
      rows: [
        { label: "Total activación (semana)", co: "8.700", py: "95" },
        { label: "Guardó como favorito (reportado esa semana)", co: "2.200", py: "0 (bug, ver nota)", flag: "muted" },
        { label: "Escribió al cliente", co: "1.600", py: "—" },
        { label: "Cambió a filtro IA", co: "1.840", py: "1" },
        { label: "Usó filtro imagen", co: "2.819", py: "90" },
        { label: "Cambió a filtro Clásica", co: "328", py: "4" },
      ],
      banner: {
        tone: "green",
        title: "Esto era un bug de tracking, ya resuelto",
        body: "Favoritos y escribir al cliente en Paraguay estuvieron en cero por un problema del evento. Corregido en S4.",
      },
    },
    limpieza: {
      rows: [
        { label: "Eventos (clics en X)", co: "0 — gap de tracking", py: "245", flag: "red" },
        { label: "Usuarios únicos", co: "0 — gap de tracking", py: "160", flag: "red" },
        { label: "Tasa sobre búsqueda escrita", co: "0% eventos / 0% usuarios", py: "5,5% eventos / 15,2% usuarios" },
      ],
      note: "Colombia en 0 dos semanas seguidas no es realista a este volumen. En Paraguay la tasa sube (S1 12,9% → S2 15,2% de usuarios).",
    },
    funnel: {
      coBase: "15.245 usuarios",
      pyBase: "963 usuarios",
      co: [
        { label: "Catálogo → Buscó", n: "15.245", pct: "100%", width: 100 },
        { label: "Búsqueda → Resultados", n: "7.595", pct: "49,82%", width: 49.8 },
        { label: "Resultados → Detalle", n: "2.732", pct: "17,92%", width: 17.9 },
        { label: "Hizo algo (pedido)", n: "352", pct: "2,31%", width: 8 },
        { label: "Llegó al final", n: "263", pct: "1,73%", width: 6 },
      ],
      py: [
        { label: "Catálogo → Buscó", n: "963", pct: "100%", width: 100 },
        { label: "Búsqueda → Resultados", n: "616", pct: "63,97%", width: 64 },
        { label: "Resultados → Detalle", n: "328", pct: "34,06%", width: 34 },
        { label: "Hizo algo (mensaje)", n: "74", pct: "7,68%", width: 12 },
        { label: "Llegó al final", n: "63", pct: "6,54%", width: 9 },
      ],
      detail: [
        { label: "1. Catálogo → buscó", co: "100%", py: "100%" },
        { label: "2. Vio resultados", co: "49,82% (7.595)", py: "63,97% (616)" },
        { label: "3. Abrió detalle", co: "17,92% (2.732)", py: "34,06% (328)" },
        { label: "4. Hizo algo (no es lo mismo)", co: "2,31% (352) — primer pedido", py: "7,68% (74) — escribió al cliente" },
        { label: "5. Llegó al final", co: "1,73% (263) — entrega", py: "6,54% (63) — pedido manual" },
      ],
      note: "Paraguay convierte proporcionalmente mejor en cada paso posterior a resultados, con la misma reserva de tamaño de muestra.",
    },
    retencion: {
      rows: [
        { label: "Búsqueda escrita (general)", co: "77,5% (16.925u)", py: "64,3% (1.055u)" },
        { label: "Búsqueda por imagen", co: "56,3% (2.819u)", py: "33,3% (90u)" },
        { label: "Clásica", co: "84,3% (13.432u)", py: "0% (4u)" },
        { label: "IA", co: "52,2% (1.840u)", py: "64,7% (1.048u)" },
        { label: "ID", co: "50,2% (1.653u)", py: "0% (3u)" },
      ],
      conclusionTone: "blue",
      conclusion:
        "En Colombia, Clásica retiene mejor (84,3%) que IA (52,2%) o ID (50,2%). En Paraguay, IA (1.048u) retiene 64,7%. Clásica (4u) e ID (3u) siguen sin base suficiente.",
    },
  },
  s3: {
    id: "s3",
    label: "Semana 3 · 10 – 17 jul 2026",
    defaultOpen: false,
    alert: {
      tone: "red",
      title: "Semana atípica en Paraguay: salto de crecimiento fuerte",
      body: "Paraguay creció mucho más rápido: +27,9% en catálogo y +19,9% en búsqueda escrita, por encima del +7–10% de S1→S2. Confirmar si hubo campaña. Varios movimientos de esta semana (funnel más débil, reversión al alza) probablemente son efecto de esa ola de gente nueva.",
    },
    base: [
      { label: "Usuarios en catálogo", co: "25.718", py: "2.330" },
      { label: "Usuarios en búsqueda escrita", co: "17.637", py: "1.265" },
      { label: "Quién busca, de los que entran", co: "68,6%", py: "54,3%" },
    ],
    baseNote:
      "En Paraguay el % que busca bajó (57,9%→54,3%) porque entró más gente nueva de la que ya busca — normal cuando llega una ola.",
    modo: [
      { mode: "Clásica", co: "14.221 (80,6%) — default", py: "9 (0,7%) — activo", coPct: 80.6, pyPct: 0.7 },
      { mode: "IA", co: "1.842 (10,4%) — activo", py: "1.255 (99,2%) — default", coPct: 10.4, pyPct: 99.2 },
      { mode: "ID", co: "1.574 (8,9%) — activo", py: "1 (0,1%) — activo", coPct: 8.9, pyPct: 0.1 },
    ],
    modoNote:
      "Tercera semana casi sin cambio. Lo distinto: en Paraguay la reversión a Clásica subió (0,4%→0,7%, de 4 a 9 personas).",
    conclusionTone: "red",
    conclusionLabel: "Qué vigilar",
    conclusion:
      "Primera semana en que el camino a la orden de Paraguay empeora: abrió detalle 34,06%→30,43%; llegó al final 6,54%→4,93%. Coincide con la mayor entrada de gente nueva (+27,9% catálogo).",
    imagen: [
      { label: "Usuarios", co: "2.881", py: "123" },
      { label: "% de quienes ya buscan escribiendo", co: "16,3%", py: "9,7%" },
      { label: "% de quienes vieron el catálogo", co: "11,2%", py: "5,3%" },
      { label: "Catálogo → imagen", co: "12,48%", py: "6,35%" },
    ],
    imagenNote:
      "Colombia casi no cambió. Paraguay subió fuerte en usuarios (+36,7%, 90→123) y en % de buscadores (8,5%→9,7%).",
    activacion: {
      note: "Favoritos y escribir al cliente se muestran con la cifra recalculada en S4 (el pipeline sumaba mal las dos variantes del evento).",
      rows: [
        { label: "Guardó como favorito (recalculado)", co: "9.083", py: "1.016" },
        { label: "Escribió al cliente (recalculado)", co: "11.334", py: "1.278" },
        { label: "Cambió a filtro IA", co: "1.842", py: "2" },
        { label: "Usó filtro imagen", co: "2.881", py: "123" },
        { label: "Cambió a filtro Clásica", co: "396", py: "9" },
      ],
      conclusion: {
        tone: "green",
        label: "Actualizado en S4",
        body: "Esa semana se reportó favorito en cero en Paraguay por tercera vez. Con la corrección, la cifra real fue 1.016 favoritos y 1.278 mensajes: la gente sí interactuaba; el evento no se sumaba bien.",
      },
    },
    limpieza: {
      note: "Este corte no incluyó el detalle del evento X. Referencia: Colombia en 0 en S1 y S2 (posible gap); Paraguay venía subiendo (S1: 124u / S2: 160u).",
    },
    funnel: {
      coBase: "15.676 usuarios",
      pyBase: "1.137 usuarios",
      co: [
        { label: "Catálogo → Buscó", n: "15.676", pct: "100%", width: 100 },
        { label: "Búsqueda → Resultados", n: "7.961", pct: "50,78%", width: 50.8 },
        { label: "Resultados → Detalle", n: "2.888", pct: "18,42%", width: 18.4 },
        { label: "Hizo algo (pedido)", n: "333", pct: "2,12%", width: 7 },
        { label: "Llegó al final", n: "251", pct: "1,60%", width: 5 },
      ],
      py: [
        { label: "Catálogo → Buscó", n: "1.137", pct: "100%", width: 100 },
        { label: "Búsqueda → Resultados", n: "713", pct: "62,71%", width: 63 },
        { label: "Resultados → Detalle", n: "346", pct: "30,43%", width: 30 },
        { label: "Hizo algo (mensaje)", n: "67", pct: "5,89%", width: 6 },
        { label: "Llegó al final", n: "56", pct: "4,93%", width: 5 },
      ],
      detail: [
        { label: "1. Catálogo → buscó", co: "100%", py: "100%" },
        { label: "2. Vio resultados", co: "50,78% (7.961)", py: "62,71% (713)" },
        { label: "3. Abrió detalle", co: "18,42% (2.888)", py: "30,43% (346)" },
        { label: "4. Hizo algo (no es lo mismo)", co: "2,12% (333) — primer pedido", py: "5,89% (67) — escribió al cliente" },
        { label: "5. Llegó al final", co: "1,60% (251) — entrega", py: "4,93% (56) — pedido manual" },
      ],
      conclusion: {
        tone: "red",
        body: "Primera semana en que el camino a la orden de Paraguay empeora. Coincide con la mayor entrada de gente nueva. En Colombia también bajó un poco el último paso (2,31%→2,12%).",
      },
    },
    retencion: {
      rows: [
        { label: "Búsqueda escrita (general)", co: "75,1% (17.637u)", py: "64,7% (1.265u)" },
        { label: "Búsqueda por imagen", co: "53,9% (2.881u)", py: "34,1% (123u)" },
        { label: "Clásica", co: "81,2% (14.221u)", py: "55,6% (9u)" },
        { label: "IA", co: "50,9% (1.842u)", py: "64,8% (1.255u)" },
        { label: "ID", co: "48,5% (1.574u)", py: "0% (1u)" },
      ],
      conclusionTone: "blue",
      conclusion:
        "Primera semana en que la retención de Colombia baja un poco. Clásica sigue muy por encima de IA (81,2% vs 50,9%). En Paraguay la retención se mantuvo (64,3%→64,7%) pese al crecimiento de gente nueva.",
    },
  },
  s4: {
    id: "s4",
    label: "Semana 4 · 17 – 24 jul 2026",
    defaultOpen: true,
    alert: {
      tone: "green",
      title: "Se resolvió el bug de tracking de favoritos y contacto al cliente en Paraguay",
      body: "Después de tres semanas en 0 (favoritos) y sin registrar (escribir al cliente), una corrección que suma las dos variantes del evento reveló las cifras reales: Paraguay 1.023 favoritos y 1.244 mensajes esta semana. Colombia también estaba subcontado: pasa de ~2.200 favoritos reportados a 8.940 reales.",
    },
    base: [
      { label: "Usuarios en catálogo", co: "25.441 (−1,1%)", py: "2.122 (−8,9%) primera caída", flag: "red" },
      { label: "Usuarios en búsqueda escrita", co: "17.441 (−1,1%)", py: "1.291 (+2,1%)" },
      { label: "Quién busca, de los que entran", co: "68,6% (=)", py: "60,8% (↑ desde 54,3%)" },
    ],
    baseNote:
      "Primera semana en que ningún país crece. Paraguay cae en catálogo (−8,9%), pero quien busca subió (54,3%→60,8%): la caída se concentra en tráfico sin intención de buscar.",
    modo: [
      { mode: "Clásica", co: "14.026 (80,4%) — default", py: "12 (0,9%) — activo", coPct: 80.4, pyPct: 0.9 },
      { mode: "IA", co: "1.824 (10,5%) — activo", py: "1.279 (99,1%) — default", coPct: 10.5, pyPct: 99.1 },
      { mode: "ID", co: "1.591 (9,1%) — activo", py: "0 (0%) — activo", coPct: 9.1, pyPct: 0 },
    ],
    modoNote:
      "Cuarta semana casi sin cambio. Lo que llama la atención: la reversión a Clásica en Paraguay subió por segunda semana (0,7%→0,9%, de 9 a 12 personas). Sigue lejos del 30%.",
    conclusionTone: "red",
    conclusionLabel: "Qué vigilar",
    conclusion:
      "La reversión a Clásica en Paraguay sube dos semanas seguidas (0,4%→0,7%→0,9%). Sigue minúsculo, pero ya no es un salto aislado. Si sube una tercera vez en S5, investigar a fondo.",
    imagen: [
      { label: "Usuarios", co: "2.856", py: "133" },
      { label: "% de quienes ya buscan escribiendo", co: "16,4%", py: "10,3%" },
      { label: "% de quienes vieron el catálogo", co: "11,2%", py: "6,3%" },
      { label: "Catálogo → imagen", co: "12,65%", py: "6,93%" },
    ],
    imagenNote:
      "Colombia sin cambios. Paraguay mejora en las tres formas de medirlo a pesar de la caída del catálogo: la foto sigue siendo la interacción de crecimiento más consistente.",
    activacion: {
      note: "Pipeline corregido: suma las dos variantes de cada evento. S3 se recalculó. S1 y S2 no tienen versión corregida.",
      rows: [
        { label: "Guardan como favorito (S4)", co: "8.940 (35,1% del catálogo)", py: "1.023 (48,2% del catálogo)" },
        { label: "Guardan como favorito (S3, recalculado)", co: "9.083 (35,3%)", py: "1.016 (43,6%)" },
        { label: "Escriben al cliente (S4)", co: "11.235 (44,1%)", py: "1.244 (58,6%)" },
        { label: "Escriben al cliente (S3, recalculado)", co: "11.334 (44,1%)", py: "1.278 (54,8%)" },
      ],
      conclusion: {
        tone: "green",
        label: "Qué significa",
        body: "El agujero negro de tracking era eso: tracking, no producto. Con la corrección, Paraguay muestra 45–48% de su catálogo interactuando después de buscar. La proporción favorito/contacto es casi idéntica en ambos países (~44–45% / ~55–56%).",
      },
    },
    limpieza: {
      note: "S4 tampoco incluyó el evento X (igual que S3). Referencia: Colombia en 0 en S1–S2; Paraguay S1 124u / S2 160u.",
    },
    funnel: {
      coBase: "15.517 usuarios",
      pyBase: "1.188 usuarios",
      co: FUNNEL_S4.co,
      py: FUNNEL_S4.py,
      conclusion: {
        tone: "blue",
        body: "Colombia sin cambios. Paraguay repite una caída pequeña en el último paso (4,93%→4,38%), de menor magnitud que S2→S3: parece estabilizarse. Confirmar en S5.",
      },
    },
    retencion: {
      rows: [
        { label: "Búsqueda escrita (general)", co: "76,5% (17.441u)", py: "64,4% (1.291u)" },
        { label: "Búsqueda por imagen", co: "54,6% (2.856u)", py: "39,1% (133u)" },
        { label: "Clásica", co: "≈82,4% (14.026u)", py: "16,7% (12u)" },
        { label: "IA", co: "53,2% (1.824u)", py: "≈64,9% (1.279u)" },
        { label: "ID", co: "51,0% (1.591u)", py: "0% (0u)" },
      ],
      conclusionTone: "blue",
      conclusion:
        "Colombia se recupera tras la baja de S3. Clásica real ≈82,4% — cuarta semana confirmando que, dentro de Colombia, quien usa Clásica se queda más. En Paraguay, escrita estable (64,7%→64,4%) e imagen +5 puntos (34,1%→39,1%) en la misma semana que el catálogo cayó.",
    },
  },
};

export const QUERY_GLOSSARY = [
  {
    term: "Búsquedas individuales",
    def: "Cada texto que alguien escribió. Una persona puede generar muchas.",
  },
  {
    term: "Personas distintas",
    def: "Gente distinta que buscó, aunque haya escrito 20 veces.",
  },
  {
    term: "Sesiones",
    def: "Veces que se sentó a buscar. En Paraguay IA: 1.158 personas y 1.152 sesiones ≈ una ida por persona. En Colombia IA: 5.072 personas y 2.478 sesiones ≈ varias idas al buscador.",
  },
  {
    term: "Ráfaga",
    def: "Cuántas consultas seguidas antes de parar. Colombia IA 1,99 vs Clásica 1,34: con IA refinan más.",
  },
  {
    term: "% última consulta de la sesión",
    def: "Si esa búsqueda fue la última de la visita. Señal indirecta de «encontré algo o me fui». Colombia IA 66%; Paraguay IA 79,5%. Clásica Colombia no se usa: el campo marca 100% verdadero (roto).",
  },
];

export const S4_QUERIES = {
  rows: [
    { label: "Búsquedas individuales", iaCo: "49.245", clasicaCo: "10.884", iaPy: "11.089" },
    { label: "Personas distintas", iaCo: "5.072", clasicaCo: "1.173", iaPy: "1.158" },
    { label: "Sesiones de búsqueda", iaCo: "2.478", clasicaCo: "1.912", iaPy: "1.152" },
    { label: "Consultas seguidas (ráfaga)", iaCo: "1,99", clasicaCo: "1,34", iaPy: "1,59" },
    { label: "% última consulta de la sesión", iaCo: "66,0%", clasicaCo: "no confiable", iaPy: "79,5%" },
  ],
  termsIaCo:
    "aire acondicionado, blazer slim de caballero n105, ventilador solar, audífono inalámbricos f9 con power bank, dron mario con luces, perfumes, maquillaje, humidificador, creatina, masajeador",
  termsClasicaCo:
    "trapero, hidrolavadora, ventilador, organizador, nike, fumigadora, vitamina e, creatina, reloj, escritorio, makita, camara",
  termsIaPy:
    "shilajit, gps, masajeador, rodillera, creatina, faja, colageno, magnesio, perfumes, plasma pen, organizador, tobillera",
  termsClasicaPyHist:
    "faja, masajeador, mochila, camara, organizador, perfume, cepillo, reloj, crema, parche",
  conclusionCo:
    "Con IA, 2 de cada 3 búsquedas son la última de la sesión (66%). Con Clásica no se puede leer ese campo (está roto). Las frases con IA son largas y específicas; con Clásica, cortas. Primera evidencia de que en Colombia usan la IA para lo que se diseñó. Que refinen más (1,99 vs 1,34) puede ser explorar o no encontrar a la primera — el borrador de CSAT ya está listo para resolverlo.",
  conclusionPy:
    "En Paraguay, 8 de cada 10 búsquedas IA son la última de la sesión (79,5%). En Colombia, solo 2 de cada 3 (66%). Puede ser catálogo más chico o que paran antes. Siguen escribiendo corto, como en Clásica. Sin encuesta no se sabe si «encuentran» o se rinden.",
};

export const S4_ORDERS = {
  rows: [
    { label: "CO — pedidos creados/día (prom.)", before: "—", s3: "102.571", s4: "97.516 (−4,9%)" },
    { label: "CO — pedidos movilizados/día (prom.)", before: "—", s3: "85.137", s4: "73.811 (−13,3%)" },
    { label: "CO — personas que buscaron", before: "—", s3: "17.637", s4: "17.441 (−1,1%)" },
    { label: "PY — pedidos creados/día (prom.)", before: "1.284", s3: "1.325 (+3,3%)", s4: "1.301 (−1,8%)" },
    { label: "PY — pedidos movilizados/día (prom.)", before: "907", s3: "1.005 (+10,8%)", s4: "947 (−5,8%)" },
    { label: "PY — personas que buscaron", before: "64", s3: "1.265", s4: "1.291 (+2,1%) ×20 vs. antes" },
  ],
  conclusion:
    "En Paraguay, quien busca se multiplicó ×20 (64→1.291) y los pedidos creados/día casi no se mueven (1.284→1.301, −1,8% vs S3). Usar el buscador no es crear más órdenes. En Colombia, los pedidos cayeron más (−4,9% creados, −13,3% movilizados) que la búsqueda (−1,1%): la caída no parece del buscador. El archivo no dice qué órdenes salieron de IA, Clásica o imagen.",
};

export const S4_COUNTRIES = {
  rows: [
    { pais: "Colombia", clasica: "80,4%", ia: "10,5%", id: "9,1%", ratio: "1,15×" },
    { pais: "Ecuador", clasica: "71,8%", ia: "21,3%", id: "6,9%", ratio: "3,11×" },
    { pais: "Chile", clasica: "66,8%", ia: "26,4%", id: "6,8%", ratio: "3,89×" },
    { pais: "México", clasica: "76,6%", ia: "23,4%", id: "0,0%", ratio: "ID no se usó" },
  ],
  conclusion:
    "En los cuatro, Clásica gana porque es el default (67–80%). Colombia es el raro: quienes se salen eligen IA e ID casi igual (10,5% vs 9,1%). En Ecuador, Chile y México eligen IA 3–4 veces más (21–26%). No compares absolutos: ahí se miden eventos, no el modo derivado.",
};

export const FILTER_PCT = {
  note: "Cambio de modo a propósito (clic, no el default). El número suelto engaña: 133 en Paraguay es 6,3% del catálogo y 10,3% de quienes buscan.",
  headers: ["Filtro", "S4 personas", "% del catálogo", "% de quienes buscan"],
  rows: [
    ["CO — IA", "1.824", "7,2%", "10,5%"],
    ["CO — imagen", "2.856", "11,2%", "16,4%"],
    ["CO — Clásica", "no reportado en S4 (S3: 396)", "S3: 1,5%", "S3: 2,2%"],
    ["PY — imagen", "133", "6,3%", "10,3%"],
    ["PY — Clásica", "12", "0,6%", "0,9%"],
    ["PY — IA", "no reportado en S4 (S3: 2)", "S3: 0,1%", "S3: 0,2%"],
  ],
  seriesHeaders: ["", "S1", "S2", "S3", "S4"],
  series: [
    ["CO imagen · % catálogo", "11,2%", "11,5%", "11,2%", "11,2%"],
    ["CO imagen · % buscan", "16,3%", "16,7%", "16,3%", "16,4%"],
    ["PY imagen · % catálogo", "5,1%", "4,9%", "5,3%", "6,3%"],
    ["PY imagen · % buscan", "9,0%", "8,5%", "9,7%", "10,3%"],
    ["PY Clásica · % catálogo", "0,6%", "0,2%", "0,4%", "0,6%"],
    ["PY Clásica · % buscan", "1,0%", "0,4%", "0,7%", "0,9%"],
  ],
};

export const EVENT_X = {
  note: "La X limpia lo escrito en la barra. Solo hay detalle en Paraguay S1 y S2. S3 y S4: el corte semanal no trajo el evento — no es que nadie limpie; no vino en el resumen. Colombia en 0 las dos semanas que sí se midió = hueco de tracking.",
  headers: ["", "S1", "S2", "S3", "S4"],
  rows: [
    ["PY — personas", "124", "160", "no vino en el corte", "no vino en el corte"],
    ["PY — % de quienes buscan", "12,9%", "15,2%", "—", "—"],
    ["PY — % del catálogo", "7,3%", "8,8%", "—", "—"],
    ["CO — personas", "0 (gap)", "0 (gap)", "no vino en el corte", "no vino en el corte"],
  ],
};

export const FAV_CONTACT_PCT = {
  note: "Serie limpia: S3 recalculado y S4. S1/S2 no entran: Paraguay iba en cero y Colombia subcontado. El % del catálogo es el honesto. El % de quienes buscan puede pasar de 100% (el evento no es solo de quien buscó).",
  headers: ["", "S3 personas", "S3 % catálogo", "S3 % buscan", "S4 personas", "S4 % catálogo", "S4 % buscan"],
  rows: [
    ["CO — favoritos", "9.083", "35,3%", "51,5%", "8.940", "35,1%", "51,3%"],
    ["CO — escriben al cliente", "11.334", "44,1%", "64,3%", "11.235", "44,1%", "64,4%"],
    ["PY — favoritos", "1.016", "43,6%", "80,3%", "1.023", "48,2%", "79,2%"],
    ["PY — escriben al cliente", "1.278", "54,8%", "~100%", "1.244", "58,6%", "96,4%"],
  ],
  conclusion:
    "En personas, S3→S4 está plano. En Paraguay el % sobre catálogo sube (43,6%→48,2% favoritos; 54,8%→58,6% mensajes) porque el catálogo cayó (−8,9%), no porque haya más gente guardando. Vs línea base PY (213 favoritos y 134 mensajes): eso sí es el salto post-IA.",
};

export const LINEA_BASE = {
  intro:
    "La IA quedó como modo por defecto en Paraguay el 17 de junio de 2026. Esta vista compara la última semana completa antes (5–12 jun) contra S1–S4. Solo Paraguay: en Colombia el default nunca cambió.",
  volume: {
    headers: ["", "Antes (5–12 jun)", "S1", "S2", "S3", "S4"],
    rows: [
      ["Usuarios en catálogo", "1.006", "1.696", "1.822", "2.330", "2.122"],
      ["Usuarios en búsqueda escrita", "64", "962", "1.055", "1.265", "1.291"],
      ["% que busca, de los que entran", "6,4%", "56,7%", "57,9%", "54,3%", "60,8%"],
    ],
  },
  volumeBars: [
    { label: "Antes", value: "6,4%", pct: 10.5 },
    { label: "S1", value: "56,7%", pct: 93.3 },
    { label: "S2", value: "57,9%", pct: 95.2 },
    { label: "S3", value: "54,3%", pct: 89.3 },
    { label: "S4", value: "60,8%", pct: 100 },
  ],
  volumeConclusion:
    "Antes, solo 6,4% de quienes entraban al catálogo usaban el buscador; después es más de la mitad (54–61%). En S4 el catálogo bajó (−8,9%, 2.330→2.122) y quien busca subió (54,3%→60,8%, 1.265→1.291): la caída es tráfico sin intención de buscar.",
  modes: {
    headers: ["Modo", "Antes (5–12 jun)", "S3 (10–17 jul)", "S4 (17–24 jul)"],
    rows: [
      ["Clásica", "≈100% (64 de 64) — default", "0,7% (9 de 1.265)", "0,9% (12 de 1.291) — se elige a propósito"],
      ["IA", "≈0% (0 de 64) — había que elegirla", "99,2% (1.255 de 1.265)", "99,1% (1.279 de 1.291) — ahora es el default"],
      ["ID", "≈0% (0 de 64)", "0,1% (1 de 1.265)", "0% (0 de 1.291)"],
    ],
  },
  modesConclusion:
    "Antes, las 64 personas que buscaron lo hicieron por Clásica porque era el default — el mismo comportamiento de Colombia hoy. Después se invierte y se sostiene en S4 (IA 99,1%). Lo que mueve la aguja es el efecto default, no que la gente rechazara la IA: nunca la probó en volumen porque no iba a buscarla.",
  interaction: {
    headers: ["", "Antes", "S1 (reportado)", "S2 (reportado)", "S3 (recalculado)", "S4"],
    rows: [
      ["Guardó como favorito", "213 (59,0%)", "0 (bug)", "0 (bug)", "1.016", "1.023"],
      ["Escribió al cliente", "134 (37,1%)", "no se registró (bug)", "no se registró (bug)", "1.278", "1.244"],
      ["Buscó con foto", "14 (3,9%)", "87", "90", "123", "133"],
    ],
  },
  interactionNote:
    "S1 y S2 muestran la cifra reportada en su momento. La corrección solo se aplicó retroactivamente a S3. Fuente también: CSV de seguimiento (fila línea base).",
  interactionConclusion:
    "Favoritos sí funcionaba antes del lanzamiento: 213 veces en una semana (59% de la interacción). Después se fue a cero tres semanas — no porque la gente dejara de usarlo, sino porque el rediseño rompió el registro. En S4 se corrigió. La gente sí interactuaba: 1.023 favoritos (48,2% del catálogo) y 1.244 mensajes (58,6%).",
  retencion: {
    headers: ["Qué se mide", "Antes", "S1", "S2", "S3", "S4"],
    rows: [
      ["Búsqueda escrita", "48,4%", "57,3%", "64,3%", "64,7%", "64,4%"],
      ["Búsqueda por foto", "21,4%", "34,5%", "33,3%", "34,1%", "39,1%"],
    ],
  },
  retencionConclusion:
    "Vs antes: escrita +16,0 puntos (48,4%→64,4%) e imagen +17,7 (21,4%→39,1%). La foto es la que más se mueve en S4. No se puede decir que sea solo el buscador, pero más búsqueda, más retención y más interacción apuntan al mismo lado.",
};

export const COMPARATIVO_SUMMARY = {
  headers: ["Métrica", "Colombia S1 → S4", "Paraguay S1 → S4"],
  rows: [
    ["Usuarios en catálogo", "24.045 → 24.547 → 25.718 → 25.441", "1.696 → 1.822 → 2.330 → 2.122 ↓"],
    ["Usuarios en búsqueda escrita", "16.490 → 16.925 → 17.637 → 17.441", "962 → 1.055 → 1.265 → 1.291"],
    ["Clásica (share)", "79,8% → 79,4% → 80,6% → 80,4%", "1,0% → 0,4% → 0,7% → 0,9% ↑"],
    ["IA (share)", "10,5% → 10,9% → 10,4% → 10,5%", "98,8% → 99,3% → 99,2% → 99,1%"],
    ["Reversión funnel a Clásica", "1,97% → 1,48% → 2,44% → 2,29%", "0,83% → 0,33% → 0,82% → 0,94% ↑"],
    ["Resultados → Detalle", "17,96% → 17,92% → 18,42% → 18,37%", "34,81% → 34,06% → 30,43% → 29,97%"],
    ["Hizo algo (CO pedido / PY mensaje)", "2,19% → 2,31% → 2,12% → 2,08%", "7,26% → 7,68% → 5,89% → 5,72%"],
    ["Llegó al final (CO entrega / PY pedido manual)", "1,67% → 1,73% → 1,60% → 1,42% ↓", "4,99% → 6,54% → 4,93% → 4,38% ↓"],
    ["Favoritos (cifra corregida)", "— → — → 9.083 → 8.940", "— → — → 1.016 → 1.023"],
    ["Escriben al cliente (corregido)", "— → — → 11.334 → 11.235", "— → — → 1.278 → 1.244"],
    ["Filtro IA", "1.739 → 1.840 → 1.842 → 1.824", "1 → 1 → 2 → —"],
    ["Filtro imagen", "2.686 → 2.819 → 2.881 → 2.856", "87 → 90 → 123 → 133 ↑"],
    ["Filtro Clásica", "355 → 328 → 396 → —", "10 → 4 → 9 → 12 ↑"],
    ["Retención escrita", "72,0% → 77,5% → 75,1% → 76,5%", "57,3% → 64,3% → 64,7% → 64,4%"],
    ["Retención imagen", "47,6% → 56,3% → 53,9% → 54,6%", "34,5% → 33,3% → 34,1% → 39,1% ↑"],
  ],
  note: "S3 tuvo retrocesos; S4 confirma que fueron ruido de una semana: retención CO se recupera y funnel PY se estabiliza. Lo que sí es tendencia de dos semanas: reversión a Clásica en PY. Favoritos/contacto no tienen cifra comparable en S1–S2 (definición cambió al corregir el tracking). Contra línea base PY: búsqueda 6,4%→54–61%, retención escrita 48,4%→64,4%, imagen 21,4%→39,1%.",
};

export const REVERSION_SERIES = [
  { week: "S1", pct: "1,0%", n: "10u", bar: 3.3 },
  { week: "S2", pct: "0,4%", n: "4u", bar: 1.3 },
  { week: "S3", pct: "0,7%", n: "9u", bar: 2.3 },
  { week: "S4", pct: "0,9%", n: "12u", bar: 3.0 },
];

export const REVERSION_FUNNEL = [
  { week: "S1", pct: "0,83%", bar: 2.8 },
  { week: "S2", pct: "0,33%", bar: 1.1 },
  { week: "S3", pct: "0,82%", bar: 2.7 },
  { week: "S4", pct: "0,94%", bar: 3.1 },
];

export const EVENTS_VS_USERS = {
  note: "Ni S3 ni S4 incluyeron este desglose. Queda S1–S2. Fuente: dashboard de producto, no el resumen semanal.",
  co: {
    headers: ["Colombia", "Eventos S1", "Usuarios S1", "Eventos S2", "Usuarios S2"],
    rows: [
      ["Búsqueda escrita total", "114.150", "16.490", "121.180", "16.925"],
      ["Búsqueda por imagen", "7.703", "2.686", "8.472", "2.819"],
      ["Filtro Clásica (clic explícito)", "571", "355", "502", "328"],
      ["Filtro IA (clic explícito)", "4.284", "1.739", "4.600", "1.840"],
      ["Filtro ID (clic explícito)", "4.050", "1.600", "4.380", "1.653"],
      ["Lupa (clic ícono de búsqueda)", "208", "151", "225", "166"],
      ["X limpieza", "0", "0", "0", "0"],
    ],
  },
  py: {
    headers: ["Paraguay", "Eventos S1", "Usuarios S1", "Eventos S2", "Usuarios S2"],
    rows: [
      ["Búsqueda escrita total", "4.157", "962", "4.482", "1.055"],
      ["Búsqueda por imagen", "148", "87", "148", "90"],
      ["Filtro Clásica (clic explícito)", "10", "10", "4", "4"],
      ["Filtro IA (clic explícito)", "1", "1", "1", "1"],
      ["Filtro ID (clic explícito)", "5", "2", "3", "3"],
      ["Lupa (clic ícono de búsqueda)", "811", "238", "877", "244"],
      ["X limpieza", "166", "124", "245", "160"],
    ],
  },
  reading:
    "En Colombia, cada persona que prueba imagen genera ~2,9 clics (7.703/2.686 S1); en Paraguay ~1,7 (148/87). El evento Lupa es, en usuarios, casi tan grande como la búsqueda por imagen: revisar si mide intención real o aperturas accidentales. Dato llamativo: imagen en Paraguay registra exactamente 148 eventos en S1 y S2, mientras los usuarios sí suben (87→90) — confirmar que no sea un valor congelado.",
};

export const FINDINGS: { group: string; tone: Tone; items: { title: string; body: string }[] }[] = [
  {
    group: "Qué sí está pasando",
    tone: "green",
    items: [
      {
        title: "Paraguay usa la IA y se queda con ella",
        body: "99,1% de quienes buscan lo hacen en IA (es el default). La retención < mes 1 de IA está en ~65% y no se cayó ni con el salto de gente nueva ni con la caída de catálogo. Eso es adopción y hábito. No es todavía calidad de resultados.",
      },
      {
        title: "Favoritos y contacto: la interacción es alta y ya se ve",
        body: "En S4, de quienes buscan: ~51% en Colombia y ~79% en Paraguay guardan favorito; ~64% y ~96% escriben al cliente (el mensaje puede incluir a quien no buscó). Del catálogo: 35% / 48% favoritos. S3→S4 plano en personas. Vs línea base PY (213 y 134) el salto es enorme. Imagen en PY es la única que crece las 4 semanas: 9,0%→10,3% de quienes buscan.",
      },
      {
        title: "En Colombia, con IA escriben como se diseñó",
        body: "Frases largas («blazer slim de caballero n105»). Con Clásica, palabras cortas («trapero»). Primera evidencia de comportamiento, no de que los resultados sean buenos.",
      },
    ],
  },
  {
    group: "Usar mucho no es calidad buena",
    tone: "red",
    items: [
      {
        title: "La IA encuentra algo; no lo correcto (evaluación Dropi Cup)",
        body: "A mano, golden set PY: IA cubre 70% de los términos de campaña; Clásica, 1%. El score de relevancia es 21%: aparecen productos por la descripción, no porque sean la oferta o la copa. Tail (frases largas) ~90%; head (genéricos tipo «audífonos») ~54%, por nombres del catálogo que no coinciden con cómo busca la gente.",
      },
      {
        title: "Por eso hay que preguntar, no inferir",
        body: "En Paraguay, 8 de cada 10 búsquedas IA son la última de la sesión (79,5%). Puede ser que encuentren o que se rindan. Laura y Catalina coordinan el lanzamiento de la encuesta de satisfacción en Paraguay. Hasta entonces, ráfagas y «última consulta» son hipótesis.",
      },
    ],
  },
  {
    group: "Lo demás, en corto",
    tone: "amber",
    items: [
      {
        title: "Más búsqueda en Paraguay no creó más órdenes",
        body: "Quien busca: ×20 (64→1.291). Pedidos creados/día: casi iguales (1.284→1.301, −1,8% vs S3). Usar el buscador y crear una orden son dos pasos.",
      },
      {
        title: "Reversión a Clásica: 0,9%, dos semanas al alza",
        body: "12 de 1.291 personas (0,9% de quienes buscan; 0,6% del catálogo). Lejos del 30%. Si sube una tercera semana, investigar.",
      },
      {
        title: "Colombia prueba IA menos que Ecuador, Chile y México",
        body: "Mismo default (Clásica). Ahí IA llega a 21–26%; en Colombia, 10,5% y queda parejo con ID (9,1%).",
      },
    ],
  },
];

export const IA_COST = {
  title: "Costo reportado — a confirmar en esta reunión",
  source: "Estimado de pipelines AWS Bedrock que nos pasaron. No es factura. No usarlo como costo unitario de cada búsqueda en producto hasta cruzarlo con AWS.",
  caveat:
    "174 RPD de «búsqueda semántica» no cuadra con ~17.441 personas buscando en Colombia en S4. Parece costo de pipelines (caption/embed), no de cada búsqueda de usuario. Imágenes: $0 Bedrock, pero sí hay compute EC2/Fargate sin estimar.",
  headers: ["Pipeline", "RPD promedio", "RPD pico", "Modelo", "Costo Bedrock / mes"],
  rows: [
    ["Búsqueda de imágenes", "117", "173", "Modelo local", "$0 (solo compute EC2/Fargate)"],
    ["Inserción/actualización imágenes", "159", "226", "Modelo local", "$0 (solo compute EC2/Fargate)"],
    ["Búsqueda semántica", "174", "255", "Titan Text Embed v2", "~$0,002"],
    ["Inserción/actualización semántico", "487", "658", "Nova Lite + Titan Text Embed v2", "~$2,03 – $2,74"],
    ["Total citado", "—", "—", "—", "~$2 – $3 USD / mes"],
  ],
};

export const NEXT_STEPS: { priority: "alta" | "media" | "baja"; title: string; body: string }[] = [
  {
    priority: "alta",
    title: "Pausar la promoción activa de «Búsqueda con IA»",
    body: "Decidido: no se sigue promocionando por ahora. La función sigue en Paraguay de forma orgánica mientras se priorizan las optimizaciones técnicas.",
  },
  {
    priority: "alta",
    title: "Lanzar la encuesta de satisfacción en Paraguay (Laura y Catalina)",
    body: "Coordinar el lanzamiento. Sirve para saber si el alza en búsqueda es adopción sana o gente que no encuentra. El borrador ya está; falta prenderlo.",
  },
  {
    priority: "alta",
    title: "Diseñar la interfaz del buscador unificado (Diana)",
    body: "Objetivo a mediano y largo plazo: un solo buscador. La persona no elige entre IA, Clásica e imagen. Diana arranca el diseño.",
  },
  {
    priority: "alta",
    title: "Migrar a una arquitectura más robusta (José)",
    body: "Resolver errores 500, mejorar la calidad de resultados y dejar el motor listo antes de desplegar en otros países. El 505 de scroll en PY queda dentro de este trabajo.",
  },
  {
    priority: "alta",
    title: "Confirmar el estimado de costo Bedrock contra factura AWS",
    body: "Nos pasaron ~$2–3 USD/mes de pipelines. Cruzar con factura Bedrock y el compute de imágenes (EC2/Fargate). 174 RPD no es el volumen de gente que busca.",
  },
  {
    priority: "media",
    title: "Seguir de cerca la reversión a Clásica en Paraguay",
    body: "Dos semanas subiendo (0,4%→0,7%→0,9%). Si sube una tercera en S5, investigar. Sigue lejos del 30%.",
  },
  {
    priority: "media",
    title: "Pedir la base cruda de Clásica en CSV, filtrada CO y PY",
    body: "La de S4 se cortó en el límite de Excel antes de incluir Paraguay. Sin ella no se comparan términos Clásica vs IA dentro de PY.",
  },
  {
    priority: "media",
    title: "Averiguar qué generó la primera caída de catálogo en Paraguay (−8,9%)",
    body: "Confirmar si es puntual o tendencia. El % que busca subió, así que la caída parece tráfico pasivo.",
  },
  {
    priority: "media",
    title: "Revisar con datos el campo «es_consulta_final» de Clásica",
    body: "Marca 100% verdadero. No se usó para conclusiones. Confirmar causa antes de usarlo.",
  },
  {
    priority: "media",
    title: "Pedir volumetría de órdenes desglosada por tipo de búsqueda",
    body: "Hoy solo da el total diario por país. Sin eso no se sabe si el buscador genera más órdenes en Paraguay.",
  },
  {
    priority: "baja",
    title: "Investigar qué hacen distinto Ecuador, Chile y México",
    body: "Mismo default que Colombia, adopción de IA 21–26% vs 10,5%. Queda en pausa el despliegue a otros países hasta que José cierre calidad.",
  },
  {
    priority: "baja",
    title: "Confirmar si el desglose eventos vs. usuarios se sigue reportando",
    body: "Ni S3 ni S4 lo incluyeron como S1 y S2. Confirmar si cambió el formato del reporte.",
  },
  {
    priority: "baja",
    title: "Mantener el corte semanal con la misma metodología",
    body: "Clásica derivada en CO / IA derivada en PY. Serie de 6–8 semanas. Prueba T cuando la muestra lo permita.",
  },
];

export const VOCES = [
  {
    pattern: "Dos formas de llegar al catálogo",
    evidence: "cualitativa",
    body: "Unas personas ya traen el producto de TikTok, Ads Library o herramientas espía y entran a Dropi a verificar si está (Juan Camilo, Óscar). Otras exploran desde cero: recientes, económicos, proveedores de confianza (Andrea). El buscador tiene que servir a las dos: «encontrar este» y «ver qué hay».",
  },
  {
    pattern: "Quienes sí usan IA la tratan como buscador de intención",
    evidence: "cualitativa",
    body: "Juan Camilo empieza por IA; si falla, imagen; Clásica al último. César escribe el problema o el ingrediente («productos con caléndula»). Thomas está satisfecho pero prefiere frases cortas: si alarga, «la IA se pierde». Coincide con S4 cuantitativo en Colombia (frases largas en IA) y con el matiz de Paraguay (siguen cortas).",
  },
  {
    pattern: "Varias personas no saben que la IA existe o no la necesitan",
    evidence: "cualitativa",
    body: "Mireya, Óscar, Andrea y Johanny no usaron IA o no conocían que acepta lenguaje natural para filtros. Andrea y Juan Camilo temen ser demasiado específicas: creen que el sistema oculta productos. El tooltip de las 3 primeras veces no está cerrando esa brecha para todo el mundo.",
  },
  {
    pattern: "La búsqueda por imagen polariza",
    evidence: "cualitativa",
    body: "Óscar la llama espectacular y es su plan A. Andrea la usa cuando no sabe el nombre técnico. Johanny reportó timeout («operation timed out después de 30.000 ms») y alucinaciones: subió un destornillador eléctrico y le salieron crema de colágeno, micrófono y secador. Mireya: la foto dice «no existe» y el mismo producto sí aparece por texto.",
  },
  {
    pattern: "Clásica gana cuando la gente quiere «ver más opciones»",
    evidence: "cualitativa",
    body: "Esteban: «me salen más opciones con el clásico que con el de IA, entonces termino usando más ese». Encaja con la retención más alta de Clásica en Colombia (cuantitativa, ~82% vs ~53% IA) y con la reversión mínima pero al alza en Paraguay.",
  },
  {
    pattern: "Dolores que el buscador no resuelve solo",
    evidence: "cualitativa",
    body: "Andrea: favoritos que desaparecen horas después. Juan Camilo: proveedores que categorizan mal a propósito. Nombres imprecisos («Neurogom» solo salió como «focus»). Johanny: el nombre tiene que ser «demasiado exacto». Estos dolores viven en catálogo y datos de producto, no solo en el modo de búsqueda.",
  },
];
