-- Control de Recolecciones contiene direcciones, teléfonos, mensajes y
-- decisiones operativas. Estar autenticado en el Hub no basta: la lectura
-- directa por Supabase queda limitada a quienes tengan `user_access` para la
-- app histórica `inidiana`, o sean superadministradores.
--
-- La service role del servidor sigue omitiendo RLS, pero las rutas del Hub
-- validan el mismo permiso antes de consultar o escribir.

do $$
declare
  t text;
  tables text[] := array[
    'rec_transportadora','rec_bodega','rec_carga_diaria',
    'rec_solicitud','rec_solicitud_bodega','rec_gestion','rec_importacion'
  ];
begin
  foreach t in array tables loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table %I enable row level security', t);
      execute format('drop policy if exists %I on %I', 'authenticated_read_' || t, t);
      execute format('drop policy if exists %I on %I', 'inidiana_read_' || t, t);
      execute format($policy$
        create policy %I on %I for select to authenticated using (
          exists (
            select 1
            from public.user_access ua
            where lower(ua.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
              and ua.app_name = 'inidiana'
          )
          or exists (
            select 1
            from public.profiles p
            where p.id = auth.uid()
              and p.is_super_admin is true
          )
        )
      $policy$, 'inidiana_read_' || t, t);
    end if;
  end loop;
end $$;

select schemaname, tablename, policyname, roles, cmd
from pg_policies
where tablename in (
  'rec_transportadora','rec_bodega','rec_carga_diaria',
  'rec_solicitud','rec_solicitud_bodega','rec_gestion','rec_importacion'
)
order by tablename, policyname;
