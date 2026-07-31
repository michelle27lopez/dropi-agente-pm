-- ═══════════════════════════════════════════════════════════════════════════
-- Cerrar el resto de tablas sin RLS + acotar pulso_demo_attendees
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Hallazgo (equipo de seguridad, 2026-07-22), continuación de 019_darwin_rls:
-- pulso_demo_*, discovery_* (product lens), expertos_sessions y activa_demo_*
-- se crearon sin RLS — abiertas por default a la anon key pública.
--
-- Verificado antes de este cambio: hub/src/lib/supabase.ts usa la SERVICE
-- key (no la anon), y es el único cliente que usan todas las rutas server-side
-- de /api/pulso-demo/*, /api/activa-demo/*, /api/expertos-sesiones/*,
-- /api/proyectos/[slug] y src/lib/product-lens/persistence.ts — la service
-- key siempre ignora RLS, así que cerrar estas tablas a "authenticated" no
-- rompe nada de lo existente.
--
-- Única excepción: src/app/pulso-demo/dashboard/page.tsx (el dashboard en
-- vivo del piloto) crea su propio cliente Supabase en el navegador con la
-- anon key y usa Realtime (`postgres_changes`) sobre pulso_demo_attendees y
-- pulso_demo_sessions para animar la llegada de asistentes externos (no
-- logueados en el hub — llegan por WhatsApp/QR). Realtime evalúa RLS como un
-- SELECT: sin política para anon, esos eventos dejarían de llegar y se
-- rompería el piloto. Por eso estas dos tablas NO quedan en "authenticated
-- only" como el resto — quedan con lectura anon acotada:
--   - pulso_demo_attendees: anon solo ve columnas sin PII (id, name,
--     accepted_at, committed_units) — nunca email, whatsapp ni token (el
--     token es el link de aceptación; exponerlo dejaría aceptar en nombre
--     de otro asistente).
--   - pulso_demo_sessions: no tiene PII (solo contadores de la sesión del
--     demo) — puede quedar de lectura pública completa.
-- Insert/update/delete siguen sin política para anon/authenticated en ambas
-- — solo la service key escribe, como ya venían operando.
--
-- Nota: al correrla se descubrió que "expertos_sessions" no existe en la
-- base real (la migración 023 quedó en el repo pero nunca se ejecutó ahí).
-- Por eso cada bloque abajo revisa que la tabla exista antes de tocarla —
-- si falta alguna, se salta con un NOTICE en vez de tronar toda la migración.
-- ═══════════════════════════════════════════════════════════════════════════

do $$
declare
  t text;
  tables text[] := array[
    'pulso_demo_product',
    'discovery_cycles',
    'discovery_patterns',
    'discovery_decisions',
    'expertos_sessions',
    'activa_demo_attendees',
    'activa_demo_matches',
    'activa_demo_messages'
  ];
begin
  foreach t in array tables loop
    if to_regclass('public.' || t) is null then
      raise notice 'Tabla % no existe, se saltó.', t;
      continue;
    end if;

    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy %I on %I for select to authenticated using (true)',
      'authenticated_read_' || t, t
    );
  end loop;
end $$;

-- pulso_demo_sessions: sin PII, puede quedar pública para que el Realtime
-- del dashboard en vivo funcione sin login.

do $$
begin
  if to_regclass('public.pulso_demo_sessions') is null then
    raise notice 'Tabla pulso_demo_sessions no existe, se saltó.';
  else
    execute 'alter table pulso_demo_sessions enable row level security';
    execute 'create policy "public_read_pulso_demo_sessions" on pulso_demo_sessions for select using (true)';
  end if;
end $$;

-- pulso_demo_attendees: RLS + columnas acotadas para anon (necesario para
-- que el Realtime del dashboard en vivo reciba los eventos), sin exponer
-- email/whatsapp/token.

do $$
begin
  if to_regclass('public.pulso_demo_attendees') is null then
    raise notice 'Tabla pulso_demo_attendees no existe, se saltó.';
  else
    execute 'alter table pulso_demo_attendees enable row level security';
    execute 'create policy "anon_read_public_columns_pulso_demo_attendees" on pulso_demo_attendees for select using (true)';
    execute 'revoke select on pulso_demo_attendees from anon, authenticated';
    execute 'grant select (id, name, accepted_at, committed_units, created_at) on pulso_demo_attendees to anon, authenticated';
  end if;
end $$;
