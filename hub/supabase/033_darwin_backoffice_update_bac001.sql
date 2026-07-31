-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Update completo del proyecto BAC-001 (Célula Backoffice)
--
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Actualización de datos del proyecto BAC-001
update projects
set
  name = 'Validación de Identidad Países (KYC / KYB / KYT)',
  status = 'Discovery',
  type = 'Proyecto',
  handoff_status = 'Experimentación',
  estado_interno = 'Concepción de experimento',
  summary = 'Unificación del sistema de validación de identidad (Sumsub + Truora) para Dropshippers, Proveedores y CriptoWallets en los 12 países LATAM.',
  business_area = 'Cumplimiento, Facturación & Operaciones',
  owner = 'Paula Macias',
  team = 'Célula Backoffice (PO: Paula Macias · PD: Catalina Giraldo)',
  vpv = 95
where project_code = 'BAC-001';

-- 2. Registrar ciclo de Discovery B=MAP para BAC-001 (usando fase_actual = 'F0')
insert into discovery_cycles (id, project_id, title, estado, fase_actual, causa, sub_perfil, data)
values (
  gen_random_uuid()::text,
  'BAC-001',
  'Ciclo 1: Unificación KYC/KYB/KYT & Reducción de Manualidad',
  'activo',
  'F0',
  'M',
  'Dropshippers, Proveedores y Usuarios Cripto en LATAM',
  '{
    "brief": {
      "causa": "M",
      "subPerfil": "Dropshippers, Proveedores y Usuarios Cripto en LATAM",
      "target": "Usuarios en Colombia, México, Panamá, Guatemala y los 12 países de Dropi",
      "hipotesis": "Si unificamos la validación de identidad y facturación en una sola experiencia asistida por Sumsub + Truora, reduciremos la manualidad del 40% a <8% y eliminaremos el riesgo legal activo de KYB y KYT.",
      "experimento": "Fase 0: Captura asistida con UserPilot + Webhook a API intermedia sin tocar el monolito core.",
      "indicadores": "Tasa manual < 8%, Aprobación auto > 92%, Tiempo medio ~20s, Abandono UX < 5%"
    }
  }'::jsonb
)
on conflict (id) do nothing;

-- 3. Registrar Decisiones de Arquitectura (Ledger) para BAC-001
insert into discovery_decisions (id, cycle_id, tipo, causa, sub_perfil, texto, actor, data)
select
  gen_random_uuid()::text,
  c.id,
  'Arquitectura',
  'M',
  'Dropshippers, Proveedores y Usuarios Cripto en LATAM',
  'Adoptar estrategia mixta Sumsub + Truora: Sumsub para KYB (empresas) y KYT (cripto), Truora para KYC PN en Colombia según reglas del contrato renovado en mayo 2026.',
  'Paula Macias',
  '{"origen": "Kick-off BAC-001"}'::jsonb
from discovery_cycles c
where c.project_id = 'BAC-001'
limit 1;

insert into discovery_decisions (id, cycle_id, tipo, causa, sub_perfil, texto, actor, data)
select
  gen_random_uuid()::text,
  c.id,
  'Estrategia UX',
  'M',
  'Dropshippers, Proveedores y Usuarios Cripto en LATAM',
  'Establecer regla dual: para Colombia, formulario unificado primero y validación después; para el resto de países, validación primero y precarga automática de datos en formulario después.',
  'Catalina Giraldo',
  '{"origen": "Kick-off BAC-001"}'::jsonb
from discovery_cycles c
where c.project_id = 'BAC-001'
limit 1;

-- 4. Registrar Update Semanal de la Célula Backoffice
insert into celula_updates (id, celula_id, week_date, title, content)
select
  gen_random_uuid(),
  (select id from celulas where slug = 'backoffice'),
  current_date,
  'Kick-off BAC-001 & Documentación Unificada Carga',
  'Se completó la alineación de Kick-off y Discovery para el proyecto BAC-001 (Validación de Identidad Países). Se definió el roadmap de 5 fases (Fase 0 a Fase 4) priorizando la reducción de validaciones manuales en Colombia del 40% a <8% y la integración de Sumsub para KYB y KYT.'
where not exists (
  select 1 from celula_updates where title = 'Kick-off BAC-001 & Documentación Unificada Carga'
);
