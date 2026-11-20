// Official InstructJet social profiles. Used in the footer, contact/about pages
// and the Organization JSON-LD (sameAs) in the root layout.
export const SOCIAL_LINKS = [
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/instructjet' },
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/instructjet' },
  { key: 'discord', label: 'Discord', href: 'https://discord.gg/R2Ktk5rfdq' },
] as const;

export type SocialKey = (typeof SOCIAL_LINKS)[number]['key'];
