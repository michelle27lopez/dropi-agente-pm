// ─────────────────────────────────────────────────────────────────────────────
// Research de novedades — junio 2026 · RES-LOG-NOV-001
//
// Fuente única: logistica-lab/proyectos/novedad-dueno-triaje/research-novedades-jun2026.md
// Data cruda: export Power BI `data (11).xlsx` (Año=2026, Mes=JUN), 702 filas,
// 10 países, 42 pares país×carrier. Observación del módulo: 19 fichas en
// producción entre el 24 y el 25 de agosto (Colombia y Ecuador), solo lectura.
//
// Aquí no se calcula nada: se transcribe lo que el research ya defendió, con
// su estado y su fuente. Si una cifra cambia, cambia en el research primero.
//
// Las tres cifras que hay que declarar SIEMPRE al presentarlo:
//   · `rescate` viene del export, no se calculó acá, y NO suma 100% con
//     devolución: faltan 78.914 novedades (8,7% global · 46,1% en México).
//   · `techo` es construcción propia (P75 del motivo sobre celdas ≥300), NO es
//     meta, NO es pronóstico y NO es compromiso de KR.
//   · todo es asociación, no causa. Ningún hallazgo prueba causalidad.
// ─────────────────────────────────────────────────────────────────────────────

import type { Tone } from "../_components/ui/tone";

export const RESEARCH = {
  id: "RES-LOG-NOV-001",
  fecha: "24–25 de agosto de 2026",
  periodo: "Junio 2026",
  alcance: "10 países · 42 pares país×transportadora · 324 etiquetas",
  tickets: ["PRM-1512", "PRM-1523", "PRM-1580"],
  docRepo:
    "https://github.com/jaimeguevara-dropi/dropi-agente-pm/blob/main/logistica-lab/proyectos/novedad-dueno-triaje/research-novedades-jun2026.md",
  artifact: "https://claude.ai/code/artifact/eca3603b-444a-4e81-9a49-4e781ea63a7b",
};

export const UNIVERSO = {
  novedades: 911168,
  rescatadas: 154931,
  rescatePct: 17.0,
  devueltas: 677323,
  devolucionPct: 74.3,
  sinExplicar: 78914,
  sinExplicarPct: 8.7,
  techo: 95688,
};

// ── Los siete insights (I1–I7 del research) ──────────────────────────────────
// El orden es el del research y no es alfabético ni por tamaño: es el orden en
// que hay que leerlos para que la conclusión se sostenga.
export type Insight = {
  id: string;
  titulo: string;
  detalle: string;
  /** Ámbar donde hay que frenar una decisión; rojo donde hay pérdida; neutro donde informa. */
  tone: Tone;
  /** [data] export · [obs] observado en producción · [hipótesis] a validar. */
  fuente: "data" | "obs" | "hipotesis";
};

