// Export de Chronos (grano bodega × transportadora) -> datos-recolecciones.json
//
// Cambios vs. el pipeline anterior:
//   · El export ahora trae `transportadora`: se agrega por bodega y se guarda el
//     desglose por transportadora (`tr`). El pivote a columnas lo hace el frontend.
//   · Ya NO se interpola nomenclatura ("malla"): eran coordenadas calculadas, no
//     observadas, y no existen en el enum de precisión. Lo que no está geocodificado
//     cae a centroide y se marca como tal.
//   · Las coords se reusan del cache SOLO si la dirección no cambió.
//
//   node build.js [ruta.xlsx]
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const XLS = process.argv[2] ||
  path.resolve(__dirname, '../../../../../cerebro/conocimiento/Data/Data Juan Diego (3).xlsx');
const CACHE = 'geocache-coords.json';
const SALIDA = '../datos-recolecciones.json';

const { MUN, DEP } = JSON.parse(fs.readFileSync('centroides.json', 'utf8'));
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};

const nrm = s => String(s || '').toUpperCase().replace(/\s+/g, ' ').trim();
const num = v => Number(v) || 0;

// --- 1. leer y agrupar por bodega -------------------------------------------
const filas = XLSX.utils.sheet_to_json(XLSX.readFile(XLS).Sheets['Sheet1'], { defval: null });
if (!filas.length) { console.error('Export vacío:', XLS); process.exit(1); }

const bodegas = new Map();
for (const r of filas) {
  const id = String(r.warehouse_id || '').trim();
  if (!id) continue;
  const dane8 = String(r.cod_dane || '').padStart(8, '0');
  let b = bodegas.get(id);
  if (!b) {
    b = {
      id, b: r.bodega || '(sin nombre)', a: r.address || '',
      m: r.municipio || '', dp: r.dpto || '',
      dane: dane8.slice(0, 5), dep: dane8.slice(0, 2),
      p: 0, g: 0, t: 0, tr: [], ue: '',
    };
    bodegas.set(id, b);
  }
  const p = num(r.preparadas), g = num(r.guia_generada);
  b.p += p; b.g += g; b.t += p + g;
  b.tr.push([r.transportadora || '(sin transportadora)', p, g]);
  const ev = String(r.ultimo_evento || '');
  if (ev > b.ue) b.ue = ev;
}

// --- 2. ubicar ---------------------------------------------------------------
// Cascada: cache geocodificado (si la dirección no cambió) -> centroide municipio
// -> centroide departamento. Nunca se inventa un punto: cada nivel queda marcado.
const stats = { geo: 0, geo_alta: 0, geo_baja: 0, municipio: 0, depto: 0, sin_ubicar: 0 };
const guias = { geocodificado: 0, centroide: 0, sin_ubicar: 0 };
const porGeocodificar = [];   // cola de trabajo para geocode2.js
const puntos = [];

for (const b of bodegas.values()) {
  const c = cache[b.id];
  if (c && nrm(c.dir) === nrm(b.a)) {
    b.lat = c.lat; b.lng = c.lng; b.geo = c.geo;
    stats[c.geo] = (stats[c.geo] || 0) + 1;
    guias.geocodificado += b.t;
  } else if (MUN[b.dane]) {
    b.lat = MUN[b.dane][0]; b.lng = MUN[b.dane][1]; b.geo = 'municipio';
    stats.municipio++; guias.centroide += b.t;
    porGeocodificar.push(b);
  } else if (DEP[b.dep]) {
    b.lat = DEP[b.dep][0]; b.lng = DEP[b.dep][1]; b.geo = 'depto';
    stats.depto++; guias.centroide += b.t;
    porGeocodificar.push(b);
  } else {
    stats.sin_ubicar++; guias.sin_ubicar += b.t;
    continue;                                  // sin municipio ni depto: fuera del mapa
  }
  b.lat = +b.lat.toFixed(5); b.lng = +b.lng.toFixed(5);
  b.tr.sort((x, y) => (y[1] + y[2]) - (x[1] + x[2]));
  puntos.push(b);
}

puntos.sort((a, b) => b.t - a.t);

// --- 3. agregados por transportadora ----------------------------------------
const trAgg = {};
for (const b of puntos) for (const [n, p, g] of b.tr) {
  const a = trAgg[n] = trAgg[n] || { n, p: 0, g: 0, bodegas: 0 };
  a.p += p; a.g += g; a.bodegas++;
}
const transportadoras = Object.values(trAgg)
  .map(a => ({ ...a, t: a.p + a.g }))
  .sort((a, b) => b.t - a.t);

const fechas = puntos.map(p => p.ue).filter(Boolean).sort();
const total = puntos.reduce((s, x) => s + x.t, 0);

const meta = {
  generado: new Date().toISOString().slice(0, 10),
  fuente: 'Chronos raw.orders_co + warehouses_co + cities_co + distribution_companies_co',
  grano: 'bodega × transportadora (agregado a bodega; desglose en `tr`)',
  ventana: 'updated_at últimos 30 días',
  evento_min: fechas[0] || null,
  evento_max: fechas[fechas.length - 1] || null,
  bodegas: puntos.length,
  guias: total,
  preparadas: puntos.reduce((s, x) => s + x.p, 0),
  guia_generada: puntos.reduce((s, x) => s + x.g, 0),
  precision: stats,
  guias_por_precision: guias,
  cobertura_geocodificada: +(100 * guias.geocodificado / total).toFixed(1),
  transportadoras,
  // Campos que el export anterior traía y este ya no: el frontend NO debe inventarlos.
  sin_dato: ['estado_recogida (pick_ups venía vacío)', 'bodega_creada (no se pidió)'],
};

fs.writeFileSync(SALIDA, JSON.stringify({ meta, puntos }));
fs.writeFileSync('por-geocodificar.json', JSON.stringify(
  porGeocodificar.sort((a, b) => b.t - a.t)
    .map(b => ({ id: b.id, bodega: b.b, dir: b.a, municipio: b.m, dane: b.dane, dep: b.dep, guias: b.t })),
  null, 1));

console.log(JSON.stringify(meta, null, 1));
console.log(`\ncola de geocodificación: ${porGeocodificar.length} bodegas / ` +
  `${porGeocodificar.reduce((s, b) => s + b.t, 0).toLocaleString('es-CO')} guías -> por-geocodificar.json`);
console.log('peso:', (fs.statSync(SALIDA).size / 1024).toFixed(0), 'KB');
