-- ═══════════════════════════════════════════════════════════════════════════
-- EXP-001 — Expertos en el Negocio: link de reunión, compromisos y biblia de dudas
-- ═══════════════════════════════════════════════════════════════════════════

alter table expertos_sessions
  add column if not exists meeting_url text,                              -- link de Meet/Zoom para unirse en vivo
  add column if not exists compromisos jsonb not null default '[]'::jsonb, -- [{item, responsable, hecho}]
  add column if not exists faq jsonb not null default '[]'::jsonb;        -- [{pregunta, respuesta}] — biblia de dudas resueltas
