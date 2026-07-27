// node scripts/verificar-recolecciones.mjs
//
// Chequeo de coherencia: ¿las columnas que el código consulta existen en el SQL?
// Detecta el desfase clásico entre migración y consultas, que en runtime se
// manifiesta como un 400 de PostgREST cuando ya es tarde.
import fs from "node:fs";
import path from "node:path";

const HUB = path.resolve(import.meta.dirname, "..");
const sql = fs.readFileSync(`${HUB}/supabase/037_recolecciones.sql`, "utf8");

// Columnas declaradas por tabla
const tablas = new Map();
for (const m of sql.matchAll(/create table if not exists (\w+) \(([\s\S]*?)\n\);/g)) {
  const [, nombre, cuerpo] = m;
  const cols = new Set();
  for (const linea of cuerpo.split("\n")) {
    const l = linea.replace(/--.*$/, "").trim();
    const c = l.match(/^(\w+)\s+(text|uuid|integer|boolean|date|time|timestamptz|double)/);
    if (c) cols.add(c[1]);
  }
  tablas.set(nombre, cols);
}

console.log("TABLAS EN LA MIGRACIÓN");
for (const [t, c] of tablas) console.log(`  ${t.padEnd(28)} ${c.size} columnas`);

// Consultas .from("x").select("a, b, c") en el código
const archivos = [];
const walk = d => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== "node_modules") walk(p); }
    else if (/\.tsx?$/.test(e.name)) archivos.push(p);
  }
};
walk(`${HUB}/src`);

console.log("\nCONSULTAS ENCONTRADAS");
let problemas = 0;
for (const f of archivos) {
  const src = fs.readFileSync(f, "utf8");
  // El select puede venir partido en varios literales concatenados con "+".
  // Capturar solo el primero daría un OK falso sobre las columnas del resto.
  for (const m of src.matchAll(/\.from\(["'](rec_\w+)["']\)[\s\S]{0,120}?\.select\(([\s\S]*?)\)\s*(?:\.|;|$)/g)) {
    const [, tabla, crudo] = m;
    // Solo el primer argumento: lo que sigue a ", {" son las opciones
    // (count/head) y sus valores no son nombres de columna.
    const soloColumnas = crudo.split(/,\s*\{/)[0];
    const sel = [...soloColumnas.matchAll(/["']([^"']+)["']/g)].map(x => x[1]).join("");
    if (!sel) continue;
    const rel = f.replace(HUB, "hub").replace(/\\/g, "/");
    if (!tablas.has(tabla)) {
      console.log(`  ✗ ${rel}: tabla '${tabla}' NO EXISTE en la migración`);
      problemas++;
      continue;
    }
    const cols = sel.split(",").map(s => s.trim()).filter(s => s && s !== "*");
    const faltan = cols.filter(c => !tablas.get(tabla).has(c.split(":")[0]));
    if (faltan.length) {
      console.log(`  ✗ ${rel}`);
      console.log(`      ${tabla}.select() pide columnas inexistentes: ${faltan.join(", ")}`);
      problemas++;
    } else {
      console.log(`  ✓ ${rel.split("/").slice(-3).join("/")} → ${tabla} (${cols.length} col)`);
    }
  }
  // upserts/inserts
  for (const m of src.matchAll(/\.from\(["'](rec_\w+)["']\)\s*\.\s*(insert|upsert)\(/g)) {
    if (!tablas.has(m[1])) {
      console.log(`  ✗ ${f.replace(HUB, "hub")}: ${m[2]} sobre tabla inexistente '${m[1]}'`);
      problemas++;
    }
  }
}

// onConflict debe apuntar a una PK/unique real
console.log("\nonConflict");
for (const f of archivos) {
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/\.from\(["'](rec_\w+)["']\)[\s\S]{0,200}?onConflict:\s*["']([^"']+)["']/g)) {
    const [, tabla, claves] = m;
    const cols = claves.split(",").map(s => s.trim());
    const faltan = cols.filter(c => !tablas.get(tabla)?.has(c));
    console.log(faltan.length
      ? `  ✗ ${tabla}: onConflict con columnas inexistentes: ${faltan.join(", ")}`
      : `  ✓ ${tabla}: onConflict (${claves})`);
    if (faltan.length) problemas++;
  }
}

console.log(problemas ? `\n${problemas} PROBLEMA(S)` : "\nTodo coherente ✓");
process.exit(problemas ? 1 : 0);
