// Carga inicial de Supabase: pasa lo que hoy vive en archivos a las tablas de
// la migración 037. Sube tres cosas:
//
//   rec_bodega    las 2.055 bodegas del export, con las coordenadas ya
//                 geocodificadas (1.407 rescatadas del JSON anterior). Este es
//                 el activo que se perdió una vez y no puede volver a pasar.
//   rec_carga_diaria   la foto de hoy al grano bodega × transportadora — el primer
//                 punto de la serie. Desde mañana ya hay contra qué comparar.
//   rec_importacion    el registro de esta carga.
//
// Es idempotente: upsert por clave. Correrlo dos veces no duplica nada.
//
//   cd hub && node --env-file=.env.local public/logistica/recolecciones/pipeline/seed-supabase.js
//   ... --dry   para ver qué haría sin escribir
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const DRY = process.argv.includes('--dry');
const DIR = __dirname;
const DATOS = path.join(DIR, '..', 'datos-recolecciones.json');
const CACHE = path.join(DIR, 'geocache-coords.json');
const USUARIO = process.env.SEED_USUARIO || 'seed-inicial';

const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
if (!DRY && (!url || !key)) {
  console.error('Faltan SUPABASE_URL / SUPABASE_SERVICE_KEY.\n' +
    'Correr desde hub/ con: node --env-file=.env.local <script>');
  process.exit(1);
}
const db = DRY ? null : createClient(url, key, { auth: { persistSession: false } });

// El JSON del mapa usa etiquetas cortas; la tabla usa el vocabulario completo
// del roadmap. Un centroide se declara centroide, nunca se disfraza de ubicación.
const PRECISION = {
  geo_alta:  'predio',
  geo:       'via',
  geo_baja:  'barrio',
  municipio: 'centroide_municipio',
  depto:     'centroide_depto',
};

const { meta, puntos } = JSON.parse(fs.readFileSync(DATOS, 'utf8'));
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const fecha = meta.generado;

const bodegas = puntos.map(p => {
  const c = cache[String(p.id)];
  const geocodificada = p.geo && p.geo.startsWith('geo');
  return {
    warehouse_id: String(p.id),
    nombre: p.b || null,
    direccion: p.a || null,
    municipio: p.m || null,
    dpto: p.dp || null,
    cod_dane: p.dane || null,
    lat: p.lat, lng: p.lng,
    nivel_precision: PRECISION[p.geo] || 'sin_ubicar',
    fuente: geocodificada ? (c && c.fuente) || 'locationiq' : 'centroide',
    // Solo tiene sentido para las geocodificadas: es la dirección con la que se
    // resolvió la coord. Si en un export futuro cambia, la coord se invalida.
    direccion_geocodificada: geocodificada ? (c && c.dir) || p.a : null,
    geocoded_at: geocodificada ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
});

// La carga diaria vuelve a abrir el desglose por transportadora que el JSON tenía
// colapsado en `tr` — la tabla guarda el grano original del export.
const cargaDiaria = [];
for (const p of puntos) {
  for (const [transportadora, preparadas, guia_generada] of p.tr || []) {
    carga.push({
      fecha,
      warehouse_id: String(p.id),
      transportadora,
      preparadas,
      guia_generada,
      ultimo_evento: p.ue ? p.ue.replace(' ', 'T') + 'Z' : null,
      // edad_*: se quedan NULL. No las tenemos todavía y un 0 sería mentira.
    });
  }
}

const totalGuias = cargaDiaria.reduce((s, r) => s + r.preparadas + r.guia_generada, 0);

async function subir(tabla, filas, onConflict) {
  const LOTE = 500;
  let hechas = 0;
  for (let i = 0; i < filas.length; i += LOTE) {
    const chunk = filas.slice(i, i + LOTE);
    const { error } = await db.from(tabla).upsert(chunk, { onConflict });
    if (error) throw new Error(`${tabla}: ${error.message}`);
    hechas += chunk.length;
    process.stdout.write(`\r  ${tabla}: ${hechas}/${filas.length}`);
  }
  console.log(`\r  ${tabla}: ${hechas}/${filas.length} ✓`);
}

(async () => {
  const porPrecision = {};
  bodegas.forEach(b => porPrecision[b.nivel_precision] = (porPrecision[b.nivel_precision] || 0) + 1);

  console.log(`Fecha del export : ${fecha}`);
  console.log(`rec_bodega       : ${bodegas.length} bodegas`, porPrecision);
  console.log(`rec_carga_diaria : ${cargaDiaria.length} filas · ${totalGuias.toLocaleString('es-CO')} guías`);

  if (DRY) { console.log('\n--dry: no se escribió nada.'); return; }

  console.log('\nSubiendo…');
  await subir('rec_bodega', bodegas, 'warehouse_id');
  await subir('rec_carga_diaria', cargaDiaria, 'fecha,warehouse_id,transportadora');

  const { error } = await db.from('rec_importacion').insert({
    archivo: path.basename(DATOS),
    fecha_datos: fecha,
    filas: cargaDiaria.length,
    bodegas: bodegas.length,
    guias: totalGuias,
    usuario: USUARIO,
  });
  if (error) throw new Error(`rec_importacion: ${error.message}`);

  console.log('\nListo. Las coordenadas ya no dependen de un archivo local.');
})().catch(e => { console.error('\n✗', e.message); process.exit(1); });
