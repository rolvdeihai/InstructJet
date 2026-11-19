-- Admin-editable default approve / disapprove messages for help requests.
-- { "helper": { "approved": "...", "rejected": "..." }, "funding": { ... } }
-- Missing or blank entries fall back to the built-in text in src/lib/program/requests.ts.
alter table public.program_settings
  add column if not exists request_messages jsonb not null default '{}'::jsonb;
