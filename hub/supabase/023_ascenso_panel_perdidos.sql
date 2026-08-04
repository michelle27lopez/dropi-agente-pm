-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: 023_ascenso_panel_perdidos
-- Célula Supplier Success · IND-001 · "Se le pasó el momento"
-- Antes, cada import semanal del CSV borraba de supplier_ascenso_panel a
-- cualquier proveedor que no viniera en el export nuevo. Eso perdía sin
-- rastro a quien había estado "Listo" (pct_umbral >= 1) y nadie alcanzó a
-- avisarle antes de que su ventana móvil de 90 días bajara del umbral.
--
-- Ahora esos casos no se borran: se marcan estado_snapshot='perdido' y
-- conservan los últimos valores conocidos (ordenes_movilizadas_90d,
-- pct_umbral, etc. tal como estaban la última vez que calificó), para que
-- Comercial los vea en Historial. Si el proveedor vuelve a aparecer en un
-- CSV futuro, /importar lo reactiva automáticamente (estado_snapshot='activo').
--
-- Solo se marca "perdido" a quien estaba Listo y SIN oferta en
-- ascenso_ofertas (nadie le avisó a tiempo). El resto de las filas que ya
-- no vienen en el CSV (no calificaban, o ya tenían oferta) se sigue borrando
-- igual que antes — ver hub/src/app/api/proyectos/prospectos-ascenso/importar/route.ts.
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE supplier_ascenso_panel
  ADD COLUMN IF NOT EXISTS estado_snapshot text NOT NULL DEFAULT 'activo'; -- 'activo' | 'perdido'

ALTER TABLE supplier_ascenso_panel
  ADD COLUMN IF NOT EXISTS perdido_en date; -- fecha_extraccion del CSV en que dejó de calificar sin haber sido avisado

CREATE INDEX IF NOT EXISTS idx_ascenso_panel_estado_snapshot
  ON supplier_ascenso_panel (estado_snapshot);
