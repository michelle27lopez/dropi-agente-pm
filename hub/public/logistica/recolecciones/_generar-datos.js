// Procesa el export de Chronos -> JSON para el prototipo.
// Ubicación en tres niveles, sin librerías ni API:
//   'malla'     -> interpolado de la nomenclatura (Bogotá / Medellín)
//   'municipio' -> centroide del municipio (offset determinista para no apilar)
//   'depto'     -> centroide del departamento (cuando no conocemos el municipio)
const fs = require('fs');

const rows = JSON.parse(fs.readFileSync('rec2.json', 'utf8'));
const H = rows[0], ix = n => H.indexOf(n);

// --- centroides ---
const MUN = {
  '11001': [4.6486, -74.0828], '76001': [3.4516, -76.5320], '05001': [6.2442, -75.5812],
  '41298': [2.1969, -75.6275], '54001': [7.8939, -72.5078], '68276': [7.0629, -73.0870],
  '68001': [7.1193, -73.1227], '54874': [7.8339, -72.4739], '17001': [5.0703, -75.5138],
  '08001': [10.9685, -74.7813], '25754': [4.5794, -74.2168], '76364': [3.2611, -76.5389],
  '68547': [6.9917, -73.0500], '05631': [6.1519, -75.6167], '05360': [6.1719, -75.6114],
  '66001': [4.8133, -75.6961], '73001': [4.4389, -75.2322], '41001': [2.9273, -75.2819],
  '47001': [11.2408, -74.1990], '13001': [10.3910, -75.4794], '50001': [4.1420, -73.6266],
  '52001': [1.2136, -77.2811], '63001': [4.5339, -75.6811], '23001': [8.7479, -75.8814],
  '19001': [2.4448, -76.6147], '05088': [6.3390, -75.5570], '05266': [6.1667, -75.5833],
  '66170': [4.8350, -75.6740], '76520': [3.5394, -76.3036], '15001': [5.5353, -73.3678],
  '20001': [10.4631, -73.2532], '70001': [9.3047, -75.3978], '05697': [6.1372, -75.2647],
  '25175': [4.8614, -74.0583], '25286': [4.7163, -74.2119], '25473': [4.7059, -74.2300],
  '25430': [4.7325, -74.2642], '25899': [5.0221, -73.9903], '76892': [3.5850, -76.4920],
  '76834': [4.0847, -76.1954], '76109': [3.8801, -77.0312], '68307': [7.0678, -73.1731],
  '76147': [4.7469, -75.9117], '05615': [6.1553, -75.3739], '05045': [7.8836, -76.6256],
  '08433': [10.8592, -74.7739], '08758': [10.9170, -74.7650], '54405': [7.9358, -72.5011],
  '25290': [4.7000, -74.4000], '05129': [6.3400, -75.6200], '76111': [3.9000, -76.2900],
};
const DEP = {
  '05': [6.55, -75.82], '08': [10.75, -74.90], '11': [4.65, -74.08], '13': [9.00, -74.50],
  '15': [5.55, -73.37], '17': [5.30, -75.30], '18': [1.00, -74.50], '19': [2.40, -76.80],
  '20': [9.40, -73.50], '23': [8.35, -75.80], '25': [4.90, -74.30], '27': [5.70, -76.70],
  '41': [2.55, -75.55], '44': [11.35, -72.60], '47': [10.40, -74.40], '50': [3.50, -73.00],
  '52': [1.30, -77.60], '54': [7.95, -72.90], '63': [4.45, -75.68], '66': [5.05, -75.90],
  '68': [6.90, -73.30], '70': [9.10, -75.15], '73': [4.10, -75.20], '76': [3.80, -76.40],
  '81': [6.80, -70.80], '85': [5.40, -71.80], '86': [0.80, -76.30], '88': [12.55, -81.72],
  '91': [-2.20, -71.50], '94': [2.70, -68.50], '95': [1.80, -72.60], '97': [0.60, -70.70],
  '99': [4.90, -69.30],
};

// --- malla de nomenclatura (calibrada con puntos conocidos) ---
const MALLA = {
  '11001': { // Bogotá: calles S->N, carreras E->O
    lat: c => 4.6280 + (c - 26) * 0.00082,
    lng: k => -74.0830 + (k - 30) * -0.000786,
    latRange: [4.47, 4.84], lngRange: [-74.24, -73.99],
  },
  '05001': { // Medellín: calles S->N, carreras E->O
    lat: c => 6.2090 + (c - 10) * 0.001086,
    lng: k => -75.5700 + (k - 43) * -0.000892,
    latRange: [6.15, 6.38], lngRange: [-75.66, -75.49],
  },
};

