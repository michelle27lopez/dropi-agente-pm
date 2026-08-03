-- ═══════════════════════════════════════════════════════════════════════════
-- SCRIPT COMBINADO — migraciones pendientes de correr en Supabase Dashboard
-- (SQL Editor). Incluye 023, 039 y 040. Son independientes entre sí, se
-- pueden pegar y ejecutar de una sola vez.
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────────
-- 023_ascenso_panel_perdidos
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
-- ───────────────────────────────────────────────────────────────────────────

ALTER TABLE supplier_ascenso_panel
  ADD COLUMN IF NOT EXISTS estado_snapshot text NOT NULL DEFAULT 'activo'; -- 'activo' | 'perdido'

ALTER TABLE supplier_ascenso_panel
  ADD COLUMN IF NOT EXISTS perdido_en date; -- fecha_extraccion del CSV en que dejó de calificar sin haber sido avisado

CREATE INDEX IF NOT EXISTS idx_ascenso_panel_estado_snapshot
  ON supplier_ascenso_panel (estado_snapshot);


-- ───────────────────────────────────────────────────────────────────────────
-- 039_today_meetings
-- Reuniones del día para el panel "Hoy" del home.
--
-- Sincronizado por conversación (mismo patrón que sprint_task_checklist):
-- no hay integración en vivo con Google Calendar en el hub. Cuando Michelle
-- pide "trae mis reuniones de hoy", el agente usa su conector de Calendar y
-- hace upsert acá.
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS today_meetings (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  person_email TEXT        NOT NULL,
  event_date   DATE        NOT NULL,
  start_time   TIMESTAMPTZ NOT NULL,
  end_time     TIMESTAMPTZ NOT NULL,
  title        TEXT        NOT NULL,
  join_url     TEXT,
  is_personal  BOOLEAN     NOT NULL DEFAULT false,
  synced_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS today_meetings_person_date_idx ON today_meetings (person_email, event_date);

ALTER TABLE today_meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "today_meetings_public_read" ON today_meetings;
DROP POLICY IF EXISTS "today_meetings_service_all" ON today_meetings;
CREATE POLICY "today_meetings_public_read" ON today_meetings FOR SELECT USING (true);
CREATE POLICY "today_meetings_service_all" ON today_meetings FOR ALL TO service_role USING (true);


-- ───────────────────────────────────────────────────────────────────────────
-- 040_calendar_events
-- Calendario de proyectos (reemplaza la sección "Documentación" del menú,
-- que quedó como placeholder sin uso).
--
-- Registra hitos importantes de los proyectos del hub: lanzamientos,
-- handoffs y otros hitos que el equipo quiera dejar marcados en una fecha
-- concreta.
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS calendar_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  event_type   TEXT        NOT NULL CHECK (event_type IN ('lanzamiento', 'handoff', 'otro')),
  event_date   DATE        NOT NULL,
  project_code TEXT,
  project_name TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS calendar_events_date_idx ON calendar_events (event_date);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "calendar_events_public_read" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_service_all" ON calendar_events;
CREATE POLICY "calendar_events_public_read" ON calendar_events FOR SELECT USING (true);
CREATE POLICY "calendar_events_service_all" ON calendar_events FOR ALL TO service_role USING (true);
