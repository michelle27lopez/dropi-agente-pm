-- ═══════════════════════════════════════════════════════════════════════════
-- SEED EJEMPLO: TTV-001 · Meses 1–3 con datos de muestra
-- Pegar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Mes 1: ~85% de meta (equipo arrancando)
-- Mes 2: ~94% de meta (proceso mejorando)
-- Mes 3: ~98% de meta (operación estabilizada)

-- ─── 1. Metas mensuales — reales ────────────────────────────────────────────
UPDATE ttv_monthly_data SET contactos_real=265, auditados_real=134, listos_real=88  WHERE month_number=1;
UPDATE ttv_monthly_data SET contactos_real=278, auditados_real=148, listos_real=98  WHERE month_number=2;
UPDATE ttv_monthly_data SET contactos_real=291, auditados_real=154, listos_real=101 WHERE month_number=3;

-- ─── 2. Segmentos mensuales — reales ────────────────────────────────────────
-- Mes 1
UPDATE ttv_monthly_segments SET contactos_real=40,  auditados_real=14, listos_real=8  WHERE month_number=1 AND segment_key='pequenos';
UPDATE ttv_monthly_segments SET contactos_real=112, auditados_real=49, listos_real=32 WHERE month_number=1 AND segment_key='50_300';
UPDATE ttv_monthly_segments SET contactos_real=71,  auditados_real=42, listos_real=29 WHERE month_number=1 AND segment_key='300_1000';
UPDATE ttv_monthly_segments SET contactos_real=42,  auditados_real=29, listos_real=19 WHERE month_number=1 AND segment_key='1000_plus';
-- Mes 2
UPDATE ttv_monthly_segments SET contactos_real=46,  auditados_real=16, listos_real=9  WHERE month_number=2 AND segment_key='pequenos';
UPDATE ttv_monthly_segments SET contactos_real=128, auditados_real=57, listos_real=38 WHERE month_number=2 AND segment_key='50_300';
UPDATE ttv_monthly_segments SET contactos_real=67,  auditados_real=44, listos_real=30 WHERE month_number=2 AND segment_key='300_1000';
UPDATE ttv_monthly_segments SET contactos_real=37,  auditados_real=31, listos_real=21 WHERE month_number=2 AND segment_key='1000_plus';
-- Mes 3
UPDATE ttv_monthly_segments SET contactos_real=49,  auditados_real=17, listos_real=10 WHERE month_number=3 AND segment_key='pequenos';
UPDATE ttv_monthly_segments SET contactos_real=131, auditados_real=59, listos_real=39 WHERE month_number=3 AND segment_key='50_300';
UPDATE ttv_monthly_segments SET contactos_real=69,  auditados_real=45, listos_real=31 WHERE month_number=3 AND segment_key='300_1000';
UPDATE ttv_monthly_segments SET contactos_real=42,  auditados_real=33, listos_real=21 WHERE month_number=3 AND segment_key='1000_plus';

-- ─── 3. TTV tiempos reales ───────────────────────────────────────────────────
-- Meta: activación ≤5 días, primera orden ≤25 días
UPDATE ttv_time_metrics SET promedio_activacion_dias=5.9, promedio_primera_orden_dias=27.2 WHERE scope='global';
UPDATE ttv_time_metrics SET promedio_activacion_dias=7.1, promedio_primera_orden_dias=31.4 WHERE scope='mes_1';
UPDATE ttv_time_metrics SET promedio_activacion_dias=5.8, promedio_primera_orden_dias=26.3 WHERE scope='mes_2';
UPDATE ttv_time_metrics SET promedio_activacion_dias=4.8, promedio_primera_orden_dias=23.1 WHERE scope='mes_3';

-- ─── 4. Pipeline interno — reales meses 1, 2, 3 ─────────────────────────────
UPDATE ttv_pipeline_metrics SET mes1_real='100%', mes2_real='100%', mes3_real='100%' WHERE metric_key='formulario_completo';
UPDATE ttv_pipeline_metrics SET mes1_real='54%',  mes2_real='61%',  mes3_real='65%'  WHERE metric_key='bodega_creada';
UPDATE ttv_pipeline_metrics SET mes1_real='58%',  mes2_real='65%',  mes3_real='70%'  WHERE metric_key='producto_creado';
UPDATE ttv_pipeline_metrics SET mes1_real='38%',  mes2_real='45%',  mes3_real='50%'  WHERE metric_key='auditoria_solicitada';
UPDATE ttv_pipeline_metrics SET mes1_real='22%',  mes2_real='25%',  mes3_real='28%'  WHERE metric_key='en_auditoria';
UPDATE ttv_pipeline_metrics SET mes1_real='11%',  mes2_real='9%',   mes3_real='8%'   WHERE metric_key='con_novedad';
UPDATE ttv_pipeline_metrics SET mes1_real='17%',  mes2_real='21%',  mes3_real='24%'  WHERE metric_key='auditoria_aprobada';
UPDATE ttv_pipeline_metrics SET mes1_real='10%',  mes2_real='13%',  mes3_real='15%'  WHERE metric_key='primera_orden';
UPDATE ttv_pipeline_metrics SET mes1_real='6%',   mes2_real='5%',   mes3_real='4%'   WHERE metric_key='rechazado';
