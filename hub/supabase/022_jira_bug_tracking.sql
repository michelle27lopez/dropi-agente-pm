-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN 022: Seguimiento de HUs de bug publicadas en Jira (PROD)
-- Ejecutar en: Supabase Dashboard → SQL Editor
--
-- Cada vez que la skill bug-jira crea un issue tipo "Error" en Jira PROD,
-- se refleja aquí para que Soporte/TI (o cualquiera del equipo) le haga
-- seguimiento sin tener que entrar a Jira.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS jira_bug_tracking (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  jira_key         TEXT        NOT NULL UNIQUE,
  jira_url         TEXT        NOT NULL,
  summary          TEXT        NOT NULL,
  label_type       TEXT,
  product_code     TEXT,
  status           TEXT,
  assignee         TEXT,
  parent_epic_key  TEXT,
  reported_by      TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE jira_bug_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jira_bug_tracking_public_read" ON jira_bug_tracking FOR SELECT USING (true);
CREATE POLICY "jira_bug_tracking_public_insert" ON jira_bug_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY "jira_bug_tracking_service_all" ON jira_bug_tracking FOR ALL TO service_role USING (true);
