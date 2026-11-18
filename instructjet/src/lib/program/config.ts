// src/lib/program/config.ts
//
// Business Support Program: shared constants and types. Safe to import from
// both client and server code (no secrets here).

/** Paddle price for the Business Support Program subscription. */
export const PROGRAM_PRICE_ID =
  process.env.NEXT_PUBLIC_PADDLE_PROGRAM_PRICE_ID?.trim() || 'pri_01m6v3kbz7jbtpvnxjnjbvbybr';

/** Program price as shown on /leadership (null = Indonesian application flow). */
export interface ProgramCheckout {
  priceLabel: string | null; // e.g. "$29"
  intervalLabel: string | null; // e.g. "/month"
  currency: string | null; // ISO code from Paddle, e.g. "USD"
  yearlyCost: number | null; // price × billing periods per year, for the ROI calculator
}

/** The capstone opens this many days after subscribing. */
export const CAPSTONE_UNLOCK_DAYS = 90;

export const BUSINESS_CATEGORIES = [
  { value: 'food_beverage', label: 'Food & beverage', keywords: ['food', 'beverage', 'restaurant', 'cafe', 'coffee', 'culinary', 'catering', 'fnb', 'f&b', 'kuliner'] },
  { value: 'retail_ecommerce', label: 'Retail & e-commerce', keywords: ['retail', 'ecommerce', 'e-commerce', 'shop', 'store', 'marketplace', 'dropship', 'online store'] },
  { value: 'fashion_beauty', label: 'Fashion & beauty', keywords: ['fashion', 'apparel', 'clothing', 'beauty', 'cosmetics', 'skincare', 'salon'] },
  { value: 'technology', label: 'Technology & software', keywords: ['tech', 'technology', 'software', 'saas', 'app', 'startup', 'ai', 'digital', 'it'] },
  { value: 'professional_services', label: 'Professional services & consulting', keywords: ['consulting', 'agency', 'services', 'accounting', 'legal', 'marketing agency', 'freelance'] },
  { value: 'creative_media', label: 'Creative, media & marketing', keywords: ['creative', 'media', 'design', 'content', 'marketing', 'photography', 'video', 'branding'] },
  { value: 'education', label: 'Education & training', keywords: ['education', 'training', 'course', 'tutoring', 'school', 'edtech', 'coaching'] },
  { value: 'health_wellness', label: 'Health & wellness', keywords: ['health', 'wellness', 'fitness', 'clinic', 'medical', 'healthcare', 'pharmacy'] },
  { value: 'manufacturing', label: 'Manufacturing & production', keywords: ['manufacturing', 'production', 'factory', 'industrial', 'craft', 'handmade'] },
  { value: 'agriculture', label: 'Agriculture & fisheries', keywords: ['agriculture', 'farming', 'agritech', 'fisheries', 'plantation', 'livestock'] },
  { value: 'hospitality_tourism', label: 'Hospitality & tourism', keywords: ['hospitality', 'tourism', 'travel', 'hotel', 'homestay', 'events'] },
  { value: 'logistics', label: 'Logistics & transport', keywords: ['logistics', 'transport', 'delivery', 'shipping', 'supply chain', 'courier'] },
  { value: 'finance', label: 'Finance & fintech', keywords: ['finance', 'fintech', 'payments', 'insurance', 'lending', 'investment'] },
  { value: 'property_construction', label: 'Property & construction', keywords: ['property', 'real estate', 'construction', 'architecture', 'interior'] },
  { value: 'social_enterprise', label: 'Social enterprise & non-profit', keywords: ['social enterprise', 'nonprofit', 'non-profit', 'ngo', 'impact', 'sustainability'] },
  { value: 'other', label: 'Other', keywords: [] },
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number]['value'];
export const CATEGORY_VALUES = BUSINESS_CATEGORIES.map((c) => c.value) as string[];

export const CATALOG_TYPES = [
  { value: 'networking_event', label: 'Networking event' },
  { value: 'investor_event', label: 'Investor / pitching event' },
  { value: 'course', label: 'Free certified course' },
  { value: 'community', label: 'Community (Telegram / Discord / WhatsApp)' },
  { value: 'other', label: 'Other' },
] as const;
export type CatalogType = (typeof CATALOG_TYPES)[number]['value'];
export const CATALOG_TYPE_VALUES = CATALOG_TYPES.map((t) => t.value) as string[];

