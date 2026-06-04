-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRACIÓN: TTV-001 · Supplier Fast-Track Dashboard
-- Célula Supplier Success · Activación de Suppliers
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Metas y reales por mes (contactados, auditados, listos) ────────────────
CREATE TABLE IF NOT EXISTS ttv_monthly_data (
  id                            uuid            DEFAULT gen_random_uuid() PRIMARY KEY,
  month_number                  integer         NOT NULL,
  contactos_meta                integer         NOT NULL,
  contactos_real                integer,
  auditados_meta                integer         NOT NULL,
  auditados_real                integer,
  listos_meta                   integer         NOT NULL,
  listos_real                   integer,
  promedio_activacion_dias      numeric(5,1),   -- Registro → Listo para vender (real de la cohorte)
  promedio_primera_orden_dias   numeric(5,1),   -- Registro → Primera orden (real de la cohorte)
  updated_at                    timestamptz     DEFAULT now(),
  UNIQUE (month_number)
);

-- ─── Metas de 6 meses por segmento ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ttv_segments_6m (
  id                uuid            DEFAULT gen_random_uuid() PRIMARY KEY,
  segment_key       text            NOT NULL,
  segment_label     text            NOT NULL,
  sort_order        integer         NOT NULL,
  contactos_meta    integer         NOT NULL,
  contactos_real    integer,
  auditados_meta    integer         NOT NULL,
  auditados_real    integer,
  listos_meta       integer         NOT NULL,
  listos_real       integer,
  conversion_meta   text            NOT NULL,
  updated_at        timestamptz     DEFAULT now(),
  UNIQUE (segment_key)
);

-- ─── Metas mensuales por segmento ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ttv_monthly_segments (
  id                uuid            DEFAULT gen_random_uuid() PRIMARY KEY,
  month_number      integer         NOT NULL,
  segment_key       text            NOT NULL,
  sort_order        integer         NOT NULL DEFAULT 0,
  contactos_meta    integer         NOT NULL,
  contactos_real    integer,
  auditados_meta    integer         NOT NULL,
  auditados_real    integer,
  listos_meta       integer         NOT NULL,
  listos_real       integer,
  updated_at        timestamptz     DEFAULT now(),
  UNIQUE (month_number, segment_key)
);

-- ─── Métricas internas del pipeline (una fila por métrica) ─────────────────
CREATE TABLE IF NOT EXISTS ttv_pipeline_metrics (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_key      text        NOT NULL,
  metric_label    text        NOT NULL,
  target_pct      text        NOT NULL,
  sort_order      integer     NOT NULL,
  mes1_real       text,
  mes2_real       text,
  mes3_real       text,
  mes4_real       text,
  mes5_real       text,
  mes6_real       text,
  updated_at      timestamptz DEFAULT now(),
  UNIQUE (metric_key)
);

