-- PM Operating System — Supabase schema
-- Apply once via Supabase dashboard (SQL Editor) or CLI: supabase db push
--
-- Sections:
--   1. Core tables (projects, teams, meetings, transcripts)
--   2. Memory tables (draft_insights, approved_context)
--   3. Research tables (research_documents)
--   4. Execution tables (okrs, capabilities, features, user_stories, decisions, risks, followups, milestones)
--   5. Dropi-specific tables (epics, subtasks)

create table if not exists projects (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  project_code text,
  status       text check (status in ('Discovery','Planned','In Progress','Blocked','Done','Archived')),
  business_area text,
  owner        text,
  team         text,
  summary      text,
  created_at   timestamptz default now()
);

create table if not exists teams (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  lead       text,
  area       text,
  notes      text,
  created_at timestamptz default now()
);

create table if not exists meetings (
  id           uuid primary key default gen_random_uuid(),
  meeting_id   text unique not null,
  project      text,
  team         text,
  meeting_type text check (meeting_type in ('ASIS','TOBE','Follow-up','Planning','Decision','Risk','Other')),
  meeting_date timestamptz,
  participants text,
  source       text,
  notes        text,
  created_at   timestamptz default now()
);

create table if not exists transcripts (
  id             uuid primary key default gen_random_uuid(),
  transcript_id  text unique not null,
  meeting_id     text references meetings(meeting_id),
  project        text,
  team           text,
  raw_transcript text,
  source_url     text,
  immutable      boolean default true,
  imported_at    timestamptz default now()
);

