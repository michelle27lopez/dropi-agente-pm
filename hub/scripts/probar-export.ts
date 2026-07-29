// Prueba un export de Chronos SIN tocar la base.
//
// Corre exactamente el mismo parseo que hace el botón "Actualizar datos"
// (validarColumnas → agruparPorBodega → resumir), así que lo que se ve acá es
// lo que quedaría guardado. Sirve para revisar un archivo nuevo antes de
// subirlo, y para no descubrir en producción que faltaba una columna.
//
//   cd hub && npx tsx scripts/probar-export.ts "<ruta al .xlsx>"
//
// Nace de un caso real: el export del 28-jul traía 11 columnas nuevas
// (antigüedad, teléfonos, proveedor) que el agrupador descartaba en silencio
// porque nadie las había agregado a FilaExport. El archivo se importaba sin
// error y perdía todo lo nuevo.

import * as XLSX from "xlsx";
import {
  agruparPorBodega, resumir, validarColumnas, fechaDelExport, antiguedadMax,
  type FilaExport,
} from "../src/lib/recolecciones/index";

const ruta = process.argv[2];
if (!ruta) {
  console.error("Falta la ruta del archivo.\n  npx tsx scripts/probar-export.ts <archivo.xlsx>");
  process.exit(1);
}

const fmt = (n: number) => n.toLocaleString("es-CO");

const libro = XLSX.readFile(ruta);
const filas = XLSX.utils.sheet_to_json<FilaExport>(
  libro.Sheets[libro.SheetNames[0]], { defval: null });

const problema = validarColumnas(filas);
console.log("validarColumnas :", problema ?? "OK");
if (problema) process.exit(1);

const bodegas = agruparPorBodega(filas);
const resumen = resumir(filas, bodegas);

console.log("fecha del export:", fechaDelExport(resumen));
console.log("filas           :", fmt(filas.length));
console.log("bodegas         :", fmt(bodegas.length));
console.log("guías           :", fmt(resumen.guias));

// ── Lo que trae de nuevo ───────────────────────────────────────────────────
const conTel = bodegas.filter(b => b.telefono || b.telefono_proveedor).length;
const conProv = bodegas.filter(b => b.supplier_id).length;
console.log("");
console.log("con teléfono    :", fmt(conTel), `(${(100 * conTel / bodegas.length).toFixed(1)}%)`);
console.log("con proveedor   :", fmt(conProv), `(${(100 * conProv / bodegas.length).toFixed(1)}%)`);

// Las cubetas tienen que sumar exactamente el total de guías. Si no, el
// agrupador está perdiendo filas o el export trae cubetas incompletas.
const suma = bodegas.reduce(
  (s, b) => s + Object.values(b.edades).reduce((a, c) => a + c, 0), 0);
console.log("suma de cubetas :", fmt(suma),
  suma === resumen.guias ? "= guías ✓" : `≠ guías (${fmt(resumen.guias)}) ⚠`);

const tot: Record<string, number> = {};
for (const b of bodegas) {
  for (const [k, v] of Object.entries(b.edades)) tot[k] = (tot[k] ?? 0) + v;
}
console.log("");
console.log("ANTIGÜEDAD");
for (const [k, v] of Object.entries(tot)) {
  console.log("  " + k.padEnd(13), String(fmt(v)).padStart(8),
    suma ? ((100 * v / suma).toFixed(1) + "%").padStart(7) : "");
}

// ── ¿Viene cortado? ────────────────────────────────────────────────────────
const vol = filas.map(f => Number(f.preparadas ?? 0) + Number(f.guia_generada ?? 0));
const desc = vol.every((v, i) => i === 0 || vol[i - 1] >= v);
const redondo = filas.length >= 1000 && filas.length % 1000 === 0;
if (redondo && desc && vol[vol.length - 1] <= Math.min(...vol)) {
  console.log("");
  console.log(`⚠ TRUNCADO: ${fmt(filas.length)} filas exactas, ordenado de mayor a menor,`);
  console.log("  y la última es la más chica. Falta la cola de bodegas con pocas guías.");
}

const m = bodegas[0];
console.log("");
console.log("MUESTRA ·", m.nombre, "·", m.municipio);
console.log("  teléfonos  :", m.telefono, "/", m.telefono_proveedor);
console.log("  proveedor  :", m.supplier_id, "·", m.supplier_nombre);
console.log("  fulfillment:", m.fulfillment_by_dropi, "· creada:", m.bodega_creada_at);
console.log("  antigüedad :", JSON.stringify(m.edades), "→", antiguedadMax(m.edades), "días");
console.log("  cargas     :", m.cargas.length, JSON.stringify(m.cargas[0]));
