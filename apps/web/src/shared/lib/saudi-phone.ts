/**
 * Normalizes user-entered Saudi mobile numbers to E.164 (+966…) so they pass
 * `@IsPhoneNumber('SA')` on the API (matches seed data like `+966500000001`).
 */
export function normalizeSaudiMobileToE164(raw: string): string {
  const s = raw.replace(/\s/g, '').trim();
  if (!s) return s;
  if (s.startsWith('+966')) return s;
  if (s.startsWith('966') && s.length >= 12) return `+${s}`;
  // National mobile: 05XXXXXXXX (10 digits)
  if (/^05\d{8}$/.test(s)) return `+966${s.slice(1)}`;
  // Already 9 digits starting with 5 (mobile without leading 0)
  if (/^5\d{8}$/.test(s)) return `+966${s}`;
  return s;
}
