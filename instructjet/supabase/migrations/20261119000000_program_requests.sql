-- Business Support Program: participants ask for a helper/worker or for
-- funding/investment help. Admins approve or reject in the dashboard and the
-- participant is emailed the decision.
-- Run with `npm run supabase:push` or paste into the Supabase SQL editor.

create table if not exists public.program_requests (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.program_participants(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('helper', 'funding')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'withdrawn')),
  details jsonb not null default '{}'::jsonb,
  admin_message text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.users(id) on delete set null,
  decision_email_sent boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists program_requests_status_idx on public.program_requests (status, created_at desc);
create index if not exists program_requests_user_idx on public.program_requests (user_id, created_at desc);

-- Only touched through API routes using the service role.
alter table public.program_requests enable row level security;