export const INSIGHTS: Insight[] = [
  {
    id: "I1",
    titulo: "El top por volumen engaña: mismo tamaño, diez veces la oportunidad",
    detalle:
      "En Colombia las dos etiquetas más grandes tienen casi el mismo volumen y techos incomparables: DESTINATARIO SE REHUSA A RECIBIR (127.891, techo +4.641) contra COORDINAR LA ENTREGA (118.988, techo +45.503). Priorizar por volumen lleva al motivo equivocado.",
    tone: "warn",
    fuente: "data",
  },
  {
    id: "I2",
    titulo: "El carrier no explica el resultado; el país sí",
    detalle:
      "Fixy rescata 11,0% en Argentina y 43,9% en Paraguay. Servientrega 16,6% en Ecuador y 45,6% en Panamá. Mismo operador, hasta 33 puntos de diferencia. Y HL Express, consistente entre sus dos países (3,5 pts), demuestra que la consistencia es posible.",
    tone: "neutral",
    fuente: "data",
  },
  {
    id: "I3",
    titulo: "En 6 de 10 países, arreglar un carrier es arreglar el país",
    detalle:
      "México 90,3% Quality Post · Panamá 95,1% HL Express · Costa Rica y Guatemala 100% un solo carrier · Chile 78,2% Starken · Argentina 76,5% Fixy. Quality Post es el peor del dataset en 5 de los 12 motivos y es el 90,3% de México: punto único de falla.",
    tone: "risk",
    fuente: "data",
  },
  {
    id: "I4",
    titulo: "No hay un problema: hay tres mezclados",
    detalle:
      "De producto (falta la acción: fecha, ubicación) en Colombia y Argentina · de proveedor en México, Guatemala y Ecuador/Servientrega · de encuadre (se pelea lo irrecuperable) en Chile y en el 35% global de intención rota. Meterlos en un solo proyecto es el error a evitar.",
    tone: "warn",
    fuente: "data",
  },
  {
    id: "I5",
    titulo: "El único consenso mundial: el arrepentimiento no se recupera",
    detalle:
      "Spread de 7 puntos entre el mejor país (9,3%) y el peor (1,9%) sobre 319.854 novedades al mes. Es la decisión más fácil que Dropi tiene sobre la mesa: devolver rápido y barato.",
    tone: "neutral",
    fuente: "data",
  },
  {
    id: "I6",
    titulo: "El volumen dice dónde está el problema; la densidad, dónde rinde el esfuerzo",
    detalle:
      "Chile es 8,1% del volumen y 1,6% del techo (densidad 2,3%): no se trabaja. Argentina es 0,8% del volumen y 33,1% de densidad: el mejor rendimiento por unidad de esfuerzo del mapa.",
    tone: "neutral",
    fuente: "data",
  },
  {
    id: "I7",
    titulo: "Cinco de las ocho acciones país no son de producto",
    detalle:
      "Son conversaciones con proveedores o copiar procesos entre países — las más rápidas y baratas. Lo más barato de este research no es construir: es ir a ver a Ecuador/Gintracom (mejor en 4 de 12 motivos) y a Panamá/HL Express.",
    tone: "ok",
    fuente: "data",
  },
];

// ── El hallazgo central: acción vs descripción ───────────────────────────────
// Las 324 etiquetas clasificadas por QUÉ LE DICEN AL SISTEMA, no por causa.
export const TIPOS_ETIQUETA = [
  {
    tipo: "A · El destinatario pide algo concreto",
    ejemplos: "solicita cambio de dirección, reprogramar, cita previa, entrega en punto",
    etiquetas: 31,
    novedades: 68422,
    mix: 7.5,
    rescate: 33.7,
    devolucion: 65.2,
    tone: "ok" as Tone,
  },
  {
    tipo: "B · Solo describe un estado",
    ejemplos: "coordinar la entrega, no hay quien reciba, dirección no existe",
    etiquetas: 248,
    novedades: 514720,
    mix: 56.5,
    rescate: 21.5,
    devolucion: 70.7,
    tone: "warn" as Tone,
  },
  {
    tipo: "C · La intención de compra se rompió",
    ejemplos: "rehúsa, rechaza, cancela, no paga",
    etiquetas: 45,
    novedades: 328026,
    mix: 36.0,
    rescate: 6.4,
    devolucion: 81.9,
    tone: "risk" as Tone,
  },
];

/** Los dos A/B naturales: misma situación física, etiqueta distinta, desenlace distinto. */
export const PARES_AB = [
  {
    situacion: "Hay que coordinar la entrega",
    factor: "2,6×",
    sin: { etiqueta: "COORDINAR LA ENTREGA · ESPERANDO PROGRAMACIÓN", novedades: 123226, rescate: 14.7 },
    con: { etiqueta: "Reprogramar entrega · solicita fecha · Cita Previa", novedades: 48940, rescate: 37.9 },
  },
  {
    situacion: "El comprador ya no está en esa dirección",
    factor: "3,7×",
    sin: { etiqueta: "Destinatario se trasladó · CAMBIO DE DOMICILIO", novedades: 6064, rescate: 10.5 },
    con: { etiqueta: "SOLICITA CAMBIO DE DIRECCIÓN", novedades: 6439, rescate: 38.8 },
  },
];

