-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 024_brands_ttfo.sql
-- Célula Brands Success · Activación Bruta TTFO (proyecto TTFO-001)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Fase 2 de TTFO-001: reemplaza el arreglo estático RESULTADO_SEMANAL en
-- hub/src/app/proyectos/onboarding-ttfo/data.ts. Set reducido, decidido en
-- Cell Board 16-jul-2026: solo encuesta + activación + caminos de onboarding.
-- Deja fuera cualquier campo de CRM/gestión comercial (crmFase/crmEstado/
-- crmGestion1a1) — se probó e integró esta misma semana y se retiró por
-- generar confusión sobre cómo consumen el onboarding; si se retoma, es
-- una migración aparte.
--
-- Dos tablas, espejo 1:1 de las fuentes CSV que ya se validaron en Fase 1:
--   brands_ttfo_marcas   ← Resultado_Semanal.csv (una fila por usuario)
--   brands_ttfo_caminos  ← Onboarding_Match.csv  (una fila por usuario+camino)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS brands_ttfo_marcas (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               integer UNIQUE NOT NULL,
  submitted_at          timestamptz NOT NULL, -- Submitted At de la encuesta de clasificación
  signed_up             timestamptz NOT NULL,
  ventas_mes_declaradas text, -- respuesta a "7.¿Cuántas ventas realiza tu marca al mes?"
  primera_orden         date,
  ttfo_dias             integer,
  estado_meta_7d        text NOT NULL DEFAULT 'en_observacion'
                          CHECK (estado_meta_7d IN ('exito', 'fracaso', 'en_observacion', 'sin_signed_up')),
  gatillo               text NOT NULL DEFAULT 'sin_atribucion'
                          CHECK (gatillo IN ('gatillo_cerrado', 'activacion_sin_atribucion_cerrada', 'sin_atribucion')),
  ordenes_creadas       integer,
  ordenes_entregadas    integer,
  etapa                 text NOT NULL DEFAULT 'no_activo'
                          CHECK (etapa IN ('entrego', 'activo_sin_entrega', 'no_activo')),
  data_corte            date NOT NULL, -- fecha T-1 de la carga semanal que produjo esta fila
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brands_ttfo_marcas_submitted_at ON brands_ttfo_marcas (submitted_at);
CREATE INDEX IF NOT EXISTS idx_brands_ttfo_marcas_estado_meta_7d ON brands_ttfo_marcas (estado_meta_7d);

CREATE TABLE IF NOT EXISTS brands_ttfo_caminos (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        integer NOT NULL REFERENCES brands_ttfo_marcas (user_id) ON DELETE CASCADE,
  camino         text NOT NULL CHECK (camino IN ('bodega', 'producto', 'orden_manual', 'integraciones')),
  estado         text NOT NULL CHECK (estado IN ('Completed', 'Dismissed')),
  last_completed timestamptz,
  last_dismissed timestamptz,
  created_at     timestamptz DEFAULT now(),
  UNIQUE (user_id, camino)
);

CREATE INDEX IF NOT EXISTS idx_brands_ttfo_caminos_user_id ON brands_ttfo_caminos (user_id);

-- RLS: mismo criterio restrictivo que 019_darwin_rls.sql — solo lectura para
-- usuarios logueados, ninguna escritura directa desde el navegador (anon ni
-- authenticated). Los inserts/updates semanales van por un script server-side
-- con la service key (igual que sync_userpilot.py para otras tablas del hub).
ALTER TABLE brands_ttfo_marcas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands_ttfo_caminos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_brands_ttfo_marcas" ON brands_ttfo_marcas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_read_brands_ttfo_caminos" ON brands_ttfo_caminos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "service_all_brands_ttfo_marcas" ON brands_ttfo_marcas
  FOR ALL TO service_role USING (true);

CREATE POLICY "service_all_brands_ttfo_caminos" ON brands_ttfo_caminos
  FOR ALL TO service_role USING (true);
