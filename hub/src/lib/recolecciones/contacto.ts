// A quién se llama por una bodega — y por qué a ese y no a otro.
//
// El dato llega de dos lugares distintos del modelo de Dropi y NO son
// intercambiables:
//
//   · teléfono de la BODEGA     (Usuarios_Bds / el registro de la bodega)
//   · teléfono del PROVEEDOR    (Tabla E: Supplier)
//
// Un proveedor puede tener varias bodegas y cada una puede tener un teléfono
// distinto: la de Medellín la maneja el jefe de bodega, la de Bogotá el dueño.
// Llamar al del proveedor cuando la bodega tiene el suyo es llamar a alguien
// que no está viendo esos paquetes.
//
// Por eso el directorio guarda los tres tipos (bodega / proveedor /
// transportadora) y la resolución es explícita y con jerarquía, en un solo
// lugar. Si esta regla vive dispersa en cada consulta, cada pantalla termina
// mostrando un teléfono distinto para la misma bodega.

export type TipoEntidad = "bodega" | "proveedor" | "transportadora";

/** Lo que hoy trae rec_bodega: los dos teléfonos, uno al lado del otro. */
export type BodegaContactable = {
  warehouse_id: string;
  supplier_id: string | null;
  supplier_nombre: string | null;
  telefono: string | null;             // el de ESTA bodega
  telefono_proveedor: string | null;   // el del dueño
};

export type ContactoResuelto = {
  nombre: string | null;
  telefono: string | null;
  email: string | null;
  /** De dónde salió: importa para saber si le estamos escribiendo al indicado. */
  origen_tipo: TipoEntidad | null;
  /** Texto para mostrar en la UI y en el registro del mensaje. */
  detalle: string;
};

const SIN_CONTACTO: ContactoResuelto = {
  nombre: null, telefono: null, email: null, origen_tipo: null,
  detalle: "Sin teléfono registrado",
};

const util = (t: string | null | undefined) =>
  !!t && String(t).replace(/\D/g, "").length >= 7;

/**
 * Resuelve a quién se llama por una bodega.
 *
 * Jerarquía: **la bodega primero, el proveedor como respaldo.** Lo específico
 * gana sobre lo general — quien está parado junto a los paquetes sabe más que
 * el dueño de la cuenta.
 *
 * Cuando cae al respaldo lo DICE, porque quien conteste puede no estar en esa
 * bodega y el operador tiene que saberlo antes de decir "¿tenés los 40 listos?".
 */
export function resolverContactoBodega(b: BodegaContactable): ContactoResuelto {
  if (util(b.telefono)) {
    return {
      nombre: null, telefono: b.telefono, email: null,
      origen_tipo: "bodega",
      detalle: "Teléfono de la bodega",
    };
  }

  if (util(b.telefono_proveedor)) {
    return {
      nombre: b.supplier_nombre, telefono: b.telefono_proveedor, email: null,
      origen_tipo: "proveedor",
      detalle: `Teléfono del proveedor${b.supplier_nombre ? ` · ${b.supplier_nombre}` : ""} ` +
               `— la bodega no tiene uno propio`,
    };
  }

  return SIN_CONTACTO;
}

/**
 * Normaliza un celular colombiano a formato internacional para `wa.me`.
 * Los números llegan como "3001234567", "300 123 4567", "(+57) 300-1234567".
 * WhatsApp los rechaza sin indicativo, y un link que no abre se lee como
 * "el sistema no sirve", no como "faltó el 57".
 */
export function normalizarWhatsapp(telefono: string | null | undefined): string | null {
  if (!telefono) return null;
  const d = String(telefono).replace(/\D/g, "");
  if (d.length === 10 && d.startsWith("3")) return `57${d}`;
  if (d.length === 12 && d.startsWith("57")) return d;
  if (d.length === 13 && d.startsWith("057")) return d.slice(1);
  return d.length >= 10 ? d : null;   // fijo o formato raro: se deja, pero se ve
}

export function linkWhatsapp(telefono: string | null, mensaje: string): string | null {
  const n = normalizarWhatsapp(telefono);
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(mensaje)}`;
}

/** Agrupa bodegas por proveedor: una llamada, no cinco. */
export function agruparPorProveedor<T extends { supplier_id: string | null; warehouse_id: string }>(
  bodegas: T[],
): Array<{ supplier_id: string | null; bodegas: T[] }> {
  const mapa = new Map<string, T[]>();
  const sueltas: T[] = [];

  for (const b of bodegas) {
    if (!b.supplier_id) { sueltas.push(b); continue; }
    const g = mapa.get(b.supplier_id) ?? [];
    g.push(b);
    mapa.set(b.supplier_id, g);
  }

  const grupos: Array<{ supplier_id: string | null; bodegas: T[] }> =
    [...mapa.entries()].map(([supplier_id, bs]) => ({ supplier_id, bodegas: bs }));
  // Sin proveedor conocido cada bodega va sola: no se pueden agrupar a ciegas.
  for (const b of sueltas) grupos.push({ supplier_id: null, bodegas: [b] });

  return grupos.sort((a, b) => b.bodegas.length - a.bodegas.length);
}