// ── El spread: misma etiqueta, mismo carrier, distinto país ──────────────────
// Solo pares con n ≥ 200 novedades en junio.
export const SPREAD_REPROGRAMAR = [
  { label: "Ecuador · Veloces", valor: 60.7, tone: "ok" as Tone, detalle: "2.292 novedades" },
  { label: "Costa Rica · HL", valor: 56.1, tone: "ok" as Tone, detalle: "881 novedades" },
  { label: "Panamá · HL", valor: 51.1, tone: "ok" as Tone, detalle: "5.500 novedades" },
  { label: "Colombia · JAMV", valor: 48.0, tone: "warn" as Tone, detalle: "2.632 novedades" },
  { label: "Colombia · Veloces", valor: 35.3, tone: "warn" as Tone, detalle: "12.138 novedades" },
  { label: "México · Veloces", valor: 26.7, tone: "risk" as Tone, detalle: "1.429 novedades" },
];

// ── El techo por clúster de causa ────────────────────────────────────────────
export const CLUSTERES = [
  { cluster: "Coordinación", novedades: 186011, rescate: 21.3, p75: 51.3, techo: 55703, tone: "risk" as Tone },
  { cluster: "Contacto / ausencia", novedades: 178310, rescate: 30.4, p75: 39.0, techo: 15272, tone: "warn" as Tone },
  { cluster: "Dirección", novedades: 136789, rescate: 20.7, p75: 29.1, techo: 11458, tone: "warn" as Tone },
  { cluster: "Otro / operativo", novedades: 80407, rescate: 13.7, p75: 23.6, techo: 7970, tone: "warn" as Tone },
  { cluster: "Rechazo", novedades: 313984, rescate: 5.9, p75: 7.4, techo: 4412, tone: "neutral" as Tone },
  { cluster: "Pago (COD)", novedades: 15667, rescate: 18.9, p75: 24.4, techo: 873, tone: "neutral" as Tone },
];

// ── El triaje ────────────────────────────────────────────────────────────────
export const TRIAJE = [
  {
    veredicto: "Soltar",
    volumen: 314000,
    mix: 34,
    criterio: "Intención rota · rescate < 10%",
    accion:
      "Devolver rápido y barato. Cada día extra en red es costo puro sin upside. Ya estaba como no-objetivo en el spec.",
    tone: "neutral" as Tone,
  },
  {
    veredicto: "Rediseñar",
    volumen: 230000,
    mix: 25,
    criterio: "Volumen alto + brecha demostrada contra el P75",
    accion:
      "Aquí vive el techo: COORDINAR LA ENTREGA, DIRECCIÓN NO EXISTE, FIJA FECHA Y HORA, SE VISITA NO SE LOGRA.",
    tone: "risk" as Tone,
  },
  {
    veredicto: "Pelear",
    volumen: 110000,
    mix: 12,
    criterio: "Ya rescata ≥ 35% en algún país",
    accion:
      "No hay que construir nada: auditar el proceso del mejor y copiarlo donde rinde peor. Costo de desarrollo ≈ 0.",
    tone: "ok" as Tone,
  },
];

// ── Los diez países ──────────────────────────────────────────────────────────
export type PaisNovedad = {
  pais: string;
  novedades: number;
  rescate: number;
  devolucion: number;
  sinExplicar: number;
  etiquetas: number;
  carriers: number;
  motivoDominante: string;
  pctDominante: number;
  techo: number;
  /** Techo ÷ volumen: cuánto de lo que se cae ahí es recuperable. */
  densidad: number;
  lectura: string;
};

