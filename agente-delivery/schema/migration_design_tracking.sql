-- Migration: design_tracking table for Product Designer role
-- Additive only — does not modify any existing tables

create table if not exists design_tracking (
  id             uuid primary key default gen_random_uuid(),
  tracking_id    text unique not null,

  -- References to existing PM data (read-only pointers)
  project_code   text not null,
  epic_id        text,
  story_id       text,

  -- Design pipeline status
  design_status  text check (design_status in (
    'Sin iniciar',
    'Wireframes',
    'Prototipo',
    'Design Review',
    'Handoff',
    'Done',
    'Bloqueado'
  )) default 'Sin iniciar',

  -- Design artifacts
  figma_link     text,
  prototype_link text,

  -- Context
  design_notes   text,
  open_questions text,
  design_decisions text,

  -- Ownership
  pd_owner       text default 'Michelle',
  priority       text check (priority in ('Alta','Media','Baja')),

  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
