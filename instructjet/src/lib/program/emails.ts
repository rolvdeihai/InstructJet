// src/lib/program/emails.ts
//
// Daily participant email. One email per participant per day, built from:
//  - welcome block (first email)
//  - InstructJet Discord block (first `discord_intro_emails` emails)
//  - next leadership crash-course lesson (every `lesson_every_days`)
//  - weekly top-k catalog picks matched to their profile (every `digest_every_days`)
// Nothing due → nothing sent. Emails go out through the Google Apps Script
// `send_email` action, with failover across scripts (see lib/email-transport).
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendProgramEmail } from '@/lib/email-transport';
import { CATALOG_TYPES, isProfileComplete, type ProgramProfile } from './config';
import { topMatches, type CatalogItem } from './matching';
import { appUrl, getProgramSettings, mapLimit, type ProgramSettings } from './server';

interface Participant {
  id: string;
  user_id: string;
  status: string;
  profile: ProgramProfile;
  emails_sent: number;
  last_email_on: string | null;
  last_lesson_at: string | null;
  last_digest_at: string | null;
  lesson_cursor: number;
  email_opt_out: boolean;
  unsubscribe_token: string;
  subscribed_at: string;
  users?: { email: string; full_name: string | null; is_active: boolean } | null;
}

interface Lesson {
  id: string;
  title: string;
  summary: string | null;
  body: string | null;
  url: string | null;
}

const todayUtc = () => new Date().toISOString().slice(0, 10);
const daysSince = (iso: string | null) => (iso ? (Date.now() - new Date(iso).getTime()) / 86_400_000 : Infinity);

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nl2br = (s: string) => esc(s).replace(/\n{2,}/g, '</p><p style="margin:0 0 12px">').replace(/\n/g, '<br>');

const COPY = {
  en: {
    hi: (n: string) => `Hi ${n},`,
    welcomeTitle: 'Welcome to the Business Support Program',
    welcomeBody: 'Over the next months you will get leadership lessons, hand-picked events, investor opportunities, free certified courses and communities matched to your business, right here in your inbox.',
    completeProfile: 'Tell us about your business so we can match opportunities to you',
    completeProfileCta: 'Complete your business profile',
    discordTitle: 'Join the InstructJet Discord community',
    discordBody: 'This is where the program happens: mentoring, peer support, booking 1:1 consultations, getting your basic website built and meeting other business owners. Please join today.',
    discordCta: 'Join the Discord',
    lessonTitle: 'Today’s leadership lesson',
    readMore: 'Read the full lesson',
    digestTitle: 'Your picks this week',
    digestBody: 'Selected for your business from this week’s events, investor opportunities, free certified courses and communities.',
    footer: 'You receive this because you are in the InstructJet Business Support Program.',
    manage: 'Edit your business profile',
    unsubscribe: 'Unsubscribe from program emails',
    subjectWelcome: 'Welcome to the Business Support Program',
    subjectDigest: (n: number) => `${n} opportunities picked for your business this week`,
    subjectLesson: (t: string) => `Leadership lesson: ${t}`,
    subjectDiscord: 'Join the InstructJet community on Discord',
    online: 'Online',
    free: 'Free',
  },
  id: {
    hi: (n: string) => `Halo ${n},`,
    welcomeTitle: 'Selamat datang di Business Support Program',
    welcomeBody: 'Selama beberapa bulan ke depan Anda akan menerima pelajaran kepemimpinan, acara pilihan, peluang investor, kursus bersertifikat gratis, dan komunitas yang cocok dengan bisnis Anda, langsung di inbox Anda.',
    completeProfile: 'Ceritakan tentang bisnis Anda agar kami bisa mencocokkan peluang yang tepat',
    completeProfileCta: 'Lengkapi profil bisnis Anda',
    discordTitle: 'Gabung komunitas Discord InstructJet',
    discordBody: 'Di sinilah program berjalan: mentoring, dukungan sesama pemilik bisnis, booking konsultasi 1:1, pembuatan website dasar, dan bertemu pemilik bisnis lain. Silakan bergabung hari ini.',
    discordCta: 'Gabung Discord',
    lessonTitle: 'Pelajaran kepemimpinan hari ini',
    readMore: 'Baca pelajaran lengkap',
    digestTitle: 'Pilihan untuk Anda minggu ini',
    digestBody: 'Dipilih untuk bisnis Anda dari acara, peluang investor, kursus bersertifikat gratis, dan komunitas minggu ini.',
    footer: 'Anda menerima email ini karena terdaftar di InstructJet Business Support Program.',
    manage: 'Ubah profil bisnis Anda',
    unsubscribe: 'Berhenti menerima email program',
    subjectWelcome: 'Selamat datang di Business Support Program',
    subjectDigest: (n: number) => `${n} peluang pilihan untuk bisnis Anda minggu ini`,
    subjectLesson: (t: string) => `Pelajaran kepemimpinan: ${t}`,
    subjectDiscord: 'Gabung komunitas InstructJet di Discord',
    online: 'Online',
    free: 'Gratis',
  },
};

