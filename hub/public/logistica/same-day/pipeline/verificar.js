// Verificación de la ubicación contra el BARRIO QUE LA PROPIA DIRECCIÓN MENCIONA.
//
//   node --max-old-space-size=6144 verificar.js
//
// Es la única prueba de este pipeline hecha con datos reales y a gran escala. Las otras dos
// tienen problemas conocidos: el banco de intersecciones depende de coordenadas recordadas,
// y Nominatim no resuelve estas direcciones a nivel de domicilio (ver README).
//
// Idea: casi la mitad de las direcciones traen escrito su barrio ("... Barrio Santa Rita
// Suba ..."). Si el punto calculado cae lejos del barrio que el propio cliente escribió,
// está mal. No hace falta ninguna fuente externa de verdad: la dirección se verifica con
// lo que ella misma dice.
//
// ⚠ SIN CIRCULARIDAD: el barrio también se usa como pista para ubicar (ver barrios.js), así
// que medir con el mismo barrio sería hacer trampa. Por eso el 20% de los nombres queda
// APARTADO — nunca se usa para ubicar — y la cifra que vale es la de ese grupo. La del
// grupo usado como pista se imprime sólo como contraste, y no mide precisión.
//
// CÓMO LEER EL RESULTADO — la distancia es una COTA SUPERIOR del error, no el error: el
// punto del barrio en OSM es su centro y un barrio mide cientos de metros, así que una
// dirección perfectamente ubicada en el borde de su barrio ya arroja 400–600 m. Lo que
// importa es la cola larga (>3 km), que sí son errores de verdad.
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { crearIndice } = require('./osm.js');
const { norm, parseDir } = require('./direccion.js');
const barriosLib = require('./barrios.js');

const SIN_PISTA = process.argv.includes('--sin-pista');   // para medir el antes/después

const hav = (a, b, c, d) => { const R = 6371000, t = x => x * Math.PI / 180;
  const dp = t(c - a), dl = t(d - b);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(t(a)) * Math.cos(t(c)) * Math.sin(dl / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h))); };

const pct = (a, p) => a.length ? a[Math.min(a.length - 1, Math.floor(a.length * p))] : null;
const resumen = (a) => { a.sort((x, y) => x - y);
  return { n: a.length, p50: pct(a, .5), p75: pct(a, .75), p90: pct(a, .9),
    bajo1k: +(a.filter(x => x <= 1000).length / a.length * 100).toFixed(1),
    sobre3k: +(a.filter(x => x > 3000).length / a.length * 100).toFixed(1) }; };
const linea = (t, r) => r && r.n
  ? `  ${t.padEnd(28)} n=${String(r.n).padStart(6)}  p50 ${String(r.p50).padStart(5)} m  p75 ${String(r.p75).padStart(5)} m  p90 ${String(r.p90).padStart(6)} m  ≤1km ${String(r.bajo1k).padStart(5)}%  >3km ${String(r.sobre3k).padStart(5)}%`
  : `  ${t.padEnd(28)} (sin casos)`;

