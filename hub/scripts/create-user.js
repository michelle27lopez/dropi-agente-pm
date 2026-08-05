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
  const email = 'alejandra.melo@dropi.co';
  console.log(`Searching for user ${email}...`);
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError);
    return;
  }

  const existingUser = users.find(u => u.email === email);
  if (!existingUser) {
    console.error(`User ${email} not found!`);
    return;
  }

  console.log(`Found user: ${existingUser.id}. Updating password...`);
  const { data, error } = await supabase.auth.admin.updateUserById(
    existingUser.id,
    { password: 'password123' }
  );

  if (error) {
    console.error("Error updating password:", error);
  } else {
    console.log("Password updated successfully to 'password123'!");
  }
}

run();
