-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Célula Backoffice & Proyecto BAC-001 (Validación de Identidad Países)
--
-- Creado para: Paula Macias (PO de Backoffice)
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Asegurar la existencia de la Célula Backoffice
insert into celulas (nombre, lead, area, slug)
values ('Backoffice', 'Paula Macias', 'Cumplimiento, Facturación & Operaciones', 'backoffice')
on conflict (slug) do update set
  lead = excluded.lead,
  nombre = excluded.nombre;

-- 2. Asegurar el proyecto BAC-001 en Supabase
insert into projects (name, project_code, status, type, handoff_status, business_area, owner, team, summary, celula_owner_id)
select
  'Validación de Identidad Países (KYC / KYB / KYT)',
  'BAC-001',
  'Discovery',
  'Proyecto',
  'Experimentación',
  'Cumplimiento & Facturación',
  'Paula Macias',
  'Célula Backoffice',
  'Unificación global del sistema de validación de identidad (Sumsub + Truora) para Dropshippers, Proveedores y CriptoWallets en los 12 países LATAM.',
  (select id from celulas where slug = 'backoffice')
where not exists (
  select 1 from projects p where p.project_code = 'BAC-001'
);

-- Actualizar ownership y datos si el proyecto ya existía con otro id
update projects
set
  name = 'Validación de Identidad Países (KYC / KYB / KYT)',
  status = 'Discovery',
  type = 'Proyecto',
  handoff_status = 'Experimentación',
  celula_owner_id = (select id from celulas where slug = 'backoffice')
where project_code = 'BAC-001';