(async () => {
  const dirs = { BOGOTA: [], MEDELLIN: [], CALI: [] };
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(__dirname, 'ordenes.ndjson')), crlfDelay: Infinity });
  for await (const l of rl) { if (!l) continue; const o = JSON.parse(l); if (dirs[o.ciudad]) dirs[o.ciudad].push(o.direccion); }

  console.log(SIN_PISTA ? '### SIN pista de barrio (línea base)\n' : '### CON pista de barrio\n');
  const informe = {};
  for (const ciudad of Object.keys(dirs)) {
    const B = barriosLib.cargar(ciudad);
    if (!B) { console.log(`${ciudad}: falta barrios-${ciudad.toLowerCase()}.json`); continue; }
    const ix = crearIndice(ciudad);

    const apartado = [], usado = [], porPrec = { cruce: [], cercania: [] }, conPrefijo = [], sinPrefijo = [];
    let ubicadas = 0, conBarrio = 0;

    for (const d of dirs[ciudad]) {
      const p = parseDir(d);
      if (!p) continue;
      const b = B.buscar(d);
      const pista = SIN_PISTA ? null : (b && !b.apartado && !b.disperso ? b.centro : null);
      const r = ix.ubicar(p, pista);
      if (!r || r.prec === 'via' || !ix.dentro(r)) continue;
      ubicadas++;
      if (!b) continue;
      conBarrio++;

      const dist = Math.min(...b.puntos.map(q => hav(q[0], q[1], r.lat, r.lng)));
      (b.apartado ? apartado : usado).push(dist);
      if (b.apartado) {                      // los cortes finos, sólo sobre el grupo limpio
        porPrec[r.prec].push(dist);
        (norm(d).search(/\b(CALLE|CARRERA|AVENIDA|DIAGONAL|TRANSVERSAL)\b/) === 0 ? sinPrefijo : conPrefijo).push(dist);
      }
    }

    console.log(`=== ${ciudad} ===  ubicadas ${ubicadas.toLocaleString('es-CO')} · con barrio reconocido ${conBarrio.toLocaleString('es-CO')} (${(conBarrio / ubicadas * 100).toFixed(1)}%) · barrios ${B.total}, apartados ${B.apartados}`);
    console.log(linea('APARTADOS (mide precisión)', resumen(apartado)));
    console.log(linea('  · por cruce', resumen(porPrec.cruce)));
    console.log(linea('  · por cercanía', resumen(porPrec.cercania)));
    console.log(linea('  · empieza por la vía', resumen(sinPrefijo)));
    console.log(linea('  · trae el barrio antes', resumen(conPrefijo)));
    console.log(linea(SIN_PISTA ? 'resto (mismo trato)' : 'usados como pista (circular)', resumen(usado)));
    console.log('');
    informe[ciudad] = { ubicadas, con_barrio: conBarrio, apartados: resumen(apartado),
      por_cruce: resumen(porPrec.cruce), por_cercania: resumen(porPrec.cercania),
      empieza_por_via: resumen(sinPrefijo), barrio_antes: resumen(conPrefijo),
      usados_como_pista_circular: resumen(usado) };
  }

  const f = path.join(__dirname, SIN_PISTA ? 'verificacion-barrios-base.json' : 'verificacion-barrios.json');

  // GUARDA DE REGRESIÓN. El riesgo real de este pipeline no es que falle: es que empeore sin
  // que nadie lo note y el mapa siga mostrándose igual de seguro. Se compara contra la
  // corrida anterior (versionada) y se sale con código ≠ 0 si la precisión retrocede.
  const TOLERANCIA_PP = 1;
  let regresion = [];
  if (fs.existsSync(f)) {
    const previo = JSON.parse(fs.readFileSync(f, 'utf8')).informe || {};
    for (const [c, v] of Object.entries(informe)) {
      const antes = previo[c] && previo[c].apartados;
      if (!antes || !v.apartados) continue;
      const d = v.apartados.sobre3k - antes.sobre3k;
      const linea = `${c}: >3km ${antes.sobre3k}% → ${v.apartados.sobre3k}% (${d >= 0 ? '+' : ''}${d.toFixed(1)} pp)`;
      if (d > TOLERANCIA_PP) regresion.push(linea);
      else console.log((d < 0 ? '  ✓ mejora  ' : '  = estable ') + linea);
    }
  }

  fs.writeFileSync(f, JSON.stringify({ generado: new Date().toISOString().slice(0, 10), con_pista: !SIN_PISTA,
    metodo: 'distancia al barrio nombrado en la propia dirección (OSM place=suburb/neighbourhood)',
    nota: 'Sólo el grupo APARTADO mide precisión: esos nombres nunca se usan para ubicar. La distancia es cota superior del error.',
    informe }, null, 1));
  console.log('->', f);

  if (regresion.length) {
    console.error('\n✗ LA PRECISIÓN EMPEORÓ más de ' + TOLERANCIA_PP + ' pp:');
    regresion.forEach(l => console.error('   ' + l));
    console.error('\nEl informe ya se guardó. Revisar el cambio antes de publicar el mapa:');
    console.error('  git diff -- ' + path.basename(f));
    process.exitCode = 1;
  }
})();
