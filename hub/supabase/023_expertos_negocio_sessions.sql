-- ═══════════════════════════════════════════════════════════════════════════
-- EXP-001 — Expertos en el Negocio: calendario de capacitaciones
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists expertos_sessions (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,                 -- tema
  facilitator   text,                           -- moderador
  track         text,                           -- Célula / E-commerce / Chatea Pro / Shopi / Estados / ROAX / ATOM / Fennix / MBA / Otro
  description   text,                           -- descripción / preguntas esenciales
  session_date  date,                           -- null = sin programar todavía (backlog)
  duration      text,                           -- ej. "30 min", "1 hora", "1.5 horas"
  meeting_url   text,                           -- link de Meet/Zoom para unirse en vivo
  status        text check (status in ('Backlog','Programada','Hecha','Documentada')) default 'Backlog',
  resources     jsonb not null default '[]'::jsonb, -- [{label, url}] — grabación, transcripción, material previo
  compromisos   jsonb not null default '[]'::jsonb, -- [{item, responsable, hecho}]
  faq           jsonb not null default '[]'::jsonb, -- [{pregunta, respuesta}] — biblia de dudas resueltas
  notes         text,                           -- aprendizaje clave / resumen post-sesión
  proposed_by   text,
  source        text check (source in ('Programa','Comunidad')) default 'Programa',
  sort_order    integer default 0,
  created_at    timestamptz default now()
);

-- Backlog oficial ya definido — se agenda progresivamente desde el calendario.
-- Guardado contra doble-inserción si la migración se corre más de una vez.
insert into expertos_sessions (title, track, facilitator, source, status, sort_order)
select v.title, v.track, v.facilitator, 'Programa', 'Backlog', v.sort_order
from (values
  ('Intensivo células', 'Célula', null, 1),
  ('Capacitación de e-commerce', 'E-commerce', 'María Ossa', 2),
  ('Chatea Pro: socialicemos el modelo de chateo y las posibilidades', 'Chatea Pro', null, 3),
  ('Conozcamos Shopi', 'Shopi', null, 4),
  ('Estados a profundidad', 'Estados', null, 5),
  ('Conozcamos ROAX', 'ROAX', null, 6),
  ('Conozcamos ATOM', 'ATOM', null, 7),
  ('Conozcamos Fennix', 'Fennix', null, 8)
) as v(title, track, facilitator, sort_order)
where not exists (
  select 1 from expertos_sessions s where s.title = v.title and s.source = 'Programa'
);

