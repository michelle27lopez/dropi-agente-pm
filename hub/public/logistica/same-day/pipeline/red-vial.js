// Red vial completa por ciudad, para calcular TIEMPOS DE VIAJE reales.
//
//   node red-vial.js --fetch
//
// Es distinta de `osmgeom-*.json`, que sólo trae vías con nombre tipo "Calle 80" y sirve para
// UBICAR direcciones. Para rutear hace falta la malla entera —incluidos enlaces, glorietas y
// vías sin nombre— y además el sentido de circulación, que allá no importaba.
//
// Se guarda COMPRIMIDA, no el JSON crudo de Overpass: de la respuesta sólo sobreviven la
// geometría y tres etiquetas (clase, velocidad, sentido). El crudo de Bogotá son cientos de
// MB y el 90% son etiquetas que no usamos.
const fs = require('fs');
const path = require('path');
const { CIUDADES } = require('./osm.js');

const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const UA = 'dropi-logistica-samedaymap/1.0 (producto@dropi.co)';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const archivo = c => path.join(__dirname, `redvial-${c.toLowerCase()}.json`);

// Sólo lo que un vehículo de reparto puede usar. Quedan fuera andenes, ciclorrutas, escaleras
// y `service` (parqueaderos y accesos internos): meterlos infla el grafo sin cambiar el tiempo.
// `living_street` sí entra, es vía de barrio con tráfico real.
const CLASES = ['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified',
  'residential', 'living_street', 'motorway_link', 'trunk_link', 'primary_link',
  'secondary_link', 'tertiary_link'];

// Velocidad de referencia por clase, en km/h, cuando la vía no declara `maxspeed`.
// No son los límites legales sino velocidades de circulación urbana plausibles; el ajuste
// fino a la realidad de cada ciudad se hace después con un factor global (ver rutas.js).
const VEL = {
  motorway: 60, trunk: 50, primary: 40, secondary: 35, tertiary: 30,
  unclassified: 25, residential: 20, living_street: 10,
  motorway_link: 40, trunk_link: 35, primary_link: 30, secondary_link: 25, tertiary_link: 22,
};

function velocidad(t) {
  const m = /^(\d{1,3})/.exec(t.maxspeed || '');
  if (m) { const v = +m[1]; if (v >= 5 && v <= 120) return v; }
  return VEL[t.highway] || 25;
}
// `oneway`: 1 = sólo en el sentido de la geometría, -1 = sólo al revés, 0 = doble sentido.
// Las glorietas son de sentido único aunque no lo declaren.
function sentido(t) {
  const o = (t.oneway || '').toLowerCase();
  if (o === 'yes' || o === 'true' || o === '1') return 1;
  if (o === '-1' || o === 'reverse') return -1;
  if (o === 'no') return 0;
  return (t.junction === 'roundabout' || t.junction === 'circular') ? 1 : 0;
}

async function pedir(q) {
  for (let i = 0; i < 3; i++) {
    for (const srv of OVERPASS) {
      try {
        const r = await fetch(srv, { method: 'POST', headers: { 'User-Agent': UA }, body: new URLSearchParams({ data: q }) });
        if (!r.ok) { console.log(`    HTTP ${r.status} en ${new URL(srv).host}`); continue; }
        return (await r.json()).elements || [];
      } catch (e) { console.log('    ', e.message); }
    }
    await sleep(25000);
  }
  throw new Error('Overpass no respondió');
}

// Bogotá no cabe en una sola consulta (504). Se parte en rejilla; Overpass devuelve completas
// las vías que cruzan el borde, así que los duplicados se descartan por id y no hay costuras.
function cuadrantes(bbox, n) {
  const [s, w, no, e] = bbox, out = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
    out.push([s + (no - s) * i / n, w + (e - w) * j / n, s + (no - s) * (i + 1) / n, w + (e - w) * (j + 1) / n]);
  return out;
}

async function descargar(ciudad) {
  const { bbox } = CIUDADES[ciudad];
  const cajas = cuadrantes(bbox, ciudad === 'BOGOTA' ? 3 : 2);
  const vistos = new Map();
  for (let i = 0; i < cajas.length; i++) {
    const q = `[out:json][timeout:300];
way["highway"~"^(${CLASES.join('|')})$"](${cajas[i].join(',')});
out geom;`;
    const els = await pedir(q);
    for (const e of els) if (!vistos.has(e.id)) vistos.set(e.id, e);
    console.log(`    ${ciudad} ${i + 1}/${cajas.length} · ${els.length.toLocaleString('es-CO')} vías · acumuladas ${vistos.size.toLocaleString('es-CO')}`);
    await sleep(4000);
  }

  // Compresión: coordenadas a entero de 1e-6 grados (~0,1 m) y en delta contra la anterior.
  // Los deltas son números pequeños, así que el JSON resultante pesa una fracción del crudo.
  const vias = [];
  for (const e of vistos.values()) {
    if (!e.geometry || e.geometry.length < 2) continue;
    const g = [];
    let px = 0, py = 0;
    for (const p of e.geometry) {
      const x = Math.round(p.lon * 1e6), y = Math.round(p.lat * 1e6);
      g.push(x - px, y - py); px = x; py = y;
    }
    vias.push({ v: velocidad(e.tags || {}), s: sentido(e.tags || {}), g });
  }
  fs.writeFileSync(archivo(ciudad), JSON.stringify({ ciudad, bbox, vias }));
  const mb = fs.statSync(archivo(ciudad)).size / 1048576;
  console.log(`  ${ciudad}: ${vias.length.toLocaleString('es-CO')} vías · ${mb.toFixed(1)} MB\n`);
}

// Devuelve las vías con la geometría ya reconstruida a grados.
function cargar(ciudad) {
  const f = archivo(ciudad);
  if (!fs.existsSync(f)) throw new Error(`Falta ${path.basename(f)}. Correr: node red-vial.js --fetch`);
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const via of d.vias) {
    const pts = [];
    let x = 0, y = 0;
    for (let i = 0; i < via.g.length; i += 2) { x += via.g[i]; y += via.g[i + 1]; pts.push([x / 1e6, y / 1e6]); }
    via.pts = pts;                      // [ [lng,lat], ... ]
  }
  return d;
}

module.exports = { cargar, archivo, CLASES, VEL };

if (require.main === module && process.argv.includes('--fetch')) {
  (async () => {
    for (const c of ['BOGOTA', 'MEDELLIN', 'CALI']) {
      if (fs.existsSync(archivo(c)) && !process.argv.includes('--force')) { console.log(`  ${c}: cache ya existe`); continue; }
      await descargar(c);
      await sleep(6000);
    }
  })();
}
