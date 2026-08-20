// Hoja de llenado de Jira — lo que la API no puede escribir.
//
// POR QUÉ EXISTE ESTE ARCHIVO
// En PRM (Jira Product Discovery / Polaris) NO se puede escribir ningún campo por
// la API REST clásica. Probado el 10-ago-2026 con tres campos de naturaleza
// distinta —`description`, `assignee` (campo de sistema) y `customfield_10228`
// (País)— y los tres devuelven el mismo error:
//
//     "Field 'X' cannot be set. It is not on the appropriate screen, or unknown."
//
// No es permisos: si lo fuera daría 403. Es que Polaris no expone su modelo de
// datos por esa API. También está bloqueado `getJiraIssueTypeMetaWithFields`
// ("No puedes crear incidencias en este proyecto"), así que ni siquiera se pueden
// leer los nombres de los campos: solo sus IDs.
//
// Lo ÚNICO que pasa en PRM son comentarios. Por eso los 11 documentos se
// publicaron como comentario y estos campos hay que ponerlos a mano.
//
// DE DÓNDE SALEN LOS VALORES
// No se adivinan: se HEREDAN del ticket padre. Cada Solución toma la
// clasificación de su Solicitud madre.
//
//     PRM-1362 (tarifas) ──> PRM-1608 fase 1 · PRM-1609 fase 2
//     PRM-1364 (POD)     ──> PRM-1462 ENVÍA · PRM-1455 Interrap. ·
//                            PRM-1610 Domina · PRM-1611 TIUI
//
// El único sin padre es PRM-1469, y su OKR lo decidió Juan el 10-ago.
//
// FUERA DE ALCANCE, A PROPÓSITO
// Los 8 campos de scoring (cf_11774, 11778, 11593, 11594, 11860–11863, valores
// 1–5) no entran acá: no se pueden leer sus nombres, y copiarlos entre tickets
// falsearía el ranking del roadmap. El scoring es priorización relativa — lo pone
// el PM viendo el conjunto, no un archivo.

export type Campo = {
  /** Etiqueta como se ve en Jira. */
  nombre: string;
  /** El customfield, para verificar que se está tocando el campo correcto. */
  cf: string;
  /** Texto LITERAL de la opción del desplegable. Se copia tal cual. */
  valor: string;
  /** ID de la opción en Jira. Sirve para verificar por API que quedó bien. */
  opcion?: string;
  /** true = ya está puesto en Jira; no se toca. */
  puesto: boolean;
};

export type TicketJira = {
  clave: string;
  titulo: string;
  tipo: string;
  /** De qué ticket se heredó la clasificación. */
  hereda?: string;
  /** Comentario donde quedó publicada la documentación. */
  comentario: string;
  /** Archivo con el markdown, en /logistica/documentacion-jira/. */
  doc: string;
  /** Una línea de por qué importa este ticket. */
  nota?: string;
  campos: Campo[];
};

const JUAN = "Juan Diego Bautista Vasquez";

// Valores compartidos. Se escriben una vez para que no se desincronicen entre
// tickets: si el nombre de una opción cambia en Jira, se corrige acá y ya.
const CELULA = { nombre: "Célula", cf: "customfield_10783", valor: "Logistic Success", opcion: "11514" };
const DOMINIO = { nombre: "Dominio", cf: "customfield_10322", valor: "Logistic", opcion: "12069" };
const PAIS_CO = { nombre: "País", cf: "customfield_10228", valor: "Colombia", opcion: "10348" };
const PAIS_TODOS = { nombre: "País", cf: "customfield_10228", valor: "Todos", opcion: "11250" };
const AREA_PRODUCTO = { nombre: "Área", cf: "customfield_12373", valor: "Producto", opcion: "14848" };
const AREA_LOGISTICA = { nombre: "Área", cf: "customfield_12373", valor: "Logistica - Val. Inicial", opcion: "14850" };
const OKR_2 = { nombre: "OKR", cf: "customfield_11775", valor: "[OKR 2 2026] Consolidar operación multi-país", opcion: "13854" };
const OKR_3 = { nombre: "OKR", cf: "customfield_11775", valor: "[OKR 3 2026] Eficiencia y rentabilidad", opcion: "13855" };
// ⚠️ El doble espacio de "OKR  3 - KR 1" es real y está así en Jira. No corregirlo:
// si se copia con un solo espacio no calza con la opción del desplegable.
const KR_MARGEN = { nombre: "KR", cf: "customfield_11776", valor: "OKR  3 - KR 1 - Gross margin promedio >22%", opcion: "13979" };
const KR_AUTOSERVICIO = { nombre: "KR", cf: "customfield_11776", valor: "OKR 3 - KR 2 - % tickets resueltos por AI/autoservicio >40%", opcion: "13980" };
const KR_ENTREGA = { nombre: "KR", cf: "customfield_11776", valor: "OKR 2 - KR 2 - Tasa de entrega promedio >70%", opcion: "13976" };
const ETAPA_DEFINICION = { nombre: "Etapa Delivery", cf: "customfield_11410", valor: "Definición", opcion: "13020" };
const ETAPA_BACKLOG = { nombre: "Etapa Delivery", cf: "customfield_11410", valor: "Backlog", opcion: "13021" };
const MANAGER = { nombre: "Manager", cf: "customfield_10684", valor: JUAN };
const ASIGNADO = { nombre: "Asignado", cf: "assignee", valor: JUAN };