const TYPE_LABEL: Record<string, string> = Object.fromEntries(CATALOG_TYPES.map((t) => [t.value, t.label]));

function button(href: string, label: string, color = '#d02752') {
  return `<a href="${esc(href)}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px;font-size:14px">${esc(label)}</a>`;
}

function section(title: string, inner: string) {
  return `<tr><td style="padding:24px 28px;border-top:1px solid #eee"><h2 style="margin:0 0 12px;font-size:18px;color:#0f172a">${esc(title)}</h2>${inner}</td></tr>`;
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
  lessonId: string | null;
  catalogIds: string[];
  includedDiscord: boolean;
  advanceLesson: boolean;
  sentDigest: boolean;
}

/** Returns null when nothing is due for this participant today. */
export function buildParticipantEmail(
  p: Participant,
  ctx: { settings: ProgramSettings; lessons: Lesson[]; catalog: CatalogItem[]; sentCatalogIds: Set<string>; force?: boolean }
): BuiltEmail | null {
  const { settings, lessons, catalog } = ctx;
  const lang = p.profile?.language === 'id' ? 'id' : 'en';
  const t = COPY[lang];
  const name = p.users?.full_name?.split(' ')[0] || p.profile?.business_name || 'there';
  const base = appUrl();
  const infoUrl = `${base}/leadership-info`;
  const unsubUrl = `${base}/api/program/unsubscribe?token=${p.unsubscribe_token}`;

  const first = p.emails_sent === 0;
  const includeDiscord = !!settings.discord_url && p.emails_sent < (settings.discord_intro_emails ?? 3);
  const lessonDue = lessons.length > 0 && (first || ctx.force || daysSince(p.last_lesson_at) >= (settings.lesson_every_days || 1) - 0.1);
  const lesson = lessonDue ? lessons[p.lesson_cursor % lessons.length] : null;
  const digestDue = first || daysSince(p.last_digest_at) >= (settings.digest_every_days || 7) - 0.25;
  const picks = digestDue ? topMatches(catalog, p.profile || {}, settings.top_k || 5, ctx.sentCatalogIds) : [];

  if (!first && !includeDiscord && !lesson && picks.length === 0) return null;

  const blocks: string[] = [];
  const text: string[] = [t.hi(name), ''];

  if (first) {
    blocks.push(section(t.welcomeTitle, `<p style="margin:0 0 12px;color:#334155;line-height:1.6">${esc(t.welcomeBody)}</p>`));
    text.push(t.welcomeTitle, t.welcomeBody, '');
  }
  if (!isProfileComplete(p.profile)) {
    blocks.push(section(t.completeProfile, `<p style="margin:0">${button(infoUrl, t.completeProfileCta)}</p>`));
    text.push(`${t.completeProfile}: ${infoUrl}`, '');
  }
  if (includeDiscord) {
    blocks.push(
      `<tr><td style="padding:24px 28px;border-top:1px solid #eee;background:#eef2ff"><h2 style="margin:0 0 8px;font-size:18px;color:#3730a3">${esc(t.discordTitle)}</h2><p style="margin:0 0 16px;color:#334155;line-height:1.6">${esc(t.discordBody)}</p>${button(settings.discord_url!, t.discordCta, '#5865F2')}</td></tr>`
    );
    text.push(t.discordTitle, t.discordBody, settings.discord_url!, '');
  }
  if (lesson) {
    const body = lesson.body ? `<p style="margin:0 0 12px;color:#334155;line-height:1.6">${nl2br(lesson.body)}</p>` : '';
    const summary = lesson.summary ? `<p style="margin:0 0 12px;color:#475569;font-style:italic">${esc(lesson.summary)}</p>` : '';
    const link = lesson.url ? `<p style="margin:12px 0 0">${button(lesson.url, t.readMore, '#0f172a')}</p>` : '';
    blocks.push(section(`${t.lessonTitle}: ${lesson.title}`, summary + body + link));
    text.push(`${t.lessonTitle}: ${lesson.title}`, lesson.summary || '', lesson.body || '', lesson.url || '', '');
  }
  if (picks.length) {
    const rows = picks
      .map((i) => {
        const meta = [
          TYPE_LABEL[i.type] || i.type,
          i.event_date ? new Date(`${i.event_date}T00:00:00Z`).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : null,
          i.is_online ? t.online : i.location,
          i.certification,
          i.is_free ? t.free : null,
        ].filter(Boolean);
        return `<div style="padding:14px 0;border-bottom:1px solid #f1f5f9"><a href="${esc(i.url)}" style="font-weight:600;color:#d02752;text-decoration:none;font-size:15px">${esc(i.title)}</a><div style="font-size:12px;color:#64748b;margin:4px 0">${esc(meta.join(' · '))}</div>${i.description ? `<div style="font-size:14px;color:#334155;line-height:1.5">${esc(i.description)}</div>` : ''}</div>`;
      })
      .join('');
    blocks.push(section(t.digestTitle, `<p style="margin:0 0 4px;color:#475569">${esc(t.digestBody)}</p>${rows}`));
    text.push(t.digestTitle, ...picks.map((i) => `- ${i.title} (${TYPE_LABEL[i.type] || i.type}): ${i.url}`), '');
  }

  const subject = first
    ? t.subjectWelcome
    : picks.length
      ? t.subjectDigest(picks.length)
      : lesson
        ? t.subjectLesson(lesson.title)
        : t.subjectDiscord;

  const html = `<!doctype html><html><body style="margin:0;background:#f6f5f2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f2;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0f172a;padding:20px 28px;color:#fcd34d;font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:700">InstructJet · Business Support Program</td></tr>
<tr><td style="padding:24px 28px 8px;color:#0f172a;font-size:16px">${esc(t.hi(name))}</td></tr>
${blocks.join('\n')}
<tr><td style="padding:20px 28px;border-top:1px solid #eee;font-size:12px;color:#94a3b8;line-height:1.6">${esc(t.footer)}<br><a href="${esc(infoUrl)}" style="color:#64748b">${esc(t.manage)}</a> · <a href="${esc(unsubUrl)}" style="color:#64748b">${esc(t.unsubscribe)}</a></td></tr>
</table></td></tr></table></body></html>`;

  text.push('---', t.footer, `${t.manage}: ${infoUrl}`, `${t.unsubscribe}: ${unsubUrl}`);

  return {
    subject,
    html,
    text: text.join('\n'),
    lessonId: lesson?.id || null,
    catalogIds: picks.map((p) => p.id),
    includedDiscord: includeDiscord,
    advanceLesson: !!lesson,
    sentDigest: digestDue,
  };
}

