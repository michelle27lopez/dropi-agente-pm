-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — BAC-001: Dashboard de Datos grounded en los 28 CSV de Val_ID_CVS
--
-- Contexto: el acordeón "Dashboard de Datos" de /proyectos/bac-001 traía cifras
-- ilustrativas/erróneas (ej. Persona Jurídica mostrada con 0% de validación
-- cuando en realidad valida 16.59% vs 5.10% de Persona Natural). Se releyeron
-- los 28 CSV de dropi-agente-pm/hub/documentos/Val_ID_CVS y se corrigieron las
-- cifras, agregando el hallazgo más crítico que faltaba: 3.369 usuarios con
-- Truora ya exitoso pero sin sincronizar en base_usuarios.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Update semanal de la Célula Backoffice
insert into celula_updates (id, celula_id, week_date, title, content)
select
  gen_random_uuid(),
  (select id from celulas where slug = 'backoffice'),
  current_date,
  'BAC-001: Dashboard de Datos corregido con análisis real de los 28 CSV (Val_ID_CVS)',
  'Se releyeron los 28 CSV de Val_ID_CVS (Truora + base_usuarios + SaldosWallet 2025) y se corrigió el acordeón "Dashboard de Datos" de BAC-001, que tenía cifras ilustrativas o invertidas. Hallazgo más crítico agregado: 3.369 usuarios ya tienen Truora exitoso pero la base los sigue marcando como NO aprobados (desfase de sincronización), con un quick win de 416 usuarios / $1.602M COP en saldo positivo pendiente de sincronizar. Se corrigió además que Persona Jurídica valida más que Persona Natural (16.59% vs 5.10%, no 0% como se mostraba antes) y que los usuarios baneados cambian MENOS sus datos de facturación (4.09% vs 6.47% de no baneados), lo opuesto a la hipótesis original. Se sumó el hallazgo de 1.307 usuarios no validados y activos con facturación incompleta (vs. solo 9 del lado validado).'
where not exists (
  select 1 from celula_updates
  where title = 'BAC-001: Dashboard de Datos corregido con análisis real de los 28 CSV (Val_ID_CVS)'
);

-- 2. Hallazgo de datos en el Ledger de Decisiones del Ciclo 1 de BAC-001
insert into discovery_decisions (id, cycle_id, tipo, causa, sub_perfil, texto, actor, data)
select
  gen_random_uuid()::text,
  c.id,
  'Hallazgo de Datos',
  'M',
  'Dropshippers, Proveedores y Usuarios Cripto en LATAM',
  'Análisis grounded de los 28 CSV de Val_ID_CVS: el hallazgo de mayor impacto operativo es el desfase de sincronización Truora↔base_usuarios (3.369 casos, incluye quick win de $1.602M COP en saldo por liberar). Se corrigieron dos hipótesis que estaban invertidas en el dashboard: (1) Persona Jurídica SÍ valida más que Persona Natural (16.59% vs 5.10%) — no existe un flujo KYB dedicado, usan el mismo KYC individual; (2) los usuarios baneados cambian MENOS sus datos de facturación que los no baneados (4.09% vs 6.47%), por lo que la inestabilidad de datos no es señal predictiva de baneo ni de peor tasa de éxito en Truora (92%-100% estable en todos los grupos).',
  'Paula Macias',
  '{"origen": "Dashboard de Datos BAC-001", "fuente": "Val_ID_CVS (28 CSV)"}'::jsonb
from discovery_cycles c
where c.project_id = 'BAC-001'
limit 1;
