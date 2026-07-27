// Ubica las 427.294 órdenes y agrega la demanda en rejilla -> datos-sameday.json
// (lo que lee el mapa). Ciudad por ciudad, para no tener las tres geometrías en memoria.
//
//   node --max-old-space-size=6144 geo-sameday.js
//
// El JSON de salida NO lleva las órdenes una por una: lleva la rejilla agregada. Son
// ~7.000 celdas contra 427.294 puntos, y el navegador no tiene por qué recibir el detalle.
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { CIUDADES, crearIndice } = require('./osm.js');
const { parseDir } = require('./direccion.js');
const zonasLib = require('./zonas.js');
const barriosLib = require('./barrios.js');

const ENTRADA = path.join(__dirname, 'ordenes.ndjson');
const SALIDA = path.join(__dirname, '..', 'datos-sameday.json');
const CELDA_M = 250;

(async () => {
  const salida = { meta: {}, ciudades: {} };
  let leidas = 0;

  // Primero se agrupan las direcciones por ciudad; así el índice pesado de una ciudad
  // se construye y se descarta antes de pasar a la siguiente.
  console.log('leyendo', path.basename(ENTRADA), '…');
  const porCiudad = { BOGOTA: [], MEDELLIN: [], CALI: [] };
  const rl = readline.createInterface({ input: fs.createReadStream(ENTRADA), crlfDelay: Infinity });
  for await (const linea of rl) {
    if (!linea) continue;
    const o = JSON.parse(linea);
    leidas++;
    if (porCiudad[o.ciudad]) porCiudad[o.ciudad].push(o.direccion);
  }
  console.log('  ', leidas.toLocaleString('es-CO'), 'órdenes\n');

  for (const [ciudad, dirs] of Object.entries(porCiudad)) {
    const t0 = Date.now();
    const ix = crearIndice(ciudad);
    const { bbox, nucleo, dane } = CIUDADES[ciudad];
    const dLat = CELDA_M / 110574;
    const dLng = CELDA_M / (111320 * Math.cos((bbox[0] + bbox[2]) / 2 * Math.PI / 180));

    const celdas = new Map();          // "i:j" -> [total, cruce]
    const st = { cruce: 0, cercania: 0, via: 0, sin_parseo: 0, sin_via: 0, fuera_bbox: 0 };

    // Casi la mitad de las direcciones traen escrito su barrio. Ese texto desempata entre
    // vías homónimas — ver barrios.js. Sin él, "Calle 80 # 100-20" puede resolverse en la
    // nomenclatura de Bosa en vez de la de Engativá.
    const B = barriosLib.cargar(ciudad);
    if (B) st.con_pista_barrio = 0;

    for (const d of dirs) {
      const p = parseDir(d);
      if (!p) { st.sin_parseo++; continue; }
      const pista = B ? B.pista(d) : null;
      if (pista) st.con_pista_barrio++;
      const r = ix.ubicar(p, pista);
      if (!r) { st.sin_via++; continue; }
      if (!ix.dentro(r)) { st.fuera_bbox++; continue; }
      st[r.prec]++;
      // Sólo 'cruce' y 'cercania' ubican de verdad. 'via' conoce un eje y no el otro:
      // se cuenta aparte y NO entra al mapa de calor, para no dibujar densidad falsa.
      if (r.prec === 'via') continue;
      const k = Math.round(r.lat / dLat) + ':' + Math.round(r.lng / dLng);
      const c = celdas.get(k) || [0, 0];
      c[0]++; if (r.prec === 'cruce') c[1]++;
      celdas.set(k, c);
    }

    const puntos = [...celdas].map(([k, v]) => {
      const [i, j] = k.split(':').map(Number);
      return [+(i * dLat).toFixed(5), +(j * dLng).toFixed(5), v[0], v[1]];
    }).sort((a, b) => b[2] - a[2]);

    // Zona operativa por celda: es la unidad con la que decide la operación.
    const Z = zonasLib.cargar(ciudad);
    const porZona = new Map();
    let sinZona = 0;
    if (Z) {
      for (const p of puntos) {
        const z = Z.ubicar(p[0], p[1]);
        if (!z) { sinZona += p[2]; continue; }
        const a = porZona.get(z) || [0, 0];
        a[0] += p[2]; a[1]++;
        porZona.set(z, a);
      }
    }

    const ubicadas = st.cruce + st.cercania;
    salida.ciudades[ciudad] = {
      dane, bbox, nucleo, celda_m: CELDA_M,
      total: dirs.length, ubicadas, precision: st,
      cobertura: +(ubicadas / dirs.length * 100).toFixed(1),
      celdas: puntos,
      zonas: [...porZona].map(([n, v]) => ({ nombre: n, ordenes: v[0], celdas: v[1] }))
        .sort((a, b) => b.ordenes - a.ordenes),
      sin_zona: sinZona,
      contornos: Z ? Z.contornos() : [],
    };
    if (Z) {
      const top = salida.ciudades[ciudad].zonas.slice(0, 5);
      console.log(`          zonas: ${porZona.size} · sin zona ${sinZona.toLocaleString('es-CO')} · top: ` +
        top.map(z => `${z.nombre} ${(z.ordenes / ubicadas * 100).toFixed(1)}%`).join(' · '));
    }
    console.log(`${ciudad.padEnd(9)} ${dirs.length.toLocaleString('es-CO').padStart(8)} órdenes · ubicadas ${ubicadas.toLocaleString('es-CO').padStart(8)} (${(ubicadas / dirs.length * 100).toFixed(1)}%) · ${puntos.length.toLocaleString('es-CO')} celdas · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    console.log(`          cruce ${st.cruce.toLocaleString('es-CO')} · cercanía ${st.cercania.toLocaleString('es-CO')} · sólo vía ${st.via.toLocaleString('es-CO')} · sin parseo ${st.sin_parseo.toLocaleString('es-CO')} · sin vía en OSM ${st.sin_via.toLocaleString('es-CO')} · fuera de bbox ${st.fuera_bbox.toLocaleString('es-CO')}`);
  }

  const tot = Object.values(salida.ciudades).reduce((s, c) => s + c.total, 0);
  const ub = Object.values(salida.ciudades).reduce((s, c) => s + c.ubicadas, 0);
  salida.meta = {
    generado: new Date().toISOString().slice(0, 10),
    fuente: 'Data samday.xlsx (export Dropi: orden_id, direccion, ciudad_destino, dpto_destino)',
    geocodificacion: 'OpenStreetMap vía Overpass — cruce de nomenclatura, sin geocodificador externo',
    ordenes: tot, ubicadas: ub, cobertura: +(ub / tot * 100).toFixed(1),
    celda_m: CELDA_M,
    advertencia: 'La ubicación es el CRUCE de las dos vías de la dirección, no el domicilio. '
      + 'Resolución útil: cuadra. No usar como geolocalización de clientes.',
  };
  fs.writeFileSync(SALIDA, JSON.stringify(salida));
  console.log(`\ntotal ${tot.toLocaleString('es-CO')} órdenes · ubicadas ${ub.toLocaleString('es-CO')} (${(ub / tot * 100).toFixed(1)}%)`);
  console.log('->', SALIDA, (fs.statSync(SALIDA).size / 1024).toFixed(0), 'KB');
})();