async function loadContext() {
  const [settings, lessonsRes, catalogRes] = await Promise.all([
    getProgramSettings(),
    supabaseAdmin.from('program_lessons').select('id, title, summary, body, url').eq('is_active', true).order('sort_order').order('created_at'),
    supabaseAdmin.from('program_catalog').select('*').eq('is_active', true),
  ]);
  return { settings, lessons: (lessonsRes.data || []) as Lesson[], catalog: (catalogRes.data || []) as CatalogItem[] };
}

async function sentCatalogIdsFor(participantId: string) {
  const { data } = await supabaseAdmin
    .from('program_email_log')
    .select('catalog_ids')
    .eq('participant_id', participantId)
    .eq('status', 'sent');
  return new Set((data || []).flatMap((r) => r.catalog_ids || []));
}

const PARTICIPANT_SELECT = '*, users!inner(email, full_name, is_active)';

async function sendToParticipant(
  p: Participant,
  ctx: Awaited<ReturnType<typeof loadContext>>,
  kind: 'daily' | 'manual'
): Promise<'sent' | 'failed' | 'skipped'> {
  const email = p.users?.email;
  if (!email) return 'skipped';
  const built = buildParticipantEmail(p, { ...ctx, sentCatalogIds: await sentCatalogIdsFor(p.id), force: kind === 'manual' });
  const today = todayUtc();
  if (!built) {
    // Mark the day as handled so the batch loop moves on
    await supabaseAdmin.from('program_participants').update({ last_email_on: today }).eq('id', p.id);
    return 'skipped';
  }

  const ok = await sendProgramEmail({ to: email, subject: built.subject, htmlBody: built.html, textBody: built.text });
  const nowIso = new Date().toISOString();
  await supabaseAdmin.from('program_email_log').insert({
    participant_id: p.id,
    email,
    kind,
    subject: built.subject,
    lesson_id: built.lessonId,
    catalog_ids: ok ? built.catalogIds : [],
    included_discord: built.includedDiscord,
    status: ok ? 'sent' : 'failed',
    error: ok ? null : 'Every Apps Script failed',
  });

  const update: Record<string, unknown> = { last_email_on: today, updated_at: nowIso };
  if (ok) {
    update.emails_sent = p.emails_sent + 1;
    if (built.advanceLesson) {
      update.lesson_cursor = p.lesson_cursor + 1;
      update.last_lesson_at = nowIso;
    }
    if (built.sentDigest) update.last_digest_at = nowIso;
  }
  await supabaseAdmin.from('program_participants').update(update).eq('id', p.id);
  return ok ? 'sent' : 'failed';
}

