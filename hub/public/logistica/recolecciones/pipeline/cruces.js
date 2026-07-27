// Geocodificación por INTERSECCIÓN de vías.
//
// El problema que resuelve: los geocodificadores (LocationIQ, Nominatim) no
// entienden la nomenclatura colombiana. Ante "Carrera 20 # 14-35" resuelven el
// nombre de la vía e ignoran la placa, así que devuelven un punto cualquiera de
// la Carrera 20 — que cruza Bogotá entera. Medido: 17 km de error en ese caso,
// 5,8 km en GoldBox.
//
// La idea: una dirección colombiana ES una intersección. "Carrera 20 # 14-35"
// significa sobre la Carrera 20, a 35 m de la Calle 14. OSM tiene las dos vías
// como geometría, así que se traen todos sus tramos y se calcula dónde se
// tocan. Y la separación entre ambas es su propia validación: si no se cruzan,
// la dirección no existe como está escrita y la bodega queda SIN UBICAR, en vez
// de recibir un punto inventado.
//
// Se consulta por VÍA, no por bodega: 1.417 direcciones se reducen a ~1.390
// nombres distintos, agrupables en ~99 consultas. Todo se cachea; los cruces se
// calculan en local.
//
//   node cruces.js            # corre todo (~17 min, respeta el rate limit)
//   node cruces.js --municipio BOGOTA
//   node cruces.js --reporte  # solo recalcula desde el cache, sin red
const fs = require('fs');
const path = require('path');

const OVERPASS = 'https://overpass-api.de/api/interpreter';
const UA = { 'User-Agent': 'dropi-recolecciones/1.0 (producto@dropi.co)' };
const PAUSA = +(process.env.PAUSA_OVERPASS || 10000);
const LOTE = 50;

const DIR = __dirname;
const DATOS = path.join(DIR, '..', 'datos-recolecciones.json');
const CACHE = path.join(DIR, 'geocache-cruces.json');   // gitignored
const SALIDA = path.join(DIR, 'cruces-resultado.json');

const sleep = ms => new Promise(r => setTimeout(r, ms));
const hav = (a, b, c, d) => { const R = 6371000, t = x => x * Math.PI / 180;
  const dp = t(c - a), dl = t(d - b);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(t(a)) * Math.cos(t(c)) * Math.sin(dl / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h))); };

// ── Normalización de la dirección ──────────────────────────────────────────
// Lista blanca: se extrae la nomenclatura y se descarta el resto. La lista
// negra anterior ("cortar en LOCAL, PISO…") nunca estaba completa: le faltaban
// OFI, LC, P, PUERTA, PASILLO, y "BODEGAS" en plural ni siquiera coincidía.

function normalizar(addr) {
  let a = (addr || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\bKRA?\b|\bCRA?\b|\bCR\b|\bKR\b|\bCARR\b/g, 'CARRERA')
    .replace(/\bCLL?E?\b|\bCL\b/g, 'CALLE')
    .replace(/\bAVDA?\b|\bAV\b/g, 'AVENIDA')
    .replace(/\bDG\b|\bDIAG\b/g, 'DIAGONAL')
    .replace(/\bTV\b|\bTRANSV\b|\bTRV\b/g, 'TRANSVERSAL')
    .replace(/\bNRO\.?|\bNO\.?(?=\s|\d)|\bNUM(ERO)?\.?(?=\s|\d)|N°/g, '#');
  // "N" suelta = número, pero SOLO si no hay ya un "#": en "Calle 56 # 5 N-122"
  // (Cali) esa N es Norte y convertirla rompería la dirección.
  if (!a.includes('#')) a = a.replace(/\bN\b(?=\s*\d)/, '#');
  return a.replace(/\s+/g, ' ').trim();
}

