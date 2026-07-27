// Genera el archivo que recibe la transportadora.
//
// Formato: CSV con separador ";" y BOM UTF-8. Es el mismo criterio que ya usa
// el hub en campaigns-planeacion/elegibles/export — sin el BOM, Excel es-CO
// rompe las tildes ("BOGOTÁ" → "BOGOTÃ"), y sin el ";" mete todo en una sola
// columna. Un archivo que se abre mal es un archivo que la transportadora
// devuelve, así que esto no es un detalle cosmético.
//
// Cada transportadora pide columnas distintas: eso vive en FORMATOS y se
// selecciona con rec_transportadora.formato_archivo. Agregar una transportadora
// nueva con su propio formato es agregar una entrada acá, no tocar el flujo.

export type ItemArchivo = {
  warehouse_id: string;
  bodega: string;
  direccion: string;
  municipio: string;
  dpto: string;
  cod_dane: string;
  paquetes: number;
  contacto_nombre?: string | null;
  contacto_telefono?: string | null;
  ventana_desde?: string | null;
  ventana_hasta?: string | null;
  /** false → la coordenada no es confiable; el conductor va por la dirección. */
  ubicacion_confiable: boolean;
  lat?: number | null;
  lng?: number | null;
};

type Columna = { titulo: string; valor: (i: ItemArchivo) => string | number };

const hora = (h?: string | null) => (h ? String(h).slice(0, 5) : "");

// Columnas comunes a todos los formatos: sin esto la transportadora no puede ir.
const BASE: Columna[] = [
  { titulo: "ID bodega",   valor: i => i.warehouse_id },
  { titulo: "Bodega",      valor: i => i.bodega },
  { titulo: "Dirección",   valor: i => i.direccion },
  { titulo: "Municipio",   valor: i => i.municipio },
  { titulo: "Departamento", valor: i => i.dpto },
  { titulo: "Paquetes",    valor: i => i.paquetes },
  { titulo: "Contacto",    valor: i => i.contacto_nombre ?? "" },
  { titulo: "Teléfono",    valor: i => i.contacto_telefono ?? "" },
  { titulo: "Desde",       valor: i => hora(i.ventana_desde) },
  { titulo: "Hasta",       valor: i => hora(i.ventana_hasta) },
];

// La coordenada solo se manda cuando es confiable. Mandar el centroide de un
// municipio como si fuera la puerta hace que el conductor termine en un parque
// a nueve kilómetros — verificado que ese es el error real de la geocodificación
// por vía. Cuando no la tenemos, se dice explícitamente en vez de omitirlo.
const GEO: Columna[] = [
  { titulo: "Latitud",  valor: i => (i.ubicacion_confiable && i.lat != null ? i.lat : "") },
  { titulo: "Longitud", valor: i => (i.ubicacion_confiable && i.lng != null ? i.lng : "") },
  { titulo: "Ubicación GPS", valor: i =>
      i.ubicacion_confiable ? "Verificada" : "NO disponible — guiarse por la dirección" },
];

export const FORMATOS: Record<string, { nombre: string; columnas: Columna[] }> = {
  generico: { nombre: "Genérico", columnas: [...BASE, ...GEO] },
  // Sin GPS: varias transportadoras cargan el archivo a su propio sistema y las
  // columnas extra les rompen la importación.
  simple: { nombre: "Sin coordenadas", columnas: BASE },
};

const escapar = (v: string | number | null | undefined) => {
  const s = v == null ? "" : String(v);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function generarCsv(items: ItemArchivo[], formato = "generico"): string {
  const def = FORMATOS[formato] ?? FORMATOS.generico;
  const filas = [
    def.columnas.map(c => escapar(c.titulo)).join(";"),
    ...items.map(i => def.columnas.map(c => escapar(c.valor(i))).join(";")),
  ];
  // ﻿ = BOM. \r\n porque Excel en Windows lo espera.
  return "﻿" + filas.join("\r\n") + "\r\n";
}

export function nombreArchivo(transportadora: string, fecha: string): string {
  const limpio = transportadora.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `recoleccion-${limpio}-${fecha}.csv`;
}

/**
 * Mensaje que acompaña al archivo. Va por correo o por WhatsApp según el canal
 * de la transportadora; el texto es el mismo para que las dos vías digan lo
 * mismo y se pueda comparar después qué canal funciona mejor.
 */
export function mensajeSolicitud(opts: {
  transportadora: string;
  fecha: string;
  bodegas: number;
  paquetes: number;
  municipios: string[];
}): string {
  const { transportadora, fecha, bodegas, paquetes, municipios } = opts;
  const lugares = municipios.length <= 3
    ? municipios.join(", ")
    : `${municipios.slice(0, 3).join(", ")} y ${municipios.length - 3} municipios más`;

  return (
    `Solicitud de recolección · Dropi · ${fecha}\n\n` +
    `${transportadora}: ${bodegas} bodegas con ${paquetes.toLocaleString("es-CO")} paquetes ` +
    `listos para recoger en ${lugares}.\n\n` +
    `Adjuntamos el detalle con direcciones, contactos y horarios de atención.\n` +
    `Cualquier bodega que no puedan cubrir hoy, nos avisan para reprogramarla.`
  );
}

/** Mensajes a la bodega. Dos momentos distintos del ciclo, dos textos. */
export function mensajeBodega(opts: {
  tipo: "presion_proveedor" | "aviso_recoleccion" | "aviso_dropi";
  bodega: string;
  paquetes: number;
  transportadora?: string;
  dias?: number | null;
  desde?: string | null;
  hasta?: string | null;
}): string {
  const { tipo, bodega, paquetes, transportadora, dias, desde, hasta } = opts;
  const franja = desde && hasta ? ` entre ${hora(desde)} y ${hora(hasta)}` : "";

  if (tipo === "aviso_recoleccion") {
    return (
      `Hola 👋 Te escribimos de Dropi.\n\n` +
      `Mañana pasa *${transportadora}* por *${bodega}* a recoger ` +
      `*${paquetes} paquetes*${franja}.\n\n` +
      `Por favor tenelos empacados y rotulados para que la recogida no falle. ¡Gracias!`
    );
  }

  if (tipo === "aviso_dropi") {
    return (
      `Hola 👋 Te escribimos de Dropi.\n\n` +
      `Mañana pasamos nosotros por *${bodega}* a recoger *${paquetes} paquetes*${franja}.\n\n` +
      `Tenelos listos y te confirmamos cuando el conductor vaya en camino.`
    );
  }

  // presion_proveedor
  const tiempo = dias && dias > 0 ? ` desde hace *${dias} días*` : "";
  return (
    `Hola 👋 Te escribimos de Dropi.\n\n` +
    `Vemos *${paquetes} guías* preparadas en *${bodega}* que todavía no salen${tiempo}.\n\n` +
    `¿Nos contás si hay algo que las esté frenando? Si ya están listas, coordinamos hoy mismo ` +
    `la recogida.`
  );
}