const norm = s => (s || '').toUpperCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/\bKRA?\b|\bCRA?\b|\bCR\b|\bKR\b/g, 'CARRERA')
  .replace(/\bCLL?E?\b|\bCL\b/g, 'CALLE')
  .replace(/\bAV\b/g, 'AVENIDA')
  .replace(/\bNO\.?(?=\s|\d)|\bNUM\.?(?=\s|\d)|N°/g, '#')
  .replace(/\s+/g, ' ').trim();

// "CALLE 14 # 19-55" -> {via:'CALLE', n:14, gen:19, sur:bool}
function parseDir(addr) {
  const a = norm(addr);
  const m = a.match(/\b(CALLE|CARRERA|AVENIDA|DIAGONAL|TRANSVERSAL)\s*(\d{1,3})\s*([A-Z]{0,2})\s*(SUR|BIS)?\s*#?\s*(\d{1,3})?/);
  if (!m) return null;
  return { via: m[1], n: +m[2], sur: /SUR/.test(a.slice(0, (m.index || 0) + m[0].length)), gen: m[5] ? +m[5] : null };
}

// hash determinista -> offset pequeño para no apilar puntos en el mismo centroide
function offset(seed, escala) {
  let h = 2166136261;
  for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  const a = ((h >>> 0) % 1000) / 1000, b = ((h >>> 8) % 1000) / 1000;
  return [(a - 0.5) * escala, (b - 0.5) * escala];
}

const out = [];
const stats = { malla: 0, municipio: 0, depto: 0, sinParse: 0 };

for (const r of rows.slice(1)) {
  if (!r[ix('warehouse_id')]) continue;
  const dane8 = String(r[ix('cod_dane')] || '').padStart(8, '0');
  const mun5 = dane8.slice(0, 5), dep2 = dane8.slice(0, 2);
  const id = r[ix('warehouse_id')];
  const addr = r[ix('address')] || '';

  let lat = null, lng = null, geo = null;

  const malla = MALLA[mun5];
  if (malla) {
    const p = parseDir(addr);
    if (p && p.gen != null) {
      const calle = p.via === 'CALLE' ? (p.sur ? -p.n : p.n) : p.gen;
      const cra = p.via === 'CALLE' ? p.gen : p.n;
      const la = malla.lat(calle), ln = malla.lng(cra);
      if (la >= malla.latRange[0] && la <= malla.latRange[1] &&
          ln >= malla.lngRange[0] && ln <= malla.lngRange[1]) {
        lat = la; lng = ln; geo = 'malla'; stats.malla++;
      }
    }
    if (!geo) stats.sinParse++;
  }
  if (!geo && MUN[mun5]) {
    lat = MUN[mun5][0]; lng = MUN[mun5][1]; geo = 'municipio'; stats.municipio++;
  }
  if (!geo && DEP[dep2]) {
    lat = DEP[dep2][0]; lng = DEP[dep2][1]; geo = 'depto'; stats.depto++;
  }
  if (!geo) continue;

  const creada = String(r[ix('bodega_creada')] || '');
  out.push({
    id, b: r[ix('bodega')] || '(sin nombre)', a: addr,
    m: r[ix('municipio')] || '', dp: r[ix('dpto')] || '',
    dane: mun5, dep: dep2,
    lat: +lat.toFixed(5), lng: +lng.toFixed(5), geo,
    p: +r[ix('preparadas')] || 0,
    g: +r[ix('guia_generada')] || 0,
    t: +r[ix('total_por_recoger')] || 0,
    e: r[ix('estado_recogida')] || 'sin solicitud',
    nu: creada.startsWith('2026') ? 1 : 0,
  });
}

out.sort((a, b) => b.t - a.t);
const meta = {
  generado: new Date().toISOString().slice(0, 10),
  fuente: 'Chronos raw.orders_co + warehouses_co + cities_co (ventana updated_at 2 días)',
  bodegas: out.length,
  guias: out.reduce((s, x) => s + x.t, 0),
  preparadas: out.reduce((s, x) => s + x.p, 0),
  guia_generada: out.reduce((s, x) => s + x.g, 0),
  precision: stats,
};
fs.writeFileSync('datos-recolecciones.json', JSON.stringify({ meta, puntos: out }));
console.log(JSON.stringify(meta, null, 1));
console.log('\nBogotá/Medellín ubicados por malla:', stats.malla, '| sin parsear (cayeron a centroide):', stats.sinParse);
console.log('peso archivo:', (fs.statSync('datos-recolecciones.json').size / 1024).toFixed(0), 'KB');
console.log('\nmuestra malla:');
out.filter(x => x.geo === 'malla').slice(0, 6).forEach(x =>
  console.log('  ', x.lat, x.lng, '|', x.m.padEnd(9), '|', x.a.slice(0, 42)));