export const PAISES: PaisNovedad[] = [
  { pais: "Colombia", novedades: 541083, rescate: 15.6, devolucion: 83.4, sinExplicar: 1.1, etiquetas: 114, carriers: 10, motivoDominante: "Rechazo", pctDominante: 32.6, techo: 75399, densidad: 13.9, lectura: "73% del techo global. El premio no está en su motivo dominante: rechazo aporta +4.534 y reprogramación +51.926." },
  { pais: "México", novedades: 148596, rescate: 16.2, devolucion: 37.7, sinExplicar: 46.1, etiquetas: 110, carriers: 6, motivoDominante: "Rechazo", pctDominante: 37.1, techo: 12708, densidad: 8.6, lectura: "Fuera de comparación hasta que Data explique el 46,1% que no es ni entrega ni devolución." },
  { pais: "Ecuador", novedades: 103628, rescate: 24.3, devolucion: 75.5, sinExplicar: 0.1, etiquetas: 80, carriers: 4, motivoDominante: "Incidente carrier", pctDominante: 31.1, techo: 12032, densidad: 11.6, lectura: "31% son incidentes del carrier —DEVUELTO DE de Servientrega—. No se arregla con producto: se arregla con el carrier." },
  { pais: "Chile", novedades: 73833, rescate: 13.3, devolucion: 81.3, sinExplicar: 5.4, etiquetas: 30, carriers: 4, motivoDominante: "Rechazo", pctDominante: 74.7, techo: 1662, densidad: 2.3, lectura: "74,7% es rechazo puro. Invertir en recuperación en Chile no paga: lo que paga es devolver rápido." },
  { pais: "Panamá", novedades: 16859, rescate: 30.8, devolucion: 69.0, sinExplicar: 0.2, etiquetas: 25, carriers: 2, motivoDominante: "Reprogramación", pctDominante: 32.6, techo: 1126, densidad: 6.7, lectura: "Ya lo hace bien. Candidato a fuente del playbook." },
  { pais: "Paraguay", novedades: 15035, rescate: 28.9, devolucion: 70.3, sinExplicar: 0.8, etiquetas: 50, carriers: 4, motivoDominante: "No contactable", pctDominante: 41.0, techo: 827, densidad: 5.5, lectura: "41% no contactable, con 50 etiquetas para 15 mil novedades." },
  { pais: "Argentina", novedades: 7167, rescate: 12.1, devolucion: 87.4, sinExplicar: 0.4, etiquetas: 15, carriers: 2, motivoDominante: "Reprogramación", pctDominante: 55.8, techo: 2375, densidad: 33.1, lectura: "El peor rescate del mundo Dropi y el mejor rendimiento relativo: 33% de su volumen es recuperable." },
  { pais: "Costa Rica", novedades: 2381, rescate: 33.6, devolucion: 57.6, sinExplicar: 8.8, etiquetas: 22, carriers: 1, motivoDominante: "Reprogramación", pctDominante: 37.0, techo: 105, densidad: 4.4, lectura: "El mejor rescate del dataset, con un solo carrier." },
  { pais: "Guatemala", novedades: 1950, rescate: 16.1, devolucion: 83.9, sinExplicar: 0.0, etiquetas: 20, carriers: 1, motivoDominante: "No contactable", pctDominante: 34.8, techo: 263, densidad: 13.5, lectura: "Un solo carrier: arreglar el carrier es arreglar el país." },
  { pais: "Perú", novedades: 636, rescate: 23.9, devolucion: 58.3, sinExplicar: 17.8, etiquetas: 34, carriers: 2, motivoDominante: "Ausente en la visita", pctDominante: 29.9, techo: 50, densidad: 7.9, lectura: "Volumen marginal y 17,8% sin explicar: se lee con reserva." },
];

// ── Los doce motivos canónicos ───────────────────────────────────────────────
export type Motivo = {
  id: string;
  nombre: string;
  etiquetas: number;
  novedades: number;
  rescate: number;
  techoPct?: number;
  enJuego: number;
  triaje: "REDISEÑAR" | "PELEAR" | "MEJORAR" | "SOLTAR" | "revisar";
};