-- Malla curricular del "Dropi Product Leadership MBA" (6 meses, 24 viernes).
-- Guardado contra doble-inserción si la migración se corre más de una vez.
insert into expertos_sessions (title, track, facilitator, description, source, status, sort_order)
select v.title, 'MBA', v.facilitator, v.description, 'Programa', 'Backlog', v.sort_order
from (values
  ('Semana 1 · La felicidad como habilidad de alto rendimiento', 'Profesor invitado / psicólogo organizacional', '🎓 Dropi Product Leadership MBA — Mes 1: Mentalidad de Product Leadership. Bienestar, energía, propósito y relaciones como condiciones para decidir mejor y liderar de forma sostenible. Entregable: Plan personal de energía y liderazgo.', 101),
  ('Semana 2 · Modelos mentales y primeros principios', 'Founder / Product Leader', '🎓 Dropi Product Leadership MBA — Mes 1: Mentalidad de Product Leadership. Separar hechos de supuestos, desmontar problemas y reconstruir soluciones desde restricciones reales. Entregable: Mapa de supuestos de un reto real.', 102),
  ('Semana 3 · Pensamiento sistémico y efectos de segundo orden', 'Especialista en sistemas', '🎓 Dropi Product Leadership MBA — Mes 1: Mentalidad de Product Leadership. Loops, demoras, dependencias y consecuencias no intencionales dentro de un marketplace. Entregable: Diagrama causal de una métrica Dropi.', 103),
  ('Semana 4 · Influencia, ownership y decisiones difíciles', 'Coach ejecutivo / Head of Product', '🎓 Dropi Product Leadership MBA — Mes 1: Mentalidad de Product Leadership. Cómo liderar sin autoridad formal, asumir outcomes y sostener trade-offs. Entregable: Filosofía personal de liderazgo.', 104),
  ('Semana 5 · Lean Startup y velocidad de aprendizaje', 'Experto en Lean Startup', '🎓 Dropi Product Leadership MBA — Mes 2: Discovery y Experimentación. Build–Measure–Learn, hipótesis de valor y crecimiento, MVP y aprendizaje validado. Entregable: Canvas de experimento.', 105),
  ('Semana 6 · Research y Jobs To Be Done', 'UX Researcher', '🎓 Dropi Product Leadership MBA — Mes 2: Discovery y Experimentación. Entrevistas sin sesgo, progreso buscado, circunstancias y alternativas actuales. Entregable: Job map y hallazgos cualitativos.', 106),
  ('Semana 7 · Opportunity Solution Tree y priorización', 'Product Coach', '🎓 Dropi Product Leadership MBA — Mes 2: Discovery y Experimentación. Conectar outcome, oportunidades, soluciones y experimentos con evidencia. Entregable: Árbol de oportunidades.', 107),
  ('Semana 8 · Diseño de experimentos y MVPs', 'Growth PM', '🎓 Dropi Product Leadership MBA — Mes 2: Discovery y Experimentación. Variables, población, criterio de éxito, guardrails, concierge, fake door y prototipos. Entregable: Backlog de hipótesis con pruebas diseñadas.', 108),
  ('Semana 9 · North Star Metric e input metrics', 'Head of Analytics', '🎓 Dropi Product Leadership MBA — Mes 3: Data, Métricas y Causalidad. Definir una métrica de valor y los indicadores de entrada que predicen su movimiento. Entregable: Árbol de métricas por célula.', 109),
  ('Semana 10 · Leading indicators, funnels y cohorts', 'Product Analyst', '🎓 Dropi Product Leadership MBA — Mes 3: Data, Métricas y Causalidad. Activación, retención, conversión, tiempo al valor y lectura por cohortes. Entregable: Análisis de una cohorte real.', 110),
  ('Semana 11 · Estadística, A/B testing y causalidad', 'Data Scientist', '🎓 Dropi Product Leadership MBA — Mes 3: Data, Métricas y Causalidad. Intervalos de confianza, tamaño de muestra, control, tratamiento, correlación y contrafactual. Entregable: Diseño de prueba y criterio de decisión.', 111),
  ('Semana 12 · Storytelling con datos', 'BI Lead / CFO', '🎓 Dropi Product Leadership MBA — Mes 3: Data, Métricas y Causalidad. Transformar dashboards en narrativa ejecutiva: contexto, insight, decisión y riesgo. Entregable: Presentación ejecutiva de cinco minutos.', 112),
  ('Semana 13 · Buena estrategia y OKRs', 'VP Product / Estratega', '🎓 Dropi Product Leadership MBA — Mes 4: Estrategia y Portafolio. Diagnóstico, política guía, acciones coherentes y conexión con outcomes. Entregable: One-page strategy.', 113),
  ('Semana 14 · Portfolio Thinking y trade-offs', 'CPO / Portfolio Manager', '🎓 Dropi Product Leadership MBA — Mes 4: Estrategia y Portafolio. Core, growth bets, exploración, horizonte, apetito y costo de oportunidad. Entregable: Mapa de portafolio.', 114),
  ('Semana 15 · Wardley Maps y posicionamiento', 'Estratega de negocio', '🎓 Dropi Product Leadership MBA — Mes 4: Estrategia y Portafolio. Evolución de capacidades, dependencia, commoditización y decisiones build–buy–partner. Entregable: Mapa estratégico.', 115),
  ('Semana 16 · Opportunity Review Board', 'CEO / CFO / CTO', '🎓 Dropi Product Leadership MBA — Mes 4: Estrategia y Portafolio. Defensa de prioridades ante comité ejecutivo con evidencia, riesgos y renuncias claras. Entregable: Portafolio priorizado y decisiones explícitas.', 116),
  ('Semana 17 · Arquitectura de software para dummies', 'Arquitecto de Software', '🎓 Dropi Product Leadership MBA — Mes 5: Tecnología para PMs. Capas, componentes, servicios, dependencias, deuda técnica, disponibilidad y escalabilidad. Entregable: Diagrama de arquitectura simplificado.', 117),
  ('Semana 18 · APIs, eventos, datos y microservicios', 'Backend Lead', '🎓 Dropi Product Leadership MBA — Mes 5: Tecnología para PMs. Request/response, webhooks, colas, contratos, bases de datos y consistencia. Entregable: Diseño conceptual de integración.', 118),
  ('Semana 19 · Cloud, seguridad y observabilidad', 'DevOps / Security Lead', '🎓 Dropi Product Leadership MBA — Mes 5: Tecnología para PMs. Infraestructura, costos, privacidad, accesos, fraude, logging y monitoreo. Entregable: Checklist de riesgos técnicos.', 119),
  ('Semana 20 · IA, agentes y vibe coding responsable', 'AI Engineer / CTO', '🎓 Dropi Product Leadership MBA — Mes 5: Tecnología para PMs. Prototipado rápido, límites entre demo y producción, evaluación y guardrails. Entregable: Prototipo funcional con nota técnica.', 120),
  ('Semana 21 · Growth loops y economía del marketplace', 'Growth Director / Marketplace Expert', '🎓 Dropi Product Leadership MBA — Mes 6: Growth, Ejecución y Adopción. Loops, liquidez, oferta, demanda, efectos de red, concentración y crecimiento compuesto. Entregable: Mapa de growth loop.', 121),
  ('Semana 22 · Unit economics, pricing y monetización', 'CFO / Pricing Expert', '🎓 Dropi Product Leadership MBA — Mes 6: Growth, Ejecución y Adopción. CAC, LTV, margen de contribución, payback, packaging y disposición a pagar. Entregable: Modelo de unit economics.', 122),
  ('Semana 23 · Go-to-Market, adopción y change management', 'Product Marketing / Customer Success', '🎓 Dropi Product Leadership MBA — Mes 6: Growth, Ejecución y Adopción. Beta, rollout, comunicación, enablement, activación, retención y guardrails. Entregable: Plan de lanzamiento y adopción.', 123),
  ('Semana 24 · Demo Day y Capstone', 'Comité ejecutivo', '🎓 Dropi Product Leadership MBA — Mes 6: Growth, Ejecución y Adopción. Defensa de una iniciativa real con problema, evidencia, experimento, arquitectura, impacto y roadmap. Entregable: Investment memo + demo final.', 124)
) as v(title, facilitator, description, sort_order)
where not exists (
  select 1 from expertos_sessions s where s.title = v.title and s.source = 'Programa'
);
