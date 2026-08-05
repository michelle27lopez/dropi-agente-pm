-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 040_brands_ttfo_comparacion.sql
-- Célula Brands Success · Activación Bruta TTFO (proyecto TTFO-001)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Agrega un snapshot de la comparación "con onboarding guiado vs. sin él"
-- (TTFO por grupo, corte 28-jul-2026) a brands_ttfo_importacion, para que el
-- dashboard principal (/proyectos/onboarding-ttfo) la muestre como referencia
-- persistente — no como una página aparte con su propia carga.
--
-- Por qué no vive en brands_ttfo_marcas: esa tabla solo guarda el cohorte
-- desde el 28-jul (Submitted At >= corte) — los encuestados de antes nunca
-- se persisten ahí. La comparación necesita AMBOS grupos, así que se calcula
-- en el momento de la carga (con la Encuesta completa, sin filtrar) y se
-- guarda como snapshot, igual que resumen_pasos.
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE brands_ttfo_importacion
  ADD COLUMN IF NOT EXISTS comparacion_onboarding jsonb;