export const MOTIVOS: Motivo[] = [
  { id: "N01", nombre: "Reprogramación — pide otra fecha", etiquetas: 18, novedades: 170720, rescate: 21.1, techoPct: 53.3, enJuego: 54906, triaje: "REDISEÑAR" },
  { id: "N05", nombre: "Destinatario ausente en la visita", etiquetas: 22, novedades: 115255, rescate: 33.3, techoPct: 45.7, enJuego: 14298, triaje: "PELEAR" },
  { id: "N12", nombre: "Incidente operativo del carrier", etiquetas: 47, novedades: 38336, rescate: 8.8, techoPct: 35.4, enJuego: 10198, triaje: "REDISEÑAR" },
  { id: "N03", nombre: "Dirección insuficiente o errada", etiquetas: 35, novedades: 122256, rescate: 20.6, techoPct: 28.8, enJuego: 10052, triaje: "REDISEÑAR" },
  { id: "N04", nombre: "Destinatario no contactable", etiquetas: 10, novedades: 62728, rescate: 28.6, techoPct: 36.2, enJuego: 4729, triaje: "MEJORAR" },
  { id: "N08", nombre: "Rechazo — arrepentimiento", etiquetas: 35, novedades: 298570, rescate: 4.6, techoPct: 6.0, enJuego: 4127, triaje: "SOLTAR" },
  { id: "N11", nombre: "No paga — recaudo COD", etiquetas: 11, novedades: 31322, rescate: 27.4, techoPct: 35.2, enJuego: 2443, triaje: "MEJORAR" },
  { id: "N06", nombre: "Desconocido en la dirección", etiquetas: 10, novedades: 25008, rescate: 14.7, techoPct: 21.2, enJuego: 1617, triaje: "MEJORAR" },
  { id: "N07", nombre: "Entrega condicionada por acceso o punto", etiquetas: 15, novedades: 11474, rescate: 22.3, techoPct: 30.6, enJuego: 955, triaje: "MEJORAR" },
  { id: "N02", nombre: "Cambio de dirección", etiquetas: 9, novedades: 10111, rescate: 29.3, techoPct: 32.1, enJuego: 277, triaje: "PELEAR" },
  { id: "N10", nombre: "Rechazo — disconformidad con el producto", etiquetas: 13, novedades: 12054, rescate: 5.9, techoPct: 7.6, enJuego: 205, triaje: "SOLTAR" },
  { id: "N09", nombre: "Rechazo — no reconoce la compra", etiquetas: 10, novedades: 9230, rescate: 7.9, enJuego: 0, triaje: "SOLTAR" },
  { id: "N99", nombre: "Sin homologar (cola larga)", etiquetas: 89, novedades: 4104, rescate: 25.1, enJuego: 0, triaje: "revisar" },
];

// ── El módulo en producción ──────────────────────────────────────────────────
// 19 fichas observadas en Colombia y Ecuador entre el 24 y el 25 de agosto.
export const ARQUITECTURAS = [
  { id: "A", quien: "Coordinadora · CO", estructura: "select cerrado", catalogo: "Sí, por etiqueta (1–4 opciones)", mapa: false, fecha: false },
  { id: "B", quien: "Envía · CO", estructura: "4 campos de texto libre, vacíos", catalogo: "Ninguno", mapa: false, fecha: false, nota: "62,5% del volumen de Colombia" },
  { id: "C", quien: "Veloces · JAMV — CO y EC", estructura: "texto libre prellenado", catalogo: "Ninguno", mapa: true, fecha: false },
  { id: "D", quien: "Servientrega · EC", estructura: "3 campos libres vacíos", catalogo: "Ninguno", mapa: false, fecha: false, nota: "Ni siquiera dirección" },
  { id: "E", quien: "Gintracom · EC", estructura: "select cerrado", catalogo: "Fijo por carrier (3 opciones)", mapa: false, fecha: false },
];

