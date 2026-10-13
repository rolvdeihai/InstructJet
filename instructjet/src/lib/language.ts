// src/lib/language.ts
//
// Site language preference. The site is authored in English and translated
// in the browser by Google's free website translator (see SiteTranslator),
// which is driven by the `googtrans` cookie. The real URL stays in the
// address bar and the session cookie keeps working, unlike the
// *.translate.goog proxy.

export const DEFAULT_LANGUAGE = 'en';

export const LANGUAGES: { code: string; name: string; native: string }[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', native: 'Filipino' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', native: '繁體中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
];

// ISO 3166 country → language. Countries not listed (including those where
// English is the main business language, e.g. US, GB, SG, IN, AU) get English.
const COUNTRY_LANGUAGE: Record<string, string> = {
  ID: 'id',
  MY: 'ms', BN: 'ms',
  TH: 'th',
  VN: 'vi',
  CN: 'zh-CN',
  TW: 'zh-TW', HK: 'zh-TW', MO: 'zh-TW',
  JP: 'ja',
  KR: 'ko',
  BD: 'bn',
  PK: 'ur',
  SA: 'ar', AE: 'ar', EG: 'ar', QA: 'ar', KW: 'ar', BH: 'ar', OM: 'ar', JO: 'ar',
  LB: 'ar', IQ: 'ar', MA: 'ar', DZ: 'ar', TN: 'ar', LY: 'ar', YE: 'ar', SY: 'ar',
  TR: 'tr',
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
  UA: 'uk',
  PL: 'pl',
  DE: 'de', AT: 'de', LI: 'de',
  FR: 'fr', LU: 'fr', MC: 'fr', SN: 'fr', CI: 'fr', CM: 'fr',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es',
  GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es', SV: 'es', NI: 'es',
  CR: 'es', PA: 'es', UY: 'es',
  BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt',
  IT: 'it', SM: 'it',
  NL: 'nl', SR: 'nl',
};

const PREF_COOKIE = 'ij_lang';
const ONE_YEAR = 60 * 60 * 24 * 365;

export function isSupportedLanguage(code: string | null | undefined): code is string {
  return !!code && LANGUAGES.some(l => l.code === code);
}

export function languageForCountry(country: string | null | undefined): string {
  return (country && COUNTRY_LANGUAGE[country.toUpperCase()]) || DEFAULT_LANGUAGE;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** The saved preference, or null if the user never picked / was never detected. */
export function getSavedLanguage(): string | null {
  const saved = readCookie(PREF_COOKIE);
  return isSupportedLanguage(saved) ? saved : null;
}

export function getCurrentLanguage(): string {
  return getSavedLanguage() || DEFAULT_LANGUAGE;
}

// Google's translator reads `googtrans` from both the host and the parent
// domain, so it has to be written (and cleared) on both.
function cookieDomains(): (string | null)[] {
  const host = window.location.hostname;
  const parts = host.split('.');
  const isIp = /^[\d.]+$/.test(host);
  if (isIp || parts.length < 2) return [null];
  const root = parts.slice(-2).join('.');
  return [null, host, `.${root}`];
}

function writeGoogTrans(lang: string) {
  for (const domain of cookieDomains()) {
    const domainAttr = domain ? `; domain=${domain}` : '';
    if (lang === DEFAULT_LANGUAGE) {
      document.cookie = `googtrans=; path=/; max-age=0${domainAttr}`;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/; max-age=${ONE_YEAR}${domainAttr}`;
    }
  }
}

/** Saves the preference. Callers reload the page to apply it. */
export function setLanguage(lang: string) {
  if (!isSupportedLanguage(lang)) return;
  document.cookie = `${PREF_COOKIE}=${encodeURIComponent(lang)}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  writeGoogTrans(lang);
}

/** Keeps the translator cookie in step with the saved preference. */
export function syncTranslatorCookie() {
  const saved = getSavedLanguage();
  if (!saved) return;
  const expected = saved === DEFAULT_LANGUAGE ? null : `/en/${saved}`;
  if (readCookie('googtrans') !== expected) writeGoogTrans(saved);
}

/**
 * Looks up the visitor's country from their IP (client side, free endpoints
 * that need no API key), falling back to the browser's language.
 */
export async function detectLanguage(): Promise<{ language: string; country: string | null }> {
  const lookups: [string, (data: any) => string | undefined][] = [
    ['https://get.geojs.io/v1/ip/country.json', d => d?.country],
    ['https://ipinfo.io/json', d => d?.country],
  ];
  for (const [url, pick] of lookups) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) continue;
      const country = pick(await res.json());
      if (country) return { language: languageForCountry(country), country };
    } catch {
      // try the next provider
    }
  }

  const browserLang = typeof navigator !== 'undefined' ? navigator.language : '';
  const exact = LANGUAGES.find(l => l.code.toLowerCase() === browserLang.toLowerCase());
  const base = LANGUAGES.find(l => l.code === browserLang.split('-')[0]);
  return { language: exact?.code || base?.code || DEFAULT_LANGUAGE, country: null };
}

/** Google Translate proxy link for a page, for when the in-page translator is blocked. */
export function translateProxyUrl(lang: string, href: string): string {
  const url = new URL(href);
  const host = url.hostname.replace(/-/g, '--').replace(/\./g, '-');
  const proxied = new URL(`${url.pathname}${url.search}`, `https://${host}.translate.goog`);
  proxied.searchParams.set('_x_tr_sl', 'auto');
  proxied.searchParams.set('_x_tr_tl', lang);
  proxied.searchParams.set('_x_tr_hl', 'en');
  proxied.searchParams.set('_x_tr_pto', 'wapp');
  return proxied.toString();
}
