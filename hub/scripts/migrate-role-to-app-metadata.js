// AGP-17: migra user_metadata.role -> app_metadata.role.
//
// user_metadata lo puede escribir el propio usuario desde el navegador
// (supabase.auth.updateUser({ data: { role: "pm" } })), así que basar una
// decisión de seguridad ahí es una escalada de privilegios trivial.
// app_metadata solo lo escribe el service-role, por eso el middleware
// (src/proxy.ts) debe leer de ahí.
//
// Corre esto ANTES de desplegar el cambio en proxy.ts que lee
// app_metadata en vez de user_metadata — si el proxy se despliega primero,
// los usuarios "contributor" pierden la restricción temporalmente porque
// su rol aún no existe en app_metadata.
//
// Uso:
//   node scripts/migrate-role-to-app-metadata.js            (dry-run, no escribe nada)
//   node scripts/migrate-role-to-app-metadata.js --apply     (aplica los cambios)

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const vars = {};
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const idx = trimmed.indexOf("=");
    vars[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  });
  return vars;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const env = loadEnvLocal();
  const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Falta SUPABASE_URL o SUPABASE_SERVICE_KEY en .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let page = 1;
  const perPage = 200;
  const toMigrate = [];

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error("Error listando usuarios:", error);
      process.exit(1);
    }
    for (const u of data.users) {
      const userRole = u.user_metadata?.role;
      const appRole = u.app_metadata?.role;
      if (userRole && userRole !== appRole) {
        toMigrate.push({ id: u.id, email: u.email, userRole, appRole });
      }
    }
    if (data.users.length < perPage) break;
    page += 1;
  }

  if (toMigrate.length === 0) {
    console.log("Nada que migrar — ningún usuario tiene user_metadata.role sin su equivalente en app_metadata.");
    return;
  }

  console.log(`${toMigrate.length} usuario(s) con rol en user_metadata que falta o difiere en app_metadata:\n`);
  for (const u of toMigrate) {
    console.log(`  ${u.email}: user_metadata.role="${u.userRole}"  app_metadata.role=${u.appRole ? `"${u.appRole}"` : "(vacío)"}`);
  }

  if (!apply) {
    console.log("\nDry-run — no se escribió nada. Corre con --apply para aplicar los cambios.");
    return;
  }

  console.log("\nAplicando...");
  for (const u of toMigrate) {
    const { error } = await supabase.auth.admin.updateUserById(u.id, {
      app_metadata: { role: u.userRole },
    });
    if (error) {
      console.error(`  ✗ ${u.email}: ${error.message}`);
    } else {
      console.log(`  ✓ ${u.email}: app_metadata.role="${u.userRole}"`);
    }
  }
}

main();
