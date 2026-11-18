-- Business Support Program (paid via Paddle), participant emails, capstone
-- claims and the admin dashboard.
-- Run with `npm run supabase:push` or paste into the Supabase SQL editor
-- BEFORE deploying the code that uses it (auth reads users.role / is_active).

-- ─── Users: admin role, deactivation, which paid plan they are on ──────────
alter table public.users
  add column if not exists role text not null default 'user',
  add column if not exists is_active boolean not null default true,
  add column if not exists subscription_plan text;

alter table public.users drop constraint if exists users_role_check;
alter table public.users add constraint users_role_check check (role in ('user', 'admin'));

-- Make yourself admin (replace the email):
-- update public.users set role = 'admin' where email = 'you@example.com';

-- ─── Program participants ───────────────────────────────────────────────────
create table if not exists public.program_participants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  status text not null default 'active'
    check (status in ('active', 'paused', 'canceled', 'deactivated')),
  source text not null default 'paddle' check (source in ('paddle', 'manual')),
  subscription_id text,
  subscribed_at timestamptz not null default now(),
  -- admin override: open the capstone before the 3-month mark
  capstone_unlocked boolean not null default false,
  profile jsonb not null default '{}'::jsonb,
  profile_completed_at timestamptz,
  -- email state
  emails_sent integer not null default 0,
  last_email_on date,
  last_lesson_at timestamptz,
  last_digest_at timestamptz,
  lesson_cursor integer not null default 0,
  email_opt_out boolean not null default false,
  unsubscribe_token uuid not null default gen_random_uuid(),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists program_participants_due_idx
  on public.program_participants (status, last_email_on);

-- ─── Capstone (unlocked after 3 months, used to claim Claude Cowork) ─────────
create table if not exists public.program_capstones (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null unique references public.program_participants(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'claimed', 'approved', 'rejected', 'fulfilled')),
  certificates jsonb not null default '[]'::jsonb,  -- [{ name, issuer, url }]
  answers jsonb not null default '{}'::jsonb,       -- { questionId: answer }
  project jsonb not null default '{}'::jsonb,       -- { title, problem, solution, outcome, link }
  submitted_at timestamptz,
  claimed_at timestamptz,
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Catalog: events, investor events, courses, communities ─────────────────
create table if not exists public.program_catalog (
  id uuid primary key default gen_random_uuid(),
  type text not null
    check (type in ('networking_event', 'investor_event', 'course', 'community', 'other')),
  title text not null,
  description text,
  url text not null unique,
  category text not null default 'general',
  tags text[] not null default '{}',
  location text,
  is_online boolean not null default false,
  event_date date,
  platform text,        -- telegram / discord / whatsapp / coursera / ...
  provider text,
  is_free boolean not null default true,
  certification text,
  source text not null default 'manual' check (source in ('manual', 'scraped')),
  is_active boolean not null default true,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists program_catalog_active_idx
  on public.program_catalog (is_active, type);

-- ─── Leadership crash-course lessons (written by the admin, rotated) ────────
create table if not exists public.program_lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  body text,
  url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Every email sent to a participant ──────────────────────────────────────
create table if not exists public.program_email_log (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.program_participants(id) on delete cascade,
  email text not null,
  kind text not null default 'daily' check (kind in ('daily', 'manual', 'test')),
  subject text not null,
  lesson_id uuid references public.program_lessons(id) on delete set null,
  catalog_ids uuid[] not null default '{}',
  included_discord boolean not null default false,
  status text not null check (status in ('sent', 'failed')),
  error text,
  sent_at timestamptz not null default now()
);
create index if not exists program_email_log_participant_idx
  on public.program_email_log (participant_id, sent_at desc);

-- ─── Singleton settings row ────────────────────────────────────────────────
create table if not exists public.program_settings (
  id integer primary key default 1 check (id = 1),
  paused boolean not null default false,
  discord_url text,
  discord_intro_emails integer not null default 3,
  lesson_every_days integer not null default 1,
  digest_every_days integer not null default 7,
  top_k integer not null default 5,
  scraped_ttl_days integer not null default 21,
  extra_queries text[] not null default '{}',
  last_daily_run_at timestamptz,
  last_scrape_at timestamptz,
  last_scrape_result jsonb,
  updated_at timestamptz not null default now()
);
insert into public.program_settings (id) values (1) on conflict (id) do nothing;

-- Only touched through API routes using the service role.
alter table public.program_participants enable row level security;
alter table public.program_capstones enable row level security;
alter table public.program_catalog enable row level security;
alter table public.program_lessons enable row level security;
alter table public.program_email_log enable row level security;
alter table public.program_settings enable row level security;