export const BUSINESS_STAGES = [
  { value: 'idea', label: 'Idea / pre-launch' },
  { value: 'early', label: 'Early (first customers, < 1 year)' },
  { value: 'growing', label: 'Growing (1–3 years, steady revenue)' },
  { value: 'established', label: 'Established (3+ years)' },
] as const;

export const TEAM_SIZES = ['Just me', '2–5', '6–15', '16–50', '50+'] as const;
export const REVENUE_RANGES = [
  'Pre-revenue',
  '< $1k / month',
  '$1k – $5k / month',
  '$5k – $20k / month',
  '$20k – $100k / month',
  '> $100k / month',
  'Prefer not to say',
] as const;
export const FUNDING_OPTIONS = [
  { value: 'no', label: 'Not looking for funding' },
  { value: 'maybe', label: 'Open to it later' },
  { value: 'yes', label: 'Actively looking for investors' },
] as const;
export const EVENT_FORMATS = [
  { value: 'both', label: 'Online and in person' },
  { value: 'online', label: 'Online only' },
  { value: 'offline', label: 'In person only' },
] as const;

export interface ProgramProfile {
  business_name?: string;
  business_category?: string;
  sub_industry?: string;
  description?: string;
  stage?: string;
  years_operating?: string;
  team_size?: string;
  monthly_revenue?: string;
  target_customers?: string;
  growth_goals?: string;
  growth_metric?: string;
  challenges?: string;
  skills_to_learn?: string;
  opportunities?: string[];   // catalog types they want
  funding?: string;
  event_format?: string;
  city?: string;
  country?: string;
  website?: string;
  whatsapp?: string;
  language?: 'en' | 'id';
}

/** Fields required before the profile counts as complete. */
export const REQUIRED_PROFILE_FIELDS: (keyof ProgramProfile)[] = [
  'business_name',
  'business_category',
  'description',
  'stage',
  'team_size',
  'growth_goals',
  'challenges',
  'country',
];

export function isProfileComplete(p: ProgramProfile | null | undefined) {
  if (!p) return false;
  return REQUIRED_PROFILE_FIELDS.every((k) => {
    const v = p[k];
    return typeof v === 'string' ? v.trim().length > 0 : !!v;
  });
}

/** Questions answered in the capstone (ids are stored with the answers, keep them stable). */
export const CAPSTONE_QUESTIONS = [
  {
    id: 'lead_vs_manage',
    question: 'In your own words, what is the difference between managing and leading? Give one example from your business.',
    minChars: 150,
  },
  {
    id: 'delegation',
    question: 'Pick one recurring task you delegated (or will delegate). Walk us through how you wrote the instructions/SOP and how you check the result.',
    minChars: 200,
  },
  {
    id: 'conflict',
    question: 'Two team members disagree on how a job should be done and it is delaying work. How do you handle it, step by step?',
    minChars: 150,
  },
  {
    id: 'feedback',
    question: 'How do you give critical feedback to someone who is underperforming without demotivating them? Write what you would actually say.',
    minChars: 150,
  },
  {
    id: 'change_made',
    question: 'What is the most important change you made to your business or team during the program, and what result did it produce (numbers if possible)?',
    minChars: 150,
  },
  {
    id: 'six_month_plan',
    question: 'Your next 6 months: one key metric, its target, and three concrete actions you will take to reach it.',
    minChars: 150,
  },
  {
    id: 'best_resource',
    question: 'Which event, community, course or lesson from the program helped you most, and why?',
    minChars: 80,
  },
] as const;

export const MIN_CERTIFICATES = 1;

export interface CapstoneCertificate {
  name: string;
  issuer: string;
  url: string;
}

export interface CapstoneProject {
  title?: string;
  problem?: string;
  solution?: string;
  outcome?: string;
  link?: string;
}

export const CAPSTONE_STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  claimed: 'Claim requested',
  approved: 'Approved',
  rejected: 'Needs revision',
  fulfilled: 'Claude Cowork granted',
};

/** Statuses in which the participant can still edit the capstone. */
export const CAPSTONE_EDITABLE = ['draft', 'submitted', 'rejected'];

export function capstoneUnlockDate(subscribedAt: string) {
  return new Date(new Date(subscribedAt).getTime() + CAPSTONE_UNLOCK_DAYS * 86_400_000);
}

export function isCapstoneUnlocked(p: { subscribed_at: string; capstone_unlocked?: boolean | null }) {
  return !!p.capstone_unlocked || capstoneUnlockDate(p.subscribed_at).getTime() <= Date.now();
}