/** Las 15 acciones que una novedad podría ofrecer, y cuáles existen hoy. */
export const ACCIONES = [
  { id: "A01", nombre: "Reprogramar fecha", estado: "no existe", nota: "El hueco grande: es el motivo N01" },
  { id: "A02", nombre: "Elegir franja horaria", estado: "no existe" },
  { id: "A03", nombre: "Cambiar dirección", estado: "existe", nota: "Envía y JAMV" },
  { id: "A04", nombre: "Compartir ubicación", estado: "parcial", nota: "View Map en Veloces y JAMV" },
  { id: "A05", nombre: "Completar la dirección", estado: "no existe" },
  { id: "A06", nombre: "Autorizar a un tercero", estado: "parcial", nota: "Campo Nombre" },
  { id: "A07", nombre: "Redirigir a punto de retiro", estado: "no existe" },
  { id: "A08", nombre: "Actualizar teléfono", estado: "existe", nota: "Campo Celular" },
  { id: "A09", nombre: "Re-confirmar la compra", estado: "no existe" },
  { id: "A10", nombre: "Cambiar el pago", estado: "no existe" },
  { id: "A11", nombre: "Reofrecer con descuento", estado: "no existe" },
  { id: "A12", nombre: "Autorizar apertura antes de pagar", estado: "no existe" },
  { id: "A13", nombre: "Reintentar sin cambios", estado: "existe", nota: "Sí + guardar" },
  { id: "A14", nombre: "Devolver al remitente", estado: "existe", nota: "Botón NO, y el default" },
  { id: "A15", nombre: "Devolución express", estado: "no existe" },
] as const;

/** Lo que el módulo no deja ver, verificable en pantalla. */
export const CEGUERAS = [
  {
    que: "Filtro por motivo",
    hoy: "Siete desplegables (dropshipper, supplier, bodega, departamento, ciudad, tienda, transportadora) y ninguno por tipo de novedad.",
    consecuencia: "El triaje pelear/soltar/rediseñar es inoperable en la interfaz: no hay forma de aislar las 314K de soltar.",
  },
  {
    que: "El motivo como dato",
    hoy: "En la bandeja va dentro de un blob de texto. En el Historial es un número sin etiqueta: 32, 7, 38, 42, 4, 33…",
    consecuencia: "Nadie puede agrupar, contar ni priorizar por causa desde el producto.",
  },
  {
    que: "El registro de la solución",
    hoy: "Solución, Fecha Solución y Usuario Solución: vacías en el 100% de las filas observadas, incluidas las marcadas NOVEDAD SOLUCIONADA.",
    consecuencia: "La UI para registrarla existe (botón GUARDAR SOLUCION) y aun así sale vacía: el flujo no se completa.",
  },
  {
    que: "Antigüedad, dueño y SLA",
    hoy: "El 24 de agosto seguían abiertas novedades con fecha del 26–27 de julio. Sin columna de antigüedad, sin responsable, sin estado de gestión.",
    consecuencia: "Cuatro semanas abiertas sin que nadie lo vea. La devolución gana por defecto.",
  },
];

// ── El test decisivo: Ecuador ────────────────────────────────────────────────
export const TEST_ECUADOR = {
  etiqueta: "Reprogramar entrega · Veloces",
  campos: ["Solución (texto libre, vacío)", "Nombre (prellenado)", "Celular (prellenado)", "Dirección (prellenada)", "Specify Address", "View Map", "Campo de fecha: no existe"],
  colombia: 35.3,
  ecuador: 60.7,
  p75: 53.3,
  conclusion:
    "Campo por campo idénticos, 25 puntos de diferencia. El producto no explica la brecha: es proceso operativo. El techo de N01 es alcanzable, al menos en parte, sin construir nada.",
  reserva:
    "[HIPÓTESIS a validar] El formulario descarta la explicación de producto, no la de composición de casos: los casos ecuatorianos podrían ser estructuralmente más fáciles. Eso se cierra con auditoría de proceso, no con más pantallazos.",
};

