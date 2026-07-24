// Geocodifica las bodegas contra LocationIQ, con dos guardas que la versión
// anterior no tenía y sin las cuales el resultado no es confiable:
//
//   1. Control de tasa con reintento ante 429.
//   2. VALIDACIÓN POR MUNICIPIO: si la coordenada cae lejos del municipio que
//      declara el dato, se descarta. Sin esto el geocodificador devuelve
//      homónimos en otra parte del país (una bodega de Cali a 732 km).
//
//   LIQ_KEY=xxx node geocode2.js --muestra 40
//   LIQ_KEY=xxx node geocode2.js --todo
//
// Reanudable: cachea en geocache-liq.json y no repite lo ya resuelto.
const fs = require('fs');

const KEY = process.env.LIQ_KEY || '';
if (!KEY) { console.error('Falta LIQ_KEY'); process.exit(1); }
const PAUSA = +(process.env.PAUSA || 700);
const CACHE = 'geocache-liq.json';
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const { MUN, DEP } = JSON.parse(fs.readFileSync('centroides.json', 'utf8'));
const sleep = ms => new Promise(r => setTimeout(r, ms));

const hav = (a, b, c, d) => { const R = 6371000, t = x => x * Math.PI / 180;
  const dp = t(c - a), dl = t(d - b);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(t(a)) * Math.cos(t(c)) * Math.sin(dl / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h))); };

const RUIDO = /\b(APTO?|APARTAMENTO|OFC|OFICINA|LOCAL|BODEGA|PISO|TORRE|BLOQUE|BL|INT|INTERIOR|CASA|MZ|MANZANA|ETAPA|CONJUNTO|EDIFICIO|EDIF|CC|CENTRO COMERCIAL|MODULO|SOTANO|BARRIO|BR|URB|URBANIZACION)\b.*$/i;
function limpiar(addr) {
  let a = (addr || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\bKRA?\b|\bCRA?\b|\bCR\b|\bKR\b/g, 'CARRERA')
    .replace(/\bCLL?E?\b|\bCL\b/g, 'CALLE')
    .replace(/\bAVDA?\b|\bAV\b/g, 'AVENIDA')
    .replace(/\bDG\b|\bDIAG\b/g, 'DIAGONAL')
    .replace(/\bTV\b|\bTRANSV\b/g, 'TRANSVERSAL')
    .replace(/\bNO\.?(?=\s|\d)|\bNUM(ERO)?\.?(?=\s|\d)|N°/g, '#')
    .replace(/\s+/g, ' ').trim();
  const m = a.match(/\b(CALLE|CARRERA|AVENIDA|DIAGONAL|TRANSVERSAL|AUTOPISTA|KM|KILOMETRO|VIA)\b/);
  if (m && m.index !== undefined) {
    const cortado = a.slice(m.index).replace(RUIDO, '').trim();
    if (cortado.length >= 6) a = cortado;
  }
  return a.replace(/[,;.\-]+$/, '').trim();
}

async function geocodificar(q) {
  const u = new URL('https://us1.locationiq.com/v1/search');
  u.searchParams.set('key', KEY);
  u.searchParams.set('q', q);
  u.searchParams.set('format', 'json');
  u.searchParams.set('limit', '1');
  u.searchParams.set('countrycodes', 'co');
  u.searchParams.set('addressdetails', '1');
  let r = await fetch(u);
  for (let i = 0; i < 5 && r.status === 429; i++) { await sleep(1500 * (i + 1)); r = await fetch(u); }
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = await r.json();
  if (!Array.isArray(j) || !j.length) return null;
  const h = j[0];
  return { lat: +h.lat, lng: +h.lon, tipo: h.type, clase: h.class, match: h.display_name };
}

// El resultado sólo vale si cae donde el dato dice que está la bodega.
function valida(g, dane, dep) {
  if (!g || !isFinite(g.lat)) return { ok: false, motivo: 'no_encontrado' };
  if (g.lat < -4.3 || g.lat > 13.6 || g.lng < -79.6 || g.lng > -66.6)
    return { ok: false, motivo: 'fuera_de_colombia' };
  const c = MUN[dane];
  if (c) {
    const d = hav(c[0], c[1], g.lat, g.lng);
    const limite = dane === '11001' ? 30000 : 25000;
    return d <= limite ? { ok: true, motivo: 'ok', dist: d } : { ok: false, motivo: 'lejos_del_municipio', dist: d };
  }
  const cd = DEP[dep];
  if (cd) {
    const d = hav(cd[0], cd[1], g.lat, g.lng);
    return d <= 150000 ? { ok: true, motivo: 'solo_depto', dist: d } : { ok: false, motivo: 'lejos_del_depto', dist: d };
  }
  return { ok: true, motivo: 'sin_referencia', dist: null };
}
function confianza(g) {
  if (['house', 'building', 'yes', 'commercial', 'industrial', 'retail', 'warehouse'].includes(g.tipo)) return 'alta';
  if (['residential', 'tertiary', 'secondary', 'primary', 'road', 'unclassified', 'living_street', 'trunk', 'service'].includes(g.tipo)) return 'media';
  if (['city', 'town', 'municipality', 'administrative', 'village', 'suburb', 'neighbourhood'].includes(g.tipo)) return 'baja';
  return 'media';
}

