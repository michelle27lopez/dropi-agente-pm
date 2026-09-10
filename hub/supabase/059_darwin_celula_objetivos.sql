-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — Objetivo / enfoque de cada célula (misión, visión, NSM, foco)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Decisiones de diseño (2026-09-08, Head de Producto + agente):
--   - Hasta hoy `celulas` solo guarda `nombre / lead / area / slug /
--     ve_hub_completo` (016/017/018/020). La capa estratégica de cada
--     célula — qué persigue y por qué — vivía fuera de Darwin: en un Google
--     Doc de "direccionamiento por célula" y en las memorias .md locales de
--     cada quien. Por eso no se podía consultar formalmente el enfoque de una
--     célula sin preguntarle a la persona.
--   - Se resuelve con columnas simples en `celulas` (no tabla aparte): son
--     1:1 con la célula y por ahora no se necesita historial por trimestre
--     (decisión explícita del Head de Producto — si más adelante hace falta
--     ver cómo cambió el foco Q3→Q4 se migra a `celula_objetivos`).
--   - `foco_trimestre` es texto libre con el enfoque del período vigente; se
--     sobrescribe al cambiar de trimestre.
--   - `enlace_direccionamiento` apunta al doc formal (Confluence) cuando
--     existe — el dato en Darwin es el resumen consultable, el doc es la
--     fuente extensa.
--   - Edición: PATCH /api/celulas/[slug], permiso de lead de la célula o
--     super admin (requireCelulaMember). Sin cambios de RLS: `celulas` ya
--     está cerrada a escritura directa (019/037), todo pasa por la API con
--     SUPABASE_SERVICE_KEY.
-- ═══════════════════════════════════════════════════════════════════════════

alter table celulas
  add column if not exists mision                 text,
  add column if not exists vision                 text,
  add column if not exists nsm                    text,
  add column if not exists foco_trimestre         text,
  add column if not exists enlace_direccionamiento text;

-- Backfill de Logística: hasta ahora su misión/NSM/foco vivían hardcodeados
-- en hub/src/app/celula/[slug]/page.tsx (caso especial `slug === "logistica"`).
-- Se pasan a dato para que el panel deje de tener un caso especial y el
-- /resumen los pueda leer igual que los de las demás células.
update celulas set
  mision = 'Dueña de la orden: todo lo que le pasa una vez se crea en Dropi.',
  nsm    = 'Tasa de entrega exitosa ≥ 70% (OKR 2 · KR 2.1).',
  foco_trimestre = 'Q3–Q4: sostener y mejorar la tasa de entrega, y reducir el tiempo de la orden hasta la transportadora.',
  enlace_direccionamiento = 'https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1485471746'
where slug = 'logistica'
  and mision is null;
