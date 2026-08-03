-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 039_brands_ttfo_ingesta.sql
-- Célula Brands Success · Activación Bruta TTFO (proyecto TTFO-001)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Fase 3 de TTFO-001: conecta 024_brands_ttfo.sql a un pipeline de carga real
-- (subida de CSVs desde la pizarra en /proyectos/onboarding-ttfo, en vez del
-- array estático data.ts). Agrega lo que faltaba para poder escribir ahí:
-- segmento Marca/Proveedor, marca de cuenta de prueba, un log de auditoría
-- por carga, y una lista de exclusión manual editable sin deploy (para
-- cuentas de prueba que no se detectan por patrón, ej. nombre real
-- confirmado por el equipo).
--
-- Decisiones confirmadas con Kate (Cell Board 29-jul-2026):
--   - Cohorte ACUMULADO desde el lanzamiento (10-jul en adelante), no cortes
--     de un solo día — por eso brands_ttfo_marcas.user_id sigue siendo único
--     y esta migración no lo toca.
--   - Se aplica la regla de validez temporal (evento debe ser anterior a
--     fecha_primera_orden para contar como causa) — no requiere columna
--     nueva, se calcula en el módulo de negocio al momento de la carga.
--   - Camino "integraciones" queda fuera de esta fase — sin archivos
--     disponibles todavía. brands_ttfo_caminos.camino ya lo admite
--     (CHECK de 024), no hace falta tocarlo; simplemente no se usa aún.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── brands_ttfo_marcas: segmento + marca de prueba ──────────────────────────
ALTER TABLE brands_ttfo_marcas
  ADD COLUMN IF NOT EXISTS segmento text CHECK (segmento IN ('marca', 'proveedor')),
  ADD COLUMN IF NOT EXISTS es_prueba boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS motivo_exclusion text;

-- Cuentas de prueba se escriben con es_prueba=true, nunca se omiten de la
-- tabla — quedan visibles y auditables, pero toda stat/alerta del módulo de
-- negocio las filtra explícitamente (nunca cuentan como activación real).
CREATE INDEX IF NOT EXISTS idx_brands_ttfo_marcas_segmento ON brands_ttfo_marcas (segmento);
CREATE INDEX IF NOT EXISTS idx_brands_ttfo_marcas_es_prueba ON brands_ttfo_marcas (es_prueba);

-- ── brands_ttfo_importacion: log de auditoría por carga ─────────────────────
-- Espejo de rec_importacion (037_recolecciones.sql) — qué se subió, qué
-- rango cubre, y un snapshot de los conteos de ese momento. El snapshot de
-- pasos (resumen_pasos) es lo único que permite reconstruir la Alerta C
-- ("mayor caída por paso") más adelante, porque brands_ttfo_caminos solo
-- guarda el estado terminal por camino, no el detalle de los 11 pasos.
CREATE TABLE IF NOT EXISTS brands_ttfo_importacion (
  id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  archivos           jsonb NOT NULL, -- [{nombre, slot, tipo, filas}, ...] + no_reconocidos
  ventana_desde      timestamptz,
  ventana_hasta      timestamptz,
  poblacion          integer NOT NULL DEFAULT 0,
  activadas          integer NOT NULL DEFAULT 0,
  exito              integer NOT NULL DEFAULT 0,
  fracaso            integer NOT NULL DEFAULT 0,
  en_observacion     integer NOT NULL DEFAULT 0,
  alerta_a_flujo_y_orden   integer NOT NULL DEFAULT 0,
  alerta_b_orden_sin_flujo integer NOT NULL DEFAULT 0,
  resumen_pasos      jsonb, -- snapshot de conteos por paso para la Alerta C
  usuario            text,
  created_at         timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brands_ttfo_importacion_created_at ON brands_ttfo_importacion (created_at DESC);

-- ── brands_ttfo_exclusiones: lista manual de cuentas de prueba ──────────────
-- Tabla, no constante en código: necesita ser editable sin deploy (caso
-- real: una cuenta con nombre de apariencia real confirmada como prueba por
-- el equipo, no detectable por ningún patrón de nombre/correo).
CREATE TABLE IF NOT EXISTS brands_ttfo_exclusiones (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       integer UNIQUE NOT NULL,
  motivo        text NOT NULL,
  agregado_por  text,
  created_at    timestamptz DEFAULT now()
);

-- ── RLS: mismo criterio restrictivo que 024_brands_ttfo.sql ─────────────────
-- DROP POLICY IF EXISTS antes de cada CREATE porque, a diferencia de CREATE
-- TABLE/INDEX, CREATE POLICY no admite IF NOT EXISTS — sin esto, reintentar
-- correr esta migración (ej. tras un fallo a mitad de camino) revienta con
-- "policy already exists" en vez de ser un no-op seguro.
ALTER TABLE brands_ttfo_importacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands_ttfo_exclusiones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_read_brands_ttfo_importacion" ON brands_ttfo_importacion;
CREATE POLICY "authenticated_read_brands_ttfo_importacion" ON brands_ttfo_importacion
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_read_brands_ttfo_exclusiones" ON brands_ttfo_exclusiones;
CREATE POLICY "authenticated_read_brands_ttfo_exclusiones" ON brands_ttfo_exclusiones
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "service_all_brands_ttfo_importacion" ON brands_ttfo_importacion;
CREATE POLICY "service_all_brands_ttfo_importacion" ON brands_ttfo_importacion
  FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "service_all_brands_ttfo_exclusiones" ON brands_ttfo_exclusiones;
CREATE POLICY "service_all_brands_ttfo_exclusiones" ON brands_ttfo_exclusiones
  FOR ALL TO service_role USING (true);