(async () => {
  const D = JSON.parse(fs.readFileSync('datos-recolecciones.json', 'utf8'));
  const todo = process.argv.includes('--todo');
  const n = +(process.argv[process.argv.indexOf('--muestra') + 1] || 40);
  let lote = D.puntos;
  if (!todo) {
    const top = D.puntos.slice(0, Math.ceil(n * 0.4));
    const vistos = new Set(top.map(p => p.dane)), otros = [];
    for (const p of D.puntos) { if (otros.length >= n - top.length) break;
      if (!vistos.has(p.dane)) { vistos.add(p.dane); otros.push(p); } }
    lote = [...top, ...otros];
  }
  console.log(`LocationIQ · ${lote.length} direcciones · pausa ${PAUSA} ms · ~${Math.ceil(lote.length * PAUSA / 60000)} min\n`);

  const res = [];
  let nuevas = 0;
  for (let i = 0; i < lote.length; i++) {
    const p = lote[i], key = String(p.id);
    if (!cache[key]) {
      let g = null;
      try { g = await geocodificar(`${limpiar(p.a)}, ${p.m}, Colombia`); }
      catch (e) { g = { error: e.message }; }
      if (g && !g.error) {
        const v = valida(g, p.dane, p.dep);
        g.valido = v.ok; g.motivo = v.motivo; g.dist_centro = v.dist;
        g.conf = v.ok ? confianza(g) : 'descartado';
      }
      cache[key] = g || { valido: false, motivo: 'no_encontrado', conf: 'no_encontrado' };
      fs.writeFileSync(CACHE, JSON.stringify(cache));
      nuevas++;
      if (todo && nuevas % 100 === 0) console.log(`  … ${i + 1}/${lote.length}`);
      if (!todo) {
        const g2 = cache[key];
        console.log(`${String(i + 1).padStart(3)}/${lote.length} ${p.m.slice(0, 11).padEnd(12)} ` +
          `${String(g2.conf || '-').padEnd(12)} ${g2.valido ? (g2.dist_centro || 0) + ' m del centro' : (g2.motivo || g2.error)}`);
      }
      await sleep(PAUSA);
    }
    res.push({ p, g: cache[key] });
  }

  const ok = res.filter(r => r.g && r.g.valido);
  const desc = res.filter(r => r.g && r.g.lat && !r.g.valido);
  const nof = res.filter(r => !r.g || (!r.g.lat && !r.g.error));
  const err = res.filter(r => r.g && r.g.error);
  const conf = {}; ok.forEach(r => conf[r.g.conf] = (conf[r.g.conf] || 0) + 1);
  const mot = {}; desc.forEach(r => mot[r.g.motivo] = (mot[r.g.motivo] || 0) + 1);

  console.log('\n===== RESULTADO =====');
  console.log(`total            ${res.length}`);
  console.log(`válidas          ${ok.length} (${Math.round(ok.length / res.length * 100)}%)  ${JSON.stringify(conf)}`);
  console.log(`descartadas      ${desc.length}  ${JSON.stringify(mot)}`);
  console.log(`no encontradas   ${nof.length}`);
  console.log(`errores          ${err.length}`);
  const gOk = ok.reduce((s, r) => s + r.p.t, 0), gTot = res.reduce((s, r) => s + r.p.t, 0);
  console.log(`\nguías cubiertas  ${gOk.toLocaleString('es-CO')} / ${gTot.toLocaleString('es-CO')} (${Math.round(gOk / gTot * 100)}%)`);

  fs.writeFileSync('geocode-final.json', JSON.stringify(res.map(r => ({
    id: r.p.id, bodega: r.p.b, municipio: r.p.m, dane: r.p.dane, direccion: r.p.a,
    limpia: limpiar(r.p.a), guias: r.p.t,
    lat: r.g && r.g.valido ? r.g.lat : null, lng: r.g && r.g.valido ? r.g.lng : null,
    conf: r.g ? r.g.conf : 'no_encontrado', motivo: r.g ? r.g.motivo : null,
    match: r.g ? r.g.match : null,
  })), null, 1));
  console.log('-> geocode-final.json');
})();
