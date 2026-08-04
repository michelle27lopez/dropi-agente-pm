-- ═══════════════════════════════════════════════════════════════════════════
-- DARWIN — BAC-001: AS-IS de facturación Chile & Ecuador (Discovery)
--
-- Contexto: se documentó el flujo AS-IS de revisión de facturación de Chile
-- (Luna Espejo, Matías Yañez) y Ecuador (Nataly Moreno Bernal), a partir de
-- las transcripciones de las reuniones "Hablemos de la revisión de
-- facturación" del 2026-07-22. El contenido se agregó como numeral 2.2 dentro
-- de "2. Discovery & AS-IS" en el acordeón de Documentación de
-- /proyectos/bac-001 (src/app/proyectos/bac-001/page.tsx): flujo común,
-- tabla de diferencias entre países y métricas operativas de cada uno.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Update semanal de la Célula Backoffice
insert into celula_updates (id, celula_id, week_date, title, content)
select
  gen_random_uuid(),
  (select id from celulas where slug = 'backoffice'),
  current_date,
  'BAC-001: AS-IS de facturación Chile & Ecuador documentado en Discovery',
  'Se documentó el flujo AS-IS de revisión de facturación de Chile (Luna Espejo, Matías Yañez) y Ecuador (Nataly Moreno Bernal), a partir de las reuniones del 22 de julio de 2026, y se agregó al numeral "2. Discovery & AS-IS" de la Documentación de BAC-001. Incluye el flujo común (revisión visual, corrección manual, validación módulo 11 en Chile), las diferencias entre países (Ecuador requiere descongelar wallet manualmente por un bug; Chile no permite seleccionar RUT como tipo de documento en algunos casos) y las métricas operativas: Chile recibe 100-200 solicitudes/día (hasta 300-400 tras fin de semana) con throughput de 100-150 validaciones/analista/día y redujo ~50% su carga desde la implementación del módulo de validación (de ≥1 semana a ~3 días); Ecuador recibe 20-28 solicitudes/día en operación normal, actualmente saturado por un nuevo bloqueo, con backlog de 111 pendientes y 207 wallets descongeladas manualmente. Se identificó que ninguno de los dos países tiene canal de soporte dedicado a facturación en Intercom — se acordó implementarlo primero en Chile.'
where not exists (
  select 1 from celula_updates
  where title = 'BAC-001: AS-IS de facturación Chile & Ecuador documentado en Discovery'
);

-- 2. Hallazgo de Discovery en el Ledger de Decisiones del Ciclo 1 de BAC-001
insert into discovery_decisions (id, cycle_id, tipo, causa, sub_perfil, texto, actor, data)
select
  gen_random_uuid()::text,
  c.id,
  'Hallazgo de Discovery',
  'M',
  'Dropshippers, Proveedores y Usuarios Cripto en LATAM',
  'AS-IS de facturación Chile y Ecuador (reuniones 2026-07-22): el trabajo manual de validación existe porque los dropshippers no completan sus datos de facturación en la plataforma, no por ineficiencia del analista. Ambos países arrastran bugs de plataforma que generan trabajo manual adicional como parche: Chile no permite seleccionar tipo de documento "RUT" en algunos casos (error "documento no válido", causa raíz no identificada); Ecuador requiere descongelar la wallet manualmente tras aprobar porque el auto-descongelamiento se rompió con el último bloqueo del fin de semana. Métricas: Chile 100-200 solicitudes/día (300-400 tras fin de semana), 100-150 validaciones/analista/día, ~600 registros en búsqueda manual pendiente, reducción de ~50% en carga desde el módulo de validación (de ≥1 semana a ~3 días). Ecuador: 20-28 solicitudes/día en operación normal, backlog de 111 pendientes y 207 wallets descongeladas manualmente al 2026-07-22, SLA mismo día. Ninguno de los dos países tiene canal de soporte de facturación dedicado en Intercom (Chile usa WhatsApp informal). Insight para el nuevo país en desarrollo (Argentina): percepción de Ecuador es que los datos de facturación deberían quedar bloqueados tras aprobación, no editables libremente, para evitar un ciclo interminable de re-revisiones.',
  'Paula Macias',
  '{"origen": "Documentación BAC-001 - Discovery & AS-IS (2.2)", "fuente": "Transcripciones reuniones facturación Chile y Ecuador 2026-07-22"}'::jsonb
from discovery_cycles c
where c.project_id = 'BAC-001'
and not exists (
  select 1 from discovery_decisions d
  where d.cycle_id = c.id
  and d.texto like 'AS-IS de facturación Chile y Ecuador (reuniones 2026-07-22)%'
)
limit 1;
