import { createClient } from "@supabase/supabase-js";

// Campañas vive en el mismo Supabase de Jaime que el resto del hub, así que
// usa las mismas credenciales que src/lib/supabase.ts. Antes tenía su propio
// par CAMPAIGNS_SUPABASE_* porque apuntaba a un proyecto distinto; esa
// separación desapareció cuando el hub migró todo al Supabase de Jaime, y las
// CAMPAIGNS_* quedaron con una llave legacy que Supabase ya deshabilitó
// ("Legacy API keys are disabled"). Cada llamada devolvía null en silencio y
// las rutas caían al respaldo en disco de local-store-planeacion.ts — que no
// existe en Vercel, así que en producción el panel salía vacío y los links
// /c/[token] de los proveedores daban 404.
const campaignsSupabaseUrl = process.env.SUPABASE_URL || "";
const campaignsSupabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

export const campaignsSupabase = campaignsSupabaseUrl && campaignsSupabaseServiceKey
  ? createClient(campaignsSupabaseUrl, campaignsSupabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;