/** "Carrera 20 # 14-35" → ["CARRERA 20", "CALLE 14"]. null si no es cruzable. */
function parDeVias(addr) {
  const a = normalizar(addr);
  const m = a.match(/\b(CALLE|CARRERA|AVENIDA|DIAGONAL|TRANSVERSAL)\s*(\d{1,3}[A-Z]{0,2})\s*(BIS)?\s*#\s*(\d{1,3}[A-Z]{0,2})/);
  if (!m) return null;
  const [, tipo, n1, bis, n2] = m;
  // La transversal es del tipo opuesto: una Carrera cruza con una Calle.
  const opuesto = tipo === 'CARRERA' ? 'CALLE' : 'CARRERA';
  return [`${tipo} ${n1}${bis ? ' BIS' : ''}`, `${opuesto} ${n2}`];
}

// ── Overpass ───────────────────────────────────────────────────────────────

async function pedirVias(nombres, bbox, intento = 0) {
  const alternancia = nombres
    .map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const q = `[out:json][timeout:60];` +
    `way["name"~"^(${alternancia})$",i]["highway"](${bbox});out geom;`;

  let r;
  try {
    r = await fetch(OVERPASS, { method: 'POST', headers: UA, body: 'data=' + encodeURIComponent(q) });
  } catch (e) {
    if (intento < 3) { await sleep(15000 * (intento + 1)); return pedirVias(nombres, bbox, intento + 1); }
    throw e;
  }
  // 429 = rate limit, 504 = el servidor público está saturado. Los dos se
  // resuelven esperando; no son errores nuestros.
  if ((r.status === 429 || r.status === 504) && intento < 4) {
    await sleep(20000 * (intento + 1));
    return pedirVias(nombres, bbox, intento + 1);
  }
  if (!r.ok) throw new Error('Overpass HTTP ' + r.status);

  const j = await r.json();
  const porNombre = {};
  for (const e of j.elements ?? []) {
    const n = (e.tags?.name || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (!e.geometry || e.geometry.length < 2) continue;
    (porNombre[n] = porNombre[n] || []).push(e.geometry.map(p => [p.lat, p.lon]));
  }
  return porNombre;
}

/** Punto donde dos vías se tocan, con su separación. */
function cruzar(viaA, viaB) {
  let mejor = null;
  for (const la of viaA) for (const pa of la) {
    for (const lb of viaB) for (const pb of lb) {
      const d = hav(pa[0], pa[1], pb[0], pb[1]);
      if (!mejor || d < mejor.d) {
        mejor = { d, lat: (pa[0] + pb[0]) / 2, lng: (pa[1] + pb[1]) / 2 };
        if (d === 0) return mejor;      // se cruzan exactamente: no hay mejor
      }
    }
  }
  return mejor;
}

// ── Proceso ────────────────────────────────────────────────────────────────

(async () => {
  const soloMunicipio = process.argv.includes('--municipio')
    ? process.argv[process.argv.indexOf('--municipio') + 1] : null;
  const soloReporte = process.argv.includes('--reporte');

  const { puntos } = JSON.parse(fs.readFileSync(DATOS, 'utf8'));
  const { MUN } = JSON.parse(fs.readFileSync(path.join(DIR, 'centroides.json'), 'utf8'));
  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};

  // Agrupar las vías que hay que pedir, por municipio
  const porMunicipio = new Map();
  const bodegas = [];
  for (const p of puntos) {
    const par = parDeVias(p.a);
    if (!par) continue;
    if (soloMunicipio && p.m !== soloMunicipio) continue;
    bodegas.push({ ...p, par });
    const g = porMunicipio.get(p.dane) ?? { dane: p.dane, nombre: p.m, vias: new Set() };
    par.forEach(v => g.vias.add(v));
    porMunicipio.set(p.dane, g);
  }

  console.log(`${bodegas.length} bodegas con nomenclatura cruzable · ${porMunicipio.size} municipios`);

  if (!soloReporte) {
    let hechas = 0;
    const total = [...porMunicipio.values()]
      .reduce((s, g) => s + Math.ceil(g.vias.size / LOTE), 0);
    console.log(`${total} consultas a Overpass · pausa ${PAUSA / 1000}s · ~${Math.round(total * PAUSA / 60000)} min\n`);

    for (const g of porMunicipio.values()) {
      const c = MUN[g.dane];
      if (!c) { console.log(`  ${g.nombre}: sin centroide, se salta`); continue; }
      // ±0.22° ≈ 24 km alrededor del centro del municipio.
      const bbox = [c[0] - 0.22, c[1] - 0.22, c[0] + 0.22, c[1] + 0.22].join(',');

      const faltantes = [...g.vias].filter(v => !(cache[g.dane]?.[v]));
      if (!faltantes.length) continue;

      for (let i = 0; i < faltantes.length; i += LOTE) {
        const lote = faltantes.slice(i, i + LOTE);
        try {
          const res = await pedirVias(lote, bbox);
          cache[g.dane] = cache[g.dane] || {};
          // Se guarda TAMBIÉN lo que no vino: así no se vuelve a pedir.
          for (const v of lote) cache[g.dane][v] = res[v] ?? [];
          fs.writeFileSync(CACHE, JSON.stringify(cache));
          const encontradas = lote.filter(v => (res[v] ?? []).length).length;
          hechas++;
          console.log(`  [${hechas}/${total}] ${g.nombre.padEnd(16)} ${encontradas}/${lote.length} vías`);
        } catch (e) {
          hechas++;
          console.log(`  [${hechas}/${total}] ${g.nombre.padEnd(16)} ERROR: ${e.message}`);
        }
        await sleep(PAUSA);
      }
    }
  }

  // ── Cruces ───────────────────────────────────────────────────────────────
  console.log('\nCalculando cruces…\n');
  const resultado = [];
  const stats = { cruzan: 0, lejos: 0, falta_via: 0 };

  for (const b of bodegas) {
    const vias = cache[b.dane] || {};
    const A = vias[b.par[0]], B = vias[b.par[1]];
    if (!A?.length || !B?.length) { stats.falta_via++; continue; }

    const c = cruzar(A, B);
    if (!c) { stats.falta_via++; continue; }

    // Hasta 80 m se considera el mismo cruce: OSM parte las vías en tramos y
    // los extremos no siempre coinciden exactamente en la esquina.
    const cruzan = c.d <= 80;
    if (cruzan) stats.cruzan++; else stats.lejos++;

    resultado.push({
      id: b.id, bodega: b.b, direccion: b.a, municipio: b.m,
      vias: b.par, separacion_m: c.d, cruzan,
      lat: cruzan ? +c.lat.toFixed(6) : null,
      lng: cruzan ? +c.lng.toFixed(6) : null,
      // Cuánto se movería respecto de donde está hoy en el mapa
      movimiento_m: cruzan ? hav(b.lat, b.lng, c.lat, c.lng) : null,
      guias: b.t,
    });
  }

  fs.writeFileSync(SALIDA, JSON.stringify(resultado, null, 1));

  const conCruce = resultado.filter(r => r.cruzan);
  const movs = conCruce.map(r => r.movimiento_m).sort((a, b) => a - b);
  const pct = n => movs.length ? movs[Math.floor(movs.length * n)] : 0;

  console.log('RESULTADO');
  console.log(`  cruzan (≤80 m)        ${stats.cruzan}`);
  console.log(`  no se cruzan          ${stats.lejos}   → quedan sin ubicar, que es lo correcto`);
  console.log(`  alguna vía sin OSM    ${stats.falta_via}`);
  console.log(`  guías con cruce       ${conCruce.reduce((s, r) => s + r.guias, 0).toLocaleString('es-CO')}`);
  console.log(`\n  cuánto se mueven respecto del punto actual:`);
  console.log(`    mediana ${pct(0.5)} m · p90 ${pct(0.9)} m · máximo ${movs[movs.length - 1] ?? 0} m`);
  console.log(`    a más de 1 km: ${movs.filter(m => m > 1000).length} bodegas ← estaban muy mal ubicadas`);
  console.log(`\n-> ${path.basename(SALIDA)}`);
})().catch(e => { console.error('\n✗', e.message); process.exit(1); });
