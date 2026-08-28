const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Manually parse env file
const envPath = 'c:/Users/SECUNDARIA/Documents/GitHub/dropi-agente-pm/hub/.env.local';
let envVars = {};
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      envVars[key] = val;
    }
  });
} catch (e) {
  console.error("Error reading env file:", e);
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  console.log("Querying projects from database...");
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*');

  if (error) {
    console.error("Error querying projects:", error);
    return;
  }

  console.log(`Found ${projects.length} projects:`);
  projects.forEach(p => {
    console.log(`- [${p.type}] ${p.id} / ${p.project_code} / ${p.name} (Parent: ${p.parent_project_id})`);
  });
}

run();
