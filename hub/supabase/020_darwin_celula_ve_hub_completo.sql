-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Ve hub completo (por célula, no por persona)
--
-- Controla si los miembros de una célula, al entrar, navegan solo su propia
-- home o pueden además saltar a ver las homes de las demás células (mismo
-- selector "Darwin ▾" que ya tiene el super admin). Configurable únicamente
-- por el super admin desde /celulas. Default false: cada célula empieza
-- viendo solo su propia home.
-- ═══════════════════════════════════════════════════════════════════════════

alter table celulas
  add column if not exists ve_hub_completo boolean not null default false;
