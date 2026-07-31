import { createClient } from "@supabase/supabase-js";

// Cliente separado que apunta al Supabase de Jaime — solo para el wizard
// original de campañas (src/app/api/campaigns/*). El resto del hub sigue
// usando el cliente de src/lib/supabase.ts (Supabase propio de Michelle).
const campaignsSupabaseUrl = process.env.CAMPAIGNS_SUPABASE_URL || "";
const campaignsSupabaseServiceKey = process.env.CAMPAIGNS_SUPABASE_SERVICE_KEY || "";

export const campaignsSupabase = campaignsSupabaseUrl && campaignsSupabaseServiceKey
  ? createClient(campaignsSupabaseUrl, campaignsSupabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;
