-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Cambia el default de ve_hub_completo a true
--
-- Decisión (2026-07-09): las células nuevas nacen pudiendo navegar a las
-- demás homes (como el super admin) salvo que Jaime las restrinja
-- explícitamente marcando "Solo ve su propia home" desde /celulas.
-- Las células ya existentes conservan el valor que ya tenían.
-- ═══════════════════════════════════════════════════════════════════════════

alter table celulas
  alter column ve_hub_completo set default true;
