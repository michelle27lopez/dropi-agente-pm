-- ═══════════════════════════════════════════════════════════════════════════
-- RLS para user_access — la tabla que decide quién entra a qué app
-- Ejecutar en: Supabase Dashboard → SQL Editor (proyecto fwwkesboxlbmimzyoztq)
--
-- Se creó `public.user_access` (email, app_name, created_at) para controlar
-- acceso entre apps que comparten este Supabase (Darwin/hub, Inidiana). Es
-- razón suficiente para tratarla como sensible: quien pueda escribirla puede
-- otorgarse acceso a cualquier app. Mismo patrón que el resto del proyecto
-- (019/032/033/034): RLS + solo lectura para logueados, escritura solo por
-- la service key del servidor — la UI de administración en /admin/usuarios
-- pasa por /api/admin/user-access, que usa la service key y valida
-- is_super_admin antes de escribir.
-- ═══════════════════════════════════════════════════════════════════════════

do $$
begin
  if to_regclass('public.user_access') is null then
    raise notice 'Tabla user_access no existe, se saltó.';
  else
    execute 'alter table user_access enable row level security';
    execute 'create policy "authenticated_read_user_access" on user_access for select to authenticated using (true)';
  end if;
end $$;
