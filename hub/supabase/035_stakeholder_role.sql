-- ═══════════════════════════════════════════════════════════════════════════
-- Rol Stakeholder — vista ejecutiva cross-célula (Lucho CEO, María CPO)
--
-- Un stakeholder no pertenece a ninguna célula (celula_id queda null) y no es
-- super admin (no ve los botones de admin del hub). Aterriza en /resumen en
-- vez de /celula/<slug>, pero puede usar el switcher para entrar a ver el
-- detalle de cualquier célula.
-- ═══════════════════════════════════════════════════════════════════════════

alter table profiles
  add column if not exists is_stakeholder boolean not null default false;