const falta = (c: Omit<Campo, "puesto">): Campo => ({ ...c, puesto: false });
const ok = (c: Omit<Campo, "puesto">): Campo => ({ ...c, puesto: true });

// Orden por urgencia, no por número: primero el que está peor.
export const ticketsJira: TicketJira[] = [
  {
    clave: "PRM-1462",
    titulo: "Pruebas de entrega ENVÍA",
    tipo: "Solución",
    hereda: "PRM-1364",
    comentario: "51620",
    doc: "PRM-1462",
    nota:
      "Cero de nueve campos. Es el carrier MÁS avanzado del programa POD —tres tickets de PROD ya hechos— " +
      "y en las vistas de Polaris no aparece en ninguna parte: ni siquiera tiene Célula.",
    campos: [
      falta(CELULA), falta(DOMINIO), falta(PAIS_CO), falta(AREA_LOGISTICA),
      falta(OKR_3), falta(KR_AUTOSERVICIO), falta(ETAPA_DEFINICION),
      falta(MANAGER), falta(ASIGNADO),
    ],
  },
  {
    clave: "PRM-1610",
    titulo: "Pruebas de entrega Domina",
    tipo: "Solución",
    hereda: "PRM-1364",
    comentario: "51622",
    doc: "PRM-1610",
    campos: [
      ok(CELULA), ok(DOMINIO), falta(PAIS_CO), falta(AREA_LOGISTICA),
      falta(OKR_3), falta(KR_AUTOSERVICIO), falta(ETAPA_BACKLOG),
      falta(MANAGER), falta(ASIGNADO),
    ],
  },
  {
    clave: "PRM-1611",
    titulo: "Pruebas de entrega TIUI",
    tipo: "Solución",
    hereda: "PRM-1364",
    comentario: "51623",
    doc: "PRM-1611",
    nota: "No estaba mapeado en ninguna parte del cerebro hasta el 10-ago. POD tiene cuatro carriers, no tres.",
    campos: [
      ok(CELULA), ok(DOMINIO), falta(PAIS_CO), falta(AREA_LOGISTICA),
      falta(OKR_3), falta(KR_AUTOSERVICIO), falta(ETAPA_BACKLOG),
      falta(MANAGER), falta(ASIGNADO),
    ],
  },
  {
    clave: "PRM-1608",
    titulo: "Parametrización de tarifas [Fase 1]",
    tipo: "Solución",
    hereda: "PRM-1362",
    comentario: "51615",
    doc: "PRM-1608",
    campos: [
      ok(CELULA), ok(DOMINIO), falta(PAIS_CO), falta(AREA_PRODUCTO),
      falta(OKR_3), falta(KR_MARGEN), ok(ETAPA_BACKLOG),
      falta(MANAGER), falta(ASIGNADO),
    ],
  },
  {
    clave: "PRM-1609",
    titulo: "Parametrización de tarifas [Fase 2]",
    tipo: "Solución",
    hereda: "PRM-1362",
    comentario: "51616",
    doc: "PRM-1609",
    nota:
      "País se hereda como Colombia porque así está en PRM-1362, pero la épica habla de 12 países. " +
      "Si mercancía industrial abre fuera de CO, este campo cambia.",
    campos: [
      ok(CELULA), ok(DOMINIO), falta(PAIS_CO), falta(AREA_PRODUCTO),
      falta(OKR_3), falta(KR_MARGEN), ok(ETAPA_BACKLOG),
      falta(MANAGER), falta(ASIGNADO),
    ],
  },
  {
    clave: "PRM-1455",
    titulo: "Pruebas de entrega Interrapidísimo",
    tipo: "Solución",
    hereda: "PRM-1364",
    comentario: "51621",
    doc: "PRM-1455",
    campos: [
      ok(CELULA), ok(DOMINIO), falta(PAIS_CO), ok(AREA_LOGISTICA),
      falta(OKR_3), falta(KR_AUTOSERVICIO), ok(ETAPA_DEFINICION),
      falta(MANAGER), falta(ASIGNADO),
    ],
  },
  {
    clave: "PRM-1469",
    titulo: "Automatización de generación de guías para proveedores de alto volumen",
    tipo: "Solicitud",
    comentario: "51618",
    doc: "PRM-1469",
    nota:
      "Único sin padre del que heredar. El OKR lo decidió Juan el 10-ago: OKR 2 · KR 2, " +
      "coherente con su NSM de movilización.",
    campos: [
      ok(CELULA), falta(DOMINIO), falta(PAIS_CO), ok(AREA_PRODUCTO),
      falta(OKR_2), falta(KR_ENTREGA), ok(ETAPA_DEFINICION),
      falta(MANAGER), falta(ASIGNADO),
    ],
  },
  {
    clave: "PRM-1366",
    titulo: "Same day proveedores, marcas y fulfillment",
    tipo: "Solicitud",
    comentario: "51617",
    doc: "PRM-1366",
    campos: [
      ok(CELULA), ok(DOMINIO), ok(PAIS_TODOS), ok(AREA_PRODUCTO),
      ok(OKR_2), ok(KR_ENTREGA), ok(ETAPA_DEFINICION),
      falta(MANAGER), ok(ASIGNADO),
    ],
  },
  {
    clave: "PRM-1297",
    titulo: "Normalización de estados",
    tipo: "Proyecto",
    comentario: "51606",
    doc: "PRM-1297",
    nota: "Completo en campos. Lo que le falta es otra cosa: no tiene UN SOLO enlace ni épica en DROP/PROD.",
    campos: [
      ok(CELULA), ok(DOMINIO), ok(PAIS_CO), ok(AREA_PRODUCTO),
      ok(OKR_2), ok(KR_ENTREGA), ok(ETAPA_BACKLOG),
      ok(MANAGER), ok(ASIGNADO),
    ],
  },
  {
    clave: "PRM-1364",
    titulo: "Pruebas de entrega",
    tipo: "Solicitud",
    comentario: "51619",
    doc: "PRM-1364",
    nota:
      "Su KR es 'tickets por autoservicio', no tasa de entrega — y se sostiene: POD reduce el ida y vuelta " +
      "con soporte. De acá heredan los cuatro carriers.",
    campos: [
      ok(CELULA), ok(DOMINIO), ok(PAIS_CO), ok(AREA_LOGISTICA),
      ok(OKR_3), ok(KR_AUTOSERVICIO), ok(ETAPA_BACKLOG),
      ok(MANAGER), ok(ASIGNADO),
    ],
  },
  {
    clave: "PRM-749",
    titulo: "[AI] Notificaciones de optimización logística — predicción de entrega",
    tipo: "Proyecto",
    comentario: "51624",
    doc: "PRM-749",
    nota: "Completo en campos, pero es el único ticket de la célula SIN spec en el cerebro.",
    campos: [
      ok(CELULA), ok(DOMINIO), ok(PAIS_TODOS), ok(AREA_PRODUCTO),
      ok(OKR_2), ok(KR_ENTREGA), ok(ETAPA_DEFINICION),
      ok(MANAGER), ok(ASIGNADO),
    ],
  },
];

export const urlJira = (clave: string) => `https://dropi-it.atlassian.net/browse/${clave}`;
export const urlComentario = (clave: string, comentario: string) =>
  `${urlJira(clave)}?focusedCommentId=${comentario}`;
export const urlDoc = (doc: string) => `/logistica/documentacion-jira/${doc}.md`;

/** Cuántos campos faltan por poner. 0 = el ticket está completo. */
export const faltantes = (t: TicketJira) => t.campos.filter((c) => !c.puesto).length;