-- ─── TTV: tiempos reales globales y por cohorte ─────────────────────────────
CREATE TABLE IF NOT EXISTS ttv_time_metrics (
  id                            uuid            DEFAULT gen_random_uuid() PRIMARY KEY,
  scope                         text            NOT NULL,   -- 'global' | 'mes_1' .. 'mes_6'
  promedio_activacion_dias      numeric(5,1),
  promedio_primera_orden_dias   numeric(5,1),
  updated_at                    timestamptz     DEFAULT now(),
  UNIQUE (scope)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- RLS
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE ttv_monthly_data     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttv_segments_6m      ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttv_monthly_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttv_pipeline_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttv_time_metrics     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ttv_monthly_data_public_read"     ON ttv_monthly_data     FOR SELECT USING (true);
CREATE POLICY "ttv_segments_6m_public_read"      ON ttv_segments_6m      FOR SELECT USING (true);
CREATE POLICY "ttv_monthly_segments_public_read" ON ttv_monthly_segments FOR SELECT USING (true);
CREATE POLICY "ttv_pipeline_metrics_public_read" ON ttv_pipeline_metrics FOR SELECT USING (true);
CREATE POLICY "ttv_time_metrics_public_read"     ON ttv_time_metrics     FOR SELECT USING (true);

CREATE POLICY "ttv_monthly_data_service_all"     ON ttv_monthly_data     FOR ALL TO service_role USING (true);
CREATE POLICY "ttv_segments_6m_service_all"      ON ttv_segments_6m      FOR ALL TO service_role USING (true);
CREATE POLICY "ttv_monthly_segments_service_all" ON ttv_monthly_segments FOR ALL TO service_role USING (true);
CREATE POLICY "ttv_pipeline_metrics_service_all" ON ttv_pipeline_metrics FOR ALL TO service_role USING (true);
CREATE POLICY "ttv_time_metrics_service_all"     ON ttv_time_metrics     FOR ALL TO service_role USING (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: metas mensuales
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO ttv_monthly_data (month_number, contactos_meta, auditados_meta, listos_meta) VALUES
  (1, 294, 157, 104),
  (2, 293, 157, 103),
  (3, 293, 157, 103),
  (4, 294, 157, 104),
  (5, 293, 156, 103),
  (6, 293, 156, 103)
ON CONFLICT (month_number) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: segmentos 6 meses
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO ttv_segments_6m (segment_key, segment_label, sort_order, contactos_meta, auditados_meta, listos_meta, conversion_meta) VALUES
  ('pequenos',   'Pequeños / exploratorios', 1, 300,  105, 60,  '20%'),
  ('50_300',     '50–300 órdenes/mes',        2, 800,  360, 240, '30%'),
  ('300_1000',   '300–1.000 órdenes/mes',     3, 420,  273, 189, '45%'),
  ('1000_plus',  '+1.000 órdenes/mes',        4, 240,  202, 131, '55%')
ON CONFLICT (segment_key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: segmentos mensuales
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO ttv_monthly_segments (month_number, segment_key, sort_order, contactos_meta, auditados_meta, listos_meta) VALUES
  (1, 'pequenos',  1, 50,  18, 10), (1, '50_300',    2, 134, 60, 40), (1, '300_1000',  3, 70, 45, 32), (1, '1000_plus', 4, 40, 34, 22),
  (2, 'pequenos',  1, 50,  17, 10), (2, '50_300',    2, 133, 60, 40), (2, '300_1000',  3, 70, 46, 31), (2, '1000_plus', 4, 40, 34, 22),
  (3, 'pequenos',  1, 50,  17, 10), (3, '50_300',    2, 133, 60, 40), (3, '300_1000',  3, 70, 46, 31), (3, '1000_plus', 4, 40, 34, 22),
  (4, 'pequenos',  1, 50,  18, 10), (4, '50_300',    2, 134, 60, 40), (4, '300_1000',  3, 70, 45, 32), (4, '1000_plus', 4, 40, 34, 22),
  (5, 'pequenos',  1, 50,  17, 10), (5, '50_300',    2, 133, 60, 40), (5, '300_1000',  3, 70, 45, 31), (5, '1000_plus', 4, 40, 34, 22),
  (6, 'pequenos',  1, 50,  18, 10), (6, '50_300',    2, 133, 60, 40), (6, '300_1000',  3, 70, 46, 32), (6, '1000_plus', 4, 40, 32, 21)
ON CONFLICT (month_number, segment_key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: pipeline interno
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO ttv_pipeline_metrics (metric_key, metric_label, target_pct, sort_order) VALUES
  ('formulario_completo',   'Perfil calificado · llenaron el formulario', '100%', 1),
  ('bodega_creada',         'Bodega creada',                               '65%',  2),
  ('producto_creado',       'Producto creado',                             '70%',  3),
  ('auditoria_solicitada',  'Auditoría solicitada',                        '50%',  4),
  ('en_auditoria',          'En auditoría',                                '28%',  5),
  ('con_novedad',           'Con novedad',                                 '8%',   6),
  ('auditoria_aprobada',    'Auditoría aprobada',                          '24%',  7),
  ('primera_orden',         'Primera orden generada',                      '15%',  8),
  ('rechazado',             'Rechazado · No apto',                         '4%',   9)
ON CONFLICT (metric_key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED: time metrics (scopes vacíos, se llenan con datos reales)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO ttv_time_metrics (scope) VALUES
  ('global'), ('mes_1'), ('mes_2'), ('mes_3'), ('mes_4'), ('mes_5'), ('mes_6')
ON CONFLICT (scope) DO NOTHING;
