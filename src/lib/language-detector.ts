import { TLD_LANGUAGE_MAP, DEFAULT_LANGUAGE, SupportedLanguage } from '@/config/tld-language';

/**
 * Extracts TLD from email or domain and returns the corresponding language
 * @param emailOrDomain - e.g., "john@company.mx" or "company.mx"
 * @returns SupportedLanguage
 */
export function detectLanguageFromDomain(emailOrDomain: string): SupportedLanguage {
  if (!emailOrDomain) return DEFAULT_LANGUAGE;

  // Extract domain from email if needed
  let domain = emailOrDomain;
  if (emailOrDomain.includes('@')) {
    domain = emailOrDomain.split('@')[1];
  }

  // Extract TLD (last part after the final dot)
  const parts = domain.toLowerCase().split('.');
  const tld = parts[parts.length - 1];

  // Look up in mapping
  return TLD_LANGUAGE_MAP[tld] || DEFAULT_LANGUAGE;
}

/**
 * Get language from VIP data (email or domain)
 */
export function getLanguageFromVipData(vipData: { email?: string; companyName?: string } | null): SupportedLanguage {
  if (!vipData) return DEFAULT_LANGUAGE;

  // Try email first
  if (vipData.email) {
    return detectLanguageFromDomain(vipData.email);
  }

  return DEFAULT_LANGUAGE;
}
