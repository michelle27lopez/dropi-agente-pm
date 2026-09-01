// Convierte el Excel de productos de Cyber Days en catalogo.json.
// Se corre cada vez que llega un Excel nuevo de la campaña (no es un script
// de una sola vez): el catálogo público en /cyberdays-catalogo lee ese JSON
// como dato estático, sin base de datos.
//
//   node scripts/cyberdays-catalogo-import.js "/ruta/al/excel.xlsx"
//
// Columnas esperadas en el Excel (tolerante a variantes de nombre, sin
// distinguir mayúsculas/acentos): nombre, precio, id/sku (debe coincidir con
// el nombre del archivo en public/cyberdays/productos/{id}.webp), link a
// Dropi, categoría/proveedor.
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const excelPath = process.argv[2];
if (!excelPath) {
  console.error("Uso: node scripts/cyberdays-catalogo-import.js <ruta-excel>");
  process.exit(1);
}

const OUT_PATH = path.join(__dirname, "..", "src", "app", "cyberdays-catalogo", "catalogo.json");
const PRODUCTOS_DIR = path.join(__dirname, "..", "public", "cyberdays", "productos");

function normalizeHeader(h) {
  return String(h)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const HEADER_ALIASES = {
  id: ["id", "sku", "id/sku", "codigo", "id producto", "producto id"],
  name: ["nombre", "producto", "nombre producto", "nombre del producto"],
  price: ["precio", "valor", "precio venta"],
  dropiUrl: ["link", "url", "link dropi", "url dropi", "link producto", "enlace"],
  category: ["categoria", "proveedor", "categoria/proveedor", "marca"],
};

function findKey(row, field) {
  const aliases = HEADER_ALIASES[field];
  const keys = Object.keys(row);
  for (const key of keys) {
    if (aliases.includes(normalizeHeader(key))) return key;
  }
  return null;
}

function cleanPrice(raw) {
  if (typeof raw === "number") return Math.round(raw);
  const digits = String(raw ?? "").replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

const workbook = XLSX.readFile(excelPath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

if (!rows.length) {
  console.error("El Excel no tiene filas en la primera hoja.");
  process.exit(1);
}

const idKey = findKey(rows[0], "id");
const nameKey = findKey(rows[0], "name");
const priceKey = findKey(rows[0], "price");
const dropiUrlKey = findKey(rows[0], "dropiUrl");
const categoryKey = findKey(rows[0], "category");

const missingCols = ["id", "name", "dropiUrl"].filter(
  (f) => !{ id: idKey, name: nameKey, dropiUrl: dropiUrlKey }[f]
);
if (missingCols.length) {
  console.error(`No se encontraron las columnas requeridas: ${missingCols.join(", ")}.`);
  console.error(`Encabezados detectados en el Excel: ${Object.keys(rows[0]).join(", ")}`);
  process.exit(1);
}

const products = [];
let discarded = 0;

for (const row of rows) {
  const id = String(row[idKey] ?? "").trim();
  const name = String(row[nameKey] ?? "").trim();
  const dropiUrl = String(row[dropiUrlKey] ?? "").trim();
  if (!id || !name || !dropiUrl) {
    discarded++;
    continue;
  }
  products.push({
    id,
    name,
    price: priceKey ? cleanPrice(row[priceKey]) : 0,
    category: categoryKey ? String(row[categoryKey] ?? "").trim() : "",
    dropiUrl,
  });
}

const missingImage = products.filter((p) => !fs.existsSync(path.join(PRODUCTOS_DIR, `${p.id}.webp`)));

fs.writeFileSync(OUT_PATH, JSON.stringify(products, null, 2) + "\n");

console.log(`Importados: ${products.length}`);
console.log(`Descartados (sin id/nombre/link): ${discarded}`);
console.log(`Sin foto .webp correspondiente: ${missingImage.length}`);
if (missingImage.length) {
  console.log(missingImage.map((p) => p.id).join(", "));
}
console.log(`Escrito en: ${OUT_PATH}`);
