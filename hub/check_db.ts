import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function check() {
  const { data: celulas } = await supabase.from('celulas').select('*');
  console.log('--- CELULAS ---');
  console.log(celulas);

  const { data: profiles } = await supabase.from('profiles').select('*, celulas(*)').eq('email', 'santiago.herrera@dropi.co');
  console.log('--- PROFILE ---');
  console.log(profiles);
}

check();
