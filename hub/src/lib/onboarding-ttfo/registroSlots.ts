import type { Camino, FamiliaArchivo, SlotId, TipoPaso } from "./tipos";

// Registro estático de los 12 slots esperados (Encuesta + 11 pasos del tour).
// Es el único archivo a editar si UserPilot renombra un flujo o agregamos un
// paso nuevo (ej. cuando lleguen los archivos de "integraciones").
//
// Los patrones toleran el truncado a 31 caracteres de Excel (documentado en
// esquema_medicion_onboarding_brands.md §10.1) y variaciones de mayúsculas/
// acentos/espacios — se compara siempre en minúsculas y sin tildes.

export interface DefinicionSlot {
  id: SlotId;
  tipoPaso: TipoPaso | "encuesta";
  camino: Camino | null;
  /** Familia esperada por firma de columnas — ver clasificarArchivo.ts. */
  familiaEsperada: FamiliaArchivo;
  /** Fragmentos de nombre de archivo que identifican este slot (case/acento-insensitive). */
  patronesNombre: RegExp[];
  etiqueta: string;
}

export const REGISTRO_SLOTS: DefinicionSlot[] = [
  {
    id: "encuesta",
    tipoPaso: "encuesta",
    camino: null,
    familiaEsperada: "encuesta",
    patronesNombre: [/encuesta/i],
    etiqueta: "Encuesta de clasificación",
  },
  {
    id: "video_bienvenida",
    tipoPaso: "modal",
    camino: null,
    familiaEsperada: "modal_o_tour",
    // El título real que manda UserPilot (visto en el webhook Raw Data,
    // 04-ago-2026) es "[Evergreen] [Onboarding] [Prov] Bienvenida Dropi
    // Colombia" — no contiene la palabra "video". Se deja /bienvenida/i como
    // patrón amplio (ningún otro slot usa esa palabra) y los dos anteriores
    // como respaldo por si el nombre de archivo exportado sí la trae.
    patronesNombre: [/bienvenida/i, /video.*bienvenida/i, /bienvenida.*video/i],
    etiqueta: "① Video Bienvenida",
  },
  {
    id: "modal_crea_bodega",
    tipoPaso: "modal",
    camino: "bodega",
    familiaEsperada: "modal_o_tour",
    patronesNombre: [/crea.*(tu\s*)?primera\s*bodega/i, /modal.*bodega/i],
    etiqueta: "② Crea tu primera bodega",
  },
  {
    id: "tour_bodegas",
    tipoPaso: "tour",
    camino: "bodega",
    familiaEsperada: "modal_o_tour",
    patronesNombre: [/tour.*bodega/i],
    etiqueta: "③ Tour guiado bodegas",
  },
  {
    id: "evento_guardar_bodega",
    tipoPaso: "evento",
    camino: "bodega",
    familiaEsperada: "evento",
    patronesNombre: [/guardar\s*bodega/i, /ev_.*bodega/i],
    etiqueta: "④ Evento: Guardar bodega",
  },
  {
    id: "modal_sube_producto",
    tipoPaso: "modal",
    camino: "producto",
    familiaEsperada: "modal_o_tour",
    patronesNombre: [/sube\s*producto/i, /modal.*producto/i],
    etiqueta: "⑤ Sube producto",
  },
  {
    id: "tour_productos",
    tipoPaso: "tour",
    camino: "producto",
    familiaEsperada: "modal_o_tour",
    patronesNombre: [/tour.*producto/i],
    etiqueta: "⑥ Tour guiado productos",
  },
  {
    id: "evento_guardar_producto",
    tipoPaso: "evento",
    camino: "producto",
    familiaEsperada: "evento",
    patronesNombre: [/guardar\s*producto/i, /bot[oó]n\s*guardar/i, /ev_.*producto/i],
    etiqueta: "⑦ Evento: Guardar producto",
  },
  {
    id: "modal_felicidades_producto",
    tipoPaso: "modal",
    camino: "producto",
    familiaEsperada: "modal_o_tour",
    patronesNombre: [/felicidades\s*producto/i],
    etiqueta: "⑧ Felicidades producto creado",
  },
  {
    id: "tour_orden_manual",
    tipoPaso: "tour",
    camino: "orden_manual",
    familiaEsperada: "modal_o_tour",
    patronesNombre: [/tour.*orden\s*manual/i],
    etiqueta: "⑨ Tour guiado orden manual",
  },
  {
    id: "evento_enviar_cliente",
    tipoPaso: "evento",
    camino: "orden_manual",
    familiaEsperada: "evento",
    patronesNombre: [/enviar\s*al\s*cliente/i, /ev_.*enviar/i],
    etiqueta: "⑩ Evento: Enviar al cliente",
  },
  {
    id: "modal_felicidades_orden_manual",
    tipoPaso: "modal",
    camino: "orden_manual",
    familiaEsperada: "modal_o_tour",
    patronesNombre: [/felicidades.*orden\s*manual/i],
    etiqueta: "⑪ Felicidades orden manual creada",
  },
  // Bifurcación desde ⑧: el modal "Felicidades producto creado" tiene 2
  // botones — uno a orden_manual (arriba) y otro a "Integraciones con tu
  // tienda", mapeado el 29-jul-2026. Sin modal de "creación" propia (no hay
  // un paso análogo a ② o ⑤) — el botón dentro de ⑧ dispara directo el Tour.
  {
    id: "tour_integraciones",
    tipoPaso: "tour",
    camino: "integraciones",
    familiaEsperada: "modal_o_tour",
    patronesNombre: [/tour.*integrac/i],
    etiqueta: "⑫ Tour guiado integración con tienda",
  },
  {
    id: "evento_crear_integraciones",
    tipoPaso: "evento",
    camino: "integraciones",
    familiaEsperada: "evento",
    // El nombre real de export (esquema_medicion_onboarding_brands.md: "Ev_ok
    // token generado_mis integr...") es "token generado", no "tutorial" — se
    // confirmó al recibir el archivo real el 29-jul-2026.
    patronesNombre: [/token\s*generado/i, /ok\s*token/i, /tutorial.*integrac/i, /crear\s*mis\s*integrac/i, /ev_.*integrac/i],
    etiqueta: "⑬ Evento: token generado (integraciones)",
  },
  {
    id: "modal_felicidades_integracion",
    tipoPaso: "modal",
    camino: "integraciones",
    familiaEsperada: "modal_o_tour",
    patronesNombre: [/felicidades.*integrac/i],
    etiqueta: "⑭ Felicidades Integración creada",
  },
];

/** Slots cuyo tipo real es Tour (dismissable, no obligatorio). */
export const SLOTS_TOUR: SlotId[] = REGISTRO_SLOTS.filter(s => s.tipoPaso === "tour").map(s => s.id);

/**
 * ③ "Tour guiado bodegas" y ⑦ "Botón guardar Producto" llegaron, en la data
 * real analizada el 28-jul-2026, como el MISMO dataset exportado dos veces
 * (timestamps idénticos al segundo) — un problema de UserPilot pendiente de
 * confirmar con Tech, no un error de este pipeline. Si la huella de ambos
 * archivos coincide exacto, se reporta como conflicto conocido, no como dato
 * válido duplicado — ver clasificarArchivo.ts.
 */
export const PARES_SOSPECHOSOS_DUPLICADO: [SlotId, SlotId][] = [
  ["tour_bodegas", "evento_guardar_producto"],
];

export function buscarDefinicion(id: SlotId): DefinicionSlot {
  const def = REGISTRO_SLOTS.find(s => s.id === id);
  if (!def) throw new Error(`Slot desconocido: ${id}`);
  return def;
}
