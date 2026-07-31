-- ═══════════════════════════════════════════════════════════════════════════
-- Permite que un Update de célula enlace a una página propia (ej. dashboard
-- de cierre mensual), para que la tarjeta se vea y se comporte igual que un
-- Proyecto (link "Ver más →") en vez de solo texto.
-- ═══════════════════════════════════════════════════════════════════════════

alter table celula_updates
  add column if not exists url text; -- ej. "/proyectos/monthly-update/2026-07" — null = update de solo texto, como hasta ahora
