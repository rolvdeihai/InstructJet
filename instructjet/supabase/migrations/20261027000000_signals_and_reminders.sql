-- Submission evaluations as team signals + daily worker reminders.
-- Run after 20261022000000_team_insights.sql.

-- Worker submissions (with their AI score) also feed team insights.
alter table public.guide_team_signals drop constraint if exists guide_team_signals_kind_check;
alter table public.guide_team_signals
  add constraint guide_team_signals_kind_check check (kind in ('question', 'feedback', 'submission'));

-- Author opts in per guide.
alter table public.guides
  add column if not exists reminders_enabled boolean not null default false,
  add column if not exists reminder_message text;

-- One row per worker to remind about a guide.
create table if not exists public.guide_reminders (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  worker_email text not null,
  worker_name text,
  deadline date not null,
  status text not null default 'active' check (status in ('active', 'completed', 'stopped', 'expired')),
  unsubscribe_token uuid not null default gen_random_uuid(),
  last_sent_on date,
  send_count integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (guide_id, worker_email)
);
create index if not exists guide_reminders_due_idx
  on public.guide_reminders (status, last_sent_on);

-- Only touched through API routes using the service role.
alter table public.guide_reminders enable row level security;