// ── El caso de estudio: una orden, todos los hallazgos ───────────────────────
export const CASO = {
  orden: "#80542212",
  carrier: "Coordinadora",
  contexto: "CON RECAUDO · $99.900 · el vendedor gana $25.711 si se entrega",
  eventos: [
    { fecha: "30 jun", texto: "Orden creada · 10:05", tono: "neutral" as Tone },
    { fecha: "30 jun", texto: "La validación automática de dirección responde «Validación fallida» · 15:05 — se despacha igual", tono: "risk" as Tone },
    { fecha: "30 jun", texto: "Entregada a la transportadora · 19:24. Dropi tardó 9 horas", tono: "neutral" as Tone },
    { fecha: "3 jul", texto: "En reparto · intento 1", tono: "neutral" as Tone },
    { fecha: "9 jul", texto: "En reparto · intento 2", tono: "neutral" as Tone },
    { fecha: "13 jul", texto: "«Se visita, no se logra entrega» — el hecho real ocurre aquí", tono: "warn" as Tone },
    { fecha: "21 jul", texto: "Vuelve a terminal destino", tono: "neutral" as Tone },
    { fecha: "25 jul", texto: "En reparto · intento 3", tono: "neutral" as Tone },
    { fecha: "26 jul", texto: "Se registra la NOVEDAD — 13 días después del hecho", tono: "risk" as Tone },
    { fecha: "24 ago", texto: "Sigue abierta. Solución, Observación, Fecha de Solución y Solucionado Por: vacías", tono: "risk" as Tone },
  ],
  cierre:
    "La dirección es un batallón militar en zona rural. El comentario del repartidor lo dice completo: «vive en un batallón de alta montaña alejado del pueblo y no responde las llamadas». El sistema ya lo sabía el 30 de junio — y despachó igual.",
};

// ── El orden de construcción ─────────────────────────────────────────────────
export const FASES = [
  { fase: "Fase 0", costo: "bajo" as const, titulo: "Motivo consultable y registro de solución obligatorio", detalle: "O8 + O9. Sin esto no hay triaje ni baseline: todo lo demás es inmedible. Es dato y UI, no flujo." },
  { fase: "Fase 1", costo: "bajo" as const, titulo: "Devolución express para los rechazos", detalle: "A15 sobre N08 + N09 + N10 — 320.000 novedades al mes con 5% de rescate. Libera capacidad y baja costo sin perder entregas materiales." },
  { fase: "Fase 2", costo: "cero" as const, titulo: "Auditar Ecuador antes de construir", detalle: "El mismo formulario rescata 60,7% allá y 35,3% acá. Copiar el proceso no cuesta desarrollo — y si funciona, cambia el orden de todo lo que sigue." },
  { fase: "Fase 3", costo: "medio" as const, titulo: "Reprogramar fecha y franja", detalle: "A01 + A02 sobre N01: el 53% del premio, +54.906 entregas al mes. Depende de que el carrier exponga API — empezar por Envía, que es el 37% del volumen." },
  { fase: "Fase 4", costo: "medio" as const, titulo: "Ubicación y dirección estructurada", detalle: "A04 + A05 sobre N03 y N02. Engancha directo con la validación de direcciones que ya existe." },
  { fase: "Fase 5", costo: "medio" as const, titulo: "Dueño, SLA y antigüedad", detalle: "Convierte el catálogo en operación y cierra el hallazgo de las novedades abiertas hace un mes." },
];

// ── Lo que este research NO puede decir ──────────────────────────────────────
export const VACIOS = [
  "Sin voz del usuario: ni una queja, ticket o entrevista. La pregunta sobre quejas no se puede responder con esta data — y es el research que falta.",
  "Sin nivel orden: el export es agregado. No hay tiempo hasta resolución, número de intentos ni secuencia de la novedad.",
  "Un solo mes (junio 2026). Sin serie no se distingue lo estacional de lo estructural; los P75 podrían moverse.",
  "Los porcentajes no cierran a 100. México: 16,2% entregado + 37,7% devuelto = 54%. El 46% restante no está identificado. Resolver con Data antes de llevar cualquier cifra a negocio.",
  "El recorrido del módulo fue exploratorio, no exhaustivo, y solo cubrió Colombia y Ecuador. La muestra de «Solución vacía» son ~11 filas, no una query.",
  "Todo es correlación. Ningún hallazgo prueba causa: los experimentos propuestos son lo que la convertiría en evidencia.",
];
