-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — BAC-001: Entregable DOCX "Investigación y Mapeo API Sumsub"
--
-- Contexto: se consolidó toda la investigación técnica de la API de Sumsub
-- (autenticación/firma HMAC, webhooks, resultados de revisión, estructura del
-- applicant) y el mapeo campo por campo hacia los formularios de Datos
-- Personales (KYC) y Datos de Facturación (Persona Natural/Jurídica, 9 países
-- LATAM) — mismo contenido del acordeón "Verificación Sumsub" de
-- /proyectos/bac-001 (migración 041) — en un documento .docx exportable, con
-- los links de referencia a la documentación oficial de Sumsub.
--
-- Archivo: dropi-agente-pm/hub/documentos/
--   "BAC-001 - Investigacion y Mapeo API Sumsub.docx"
--
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Update semanal de la Célula Backoffice
insert into celula_updates (id, celula_id, week_date, title, content)
select
  gen_random_uuid(),
  (select id from celulas where slug = 'backoffice'),
  '2026-07-31',
  'BAC-001: DOCX de investigación técnica y mapeo API Sumsub entregado',
  'Se consolidó en un documento .docx exportable ("BAC-001 - Investigacion y Mapeo API Sumsub.docx") toda la investigación técnica de la API de Sumsub (autenticación/firma HMAC de requests y webhooks, ciclo de vida de webhooks, resultado de revisión GREEN/RED-RETRY/RED-FINAL, estructura completa del applicant vía GET applicant data) junto con el mapeo campo por campo hacia los formularios de Datos Personales (KYC) y Datos de Facturación (Persona Natural/Jurídica, 9 países LATAM), incluyendo la tabla de documentos a subir por país y los puntos abiertos pendientes de confirmar con TI. El documento incluye los links de referencia a las 12 páginas de documentación oficial de Sumsub consultadas.'
where not exists (
  select 1 from celula_updates
  where title = 'BAC-001: DOCX de investigación técnica y mapeo API Sumsub entregado'
);

-- 2. Hand-off a TI en el Ledger de Decisiones del Ciclo 1 de BAC-001
insert into discovery_decisions (id, cycle_id, tipo, causa, sub_perfil, texto, actor, data)
select
  gen_random_uuid()::text,
  c.id,
  'Hand-off a TI',
  'M',
  'Dropshippers, Proveedores y Usuarios Cripto en LATAM',
  'Se entregó el documento "BAC-001 - Investigacion y Mapeo API Sumsub.docx" que consolida la investigación técnica de la API de Sumsub (autenticación y firma HMAC de requests/webhooks, política de reintentos, ciclo de vida completo de webhooks, resultado de revisión GREEN/RED-RETRY/RED-FINAL, flujo de reenvío de documentos en RETRY, estructura completa del applicant vía GET applicant data incluyendo info/fixedInfo/idDocs/addresses/companyInfo/questionnaires) y el mapeo campo por campo hacia los formularios reales de Datos Personales (KYC) y Datos de Facturación (Persona Natural/Jurídica, 9 países LATAM) con la tabla de documentos a subir por país. Mismo contenido que el acordeón "Verificación Sumsub" de /proyectos/bac-001, en formato exportable con links de referencia a la documentación oficial de Sumsub, listo para compartir con el equipo de TI.',
  'Paula Macias',
  '{"origen": "Documento BAC-001 - Investigacion y Mapeo API Sumsub.docx", "archivo": "dropi-agente-pm/hub/documentos/BAC-001 - Investigacion y Mapeo API Sumsub.docx"}'::jsonb
from discovery_cycles c
where c.project_id = 'BAC-001'
and not exists (
  select 1 from discovery_decisions d
  where d.cycle_id = c.id
  and d.texto like 'Se entregó el documento "BAC-001 - Investigacion y Mapeo API Sumsub.docx"%'
)
limit 1;