/**
 * Processes up to `limit` participants who have not been handled today.
 * The Apps Script calls this repeatedly while `remaining > 0`, so a large
 * program never runs into the serverless time limit.
 */
export async function runDailyProgramEmails(limit = 20) {
  const ctx = await loadContext();
  if (ctx.settings.paused) return { paused: true, processed: 0, sent: 0, failed: 0, skipped: 0, remaining: 0 };

  const today = todayUtc();
  const { data, error } = await supabaseAdmin
    .from('program_participants')
    .select(PARTICIPANT_SELECT)
    .eq('status', 'active')
    .eq('email_opt_out', false)
    .eq('users.is_active', true)
    .or(`last_email_on.is.null,last_email_on.lt.${today}`)
    .order('created_at')
    .limit(limit + 1);
  if (error) throw error;

  const due = (data || []) as Participant[];
  const batch = due.slice(0, limit);
  const results = await mapLimit(batch, 4, (p) => sendToParticipant(p, ctx, 'daily'));

  await supabaseAdmin.from('program_settings').update({ last_daily_run_at: new Date().toISOString() }).eq('id', 1);

  return {
    paused: false,
    processed: batch.length,
    sent: results.filter((r) => r === 'sent').length,
    failed: results.filter((r) => r === 'failed').length,
    skipped: results.filter((r) => r === 'skipped').length,
    remaining: due.length > limit ? 1 : 0,
  };
}

/** Admin "Send now" for one participant: sends today's email even if one already went out. */
export async function sendProgramEmailNow(participantId: string) {
  const ctx = await loadContext();
  const { data, error } = await supabaseAdmin.from('program_participants').select(PARTICIPANT_SELECT).eq('id', participantId).single();
  if (error || !data) throw new Error('Participant not found');
  return sendToParticipant(data as Participant, ctx, 'manual');
}

/** Preview of the next email for a participant (admin), without sending. */
export async function previewProgramEmail(participantId: string) {
  const ctx = await loadContext();
  const { data } = await supabaseAdmin.from('program_participants').select(PARTICIPANT_SELECT).eq('id', participantId).single();
  if (!data) return null;
  return buildParticipantEmail(data as Participant, { ...ctx, sentCatalogIds: await sentCatalogIdsFor(participantId), force: true });
}
