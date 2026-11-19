// src/lib/program/requests.ts
//
// Help requests from program participants: a helper / worker, or funding /
// investment help. Shared by the client form, the APIs and the admin tab.

export type RequestType = 'helper' | 'funding';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export const REQUEST_TYPE_LABEL: Record<RequestType, string> = {
  helper: 'Helper / worker',
  funding: 'Funding / investment',
};

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  pending: 'Pending review',
  approved: 'Approved',
  rejected: 'Not approved',
  withdrawn: 'Withdrawn',
};

/* ─── Helper / worker ─────────────────────────────────────────── */
export const HELPER_KINDS = [
  { value: 'helper', label: 'Helper', hint: 'Short-term or one-off help with a task or project' },
  { value: 'worker', label: 'Worker', hint: 'Someone to join your team on an ongoing basis' },
] as const;
export const COMMITMENTS = ['One-off task', 'Part-time', 'Full-time', 'Freelance / per project', 'Internship'] as const;
export const WORK_MODES = ['Remote', 'On-site', 'Hybrid'] as const;
export const UNPAID = 'Volunteer / unpaid';
export const WAGE_PERIODS = ['per hour', 'per day', 'per week', 'per month', 'per project', UNPAID] as const;
export const CURRENCIES = ['IDR', 'USD', 'SGD', 'MYR', 'EUR', 'AUD'] as const;

export interface HelperDetails {
  kind?: 'helper' | 'worker';
  role_title?: string;
  help_needed?: string;
  skills?: string;
  commitment?: string;
  work_mode?: string;
  location?: string;
  headcount?: string;
  wage_min?: string;
  wage_max?: string;
  wage_currency?: string;
  wage_period?: string;
  start_date?: string;
  notes?: string;
}

/* ─── Funding / investment ────────────────────────────────────── */
export const FUNDING_TYPES = [
  'Equity investment',
  'Loan / debt',
  'Grant',
  'Revenue-based financing',
  'Not sure yet — need advice',
] as const;

export interface FundingDetails {
  funding_type?: string;
  amount?: string;
  currency?: string;
  use_of_funds?: string;
  traction?: string;
  equity_offered?: string;
  raised_before?: string;
  pitch_deck_url?: string;
  timeline?: string;
  notes?: string;
}

export type RequestDetails = HelperDetails | FundingDetails;

/** Readable label/value pairs, for the admin view and emails. */
export function describeRequest(type: RequestType, d: Record<string, string | undefined>): { label: string; value: string }[] {
  const rows: [string, string | undefined][] =
    type === 'helper'
      ? [
          ['Looking for', d.kind === 'worker' ? 'Worker' : 'Helper'],
          ['Role', d.role_title],
          ['What they need help with', d.help_needed],
          ['Skills needed', d.skills],
          ['Commitment', d.commitment],
          ['Work mode', d.work_mode],
          ['Location', d.location],
          ['How many people', d.headcount],
          ['Wage offered', formatWage(d)],
          ['Start date', d.start_date],
          ['Other notes', d.notes],
        ]
      : [
          ['Funding type', d.funding_type],
          ['Amount', d.amount ? `${d.currency || ''} ${d.amount}`.trim() : undefined],
          ['Use of funds', d.use_of_funds],
          ['Traction', d.traction],
          ['Equity offered', d.equity_offered],
          ['Raised before', d.raised_before],
          ['Pitch deck', d.pitch_deck_url],
          ['Timeline', d.timeline],
          ['Other notes', d.notes],
        ];
  return rows.filter(([, v]) => v && v.trim()).map(([label, value]) => ({ label, value: value as string }));
}

export function formatWage(d: Record<string, string | undefined>) {
  if (d.wage_period === UNPAID) return UNPAID;
  if (!d.wage_min && !d.wage_max) return undefined;
  const range = d.wage_min && d.wage_max && d.wage_min !== d.wage_max ? `${d.wage_min} – ${d.wage_max}` : d.wage_min || d.wage_max;
  return [d.wage_currency, range, d.wage_period].filter(Boolean).join(' ');
}

export function requestTitle(type: RequestType, d: Record<string, string | undefined>) {
  if (type === 'helper') return `${d.kind === 'worker' ? 'Worker' : 'Helper'}: ${d.role_title || 'untitled'}`;
  return `Funding: ${d.funding_type || 'request'}${d.amount ? ` · ${d.currency || ''} ${d.amount}`.replace(/\s+/g, ' ') : ''}`;
}

export type Decision = 'approved' | 'rejected';
export type DecisionMessages = Record<RequestType, Record<Decision, string>>;

/** Built-in default messages. Admins can override them in Admin → Help requests → Default messages. */
export const DEFAULT_DECISION_MESSAGE: DecisionMessages = {
  helper: {
    approved:
      'Good news: we have approved your request for help. Our team will start looking for suitable candidates from the InstructJet community and our network, and we will contact you within the next few days with next steps. Please keep an eye on your email and Discord.',
    rejected:
      'Thank you for your request. Unfortunately we are not able to support this request right now. This is often because the role or wage is outside what our network can currently provide. You are welcome to adjust the details and submit a new request at any time.',
  },
  funding: {
    approved:
      'Good news: we have approved your funding request. Our team will review your business in more detail and introduce you to relevant investors, lenders or grant programs. We will contact you within the next few days to schedule a call, so please have your latest numbers and pitch deck ready.',
    rejected:
      'Thank you for your funding request. After reviewing it, we are not able to move forward with investor introductions at this stage. Keep building traction and using the program resources, and feel free to submit a new request when your business has progressed.',
  },
};

/** Built-in defaults with the admin's saved overrides (blank overrides are ignored). */
export function mergeDecisionMessages(saved: unknown): DecisionMessages {
  const s = (saved && typeof saved === 'object' ? saved : {}) as Record<string, Record<string, unknown> | undefined>;
  const pick = (t: RequestType, d: Decision) => {
    const v = s[t]?.[d];
    return typeof v === 'string' && v.trim() ? v : DEFAULT_DECISION_MESSAGE[t][d];
  };
  return {
    helper: { approved: pick('helper', 'approved'), rejected: pick('helper', 'rejected') },
    funding: { approved: pick('funding', 'approved'), rejected: pick('funding', 'rejected') },
  };
}
