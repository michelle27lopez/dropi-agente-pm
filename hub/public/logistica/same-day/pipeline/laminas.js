#!/usr/bin/env node
'use strict';
/**
 * laminas.js — genera el entregable imprimible de Same Day (PDF vectorial + SVG por lámina)
 * a partir de `../datos-sameday.json` y `../datos-simulacion.json`.
 *
 * Por qué no un screenshot del mapa: el mapa pinta la capa de calor sobre un canvas de Leaflet
 * con basemap de un CDN externo. Una captura sale rasterizada, dependiente de internet y del
 * zoom que tuviera la pantalla ese día, y —lo importante— se va sin la nota de precisión.
 * Acá se dibuja desde el agregado, así que la lámina es vectorial, reproducible y lleva
 * impresos sus propios límites.
 *
 * Sin dependencias: el PDF se escribe a mano (fuentes base-14, sin incrustar) y el SVG es texto.
 *
 *   node pipeline/laminas.js          → entregables/same-day-mapas.pdf + entregables/*.svg
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DIR = path.join(__dirname, '..');
const OUT = path.join(DIR, 'entregables');

// ── Paleta ────────────────────────────────────────────────────────────────────────────────
// Secuencial de un solo tono (azul, claro→oscuro) para magnitud; categórica de 3 ranuras para
// las tres ciudades. Validadas contra la superficie clara con el validador de la guía de
// visualización (all-pairs: CVD ΔE 9,2 · visión normal 24,0). El aguamarina queda bajo 3:1
// contra el papel → por eso las tres series van con etiqueta directa, no solo color.
const SEQ = ['#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b'];
const CIUDAD_COLOR = { BOGOTA: '#2a78d6', MEDELLIN: '#eb6834', CALI: '#1baf7a' };

const INK = '#0b0b0b';        // tinta primaria
const INK2 = '#52514e';       // tinta secundaria
const MUTED = '#898781';      // ejes y etiquetas
const GRID = '#e1e0d9';       // retícula
const AXIS = '#c3c2b7';       // línea base
const SURFACE = '#fcfcfb';    // superficie de la lámina
const PLANE = '#f2f1ed';      // fondo del área de mapa
const ZONA_FILL = '#ffffff';  // relleno de la zona sin demanda
const ZONA_LINE = '#b9b7ae';  // contorno de zona
const ALERTA = '#d03b3b';     // solo para el rótulo de límites

// ── Métricas de Helvetica (AFM base-14) ───────────────────────────────────────────────────
const W_REG = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
const W_BOLD = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];

// Los acentos del español no están en la tabla ASCII: se mide con la letra base, que en
// Helvetica tiene el mismo ancho que su versión acentuada.
const BASE = { 'á':'a','é':'e','í':'i','ó':'o','ú':'u','ü':'u','ñ':'n','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U','Ñ':'N','ç':'c','Ç':'C','°':'o','º':'o','·':'.','–':'-','—':'-','’':"'",'“':'"','”':'"','…':'.' };

function anchoChar(ch, bold) {
  const t = bold ? W_BOLD : W_REG;
  let c = ch.charCodeAt(0);
  if (c >= 32 && c <= 126) return t[c - 32];
  const b = BASE[ch];
  if (b) return t[b.charCodeAt(0) - 32];
  return 556;
}
function anchoTexto(s, size, bold) {
  let w = 0;
  for (const ch of String(s)) w += anchoChar(ch, bold);
  return (w * size) / 1000;
}

// ── Escena: primitivas que ambos renderizadores entienden ─────────────────────────────────
// Coordenadas en puntos, origen arriba-izquierda, y hacia abajo (el PDF se voltea al escribir).
function Escena() {
  return { ops: [] };
}
const dib = {
  rect: (e, x, y, w, h, o = {}) => e.ops.push({ t: 'rect', x, y, w, h, ...o }),
  poly: (e, pts, o = {}) => e.ops.push({ t: 'poly', pts, ...o }),
  linea: (e, x1, y1, x2, y2, o = {}) => e.ops.push({ t: 'poly', pts: [[x1, y1], [x2, y2]], close: false, ...o }),
  circ: (e, cx, cy, r, o = {}) => e.ops.push({ t: 'circ', cx, cy, r, ...o }),
  texto: (e, x, y, s, o = {}) => e.ops.push({ t: 'text', x, y, s: String(s), size: o.size || 9, bold: !!o.bold, fill: o.fill || INK, align: o.align || 'left' }),
  clip: (e, x, y, w, h) => e.ops.push({ t: 'clip', x, y, w, h }),
  fin: (e) => e.ops.push({ t: 'unclip' }),
};

// Texto con salto de línea por ancho máximo. Devuelve la y final.
function parrafo(e, x, y, ancho, s, o = {}) {
  const size = o.size || 9, lh = o.lh || size * 1.45;
  const palabras = String(s).split(/\s+/);
  let linea = '', yy = y;
  for (const p of palabras) {
    const test = linea ? linea + ' ' + p : p;
    if (anchoTexto(test, size, o.bold) > ancho && linea) {
      dib.texto(e, x, yy, linea, o); yy += lh; linea = p;
    } else linea = test;
  }
  if (linea) { dib.texto(e, x, yy, linea, o); yy += lh; }
  return yy;
}

// ── Renderizador PDF ──────────────────────────────────────────────────────────────────────
const WINANSI = { 0x2013: 0x96, 0x2014: 0x97, 0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93, 0x201d: 0x94, 0x2026: 0x85, 0x2022: 0x95 };
function pdfTexto(s) {
  const bytes = [];
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    let b = c < 256 ? c : (WINANSI[c] != null ? WINANSI[c] : 0x3f);
    if (b === 0x28 || b === 0x29 || b === 0x5c) bytes.push(0x5c);
    bytes.push(b);
  }
  return Buffer.from(bytes, 'latin1');
}
function rgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255]
    .map((v) => v.toFixed(3)).join(' ');
}
const n2 = (v) => (Math.round(v * 100) / 100).toString();

function escenaAPdf(e, H) {
  const Y = (y) => H - y;             // el PDF tiene el origen abajo
  const out = [];
  for (const op of e.ops) {
    if (op.t === 'clip') {
      out.push(`q ${n2(op.x)} ${n2(Y(op.y + op.h))} ${n2(op.w)} ${n2(op.h)} re W n`);
    } else if (op.t === 'unclip') {
      out.push('Q');
    } else if (op.t === 'rect') {
      if (op.fill) out.push(`${rgb(op.fill)} rg`);
      if (op.stroke) out.push(`${rgb(op.stroke)} RG ${n2(op.lw || 0.5)} w`);
      out.push(`${n2(op.x)} ${n2(Y(op.y + op.h))} ${n2(op.w)} ${n2(op.h)} re ${op.fill && op.stroke ? 'B' : op.fill ? 'f' : 'S'}`);
    } else if (op.t === 'poly') {
      if (op.fill) out.push(`${rgb(op.fill)} rg`);
      if (op.stroke) out.push(`${rgb(op.stroke)} RG ${n2(op.lw || 0.5)} w`);
      const p = op.pts;
      if (!p.length) continue;
      let d = `${n2(p[0][0])} ${n2(Y(p[0][1]))} m`;
      for (let i = 1; i < p.length; i++) d += ` ${n2(p[i][0])} ${n2(Y(p[i][1]))} l`;
      if (op.close !== false) d += ' h';
      out.push(`${d} ${op.fill && op.stroke ? 'B' : op.fill ? 'f' : 'S'}`);
    } else if (op.t === 'circ') {
      const k = 0.5523 * op.r, { cx, cy, r } = op;
      if (op.fill) out.push(`${rgb(op.fill)} rg`);
      if (op.stroke) out.push(`${rgb(op.stroke)} RG ${n2(op.lw || 0.5)} w`);
      out.push(
        `${n2(cx - r)} ${n2(Y(cy))} m ` +
        `${n2(cx - r)} ${n2(Y(cy - k))} ${n2(cx - k)} ${n2(Y(cy - r))} ${n2(cx)} ${n2(Y(cy - r))} c ` +
        `${n2(cx + k)} ${n2(Y(cy - r))} ${n2(cx + r)} ${n2(Y(cy - k))} ${n2(cx + r)} ${n2(Y(cy))} c ` +
        `${n2(cx + r)} ${n2(Y(cy + k))} ${n2(cx + k)} ${n2(Y(cy + r))} ${n2(cx)} ${n2(Y(cy + r))} c ` +
        `${n2(cx - k)} ${n2(Y(cy + r))} ${n2(cx - r)} ${n2(Y(cy + k))} ${n2(cx - r)} ${n2(Y(cy))} c h ` +
        `${op.fill && op.stroke ? 'B' : op.fill ? 'f' : 'S'}`);
    } else if (op.t === 'text') {
      const w = anchoTexto(op.s, op.size, op.bold);
      const x = op.align === 'center' ? op.x - w / 2 : op.align === 'right' ? op.x - w : op.x;
      out.push(`BT /${op.bold ? 'F2' : 'F1'} ${n2(op.size)} Tf ${rgb(op.fill)} rg 1 0 0 1 ${n2(x)} ${n2(Y(op.y))} Tm`);
      out.push(Buffer.concat([Buffer.from('('), pdfTexto(op.s), Buffer.from(') Tj ET')]).toString('latin1'));
    }
  }
  return out.join('\n');
}

function escribirPdf(paginas, W, H, ruta) {
  const objs = [];                                   // 1-indexado; objs[i] = Buffer del cuerpo
  const push = (b) => { objs.push(Buffer.isBuffer(b) ? b : Buffer.from(b, 'latin1')); return objs.length; };

  const idFuenteReg = push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const idFuenteBold = push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const idPages = push('');                          // se rellena al final
  const idsPagina = [];

  for (const esc of paginas) {
    const raw = Buffer.from(escenaAPdf(esc, H), 'latin1');
    const z = zlib.deflateSync(raw, { level: 9 });
    const idCont = push(Buffer.concat([
      Buffer.from(`<< /Length ${z.length} /Filter /FlateDecode >>\nstream\n`, 'latin1'), z, Buffer.from('\nendstream', 'latin1'),
    ]));
    idsPagina.push(push(
      `<< /Type /Page /Parent ${idPages} 0 R /MediaBox [0 0 ${n2(W)} ${n2(H)}] ` +
      `/Resources << /Font << /F1 ${idFuenteReg} 0 R /F2 ${idFuenteBold} 0 R >> >> /Contents ${idCont} 0 R >>`));
  }
  objs[idPages - 1] = Buffer.from(
    `<< /Type /Pages /Count ${idsPagina.length} /Kids [${idsPagina.map((i) => i + ' 0 R').join(' ')}] >>`, 'latin1');
  const idCat = push(`<< /Type /Catalog /Pages ${idPages} 0 R >>`);

  const partes = [Buffer.from('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n', 'latin1')];
  let off = partes[0].length;
  const offsets = [];
  objs.forEach((cuerpo, i) => {
    offsets[i] = off;
    const b = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`, 'latin1'), cuerpo, Buffer.from('\nendobj\n', 'latin1')]);
    partes.push(b); off += b.length;
  });
  let xref = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const o of offsets) xref += String(o).padStart(10, '0') + ' 00000 n \n';
  xref += `trailer\n<< /Size ${objs.length + 1} /Root ${idCat} 0 R >>\nstartxref\n${off}\n%%EOF\n`;
  partes.push(Buffer.from(xref, 'latin1'));
  fs.writeFileSync(ruta, Buffer.concat(partes));
}

// ── Renderizador SVG (misma escena; para abrir en el navegador y guardar como imagen) ──────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function escenaASvg(e, W, H) {
  const out = [`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Helvetica, Arial, sans-serif">`];
  let nclip = 0, abierto = 0;
  for (const op of e.ops) {
    if (op.t === 'clip') {
      const id = 'c' + (++nclip);
      out.push(`<clipPath id="${id}"><rect x="${n2(op.x)}" y="${n2(op.y)}" width="${n2(op.w)}" height="${n2(op.h)}"/></clipPath><g clip-path="url(#${id})">`);
      abierto++;
    } else if (op.t === 'unclip') { out.push('</g>'); abierto--; }
    else {
      const f = op.fill ? ` fill="${op.fill}"` : ' fill="none"';
      const s = op.stroke ? ` stroke="${op.stroke}" stroke-width="${op.lw || 0.5}"` : '';
      if (op.t === 'rect') out.push(`<rect x="${n2(op.x)}" y="${n2(op.y)}" width="${n2(op.w)}" height="${n2(op.h)}"${f}${s}/>`);
      else if (op.t === 'circ') out.push(`<circle cx="${n2(op.cx)}" cy="${n2(op.cy)}" r="${n2(op.r)}"${f}${s}/>`);
      else if (op.t === 'poly') {
        const d = op.pts.map((p, i) => `${i ? 'L' : 'M'}${n2(p[0])} ${n2(p[1])}`).join(' ') + (op.close !== false ? ' Z' : '');
        out.push(`<path d="${d}"${f}${s} stroke-linejoin="round"/>`);
      } else if (op.t === 'text') {
        const a = op.align === 'center' ? 'middle' : op.align === 'right' ? 'end' : 'start';
        out.push(`<text x="${n2(op.x)}" y="${n2(op.y)}" font-size="${op.size}" fill="${op.fill}" text-anchor="${a}"${op.bold ? ' font-weight="700"' : ''}>${esc(op.s)}</text>`);
      }
    }
  }
  while (abierto-- > 0) out.push('</g>');
  out.push('</svg>');
  return out.join('\n');
}

// ── Formato de números en español ─────────────────────────────────────────────────────────
const miles = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const pct = (n, d = 1) => n.toFixed(d).replace('.', ',') + '%';

// ── Datos ─────────────────────────────────────────────────────────────────────────────────
const D = JSON.parse(fs.readFileSync(path.join(DIR, 'datos-sameday.json'), 'utf8'));
const SIM = JSON.parse(fs.readFileSync(path.join(DIR, 'datos-simulacion.json'), 'utf8'));
const VERIF = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'verificacion-barrios.json'), 'utf8')); }
  catch { return null; }
})();

const NOMBRE = { BOGOTA: 'Bogotá', MEDELLIN: 'Medellín', CALI: 'Cali' };
const UNIDAD = { BOGOTA: 'localidad', MEDELLIN: 'comuna', CALI: 'comuna' };

// Municipios que el discovery (spec §0.1) lista como cobertura elegible o parcial y que NO
// tienen una sola orden en este export, porque `ciudad_destino` solo trae 3 valores. Hay que
// decirlo en la lámina: un mapa sin ellos se lee como "ahí no hay demanda", y eso no es lo que
// dice el dato — dice que el export no los trae.
const METRO = {
  BOGOTA: 'Soacha, Chía, Mosquera y Funza',
  MEDELLIN: 'Bello, Itagüí y Sabaneta',
  CALI: 'Jamundí',
};
const CIUDADES = ['BOGOTA', 'MEDELLIN', 'CALI'];

// Errores gruesos >3 km medidos por el pipeline contra el barrio que menciona la propia
// dirección. Se leen del JSON de verificación si está; si no, quedan los del spec.
function errorGrueso(c) {
  const v = VERIF && (VERIF[c] || (VERIF.ciudades && VERIF.ciudades[c]));
  const cand = v && (v.error_grueso_pct ?? v.gruesos_pct ?? v.pct_gruesos);
  if (typeof cand === 'number') return cand;
  return { BOGOTA: 22.6, MEDELLIN: 6.7, CALI: 9.9 }[c];
}

// ── Rejilla vertical de la página ─────────────────────────────────────────────────────────
// El pie con el rótulo de límites es fijo y va en todas las láminas, así que se reserva su
// banda primero y el contenido se ajusta a lo que queda. (La primera versión calculaba el
// mapa contra el alto total y la leyenda se montaba encima del pie.)
// Vertical y no apaisado: las tres ciudades son bastante más altas que anchas (relación
// ancho/alto 0,54 Bogotá · 0,56 Medellín · 0,76 Cali), así que en apaisado el mapa —que es el
// entregable— quedaba en 6,6 cm de ancho. En A4 vertical casi se duplica el área útil.
const FOOT_LINE = 768;    // filete superior del pie
const CONTENT_MAX = 756;  // ninguna tinta de contenido puede pasar de aquí
const MAPA_ALTO = 470;    // alto máximo del recuadro de mapa (igual en las 3 para que las páginas rimen)
const MAPA_ANCHO = 330;   // ancho máximo (deja ≥190 pt para el panel de ranking)

// ── Proyección ────────────────────────────────────────────────────────────────────────────
// Equirectangular con corrección por coseno de la latitud media. A escala de ciudad la
// distorsión es despreciable y evita meter una librería de proyecciones.
// El encuadre se saca de la DEMANDA, no del límite administrativo. Encuadrar por contornos
// mete a Sumapaz —la localidad rural de Bogotá, que no tiene una sola orden— y deja media
// lámina en blanco con la mancha urbana apretada arriba. Se recorta al rango que cubre el
// 99,5% de las órdenes ubicadas; lo que queda fuera del marco lo corta el recorte del mapa.
function extension(c) {
  const rango = (eje) => {
    const v = c.celdas.map((x) => [x[eje], x[2]]).sort((a, b) => a[0] - b[0]);
    const tot = v.reduce((a, x) => a + x[1], 0);
    let acc = 0, lo = v[0][0], hi = v[v.length - 1][0];
    for (const [p, n] of v) { acc += n; if (acc >= tot * 0.0025) { lo = p; break; } }
    acc = 0;
    for (let i = v.length - 1; i >= 0; i--) { acc += v[i][1]; if (acc >= tot * 0.0025) { hi = v[i][0]; break; } }
    const pad = (hi - lo) * 0.05;
    return [lo - pad, hi + pad];
  };
  const [minLat, maxLat] = rango(0), [minLon, maxLon] = rango(1);
  const k = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
  return { minLat, maxLat, minLon, maxLon, k, dx: (maxLon - minLon) * k, dy: maxLat - minLat };
}
function proyector(c, vx, vy, vw, vh) {
  const E = extension(c);
  const s = Math.min(vw / E.dx, vh / E.dy) * 0.98;
  const ox = vx + (vw - E.dx * s) / 2, oy = vy + (vh - E.dy * s) / 2;
  const P = (la, lo) => [ox + (lo - E.minLon) * E.k * s, oy + (E.maxLat - la) * s];
  P.escala = s; P.k = E.k;
  return P;
}

// Cortes por cuantiles: con densidad muy sesgada (Bogotá va de 1 a 319 por celda) los cortes
// iguales dejan el mapa entero en el tono más claro y no se lee nada.
function cortes(vals, n) {
  const v = vals.slice().sort((a, b) => a - b);
  const qs = [];
  for (let i = 1; i < n; i++) qs.push(v[Math.floor((i / n) * v.length)]);
  return qs;
}
const clase = (v, qs) => { let i = 0; while (i < qs.length && v > qs[i]) i++; return i; };

// ── Lámina de ciudad ──────────────────────────────────────────────────────────────────────
function laminaCiudad(cod, W, H) {
  const c = D.ciudades[cod], e = Escena();
  const M = 38;
  // El recuadro se ajusta a la forma real de la ciudad en vez de dejar un cajón fijo: así
  // Cali (más ancha) no desperdicia alto y Bogotá (más alta) aprovecha toda la página.
  const E = extension(c), asp = E.dx / E.dy;
  const mapY = 110;
  const mapH = Math.min(MAPA_ALTO, MAPA_ANCHO / asp);
  const mapW = mapH * asp;
  const mapX = M;
  const panX = mapX + mapW + 24, panW = W - panX - M;

  dib.rect(e, 0, 0, W, H, { fill: SURFACE });

  // Encabezado
  dib.texto(e, M, 52, NOMBRE[cod], { size: 24, bold: true, fill: INK });
  dib.texto(e, M, 72, `${miles(c.ubicadas)} órdenes ubicadas de ${miles(c.total)} (${pct(c.cobertura)})`, { size: 10.5, fill: INK2 });
  dib.texto(e, M, 88, `Densidad de demanda en malla de ${c.celda_m} m · ${c.zonas.length} ${UNIDAD[cod]}s con demanda`, { size: 9, fill: MUTED });
  dib.linea(e, M, 98, W - M, 98, { stroke: GRID, lw: 1 });

  // Mapa
  dib.rect(e, mapX, mapY, mapW, mapH, { fill: PLANE });
  const P = proyector(c, mapX, mapY, mapW, mapH);
  dib.clip(e, mapX, mapY, mapW, mapH);

  for (const z of c.contornos) for (const anillo of z.a) {
    dib.poly(e, anillo.map(([la, lo]) => P(la, lo)), { fill: ZONA_FILL });
  }

  const qs = cortes(c.celdas.map((x) => x[2]), SEQ.length);
  const dLat = c.celda_m / 111320, dLon = dLat / P.k;
  for (const [la, lo, n] of c.celdas) {
    const a = P(la + dLat / 2, lo - dLon / 2), b = P(la - dLat / 2, lo + dLon / 2);
    dib.rect(e, a[0], a[1], Math.max(b[0] - a[0], 0.6), Math.max(b[1] - a[1], 0.6), { fill: SEQ[clase(n, qs)] });
  }
  for (const z of c.contornos) for (const anillo of z.a) {
    dib.poly(e, anillo.map(([la, lo]) => P(la, lo)), { stroke: ZONA_LINE, lw: 0.5 });
  }

  // Insignias numeradas sobre las zonas del ranking: evita el choque de rótulos largos
  // encima del calor, y amarra el mapa con la lista de la derecha.
  const centro = {};
  for (const z of (SIM.ciudades[cod] ? SIM.ciudades[cod].zonas : [])) centro[z.n] = [z.lat, z.lng];
  for (const z of c.contornos) if (!centro[z.n]) {
    let sla = 0, slo = 0, n = 0;
    for (const anillo of z.a) for (const [la, lo] of anillo) { sla += la; slo += lo; n++; }
    if (n) centro[z.n] = [sla / n, slo / n];
  }
  const top = c.zonas.slice(0, 8);
  top.forEach((z, i) => {
    const ct = centro[z.nombre]; if (!ct) return;
    const [x, y] = P(ct[0], ct[1]);
    dib.circ(e, x, y, 8, { fill: '#ffffff', stroke: INK, lw: 1 });
    dib.texto(e, x, y + 3.1, String(i + 1), { size: 8.5, bold: true, fill: INK, align: 'center' });
  });
  dib.fin(e);
  dib.rect(e, mapX, mapY, mapW, mapH, { stroke: AXIS, lw: 0.8 });

  // Leyenda de la escala secuencial, con los rangos reales de cada clase
  const ly = mapY + mapH + 12, lw = 26;
  dib.texto(e, mapX, ly - 4, 'Órdenes por celda', { size: 8, fill: MUTED });
  SEQ.forEach((col, i) => {
    dib.rect(e, mapX + i * lw, ly, lw - 2, 9, { fill: col });
    const desde = i === 0 ? 1 : Math.round(qs[i - 1]) + 1;
    dib.texto(e, mapX + i * lw, ly + 18, String(desde), { size: 7.5, fill: MUTED });
  });
  dib.texto(e, mapX + SEQ.length * lw - 2, ly + 18, '+', { size: 7.5, fill: MUTED });
  dib.texto(e, mapX, ly + 32,
    `Escala propia de esta ciudad (cortes por cuantiles) — los tonos NO son comparables entre láminas; para comparar, ver la lámina 5.`,
    { size: 7.5, fill: MUTED });

  // Composición del 100% de la ciudad. Va acá a propósito: es el único sitio del entregable
  // donde se ve, en la misma barra, lo que el mapa muestra y lo que el mapa NO alcanzó a
  // ubicar. Sin ese tercer segmento el mapa se lee como si fuera toda la ciudad.
  const cy = ly + 62, cw = W - M * 2;
  const top5 = c.zonas.slice(0, 5).reduce((a, z) => a + z.ordenes, 0);
  const restoUb = c.ubicadas - top5, noUb = c.total - c.ubicadas;
  dib.texto(e, M, cy, `De dónde salen las ${miles(c.total)} órdenes de ${NOMBRE[cod]}`, { size: 10, bold: true, fill: INK });
  const segs = [
    [top5, CIUDAD_COLOR[cod], `5 primeras ${UNIDAD[cod]}s`],
    [restoUb, '#c9dcf5', `resto de ${UNIDAD[cod]}s con demanda`],
    [noUb, '#e1e0d9', 'sin ubicar en el mapa'],
  ];
  let sx = M;
  for (const [v, col] of segs) { const w = v / c.total * cw; dib.rect(e, sx, cy + 10, Math.max(w - 2, 1), 16, { fill: col }); sx += w; }
  sx = M;
  for (const [v, , etq] of segs) {
    const w = v / c.total * cw;
    dib.texto(e, sx, cy + 42, pct(v / c.total * 100), { size: 11, bold: true, fill: INK });
    parrafo(e, sx, cy + 54, Math.max(w - 8, 74), etq, { size: 7.5, fill: MUTED, lh: 9 });
    sx += w;
  }

  // Ausencia declarada: lo que falta del marco y por qué no debe leerse como "no hay demanda".
  const my = cy + 86;
  dib.rect(e, M, my - 8, 3, 26, { fill: ALERTA });
  parrafo(e, M + 10, my, cw - 10,
    `Este mapa no cubre el área metropolitana: ${METRO[cod]} no tienen una sola orden en el export, porque la columna de ciudad solo trae tres valores. El discovery sí los lista como cobertura elegible o parcial. Es un vacío del archivo — no significa que allí no haya demanda.`,
    { size: 8, fill: INK2, lh: 10 });

  // Panel: ranking de zonas. Los números 1–8 amarran cada fila con su insignia en el mapa.
  dib.texto(e, panX, mapY - 2, `Concentración por ${UNIDAD[cod]}`, { size: 11, bold: true, fill: INK });
  const filas = c.zonas.slice(0, 10);
  const maxOrd = filas[0].ordenes;
  const barW = panW - 20;
  let y = mapY + 24;
  filas.forEach((z, i) => {
    const p = (z.ordenes / c.ubicadas) * 100;
    dib.circ(e, panX + 6, y - 3, 6.5, { fill: i < 8 ? INK : '#ffffff', stroke: INK, lw: 0.8 });
    dib.texto(e, panX + 6, y, String(i + 1), { size: 7.5, bold: true, fill: i < 8 ? '#ffffff' : INK, align: 'center' });
    dib.texto(e, panX + 17, y, z.nombre.replace(/^Comuna \d+ - /, ''), { size: 8.5, fill: INK });
    dib.texto(e, panX + panW, y, pct(p), { size: 9, bold: true, fill: INK, align: 'right' });
    const bw = Math.max((z.ordenes / maxOrd) * barW, 1.5);
    dib.rect(e, panX, y + 5, bw, 5, { fill: CIUDAD_COLOR[cod] });
    dib.texto(e, panX + panW, y + 10, miles(z.ordenes), { size: 7.5, fill: MUTED, align: 'right' });
    y += 29;
  });

  const acum5 = filas.slice(0, 5).reduce((a, z) => a + z.ordenes, 0) / c.ubicadas * 100;
  y += 4;
  dib.linea(e, panX, y, panX + panW, y, { stroke: GRID, lw: 1 }); y += 18;
  dib.texto(e, panX, y, `Las 5 primeras concentran`, { size: 9.5, fill: INK2 }); y += 18;
  dib.texto(e, panX, y, pct(acum5), { size: 20, bold: true, fill: CIUDAD_COLOR[cod] });
  dib.texto(e, panX, y + 16, 'del volumen ubicado de la ciudad', { size: 8, fill: MUTED });
  y += 44;
  parrafo(e, panX, y, panW,
    `Las 8 primeras llevan insignia en el mapa. Va en el centro de la zona, no en el punto de mayor densidad.`,
    { size: 8, fill: MUTED, lh: 10.5 });

  pieDeLamina(e, W, H, cod);
  return e;
}

// Rótulo de límites — va impreso en TODAS las láminas. Es la razón principal de generar el
// PDF en vez de mandar una captura: la advertencia no puede quedarse en la conversación.
function pieDeLamina(e, W, H, cod) {
  const M = 38, y = FOOT_LINE + 12;
  dib.linea(e, M, FOOT_LINE, W - M, FOOT_LINE, { stroke: GRID, lw: 1 });
  dib.rect(e, M, y - 6, 3, 30, { fill: ALERTA });
  const t1 = cod ? 'Mapa de DEMANDA, no de factibilidad.' : 'Insumo de DEMANDA, no de factibilidad.';
  dib.texto(e, M + 10, y + 2, t1, { size: 8.5, bold: true, fill: ALERTA });
  const detalle = cod
    ? `Dice dónde están los pedidos, no dónde se puede cumplir el mismo día. La ubicación es el CRUCE de las dos vías de la dirección, no el domicilio: errores >3 km del ${pct(errorGrueso(cod))} en ${NOMBRE[cod]}. Sirve para forma y concentración por zona; no para una dirección concreta ni para decidir entre una zona y su vecina (diferencias menores a ~1,5 pp no se sostienen).`
    : 'Dice dónde están los pedidos, no dónde se puede cumplir el mismo día. Falta bodega de origen, fecha/hora de creación, transportadora y estado final, cruzables por orden.';
  parrafo(e, M + 10, y + 14, W - M * 2 - 10, detalle, { size: 8, fill: INK2, lh: 10 });
}

// ── Lámina 1 · portada ────────────────────────────────────────────────────────────────────
function laminaPortada(W, H) {
  const e = Escena(), M = 38;
  dib.rect(e, 0, 0, W, H, { fill: SURFACE });
  dib.rect(e, 0, 0, W, 6, { fill: CIUDAD_COLOR.BOGOTA });

  dib.texto(e, M, 92, 'Same Day', { size: 34, bold: true, fill: INK });
  dib.texto(e, M, 120, 'Dónde está la demanda en Bogotá, Medellín y Cali', { size: 15, fill: INK });
  dib.texto(e, M, 140, 'Insumo para la conversación de cobertura y tarifa', { size: 10.5, fill: MUTED });

  const tot = CIUDADES.reduce((a, c) => a + D.ciudades[c].total, 0);
  const ubi = CIUDADES.reduce((a, c) => a + D.ciudades[c].ubicadas, 0);

  // Tres cifras de encabezado + reparto por ciudad
  const tiles = [
    [miles(tot), 'órdenes en el export'],
    [miles(ubi), `ubicadas en el mapa (${pct(ubi / tot * 100)})`],
    [String(CIUDADES.reduce((a, c) => a + D.ciudades[c].zonas.length, 0)), 'zonas operativas con demanda'],
  ];
  let x = M;
  for (const [v, l] of tiles) {
    dib.texto(e, x, 194, v, { size: 24, bold: true, fill: INK });
    dib.texto(e, x, 212, l, { size: 8.5, fill: MUTED });
    x += 180;
  }
  dib.linea(e, M, 234, W - M, 234, { stroke: GRID, lw: 1 });

  // Reparto por ciudad — barra apilada, con etiqueta directa en cada segmento
  dib.texto(e, M, 260, 'Reparto por ciudad', { size: 11, bold: true, fill: INK });
  const bw = W - M * 2; let bx = M;
  for (const c of CIUDADES) {
    const w = D.ciudades[c].total / tot * bw;
    dib.rect(e, bx, 272, Math.max(w - 2, 1), 26, { fill: CIUDAD_COLOR[c] });
    dib.texto(e, bx + 7, 289, `${NOMBRE[c]} ${pct(D.ciudades[c].total / tot * 100)}`, { size: 9.5, bold: true, fill: '#ffffff' });
    dib.texto(e, bx, 312, `${miles(D.ciudades[c].total)} órd.`, { size: 8, fill: MUTED });
    dib.texto(e, bx, 323, `${pct(D.ciudades[c].cobertura)} ubicadas`, { size: 8, fill: MUTED });
    bx += w;
  }

  // Qué es y qué no es
  let y = 364;
  dib.texto(e, M, y, 'Qué es este documento', { size: 11, bold: true, fill: INK }); y += 18;
  y = parrafo(e, M, y, (W - M * 2) / 2 - 20,
    'El agregado de las órdenes de Bogotá, Medellín y Cali llevado al mapa: dónde se concentra el volumen por zona operativa (localidad o comuna), que es la unidad con la que trabajan bodega y transportadora. Las direcciones se ubicaron resolviendo el cruce de las dos vías contra la geometría de OpenStreetMap, sin geocodificador de pago.',
    { size: 9, fill: INK2, lh: 13 });

  let y2 = 364, x2 = M + (W - M * 2) / 2 + 20, w2 = (W - M * 2) / 2 - 20;
  dib.texto(e, x2, y2, 'Qué NO permite decidir todavía', { size: 11, bold: true, fill: ALERTA }); y2 += 18;
  y2 = parrafo(e, x2, y2, w2,
    'El export trae cuatro columnas: orden, dirección, ciudad y departamento. Con eso se sabe dónde está la demanda, no dónde se puede cumplir el mismo día. Para pasar de demanda a factibilidad faltan cuatro datos cruzables por orden:',
    { size: 9, fill: INK2, lh: 13 }); y2 += 4;
  for (const f of [
    'bodega de origen y su coordenada — sin ella no hay distancia origen→destino',
    'fecha y hora de creación — es lo que permite evaluar la hora de corte',
    'transportadora — separa lo servible por Veloces de lo que no',
    'estado final — muestra si las zonas densas son también las que fallan',
    'y falta saber si el export vino filtrado: el área metropolitana no aparece',
  ]) {
    dib.circ(e, x2 + 3, y2 - 3, 2, { fill: ALERTA });
    y2 = parrafo(e, x2 + 12, y2, w2 - 12, f, { size: 8.5, fill: INK2, lh: 11 }) + 3;
  }

  // Precisión por ciudad
  let y3 = Math.max(y, y2) + 26;
  dib.linea(e, M, y3 - 14, W - M, y3 - 14, { stroke: GRID, lw: 1 });
  dib.texto(e, M, y3, 'Precisión medida por ciudad', { size: 11, bold: true, fill: INK });
  const yy = parrafo(e, M, y3 + 16, W - M * 2,
    'Se midió contra el barrio que menciona la propia dirección, apartando el 20% de los nombres para que la prueba no fuera circular. Porcentaje de ubicaciones con error grueso mayor a 3 km:',
    { size: 8.5, fill: INK2, lh: 11 }) + 22;
  let xx = M;
  for (const c of CIUDADES) {
    dib.texto(e, xx, yy, pct(errorGrueso(c)), { size: 18, bold: true, fill: errorGrueso(c) > 15 ? ALERTA : INK });
    dib.texto(e, xx, yy + 14, NOMBRE[c], { size: 9, fill: INK2 });
    xx += 120;
  }
  dib.texto(e, M, yy + 40,
    'Bogotá es peor porque tiene nomenclaturas paralelas: una misma pareja calle × carrera existe en varios sitios.',
    { size: 8, fill: MUTED });

  pieDeLamina(e, W, H, null);
  return e;
}

// ── Lámina 5 · concentración comparada ────────────────────────────────────────────────────
function laminaComparativa(W, H) {
  const e = Escena(), M = 38;
  dib.rect(e, 0, 0, W, H, { fill: SURFACE });
  dib.texto(e, M, 56, 'Las tres ciudades no son', { size: 21, bold: true, fill: INK });
  dib.texto(e, M, 80, 'el mismo problema operativo', { size: 21, bold: true, fill: INK });
  dib.texto(e, M, 102, 'Cuánto del volumen ubicado se acumula al ir sumando zonas, de la más densa a la menos densa', { size: 9.5, fill: INK2 });
  dib.linea(e, M, 116, W - M, 116, { stroke: GRID, lw: 1 });

  // El gráfico deja libre el margen derecho que necesitan las etiquetas directas del final de
  // cada línea (el color no puede ser el único portador de identidad).
  const gx = M + 34, gy = 152, gw = W - M - 110 - gx, gh = 330;
  const N = 10;
  for (let i = 0; i <= 5; i++) {
    const y = gy + gh - (i / 5) * gh;
    dib.linea(e, gx, y, gx + gw, y, { stroke: GRID, lw: 0.5 });
    dib.texto(e, gx - 8, y + 3, String(i * 20) + '%', { size: 8, fill: MUTED, align: 'right' });
  }
  dib.linea(e, gx, gy + gh, gx + gw, gy + gh, { stroke: AXIS, lw: 1 });
  for (let i = 1; i <= N; i++) {
    const x = gx + ((i - 1) / (N - 1)) * gw;
    dib.texto(e, x, gy + gh + 15, String(i), { size: 8, fill: MUTED, align: 'center' });
  }
  dib.texto(e, gx + gw / 2, gy + gh + 34, 'número de zonas sumadas (de mayor a menor demanda)', { size: 8.5, fill: MUTED, align: 'center' });

  const series = CIUDADES.map((c) => {
    const z = D.ciudades[c].zonas, ub = D.ciudades[c].ubicadas;
    const pts = []; let acc = 0;
    for (let i = 0; i < N && i < z.length; i++) { acc += z[i].ordenes; pts.push((acc / ub) * 100); }
    return { c, pts };
  });
  for (const s of series) {
    const P = s.pts.map((v, i) => [gx + (i / (N - 1)) * gw, gy + gh - (v / 100) * gh]);
    dib.poly(e, P, { stroke: CIUDAD_COLOR[s.c], lw: 2, close: false });
    for (const p of P) { dib.circ(e, p[0], p[1], 3.4, { fill: '#ffffff' }); dib.circ(e, p[0], p[1], 3.4, { stroke: CIUDAD_COLOR[s.c], lw: 1.6 }); }
    // Etiqueta directa: el aguamarina queda bajo 3:1 contra el papel, así que el color no
    // puede ser el único portador de identidad.
    const ult = P[P.length - 1];
    dib.texto(e, ult[0] + 9, ult[1] + 3.5, `${NOMBRE[s.c]} ${pct(s.pts[s.pts.length - 1])}`, { size: 9.5, bold: true, fill: INK });
  }

  // Lectura debajo, en dos columnas
  const cw = (W - M * 2) / 2 - 16;
  let y = gy + gh + 66;
  dib.linea(e, M, y - 22, W - M, y - 22, { stroke: GRID, lw: 1 });
  dib.texto(e, M, y, 'Cómo se lee', { size: 11, bold: true, fill: INK });
  dib.texto(e, M + cw + 32, y, 'Qué implica para la fase 1', { size: 11, bold: true, fill: INK });
  y += 18;
  const b5 = CIUDADES.map((c) => ({ c, v: D.ciudades[c].zonas.slice(0, 5).reduce((a, z) => a + z.ordenes, 0) / D.ciudades[c].ubicadas * 100 }));
  const yA = parrafo(e, M, y, cw,
    `En Bogotá 5 localidades concentran ${pct(b5[0].v)} del volumen ubicado: la curva sube de golpe y se aplana. En Medellín (${pct(b5[1].v)}) y Cali (${pct(b5[2].v)}) sube mucho más despacio — el volumen está repartido.`,
    { size: 9, fill: INK2, lh: 12.5 });
  const yB = parrafo(e, M + cw + 32, y, cw,
    'En Bogotá una fase 1 acotada a pocas zonas ya toca la mayor parte de la demanda. En Medellín y Cali la misma estrategia deja fuera a la mayoría: o se abre más cobertura, o el same-day rinde menos por vehículo. No conviene tratarlas igual.',
    { size: 9, fill: INK2, lh: 12.5 });
  const y2 = Math.max(yA, yB) + 12;
  dib.rect(e, M, y2 - 9, 3, 26, { fill: AXIS });
  parrafo(e, M + 10, y2, W - M * 2 - 10,
    'Esta comparación sí es válida entre ciudades: son porcentajes sobre el volumen ubicado de cada una. Lo que NO es comparable son los tonos de las láminas 2 a 4 — cada una lleva su propia escala.',
    { size: 8.5, fill: MUTED, lh: 11 });

  pieDeLamina(e, W, H, null);
  return e;
}

// ── Lámina 6 · corte horario ──────────────────────────────────────────────────────────────
// Reproduce exactamente `acumHasta()` del mapa: el mismo perfil horario supuesto, para que la
// lámina y el simulador no puedan discrepar.
const PERFIL = [1, .5, .3, .3, .4, .8, 1.5, 2.5, 4, 6, 7, 7.5, 7, 6.5, 6, 5.5, 5, 5, 5.5, 6.5, 7.5, 7, 5, 2.5];
const acumHasta = (h) => {
  let t = 0, a = 0;
  for (let i = 0; i < 24; i++) { t += PERFIL[i]; if (i < h) a += PERFIL[i]; }
  return a / t;
};

function laminaCorte(W, H) {
  const e = Escena(), M = 38;
  dib.rect(e, 0, 0, W, H, { fill: SURFACE });
  dib.texto(e, M, 56, 'El cuello de botella es la hora', { size: 21, bold: true, fill: INK });
  dib.texto(e, M, 80, 'de corte, no la distancia', { size: 21, bold: true, fill: INK });
  dib.texto(e, M, 102, 'Porcentaje de la demanda del día que alcanza a salir el mismo día, según a qué hora se cierre el corte', { size: 9.5, fill: INK2 });
  dib.linea(e, M, 116, W - M, 116, { stroke: GRID, lw: 1 });

  const gx = M + 34, gy = 152, gw = W - M - gx, gh = 320;
  for (let i = 0; i <= 4; i++) {
    const y = gy + gh - (i / 4) * gh;
    dib.linea(e, gx, y, gx + gw, y, { stroke: GRID, lw: 0.5 });
    dib.texto(e, gx - 8, y + 3, String(i * 25) + '%', { size: 8, fill: MUTED, align: 'right' });
  }
  const horas = [];
  for (let h = 6; h <= 18; h++) horas.push(h);
  const bw = gw / horas.length;
  const DESTACA = [11, 15, 18];
  horas.forEach((h, i) => {
    const v = acumHasta(h) * 100;
    const bh = (v / 100) * gh, x = gx + i * bw + 4, y = gy + gh - bh;
    const on = DESTACA.includes(h);
    dib.rect(e, x, y, bw - 8, bh, { fill: on ? CIUDAD_COLOR.BOGOTA : '#c9dcf5' });
    if (on) dib.texto(e, x + (bw - 8) / 2, y - 7, pct(v, 0), { size: 10, bold: true, fill: INK, align: 'center' });
    dib.texto(e, x + (bw - 8) / 2, gy + gh + 15, `${h}:00`, { size: 8, fill: on ? INK : MUTED, align: 'center' });
  });
  dib.linea(e, gx, gy + gh, gx + gw, gy + gh, { stroke: AXIS, lw: 1 });
  dib.texto(e, gx + gw / 2, gy + gh + 34, 'hora de corte', { size: 8.5, fill: MUTED, align: 'center' });

  const cw = (W - M * 2) / 2 - 16;
  let y = gy + gh + 66;
  dib.linea(e, M, y - 22, W - M, y - 22, { stroke: GRID, lw: 1 });
  dib.texto(e, M, y, 'Por qué importa', { size: 11, bold: true, fill: INK });
  dib.texto(e, M + cw + 32, y, 'La forma es lo robusto, no el número', { size: 11, bold: true, fill: ALERTA });
  y += 18;
  const yA = parrafo(e, M, y, cw,
    `Con el corte actual de las 11:00 solo ${pct(acumHasta(11) * 100, 0)} de la demanda del día alcanza a salir. Moverlo a las 15:00 lo lleva a ${pct(acumHasta(15) * 100, 0)} y a las 18:00 a ${pct(acumHasta(18) * 100, 0)}. En paralelo, el simulador de accesibilidad (Dijkstra sobre la red vial real de OpenStreetMap) muestra que las 37 zonas de Bogotá quedan alcanzables desde una bodega céntrica en todos los escenarios probados: ir y volver nunca agota la jornada.`,
    { size: 9, fill: INK2, lh: 12.5 });
  const yB = parrafo(e, M + cw + 32, y, cw,
    'Esta curva está SIMULADA, no medida: el export no trae fecha ni hora de creación, así que el perfil horario de pedidos es un supuesto de forma típica de e-commerce. Lo afirmable es la dirección y la magnitud relativa —cuánto se gana moviendo el corte una hora—, no el valor absoluto. Cerrarlo exige los timestamps de creación.',
    { size: 9, fill: INK2, lh: 12.5 });
  const y2 = Math.max(yA, yB) + 12;
  dib.rect(e, M, y2 - 9, 3, 26, { fill: AXIS });
  parrafo(e, M + 10, y2, W - M * 2 - 10,
    'Consecuencia: mover la hora de corte es la palanca principal del same-day, por delante de ampliar cobertura geográfica.',
    { size: 8.5, fill: MUTED, lh: 11 });

  pieDeLamina(e, W, H, null);
  return e;
}

// ── Ensamblado ────────────────────────────────────────────────────────────────────────────
function main() {
  const W = 595.28, H = 841.89;   // A4 vertical
  fs.mkdirSync(OUT, { recursive: true });

  const laminas = [
    ['01-portada', laminaPortada(W, H)],
    ['02-bogota', laminaCiudad('BOGOTA', W, H)],
    ['03-medellin', laminaCiudad('MEDELLIN', W, H)],
    ['04-cali', laminaCiudad('CALI', W, H)],
    ['05-concentracion-comparada', laminaComparativa(W, H)],
    ['06-corte-horario', laminaCorte(W, H)],
  ];

  const pdf = path.join(OUT, 'same-day-mapas.pdf');
  escribirPdf(laminas.map((l) => l[1]), W, H, pdf);
  for (const [nombre, e] of laminas) {
    fs.writeFileSync(path.join(OUT, nombre + '.svg'), escenaASvg(e, W, H), 'utf8');
  }

  const kb = (f) => (fs.statSync(f).size / 1024).toFixed(0) + ' KB';
  console.log(`PDF   ${path.relative(process.cwd(), pdf)}  (${laminas.length} láminas, ${kb(pdf)})`);
  for (const [nombre] of laminas) {
    const f = path.join(OUT, nombre + '.svg');
    console.log(`SVG   ${path.relative(process.cwd(), f)}  (${kb(f)})`);
  }
}

if (require.main === module) main();

module.exports = { construir: (W, H) => [
  ['01-portada', laminaPortada(W, H)],
  ['02-bogota', laminaCiudad('BOGOTA', W, H)],
  ['03-medellin', laminaCiudad('MEDELLIN', W, H)],
  ['04-cali', laminaCiudad('CALI', W, H)],
  ['05-concentracion-comparada', laminaComparativa(W, H)],
  ['06-corte-horario', laminaCorte(W, H)],
], anchoTexto, extension, FOOT_LINE, CONTENT_MAX, MAPA_ALTO, MAPA_ANCHO };
