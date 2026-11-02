-- Team profile + team insights / SOP optimization suggestions.
-- Run with `npm run supabase:push` or paste into the Supabase SQL editor.

-- Optional questionnaire answered before generating a guide.
alter table public.guides
  add column if not exists team_profile jsonb;

-- Every question / feedback a team member sends about a guide.
create table if not exists public.guide_team_signals (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  session_id text,
  kind text not null check (kind in ('question', 'feedback')),
  content text not null,
  answer_excerpt text,
  analyzed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists guide_team_signals_guide_idx
  on public.guide_team_signals (guide_id, analyzed_at);

-- Latest AI-generated comprehension profile for a guide's team.
create table if not exists public.guide_team_insights (
  guide_id uuid primary key references public.guides(id) on delete cascade,
  profile jsonb not null,
  signals_analyzed integer not null default 0,
  updated_at timestamptz not null default now()
);

-- SOP change suggestions, reviewed by the guide owner like pull requests.
create table if not exists public.guide_suggestions (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  title text not null,
  rationale text not null,
  proposed_change text not null,
  section text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  evidence_count integer not null default 1,
  status text not null default 'pending' check (status in ('pending', 'dismissed', 'applied')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index if not exists guide_suggestions_guide_idx
  on public.guide_suggestions (guide_id, status);

-- These tables are only touched through API routes using the service role.
alter table public.guide_team_signals enable row level security;
alter table public.guide_team_insights enable row level security;
alter table public.guide_suggestions enable row level security;
