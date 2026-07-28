-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 037_ttv_piloto_fase0.sql
-- Célula Supplier Success · Seguimiento del piloto manual TTV-001
-- (300+ pedidos/mes, "activar ahora, auditar después")
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ttv_piloto_fase0 (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email               text NOT NULL,
  telefono             text,
  etapa               text NOT NULL DEFAULT 'activado',
  notas               text,
  sort_order          int,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ttv_piloto_fase0_email ON ttv_piloto_fase0 (email);

-- Solo lectura autenticada. Sin políticas públicas de escritura — igual que
-- el resto del PM Operating System (ver 033/034): todos los inserts/updates
-- de la app pasan por hub/src/lib/supabase.ts (SUPABASE_SERVICE_KEY), que
-- ignora RLS.
ALTER TABLE ttv_piloto_fase0 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ttv_piloto_fase0_authenticated_read" ON ttv_piloto_fase0
  FOR SELECT TO authenticated USING (true);