create table if not exists draft_insights (
  id           uuid primary key default gen_random_uuid(),
  draft_id     text unique not null,
  project      text,
  meeting_id   text,
  draft_type   text check (draft_type in ('Business Context','ASIS','TOBE','Capability','Feature','User Story','Risk','Decision','Summary','Open Question')),
  title        text,
  content      text,
  status       text check (status in ('Draft','In Review','Approved Candidate','Rejected','Archived')) default 'Draft',
  version_hint int,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create table if not exists approved_context (
  id               uuid primary key default gen_random_uuid(),
  context_id       text unique not null,
  project          text,
  context_type     text check (context_type in ('Business Context','ASIS','TOBE','Capability','Feature','User Story','Risk','Decision','Operating Rule')),
  title            text,
  approved_content text,
  version          int default 1,
  status           text check (status in ('Active','Superseded','Archived')) default 'Active',
  source_references text,
  approved_by      text,
  approved_at      timestamptz,
  created_at       timestamptz default now()
);

create table if not exists research_documents (
  id               uuid primary key default gen_random_uuid(),
  research_id      text unique not null, -- RB-XXX
  title            text not null,
  research_date    timestamptz,
  initiative       text,
  segment          text,
  journey_stage    text,
  source_type      text check (source_type in ('transcripcion','encuesta','social_listening','benchmark','otro')),
  confidence_level text check (confidence_level in ('Alto','Medio','Bajo')),
  tags             text,
  content          text,
  file_path        text,
  status           text check (status in ('Draft','Published','Superseded')) default 'Published',
  created_at       timestamptz default now()
);

create table if not exists okrs (
  id           uuid primary key default gen_random_uuid(),
  okr_id       text unique not null,
  project      text,
  team         text,
  objective    text,
  key_result   text,
  metric_name  text,
  baseline     numeric,
  target       numeric,
  current_value numeric,
  due_date     timestamptz,
  status       text check (status in ('On Track','At Risk','Off Track','Done')),
  created_at   timestamptz default now()
);

create table if not exists capabilities (
  id             uuid primary key default gen_random_uuid(),
  capability_id  text unique not null,
  project        text,
  name           text,
  purpose        text,
  scope          text,
  expected_outcome text,
  exclusions     text,
  status         text check (status in ('Proposed','Approved','In Progress','Done','Dropped')) default 'Proposed',
  version        text,
  source_references text,
  created_at     timestamptz default now()
);

create table if not exists features (
  id           uuid primary key default gen_random_uuid(),
  feature_id   text unique not null,
  project      text,
  capability   text,
  name         text,
  description  text,
  priority     text check (priority in ('High','Medium','Low')),
  status       text check (status in ('Proposed','Approved','In Progress','Done','Dropped')) default 'Proposed',
  created_at   timestamptz default now()
);

create table if not exists user_stories (
  id                  uuid primary key default gen_random_uuid(),
  story_id            text unique not null,
  project             text,
  feature             text,
  capability_id       text,
  capability_name     text,
  source_epic         text,
  original_key        text,
  title               text,
  type                text,
  narrative           text,
  acceptance_criteria text,
  scope_treatment     text,
  notes               text,
  status              text check (status in ('Draft','Approved','Planned','In Progress','Done','Dropped','Active','Merged','Scope Review','Needs Review')) default 'Draft',
  sort_order          int,
  created_at          timestamptz default now()
);

create table if not exists decisions (
  id            uuid primary key default gen_random_uuid(),
  decision_id   text unique not null,
  project       text,
  title         text,
  decision      text,
  rationale     text,
  decision_date timestamptz,
  status        text check (status in ('Active','Superseded','Rejected')) default 'Active',
  created_at    timestamptz default now()
);

create table if not exists risks (
  id          uuid primary key default gen_random_uuid(),
  risk_id     text unique not null,
  project     text,
  title       text,
  description text,
  impact      text check (impact in ('High','Medium','Low')),
  probability text check (probability in ('High','Medium','Low')),
  mitigation  text,
  status      text check (status in ('Open','Watching','Mitigated','Closed')) default 'Open',
  created_at  timestamptz default now()
);

create table if not exists followups (
  id          uuid primary key default gen_random_uuid(),
  followup_id text unique not null,
  project     text,
  team        text,
  title       text,
  commitment  text,
  owner       text,
  due_date    timestamptz,
  status      text check (status in ('Open','In Progress','Done','Delayed','Cancelled')) default 'Open',
  created_at  timestamptz default now()
);

create table if not exists milestones (
  id           uuid primary key default gen_random_uuid(),
  milestone_id text unique not null,
  project      text,
  name         text,
  description  text,
  target_date  timestamptz,
  status       text check (status in ('Upcoming','On Track','At Risk','Missed','Done')) default 'Upcoming',
  created_at   timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Dropi-specific tables
-- ─────────────────────────────────────────────

create table if not exists epics (
  id                  uuid primary key default gen_random_uuid(),
  epic_id             text unique not null,
  -- title format: [product_code]: [name]_[country]_[users_affected]
  product_code        text check (product_code in ('DROPI','DROPI APP','ADMIN','CAS')),
  name                text not null,
  country             text,
  users_affected      text,
  full_title          text generated always as (
                        product_code || ': ' || name || '_' || coalesce(country,'') || '_' || coalesce(users_affected,'')
                      ) stored,
  -- description sections
  context             text,
  problem_description text,
  why_important       text,
  affected_user_types text,
  relevant_data       text,
  what_we_seek        text,
  phases              text,
  success_criteria    text,
  metrics             text,
  target_audience     text,
  affects_white_labels boolean default false,
  -- documentation
  kickoff_link        text,
  general_flow_link   text,
  figma_link          text,
  related_docs        text,
  -- meta
  project             text,
  status              text check (status in ('Draft','Active','In Progress','Done','Archived')) default 'Draft',
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create table if not exists subtasks (
  id            uuid primary key default gen_random_uuid(),
  subtask_id    text unique not null,
  -- title format: [label_type] [product_code]: [name]
  label_type    text check (label_type in ('UX','UI','Frontend','Backend','DBA','QA','Legal','Lanzamiento','Producto')),
  product_code  text check (product_code in ('DROPI','DROPI APP','ADMIN','CAS')),
  name          text not null,
  full_title    text generated always as (
                  '[' || coalesce(label_type,'') || '] ' || coalesce(product_code,'') || ': ' || name
                ) stored,
  description   text,
  steps         text,
  parent_type   text check (parent_type in ('epic','historia','producto')),
  parent_id     text,
  status        text check (status in ('To Do','In Progress','Done','Blocked')) default 'To Do',
  assignee      text,
  created_at    timestamptz default now()
);

-- Extend user_stories with Dropi-specific fields
alter table user_stories
  add column if not exists label_type    text check (label_type in ('UX','UI','Frontend','Backend','DBA','QA','Legal','Lanzamiento')),
  add column if not exists product_code  text check (product_code in ('DROPI','DROPI APP','ADMIN','CAS')),
  add column if not exists epic_id       text,
  add column if not exists user_role     text,
  add column if not exists user_action   text,
  add column if not exists user_result   text,
  add column if not exists process_description text,
  add column if not exists user_flow     text,
  add column if not exists additional_conditions text,
  add column if not exists definition_of_done    text,
  add column if not exists design_system_version text check (design_system_version in ('1.0','2.0')),
  add column if not exists is_redesign   boolean default false,
  add column if not exists resolutions   text;

-- ─────────────────────────────────────────────
-- Integration tracking (Drive ↔ JIRA ↔ Confluence)
-- ─────────────────────────────────────────────

-- Track synced Google Drive documents
create table if not exists drive_sync_log (
  id               uuid primary key default gen_random_uuid(),
  drive_file_id    text unique not null,
  file_name        text not null,
  mime_type        text,
  doc_type         text,          -- kickoff, pitch, research, epic, etc.
  local_path       text,
  drive_modified_at timestamptz,
  synced_at        timestamptz default now(),
  project          text,          -- linked project (if identified)
  metadata_json    jsonb          -- full metadata sidecar
);

-- Add JIRA + Confluence traceability to epics
alter table epics
  add column if not exists jira_key          text,   -- e.g. DROPI-1234
  add column if not exists confluence_page_id text,  -- Confluence page ID
  add column if not exists drive_file_id     text;   -- Source Drive doc

-- Add JIRA + Confluence traceability to user_stories
alter table user_stories
  add column if not exists jira_key          text,
  add column if not exists confluence_page_id text,
  add column if not exists drive_file_id     text;
