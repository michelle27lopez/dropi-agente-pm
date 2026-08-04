-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — BAC-001: Acordeón "Verificación Sumsub" (Resumen técnico + Mapeo API)
--
-- Contexto: se agregó un tercer acordeón debajo del "Dashboard de Datos" en
-- /proyectos/bac-001 (src/app/proyectos/bac-001/page.tsx), con 2 tabs:
--   1) Resumen Técnico Sumsub — autenticación/firma HMAC de requests y
--      webhooks, política de reintentos, conceptos clave del modelo de datos
--      (info vs. fixedInfo vs. questionnaires vs. Applicant Action), ciclo de
--      vida de webhooks (applicantCreated → ... → applicantReviewed),
--      resultado de revisión (GREEN / RED-RETRY / RED-FINAL), flujo de
--      reenvío de documentos en RETRY y consideraciones para verificación
--      exitosa.
--   2) Mapeo API · Formularios — mapeo campo por campo de los formularios de
--      Datos Personales (KYC, 3 grupos de países) y Datos de Facturación
--      (Persona Natural/Jurídica, 9 países LATAM) hacia los objetos de la API
--      de Sumsub (info, fixedInfo, idDocs, companyInfo, questionnaires), más
--      tabla de documentos a subir por país.
--
-- Fuente: documentación oficial de Sumsub (docs.sumsub.com) + insumos de
-- Paula Macias (CSV de campos de datos personales y de facturación LATAM).
--
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Nota: NO se inserta en celula_updates — el week_date de hoy (2026-07-29)
-- ya está ocupado por el update de "AS-IS de facturación Chile & Ecuador"
-- (migración 040) para la célula Backoffice, y week_date tiene UNIQUE
-- GLOBAL (no por célula). Ver reference_darwin_supabase_hub para el detalle
-- de esta limitación de esquema.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Decisión de Arquitectura en el Ledger de Decisiones del Ciclo 1 de BAC-001
insert into discovery_decisions (id, cycle_id, tipo, causa, sub_perfil, texto, actor, data)
select
  gen_random_uuid()::text,
  c.id,
  'Arquitectura',
  'M',
  'Dropshippers, Proveedores y Usuarios Cripto en LATAM',
  'Mapeo técnico API Sumsub → formularios de Datos Personales (KYC) y Datos de Facturación (Persona Natural/Jurídica, 9 países LATAM), documentado en un nuevo acordeón "Verificación Sumsub" de /proyectos/bac-001. Decisiones clave a confirmar con TI: (1) los campos de facturación no extraíbles por OCR (Email de facturación, Teléfono, Régimen Fiscal) se capturan como cuestionario dentro del mismo WebSDK de Sumsub (Flujo 2), no en un formulario aparte de Dropi — se leen del objeto "questionnaires" vía GET applicant data, requiere fijar un id estable por pregunta; (2) cuando los datos de facturación de una persona natural son los mismos que sus datos personales, no se resuben documentos — se recomienda implementar como "Applicant Action" de Sumsub sobre el mismo applicantId del KYC, en vez de crear un applicant nuevo, para no repetir la verificación de identidad. Puntos abiertos identificados en el mapeo: "Segundo apellido" no tiene campo propio en la API (viaja concatenado en info.lastName); el número tributario (RUC/NIT/CUIT/RFC) puede modelarse como idDocs[].number o como companyInfo.taxId según cómo se configure el nivel por país; KYB (persona jurídica) requiere formulario dinámico por país porque companyInfo no tiene un esquema de campos fijo entre países.',
  'Paula Macias',
  '{"origen": "Documentación BAC-001 - Acordeón Verificación Sumsub (Resumen técnico + Mapeo API)", "fuente": "docs.sumsub.com + CSV campos_datos_personales.csv y Datos de Facturación LATAM.csv"}'::jsonb
from discovery_cycles c
where c.project_id = 'BAC-001'
and not exists (
  select 1 from discovery_decisions d
  where d.cycle_id = c.id
  and d.texto like 'Mapeo técnico API Sumsub → formularios de Datos Personales%'
)
limit 1;
