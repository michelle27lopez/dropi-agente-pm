-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — BAC-002: Página del proyecto + Acordeón "Documentación" (6 tabs)
--
-- Contexto: BAC-002 (Facturación Electrónica Argentina) ya existía como fila
-- en `projects`, pero no tenía página propia en el hub — cualquier visita a
-- /proyectos/bac-002 caía en la ruta genérica [slug]/page.tsx. Se creó
-- src/app/proyectos/bac-002/page.tsx replicando el patrón de acordeón+tabs
-- de BAC-001 (sin componente compartido — cada página del hub lo reimplementa
-- inline), con una card "Documentación" de 6 tabs: Kick-off, Discovery,
-- Definición, Following y lanzamiento, Hand off - DEV & Stakeholders,
-- Hallazgos following. Se omitieron a pedido de Paula Macias "Guía de
-- documentación E2E" y "Estrategia de comunicación".
--
-- Fuente: documentos_facturacionArg/Facturación Argentina - Formato de
-- documentación.txt. En esa fuente, los numerales 2 (Discovery) y 6
-- (Hallazgos following) quedaron como plantilla sin diligenciar (solo texto
-- guía entre corchetes) — se muestran en la UI marcados explícitamente como
-- "pendiente de diligenciar" en vez de simular contenido.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Nota: NO se inserta en celula_updates — el week_date de hoy (2026-07-30)
-- ya está ocupado por el update de "Cierre Julio 2026 · Product Designers"
-- de otra célula, y week_date tiene UNIQUE GLOBAL (no por célula). Ver
-- reference_darwin_supabase_hub para el detalle de esta limitación de
-- esquema. Mismo patrón de omisión ya usado en la migración 041 (BAC-001).
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Registrar ciclo de Discovery para BAC-002 (fase_actual = 'F0')
insert into discovery_cycles (id, project_id, title, estado, fase_actual, causa, sub_perfil, data)
values (
  '5c5f94c0-7266-4ff4-baa5-040971fc89c3',
  'BAC-002',
  'Ciclo 1: Facturación Electrónica Argentina (Registro Fiscal + Panel de Aprobación)',
  'activo',
  'F0',
  null,
  'Dropshippers y proveedores en Argentina (Persona Jurídica, Persona Humana, Persona Extranjera)',
  '{
    "brief": {
      "target": "Dropshippers y proveedores activos en Argentina (~1.000 usuarios), segmentados en Persona Jurídica, Persona Humana y Persona Extranjera",
      "subPerfil": "Dropshippers y proveedores en Argentina (Persona Jurídica, Persona Humana, Persona Extranjera)",
      "hipotesis": "Si implementamos en Argentina el registro de datos de facturación y el panel de aprobación ya validado en Ecuador y Chile, alcanzaremos ≥70% de cumplimiento fiscal al cierre del mes 3 y evitaremos el cierre de la cuenta bancaria por falta de trazabilidad tributaria.",
      "experimento": "Fase 1 (MVP): formulario de datos de facturación + panel de revisión admin. Fase 2 (evolutivo): validación de datos con Sumsub.",
      "indicadores": "Cumplimiento fiscal ≥70% al mes 3, Retención post-configuración ≥85%, Reducción de tickets de facturación ≥40%, Tasa de completación de formulario >50%"
    }
  }'::jsonb
)
on conflict (id) do nothing;

-- 2. Registrar Decisión de Hand-off / Documentación en el Ledger del Ciclo 1 de BAC-002
insert into discovery_decisions (id, cycle_id, tipo, causa, sub_perfil, texto, actor, data)
select
  'f15ea8d61eff4758b579550441726269',
  c.id,
  'Hand-off / Documentación',
  null,
  'Dropshippers y proveedores en Argentina (Persona Jurídica, Persona Humana, Persona Extranjera)',
  'Se creó /proyectos/bac-002 en el hub e inició formalmente el proyecto BAC-002 en Darwin. Se agregó la card acordeón "Documentación" con 6 tabs (Kick-off, Discovery, Definición, Following y lanzamiento, Hand off - DEV & Stakeholders, Hallazgos following), replicando el mismo patrón visual e implementación de BAC-001 (no existe componente Accordion/Tabs compartido en el hub — cada página lo reimplementa inline). Contenido grounded 1:1 en el archivo fuente "documentos_facturacionArg/Facturación Argentina - Formato de documentación.txt", omitiendo a pedido de Paula Macias las secciones "Guía de documentación E2E" y "Estrategia de comunicación". Se detectó que en el documento fuente los numerales 2 (Discovery) y 6 (Hallazgos following) quedaron como plantilla sin diligenciar para este proyecto (solo texto guía entre corchetes, sin datos de Argentina) — se muestran explícitamente marcados como "pendiente de diligenciar" en la UI en vez de simular contenido, para no alucinar hallazgos que Paula/el equipo aún no ha registrado. El resto de tabs (Kick-off, Definición, Following y lanzamiento, Hand-off) sí tienen contenido real resumido del documento: contexto de la alerta bancaria y fondos retenidos por Fixia, 6 escenarios de Definición, métricas y eventos Userpilot de Following, y los criterios de aceptación de Módulo A (formulario) y Módulo B (panel admin) resumidos por flujo en Hand-off, más las recomendaciones técnicas/negocio/riesgos del cierre del documento.',
  'Paula Macias',
  '{}'::jsonb
from discovery_cycles c
where c.project_id = 'BAC-002'
and not exists (
  select 1 from discovery_decisions d
  where d.cycle_id = c.id
  and d.texto like 'Se creó /proyectos/bac-002 en el hub%'
)
limit 1;
