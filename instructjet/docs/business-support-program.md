# Business Support Program + Admin Dashboard

## Setup checklist

1. **Run the migration first**: `supabase/migrations/20261107000000_business_program_admin.sql`
   (`npm run supabase:push` or paste it into the Supabase SQL editor). Login reads
   `users.role` / `users.is_active`, so deploy the code **after** the migration.
2. **Make yourself admin**:
   `update public.users set role = 'admin' where email = 'you@example.com';`
3. **Vercel environment variables**

   | Variable | Purpose |
   | --- | --- |
   | `PROGRAM_CRON_SECRET` | Shared secret for the Apps Script triggers (any long random string) |
   | `TAVILY_PROGRAM_API_KEY` | Tavily key used only for the program scrape |
   | `LANGSEARCH_API_KEY` | Optional fallback search provider |
   | `PROGRAM_SEARCH_PROVIDER` | Optional: `langsearch` to try LangSearch first |
   | `PROGRAM_DISCORD_URL` | Optional fallback; the Discord link is normally set in Admin → Overview |
   | `NEXT_PUBLIC_PADDLE_PROGRAM_PRICE_ID` | Optional; defaults to `pri_01m6v3kbz7jbtpvnxjnjbvbybr` |
| `GAS_PROGRAM_EMAIL_URLS` | Apps Script web app URLs for program emails, comma separated. Failover loops through all of them (see below). Defaults to `GAS_OTP_URL` |

   Already used and required: `DEEPSEEK_KEY` (cleans scraped results; heuristics are used
   without it), `GAS_OTP_URL` (emails go through the Apps Script `send_email` action),
   `PADDLE_API_KEY`, `PADDLE_ENVIRONMENT`, `NEXT_PUBLIC_APP_URL`.
4. **Paddle**: the program price must exist in the same environment as `PADDLE_ENVIRONMENT`
   (a production price will not load in sandbox). The `/leadership` page reads the amount
   and billing interval from Paddle, cached for 1 hour.
5. **Google Apps Script**: follow the header of `google-apps-script/program-triggers.gs`.
   Daily emails at 08:00, catalog scrape every Sunday at 20:00 (script time zone).
6. In **Admin → Overview**, set the Discord invite URL, then add lessons in
   **Admin → Crash-course lessons**, and click **Run catalog scrape now** once to fill the catalog.

## How it works

- **Who sees the subscribe button**: `/leadership` in English for visitors outside Indonesia
  (Vercel `x-vercel-ip-country`). Indonesian visitors and `?lang=id` keep the Rp150.000
  application form. Enroll those participants manually in Admin → Program participants
  (this also grants Premium for 3 months).
- **Checkout**: `POST /api/paddle/create-subscription` with `{ plan: 'business_program' }`.
  The Paddle webhook (`subscription.created`) recognises the program price, sets
  `plan_tier = 'premium'` (monthly tokens and every Premium feature) and
  `subscription_plan = 'business_program'`, and creates the `program_participants` row.
  Checkout returns to `/leadership-info?welcome=1`, which waits for the webhook.
- **/leadership-info**: business profile (drives matching), capstone (opens 90 days after
  `subscribed_at` or when the admin unlocks it), Discord link and email opt-out.
- **Help requests** (`/leadership-info?tab=requests`, migration
  `20261119000000_program_requests.sql`): active participants request a **helper / worker**
  (toggle; role, what they need help with, skills, commitment, work mode, wage range +
  currency + period, or *Volunteer / unpaid*, start date) or **funding / investment** (type, amount, use of funds,
  traction, equity, pitch deck). Every active admin user, plus `PROGRAM_ADMIN_EMAILS`
  (optional, comma separated), is emailed a summary with a link to **Admin → Help requests**.
  There the admin approves or disapproves; the message box starts with the default text
  for that request type and decision and can be edited per request. The defaults are edited
  in **Admin → Help requests → ⚙ Default messages** (saved in `program_settings.request_messages`,
  migration `20261119010000_request_default_messages.sql`); blank ones fall back to the
  built-in `DEFAULT_DECISION_MESSAGE` in `src/lib/program/requests.ts`. The participant is emailed the decision
  and message (untick "Email the participant" to skip), and also sees it on their page.
  Participants can withdraw pending requests; at most 5 can be pending at once.
- **Capstone → claim**: draft → submitted → claimed (shows in Admin → Capstones as
  "Eligible") → approved / needs revision / Claude Cowork granted.
- **Daily email** (one per participant per day, only if something is due):
  welcome (first email), Discord invite (first N emails), next lesson in rotation
  (every N days), top-k catalog picks not sent before (every N days, default 7).
- **Matching** (`src/lib/program/matching.ts`): business category, the opportunity types
  they asked for, funding interest, city/country and event format, keyword overlap with
  their profile text, and how soon the event is. Items scoring 0 or below are never sent.
- **Weekly scrape** (`src/lib/program/scrape.ts`): queries tailored to the most common
  categories and locations among active participants, plus extra queries from settings.
  Past events and scraped items not seen for `scraped_ttl_days` are deactivated.
  Items you deactivate stay deactivated even if they are found again.

- **Premium expiry for manual grants**: every daily run downgrades users who have
  `plan_tier = 'premium'`, no `subscription_id` and a `current_period_end` in the past
  (admin grants and manual program enrollments). Paddle subscribers are never touched
  here: when their payments keep failing, Paddle cancels the subscription after its
  retry period and the `subscription.canceled` webhook downgrades them. Program
  membership is not changed by expiry; set the participant status in the admin.

## Email quota and failover

Gmail allows about 100 recipients/day per free account (1,500 on Google Workspace).
To send more, deploy the same Apps Script (it needs the `send_email` action) from
several Google accounts and list every web app URL, comma separated:

```
GAS_PROGRAM_EMAIL_URLS=https://script.google.com/macros/s/AAA/exec,https://script.google.com/macros/s/BBB/exec
```

Each program email is sent through the current script. If that fails (quota used up,
script down), the app calls `POST /api/email-script-management` (authorised with
`PROGRAM_CRON_SECRET`), which loops through every script until one sends it; network
and 5xx errors get a second try. The script that worked becomes the current one, so
each account is used until its quota runs out. If even that endpoint cannot be reached,
the same loop runs in-process. Only when every script fails is the email logged as
failed.

Include the `GAS_OTP_URL` deployment in the list if you want it to share the load.
OTP, password reset, contact and guide-reminder emails always use `GAS_OTP_URL`,
because OTP codes are stored inside that one script.
