/**
 * Best Practice: Only apply isHtmlOrScriptFree to plain-text fields (Title, Category).
 * For Rich Text fields, sanitize using a library like DOMPurify on submit.
 */

/**
 * XSS / HTML Script Guard (Enhanced)
 * Target: Plain-text inputs (Title, Category, Teacher Name).
 * Checks for actual HTML tags, <script>, <iframe>, event attributes (onerror=), and inline JS schemes.
 */
export const isHtmlOrScriptFree = (val: string): boolean => {
  if (!val) return true;
  const htmlTagPattern =
    /<\/?(script|iframe|style|object|embed|applet|form|input|button|a|div|span|p|h[1-6]|img|svg|body|html|head|link|meta)\b[^>]*>/i;
  const inlineEventPattern = /on\w+\s*=/i;
  const jsSchemePattern = /(javascript|vbscript|data:text\/html):/i;

  return !htmlTagPattern.test(val) && !inlineEventPattern.test(val) && !jsSchemePattern.test(val);
};

/**
 * Safe Protocol Guard (Strict URL Schemes)
 * Only permits http:// and https:// protocols. Rejects javascript:, file://, data:.
 */
export const hasSafeProtocol = (url: string): boolean => {
  if (!url || !url.trim()) return true;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * SQL Injection Pattern Guard
 * Blocks SQL keywords combined with execution syntax.
 */
export const isSqlInjectionFree = (val: string): boolean => {
  if (!val) return true;
  const sqlPattern =
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)\b)|(--|\/\*|\*\/|;\s*$)/i;
  return !sqlPattern.test(val);
};

/**
 * Path Traversal Guard
 * Prevents directory traversal attacks (../, ..\, %2e%2e/).
 */
export const isPathTraversalFree = (val: string): boolean => {
  if (!val) return true;
  const pathTraversalPattern = /(\.\.\/|\.\.\\|%2e%2e)/i;
  return !pathTraversalPattern.test(val);
};

/**
 * Control Character & Null Byte Guard
 * Blocks ASCII control characters (\x00-\x1F, \x7F) and null bytes (\0) that corrupt databases.
 */
export const hasNoControlCharacters = (val: string): boolean => {
  if (!val) return true;
  // eslint-disable-next-line no-control-regex
  return !/[\x00-\x1F\x7F-\x9F]/.test(val);
};

/**
 * Zero-Width & Invisible Character Guard
 * Detects invisible unicode characters (\u200B, \u200C, \uFEFF) used for spoofing or filter evasion.
 */
export const hasNoInvisibleChars = (val: string): boolean => {
  if (!val) return true;
  const invisiblePattern = /[\u200B-\u200D\uFEFF\u00A0]/;
  return !invisiblePattern.test(val);
};

/**
 * Whitespace-Only Payload Guard
 * Rejects strings strictly of spaces, tabs, or newlines without real content.
 */
export const isNotOnlyWhitespace = (val: string): boolean => {
  if (!val) return true;
  return val.trim().length > 0;
};

/**
 * Safe Numeric Range & Finite Guard
 * Prevents NaN, Infinity, -Infinity, or float overflow attacks.
 */
export const isSafeFiniteNumber = (val: unknown): boolean => {
  if (val === null || val === undefined || val === '') return true;
  const num = Number(val);
  return Number.isFinite(num) && !Number.isNaN(num);
};

/**
 * Image / Media Extension Safety Guard
 * Ensures image URLs end in safe extensions (.jpg, .jpeg, .png, .webp, .svg).
 */
export const hasSafeMediaExtension = (url: string): boolean => {
  if (!url) return true;
  const safeExtPattern = /\.(jpg|jpeg|png|webp|svg)(\?.*)?$/i;
  return safeExtPattern.test(url.trim());
};

/**
 * ReDoS / Excessive Length Payload Guard
 */
export const isSafePayloadLength = (val: string, maxLength = 2000): boolean => {
  if (!val) return true;
  return val.length <= maxLength;
};
